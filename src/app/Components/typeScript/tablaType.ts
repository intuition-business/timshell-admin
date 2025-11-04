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
export interface CardListProps {
  data: CardItem[];
  columns: string[];
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

export interface TableListProps {
  encabezado: string[];
  data: TableRow[];
}
