import { UserInfo } from "../master-data/user/types";
import { Categories, Products, Status } from "../request/types";

export interface ClientTotalRequest { 
    percentage : number;
    previous_total_request: number;
    total_request: number;
}

export interface ClientTotalRequestByState { 
    priority: RequestByState[]
    status: RequestByState[]
}

interface RequestByState {
    [key: string] : number
}


export interface PendingRequest {
    pending_request: number;
}

export interface RequestOvertime {
    date: string;
    request_count: number
}

export interface UnresolvedCito {
    category: Categories;
    created_at: string;
    creator: UserInfo;
    product: Products;
    progress_status: Status;
    requester: UserInfo;
    id: number;
    number: string;
    start_date: string;
    step: string;
}

export interface RequestDue {
    resolved: number;
    resolved_percentage: number;
    unresolved: number;
}

export interface TopRequester {
    company_name: string;
    request_count: number
}
export interface TopStaff {
    staff_name: string;
    task_count: number
}

export interface RequestSummary {
    done?: number;
    due_today?: number;
    in_progress?: number;
    overdue?: number;
    pending?: number;
    to_do?: number
}

export type RequestSummaryCompany = RequestSummary & {company_name: string}

export interface RequestStats {
    done: number;
    in_progress: number;
    time: string;
    new_request: number;
}