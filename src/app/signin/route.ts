import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Redirige /signIn (con mayúscula) a /signin para evitar rutas duplicadas
  const url = new URL(request.url);
  url.pathname = url.pathname.replace('/signIn', '/signin');
  return NextResponse.redirect(url);
}

export async function POST(request: Request) {
  // Soporte por si algún formulario intenta POSTear a /signIn
  const url = new URL(request.url);
  url.pathname = url.pathname.replace('/signIn', '/signin');
  return NextResponse.redirect(url);
}
