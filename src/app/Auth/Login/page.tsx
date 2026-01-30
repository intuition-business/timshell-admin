'use client'

import Loading from "@/app/Components/Loading/loading";
import { useEffect, useState } from "react";
import Login from "./steps/login-user";
import ValidacionOtp from "./steps/validacion-otp";

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [identifier, setIdentifier] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<any>(1);

    // nuevos estados
    const [contactType, setContactType] = useState<'email' | 'phone' | null>(null);
    const [contactValue, setContactValue] = useState<string>('');

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const validateInput = (value: string) => {
        if (!value.trim()) return "Ingresa tu correo o teléfono";

        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return null; // correo válido
        if (/^\+?[0-9]{7,15}$/.test(value)) return null; // teléfono válido

        return "El valor ingresado no es un correo ni un teléfono válido";
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');

        const validationError = validateInput(identifier);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(identifier);
        const isPhone = /^\+?[0-9]{7,15}$/.test(identifier);

        const body: any = { platform: 'web' };

        if (isEmail) {
            body.email = identifier;
            setContactType('email');
            setContactValue(identifier);
        } else if (isPhone) {
            const phoneFormatted = identifier.startsWith('+') ? identifier : '+57' + identifier;
            body.phonenumber = phoneFormatted;
            setContactType('phone');
            setContactValue(phoneFormatted);
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}send-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || 'Error al enviar OTP');
            } else {
                setStep(2);
            }

        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al enviar el OTP');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <Loading />;

    switch (step) {
        case 1:
            return (
                <Login
                    identifier={identifier}
                    setIdentifier={setIdentifier}
                    error={error}
                    success={success}
                    isSubmitting={isSubmitting}
                    handleSubmit={handleSubmit}
                />
            );
        case 2:
            return (
                <ValidacionOtp
                    step={step}
                    email={contactType === 'email' ? contactValue : undefined}
                    phone={contactType === 'phone' ? contactValue : undefined}
                />
            );
        default:
            return null;
    }
}
