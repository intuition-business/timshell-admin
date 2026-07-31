"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconUsers,
} from "@tabler/icons-react";
import {
  BicepsFlexed,
  Dumbbell,
  SquareChartGantt,
  ClipboardMinus,
  MessageCircle,
  CreditCard,
  CircleUser,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  // Función que valida si la ruta actual coincide con el enlace
  const isActive = (path: string) => pathname === path;

  const auth = useAuth();
  const role = auth?.role;
  const router = useRouter();

  console.log(role);

  if (!role) return null;

  return (
    <nav className="sticky left-0 top-0 h-screen z-10 max-w-[210px] w-full bg-[#282828] text-white flex flex-col justify-between shadow-lg text-base rounded-r-[30px]">
      {/* Logo */}
      {role == 'admin' ? (
        <div>
          <div className="px-0 py-0 mt-8 flex justify-center">
            <img className="max-w-[120px]" src="/logo.png" alt="Logo" />
          </div>

          {/* Menú de navegación */}
          <div className="mt-8 flex flex-col gap-5 px-5">
            <Link href="/" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <IconHome size={18} />
                Inicio
              </div>
            </Link>

            <Link href="/users" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/users")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <IconUsers size={18} />
                Usuarios
              </div>
            </Link>

            <Link href="/trainer" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/trainer")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <BicepsFlexed size={18} />
                Entrenador
              </div>
            </Link>

            <Link href="/exercise" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/exercises")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <Dumbbell size={18} />
                Ejercicios
              </div>
            </Link>

            <Link href="/plan" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/plan")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <SquareChartGantt size={18} />
                Planes
              </div>
            </Link>

            <Link href="/chat" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/chat")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <MessageCircle size={18} />
                Chats
              </div>
            </Link>

            <Link href="/pagos" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/pagos")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <CreditCard size={18} />
                Pagos
              </div>
            </Link>
          </div>
        </div>
      ) : (
        <div>
          <div className="px-0 py-0 mt-8 flex justify-center">
            <img className="max-w-[120px]" src="/logo.png" alt="Logo" />
          </div>

          {/* Menú de navegación */}
          <div className="mt-8 flex flex-col gap-5 px-5">
            <Link href="/users" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/users")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <IconUsers size={18} />
                Usuarios
              </div>
            </Link>

            <Link href="/chat" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/chat")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <MessageCircle size={18} />
                Chats
              </div>
            </Link>

            <Link href="/perfil" passHref>
              <div
                className={`flex items-center gap-2 font-semibold transition-colors ${isActive("/perfil")
                  ? "text-lime-400"
                  : "text-gray-300 hover:text-lime-400"
                  }`}
              >
                <CircleUser size={18} />
                Mi perfil
              </div>
            </Link>
          </div>
        </div>
      )}


      {/* Footer */}
      <footer className="px-6 py-4 text-xs text-gray-400 border-t border-gray-700 flex flex-col gap-3">
        <button
          onClick={() => {
            const currentRole = auth?.role;
            auth?.logout?.();
            router.push(currentRole === "admin" ? "/admin" : "/login");
          }}
          className="w-full text-left font-bold text-red-400 hover:text-red-300 transition-colors"
        >
          Cerrar sesión
        </button>
        © 2026 Timshell
        <br />
        Desarrollado por Intuition Business
      </footer>
    </nav>
  );
}
