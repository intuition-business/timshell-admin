import { IconHeadset } from "@tabler/icons-react";
import Image from "next/image";

export default function LoginAdmin({ setEmail, setPhone, email, phone, error, success, isSubmitting, handleSubmit }: any) {
    return (
        <div className="h-screen w-full bg-[#0f0f0f] relative overflow-hidden">
            <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] rounded-full 
        bg-[#D4FF00] opacity-20 blur-[180px]"></div>
            <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full 
        bg-[#D4FF00] opacity-15 blur-[200px]"></div>

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
                <div className="my-auto -translate-y-[50px]">
                    <div className="text-center">
                        <h2 className="text-[#D4FF00] text-center text-[32px] leading-[1.1] font-semibold mb-5">Iniciar sesión</h2>
                        <p className="text-white mb-7">Ingresa tu teléfono y correo para recibir tu código de inicio de sesión</p>

                        <input
                            className="bg-[#2B2C2A] text-white border border-white px-6 py-4 rounded-xl w-full max-w-[500px] mb-3"
                            type="email"
                            placeholder="Ingresa tu correo"
                            value={email}
                            required
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className="bg-[#2B2C2A] text-white border border-white px-6 py-4 rounded-xl w-full max-w-[500px]"
                            type="tel"
                            placeholder="Ingresa tu teléfono"
                            value={phone}
                            required
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        <button
                            className={`px-4 py-4 w-full rounded-xl font-semibold mt-7 max-w-[500px] transition-all duration-200 ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#D4FF00] hover:bg-[#b9de00] cursor-pointer'
                                }`}
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? 'Enviando...' : 'Confirmar'}
                        </button>
                        {error && <p className="text-red-500 mt-3">{error}</p>}
                        {success && <p className="text-green-500 mt-3">{success}</p>}

                        <a href="#" className="w-max mx-auto hover:text-gray-300 text-white text-lg flex gap-2 items-center justify-center mt-7"><IconHeadset></IconHeadset> <span>Llamar a soporte tecnico</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}