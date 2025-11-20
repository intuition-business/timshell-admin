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
  imageUrl = "/default-avatar.png",
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
              target.src = "/default-avatar.png";
            }}
          />
        ) : (
          <div className="w-full h-full rounded-full border-4 border-[#16459D] bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">
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
      <div className="flex items-center gap-5">
        <h3 className="text-xl font-bold text-white">{name}</h3>
        <p className="text-md text-[#dff400] font-medium"> * {role}</p>
      </div>
    </div>
  );
};


