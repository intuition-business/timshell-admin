"use client";

import { InputDate } from "@/components/inputs/inputs";
import { useAuth } from "@/context/AuthContext";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from "chart.js";
import { Download, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Legend, Tooltip);

const API = process.env.NEXT_PUBLIC_BACKEND_URL;

const MONTH_LABELS: Record<string, string> = {
  "01": "Ene", "02": "Feb", "03": "Mar", "04": "Abr", "05": "May", "06": "Jun",
  "07": "Jul", "08": "Ago", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dic",
};

function getMonthsInRange(from: string, to: string): string[] {
  const months: string[] = [];
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  let y = fy, m = fm;
  while (y < ty || (y === ty && m <= tm)) {
    months.push(`${y}-${String(m).padStart(2, "0")}`);
    m++;
    if (m > 12) { m = 1; y++; }
  }
  return months;
}

function monthLabel(month: string) {
  const [, m] = month.split("-");
  return MONTH_LABELS[m] ?? month;
}

interface DashboardData {
  stats: { total: number; nuevos: number; activos: number; inactivos: number; suspendidos: number };
  movimiento: { month: string; count: number }[];
  top_entrenadores: { id: number; name: string; image: string | null; user_count: number }[];
  ingresos: { month: string; total: number }[];
  planes: { plan_name: string; count: number }[];
}

const currentYear = new Date().getFullYear();
const DEFAULT_FROM = `${currentYear}-01-01`;
const DEFAULT_TO = `${currentYear}-12-31`;

