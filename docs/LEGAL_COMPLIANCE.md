# Legal Admissibility & Regulatory Compliance Guide
### Bangladesh Information and Communication Technology (ICT) Act 2006 & Contract Act 1872

---

## 1. Executive Summary

SignDesk implements **Simple Electronic Signatures (SES)** backed by cryptographic attribution, IP/user-agent logging, atomic UTC timestamps, and SHA-256 recursive Merkle audit chaining. 

Under the laws of Bangladesh, electronic signatures executed via SignDesk possess binding legal validity for the vast majority of commercial B2B, employment, and service transactions.

---

## 2. Statutory Legal Foundation

### 2.1 Information and Communication Technology (ICT) Act 2006 (Act No. 39 of 2006)

- **Section 5 (Legal Recognition of Electronic Records):**  
  Where any law provides that information or any other matter shall be in writing, typewritten, or in printed form, then such requirement is legally satisfied if the information is accessible in electronic form and usable for subsequent reference.
- **Section 7 (Legal Recognition of Electronic Signatures):**  
  Where any law requires that any information or record shall be authenticated by affixing a signature, that requirement is satisfied if authenticated by an electronic signature affixed in such manner as prescribed.
- **Section 16 (Attribution of Electronic Records):**  
  An electronic record is attributed to the originator if it was sent by the originator himself, or by an information system programmed by or on behalf of the originator to operate automatically.

### 2.2 The Contract Act 1872

Under Section 10 of the Contract Act 1872, an agreement is a valid contract if it is made by:
1. Free consent of parties competent to contract;
2. For lawful consideration;
3. With a lawful object; and
4. Not expressly declared to be void.

The Act does not mandate handwritten physical ink signatures on paper; offer, counter-offer, and acceptance delivered electronically establish valid contract formation upon consensus ad idem.

---

## 3. The Evidentiary Standard & Court Admissibility

In judicial proceedings before courts or commercial arbitration tribunals in Bangladesh, electronic evidence must satisfy standards of **authenticity** and **integrity**:

1. **Proof of Document Integrity (No Post-Signing Tampering):**  
   SignDesk computes a 256-bit SHA-256 hash of the final PDF bytes. Any modification of a single character in the executed contract causes a checksum mismatch.
2. **Attribution & Intention (Intent to Sign):**  
   Before affixing a signature, signers must explicitly agree to the statutory electronic disclosure and click the final **"Sign & Finish"** intent button. The button label, exact timestamp, IP address, user-agent, and email verification token are captured.
3. **Certificate of Completion:**  
   The appended Certificate of Completion provides independent computer-generated documentary evidence detailing every step in the transaction history.

---

## 4. Statutory Exclusions: Documents That CANNOT Be Signed Electronically

Under current Bangladesh laws and administrative practice, electronic signatures **cannot** be used for the following categories:

| Excluded Category | Governing Act | Reason for Exclusion |
| :--- | :--- | :--- |
| **Wills & Codicils** | Succession Act 1925 | Strict statutory requirement for physical attestation by two witnesses in the testator's presence. |
| **Powers of Attorney** | Powers of Attorney Act 2012 | Requires physical execution, notarization, and verification before an executive magistrate or notary. |
| **Immovable Property Deeds** | Registration Act 1908 / Transfer of Property Act 1882 | Mandatory biometric in-person appearance before the Sub-Registrar for deed registration. |
| **Trust Deeds & Negotiable Instruments** | Trusts Act 1882 / Negotiable Instruments Act 1881 | Traditional paper and stamp duty requirements apply. |
| **Affidavits & Oaths** | Notaries Ordinance 1961 | Sworn statements require physical appearance before an Affidavit Commissioner or Notary Public. |

---

## 5. Permitted & Recommended Use Cases

SignDesk is legally binding and recommended for:
- Mutual Non-Disclosure Agreements (NDAs)
- Master Services Agreements (MSAs) & Statements of Work (SOWs)
- Employee Offer Letters & Employment Contracts
- Independent Contractor & Freelancer Agreements
- Commercial Vendor Invoices & Payment Acknowledgements
- Commercial Tenancy & Office Leases (under 1 year)
- B2B Software Licenses & Terms of Service

---

## 6. Statutory Disclosure Statement

Every signing journey in SignDesk requires signers to accept the following statutory disclosure before execution:

> *"By checking this box and clicking 'Sign & Finish', I agree to execute this document electronically pursuant to Section 7 of the Bangladesh Information and Communication Technology (ICT) Act 2006. I acknowledge that my electronic signature possesses identical legal validity and enforceability as a handwritten signature."*
