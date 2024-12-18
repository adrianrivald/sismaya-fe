import { Company, Department } from "../company/types";
import { Role } from "../role/types";

export interface User {
    id: number;
    email: string;
    phone: string;
    user_info: UserInfo;
    internal_companies?: any[]
}

interface UserInfo {
    company: Company;
    company_id: number;
    crated_at: string;
    department: Department;
    department_id: number;
    id: number;
    name: string;
    profile_picture: string;
    role: Role;
    role_id: number;
    updated_at: string;
    user: string;
    user_id: number
    internal_id: number[]
}