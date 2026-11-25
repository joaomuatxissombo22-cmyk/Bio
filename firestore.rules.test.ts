/**
 * Security Rule Verification Harness Specification (Dirty Dozen Payloads)
 * Maps each attack vector in security_spec.md to expected PERMISSION_DENIED outcomes.
 */
export const DIRTY_DOZEN_SECURITY_CASES = [
  { id: 1, name: 'Unauthenticated Admin Write', path: '/siteSettings/main', expected: 'PERMISSION_DENIED' },
  { id: 2, name: 'Unverified Admin Email Spoof', path: '/proposals', expected: 'PERMISSION_DENIED' },
  { id: 3, name: 'PII Blanket Read on Proposals', path: '/proposals', expected: 'PERMISSION_DENIED' },
  { id: 4, name: 'PII Blanket Read on Contacts', path: '/contacts/c1', expected: 'PERMISSION_DENIED' },
  { id: 5, name: 'Proposal Shadow Field Injection', path: '/proposals/p1', expected: 'PERMISSION_DENIED' },
  { id: 6, name: 'Proposal Status Shortcutting', path: '/proposals/p1', expected: 'PERMISSION_DENIED' },
  { id: 7, name: 'Timestamp Forgery', path: '/proposals/p1', expected: 'PERMISSION_DENIED' },
  { id: 8, name: 'ID Poisoning (>128 chars)', path: '/proposals/' + 'x'.repeat(200), expected: 'PERMISSION_DENIED' },
  { id: 9, name: 'Resource Exhaustion (1MB String)', path: '/contacts/c1', expected: 'PERMISSION_DENIED' },
  { id: 10, name: 'Self-Assigned Admin Escalation', path: '/admins/attacker', expected: 'PERMISSION_DENIED' },
  { id: 11, name: 'Unpublished News Leak', path: '/news/draft1', expected: 'PERMISSION_DENIED' },
  { id: 12, name: 'Array Type Poisoning', path: '/services/s1', expected: 'PERMISSION_DENIED' },
  { id: 13, name: 'PII Blanket Read on Newsletter Subscribers', path: '/newsletterSubscribers', expected: 'PERMISSION_DENIED' },
  { id: 14, name: 'Testimonial Rating / Comment Poisoning', path: '/testimonials/t1', expected: 'PERMISSION_DENIED' },
];
