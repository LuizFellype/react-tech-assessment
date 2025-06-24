export type PaginatedResult<T> = {
  list: T[];
  nextCursor?: string;
  prevCursor?: string;
};

export type PaginatedSkipLimitResult<T> = {
  list: T[];
  total?: number;
  skip?: number;
  limit?: number;
};

export type ElementIdType = string | number | undefined;
