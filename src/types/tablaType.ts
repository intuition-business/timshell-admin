import { ReactNode } from "react";

import { Entrenador } from "./trainerType";

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
  data: Entrenador[];
  columns?: number | any;
  encabezado?: TableHeader[];
  onCardClick?: (id: string) => void;
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
  encabezado?: TableHeader[];
  data?: TableRow[];
  home?: boolean | any;
  columns?: number | any;
}

export interface TableHeader {
  label: string;
  width: string;
}

export interface TableRow {
  [key: string]: any; 
}