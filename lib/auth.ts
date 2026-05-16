import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!;
const SESSION_SECRET = process.env.SESSION_SECRET!;

export function checkAdminAuth(): boolean {
  const cookieStore = cookies();
  const session = cookieStore.get('admin_session');
  return session?.value === SESSION_SECRET;
}

export function validatePassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}
