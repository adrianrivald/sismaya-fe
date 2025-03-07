// import { UserInfo } from "../user/types";

export interface Company {
    id: number;
    name: string;
    abbreviation: string;
    categories: Categories[]
    products: Products[]
    type?: string;
    progress_statuses: Status[]
    department: Department[]
    image: string
    cito_quota: number;
    cito_used: number
}

export interface Status {
    id: number;
    name: string;
    step: string;
    sort: number;
    company_id?: number
}

export interface Department {
    id: number;
    name: string;
    company_id: number
    is_show_all: boolean
}
export interface Categories {
    id: number;
    name: string;
    companyId: number;
    company: Company;
    created_at: string;
    updated_at: string;
    deleted_at: string
}

export interface Products {
    id: number;
    name: string;
    company_id: number
}

export interface Statuses {
    id: number;
    name: string;
    company_id: number;
    step: string;
    sort: number
}

export interface InternalCompany {
    company: CompanyInInternal;
    company_id: number;
    created_at: string;
    id: number;
    updated_at: string;
    // user: UserInfo;
    user_id: number;
}

export interface CompanyInInternal {
    abbreviation: string
    categories: Categories[]
    cito_quota: number
    cito_reset_at: string
    cito_used: string
    company_cito_uselogs: string
    company_product_uses: string
    created_at: string
    deleted_at: string
    departments: Department[]
    id: number
    image: string
    name: string
    products: Products[]
    progress_statuses: string
    type: string
    updated_at: string
}