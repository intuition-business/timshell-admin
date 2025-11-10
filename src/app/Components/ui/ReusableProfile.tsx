"use client";

import React from "react";

interface ProfileCardProps {
  name: string;
  role?: string; // Ej: "Entrenador", "Usuario", etc.
  imageUrl?: string;
  onClick?: () => void; // opcional (por ejemplo, para abrir detalles)
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role = "Usuario",
  imageUrl = "/default-avatar.png",
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4  rounded-2xl  shadow-md "
    >
      {/* Imagen del perfil */}
      <div className="relative w-16 h-16">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover rounded-full border-2 border-[#16459D]"
        />
      </div>

      {/* Información del usuario */}
      <div className="flex items-center gap-4 ">
        <h3 className="text-lg font-semibold ">{name}</h3>
        <p className="text-md text-[#dff400]">* {role}</p>
      </div>
    </div>
  );
};

export default ProfileCard;
