# Security & Cryptographic Integrity Policy

SignDesk prioritizes data integrity, non-repudiation, and privacy in compliance with the **Bangladesh Information and Communication Technology (ICT) Act 2006**.

---

## 1. Cryptographic Architecture

### 1.1 SHA-256 Merkle Audit Chaining
Every mutating event in an envelope lifecycle (creation, dispatch, consent, field update, signature submission, finalization) is appended to an immutable hash chain:

$$\text{eventHash} = \text{SHA256}(\text{prevHash} \mathbin{\Vert} \text{actor} \mathbin{\Vert} \text{action} \mathbin{\Vert} \text{timestampUtc} \mathbin{\Vert} \text{payload})$$

- Genesis hash is the SHA-256 digest of the original uploaded document.
- Audit rows are append-only; database update or deletion of historical audit rows is blocked.
- Verification endpoint (`/envelopes/:id/verify`) recomputes the chain from genesis to final digest.

### 1.2 Document Flattening & Checksum Matching
1. Signatures and inputs are permanently flattened into the PDF vector layer using `@cantoo/pdf-lib`.
2. A multi-point Certificate of Completion is appended to the document.
3. The resulting byte array is hashed with SHA-256 and saved as `finalHash`.
4. Stored document bytes can be independently verified by any party using command-line tools:
   ```bash
   shasum -a 256 document_executed.pdf
   ```

---

## 2. Token & Secret Management

| Secret Type | Storage Method | Expiry / Scope | Exposure Policy |
| :--- | :--- | :--- | :--- |
| **Signer Magic Token** | SHA-256 Hashed in PostgreSQL | Single-envelope, 14-day expiry | Plaintext token sent only to designated email recipient. |
| **User Password** | Salted SHA-256 / Bcrypt | Perpetual until reset | Never logged or returned in responses. |
| **Secret API Keys** | SHA-256 Hashed (`keyHash`) | Revocable by Workspace Admin | Displayed once at creation (`sd_live_...`). |
| **Webhook Secrets** | SHA-256 Hashed (`secretHash`) | Single-endpoint | Displayed at endpoint creation (`whsec_...`). |

---

## 3. Webhook Security & Replay Prevention

1. **HMAC-SHA256 Signature:** Generated over `timestamp.payload` using endpoint secret.
2. **Replay Tolerance:** Timestamps older than 300 seconds (5 minutes) are rejected automatically.
3. **Timing-Safe Comparison:** Signatures are validated using constant-time buffer comparison (`crypto.timingSafeEqual`) to prevent timing side-channel attacks.

---

## 4. Personal Data Protection & Privacy

- **Data Minimization:** Signer personal data is restricted to name, email address, IP address, and user-agent string required for evidentiary attribution under ICT Act Section 16.
- **No Third-Party Tracking:** Magic-link email invitations contain zero tracking pixels or third-party analytical scripts.
- **Access Control (RBAC):** Workspace members are scoped strictly to their roles (`ADMIN`, `SENDER`, `VIEWER`). Cross-workspace queries return `404 Not Found` to prevent resource enumeration.

---

## 5. Vulnerability Reporting

If you identify a security vulnerability or cryptographic flaw in SignDesk, please contact our security team at `security@signdesk.bd` rather than opening a public issue. We commit to acknowledging receipt within 24 hours and providing remediation updates.
