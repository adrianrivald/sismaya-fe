import { http } from "src/utils/http";
import { User } from "../master-data/user/types";

export interface LoginCredentialsDTO {
    email: string;
    password: string;
  }

  interface LoginResponse {
    code: number;
    data: Data;
    message: string;
  }

  interface Data {
    token: string
    user: User
    permissions: string[]
  }
  
  export async function loginUser(formData: LoginCredentialsDTO) {
    return http<LoginResponse>('/login', {
      data: {
        email: formData.email,
        password: formData.password,
      },
    });
  }