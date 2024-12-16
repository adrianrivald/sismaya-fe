export interface Company {
    id: number;
    name: string;
    abbreviation: string;
    categories: Categories[]
    products: Products[]
    type?: string;
    progress_statuses: Status[]
    department: Department[]
}

export interface Status {
    name: string;
    step: "to_do" | "in_progress" | "done"
    sort: number;
    company_id?: number
}

export interface Department {
    id: number;
    name: string;
    company_id: number
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