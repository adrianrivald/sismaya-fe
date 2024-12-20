import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginUser } from 'src/services/auth/login';
import { InternalCompany } from 'src/services/master-data/company/types';
import { useUserById } from 'src/services/master-data/user';
import { User } from 'src/services/master-data/user/types';
import { createContext } from 'src/utils/create.context';
import * as sessionService from '../session/session';

interface AuthContextValue {
  // user: AuthUser | null;
  isAuth: boolean;
  user: User;
  logout: () => Promise<void>;
  login: (formField: LoginCredentialsDTO) => Promise<void>;
  currentInternalCompany?: number | null;
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
  const location = useLocation();
  const [accessToken, setAccessToken] = React.useState<string | null>(() =>
    sessionService.getSession()
  );
  const [userInfo, setUserInfo] = React.useState<string | null>(() => sessionService.getUser());
  // const [currentInternalCompany, setCurrentInternalCompany] = React.useState<number | null>(null);

  async function login(formField: LoginCredentialsDTO) {
    const { data } = await loginUser(formField);
    const { token, user } = data;
    sessionService.setSession(token, user);
    setAccessToken(token);
    setUserInfo(JSON.stringify(user));
    // setCurrentInternalCompany((user?.internal_companies ?? [])[0].id ?? null);

    // Redirect as client user who has internal companies
    if ((user?.internal_companies ?? [])?.length > 0) {
      navigate(`/${(user?.internal_companies ?? [])[0]?.name.toLowerCase()}/request`);
    } else {
      navigate('/');
    }
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
