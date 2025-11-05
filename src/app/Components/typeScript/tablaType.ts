import { ReactNode } from "react";
// tabla 
export interface CardItem {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valoration: any;
  usuarios: ReactNode;
  image: string | Blob | undefined;
  name: string;
  id: string;
  email: string;
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
// tabla usuario
export interface CardEntreno {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  valoration: any;
  usuarios: ReactNode;
  image: string | Blob | undefined;
  name: string;
  id: string;
  plan: string;
  entenador: string;
  email: string;
  users?: number;
  rating?: number;
}
export interface CardUsuarioProps {
  dataUser: CardEntreno[];
  columns?: string[];
}