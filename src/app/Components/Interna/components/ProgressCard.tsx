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
  const bmi = (weight / (height * height)).toFixed(1);
  const isGain = variation > 0;

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
    <div className="flex  rounded-2xl shadow-md  border-gray-200 h-auto w-[1394px] ">
      <div className="flex  text-white justify-between  w-full gap-10 ">
        <div className="bg-[#2B2B2B] text-white rounded-xl p-3 flex flex-col items-center w-full">
          <p className="text-xl ">Peso actual</p>
          <p className="text-2xl font-bold ">{weight} kg</p>
        </div>

        <div className=" bg-[#2B2B2B] rounded-xl p-4  flex flex-col items-center w-full">
          <p className="text-xl ">Variación</p>
          <div className="flex items-center space-x-1">
            {isGain ? (
              <ArrowUp className="h-5 w-5 text-[#dff400]" />
            ) : (
              <ArrowDown className="h-5 w-5 text-red-500" />
            )}
            <p
              className={`text-xl font-semibold ${
                isGain ? "text-[#dff400]" : "text-red-600"
              }`}
            >
              {variation > 0 ? `+${variation}` : variation} kg
            </p>
          </div>
        </div>

        <div className="bg-[#2B2B2B] rounded-xl p-4 text-center w-full ">
          <p className="text-xl">Altura</p>
          <p className="text-2xl font-bold ">{height.toFixed(2)} cm</p>
        </div>

        <div className="bg-[#2B2B2B] rounded-xl p-4 text-center w-full">
          <p className="text-xl">IMC estimado</p>
          <p className="text-2xl font-bold ">{bmi}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressCard;
