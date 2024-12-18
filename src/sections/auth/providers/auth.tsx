import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from 'src/services/auth/login';
import { User } from 'src/services/master-data/user/types';
import { createContext } from 'src/utils/create.context';
import * as sessionService from '../session/session';
import { AuthUser } from '../types';

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

  // const { data: user = null } = useProfile({ enabled: accessToken !== null });

  async function login(formField: LoginCredentialsDTO) {
    const { data } = await loginUser(formField);
    const { token, user } = data;
    // const token =
    //   'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZXNwcmVzc28tYXBpLmdvb2RkcmVhbWVyLmlkL2FwaS9jbXMvYXV0aC9sb2dpbi9hZG1pbiIsImlhdCI6MTczMTk3ODE5OCwiZXhwIjoxNzM4MDI2MTk4LCJuYmYiOjE3MzE5NzgxOTgsImp0aSI6IlpBT1FXd2tNRng3VndtbWkiLCJzdWIiOiIxIiwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.4eh32lJndfjrJThs2fNF6uYmZTZP2CDQFISFKpyRdP8';
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

  console.log(userInfo, 'userinfo');

  return (
    <AuthInternalProvider
      value={{
        isAuth: !!accessToken,
        // isAdmin: user?.isAdmin ?? false,
        user: accessToken ? JSON.parse(userInfo ?? '') : {},
        login,
        logout,
      }}
    >
      {props?.children}
    </AuthInternalProvider>
  );
}
