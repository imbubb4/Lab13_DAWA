// app/api/register/route.ts

import { registerUser } from '@/lib/userService';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: 'Missing fields' }), { status: 400 });
    }

    // Llama a la lógica de registro (que usa bcrypt)
    await registerUser(name, email, password);

    return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ message: error.message || 'Internal server error' }), { status: 500 });
  }
}