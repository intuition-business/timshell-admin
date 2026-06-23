"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useSocket, ChatMessage } from "@/features/chat/useSocket";
import { ChevronLeft, ChevronRight, MoreVertical, Send, Smile, Paperclip, Mic, X } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import ChatAudioPlayer from "@/features/chat/ChatAudioPlayer";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString("es-CO", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Hoy";
  if (d.toDateString() === yesterday.toDateString()) return "Ayer";
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

interface UserInfo {
  id: string;
  name: string;
  email: string;
  user_image: string | null;
  peso?: number;
  estatura?: number;
  objetivo?: string;
}

function UserAvatar({ src, name, size = 40 }: { src: string | null; name: string; size?: number }) {
  const initials = name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "?";
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-full object-cover flex-shrink-0 border-2 border-[#333]"
        style={{ width: size, height: size }}
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    );
  }
  return (
    <div
      className="rounded-full bg-[#dff400] flex items-center justify-center flex-shrink-0 font-bold text-black border-2 border-[#333]"
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  );
}

export default function ChatPage() {
  const auth = useAuth();
  const { connected, chats, messages, activeReceiverId, openChat, sendMessage, sendFiles, markSeen } =
    useSocket(auth?.token ?? null);

  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [allUsers, setAllUsers] = useState<UserInfo[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showInfo, setShowInfo] = useState(true);
  const [showChats, setShowChats] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.receiverId === activeReceiverId);

  const myId = (() => {
    try {
      return auth?.token
        ? JSON.parse(atob(auth.token.split(".")[1]))?.userId?.toString()
        : null;
    } catch { return null; }
  })();

  // scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // marcar vistos al abrir chat
  useEffect(() => {
    if (!activeReceiverId || !messages.length) return;
    messages.forEach((m) => {
      if (!m.seen && m.user_id_sender?.toString() === activeReceiverId) markSeen(m.id);
    });
  }, [messages, activeReceiverId]);

  // cargar usuarios: tanto admin como entrenador ven a todos los usuarios
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const mapUser = (u: any): UserInfo => ({
      id: (u.id ?? u.user_id)?.toString(),
      name: u.name || "",
      email: u.email || u.user_email || "",
      user_image: u.user_image || u.image || null,
      peso: u.peso,
      estatura: u.estatura,
      objetivo: u.objetivo,
    });

    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}admin/users?page=1&limit=100`, {
      headers: { "x-access-token": token },
    })
      .then((r) => r.json())
      .then((json) => {
        const rows = json?.data;
        if (!rows) return;
        const mapped: UserInfo[] = rows.map(mapUser);
        // deduplicar por ID (el JOIN con asignaciones puede traer filas duplicadas)
        const unique = mapped.filter((u, i, arr) => arr.findIndex((x) => x.id === u.id) === i);
        setAllUsers(unique);
      })
      .catch(() => {});
  }, []);

  // actualizar info del panel derecho cuando cambia el chat activo
  useEffect(() => {
    if (!activeReceiverId) { setUserInfo(null); return; }
    const found = allUsers.find((u) => u.id === activeReceiverId);
    if (found) setUserInfo(found);
  }, [activeReceiverId, allUsers]);

  const handleSend = () => {
    if (!activeReceiverId || !input.trim()) return;
    sendMessage(activeReceiverId, input.trim());
    setInput("");
    setShowEmoji(false);
    inputRef.current?.focus();
  };

  // cerrar emoji picker al click fuera
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    };
    if (showEmoji) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showEmoji]);

  const onEmojiClick = (data: EmojiClickData) => {
    setInput((prev) => prev + data.emoji);
    inputRef.current?.focus();
  };

  const uploadFile = async (file: File): Promise<{ file_url: string; file_type: string } | null> => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}chat/upload-media`, {
        method: "POST",
        headers: { "x-access-token": token },
        body: form,
      });
      const data = await res.json();
      if (data.error || !data.file_url) return null;
      const mime = data.mimetype as string;
      const file_type = mime.startsWith("image/") ? "image" : mime.startsWith("video/") ? "video" : "audio";
      return { file_url: data.file_url, file_type };
    } catch {
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeReceiverId) return;
    e.target.value = "";
    setUploading(true);
    const result = await uploadFile(file);
    setUploading(false);
    if (result) sendFiles(activeReceiverId, [result]);
  };

  const startRecording = async () => {
    if (!activeReceiverId) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/ogg";
      const recorder = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) audioChunksRef.current.push(e.data); };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setRecording(true);
      setRecordingSeconds(0);
      recordingTimerRef.current = setInterval(() => setRecordingSeconds((s) => s + 1), 1000);
    } catch {
      alert("No se pudo acceder al micrófono");
    }
  };

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;
    if (!recorder || !activeReceiverId) return;
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    setRecording(false);
    setRecordingSeconds(0);

    recorder.stop();
    recorder.stream.getTracks().forEach((t) => t.stop());

    recorder.onstop = async () => {
      const blob = new Blob(audioChunksRef.current, { type: recorder.mimeType });
      const ext = recorder.mimeType.includes("webm") ? "webm" : "ogg";
      const file = new File([blob], `audio.${ext}`, { type: recorder.mimeType });
      setUploading(true);
      const result = await uploadFile(file);
      setUploading(false);
      if (result) sendFiles(activeReceiverId, [{ ...result, file_type: "audio" }]);
    };
  }, [activeReceiverId]);

  // agrupar mensajes por fecha
  const grouped: { date: string; label: string; msgs: ChatMessage[] }[] = [];
  messages.forEach((m) => {
    const date = new Date(m.created_at).toDateString();
    const last = grouped[grouped.length - 1];
    if (last && last.date === date) last.msgs.push(m);
    else grouped.push({ date, label: formatDateLabel(m.created_at), msgs: [m] });
  });

  return (
    <div className="flex h-screen bg-[#1A1A1A] overflow-hidden">

      {/* ────── COLUMNA 1: Lista de chats ────── */}
      {showChats && (
      <aside className="w-[380px] flex-shrink-0 flex flex-col border-r border-[#1e1e1e]">
        {/* Título */}
        <div className="px-4 py-4 flex items-center gap-2 border-b border-[#1e1e1e]">
          <button
            onClick={() => setShowChats(false)}
            className="text-[#dff400] hover:opacity-80 transition-opacity"
            aria-label="Colapsar"
          >
            <ChevronLeft size={22} />
          </button>
          <h2 className="flex-1 text-center text-[#dff400] font-bold text-[24px]">Chats</h2>
          <span className="w-[22px]" aria-hidden />
        </div>

        {/* Subtítulo + estado de conexión */}
        <div className="px-5 pt-3 pb-1.5 flex items-center gap-2">
          <h3 className="text-white font-bold text-base">Historial de chats</h3>
          <span
            className={`w-2 h-2 rounded-full flex-shrink-0 ${connected ? "bg-[#dff400]" : "bg-red-500"}`}
            title={connected ? "Conectado" : "Desconectado"}
          />
        </div>

        {/* Buscador */}
        <div className="px-4 pb-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuario..."
            className="w-full bg-[#1c1c1c] text-white placeholder-gray-500 rounded-xl px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-[#dff400] border border-[#2a2a2a]"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {(() => {
            const filtered = allUsers.filter((u) =>
              u.name.toLowerCase().includes(search.toLowerCase()) ||
              u.email.toLowerCase().includes(search.toLowerCase())
            );

            if (filtered.length === 0) {
              return <p className="text-gray-500 text-sm text-center mt-10 px-4">Sin resultados</p>;
            }

            return filtered.map((user) => {
              const chatData = chats.find((c) => c.receiverId === user.id);
              const active = activeReceiverId === user.id;
              return (
                <button
                  key={user.id}
                  onClick={() => openChat(user.id)}
                  className={`w-full flex items-center gap-2.5 px-2.5 py-2 mb-0.5 rounded-xl text-left transition-colors ${
                    active ? "bg-[#1c1c1c] ring-1 ring-[#2f2f2f]" : "hover:bg-[#161616]"
                  }`}
                >
                  <UserAvatar src={user.user_image} name={user.name} size={48} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-white font-semibold text-[18px] truncate">{user.name}</span>
                      {chatData?.lastMessageTime && (
                        <span className="text-gray-500 text-xs flex-shrink-0">
                          {formatDateShort(chatData.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-0.5 gap-2">
                      <span className="text-gray-400 text-base truncate">
                        {chatData?.lastMessage ||
                          (chatData?.attachmentType === "image" ? "📷 Imagen" :
                           chatData?.attachmentType === "video" ? "🎥 Video" :
                           user.email || "Sin mensajes")}
                      </span>
                      {chatData?.unreadCount ? (
                        <span className="bg-[#dff400] text-black text-[10px] font-bold rounded-full min-w-[18px] h-[18px] px-1 flex items-center justify-center flex-shrink-0">
                          {chatData.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              );
            });
          })()}
        </div>
      </aside>
      )}

      {/* ────── COLUMNA 2: Ventana de mensajes ────── */}
      <main className="relative flex-1 flex flex-col min-w-0 border-r border-[#1e1e1e]">
        {!activeReceiverId ? (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 gap-3">
            {!showChats && (
              <button
                onClick={() => setShowChats(true)}
                className="absolute top-4 left-4 text-[#dff400] hover:opacity-80 transition-opacity"
                aria-label="Mostrar chats"
              >
                <ChevronRight size={22} />
              </button>
            )}
            <p className="text-lg font-medium text-gray-500">Selecciona una conversación</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="px-5 py-3 border-b border-[#1e1e1e] bg-[#282828] flex items-center gap-3">
              {!showChats && (
                <button
                  onClick={() => setShowChats(true)}
                  className="text-[#dff400] hover:opacity-80 transition-opacity flex-shrink-0"
                  aria-label="Mostrar chats"
                >
                  <ChevronRight size={22} />
                </button>
              )}
              <UserAvatar
                src={userInfo?.user_image ?? activeChat?.receiverImage ?? null}
                name={userInfo?.name ?? activeChat?.receiverName ?? ""}
                size={42}
              />
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-[15px] truncate">{userInfo?.name ?? activeChat?.receiverName}</p>
                <p className="text-[#dff400] text-xs">En línea</p>
              </div>
              <button
                onClick={() => setShowInfo((v) => !v)}
                className={`transition-colors ${showInfo ? "text-[#dff400]" : "text-gray-400 hover:text-white"}`}
                aria-label="Mostrar información del usuario"
              >
                <MoreVertical size={20} />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col bg-white/[0.02]">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600 text-sm">No hay mensajes aún</p>
                </div>
              ) : (
                grouped.map(({ date, label, msgs }, gi) => (
                  <div key={date}>
                    {/* Separador de fecha (solo entre días distintos) */}
                    {gi > 0 && (
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-[#1e1e1e]" />
                        <span className="text-gray-500 text-xs">{label}</span>
                        <div className="flex-1 h-px bg-[#1e1e1e]" />
                      </div>
                    )}

                    {msgs.map((msg) => {
                      const isMine = msg.user_id_sender?.toString() === myId;
                      return (
                        <div key={msg.id} className={`flex mb-3 ${isMine ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[62%] rounded-2xl px-4 py-3 ${
                              isMine ? "bg-[#2f2f2f]" : "bg-[#222222]"
                            }`}
                          >
                            {msg.files?.map((f, i) =>
                              f.file_type === "image" ? (
                                <img key={i} src={f.file_url} alt="imagen" className="rounded-xl mb-2 max-w-full max-h-64 object-cover" />
                              ) : f.file_type === "video" ? (
                                <video key={i} src={f.file_url} controls className="rounded-xl mb-2 max-w-full" />
                              ) : f.file_type === "audio" ? (
                                <ChatAudioPlayer key={i} src={f.file_url} time={formatTime(msg.created_at)} />
                              ) : null
                            )}
                            {msg.message && (
                              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-4 border-t border-[#1e1e1e]">
              {/* Emoji picker flotante */}
              {showEmoji && (
                <div ref={emojiPickerRef} className="absolute bottom-[80px] left-[300px] z-50">
                  <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} height={380} width={320} />
                </div>
              )}

              <div className="flex items-center gap-3">
                {/* Cápsula: emoji + input + paperclip */}
                <div className="flex-1 flex items-center bg-[#1c1c1c] rounded-2xl border border-[#2a2a2a] pl-2 pr-2 py-1.5 gap-1">
                  <button
                    onClick={() => setShowEmoji((v) => !v)}
                    className={`flex-shrink-0 p-2 rounded-xl transition-colors ${showEmoji ? "text-[#dff400]" : "text-gray-400 hover:text-white"}`}
                  >
                    <Smile size={22} />
                  </button>

                  {recording ? (
                    <div className="flex-1 flex items-center gap-2 px-2">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
                      <span className="text-red-400 text-sm">
                        {String(Math.floor(recordingSeconds / 60)).padStart(2, "0")}:{String(recordingSeconds % 60).padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => { if (recordingTimerRef.current) clearInterval(recordingTimerRef.current); setRecording(false); mediaRecorderRef.current?.stream.getTracks().forEach(t => t.stop()); mediaRecorderRef.current = null; }}
                        className="ml-auto text-gray-500 hover:text-white"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder={uploading ? "Subiendo..." : "Escribe un mensaje"}
                      disabled={activeChat?.is_blocked || activeChat?.blocked_by_me || uploading}
                      className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm outline-none disabled:opacity-40 min-w-0"
                    />
                  )}

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading || activeChat?.is_blocked || activeChat?.blocked_by_me}
                    className="flex-shrink-0 p-2 rounded-xl text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                  >
                    <Paperclip size={22} />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*,video/*,audio/*" className="hidden" onChange={handleFileChange} />
                </div>

                {/* Botón enviar (lime) */}
                <button
                  onClick={recording ? stopRecording : handleSend}
                  disabled={(!input.trim() && !recording) || activeChat?.is_blocked || activeChat?.blocked_by_me}
                  className="flex-shrink-0 bg-[#dff400] text-black rounded-2xl p-3 hover:bg-[#c8e000] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={20} />
                </button>

                {/* Micrófono (mensajes de voz) */}
                {!recording && (
                  <button
                    onClick={startRecording}
                    disabled={activeChat?.is_blocked || activeChat?.blocked_by_me || uploading}
                    className="flex-shrink-0 p-3 rounded-2xl text-gray-400 hover:text-white transition-colors disabled:opacity-40"
                  >
                    <Mic size={20} />
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* ────── COLUMNA 3: Info del usuario ────── */}
      {showInfo && activeReceiverId && (
      <aside className="w-[300px] flex-shrink-0 flex flex-col">
        <div className="px-4 py-4 flex items-center gap-2 border-b border-[#1e1e1e]">
          <button
            onClick={() => setShowInfo(false)}
            className="text-[#dff400] hover:opacity-80 transition-opacity"
            aria-label="Cerrar"
          >
            <ChevronRight size={22} />
          </button>
          <h2 className="flex-1 text-center text-white font-bold text-[24px]">Chats</h2>
          <span className="w-[22px]" aria-hidden />
        </div>

        {!activeReceiverId ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600 text-xs text-center px-4">Selecciona un chat para ver la info</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-5">
            {/* Avatar + nombre */}
            <div className="flex flex-col items-center gap-3">
              <UserAvatar
                src={userInfo?.user_image ?? activeChat?.receiverImage ?? null}
                name={userInfo?.name ?? activeChat?.receiverName ?? ""}
                size={84}
              />
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-white font-bold text-lg">{userInfo?.name ?? activeChat?.receiverName}</p>
                <span className="bg-[#dff400]/15 text-[#dff400] text-[11px] font-medium px-3 py-0.5 rounded-full">
                  En linea
                </span>
              </div>
            </div>

            <div className="h-px bg-[#1e1e1e]" />

            {/* Información del usuario */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[#dff400] font-bold text-base text-center">Información del usuario</h3>
              <div className="flex flex-col gap-4 px-1">
                <div>
                  <p className="text-white font-semibold text-sm">Objetivo</p>
                  <p className="text-gray-400 text-sm mt-0.5">{userInfo?.objetivo || "—"}</p>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Peso</p>
                  <p className="text-gray-400 text-sm mt-0.5">{userInfo?.peso ? `${userInfo.peso}kg` : "—"}</p>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Altura</p>
                  <p className="text-gray-400 text-sm mt-0.5">{userInfo?.estatura ? `${userInfo.estatura} cm` : "—"}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
      )}

    </div>
  );
}
