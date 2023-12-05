export interface IQueryFeatures {
  page: number;
  limit: number | undefined;
  skip: number | undefined;
  fields: { [key: string]: boolean };
  filters: object;
  populate: { [key: string]: boolean };
  sort: { [key: string]: "asc" | "desc" };
  searchKey?: string;
}

export interface IQueryResult<T> {
  data: Partial<T>[];
  total: number;
}
