export interface User {
    id: number;
    email: string;
    phone: string;
    user_info: UserInfo
}

interface UserInfo {
    company: string;
    company_id: number;
    crated_at: string;
    department: string;
    department_id: number;
    id: number;
    name: string;
    profile_picture: string;
    role: string;
    role_id: number;
    updated_at: string;
    user: string;
    user_id: number
}