import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store";

function RootRedirect() {
  const { isLoggedIn } = useAuthStore();

  return (
    <Navigate
      to={isLoggedIn ? "/workspaces" : "/login"}
      replace
    />
  );
}

export default RootRedirect;