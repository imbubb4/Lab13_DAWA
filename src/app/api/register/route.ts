import { NextResponse } from "next/server";
import { createUser } from "@/lib/userStore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Nombre, email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    await createUser(name, email, password);

    return NextResponse.json({ message: "Usuario registrado correctamente" }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { message: err.message || "Error al registrar usuario" },
      { status: 400 }
    );
  }
}
