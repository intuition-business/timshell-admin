import { ReactNode } from "react";


export interface CardItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valoration: any;
  usuarios: ReactNode;
  image: string | Blob | undefined;
  name: string;
  id: string;
  email: string;
  plan: string; // ahora es string
  entrena: string;
  users?: number;
  rating?: number;
}
// este ts es de la tabla
export interface UserCardData {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  plan_id?: number | null;
  valoration?: number | null;
  user_image?: string | null;
  trainer_name?: string | null;
  trainer_image?: string | null;
  fecha_registro?: string;
}
// tabla
export interface CardListProps {
  data: UserCardData[];
  columns?: number;

  phone?: string;
  plan_id?: number | null;
  trainer_name?: string | null;
  trainer_image?: string | null; // 👈 agrega esta línea
  user_image?: string | null;
}
export interface StarsProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}
export interface TableRow {
  name: string;
  id: string;
  email?: string;
  users?: string;
  plan?: string;
  entrena?: string;
  up?: boolean | null;
  change?: string;
}
// ts de tabla
export interface TableListProps {
  encabezado?: string[];
  data?: UserCardData[];
  home?: boolean;
  columns?: number;
}
