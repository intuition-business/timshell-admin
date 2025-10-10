import {
  IconHome,
  IconUsers,
  IconUserCog,
  IconBell,
  IconClipboardList,
  IconFileText,
} from "@tabler/icons-react";

export default function NavBar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#282828] text-white flex flex-col justify-between rounded-r-3xl shadow-lg">
      {/* Logo */}
      <div>
        <div className="img-fit gap-2 px-6 py-6">
          <img src="/logo.png" alt="" />
        </div>

        {/* Menú */}
        <nav className="mt-4 flex flex-col gap-4 px-6">
          <a
            href="#"
            className="flex items-center gap-3 text-lime-400 font-medium"
          >
            <IconHome size={18} />
            Inicio
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
            <IconUsers size={18} />
            Usuarios
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
            <IconUserCog size={18} />
            Entrenador
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
            <IconBell size={18} />
            Ejercicios
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
            <IconClipboardList size={18} />
            Planes
          </a>
          <a href="#" className="flex items-center gap-3 text-gray-300 hover:text-lime-400">
            <IconFileText size={18} />
            Reportes
          </a>
        </nav>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-xs text-gray-400 border-t border-gray-700">
        © 2025 <span className="">Timshel</span>
        <br />
        Desarrollado por Intuition Business
      </footer>
    </aside>
  );
}
