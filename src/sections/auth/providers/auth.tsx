import * as React from 'react';
import { createContext } from 'src/utils/create.context';
import * as sessionService from '../session/session';
import { AuthUser } from '../types';

interface AuthContextValue {
  // user: AuthUser | null;
  isAuth: boolean;
  // isAdmin: boolean;
  logout: () => Promise<void>;
  login: (formField: LoginCredentialsDTO) => Promise<void>;
}

const [useAuth, AuthInternalProvider] = createContext<AuthContextValue>({
  name: 'Auth',
});

export { useAuth };

interface LoginCredentialsDTO {
  username: string;
  password: string;
}

export function AuthProvider(props: React.PropsWithChildren) {
  const [accessToken, setAccessToken] = React.useState<string | null>(() =>
    sessionService.getSession()
  );

  // const { data: user = null } = useProfile({ enabled: accessToken !== null });

  async function login(formField: LoginCredentialsDTO) {
    // const { token } =await loginWithEmailAndPasswordAdmin(formField)
    const token =
      'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZXNwcmVzc28tYXBpLmdvb2RkcmVhbWVyLmlkL2FwaS9jbXMvYXV0aC9sb2dpbi9hZG1pbiIsImlhdCI6MTczMTk3ODE5OCwiZXhwIjoxNzM4MDI2MTk4LCJuYmYiOjE3MzE5NzgxOTgsImp0aSI6IlpBT1FXd2tNRng3VndtbWkiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.4eh32lJndfjrJThs2fNF6uYmZTZP2CDQFISFKpyRdP8';
    sessionService.setSession(token);
    setAccessToken(token);
  }

  async function logout() {
    sessionService.flushSession();
    setAccessToken(null);
  }

  return (
    <AuthInternalProvider
      value={{
        isAuth: !!accessToken,
        // isAdmin: user?.isAdmin ?? false,
        // user,
        login,
        logout,
      }}
    >
      {props?.children}
    </AuthInternalProvider>
  );
}
