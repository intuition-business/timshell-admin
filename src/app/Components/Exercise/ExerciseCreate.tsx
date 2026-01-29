"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExerciseModal from "../ExerciseModal/ExerciseModal";
import { SaveExercise } from "../ExerciseModal/SaveExercise";
import Loading from "../Loading/loading";
import AccionBar from "../navBar/ActionBar";
import Buttons from "../ui/Buttons";
import { ConfirmReplaceExercise } from "../ExerciseModal/ConfirmReplaceExercise";
import { ConfirmDeleteExercise } from "../ModalConfirm/modalConfirm";
import { Fancybox } from "@fancyapps/ui/dist/fancybox/";
import { ChevronLeft } from "lucide-react";

interface ExerciseCreateProps {
  exerciseName?: string | null;
  seriesCount?: string | null;
  rest?: string | null;
  date?: string | null;
  image?: string | null;
  reps?: string | null;
  idExersiceProps?: string | null;
}

export default function ExerciseCreate({
  exerciseName,
  seriesCount,
  rest,
  image,
  date,
  reps,
  idExersiceProps,
}: ExerciseCreateProps) {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState(exerciseName);
  const [description, setDescription] = useState("");
  const [routineName, setRutinaName] = useState("");
  const [rutinaId, setRutinaId] = useState("");
  const [restTime, setRestTime] = useState(rest || "");
  const [series, setSeries] = useState<string[]>([]);
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [accionState, setAccionState] = useState<boolean>(false);
  const [showModalExercise, setShowModalExercise] = useState(false);
  const [exerciseImage, setExerciseImage] = useState(image || "");
  const [idExersice, setidExersice] = useState('');
  const [error, setError] = useState('')
  const [restError, setRestError] = useState("");
  const [seriesErrors, setSeriesErrors] = useState<string[]>([]);
  const [exerciseVideo, setVideoExercise] = useState("")
  const [showVideo, setShowVideo] = useState(false);
  useEffect(() => {
    setShowVideo(false);
  }, [exerciseImage, exerciseVideo]);

  useEffect(() => {
    Fancybox.bind("[data-fancybox='exercise-video']", {});
  }, []);

  const [openDelete, setOpenDelete] = useState(false);

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
        Reps: String(rep),
      }));

      const body = {
        rutina_id: rutinaId,
        "fecha_rutina": date,
        "exercise_id": idExersice,
        updates: {
          exercise_name: title,
          Series: series.length,
          Descanso: restTime,
          "Detalle series": detalleSeries,
          description,
          video_url: exerciseVideo,
          thumbnail_url: exerciseImage,
        },
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}routines/edit-exercise?user_id=${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify(body),
        }
      );

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}routines/search-in-generated?fecha_rutina=${date}&exercise_name=${title}&user_id=${id}&exercise_id=${idExersiceProps}`,
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
          setRutinaName(data.routine_name);
          setRutinaId(data.rutina_id);
          setidExersice(ex.exercise_id)
          setTitle(ex.nombre_ejercicio);
          setDescription(ex.description || "");
          setExerciseImage(ex.thumbnail_url);
          setVideoExercise(ex.video_url)
          setRestTime(ex.Esquema?.Descanso?.toString() || "");
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
  }, [date]);

  useEffect(() => {
    if (accionState) {
      handleEditExercise();
    }
  }, [accionState]);

  /* codigo para reasignar ejercicio */
  const [selectExercise, setSelectExercise] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  function NewInfoExercise() {
    if (selectExercise) {
      // Reemplazamos la información del ejercicio actual
      setTitle(selectExercise.exercise);
      setDescription(selectExercise.description || "");
      setExerciseImage(selectExercise.thumbnail_url || "");
      setRestTime("");
      setSeries([""]);
      setVideoExercise(selectExercise.video_url || "");

    }
  }

  function canSaveExercise() {
    let isValid = true;

    // Reset de errores
    setRestError("");
    setSeriesErrors([]);

    // Validación del descanso
    if (!restTime || restTime.trim() === "") {
      setRestError("Ingresa el tiempo de descanso");
      isValid = false;
    }

    // Validar todas las series una por una
    const newSeriesErrors = series.map((s) =>
      !s || s.trim() === "" ? "Ingresa las repeticiones" : ""
    );

    setSeriesErrors(newSeriesErrors);

    if (newSeriesErrors.some((err) => err !== "")) {
      isValid = false;
    }

    return isValid;
  }


  if (loading) {
    return <Loading></Loading>;
  }

  // --- FUNCIÓN DE ELIMINAR ---
  const deleteExercise = async () => {
    try {
      const token = localStorage.getItem("token") || "";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}routines/delete-exercise?user_id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
          body: JSON.stringify({
            rutina_id: rutinaId,
            fecha_rutina: date,
            exercise_id: idExersice,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        return;
      }

      router.back();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = () => {
    deleteExercise();
    setOpenDelete(false);
  };

  return (
    <>
      <ConfirmDeleteExercise
        isOpen={openDelete}
        onConfirm={handleDelete}
        onCancel={() => setOpenDelete(false)}
      />
      <div>
        <Buttons
          data="Atrás"
          onClick={() => router.push(`/pages/users/${id}/${date}?name=${routineName}`)}
          className="flex bg-transparent hover:bg-transparent text-white cursor-pointer"
        >
          <ChevronLeft className=" text-white" />
        </Buttons>
      </div>
      <div className="flex flex-col p-5 min-h-screen lg:flex-row gap-8">
        <div className="w-full max-w-[380px] ">
          <div className="max-h-[70vh] h-full sticky top-11">
            <h2 className="text-2xl font-semibold mb-4 text-[#D4FF00]">
              {title}
            </h2>

            {/* VOLVER A IMAGEN */}
            {showVideo && (
              <button
                onClick={() => setShowVideo(false)}
                className="mb-2 text-sm text-gray-400 hover:text-[#D4FF00] cursor-pointer"
              >
                ⟵ Volver a la imagen
              </button>
            )}

            <div className="relative aspect-square h-full w-full rounded-xl border border-gray-700 overflow-hidden max-w-[380px]">

              {/* VIDEO */}
              {exerciseVideo && showVideo ? (
                <video
                  src={exerciseVideo}
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

                  {/* PLAY */}
                  {exerciseVideo && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition"
                    >
                      <span className="w-14 h-14 bg-[#D4FF00] rounded-full flex items-center justify-center backdrop-blur-sm">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="black"
                          viewBox="0 0 24 24"
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

        <div className="w-full">
          <div className="flex justify-end">
            <button
              onClick={() => setOpenDelete(true)}
              className="px-4 py-2 border border-white text-white bg-transparent 
  rounded-lg transition hover:bg-white/10 cursor-pointer"
            >
              Eliminar ejercicio
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
                onChange={(e) => {
                  setRestTime(e.target.value);
                  if (restError) setRestError(""); // limpiar error al escribir
                }}
                placeholder="Agregar el tiempo en minutos"
                className={`bg-[#2B2B2B] border text-white rounded-lg px-4 py-2 focus:outline-none 
    ${restError
                    ? "border-red-500 focus:ring-2 focus:ring-red-500"
                    : "border-gray-700 focus:ring-2 focus:ring-[#D4FF00]"
                  }`}
              />

              {restError && (
                <p className="text-red-500 text-sm mt-1">{restError}</p>
              )}

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
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 transition cursor-pointer"
                      >
                        ✕
                      </button>
                    )}

                    <h2 className="text-xl font-semibold text-[#D4FF00]">
                      Serie {index + 1}
                    </h2>

                    <label className="text-lg text-gray-300">
                      Repeticiones
                    </label>

                    <input
                      type="text"
                      value={rep}
                      onChange={(e) => {
                        handleSeriesChange(index, e.target.value);

                        // limpiar error solo de esta serie
                        if (seriesErrors[index]) {
                          const updated = [...seriesErrors];
                          updated[index] = "";
                          setSeriesErrors(updated);
                        }
                      }}
                      placeholder="Número de repeticiones"
                      className={`border text-white rounded-lg px-4 py-2 focus:outline-none 
    ${seriesErrors[index]
                          ? "border-red-500 focus:ring-2 focus:ring-red-500"
                          : "border-gray-500 focus:ring-2 focus:ring-[#D4FF00]"
                        }`}
                    />

                    {seriesErrors[index] && (
                      <p className="text-red-500 text-sm mt-1">{seriesErrors[index]}</p>
                    )}

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
                className="bg-white text-black p-4 font-bold hover:bg-[#cbe000] cursor-pointer"
              />
            </div>
          </form>
        </div>
      </div>

      {showModal && (
        <SaveExercise
          title="Actualizado correctamente"
          isOpen={showModal}
          onContinue={() =>
            router.push(
              `/pages/users/${id}/${date}?name=${encodeURIComponent(
                routineName
              )}`
            )
          }
        />
      )}
      {showModalExercise && (
        <ExerciseModal
          isOpen={showModalExercise}
          onClose={() => {
            setShowModalExercise(false);
          }}
          title="Asignar ejercicio"
          setSelectExercise={setSelectExercise}
          setShowConfirm={setShowConfirm}
        ></ExerciseModal>
      )}
      {/* modal para ejercicio seleccionado. */}
      {showConfirm && (
        <ConfirmReplaceExercise
          isOpen={showConfirm}
          onConfirm={() => {
            NewInfoExercise()
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />

      )}

      <AccionBar
        textButton={"Guardar Ejercicios"}
        accionState={accionState}
        useAccionState={(val: any) => {
          if (val) {
            if (canSaveExercise()) {
              setAccionState(true);
            } else {
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
