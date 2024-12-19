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
  page: number;
  page_size: number;
  total_data: number
}

export interface MetaLink {
  url?: string;
  label: string;
  active: boolean;
}
