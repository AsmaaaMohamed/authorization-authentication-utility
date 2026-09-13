import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore, initializeAuth } from './store';

export default function App() {
  const isInitializing = useAuthStore((state) => state.isInitializing);

  useEffect(() => {
    initializeAuth();
  }, []);

  // Wait for the refresh-cookie check so guards do not briefly show the
  // login/signup screens to an already-authenticated user.
  if (isInitializing) {
    return null;
  }

  return <AppRoutes />;
}
