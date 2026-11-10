# SignDesk API & Webhooks Reference

SignDesk exposes a RESTful v1 API enabling developers to automate document generation, dispatch signing invitations, and subscribe to cryptographic signature events.

---

## 1. Authentication & Security

All API endpoints require authentication via Bearer Token using an API key generated in the Developer Settings portal:

```http
Authorization: Bearer sd_live_7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f
```

- **Live Keys (`sd_live_...`):** Execute live document workflows.
- **Sandbox Keys (`sd_test_...`):** For staging and test environments.
- **Rate Limit:** 100 requests per minute per key. Exceeding limits returns HTTP `429 Too Many Requests`.

---

## 2. Idempotency

All mutating `POST` requests accept an optional `Idempotency-Key` header. Supplying an idempotency key guarantees that accidental retries (e.g., due to network timeouts) will not produce duplicate envelopes.

```http
Idempotency-Key: 7f83b165-ff1f-c53b-92dc-18148a1d65df
```

---

## 3. Endpoints

### 3.1 Create Envelope
Create a new draft envelope or instantiate from an existing template.

```http
POST /v1/envelopes
```

#### Request Headers
| Header | Type | Description |
| :--- | :--- | :--- |
| `Authorization` | `string` | `Bearer sd_live_...` (Required) |
| `Idempotency-Key` | `string` | UUID or random string (Recommended) |
| `Content-Type` | `string` | `application/json` |

#### Request Body
```json
{
  "title": "Mutual Non-Disclosure Agreement — Horizon Logistics",
  "originalPdfUrl": "/samples/bd-standard-nda.pdf",
  "recipients": [
    {
      "name": "Tanvir Ahmed",
      "email": "tanvir@apex-commerce.bd",
      "role": "SIGNER",
      "order": 1
    },
    {
      "name": "Rahim Chowdhury",
      "email": "rahim@horizon-logistics.bd",
      "role": "SIGNER",
      "order": 2
    }
  ]
}
```

#### Response (`201 Created`)
```json
{
  "id": "env_8f3a12bc",
  "title": "Mutual Non-Disclosure Agreement — Horizon Logistics",
  "status": "DRAFT",
  "createdAt": "2026-11-10T14:24:12.000Z",
  "workspaceId": "ws_apex_commerce"
}
```

---

### 3.2 Send Envelope
Dispatches the envelope to designated signers in sequential order.

```http
POST /v1/envelopes/{id}/send
```

#### Request Body
```json
{
  "messageToSigners": "Please review and execute our standard NDA.",
  "expiresDays": 14
}
```

#### Response (`200 OK`)
```json
{
  "id": "env_8f3a12bc",
  "status": "WAITING",
  "sentAt": "2026-11-10T14:25:00.000Z",
  "expiresAt": "2026-11-24T14:25:00.000Z",
  "magicLinks": [
    {
      "recipientId": "rec_1",
      "name": "Tanvir Ahmed",
      "email": "tanvir@apex-commerce.bd",
      "order": 1,
      "status": "NOTIFIED",
      "magicLink": "https://signdesk.bd/sign/demo_token_tanvir"
    }
  ]
}
```

---

### 3.3 Void Envelope
Immediately revokes active signing invitations and renders partial signatures null and void.

```http
POST /v1/envelopes/{id}/void
```

#### Request Body
```json
{
  "reason": "Commercial terms amended in version 2."
}
```

---

### 3.4 Download Executed PDF
Downloads the completed document with flattened signatures and attached Certificate of Completion.

```http
GET /v1/envelopes/{id}/download
```

#### Response (`200 OK`)
- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="document_executed.pdf"`

---

### 3.5 Verify Document Integrity
Re-hashes the stored final PDF bytes and validates the complete Merkle audit chain.

```http
GET /envelopes/{id}/verify
```

#### Response (`200 OK`)
```json
{
  "envelopeId": "env_8f3a12bc",
  "title": "Mutual Non-Disclosure Agreement",
  "status": "COMPLETED",
  "verified": true,
  "finalHash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "calculatedHash": "7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
  "auditChainValid": true,
  "auditEventsCount": 6,
  "legalFramework": "Bangladesh Information and Communication Technology (ICT) Act 2006 (Sec. 7)",
  "message": "Document verified: cryptographic signature and audit trail chain are intact and authentic."
}
```

---

## 4. Webhooks & Event Subscriptions

SignDesk delivers real-time notifications to your webhook endpoints.

### Supported Events
| Event Name | Description |
| :--- | :--- |
| `envelope.sent` | Dispatched when an envelope is sent to the first signer. |
| `envelope.viewed` | Dispatched when a signer opens the signing portal. |
| `envelope.signed` | Dispatched when an individual recipient signs. |
| `envelope.completed` | Dispatched when all parties have signed and final PDF is sealed. |
| `envelope.declined` | Dispatched when a recipient declines with recorded reason. |
| `envelope.expired` | Dispatched when an unexecuted envelope expires. |
| `envelope.voided` | Dispatched when a sender voids the envelope. |

---

### Webhook Signature Verification

Every webhook payload includes the header:
```http
X-SignDesk-Signature: t=1762788000,v1=5d41402abc4b2a76b9719d911017c592b0c3d4f82d1c9e830a7b512c4f82d1c9
```

- `t`: Unix timestamp of the delivery.
- `v1`: HMAC-SHA256 signature generated over `${t}.${rawJsonPayload}` using your webhook secret (`whsec_...`).

> **Security Rule:** Reject any payload where `|now - t| > 300` seconds (5 minutes) to protect against replay attacks.

#### Verification in Node.js
```javascript
import crypto from 'crypto';

function verifySignDeskWebhook(payload, signatureHeader, secret) {
  const parts = signatureHeader.split(',');
  const t = parts.find(p => p.startsWith('t=')).slice(2);
  const v1 = parts.find(p => p.startsWith('v1=')).slice(3);

  // 1. Replay attack check (5-minute tolerance)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(t, 10)) > 300) {
    throw new Error('Webhook timestamp out of tolerance.');
  }

  // 2. Recompute HMAC
  const expected = crypto
    .createHmac('sha256', secret)
    .update(`${t}.${payload}`)
    .digest('hex');

  // 3. Timing-safe comparison
  return crypto.timingSafeEqual(Buffer.from(v1, 'hex'), Buffer.from(expected, 'hex'));
}
```

#### Verification in Python
```python
import hmac
import hashlib
import time

def verify_signdesk_webhook(payload: str, signature_header: str, secret: str) -> bool:
    parts = dict(x.split('=') for x in signature_header.split(','))
    t = int(parts['t'])
    v1 = parts['v1']

    # 1. 5-minute tolerance
    if abs(time.time() - t) > 300:
        return False

    # 2. Recompute HMAC
    signed_payload = f"{t}.{payload}".encode('utf-8')
    expected = hmac.new(secret.encode('utf-8'), signed_payload, hashlib.sha256).hexdigest()

    return hmac.compare_digest(v1, expected)
```
