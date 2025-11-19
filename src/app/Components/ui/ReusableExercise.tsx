"use client";

import Image from "next/image";

interface ReusableCardProps {
  title?: string;
  description?: string;
  paragraph?: string;
  image?: string;
  video?: string;
  onClick?: () => void;
}

export default function ReusableExercise({
  title,
  description,
  paragraph,
  image,
  video,
  onClick,
}: ReusableCardProps) {
  return (
    <div
      onClick={onClick}
      className="flex items-center p-4 gap-4  bg-[#282828] border-2 border-[#777777] rounded-2xl w-full "
    >
      <div className="max-w-[130px] w-full bg-gray-900 rounded-lg h-[70px] overflow-hidden">
        {image && (
          <div className="rounded-xl">
            <img
              src={image}
              alt={title || "Imagen"}
              width={130}
              height={70}
              className="object-cover w-full max-w-[130px] max-h-[70px] h-full"
            />
          </div>
        )}
      </div>

      <div className="w-full">
        {title && (
          <h2 className="text-[#D4FF00] text-xl font-semibold mb-2">{title}</h2>
        )}

        {description && (
          <p className="text-gray-300 text-sm mb-2">{description}</p>
        )}

        {paragraph && (
          <p className="text-gray-400 text-sm leading-relaxed">{paragraph}</p>
        )}
      </div>
    </div>
  );
}
