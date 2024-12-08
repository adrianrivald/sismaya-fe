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
    const token = '';
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
