# Data Protection & Privacy Architecture (PRIVACY.md)
*Aligned with the Digital Personal Data Protection Act, 2023 (DPDP Act) of India*

## 1. Overview
SellAnyBus.in operates as a managed verified marketplace for commercial passenger vehicles. We collect, process, and retain digital personal and vehicular data under strict principles of purpose limitation, data minimization, and role-based access control (RBAC).

---

## 2. Protected Data Categories & Redaction Rules

| Data Element | Visibility | Storage & Encryption | Retention Period |
|---|---|---|---|
| **Seller Mobile Number** | Mediated only; never exposed on public pages or APIs | Encrypted in PostgreSQL | Duration of account + 180 days post-deletion |
| **Buyer Mobile Number** | Masked in seller dashboard (e.g. `98765*****`); visible to assigned sales advisor | Plaintext for communications | 2 years or until consent withdrawal |
| **Chassis / Engine Numbers** | Publicly masked; physical stamps verified by inspector | Encrypted at rest using AES-256-GCM (`APP_ENCRYPTION_KEY`) | Retained with vehicle audit record |
| **Vehicle Documents (RC, Owner ID, Permit)** | Strictly private; accessible only by authorized staff via time-limited signed URLs (≤ 5 min) | Private storage bucket (`storage/private_documents`) | 5 years post-sale for legal and tax audit |
| **Aadhaar / Identity Proof** | Private bucket only; never accessible via public URLs | Private storage bucket | Redacted/purged post-transaction confirmation |

---

## 3. Consent Management
- **Explicit Consent:** Every buyer and seller explicitly provides versioned consent (`consentVersion: "1.0"`, `consentAt: DateTime`) prior to account activation or enquiry submission.
- **Purpose Limitation:** Contact details are strictly used for vehicle enquiry follow-ups, inspection scheduling, and price approvals. No sale of user data to third-party telemarketers.

---

## 4. Rights of Data Principals (DPDP Act Compliance)
1. **Right to Access & Export:** Users may request a JSON export of their personal data and submitted vehicle records by emailing `grievance@sellanybus.in`.
2. **Right to Correction:** Users may update incorrect personal details or vehicle records via their dashboard or by raising a ticket with our compliance desk.
3. **Right to Erasure / Account Deletion:**
   - Users may request account deletion via `/api/v1/me/delete-account` or via email.
   - Upon confirmation, user status is transitioned to `DELETED`, private documents are deleted from storage, and personal phone/email are anonymized, subject to statutory motor-vehicle tax and fraud prevention retention requirements.

---

## 5. Designated Grievance Officer
- **Name:** Priyadarshan Mohanty, Lead Compliance & Legal Officer
- **Email:** `grievance@sellanybus.in`
- **Phone:** `+91 98765 43219`
- **Address:** Infocity Commercial Hub, Patia, Bhubaneswar, Odisha 751024
- **Acknowledgment:** Within 24 hours of complaint receipt.
- **Resolution Timeline:** Within 15 business days in accordance with the DPDP rules.
