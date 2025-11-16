import bcrypt from "bcryptjs";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
};

// “BD” en memoria solo para el laboratorio
const users: User[] = [];

// control de intentos de login
type LoginInfo = {
  failedAttempts: number;
  lockUntil: number | null; // timestamp en ms
};

const loginAttempts: Record<string, LoginInfo> = {};

const MAX_ATTEMPTS = 3;
const LOCK_TIME_MS = 60_000; // 1 minuto

export function findUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

export async function createUser(name: string, email: string, password: string) {
  const existing = findUserByEmail(email);
  if (existing) {
    throw new Error("El correo ya está registrado");
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const newUser: User = {
    id: String(users.length + 1),
    name,
    email,
    passwordHash,
  };

  users.push(newUser);
  return newUser;
}

export function isAccountLocked(email: string): { locked: boolean; remainingMs: number } {
  const info = loginAttempts[email];
  if (!info || !info.lockUntil) return { locked: false, remainingMs: 0 };

  const now = Date.now();
  if (now >= info.lockUntil) {
    // se levantó el bloqueo
    loginAttempts[email] = { failedAttempts: 0, lockUntil: null };
    return { locked: false, remainingMs: 0 };
  }

  return { locked: true, remainingMs: info.lockUntil - now };
}

export function registerFailedLogin(email: string) {
  const info = loginAttempts[email] ?? { failedAttempts: 0, lockUntil: null };
  info.failedAttempts += 1;

  if (info.failedAttempts >= MAX_ATTEMPTS) {
    info.lockUntil = Date.now() + LOCK_TIME_MS;
  }

  loginAttempts[email] = info;
}

export function resetLoginAttempts(email: string) {
  loginAttempts[email] = { failedAttempts: 0, lockUntil: null };
}

export async function verifyPassword(user: User, password: string) {
  return bcrypt.compare(password, user.passwordHash);
}
