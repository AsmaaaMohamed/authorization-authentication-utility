import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore, initializeAuth } from './store';

export default function App() {
  const {  isInitializing } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  // Block child rendering until state machine finishes verifying cookies
  // if (isInitializing) {
  //   return (
  //     <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
  //       <div>Loading your profile session...</div>
  //     </div>
  //   );
  // }
  return <AppRoutes />;
}
