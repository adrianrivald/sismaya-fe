import { StringValidation } from "zod";
import type { Companies } from "src/sections/master-data/internal-company/view/types";
import { CompanyInInternal, InternalCompany } from "../master-data/company/types";
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
    cito_used: number;
    cito_quota: number;
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
    company: Companies
    internal_company: Companies
}

export interface Assignees {
    id: number;
    created_at: Date;
    updated_at: Date;
    request_id: number;
    assignee_id: number;
    creator_id: number;
    request: null;
    assignee: Assignee;
    creator: null;
}

export interface Assignee {
    id: number;
    created_at: Date;
    updated_at: Date;
    email: string;
    phone: string;
    user_info: UserInfo;
    internal_companies: null;
    deleted_at: null;
}

export interface RequestDetail {
    assignees: Assignees[];
    category: Category;
    creator: UserInfo;
    attachments: Attachment[];
    company: Company;
    department: Department;
    internal_company:CompanyInInternal
    id: number;
    assignee_company_id: number;
    priority: string;
    progress_status: Status;
    name: string;
    number: string;
    description: string;
    is_cito: boolean;
    product: Products
    requester: UserInfo
    step: string;
    start_date: string;
    end_date: string;
    reject_reason: string
    task_count: number;
    rating: number;
    rating_desc: string
    related_department: RelatedDepartment[]
}

interface RelatedDepartment {
    department_id: number;
    department: Department;
    id: number;
    is_main: boolean;
    request: Request;
    request_id: number;

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

export interface RequestStatus {
    id: number;
    name: string;
    sort: number;
    company: Company;
    step: string;
}

export interface RequestSummary {
    active: number;
    done: number;
    in_progress: number;
    pending: number;
    rejected: number;
}

export interface RequestStatusSummary {
    count: number;
    id: number;
    name: string
}

export interface RequestFeedback {
    number: string;
    id: number;
    review: string
    rating: number
}