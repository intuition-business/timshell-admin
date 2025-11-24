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
    const [showModalExercise, setShowModalExercise] = useState(false);
    const [showModalSaved, setShowModalSaved] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);


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
        if (!title.trim()) return alert("Primero selecciona un ejercicio.");
        if (!rutinaId.trim()) return alert("Ingresa rutina_id.");
        if (!restTime.trim()) return alert("Ingresa tiempo de descanso.");

        const hasSeries = series.some((s) => s.trim() !== "");
        if (!hasSeries) return alert("Debes agregar repeticiones.");

        return true;
    };

    // ============================
    // CREAR EJERCICIO
    // ============================

    const handleCreate = async () => {
        try {
            const token = localStorage.getItem("token") ?? "";

            const detalleSeries = series.map((rep) => ({
                Reps: Number(rep),
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
            alert("Error al crear ejercicio");
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
        }
    };

    return (
        <>
            <div className="flex flex-col p-5 min-h-screen lg:flex-row gap-8">

                {/* PREVIEW */}
                <div className="w-full max-w-[380px]">
                    <div className="max-h-[70vh] h-full  sticky top-11">
                        <h2 className="text-2xl font-semibold mb-4 text-[#D4FF00]">
                            {title || "Nuevo ejercicio"}
                        </h2>

                        {exerciseImage ? (
                            <img
                                src={exerciseImage}
                                alt="Ejercicio"
                                className="rounded-xl border aspect-square block overflow-hidden  border-gray-700 w-full max-w-[380px] h-full object-cover"                            />
                        ) : (
                            <div className="aspect-square w-full h-full rounded-xl border border-gray-700 flex items-center justify-center text-gray-500">
                                Sin imagen
                            </div>
                        )}
                    </div>
                </div>

                {/* FORMULARIO */}
                <div className="w-full">

                    <div className="w-full flex flex-row justify-end">
                        <Buttons
                            onClick={() => setShowModalExercise(true)}
                            data="Buscar ejercicio"
                            className="bg-white text-black p-3 font-bold hover:bg-[#cbe000] cursor-pointer"
                        />
                    </div>
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
                                onChange={(e) => setRestTime(e.target.value)}
                                placeholder="Minutos"
                                className="bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-2"
                            />
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
                                        onChange={(e) => handleSeriesChange(i, e.target.value)}
                                        placeholder="Número de reps"
                                        className="border border-gray-500 text-white rounded-lg px-4 py-2"
                                    />
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={handleAddSeries}
                                className="bg-[#2B2B2B] p-4 rounded-xl text-gray-300 hover:bg-[#3A3A3A] flex items-center justify-center min-h-[145px]"
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
