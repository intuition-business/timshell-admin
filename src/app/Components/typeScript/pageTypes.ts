// tipado de pagina data users
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  plan_id?: number | null;
  plan_name?: string;
  trainer_name?: string;
  trainer_image?: string;
  user_image?: string;
  fecha?: string;
}
export interface Rutina {
  id: string;
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
}
