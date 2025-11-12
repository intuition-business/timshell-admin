export interface Rutina {
  grupo?: string;
  estado?: "Completado" | "Fallida" | "Pendiente";
  fecha?: string;
  ejercicios?: string[];
}

export interface RutinasGridProps {
  rutinas: {
    id?: string;
    fecha?: string;
    nombre?: string;
    status: string;
    ejercicios?: {
      nombre_ejercicio?: string;
      Esquema?: {
        Series?: number;
        Descanso?: string;
        "Detalle series": {
          Reps?: number;
          carga?: number | string;
        }[];
      };
    }[];
  }[];
  user_id?: string;
  onVerDetalles?: (rutinaId: string | number, user_id: string) => void;
}
