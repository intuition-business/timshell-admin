"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ExerciseModal from "@/features/exercise/ExerciseModal";
import { SaveExercise } from "@/features/exercise/SaveExercise";
import Loading from "@/components/loading/Loading";
import AccionBar from "@/components/navbar/ActionBar";
import Buttons from "@/components/ui/Buttons";
import { ConfirmReplaceExercise } from "@/features/exercise/ConfirmReplaceExercise";
import { ConfirmDeleteExercise } from "@/features/exercise/modalConfirm";
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
  const [idExersice, setidExersice] = useState(idExersiceProps || "");
  const [error, setError] = useState('')
  const [restError, setRestError] = useState("");
  const [seriesErrors, setSeriesErrors] = useState<string[]>([]);
  const [exerciseVideo, setVideoExercise] = useState("")
  const [showVideo, setShowVideo] = useState(false);
  const [dayID, setDayID] = useState("");
  const [dbID, setDbId] = useState("");

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

      // Validación previa: estos IDs vienen del GET; si faltan, el backend
      // responde "Faltan: plan_id, day_rutina_id, db_id".
      if (!rutinaId || !dayID || !dbID) {
        console.error("Faltan IDs para editar:", { rutinaId, dayID, dbID });
        setError("No se pudieron cargar los datos de la rutina. Recarga e intenta de nuevo.");
        alert("No se pudieron cargar los datos de la rutina. Recarga e intenta de nuevo.");
        return;
      }

      const body = {
        "plan_id": rutinaId,
        "day_rutina_id": dayID,
        "db_id": dbID,
        updates: {
          /*  exercise_name: title, */
          Series: series.length,
          Descanso: restTime,
          "Detalle series": detalleSeries,
          /*     description,
              video_url: exerciseVideo,
              thumbnail_url: exerciseImage, */
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

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Error edit-exercise:", data);
        const msg = data?.message || "Error al editar ejercicio";
        setError(msg);
        alert(msg);
        return;
      }

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}routines/search-in-generated?fecha_rutina=${date}&user_id=${id}&exercise_id=${idExersiceProps}`,
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
        console.log("Respuesta search-in-generated (edición):", data);

        // La respuesta puede traer el ejercicio como objeto único (`exercise`)
        // o dentro de un arreglo (`ejercicios`), según el endpoint.
        const resp = data?.response ?? data;
        const ex =
          resp?.exercise ??
          (Array.isArray(resp?.ejercicios)
            ? resp.ejercicios.find(
                (e: any) =>
                  e.exercise_id?.toString() === idExersiceProps?.toString()
              ) ?? resp.ejercicios[0]
            : null);

        if (ex) {
          // El id de rutina y el id del día llegan con nombres distintos según
          // el endpoint (plan_id / rutina_id, day_rutina_id), así que probamos
          // todas las ubicaciones posibles.
          const planId =
            data?.plan_id ??
            data?.rutina_id ??
            resp?.plan_id ??
            resp?.rutina_id ??
            ex?.plan_id ??
            ex?.rutina_id ??
            "";
          const dayRutId =
            data?.day_rutina_id ??
            resp?.day_rutina_id ??
            ex?.day_rutina_id ??
            "";

          setRutinaName(data?.routine_name ?? resp?.routine_name ?? "");
          setRutinaId(planId !== null && planId !== undefined ? planId.toString() : "");
          setDayID(dayRutId !== null && dayRutId !== undefined ? dayRutId.toString() : "");
          setidExersice(ex.exercise_id);
          setDbId(ex.db_id);
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
        } else {
          console.warn("No se encontró el ejercicio en la respuesta:", data);
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
            day_fecha: date,
            db_id: dbID,
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
          onClick={() => router.push(`/users/${id}/${date}?name=${routineName}`)}
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
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={3}
                value={restTime}
                onChange={(e) => {
                  let v = e.target.value;

                  // Quitar todo lo que no sea número
                  v = v.replace(/\D/g, "");

                  // Evitar ceros a la izquierda (ej: 007 → 7)
                  if (v.length > 1) v = v.replace(/^0+/, "");

                  setRestTime(v);

                  if (restError) setRestError("");
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
                      inputMode="numeric"
                      value={rep}
                      onChange={(e) => {
                        let v = e.target.value.trim();

                        // Permitir solo números y guion
                        v = v.replace(/[^0-9-]/g, "");

                        // Evitar más de un guion
                        const parts = v.split("-");
                        if (parts.length > 2) {
                          v = parts[0] + "-" + parts[1];
                        }

                        // Evitar guion al inicio
                        if (v.startsWith("-")) {
                          v = v.slice(1);
                        }

                        handleSeriesChange(index, v);

                        // Limpiar error solo de esta serie
                        if (seriesErrors[index]) {
                          const updated = [...seriesErrors];
                          updated[index] = "";
                          setSeriesErrors(updated);
                        }
                      }}
                      placeholder="Ej: 12-15"
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
              `/users/${id}/${date}?name=${encodeURIComponent(
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
