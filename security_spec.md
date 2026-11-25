# Security Specification – BIOSFERA Consultoria Ambiental

## 1. Data Invariants
1. **Public vs. PII Isolation**: Public visitors may read `siteSettings`, `services`, `projects`, `gallery`, `partners`, `media`, and published `news` (`published == true`). Public visitors may NEVER read (`get` or `list`) `proposals`, `contacts`, or `admins`, which contain PII (`email`, `phone`, `contactName`).
2. **Public Lead Submission Integrity**: Public visitors may create documents in `proposals` and `contacts` ONLY with `status == 'novo'`, exact allowed keys, strict string bounds, valid email format, and server timestamps (`createdAt == request.time`, `updatedAt == request.time`). They cannot inject `adminNotes` or pre-approve statuses.
3. **Admin-Only Content Management**: Only verified administrators (`isBootstrappedAdmin()` or `/admins/{uid}` with `email_verified == true`) may create, update, or delete `siteSettings`, `services`, `projects`, `gallery`, `news`, `partners`, `media`, and `admins`, or update/delete `proposals` and `contacts`.
4. **Path Variable & Payload Size Hardening**: Every single-document operation enforces `isValidId(docId)` (`^[a-zA-Z0-9_-]+$`, `<= 128` chars) and bounded string/array lengths.
5. **Immutable Audit Fields**: `createdAt` is immutable on all updates (`incoming().createdAt == existing().createdAt`) and `updatedAt` must equal `request.time`.
6. **Newsletter PII Isolation & Topic Bounds**: Public visitors may create `/newsletterSubscribers` ONLY with `status == 'ativo'`, valid email (`<= 140` chars), bounded `topics` list (`1..3` allowed values), and server timestamps; public `get` and `list` on `/newsletterSubscribers` are strictly denied (admin-only).
7. **Testimonials Comment Integrity (Zero PII)**: Public visitors may create `/testimonials` without PII fields, bounded comment (`8..1500` chars), rating `1..5`, `published == true`, and server timestamps. Only admins may moderate (`published` toggle) or delete testimonials.

## 2. The "Dirty Dozen" Adversarial Payloads (Expected: PERMISSION_DENIED)
1. **Unauthenticated Admin Write**: Anonymous client attempts `setDoc(/siteSettings/main, ...)` -> Denied.
2. **Unverified Admin Email Spoof**: User token with matching email but `email_verified: false` attempts to read `/proposals` -> Denied.
3. **PII Blanket Read on Proposals**: Authenticated non-admin user calls `getDocs(/proposals)` -> Denied.
4. **PII Blanket Read on Contacts**: Authenticated non-admin user calls `getDoc(/contacts/c1)` -> Denied.
5. **Proposal Shadow Field Injection**: Public visitor submits proposal with extra key `isApproved: true` or `adminNotes: "Approved"` -> Denied (`hasOnly` check).
6. **Proposal Status Shortcutting**: Public visitor submits proposal with `status: "respondido"` instead of `"novo"` -> Denied.
7. **Timestamp Forgery**: Public visitor submits proposal with backdated `createdAt` instead of `serverTimestamp()` -> Denied (`createdAt == request.time`).
8. **ID Poisoning**: Attacker targets `/proposals/` with a 500-char ID or invalid characters (`../admin`) -> Denied (`isValidId`).
9. **Resource Exhaustion (1MB String)**: Attacker sends 50,000-char `description` in `/contacts` -> Denied (`<= 3000`).
10. **Self-Assigned Admin Escalation**: Non-admin authenticated user creates `/admins/{ownUid}` with `role: "admin"` -> Denied.
11. **Unpublished News Leak**: Public visitor queries unpublished draft article (`published: false`) -> Denied.
12. **Array Type Poisoning**: Admin payload attempts `objectives: [123]` instead of strings -> Denied (`objectives[0] is string`).
13. **PII Blanket Read on Newsletter Subscribers**: Public or non-admin authenticated user calls `getDocs(/newsletterSubscribers)` -> Denied.
14. **Testimonial Rating / Comment Poisoning**: Public visitor submits `rating: 99` or empty/oversized comment or `published: false` -> Denied.
