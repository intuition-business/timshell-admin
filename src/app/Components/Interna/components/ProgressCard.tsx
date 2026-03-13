"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import React from "react";

interface ProgressCardProps {
  weight: number; // peso actual (kg)
  variation: number; // variación de peso (kg)
  height: number; // altura (m)
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  weight,
  variation,
  height,
}) => {
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

  // Clasificación del IMC
  const bmiStatus =
    parseFloat(bmi) < 18.5
      ? "Bajo peso"
      : parseFloat(bmi) < 25
        ? "Peso saludable"
        : parseFloat(bmi) < 30
          ? "Sobrepeso"
          : "Obesidad";

  return (
    <div className="flex rounded-2xl shadow-md  border-gray-200 h-auto w-full  mr-9">
      <div className="flex  text-white justify-between  w-full gap-10 ">
        <div className="bg-[#2B2B2B] text-white rounded-xl p-3 flex flex-col items-center w-full justify-center">
          <p className="text-xl ">Peso actual</p>
          <p className="text-2xl font-bold ">{weight} kg</p>
        </div>

        <div className=" bg-[#2B2B2B] rounded-xl p-4  flex flex-col items-center w-full justify-center">
          <p className="text-xl ">Edad</p>
          <div className="flex items-center space-x-1">
            <p
              className={`text-2xl font-bold `}
            >
              {variation}
            </p>
          </div>
        </div>

        <div className="bg-[#2B2B2B] rounded-xl p-4 text-center w-full flex items-center flex-col justify-center">
          <p className="text-xl">Altura</p>
          <p className="text-2xl font-bold ">{height.toFixed(2)} cm</p>
        </div>

        <div className="bg-[#2B2B2B] rounded-xl p-4 text-center w-full justify-center">
          <p className="text-xl">IMC estimado</p>
          <p className="text-2xl font-bold ">{bmi}</p>
          <span>{bmiStatus}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
