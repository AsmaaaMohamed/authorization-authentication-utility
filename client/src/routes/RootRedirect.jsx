import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store";

function RootRedirect() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  return (
    <Navigate
      to={isLoggedIn ? "/workspaces" : "/login"}
      replace
    />
  );
}

export default RootRedirect;