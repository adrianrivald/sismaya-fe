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