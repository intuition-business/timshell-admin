'use client'
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Index() {

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    if (loading) {
        return (
            <div className="h-screen w-full bg-[#0f0f0f] relative overflow-hidden 
              before:content-[''] before:absolute before:top-0 before:left-0 before:w-[200px] before:h-[200px] before:bg-[url('/iconos-layout.png')] before:bg-no-repeat before:bg-cover before:opacity-20 before:blur-[2px]
              after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-[200px] after:h-[200px] after:bg-[url('/iconos-layout.png')] after:bg-no-repeat after:bg-cover after:opacity-20 after:blur-[2px]">

                <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full 
                  bg-[#D4FF00] opacity-20 blur-[180px]"></div>
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full 
                  bg-[#D4FF00] opacity-15 blur-[200px]"></div>

                <div className="relative z-10 flex items-center justify-center h-full">
                    <Image
                        src={"/logo.png"}
                        alt="Timshel"
                        width={300}
                        height={150}
                        priority
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-[#0f0f0f] relative overflow-hidden 
    before:content-[''] before:absolute before:top-0 before:left-0 before:w-[200px] before:h-[200px] before:bg-[url('/iconos-layout.png')] before:bg-no-repeat before:bg-cover before:opacity-20 before:blur-[2px]
    after:content-[''] after:absolute after:bottom-0 after:right-0 after:w-[200px] after:h-[200px] after:bg-[url('/iconos-layout.png')] after:bg-no-repeat after:bg-cover after:opacity-20 after:blur-[2px]">
            {/* Glow blobs */}
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full 
        bg-[#D4FF00] opacity-20 blur-[180px]"></div>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full 
        bg-[#D4FF00] opacity-15 blur-[200px]"></div>

            {/* Logo central */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full">
                <div className="relative z-10 flex items-center justify-center mt-8">
                    <Image
                        src={"/logo.png"}
                        alt="Timshel"
                        width={300}
                        height={150}
                        priority
                    />
                </div>
                <div className="my-auto">
                    <div>
                        <h2 className="text-[#D4FF00] text-center text-[32px] leading-[1.1] font-semibold mb-6">Iniciar sesión</h2>
                        <p className="text-white">Ingresa tu teléfono o correo para recibir tu código de inicio de sesión</p>
                        <input className="bg-[#2B2C2A] border border-white px-6 py-4 rounded-xl w-full mt-8 mb-4" type="text" placeholder="ingresa tu correo o telefono" name="" id="" />
                        <p className="text-white text-end">¿Olvidaste tu contraseña?</p>
                        <button className="px-4 py-4 bg-[#D4FF00] w-full rounded-xl font-semibold my-8">Confirmar</button>
                    </div>
                    <hr className="border-white" />
                    <div className="text-white text-center">
                        <p>También regístrate con</p>

                    </div>
                </div>
                <div className="mb-20 text-white underline">
                    <p>Regístrate aquí</p>
                </div>
            </div>
        </div>

    )
}