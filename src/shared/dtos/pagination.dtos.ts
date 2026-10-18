/**
 * Forma padrão de resposta paginada.
 * Toda a lista com paginação devolve `{ items, total, page, pages }`.
 */
export interface PaginationDto<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
