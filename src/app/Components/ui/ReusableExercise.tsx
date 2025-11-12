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
      className="flex items-center p-4  bg-[#282828] border-2 border-[#777777] rounded-2xl  w-full "
    >
      <div className="">
        {image && (
          <div className="h-20 rounded-xl overflow-hidden">
            <Image
              src={image}
              alt={title || "Imagen"}
              width={400}
              height={200}
              className="object-cover w-full"
            />
          </div>
        )}
      </div>

      <div className="mx-9">
        {video && !image && (
          <div className="w-full h-48 mb-4 rounded-xl overflow-hidden">
            <video
              src={video}
              controls
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        )}

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
