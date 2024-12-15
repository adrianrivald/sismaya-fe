import { http } from "src/utils/http";

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
  }
  
  export async function loginUser(formData: LoginCredentialsDTO) {
    return http<LoginResponse>('/login', {
      data: {
        email: formData.email,
        password: formData.password,
      },
    });
  }