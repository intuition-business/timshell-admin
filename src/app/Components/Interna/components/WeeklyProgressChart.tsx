"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Line } from "react-chartjs-2";

// Registrar los módulos necesarios de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface WeeklyProgressChartProps {
  dataPoints: number[];
  labels?: string[];
}

const WeeklyProgressChart: React.FC<WeeklyProgressChartProps> = ({
  dataPoints,
  labels = ["Semana 1", "Semana 2", "Semana 3", "Semana 4", "Semana 5"],
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Peso (kg)",
        data: dataPoints,
        borderColor: "#16459D",
        backgroundColor: "rgba(22, 69, 157, 0.2)",
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: "#16459D",
        tension: 0.3, // suaviza la curva
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Evolución Semanal de Peso",
        font: { size: 16 },
        color: "#16459D",
      },
      tooltip: {
        backgroundColor: "#16459D",
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "#16459D",
        borderWidth: 1,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { color: "#555", font: { size: 12 } },
        grid: { color: "#e5e7eb" },
      },
      x: {
        ticks: { color: "#555", font: { size: 12 } },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="bg-[#2B2B2B] rounded-2xl shadow-md p-8 border border-gray-200">
      <Line data={data} options={options} />
    </div>
  );
};

export default WeeklyProgressChart;
