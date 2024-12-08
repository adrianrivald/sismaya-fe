export interface AuthUser {
    name: string;
    email: string;
    isAdmin: boolean;
    roles: Role[];
  }
  
  export interface Role {
    id: number;
    name: string;
    permissions: Permission[];
  }
  
  export interface Permission {
    id: string;
    name: string;
  }