"use client";

import { Star } from "lucide-react";

interface StarsProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export const Stars = ({ rating, size = 16, showNumber = true }: StarsProps) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const totalStars = 5;

  return (
    <div className="flex justify-center items-center space-x-1">
      {[...Array(totalStars)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < fullStars
              ? "text-yellow-400 fill-yellow-400"
              : hasHalf && i === fullStars
              ? "text-yellow-400 fill-yellow-400 opacity-50"
              : "text-gray-500"
          }
        />
      ))}
      {showNumber && (
        <p className="ml-2 text-sm text-gray-300">{rating.toFixed(1)}</p>
      )}
    </div>
  );
};
