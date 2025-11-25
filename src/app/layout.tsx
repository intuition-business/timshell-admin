"use client";
import NavBar from "@/app/Components/navBar/NavBar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "./AuthContext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Ocultar en estas rutas
  const hideOn = ["/auth/login", "/auth/codigo-otp", "/auth/admin"];

  // Normalizar ambas rutas a minúsculas para evitar problemas de sensibilidad a mayúsculas/minúsculas
  const showNavbar = !hideOn.includes(pathname.toLowerCase());

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning  style={{ fontFamily: "'Exo 2', sans-serif" }}>
        <AuthProvider>
          <div className={`h-screen w-full bg-[#0f0f0f] overflow-hidden 
              before:content-[''] before:absolute before:top-0 before:left-0 before:w-[200px] before:h-[200px] before:bg-[url('/iconos-layout.png')] before:bg-no-repeat before:bg-cover before:opacity-20 before:blur-[2px]
              after:content-[''] after:absolute after:top-0 after:right-0 after:w-[200px] after:h-[200px] after:bg-[url('/iconos-layout.png')] after:bg-no-repeat after:bg-cover after:blur-[0px] fixed top-0 left-0 z-10 ${showNavbar ? 'block' : 'hidden'}`}>

            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full 
                     bg-[#D4FF00] opacity-20 blur-[180px]"></div>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full 
                     bg-[#D4FF00] opacity-15 blur-[200px]"></div>
          </div>
          <div className="flex w-full">
            {showNavbar && <NavBar />}
            <div className={`main-content w-full z-50 relative ${showNavbar ? 'px-12 mt-16' : ''}`}>{children}</div>{" "}
            {/* El contenido de la página */}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
