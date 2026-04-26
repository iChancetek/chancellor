export const SUPER_ADMIN_EMAILS = [
  'chancellor@ichancetek.com',
  'Chanceminus@gmail.com'
];

export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return SUPER_ADMIN_EMAILS.includes(email);
}
