import { http } from "src/utils/http";

export interface LoginCredentialsDTO {
    email: string;
    password: string;
  }
  
  export async function loginUser(formData: LoginCredentialsDTO) {
    return http<{ token: string }>('/login', {
      data: {
        email: formData.email,
        password: formData.password,
      },
    });
  }