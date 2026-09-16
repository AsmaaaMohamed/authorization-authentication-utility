import { Navigate } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import { useAuthStore } from "../store";

function RootRedirect() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  if (isLoggedIn) {
    return <Navigate to="/workspaces" replace />;
  }

  return <HomePage />;
}

export default RootRedirect;