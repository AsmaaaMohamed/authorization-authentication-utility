import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

function ProtectedRoute({ isLoggedIn, isLoggedOut }) {
  useEffect(() => {
    if (!isLoggedIn && !isLoggedOut) {
      toast.error("Please login first", {
        toastId: "login-required",
      });
    }
  }, [isLoggedIn, isLoggedOut]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;
