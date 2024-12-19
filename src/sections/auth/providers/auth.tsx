import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from 'src/services/auth/login';
import { User } from 'src/services/master-data/user/types';
import { createContext } from 'src/utils/create.context';
import * as sessionService from '../session/session';

interface AuthContextValue {
  // user: AuthUser | null;
  isAuth: boolean;
  user: User;
  logout: () => Promise<void>;
  login: (formField: LoginCredentialsDTO) => Promise<void>;
}

const [useAuth, AuthInternalProvider] = createContext<AuthContextValue>({
  name: 'Auth',
});

export { useAuth };

interface LoginCredentialsDTO {
  email: string;
  password: string;
}

export function AuthProvider(props: React.PropsWithChildren) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = React.useState<string | null>(() =>
    sessionService.getSession()
  );
  const [userInfo, setUserInfo] = React.useState<string | null>(() => sessionService.getUser());

  async function login(formField: LoginCredentialsDTO) {
    const { data } = await loginUser(formField);
    const { token, user } = data;
    sessionService.setSession(token, user);
    setAccessToken(token);
    setUserInfo(JSON.stringify(user));
    navigate('/');
  }

  async function logout() {
    sessionService.flushSession();
    setAccessToken(null);
    setAccessToken(null);
    navigate('/');
  }

  React.useEffect(() => {
    if (!userInfo) {
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  return (
    <AuthInternalProvider
      value={{
        isAuth: !!accessToken,
        user: accessToken ? (userInfo ? JSON.parse(userInfo ?? '') : {}) : {},
        login,
        logout,
      }}
    >
      {props?.children}
    </AuthInternalProvider>
  );
}
