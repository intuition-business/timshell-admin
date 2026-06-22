"use client";

import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export interface ChatPreview {
  receiverId: string;
  receiverName: string;
  receiverImage: string | null;
  lastMessage: string | null;
  lastMessageTime: string | null;
  unreadCount: number;
  attachmentType: string | null;
  attachmentUrl: string | null;
  blocked_by_me: boolean;
  is_blocked: boolean;
}

export interface ChatMessage {
  id: string;
  user_id_sender: string;
  user_name_sender: string;
  user_image_sender: string | null;
  user_id_receiver: string;
  user_name_receiver: string;
  user_image_receiver: string | null;
  message: string;
  files: { file_url: string; file_type: "image" | "video" | "audio" | string }[];
  created_at: string;
  seen: boolean;
}

export function useSocket(token: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeReceiverId, setActiveReceiverId] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    socket.on("my-chats-list", (data: ChatPreview[]) => {
      setChats(data);
    });

    socket.on("chat-history", (data: ChatMessage[]) => {
      setMessages(data);
    });

    socket.on("receive-message", () => {
      // el backend ya emite chat-history actualizado, solo usamos ese
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const openChat = (receiverId: string) => {
    setActiveReceiverId(receiverId);
    setMessages([]);
    socketRef.current?.emit("join-chat", receiverId);
  };

  const sendMessage = (receiverId: string, message: string) => {
    if (!message.trim()) return;
    socketRef.current?.emit("send-message", { receiverId, message });
  };

  const sendFiles = (receiverId: string, files: { file_url: string; file_type: string }[], message = "") => {
    socketRef.current?.emit("send-message", { receiverId, message, files });
  };

  const markSeen = (messageId: string) => {
    socketRef.current?.emit("mark-seen", messageId);
  };

  return { connected, chats, messages, activeReceiverId, openChat, sendMessage, sendFiles, markSeen };
}
