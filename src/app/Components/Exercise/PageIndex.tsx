
'use client'

import ExerciseModal from "@/app/Components/ExerciseModal/ExerciseModal";
import Buttons from "@/app/Components/ui/Buttons";
import { ChevronLeft, CloudUpload } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useRef, useState } from "react";
import ListadoEjercicios from "./ExerciseList";
import { IconEdit, IconPencil } from "@tabler/icons-react";
import { ModalCheck } from "../Modals/ModalCheck";

export default function Page() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  // nuevo campo para grupo muscular
  const [muscleGroup, setMuscleGroup] = useState<string>("");
  const [video, setVideo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");

  const [updateList, setUpdateList] = useState(false);
  const [showModalCheck, setShowModalCheck] = useState(false);

  // editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showModalExercise, setShowModalExercise] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // ==========================
  // IMAGE HANDLER
  // ==========================
  const handleVideoChange = (file: File) => {
    if (!file.type.startsWith("video/")) {
      return setError("El archivo debe ser un video");
    }

    setVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  // ==========================
  // VALIDACIÓN SIMPLE
  // ==========================
  const canSave = () => {
    if (!title.trim()) return setError("Debes escribir el título");
    if (!description.trim()) return setError("Debes escribir la descripción");
    if (!category) return setError("Debes seleccionar una categoría");
    if (!muscleGroup || (muscleGroup !== "small muscle" && muscleGroup !== "large muscle")) {
      return setError("El grupo muscular debe ser \"small muscle\" o \"large muscle\"");
    }
    // si ya hay un preview (video cargado anteriormente) no exige nuevo archivo
    if (!video && !preview) return setError("Debes subir un video");

    return true;
  };

  const setError = (msg: string) => {
    setGeneralError(msg);
    setTimeout(() => setGeneralError(""), 3000);
    return false;
  };

  // ==========================
  // GUARDAR (crear o actualizar)
  // ==========================
  const handleSave = async () => {
    if (!canSave()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      if (!editingId) {
        formData.append("exercise", title);
        formData.append("description", description);
        formData.append("category", category);
        // se envía el valor seleccionado (small muscle / large muscle)
        formData.append("muscle_group", muscleGroup);
        formData.append("at_home", "true");
        if (video) {
          formData.append("video", video);

          // 🔥 Generar thumbnail automático
          const thumbnail = await generateThumbnail(video);
          formData.append("thumbnail", thumbnail);
        }
      } else {
        formData.append("new_exercise", title);
        formData.append("new_description", description);
        formData.append("new_category", category);
        formData.append("new_muscle_group", muscleGroup);
        if (video) {
          formData.append("new_video", video);
          const thumbnail = await generateThumbnail(video);
          formData.append("new_thumbnail", thumbnail);
        }

      }


      const token = localStorage.getItem("token") || "";

      const endpoint = editingId
        ? `exercises/update/${editingId}`
        : `exercises/create`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`,
        {
          method,
          body: formData,
          headers: {
            // Content-Type is automatically set by the browser when sending FormData
            "x-access-token": token,
          },
        }
      );

      const resData = await res.json();

      if (!res.ok) throw new Error(resData.message || "Error al guardar el ejercicio");

      // después de un update/crear limpiamos el estado
      setTitle("");
      setDescription("");
      setCategory("");
      setMuscleGroup("");
      setVideo(null);
      setPreview("");
      setEditingId(null);
      setIsEditing(false);
      setUpdateList((prev) => !prev);
      setShowModalCheck(true);
      setMessage(resData.message || "Ejercicio creado correctamente");
    } catch (error) {
      setError(
        `Ocurrió un error ${error}`
      );
    } finally {
      setLoading(false);
    }
  };

  const generateThumbnail = (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.src = URL.createObjectURL(file);
      video.currentTime = 1;

      video.onloadeddata = () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
          if (blob) {
            console.log("Tamaño en bytes:", blob.size);
            console.log("Tamaño en KB:", (blob.size / 1024).toFixed(2) + " KB");
            console.log("Tamaño en MB:", (blob.size / (1024 * 1024)).toFixed(2) + " MB");

            resolve(blob);
          }
        }, "image/jpeg", 0.8);
      };
    });
  };

  // ==========================
  // CARGAR EJERCICIO EXISTENTE
  // ==========================
  const loadExercise = async (item: any) => {
    // Si se llama con null (por ejemplo después de eliminar), limpiamos el formulario
    if (!item) {
      setTitle("");
      setDescription("");
      setCategory("");
      setMuscleGroup("");
      setVideo(null);
      setPreview("");
      setEditingId(null);
      setIsEditing(false);
      return;
    }

    setLoading(true);
    const id = item?.id;
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}exercises/single/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "x-access-token": token,
          },
        }
      );

      if (!res.ok) throw new Error("No se pudo obtener el ejercicio");
      const json = await res.json();
      const exercise = json.data;

      setTitle(exercise.exercise || "");
      setDescription(exercise.description || "");
      setCategory(exercise.category || "");
      if (exercise.video_url) {
        setPreview(exercise.video_url);
      } else if (exercise.thumbnail_url) {
        setPreview(exercise.thumbnail_url);
      }
      // cargar grupo muscular si existe
      if (exercise.muscle_group) {
        setMuscleGroup(exercise.muscle_group);
      }
      setEditingId(id);
      setIsEditing(true);
    } catch (e) {
      console.error("Error cargando ejercicio", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="px-16">
        <Buttons
          data="Atrás"
          onClick={() => router.back()}
          className="flex bg-transparent hover:bg-transparent text-white cursor-pointer mb-5"
        >
          <ChevronLeft className=" text-white" />
        </Buttons>
        <h2 className="text-3xl font-semibold text-[#D4FF00]">
          {isEditing ? "Editar ejercicio" : title || "Nuevo ejercicio"}
        </h2>
      </div>

      <div className="flex flex-col p-6 ps-16 pb-0 pr-0 lg:flex-row gap-10">

        {/* IMAGE UPLOAD */}
        <div className="w-full max-w-[350px]">
          <label className="cursor-pointer">
            <div className={`h-[680px] border-2 border-dashed ${preview ? 'border-gray-700' : ' border-[#D4FF00]'} rounded-xl flex items-center justify-center bg-[#1E1E1E] overflow-hidden`}>
              {preview ? (
                <div className="relative h-full w-full">
                  <div className="absolute top-3 right-3 z-50">
                    <IconPencil className=" bg-black p-2 rounded-full border-[#D4FF00] border text-white w-10 h-10"></IconPencil>
                  </div>
                  <video
                    src={preview}
                    controls
                    className="w-full h-full object-cover"
                  />
                </div>

              ) : (
                <span className="text-gray-400 text-center">
                  <CloudUpload className="w-full h-full  max-w-[150px] max-h-20"></CloudUpload> Subir archivo
                </span>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              accept="video/*"
              onChange={(e) =>
                e.target.files && handleVideoChange(e.target.files[0])
              }
            />
          </label>
        </div>

        {/* FORM */}
        <div className="max-w-[470px] min-w-[280px] w-4/12 space-y-6">



          {generalError && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg">
              {generalError}
            </div>
          )}

          {/* TITULO */}
          <div>
            <label className="text-gray-300">Título</label>
            <input
              type="text"
              placeholder="Escribe el título del ejercicio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-2 bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4FF00]"
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="text-gray-300">Descripción</label>
            <textarea
              placeholder="Escribe la descripción del ejercicio."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full mt-2 bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4FF00]"
            />
          </div>

          {/* CATEGORÍA */}
          <div>
            <label className="text-gray-300">Categoría</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mt-2 bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4FF00]"
            >
              <option value="">Asignar categoría</option>
              <option value="piernas">Piernas</option>
              <option value="pecho">Pecho</option>
              <option value="espalda">Espalda</option>
              <option value="hombros">Hombros</option>
              <option value="brazos">Brazos</option>
            </select>
          </div>

          {/* GRUPO MUSCULAR */}
          <div>
            <label className="text-gray-300">Grupo muscular</label>
            <select
              value={muscleGroup}
              onChange={(e) => setMuscleGroup(e.target.value)}
              className="w-full mt-2 bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4FF00]"
            >
              <option value="">Seleccionar grupo muscular</option>
              <option value="small muscle">Musculo pequeño</option>
              <option value="large muscle">Musculo grande</option>
            </select>
          </div>

          {/* BOTÓN */}
          {isEditing && (
            <Buttons
              onClick={() => {
                setEditingId(null);
                setIsEditing(false);
                setTitle("");
                setDescription("");
                setCategory("");
                setMuscleGroup("");
                setVideo(null);
                setPreview("");
              }}
              data="Cancelar"
              className="w-full bg-gray-600 text-white font-bold py-4 hover:bg-gray-700 mb-2"
            />
          )}

          <Buttons
            onClick={handleSave}
            data={
              loading
                ? isEditing
                  ? "Guardando..."
                  : "Creando ejercicio..."
                : isEditing
                  ? "Actualizar ejercicio"
                  : "Crear ejercicio"
            }
            disabled={loading}
            className={`w-full bg-white text-black font-bold py-4 hover:bg-[#D4FF00] ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
        <ListadoEjercicios onEdit={loadExercise} update={updateList} setUpdate={setUpdateList} />
      </div>
      {/* MANTENEMOS EL MODAL */}
      {showModalExercise && (
        <ExerciseModal
          isOpen={showModalExercise}
          onClose={() => setShowModalExercise(false)}
          title="Asignar ejercicio"
        />
      )}
      {/* { checkmodal} */
        <ModalCheck
          isOpen={showModalCheck}
          text={message}
          btnMessage="Continuar"
          onConfirm={() => setShowModalCheck(false)}
        />
      }
    </>
  );
}