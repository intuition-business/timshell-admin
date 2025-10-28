
import { useAuth } from "@/app/AuthContext";
import { IconHome, IconUsers, IconUserCog, IconClipboardList, IconFileText, IconBell } from "@tabler/icons-react";
import Link from "next/link";

export default function NavBar() {
  const auth = useAuth();
  const role = auth?.role;

  return (
    <nav className="sticky left-0 top-0 h-screen max-w-[250px] w-full bg-[#282828] text-white flex flex-col justify-between shadow-lg">
      {/* Logo */}
      <div>
        <div className="px-6 py-6">
          <img src="/logo.png" alt="Logo" />
        </div>

        {/* Menú de navegación */}
        <div className="mt-4 flex flex-col gap-4 px-6">
          <Link href="/" passHref>
            <div className="flex items-center gap-3 text-lime-400 font-medium">
              <IconHome size={18} />
              Inicio
            </div>
          </Link>

          {/* Mostrar elementos del menú basados en el rol */}
          {role === "admin" && (
            <>
              <Link href="/pages/users" passHref>
                <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
                  <IconUsers size={18} />
                  Usuarios
                </div>
              </Link>

              <Link href="/pages/trainer" passHref>
                <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
                  <IconUserCog size={18} />
                  Entrenador
                </div>
              </Link>

              <Link href="/plans" passHref>
                <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
                  <IconClipboardList size={18} />
                  Planes
                </div>
              </Link>

              <Link href="/reports" passHref>
                <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
                  <IconFileText size={18} />
                  Reportes
                </div>
              </Link>
            </>
          )}

          {role === "trainer" && (
            <>
              <Link href="/exercises" passHref>
                <div className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
                  <IconBell size={18} />
                  Ejercicios
                </div>
              </Link>
            </>
          )}
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
