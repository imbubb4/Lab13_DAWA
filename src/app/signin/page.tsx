'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [credentialsError, setCredentialsError] = useState('');

  // Lógica de Inicio de Sesión de Credenciales
  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredentialsError('');

    const result = await signIn('credentials', {
      email,
      password,
      callbackUrl: '/dashboard',
      redirect: false,
    });

    if (result?.error) {
      setCredentialsError(result.error);
    } else if (result?.ok) {
      router.push('/dashboard');
    }
  };

  // Lógica de Inicio de Sesión de OAuth (Google/GitHub)
  const handleOAuthSignIn = async (providerId: string) => {
    // Aquí usamos el ID del proveedor (google o github) para el inicio de sesión
    const result = await signIn(providerId, {
      callbackUrl: '/dashboard',
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Sign In
        </h1>

        {/* 1. Formulario de Credenciales (Foco principal con estilo de botón azul) */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          {credentialsError && (
            <p className="text-red-500 text-sm text-center font-medium">
              {credentialsError}
            </p>
          )}
          {/* Estilos de Input unificados con Sign Up */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded"
          />
          {/* Botón Primario Azul (Estilo unificado con Sign Up) */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Sign In with Email
          </button>
        </form>

        {/* 2. Separador visual */}
        <div className="text-center my-6 text-gray-500">
          <hr className="my-2" />
          O continua con
          <hr className="my-2" />
        </div>

        {/* 3. Botones de OAuth (Opciones alternativas) */}
        <div className="space-y-3">
          {/* Botón de GitHub (Estilo de marca) */}
          <button
            onClick={() => handleOAuthSignIn('github')}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGithub />
            GitHub
          </button>
          
          {/* Botón de Google (Estilo de marca) */}
          <button
            onClick={() => handleOAuthSignIn('google')}
            className="w-full bg-white text-gray-800 border border-gray-300 py-2 px-4 rounded hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            <FaGoogle className="text-red-500"/>
            Google
          </button>
        </div>

        {/* 4. Enlace de Registro */}
        <div className="mt-6 text-center text-sm">
          ¿No tienes una cuenta?{' '}
          <Link href="/signup" className="text-blue-600 hover:underline font-semibold">
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}