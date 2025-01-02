import { StringValidation } from "zod";
import { InternalCompany } from "../master-data/company/types";
import { UserInfo } from "../master-data/user/types";

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
}

export interface Status {
    id: number;
    name: string;
    step: string;
    sort: number;
    company_id?: number
    created_at: string;
    deleted_at: string;
    updated_at: string
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
    company: string;
    company_product_uses: number;
}

export interface Statuses {
    id: number;
    name: string;
    company_id: number;
    step: string;
    sort: number
}

export interface Category {
    company: string
    company_id: number
    created_at: string
    deleted_at: string
    id: number
    name: string
    updated_at: string
}
export interface Request {
    category: Category
    creator: UserInfo;
    id: number;
    number: string;
    priority: string;
    product: Products;
    progress_status: Statuses;
    is_cito: boolean;
    requester: UserInfo;
    step: string;
}

export interface RequestDetail {
    assignees: Assignee[];
    category: Category;
    creator: UserInfo;
    attachments: Attachment[];
    company: Company;
    department: Department;
    id: number;
    priority: string;
    progress_status: Status;
    number: string;
    description: string;
    is_cito: boolean;
    product: Products
    requester: UserInfo
    step: string;
    start_date: string;
    reject_reason: string
}

interface AssigneeData {
    created_at: string;
    deleted_at: string;
    email: string;
    id: number;
    internal_companies: InternalCompany[];
    phone: string;
    updated_at: string;
    user_info: UserInfo;
}

export interface Assignee {
    assignee: AssigneeData;
    assignee_id: number;
    created_at: string;
    creator: string;
    creator_id: number;
    id: number;
    request: string;
    request_id: number;
    updated_at: string;
}

export interface Attachment {
    attachable_id: number;
    attachable_type: string;
    created_at: string;
    deleted_at: string;
    file_name: string;
    file_path: string;
    id: number;
    updated_at: string;
}