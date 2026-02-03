'use client'

import Loading from "@/app/Components/Loading/loading";

import { useEffect, useState } from "react";
import LoginAdmin from "../Login/steps/login-admin";
import ValidacionOtp from "../Login/steps/validacion-otp";

export default function Index() {
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [step, setStep] = useState<any>(1);
    const [codigoStepDos, setCodigoStepDos] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, []);

    const validateInputs = () => {
        if (!email || !phone) {
            return "Debes ingresartanto el correo como el teléfono.";
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return "Correo no válido.";
        }
        if (!/^\+?[0-9]{7,15}$/.test(phone)) {
            return "Teléfono no válido.";
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

        /*      setCodigoStepDos(true) */

        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email || undefined,
                    phonenumber: undefined,
                    /* platform: 'web', */
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                /* router.push('/Auth/codigo-otp'); */
                setStep(2)
                throw new Error(data?.message || 'Error al enviar OTP');
            }
            else {
                setStep(2)
                /* router.push(`/Auth/codigo-otp?phone=57${phone}`); */
            }
            setSuccess('OTP enviado correctamente');
        } catch (err: any) {
            setStep(2)
            setError(err.message || 'Ocurrió un error');
            setTimeout(() => {
                setError('');
            }, 2500);
            /* router.push('/Auth/codigo-otp'); */
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSubmitTelefono = async () => {
        setError('');
        setSuccess('');
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}send-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: undefined,
                    phonenumber: '+57' + phone || undefined,
                    platform: 'web',
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                /* router.push('/Auth/codigo-otp'); */
                throw new Error(data?.message || 'Error al enviar OTP');
            }
            else {
                setStep(3);
                setCodigoStepDos(false)
                /* router.push(`/Auth/codigo-otp?phone=57${phone}`); */
            }
            setSuccess('OTP enviado correctamente');
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error');
            setTimeout(() => {
                setError('');
            }, 2500);
            /* router.push('/Auth/codigo-otp'); */
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (codigoStepDos) {
            handleSubmitTelefono();
        }
    }, [codigoStepDos])

    if (loading) {
        return <Loading />;
    }

    switch (step) {
        case 1:
            return (
                <LoginAdmin setEmail={setEmail} setPhone={setPhone} email={email} phone={phone} error={error} success={success} isSubmitting={isSubmitting} handleSubmit={handleSubmit}></LoginAdmin>
            )
        case 2:
            return (
                <ValidacionOtp
                    key="email-otp"
                    step={step}
                    email={email}
                    setCodigoStepDos={setCodigoStepDos}
                />
            )

        case 3:
            return (
                <ValidacionOtp
                    key="phone-otp"
                    step={step}
                    phone={phone}
                />
            )
        default:
            return null
    }
}
