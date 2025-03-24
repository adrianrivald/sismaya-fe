import { Company, Department, InternalCompany, Products } from "../company/types";

export interface User {
    id: number;
    email: string;
    phone: string;
    user_info: UserInfo;
    internal_companies?: InternalCompany[]
    products_handled?: ProductsHandled[]
}

interface ProductsHandled {
    created_at: string;
    id: number;
    product: Products;
    product_id: number;
    updated_at: string;
    user: UserInfo;
    user_id: number
}

interface Role {
    id: number;
    name: string;
    permissions: Permissions[]
}
interface Permissions {
    id: number;
    name: string
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
    title: string;
}

export interface UserCompany {
    company: Company;
    id: number;
    user: UserInfo;
}