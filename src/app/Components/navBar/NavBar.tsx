// src/Components/NavBar.tsx
import { IconHome, IconUsers, IconUserCog, IconClipboardList, IconFileText, IconBell } from "@tabler/icons-react";
import { BicepsFlexed, ClipboardMinus, Dumbbell, SquareChartGantt } from "lucide-react";
import Link from "next/link"; // Asegúrate de usar Link de Next.js para la navegación

export default function NavBar() {
  return (
    <nav className="sticky left-0 top-0 h-screen z-10 max-w-[290px] w-full bg-[#282828] text-white flex flex-col justify-between shadow-lg text-xl rounded-r-[40px]">
      {/* Logo */}
      <div>
        <div className="px-0 py-0 mt-14">
          <img className="max-w-[180px]" src="/logo.png" alt="Logo" />
        </div>

        {/* Menú de navegación */}
        <div className="mt-16 flex flex-col gap-10 px-6">
          <Link href="/" passHref>
            <div className="flex items-center gap-3 text-lime-400 font-bold">
              <IconHome size={28} />
              Inicio
            </div>
          </Link>

          <Link href="/pages/users" passHref>
            <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
              <IconUsers size={28} />
              Usuarios
            </div>
          </Link>

          <Link href="/pages/trainer" passHref>
            <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
              <BicepsFlexed size={28} />
              Entrenador
            </div>
          </Link>

          <Link href="/exercises" passHref>
            <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
              <Dumbbell size={28} />
              Ejercicios
            </div>
          </Link>

          <Link href="/plans" passHref>
            <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
              <SquareChartGantt size={28} />
              Planes
            </div>
          </Link>

          <Link href="/reports" passHref>
            <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
              <ClipboardMinus size={28} />
              Reportes
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-xs text-gray-400 border-t border-gray-700">
        © 2025 Timshel
        <br />
        Desarrollado por Intuition Business
      </footer>
    </nav>
  );
}
