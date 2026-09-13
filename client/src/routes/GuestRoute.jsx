import { Navigate, Outlet } from "react-router-dom";

/**
 * Keeps authentication-only pages out of reach once a session exists.
 */
function GuestRoute({ isLoggedIn }) {
  if (isLoggedIn) {
    return <Navigate to="/workspaces" replace />;
  }

  return <Outlet />;
}

export default GuestRoute;
