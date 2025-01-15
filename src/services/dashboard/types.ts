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
    category: string;
    created_at: string;
    id: number;
    number: string;
    requester : string;
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
    month: string;
    new_request: number;
}