export default function Dashboard() {
  const router = useRouter();
  const auth = useAuth();
  const token = auth?.token;

  const [dateFrom, setDateFrom] = useState(DEFAULT_FROM);
  const [dateTo, setDateTo] = useState(DEFAULT_TO);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async (from: string, to: string) => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}admin/dashboard?date_from=${from}&date_to=${to}`, {
        headers: { "x-access-token": token },
      });
      const json = await res.json();
      if (!json.error) setData(json);
    } catch (e) {
      console.error("Error fetching dashboard:", e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchDashboard(dateFrom, dateTo);
  }, [fetchDashboard, dateFrom, dateTo]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  // Construir datos de gráficas
  const months = getMonthsInRange(dateFrom, dateTo);
  const monthLabels = months.map(monthLabel);

  const movimientoMap = Object.fromEntries((data?.movimiento ?? []).map(r => [r.month, r.count]));
  const lineData = {
    labels: monthLabels,
    datasets: [{
      label: "Nuevos usuarios",
      data: months.map(m => movimientoMap[m] ?? 0),
      borderColor: "#D4FF00",
      backgroundColor: "rgba(212, 255, 0, 0.1)",
      tension: 0.3,
      fill: true,
    }],
  };
  const lineOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: "#fff" } } },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { color: "#222" } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#222" }, beginAtZero: true },
    },
  };

  const ingresosMap = Object.fromEntries((data?.ingresos ?? []).map(r => [r.month, Number(r.total)]));
  const barDataIngresos = {
    labels: monthLabels,
    datasets: [{
      label: "Ingresos ($)",
      data: months.map(m => ingresosMap[m] ?? 0),
      backgroundColor: "#D4FF00",
    }],
  };
  const barOptionsIngresos = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { display: false } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#222" }, beginAtZero: true },
    },
  };

  const planes = data?.planes ?? [];
  const barDataPlanes = {
    labels: planes.map(p => p.plan_name),
    datasets: [{
      label: "Usuarios",
      data: planes.map(p => p.count),
      backgroundColor: "#D4FF00",
    }],
  };
  const barOptionsPlanes = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { ticks: { color: "#ccc" }, grid: { display: false } },
      y: { ticks: { color: "#ccc" }, grid: { color: "#222" }, beginAtZero: true },
    },
  };

  const stats = data?.stats;
  const statCards = [
    { label: "Usuarios activos", value: stats?.activos ?? 0 },
    { label: "Usuarios nuevos", value: stats?.nuevos ?? 0 },
    { label: "Usuarios inactivos", value: stats?.inactivos ?? 0 },
    { label: "Usuarios suspendidos", value: stats?.suspendidos ?? 0 },
    { label: "Usuarios Totales", value: stats?.total ?? 0 },
  ];

  const topEntrenadores = data?.top_entrenadores ?? [];
  const maxUsers = topEntrenadores[0]?.user_count ?? 1;

  return (
    <div className="w-full relative">
      <div>
        {/* Header */}
        <div className="mb-9">
          <div className="flex items-center justify-between mb-9">
            <div className="flex items-center justify-center gap-5">
              <div className="img-fit">
                <img src="/logo-fondo-blanco.jpg" className="w-12 rounded-lg h-12" alt="" />
              </div>
              <div>
                <h1 className="text-white text-lg">Bienvenido de nuevo</h1>
                <p className="text-2xl font-semibold text-[#D4FF00]">Administrador</p>
              </div>
            </div>
            <LogOut onClick={handleLogout} size={50} className="text-white p-2 rounded-lg bg-[#1a1a1a] border-2 cursor-pointer border-[#D4FF00]" />
          </div>

          <div className="flex gap-6 text-white">
            <div className="flex items-center justify-start w-full gap-5">
              <InputDate placeholder="Desde" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
              <InputDate placeholder="Hasta" value={dateTo} onChange={e => setDateTo(e.target.value)} />
            </div>
            <button className="bg-white text-[#1A1A1A] w-full max-w-[200px] flex items-center px-4 py-3 rounded-xl hover:bg-[#d9d9d9] cursor-pointer ms-auto">
              <Download className="mr-2" size={18} />
              Descargar Excel
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {statCards.map((item, i) => (
            <div key={i} className="rounded-xl flex flex-col p-4 text-center bg-[#fff]/10 backdrop-blur-md border-white/10 text-white">
              <p className="text-white text-xl mb-1 line-clamp-1" title={item.label}>{item.label}</p>
              <h2 className={`text-3xl mt-auto font-semibold ${i === 4 ? "text-[#D4FF00]" : "text-white"}`}>
                {loading ? "—" : item.value.toLocaleString()}
              </h2>
            </div>
          ))}
        </div>

        {/* Movimiento + Top entrenadores */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#282828] p-5 rounded-xl col-span-1">
            <h3 className="text-[#D4FF00] font-semibold mb-2 text-xl">Movimiento de usuarios</h3>
            <Line data={lineData} options={lineOptions} />
          </div>

          <div className="bg-[#282828] p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[#D4FF00] font-semibold text-xl">Top entrenadores</h3>
              <button
                onClick={() => router.push("/trainer")}
                className="font-semibold text-sm hover:text-gray-600 hover:bg-gray-200 cursor-pointer bg-white py-3 px-4 max-w-[230px] w-full rounded-lg"
              >
                Ver más detalles
              </button>
            </div>

            {/* Encabezado tabla */}
            <div className="grid bg-[#0e0d0d] p-3 px-5 rounded-lg text-white border border-[#333]"
              style={{ gridTemplateColumns: "1fr 120px 140px" }}>
              <span className="font-semibold text-sm">Entrenador</span>
              <span className="font-semibold text-sm">Usuarios</span>
              <span className="font-semibold text-sm">Desempeño</span>
            </div>

            {/* Filas */}
            <div className="flex flex-col gap-2 mt-2">
              {loading ? (
                <p className="text-gray-400 text-sm text-center py-4">Cargando...</p>
              ) : topEntrenadores.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-4">Sin entrenadores con usuarios activos</p>
              ) : (
                topEntrenadores.map((trainer) => (
                  <div key={trainer.id}
                    className="grid items-center bg-[#1a1a1a] p-3 px-5 rounded-lg text-white border border-[#333]"
                    style={{ gridTemplateColumns: "1fr 120px 140px" }}>
                    <div className="flex items-center gap-2 overflow-hidden">
                      {trainer.image ? (
                        <img src={trainer.image} className="w-8 h-8 rounded-full object-cover flex-shrink-0" alt={trainer.name} />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs flex-shrink-0">
                          {trainer.name?.[0]?.toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm truncate">{trainer.name}</span>
                    </div>
                    <span className="text-sm">{trainer.user_count}</span>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-[#333] rounded-full h-2">
                        <div
                          className="bg-[#D4FF00] h-2 rounded-full"
                          style={{ width: `${Math.round((trainer.user_count / maxUsers) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 w-8 text-right">
                        {Math.round((trainer.user_count / maxUsers) * 100)}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Ingresos + Planes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#1a1a1a] p-5 rounded-xl">
            <div className="mb-2">
              <h3 className="text-[#D4FF00] font-semibold text-xl">Ingresos generados globales</h3>
              <p className="text-white text-sm">Pagos aprobados por mes en el período seleccionado.</p>
            </div>
            <Bar data={barDataIngresos} options={barOptionsIngresos} />
          </div>

          <div className="bg-[#1a1a1a] p-5 rounded-xl">
            <h3 className="text-[#D4FF00] text-xl font-semibold mb-2">Planes más usados</h3>
            {planes.length > 0 ? (
              <Bar data={barDataPlanes} options={barOptionsPlanes} />
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">Sin datos de planes activos</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
