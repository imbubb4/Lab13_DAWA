// middleware.ts

import { default as nextAuthMiddleware } from "next-auth/middleware";

// Función wrapper para cumplir con el requisito de Next.js
export default async function middleware(req: any) {
  return nextAuthMiddleware(req);
}

// Configuración de rutas protegidas
export const config = {
  // Las rutas que serán interceptadas y requieren autenticación
  matcher: ['/dashboard', '/profile'],
};