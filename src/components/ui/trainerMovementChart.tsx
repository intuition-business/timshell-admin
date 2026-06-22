"use client";

import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip
);

interface TrainerMovementChartProps {
    dataPoints?: number[];
    labels?: string[];
}

export default function TrainerMovementChart({
    dataPoints = [20, 25, 30, 5, 30, 30, 45, 30, 50, 50, 50, 50],
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
}: TrainerMovementChartProps) {
    const data = {
        labels,
        datasets: [
            {
                data: dataPoints,
                borderColor: "#dfff00",
                backgroundColor: "rgba(223,255,0,0.15)",
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: "#dfff00",
                tension: 0.3,
                fill: false,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: {
                display: true,
                text: "Usuarios",
                align: "start" as const,
                color: "#dfff00",
                font: {
                    size: 16,
                    weight: "bold" as const,
                },
                padding: { bottom: 10 },
            },
            tooltip: {
                backgroundColor: "#111",
                borderColor: "#dfff00",
                borderWidth: 1,
                titleColor: "#dfff00",
                bodyColor: "#fff",
                displayColors: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    color: "#cfcfcf",
                    font: { size: 11 },
                },
                grid: {
                    color: "rgba(255,255,255,0.1)",
                },
                border: { display: false },
            },
            y: {
                ticks: {
                    color: "#cfcfcf",
                    font: { size: 11 },
                },
                grid: {
                    color: "rgba(255,255,255,0.1)",
                },
                border: { display: false },
            },
        },
    };

    return (
        <div className="bg-[#1f1f1f] rounded-xl p-5 h-full shadow-md">
            <h3 className="text-[#dfff00] text-xl font-bold mb-1">Usuarios mensuales</h3>
            <p className="text-[16px] text-gray-400 mb-4">
                Tabla que muestra la cantidad de usuarios mensuales que mantiene el entrenador
            </p>

            <div className="h-80">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
