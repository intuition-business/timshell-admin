"use client";

import { useEffect, useState } from "react";
import Buttons from "../ui/Buttons";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Loading from "../Loading/loading";
import AccionBar from "../navBar/ActionBar";
import ExerciseEditForm from "./ExerciseEditarForm";
import ExerciseModal from "../ExerciseModal/ExerciseModal";


interface ExerciseCreateProps {
  exerciseName?: string | null;
  seriesCount?: string | null;
  rest?: string | null;
  date?: string | null;
  image?: string | null;
  reps?: string | null;
}

export default function ExerciseCreate({
  exerciseName,
  seriesCount,
  rest,
  image,
  date,
  reps,
}: ExerciseCreateProps) {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState(exerciseName);
  const [description, setDescription] = useState("");
  const [routineName, setRutinaName] = useState('')
  const [rutinaIdReal, setRutinaIdReal] = useState<string | null>(null);
  const [rutinaId, setRutinaId] = useState('')
  const [restTime, setRestTime] = useState(rest || "");
  const [series, setSeries] = useState<string[]>([]);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [accionState, setAccionState] = useState<boolean>(false);
  const [showModalExercise, setShowModalExercise] = useState(false);


  const [exerciseImage, setExerciseImage] = useState(image || "");

  const handleAddSeries = () => {
    setSeries([...series, ""]);
  };

  const handleSeriesChange = (index: number, value: string) => {
    const updated = [...series];
    updated[index] = value;
    setSeries(updated);
  };

  const handleRemoveSeries = (index: number) => {
    if (series.length > 1) {
      const updated = series.filter((_, i) => i !== index);
      setSeries(updated);
    }
  };

  const handleEditExercise = async () => {
    try {
      const token = localStorage.getItem("token") ?? "";

      const detalleSeries = series.map((rep) => ({
        Reps: Number(rep),
      }));

      const body = {
        rutina_id: rutinaId,
        exercise_name: title,
        updates: {
          Series: series.length,
          Descanso: restTime,
          "Detalle series": detalleSeries,
          description,
          video_url: "",
          thumbnail_url: exerciseImage,
        },
      };

      const res = await fetch(`https://api.timshell.co/api/routines/edit-exercise?user_id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Error al editar ejercicio");

      setShowModal(true);

    } catch (error) {
      console.error(error);
      alert("Error");
    }
  };

  useEffect(() => {
    async function loadExercise() {
      try {
        const token = localStorage.getItem("token") ?? "";

        const res = await fetch(
          `https://api.timshell.co/api/routines/search-in-generated?fecha_rutina=${date}&exercise_name=${title}&user_id=${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-access-token": token,
            },
          }
        );

        if (!res.ok) throw new Error("Error al cargar ejercicio");

        const data = await res.json();

        if (data?.response?.exercise) {
          const ex = data.response.exercise;
          setRutinaName(data.routine_name)
          setRutinaId(data.rutina_id)
          setTitle(ex.nombre_ejercicio);
          setDescription(ex.description || "");
          setExerciseImage(ex.thumbnail_url);
          setRestTime(ex.Esquema?.Descanso?.toString() || "");
          setRutinaIdReal(ex.rutina_id);


          if (ex.Esquema?.["Detalle series"]) {
            const repsArray = ex.Esquema["Detalle series"].map((s: any) =>
              s.Reps.toString()
            );
            setSeries(repsArray);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (date && title) {
      loadExercise();
    }
  }, [date, title]);

  useEffect(() => {
    if (accionState) {
      handleEditExercise();
    }
  }, [accionState])

  if (loading) {
    return (
      <Loading></Loading>
    );
  }

  return (
    <>
      <div className="flex flex-col p-5 min-h-screen lg:flex-row gap-8">
        <div className="w-full max-w-[380px] ">
          <div className="max-h-[70vh] h-full sticky top-11 ">
            <h2 className="text-2xl font-semibold mb-4 text-[#D4FF00] ">
              {title}
            </h2>

            <img
              src={exerciseImage}
              alt="Ejercicio"
              className="rounded-xl border aspect-square block overflow-hidden  border-gray-700 w-full max-w-[380px] h-full object-cover"
            />
          </div>
        </div>

        <div className="w-full">
          <div className="flex justify-end">
            <button
              className="px-4 py-2 border border-white text-white bg-transparent 
             rounded-lg transition hover:bg-white/10"
            >
              eliminar ejercicio
            </button>
          </div>

          <div className="p-6">
            <h2 className="text-white py-">Descripción</h2>
            <p className="text-gray-100 ">{description}</p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className=" text-white p-6 rounded-2xl shadow-md w-full space-y-6"
          >
            <div className="flex flex-col space-y-2 max-w-md">
              <label className="text-xl font-medium text-gray-300">
                Tiempo de descanso
              </label>
              <input
                type="text"
                value={restTime}
                onChange={(e) => setRestTime(e.target.value)}
                placeholder="Agregar el tiempo en minutos"
                className="bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
              />
            </div>

            <h2 className="text-2xl font-semibold mb-1">Series</h2>
            <div className="text-white rounded-2xl shadow-md mx-auto mt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {series.map((rep, index) => (
                  <div
                    key={index}
                    className="flex flex-col space-y-2 bg-[#2B2B2B] p-4 rounded-xl relative"
                  >
                    {series.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSeries(index)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition"
                      >
                        ✕
                      </button>
                    )}

                    <h2 className="text-xl font-semibold text-[#D4FF00]">
                      Serie {index + 1}
                    </h2>

                    <label className="text-lg text-gray-300">Repeticiones</label>

                    <input
                      type="text"
                      value={rep}
                      onChange={(e) =>
                        handleSeriesChange(index, e.target.value)
                      }
                      placeholder="Número de repeticiones"
                      className="border border-gray-500 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#D4FF00]"
                    />
                  </div>
                ))}
                <div className="w-full h-full flex flex-col">
                  <button
                    type="button"
                    onClick={handleAddSeries}
                    className="flex flex-col space-y-2 bg-[#2B2B2B] p-4 rounded-xl text-gray-300 hover:bg-[#3A3A3A] transition items-center justify-center w-full h-full min-h-[145px]"
                  >
                    <span className="text-xl font-semibold text-gray-300">
                      + Agregar serie nueva
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Buttons
                onClick={() => {
                  setShowModalExercise(true);
                }}
                data="Editar ejercicio"
                type="submit"
                className="bg-white text-black font-bold hover:bg-[#cbe000] cursor-pointer"
              />
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-[#1F1F1F] text-white rounded-2xl p-8 shadow-xl flex flex-col items-center gap-4 w-[90%] max-w-md border border-gray-700">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[#D4FF00]/20">
              <svg
                className="w-12 h-12 text-[#D4FF00]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-semibold">Actualizado correctamente</h2>

            <button
              onClick={() => router.push(`/pages/users/${id}/${date}?name=${encodeURIComponent(routineName)}`)}
              className="mt-2 bg-[#D4FF00] text-black px-6 py-2 rounded-xl font-semibold hover:bg-[#cbe000] transition cursor-pointer"
            >
              Continuar
            </button>
          </div>
        </div>
      )}
      {showModalExercise && (
        <ExerciseModal isOpen={showModalExercise} onClose={()=>{setShowModalExercise(false)}} ></ExerciseModal>
      )}
      <AccionBar textButton={"Guardar Ejercicios"} accionState={accionState} useAccionState={setAccionState}></AccionBar>
    </>
  );
}
