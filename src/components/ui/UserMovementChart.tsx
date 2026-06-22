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

interface UserMovementChartProps {
  dataPoints?: number[];
  labels?: string[];
  title?: string;
}

const UserMovementChart: React.FC<UserMovementChartProps> = ({
  dataPoints = [120, 135, 142, 138, 150, 165, 180],
  labels = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul"],
  title = "Suscripciones mensuales",
}) => {
  const data = {
    labels,
    datasets: [
      {
        label: "Suscripciones",
        data: dataPoints,
        borderColor: "#dff400",
        backgroundColor: "rgba(223, 244, 0, 0.1)",
        borderWidth: 3,
        pointRadius: 6,
        pointBackgroundColor: "#dff400",
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
        color: "#dff400",
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#dff400",
        bodyColor: "#ffffff",
        borderColor: "#dff400",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return `${context.parsed.y} suscripciones`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { 
          color: "#ffffff", 
          font: { size: 12 },
          callback: function(value: any) {
            return value + " susc";
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
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl w-full shadow-lg border border-white/20 p-6">
      <div className="mb-4"></div>
      <div className="h-80">
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default UserMovementChart;