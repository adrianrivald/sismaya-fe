/* eslint-disable import/no-cycle */
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from 'src/services/auth/login';
import type { User } from 'src/services/master-data/user/types';
import { createContext } from 'src/utils/create.context';
import { createStore } from '@xstate/store';
import { useTimerAction, useTimerActionStore, useTimerStore } from 'src/services/task/timer';
import * as sessionService from '../session/session';

interface AuthContextValue {
  // user: AuthUser | null;
  isAuth: boolean;
  user: User;
  logout: () => Promise<void>;
  login: (formField: LoginCredentialsDTO) => Promise<void>;
  currentInternalCompany?: number | null;
}

const [useAuth, AuthInternalProvider] = createContext<AuthContextValue>({ name: 'Auth' });

export { useAuth };

interface LoginCredentialsDTO {
  email: string;
  password: string;
}

const initialStore = { permissions: [] as string[] };
export const permissionStore = createStore({
  context: initialStore,
  on: {
    storePermissions: (context, event: { newPermissions: string[] }) => ({
      permissions: event?.newPermissions,
    }),
    flushPermissions: () => ({ permissions: [] }),
  },
});

export function AuthProvider(props: React.PropsWithChildren) {
  const navigate = useNavigate();
  const [accessToken, setAccessToken] = React.useState<string | null>(() =>
    sessionService.getSession()
  );
  const actionStore = useTimerActionStore();
  const mutation = useTimerAction();
  const store = useTimerStore();
  const [userInfo, setUserInfo] = React.useState<string | null>(() => sessionService.getUser());

  async function login(formField: LoginCredentialsDTO) {
    const { data } = await loginUser(formField);
    const { token, user } = data;

    sessionService.setSession(token, user);
    setAccessToken(token);
    setUserInfo(JSON.stringify(user));
    permissionStore.send({
      type: 'storePermissions',
      newPermissions: user?.user_info?.role?.permissions?.map((item) => item?.name),
    });
    // Redirect as client user who has internal companies
    // if ((user?.internal_companies ?? [])?.length > 0 && user?.user_info?.role_id !== 1) {
    //   navigate(`/${(user?.internal_companies ?? [])[0]?.company?.name?.toLowerCase()}/request`);
    // } else {
    //   navigate('/');
    // }

    navigate('/');
  }

  async function logout() {
    try {
      // Handle timer pause if active
      if (store?.taskId) {
        await mutation.mutateAsync({ action: 'pause', taskId: store.taskId });
        actionStore.send({ type: 'reset' });
      }

      // Ensure session flush completes
      await sessionService.flushSession();

      window.localStorage.removeItem('task-timer');

      permissionStore.send({ type: 'flushPermissions' });
      setAccessToken(null);
      navigate('/');
    } catch (error) {
      await sessionService.flushSession();
      actionStore.send({ type: 'reset' });
      window.localStorage.removeItem('task-timer');
      permissionStore.send({ type: 'flushPermissions' });
      setAccessToken(null);
      navigate('/');
    }
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
