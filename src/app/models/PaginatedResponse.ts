import {Patient} from "./Patient";

export type PaginatedResponse<T> = {
  content: Patient[];
  totalElements: number;
  size: number;
  number: number;
  last: boolean;
};
