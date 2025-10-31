export interface Rutina {
  grupo: string;
  estado: "Completado" | "Fallida" | "Pendiente";
  fecha: string;
  ejercicios: string[];
}

export interface RutinasGridProps {
  rutinas: Rutina[];
  onSelect?: (rutina: Rutina) => void;
}
