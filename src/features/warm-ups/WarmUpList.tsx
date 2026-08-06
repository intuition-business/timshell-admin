"use client";

import { useEffect, useState } from "react";
import { SearchInput } from "@/components/inputs/inputs";
import { Pencil, Trash2 } from "lucide-react";
import { ModalConfirm } from "@/components/modals/ModalConfirm";

interface Props {
  onEdit?: (item: any) => void;
  update?: boolean;
  setUpdate?: (v: boolean) => void;
}

export default function WarmUpList({ onEdit, update, setUpdate }: Props) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState<any>(null);

  const fetchWarmUps = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token") ?? "";
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}warm-ups`, {
        headers: { "x-access-token": token },
      });
      const json = await res.json();
      setData(Array.isArray(json.data) ? json.data : []);
    } catch (e) {
      setData([]);
    } finally {
      setLoading(false);
      setUpdate?.(false);
    }
  };

  useEffect(() => { fetchWarmUps(); }, []);
  useEffect(() => { if (update) fetchWarmUps(); }, [update]);

  const filtered = data.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteClick = (item: any) => {
    setSelected(item);
    setOpenDelete(true);
  };

  const handleConfirm = async () => {
    if (!selected) return;
    try {
      const token = localStorage.getItem("token") ?? "";
      await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}warm-ups/${selected.id}`, {
        method: "DELETE",
        headers: { "x-access-token": token },
      });
      setData((prev) => prev.filter((item) => item.id !== selected.id));
      onEdit?.(null);
    } catch (e) {
      console.error("Error eliminando warm-up:", e);
    } finally {
      setOpenDelete(false);
      setSelected(null);
    }
  };

  return (
    <div className="h-[calc(100vh)] -mt-42 overflow-auto w-full bg-[#282828] text-white p-6 top-0 right-0 max-w-[35rem]">
      <h1 className="text-2xl font-semibold text-[#D4FF00] mb-6">Calentamientos</h1>

      <div className="mb-6 w-full">
        <SearchInput
          placeholder="Buscar calentamiento"
          value={search}
          onChange={(e: any) => setSearch(e.target.value)}
          wFull={true}
        />
      </div>

      <div className="flex flex-col gap-4">
        {loading && <p className="text-gray-400 text-center py-6">Cargando...</p>}

        {!loading && filtered.map((item) => (
          <div key={item.id} className="bg-[#2A2A2A] border border-[#3A3A3A] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {item.video_thumbnail ? (
                <img src={item.video_thumbnail} alt={item.name} className="w-32 h-24 object-cover rounded-lg" />
              ) : (
                <div className="w-32 h-24 rounded-lg bg-[#1E1E1E] border border-[#3A3A3A] flex flex-col items-center justify-center gap-1 text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                  <span className="text-xs">Sin video</span>
                </div>
              )}

              <div>
                <h3 className="text-[#D4FF00] font-semibold text-lg">{item.name}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.duration_in_minutes} min</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(item.muscle_groups ?? []).map((g: string) => (
                    <span key={g} className="text-xs bg-[#1E1E1E] border border-[#3A3A3A] text-gray-300 px-2 py-0.5 rounded-full">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={() => onEdit?.(item)} className="text-gray-300 hover:text-white transition cursor-pointer">
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDeleteClick(item)} className="text-gray-400 hover:text-red-400 transition cursor-pointer">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <p className="text-gray-400 text-center py-6">No se encontraron resultados.</p>
        )}
      </div>

      <ModalConfirm
        isOpen={openDelete}
        onConfirm={handleConfirm}
        text="¿Seguro que deseas eliminar este calentamiento?"
        onCancel={() => setOpenDelete(false)}
      />
    </div>
  );
}
