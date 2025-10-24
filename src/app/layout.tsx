"use client";
import { Metadata } from "next";
import "./globals.css";
import NavBar from "@/Components/navBar/NavBar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Ocultar en estas rutas
  const hideOn = ["/auth/login", "/auth/codigo-otp"];

  // Normalizar ambas rutas a minúsculas para evitar problemas de sensibilidad a mayúsculas/minúsculas
  const showNavbar = !hideOn.includes(pathname.toLowerCase());

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Exo 2', sans-serif" }}>
        <div className="flex w-full">
          {showNavbar && <NavBar />}
          <div className="main-content w-full">{children}</div> {/* El contenido de la página */}
        </div>
      </body>
    </html>
  );
}
