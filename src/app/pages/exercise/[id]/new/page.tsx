"use client";

import { ConfirmReplaceExercise } from "@/app/Components/ExerciseModal/ConfirmReplaceExercise";
import ExerciseModal from "@/app/Components/ExerciseModal/ExerciseModal";
import { SaveExercise } from "@/app/Components/ExerciseModal/SaveExercise";
import AccionBar from "@/app/Components/navBar/ActionBar";
import Buttons from "@/app/Components/ui/Buttons";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ExerciseCreateNew() {
    const params = useParams();
    const id = Array.isArray(params.id) ? params.id[0] : params.id;
    const router = useRouter();
    const search = useSearchParams()

    const initialRutina = search.get("rutina") || "";
    // Datos del ejercicio seleccionado (NO editables)
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [exerciseImage, setExerciseImage] = useState("");
    const [videoUrl, setVideoUrl] = useState("");

    // Campos editables
    const [restTime, setRestTime] = useState("");
    const [series, setSeries] = useState<string[]>([""]);
    const [rutinaId, setRutinaId] = useState(initialRutina);

    const [accionState, setAccionState] = useState(false);
    const [showModalExercise, setShowModalExercise] = useState(true);
    const [showModalSaved, setShowModalSaved] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [restError, setRestError] = useState("");
    const [seriesErrors, setSeriesErrors] = useState<string[]>([]);
    const [generalError, setGeneralError] = useState("");
    const [showVideo, setShowVideo] = useState(false);


    const isExerciseSelected = title.trim().length > 0;

    const [selectExercise, setSelectExercise] = useState<any>(null);
    const name = search.get("name") || "";
    const date = search.get("date") || "";

    // ============================
    // HANDLERS SERIES
    // ============================

    const handleAddSeries = () => setSeries([...series, ""]);

    const handleRemoveSeries = (i: number) => {
        if (series.length > 1) {
            setSeries(series.filter((_, idx) => idx !== i));
        }
    };

    const handleSeriesChange = (i: number, val: string) => {
        const updated = [...series];
        updated[i] = val;
        setSeries(updated);
    };

    // ============================
    // VALIDACIÓN
    // ============================

    const canSave = () => {
        let valid = true;

        // Reset errores
        setRestError("");
        setSeriesErrors([]);
        setGeneralError("");

        if (!isExerciseSelected) {
            setGeneralError("Primero selecciona un ejercicio.");
            setTimeout(() => {
                setGeneralError("");
            }, 3000);
            return false;
        }

        if (!rutinaId.trim()) {
            setGeneralError("No se puede crear el ejercicio: falta el ID de la rutina.");
            setTimeout(() => {
                setGeneralError("");
            }, 3000);
            return false;
        }

        // Validar descanso
        if (!restTime.trim()) {
            setRestError("Ingresa el tiempo de descanso.");
            valid = false;
        }

        // Validar series
        const newSeriesErrors = series.map((rep) =>
            !rep.trim() ? "Ingresa las repeticiones." : ""
        );

        setSeriesErrors(newSeriesErrors);

        if (newSeriesErrors.some((e) => e !== "")) {
            valid = false;
        }

        return valid;
    };


    // ============================
    // CREAR EJERCICIO
    // ============================

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("token") ?? "";

            const detalleSeries = series.map((rep) => ({
                Reps: String(rep),
            }));

            const body = {
                rutina_id: rutinaId,
                day_fecha: date,
                new_exercise: title,
                updates: {
                    Series: series.length,
                    Descanso: restTime,
                    "Detalle series": detalleSeries,
                    description,
                    video_url: videoUrl,
                    thumbnail_url: exerciseImage,
                },
            };

            const res = await fetch(
                `https://api.timshell.co/api/routines/add-exercise?user_id=${id}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "x-access-token": token,
                    },
                    body: JSON.stringify(body),
                }
            );

            if (!res.ok) throw new Error("Error al crear ejercicio");

            setShowModalSaved(true);

        } catch (error) {
            console.error(error);
            setGeneralError("Ocurrió un error al crear el ejercicio. Intenta nuevamente.");
        }
    };


    // ============================
    // CUANDO SELECCIONAN UN EJERCICIO
    // ============================

    const applySelectedExercise = () => {
        if (selectExercise) {
            setTitle(selectExercise.exercise);
            setDescription(selectExercise.description || "");
            setExerciseImage(selectExercise.thumbnail_url || "");
            setVideoUrl(selectExercise.video_url || "");
            setSeries([""]);
            setRestTime("");
            setShowVideo(false);

        }
    };

    return (
        <>
            <div className="flex flex-col p-5 min-h-screen lg:flex-row gap-8">

                {/* PREVIEW */}
                <div className="w-full max-w-[380px]">
                    <div className="max-h-[70vh] h-full sticky top-11">
                        <h2 className="text-2xl font-semibold mb-4 text-[#D4FF00]">
                            {title || "Nuevo ejercicio"}
                        </h2>
                        {showVideo && (
                            <button
                                onClick={() => setShowVideo(false)}
                                className="mt-3 text-sm text-gray-400 hover:text-[#D4FF00] cursor-pointer mb-2"
                            >
                                ⟵ Volver a la imagen
                            </button>
                        )}
                        {/* CONTENEDOR */}
                        <div className="relative h-full w-full aspect-square rounded-xl border border-gray-700 overflow-hidden">

                            {/* VIDEO */}
                            {videoUrl && showVideo ? (
                                <video
                                    src={videoUrl}
                                    controls
                                    autoPlay
                                    className="w-full h-full object-cover"
                                />
                            ) : exerciseImage ? (
                                <>
                                    {/* IMAGEN */}
                                    <img
                                        src={exerciseImage}
                                        alt="Ejercicio"
                                        className="w-full h-full object-cover"
                                    />

                                    {/* BOTÓN PLAY */}
                                    {videoUrl && (
                                        <button
                                            onClick={() => setShowVideo(true)}
                                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition"
                                        >
                                            <span className="w-14 h-14 bg-[#D4FF00] rounded-full flex items-center justify-center">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="black"
                                                    className="w-7 h-7 ml-1"
                                                >
                                                    <path d="M8 5v14l11-7z" />
                                                </svg>
                                            </span>
                                        </button>
                                    )}
                                </>
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    Sin imagen
                                </div>
                            )}
                        </div>
                    </div>
                </div>


                {/* FORMULARIO */}
                <div className="w-full">

                    <div className="w-full flex flex-row justify-end">
                        <Buttons
                            onClick={() => setShowModalExercise(true)}
                            data="Asignar Ejercicio"
                            className="bg-white text-black p-3 font-bold hover:bg-[#cbe000] cursor-pointer"
                        />
                    </div>
                    {generalError && (
                        <div className="bg-red-500/20 border my-2 border-red-500 text-red-300 p-3 rounded-lg">
                            {generalError}
                        </div>
                    )}

                    {description ? (
                        <div className="py-6">
                            <h2 className="text-white">Descripción</h2>
                            <p className="text-gray-100 ">{description}</p>
                        </div>
                    ) : (
                        <h2 className="text-white my-6">Descripcion nuevo ejercicio:</h2>
                    )}



                    <form onSubmit={(e) => e.preventDefault()} className="text-white rounded-xl space-y-6">

                        {/* descanso */}
                        <div className="flex flex-col gap-2">
                            <label className="text-xl font-medium text-gray-300">Tiempo de descanso</label>
                            <input
                                type="text"
                                value={restTime}
                                onChange={(e) => {
                                    if (isExerciseSelected) {
                                        setRestTime(e.target.value);
                                        if (restError) setRestError("");
                                    }
                                }}
                                placeholder="Minutos"
                                disabled={!isExerciseSelected}
                                className={`bg-[#2B2B2B] border text-white rounded-lg px-4 py-2
        ${!isExerciseSelected ? "opacity-40 cursor-not-allowed" : ""}
        ${restError ? "border-red-500 focus:ring-2 focus:ring-red-500" : "border-gray-700 focus:ring-2 focus:ring-[#D4FF00]"}
    `}
                            />

                            {restError && (
                                <p className="text-red-500 text-sm mt-1">{restError}</p>
                            )}

                        </div>

                        {/* SERIES */}
                        <h2 className="text-2xl font-semibold mb-2">Series</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {series.map((rep, i) => (
                                <div key={i} className="bg-[#2B2B2B] p-4 rounded-xl relative flex flex-col space-y-2">

                                    {series.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSeries(i)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                                        >
                                            ✕
                                        </button>
                                    )}

                                    <h2 className="text-xl font-semibold text-[#D4FF00]">Serie {i + 1}</h2>

                                    <label className="text-lg text-gray-300">Repeticiones</label>
                                    <input
                                        type="text"
                                        value={rep}
                                        onChange={(e) => {
                                            if (isExerciseSelected) {
                                                handleSeriesChange(i, e.target.value);

                                                // limpiar error solo de esta serie
                                                if (seriesErrors[i]) {
                                                    const updated = [...seriesErrors];
                                                    updated[i] = "";
                                                    setSeriesErrors(updated);
                                                }
                                            }
                                        }}
                                        placeholder="Número de reps"
                                        disabled={!isExerciseSelected}
                                        className={`border text-white rounded-lg px-4 py-2
        ${!isExerciseSelected ? "opacity-40 cursor-not-allowed" : ""}
        ${seriesErrors[i]
                                                ? "border-red-500 focus:ring-2 focus:ring-red-500"
                                                : "border-gray-500 focus:ring-2 focus:ring-[#D4FF00]"}
    `}
                                    />

                                    {seriesErrors[i] && (
                                        <p className="text-red-500 text-sm mt-1">{seriesErrors[i]}</p>
                                    )}


                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() => isExerciseSelected && handleAddSeries()}
                                disabled={!isExerciseSelected}
                                className={`bg-[#2B2B2B] p-4 rounded-xl text-gray-300 flex items-center justify-center min-h-[145px]
        ${!isExerciseSelected ? "opacity-40 cursor-not-allowed" : "hover:bg-[#3A3A3A]"}
    `}
                            >
                                + Agregar serie
                            </button>


                        </div>
                    </form>
                </div>
            </div>

            {/* Modal ejercicio */}
            {showModalExercise && (
                <ExerciseModal
                    isOpen={showModalExercise}
                    onClose={() => setShowModalExercise(false)}
                    title="Asignar ejercicio"
                    setSelectExercise={setSelectExercise}
                    setShowConfirm={setShowConfirm}
                />
            )}

            {/* Confirmar reemplazo */}
            {showConfirm && (
                <ConfirmReplaceExercise
                    isOpen={showConfirm}
                    onConfirm={() => {
                        applySelectedExercise();
                        setShowConfirm(false);
                    }}
                    onCancel={() => setShowConfirm(false)}
                />
            )}

            {/* Guardado OK */}
            {showModalSaved && (
                <SaveExercise
                    title="Ejercicio Creado"
                    isOpen={showModalSaved}
                    onContinue={() => router.push(`/pages/users/${id}/${date}?name=${name}`)}
                />
            )}

            {/* Barra inferior */}
            <AccionBar
                textButton="Guardar ejercicio"
                accionState={accionState}
                useAccionState={(val: any) => {
                    if (val) {
                        if (canSave()) {
                            handleCreate();
                            setAccionState(false);
                        }
                    } else {
                        setAccionState(false);
                    }
                }}
            />
        </>
    );
}
