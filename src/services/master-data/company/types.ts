// import { UserInfo } from "../user/types";

export interface Company {
  id: number;
  name: string;
  abbreviation: string;
  categories: Categories[];
  products: Products[];
  type?: string;
  progress_statuses: Status[];
  department: Department[];
  image: string;
  cito_quota: number;
  cito_used: number;
  subsidiaries: {
    abbreviation: string;
    id: number;
    image: string;
    name: string;
    type: string;
    internal_id: number[]
  }[];
  vendors?: {
    id: number;
    created_at: string;
    updated_at: string;
    client_company_id: number;
    internal_company_id: number;

    internal_company: {
      id: number;
      created_at: string;
      updated_at: string;
      parent_id: number;
      name: string;
      abbreviation: string;
      type: string;
      image: string;
    };
  }[];
  parent: Company;
}

export interface Status {
  id: number;
  name: string;
  step: string;
  sort: number;
  company_id?: number;
}

export interface Department {
  id: number;
  name: string;
  company_id: number;
  is_show_all: boolean;
}
export interface Categories {
  id: number;
  name: string;
  companyId: number;
  company: Company;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

export interface Products {
  id: number;
  name: string;
  company: Company
  company_id: number;
}

export interface Statuses {
  id: number;
  name: string;
  company_id: number;
  step: string;
  sort: number;
}

export interface InternalCompany {
  company: CompanyInInternal;
  company_id: number;
  created_at: string;
  id: number;
  updated_at: string;
  // user: UserInfo;
  user_id: number;
  department_id: number;
  title_id: number;
}

export interface CompanyInInternal {
  abbreviation: string;
  categories: Categories[];
  cito_quota: number;
  cito_reset_at: string;
  cito_used: string;
  company_cito_uselogs: string;
  company_product_uses: string;
  created_at: string;
  deleted_at: string;
  departments: Department[];
  id: number;
  image: string;
  name: string;
  products: Products[];
  progress_statuses: string;
  type: string;
  updated_at: string;
}
