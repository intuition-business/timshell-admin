export interface PaginationProps {
  paginaActual: number;
  totalPaginas: number;
  onChange: (nuevaPagina: number) => void;
}
