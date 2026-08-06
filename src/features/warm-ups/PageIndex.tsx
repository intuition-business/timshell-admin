'use client'

import Buttons from "@/components/ui/Buttons";
import { ChevronLeft, CloudUpload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { ModalCheck } from "@/components/modals/ModalCheck";
import WarmUpList from "@/features/warm-ups/WarmUpList";

const MUSCLE_GROUPS = [
  "PECHO", "ESPALDA", "CUADRICEPS", "ISQUITIBIALES",
  "BICEPS", "TRICEPS", "HOMBRO", "ABDOMEN", "GLUTEO", "PANTORRILLA",
];

export default function WarmUpPageIndex() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [clearVideo, setClearVideo] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [updateList, setUpdateList] = useState(false);
  const [showModalCheck, setShowModalCheck] = useState(false);
  const [message, setMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const toggleGroup = (g: string) => {
    setSelectedGroups((prev) =>
      prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]
    );
  };

  const setError = (msg: string) => {
    setGeneralError(msg);
    setTimeout(() => setGeneralError(""), 3000);
    return false;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDurationMinutes("");
    setSelectedGroups([]);
    setVideo(null);
    setPreview("");
    setClearVideo(false);
    setEditingId(null);
    setIsEditing(false);
  };

  const canSave = () => {
    if (!name.trim()) return setError("Debes escribir el nombre");
    if (!description.trim()) return setError("Debes escribir la descripcion");
    if (!durationMinutes || isNaN(Number(durationMinutes))) return setError("Debes ingresar la duracion en minutos");
    if (!video && !preview && !clearVideo) return setError("Debes subir un video");
    return true;
  };

  const generateThumbnail = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const objectUrl = URL.createObjectURL(file);
      const videoEl = document.createElement("video");
      videoEl.preload = "metadata";
      videoEl.muted = true;
      videoEl.src = objectUrl;
      const cleanup = () => URL.revokeObjectURL(objectUrl);
      videoEl.onloadedmetadata = () => {
        videoEl.currentTime = Math.min(1, videoEl.duration / 2);
      };
      videoEl.onseeked = () => {
        const canvas = document.createElement("canvas");
        canvas.width = videoEl.videoWidth;
        canvas.height = videoEl.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          cleanup();
          if (blob) resolve(blob);
          else reject(new Error("No se pudo generar la miniatura"));
        }, "image/jpeg", 0.8);
      };
      videoEl.onerror = () => { cleanup(); reject(new Error("Error al cargar el video")); };
    });
  };

  const handleVideoChange = (file: File) => {
    if (!file.type.startsWith("video/")) return setError("El archivo debe ser un video");
    setVideo(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!canSave()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      const token = localStorage.getItem("token") || "";

      if (!editingId) {
        formData.append("name", name);
        formData.append("description", description);
        formData.append("duration_in_minutes", durationMinutes);
        formData.append("muscle_groups", JSON.stringify(selectedGroups));
        if (video) {
          formData.append("video", video);
          try {
            const thumb = await generateThumbnail(video);
            formData.append("thumbnail", thumb);
          } catch { /* sin thumbnail */ }
        }
      } else {
        formData.append("name", name);
        formData.append("description", description);
        formData.append("duration_in_minutes", durationMinutes);
        formData.append("muscle_groups", JSON.stringify(selectedGroups));
        if (video) {
          formData.append("video", video);
          try {
            const thumb = await generateThumbnail(video);
            formData.append("thumbnail", thumb);
          } catch { /* sin thumbnail */ }
        } else if (clearVideo) {
          formData.append("clear_video", "true");
        }
      }

      const endpoint = editingId ? `warm-ups/${editingId}` : `warm-ups`;
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${endpoint}`, {
        method,
        body: formData,
        headers: { "x-access-token": token },
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Error al guardar");

      resetForm();
      setUpdateList((prev) => !prev);
      setMessage(resData.message || (editingId ? "Calentamiento actualizado" : "Calentamiento creado"));
      setShowModalCheck(true);
    } catch (error) {
      setError(`Ocurrio un error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const loadWarmUp = (item: any) => {
    if (!item) { resetForm(); return; }
    setName(item.name || "");
    setDescription(item.description || "");
    setDurationMinutes(String(item.duration_in_minutes || ""));
    setSelectedGroups(Array.isArray(item.muscle_groups) ? item.muscle_groups : []);
    setPreview(item.video_url || item.video_thumbnail || "");
    setEditingId(item.id);
    setIsEditing(true);
    setClearVideo(false);
  };

  return (
    <>
      <div className="px-16">
        <Buttons
          data="Atras"
          onClick={() => router.back()}
          className="flex bg-transparent hover:bg-transparent text-white cursor-pointer mb-5"
        >
          <ChevronLeft className="text-white" />
        </Buttons>
        <h2 className="text-3xl font-semibold text-[#D4FF00]">
          {isEditing ? "Editar calentamiento" : name || "Nuevo calentamiento"}
        </h2>
      </div>

      <div className="flex flex-col p-6 ps-16 pb-0 pr-0 lg:flex-row gap-10">

        {/* VIDEO UPLOAD */}
        <div className="w-full max-w-[21.875rem]">
          <label className="cursor-pointer">
            <div className={`h-[42.5rem] border-2 border-dashed ${preview ? "border-gray-700" : "border-[#D4FF00]"} rounded-xl flex items-center justify-center bg-[#1E1E1E] overflow-hidden`}>
              {preview ? (
                <div className="relative h-full w-full">
                  <div className="absolute top-3 right-3 z-50 flex gap-2">
                    <IconPencil className="bg-black p-2 rounded-full border-[#D4FF00] border text-white w-10 h-10" />
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setPreview(""); setVideo(null); setClearVideo(true); }}
                      className="bg-black p-2 rounded-full border-red-500 border text-red-400 w-10 h-10 flex items-center justify-center hover:bg-red-500/20 transition cursor-pointer"
                    >
                      <IconTrash size={20} />
                    </button>
                  </div>
                  <video src={preview} controls className="w-full h-full object-cover" />
                </div>
              ) : (
                <span className="text-gray-400 text-center">
                  <CloudUpload className="w-full h-full max-w-[9.375rem] max-h-20" /> Subir video
                </span>
              )}
            </div>
            <input ref={fileInputRef} type="file" hidden accept="video/*" onChange={(e) => e.target.files && handleVideoChange(e.target.files[0])} />
          </label>
        </div>

        {/* FORM */}
        <div className="max-w-[29.375rem] min-w-[17.5rem] w-4/12 space-y-6">

          {generalError && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg">{generalError}</div>
          )}

          <div>
            <label className="text-gray-300">Nombre</label>
            <input
              type="text"
              placeholder="Nombre del calentamiento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4FF00]"
            />
          </div>

          <div>
            <label className="text-gray-300">Descripcion</label>
            <textarea
              placeholder="Descripcion del ejercicio de calentamiento"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full mt-2 bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4FF00]"
            />
          </div>

          <div>
            <label className="text-gray-300">Duracion (minutos)</label>
            <input
              type="number"
              min={1}
              max={60}
              placeholder="Ej: 2"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="w-full mt-2 bg-[#2B2B2B] border border-gray-700 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D4FF00]"
            />
          </div>

          <div>
            <label className="text-gray-300 block mb-2">Grupos musculares</label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGroup(g)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium border transition cursor-pointer ${
                    selectedGroups.includes(g)
                      ? "bg-[#D4FF00] text-black border-[#D4FF00]"
                      : "bg-[#2B2B2B] text-gray-300 border-gray-600 hover:border-[#D4FF00]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {isEditing && (
            <Buttons
              onClick={resetForm}
              data="Cancelar"
              className="w-full bg-gray-600 text-white font-bold py-4 hover:bg-gray-700 mb-2"
            />
          )}

          <Buttons
            onClick={handleSave}
            data={loading ? (isEditing ? "Guardando..." : "Creando...") : (isEditing ? "Actualizar calentamiento" : "Crear calentamiento")}
            disabled={loading}
            className={`w-full bg-white text-black font-bold py-4 hover:bg-[#D4FF00] ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          />
        </div>

        <WarmUpList onEdit={loadWarmUp} update={updateList} setUpdate={setUpdateList} />
      </div>

      <ModalCheck
        isOpen={showModalCheck}
        text={message}
        btnMessage="Continuar"
        onConfirm={() => setShowModalCheck(false)}
      />
    </>
  );
}
