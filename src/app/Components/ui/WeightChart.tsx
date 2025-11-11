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

interface WeightChartProps {
  dataPoints: number[];
  labels?: string[];
  title?: string;
}

const WeightChart: React.FC<WeightChartProps> = ({
  dataPoints,
  labels = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  title = "Evolución de tu peso",
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Peso (kg)",
        data: dataPoints,
        borderColor: "#ef4444",
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: "#ef4444",
        pointBorderColor: "#ffffff",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: { 
          size: 18,
          weight: "bold" as const,
        },
        color: "#ef4444",
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ef4444",
        bodyColor: "#ffffff",
        borderColor: "#ef4444",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} kg`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { 
          color: "#ffffff", 
          font: { size: 12 },
          callback: function(value: any) {
            return value + " kg";
          }
        },
        grid: { 
          color: "rgba(255, 255, 255, 0.1)",
          borderDash: [5, 5]
        },
        border: {
          display: false
        }
      },
      x: {
        ticks: { 
          color: "#ffffff", 
          font: { size: 12 } 
        },
        grid: { 
          display: false 
        },
        border: {
          display: false
        }
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
      <div className="flex gap-4 mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full"></span>
          <span className="text-white text-sm">Subida de peso</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          <span className="text-white text-sm">Bajada de peso</span>
        </div>
      </div>
      <div className="h-72">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WeightChart;