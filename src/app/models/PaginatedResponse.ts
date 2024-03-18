export type PaginatedResponse<T> = {
  content: T[];
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
};
