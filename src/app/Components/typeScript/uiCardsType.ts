export interface Rutina {
  grupo: string;
  estado: "Completado" | "Fallida" | "Pendiente";
  fecha: string;
  ejercicios: string[];
}

export interface RutinasGridProps {
  rutinas: {
    fecha: string;
    nombre: string;
    status: string;
    ejercicios: {
      nombre_ejercicio: string;
      Esquema: {
        Series: number;
        Descanso: string;
        "Detalle series": {
          Reps: number;
          carga: number | string;
        }[];
      };
    }[];
  }[];
}
