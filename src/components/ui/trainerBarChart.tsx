"use client";

import {
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip
);

interface MonthlyRevenueChartProps {
    dataPoints?: number[];
    labels?: string[];
}

export default function MonthlyRevenueChart({
    dataPoints = [3500000, 900000, 800000, 1100000, 350000, 4000000, 1000000, 350000, 900000, 4500000, 600000, 800000],
    labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
}: MonthlyRevenueChartProps) {
    return (
        <div className="bg-[#1f1f1f] rounded-xl p-5 h-full shadow-md">
            <h3 className="text-[#dfff00] text-xl font-bold mb-1">Ingresos generados</h3>
            <p className="text-[16px] text-gray-400 mb-4">
                Tabla de ingresos generados mensuales
            </p>

            <div className="h-80">
                <Bar
                data={{
                    labels,
                    datasets: [
                        {
                            data: dataPoints,
                            backgroundColor: "#dfff00",
                            borderRadius: 4,
                            barThickness: 18,
                        },
                    ],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false },
                        tooltip: {
                            backgroundColor: "#111",
                            borderColor: "#dfff00",
                            borderWidth: 1,
                            titleColor: "#dfff00",
                            bodyColor: "#fff",
                            displayColors: false,
                            callbacks: {
                                label: (ctx) =>
                                    `$${(ctx.raw as number).toLocaleString("es-CO")}`,
                            },
                        },
                    },
                    scales: {
                        x: {
                            ticks: { color: "#cfcfcf", font: { size: 11 } },
                            grid: { color: "rgba(255,255,255,0.1)" },
                            border: { display: false },
                        },
                        y: {
                            ticks: {
                                color: "#cfcfcf",
                                callback: (value: any) =>
                                    value >= 1_000_000
                                        ? `${Number(value) / 1_000_000}M`
                                        : `${Number(value) / 1000}K`,
                            },
                            grid: { color: "rgba(255,255,255,0.1)" },
                            border: { display: false },
                        },
                    },
                }}
            /></div>
        </div>
    );
}
