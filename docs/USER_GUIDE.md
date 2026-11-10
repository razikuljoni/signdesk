# SignDesk User Guide

A complete walkthrough of the SignDesk platform for document senders, recipients, and workspace administrators.

---

## 1. Getting Started

### 1.1 Authentication & Profile
1. Navigate to `/signin` and sign in with your corporate email (`demo@signdesk.bd` / `SignDesk2026!`).
2. Go to **Settings > Profile** (`/settings/profile`) to configure:
   - Full Legal Name
   - Default Timezone (`Asia/Dhaka`)
   - Saved Personal Signature (Draw using touchpad/mouse, Type in Caveat cursive, or Upload PNG).

---

## 2. Sender Workflow: Creating & Preparing an Envelope

### 2.1 Upload Document
1. Click **New Envelope** or navigate to `/envelopes/new`.
2. Drag and drop any multi-page PDF (up to 25 MB).
3. The platform computes a client-side SHA-256 genesis hash before uploading.
4. Or select one of the **1-Click Bangladesh Presets** (Commercial NDA, Services Agreement, Employment Letter).

### 2.2 The 3-Zone Field Editor (`/envelopes/[id]/prepare`)

```text
┌─────────────────┬─────────────────────────────────┬───────────────────┐
│  FIELD PALETTE  │         DOCUMENT CANVAS         │  RECIPIENTS &     │
│                 │                                 │  SIGNING ORDER    │
│ [Signature]     │  MUTUAL NON-DISCLOSURE          │                   │
│ [Initials]      │  AGREEMENT                      │ [1] Rahim (Active)│
│ [Date Signed]   │                                 │ [2] Karim (Gated) │
│ [Text] [Name]   │  ┌───────────────────────────┐  │                   │
│ [Email]         │  │ Signature: [ Rahim ]      │  │ Expiry: 14 Days   │
│ [Company]       │  └───────────────────────────┘  │ Auto-Save: Active │
│ [Checkbox]      │  Zoom: [ - 100% + ] [Fit Width] │                   │
└─────────────────┴─────────────────────────────────┴───────────────────┘
```

1. **Left Palette:** Click or drag any of the 9 field chips:
   - `Signature` & `Initials`
   - `Date Signed` (auto-filled on execution)
   - `Full Name`, `Email`, `Company`, `Job Title`
   - `Free Text` & `Checkbox`
2. **Center Canvas:**
   - Click to place on any page. Drag to move; use corner handles to resize.
   - Use Zoom controls (`50%` to `200%`) or `Fit Width`.
   - Press `Ctrl/Cmd + Z` to undo; `Esc` to deselect.
3. **Right Rail:**
   - Add recipients (Name, Email, Role).
   - Toggle **Sequential Routing**: Recipient 2 cannot view or sign until Recipient 1 has executed.
   - Color-coding tags fields according to the assigned signer.
   - Click **Send Envelope** to dispatch.

---

## 3. Signer Workflow: No-Account Execution

Signers do **not** need to register or create a password.

1. **Email Invitation:** The signer receives an email with a 256-bit single-use magic link.
2. **Signer Landing (`/sign/[token]`):** Displays sender identity, document title, and execution validity date.
3. **Review & AI Clause Summary (`/sign/[token]/review`):**
   - Read the full contract in the embedded high-resolution viewer.
   - Read the plain-language Gemini AI summary card explaining key liabilities, termination notice, and governing law.
   - Check the required statutory disclosure checkbox under ICT Act 2006.
4. **Guided Signing Canvas (`/sign/[token]/sign`):**
   - Click **Next Field** to navigate sequentially to fillable blocks.
   - Click signature field to open the signature modal:
     - **Draw:** Variable-width Bézier curves with high-DPI scaling.
     - **Type:** Rendered in Caveat cursive script.
     - **Upload:** Select transparent PNG image.
   - Click **Sign & Finish** to record final intent.
5. **Execution Receipt (`/sign/[token]/done`):**
   - Displays the red wax seal attestation.
   - Displays the exact SHA-256 fingerprint.
   - Signer downloads the completed PDF with Certificate of Completion.

---

## 4. Contract Templates

Save time on repeatable contracts without repositioning fields each time:

1. Navigate to `/templates`.
2. Choose from the **6 Starter BD SME Templates**:
   - Non-Disclosure Agreement (NDA)
   - Master Services Agreement (MSA)
   - Employment Offer Letter
   - Freelancer Contract
   - Commercial Invoice / Payment Acknowledgement
   - Office Rental Agreement
3. Click **Use Template** (`/templates/[id]/use`):
   - Enter Party 1 and Party 2 names & emails.
   - Click **Send Envelope** — all field geometries and legal parameters apply automatically in one click.

---

## 5. Team & Workspace Administration

1. **Team Access (`/settings/team`):**
   - **Admin:** Full control (invite/remove members, manage branding, API keys, delete workspace).
   - **Sender:** Can create, prepare, send, and void own envelopes.
   - **Viewer:** Read-only access to view completed documents and download audit certificates.
2. **Workspace Branding (`/settings/workspace`):**
   - Upload corporate logo.
   - Select accent theme: strictly constrained to **Deep Pine (`#0C2E29`)** or **Wax Seal Vermilion (`#B3402A`)** to preserve WCAG AAA legibility.
   - Configure default envelope expiry (default 14 days) and reminder interval (default 48 hours).
3. **Subscriptions & Quotas (`/settings/billing`):**
   - Monitor monthly envelope usage (5 free envelopes/month).
   - Monitor daily email dispatch counter (Resend 100/day limit).
