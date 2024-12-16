export interface Company {
    id: number;
    name: string;
    abbreviation: string;
    categories: string[]
    products: string[]
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