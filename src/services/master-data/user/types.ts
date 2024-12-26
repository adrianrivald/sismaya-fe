import { Company, Department, InternalCompany } from "../company/types";
import { Role } from "../role/types";

export interface User {
    id: number;
    email: string;
    phone: string;
    user_info: UserInfo;
    internal_companies?: InternalCompany[]
}

export interface UserInfo {
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
    user_type: string;
    internal_id: number[]
    internal_companies?: Company[]
}

export interface UserCompany {
    company: Company;
    id: number;
    user: UserInfo;
}