import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { useAuthStore } from "./store";

export default function App() {
  const { initializeAuth, isLoading } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Block child rendering until state machine finishes verifying cookies
  // if (isLoading) {
  //   return (
  //     <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
  //       <div>Loading your profile session...</div>
  //     </div>
  //   );
  // }
  return <AppRoutes />;
}
