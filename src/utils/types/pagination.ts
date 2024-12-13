export interface WithPagination<TData> {
  data: TData[];
  meta: Meta;
  links: PaginationLinks;
}

export interface PaginationLinks {
  first: string;
  last: string;
  prev?: string;
  next?: string;
}

export interface Meta {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  path: string;
  per_page: number;
  total: number;
  links: MetaLink[];
}

export interface MetaLink {
  url?: string;
  label: string;
  active: boolean;
}
