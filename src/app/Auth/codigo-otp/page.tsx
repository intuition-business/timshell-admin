'use client'
import Loading from "@/Components/Loading/loading";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Index() {
    const router = useRouter()
    const [loading, setLoading] = useState(true);
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const url = useSearchParams();

    console.log(url.get('phone'));


    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    if (loading) {
        return <Loading />;
    }

    // Función para manejar el cambio en inputs individuales del OTP
    const handleChange = (index: number, value: string) => {
        if (/^\d?$/.test(value)) {  // Solo permitir dígitos o vacío
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            // Auto foco en siguiente input si se ingresó un número
            if (value && index < otp.length - 1) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                nextInput?.focus();
            }
        }
    };

    const handleConfirm = async () => {
        const code = otp.join('');
        if (code.length !== 6) {
            // alert("Por favor ingresa el código completo");
            return;
        }
        try {
            const response = await fetch('https://api.timshell.co/api/validate-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phonenumber: '+' + url.get('phone'),
                    otp: Number(code)
                }),
            });

            const data = await response.json();
            console.log(data);
            

            if (!response.ok) {
                /* router.push('/Auth/codigo-otp'); */
                throw new Error(data?.message || 'Error al enviar OTP');
            }
            else {
                localStorage.setItem('token', data?.token)
                router.push('/');
            }

            /*  setSuccess('OTP enviado correctamente'); */
        } catch (err: any) {
            /* setError(err.message || 'Ocurrió un error'); */
            /* router.push('/Auth/codigo-otp'); */
        } finally {
            setIsSubmitting(false);
        }
    };

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
                        <p className="text-gray-300 mb-8 text-center">
                            Ingresa el código que te llegó a tu número de teléfono
                        </p>

                        <div className="flex gap-4 mb-8">
                            {otp.map((num, i) => (
                                <input
                                    key={i}
                                    id={`otp-input-${i}`}
                                    type="text"
                                    maxLength={1}
                                    value={num}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    className="w-16 h-16 rounded-xl bg-[rgba(255,255,255,0.2)] text-white font-mono text-lg text-center focus:outline-none focus:ring-2 focus:ring-[#D4FF00] border border-white"
                                />
                            ))}
                        </div>

                        <button
                            className={`px-4 py-4 w-full rounded-xl font-semibold my-7 max-w-[500px] transition-all duration-200 ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#D4FF00] hover:bg-[#b9de00] cursor-pointer'
                                }`}
                            disabled={isSubmitting}
                            onClick={handleConfirm}
                        >
                            {isSubmitting ? 'Enviando...' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
