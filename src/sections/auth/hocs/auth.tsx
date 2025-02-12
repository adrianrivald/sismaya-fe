import { AuthLayout } from 'src/layouts/auth';
import { SignInPage } from 'src/routes/sections';
import { useAuth } from '../providers/auth';
import { SignInView } from '../sign-in-view';

export function withAuth(WrappedApp: React.ComponentType) {
  function AppWithAuth() {
    const { isAuth } = useAuth();

    return isAuth ? (
      <WrappedApp />
    ) : (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    );
  }

  const displayName = WrappedApp.displayName || WrappedApp.name || 'AppComponent';
  AppWithAuth.displayName = `withAuth(${displayName})`;

  return AppWithAuth;
}
