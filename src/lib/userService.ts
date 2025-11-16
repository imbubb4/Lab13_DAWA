// lib/userService.ts
import bcrypt from 'bcryptjs';

// Base de datos simulada en memoria
const users: any[] = [];
const FAILED_LOGIN_ATTEMPTS: Record<string, number> = {};

const MAX_ATTEMPTS = 3; // Límite de intentos fallidos
const BLOCK_DURATION = 60 * 1000; // 1 minuto en milisegundos (60 segundos * 1000)

// --- Funciones de Simulación de DB ---

// 1. Registro de usuario (sin cambios)
export async function registerUser(name: string, email: string, passwordPlain: string) {
  if (users.find(u => u.email === email)) {
    throw new Error('User with this email already exists.');
  }

  const hashedPassword = await bcrypt.hash(passwordPlain, 10);

  const newUser = {
    id: (users.length + 1).toString(),
    name,
    email,
    password: hashedPassword,
    role: 'user',
  };

  users.push(newUser);
  return newUser;
}

// 2. Buscar usuario por email (sin cambios)
export async function findUserByEmail(email: string) {
  return users.find(u => u.email === email);
}

// 3. Verificar credenciales y manejar bloqueo de intentos (Lógica actualizada)
export async function verifyCredentials(email: string, passwordPlain: string) {
  // Manejar bloqueo de intentos (Requerimiento 1. Bloquear inicio de sesión)
  if (FAILED_LOGIN_ATTEMPTS[email] && FAILED_LOGIN_ATTEMPTS[email] >= MAX_ATTEMPTS) {
    throw new Error('Account locked due to too many failed login attempts. Try again later.');
  }

  const user = await findUserByEmail(email);

  if (!user || !(await bcrypt.compare(passwordPlain, user.password))) {
    // Aumentar contador de fallos
    FAILED_LOGIN_ATTEMPTS[email] = (FAILED_LOGIN_ATTEMPTS[email] || 0) + 1;
    
    // Si alcanzó el máximo, establecer el temporizador de reinicio
    if (FAILED_LOGIN_ATTEMPTS[email] >= MAX_ATTEMPTS) {
        setTimeout(() => {
            delete FAILED_LOGIN_ATTEMPTS[email];
            console.log(`[AUTH] Resetting login attempts for: ${email}`);
        }, BLOCK_DURATION);
    }
    
    return null;
  }

  // Inicio de sesión exitoso: reiniciar contador de fallos
  delete FAILED_LOGIN_ATTEMPTS[email];
  
  // Retornar el objeto de usuario (sin la contraseña)
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}