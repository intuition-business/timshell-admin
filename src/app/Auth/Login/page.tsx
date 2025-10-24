'use client'

import Loading from "@/Components/Loading/loading";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter()

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1500);
    }, []);

    const validateInputs = () => {
        if (!email && !phone) {
            return "Ingresa al menos un correo o teléfono";
        }
        if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Correo no válido";
        }
        if (phone && !/^\+?[0-9]{7,15}$/.test(phone)) {
            return "Teléfono no válido";
        }
        return null;
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('https://api.timshell.co/api/send-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email || undefined,
                    phonenumber: '+57' + phone || undefined,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                /* router.push('/Auth/codigo-otp'); */
                throw new Error(data?.message || 'Error al enviar OTP');
            }
            else {
                router.push(`/Auth/codigo-otp?phone=57${phone}`);
            }

            /*  setSuccess('OTP enviado correctamente'); */
        } catch (err: any) {
            /* setError(err.message || 'Ocurrió un error'); */
            /* router.push('/Auth/codigo-otp'); */
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Loading />
        );
    }

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
                        <p className="text-white mb-7">Ingresa tu teléfono o correo para recibir tu código de inicio de sesión</p>

                        <input
                            className="bg-[#2B2C2A] text-white border border-white px-6 py-4 rounded-xl w-full max-w-[500px] mb-3"
                            type="email"
                            placeholder="Ingresa tu correo"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            className="bg-[#2B2C2A] text-white border border-white px-6 py-4 rounded-xl w-full max-w-[500px]"
                            type="tel"
                            placeholder="Ingresa tu teléfono"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />

                        {error && <p className="text-red-500 mt-3">{error}</p>}
                        {success && <p className="text-green-500 mt-3">{success}</p>}

                        <button
                            className={`px-4 py-4 w-full rounded-xl font-semibold my-7 max-w-[500px] transition-all duration-200 ${isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#D4FF00] hover:bg-[#b9de00] cursor-pointer'
                                }`}
                            disabled={isSubmitting}
                            onClick={handleSubmit}
                        >
                            {isSubmitting ? 'Enviando...' : 'Confirmar'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
