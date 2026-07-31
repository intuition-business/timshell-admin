"use client";

import React from "react";

interface ProfileCardProps {
  name: string;
  role?: string;
  imageUrl?: string;
  onClick?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  name,
  role = "Usuario",
  imageUrl,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex  gap-4   backdrop-blur-sm rounded-2xl shadow-lg "
    >
      <div className="relative">
        {imageUrl && imageUrl !== "/default-avatar.png" ? (
          <img
            src={imageUrl}
            alt={name}
            className=" w-[67px] h-[67px] object-cover rounded-full border-4 border-[#2a2a2b] shadow-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = imageUrl ? imageUrl : '/default-avatar.png';
            }}
          />
        ) : (
          <div className="w-full h-full rounded-full border-4 border-white bg-[#dff400flex items-center justify-center gap-5] flex items-center justify-center shadow-lg">
            <span className="text-[#dff400] font-bold text-sm w-10 h-10 flex items-center justify-center">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
        )}
      </div>

      {/* Información del usuario */}
      <div className="flex items-center gap-3">
        <h3 className="text-base font-bold text-white">{name}</h3>
        <p className="text-sm text-[#dff400] font-medium">* {role}</p>
      </div>
    </div>
  );
};


