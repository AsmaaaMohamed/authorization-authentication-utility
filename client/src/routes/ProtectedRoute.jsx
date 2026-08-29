import {  Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

function ProtectedRoute({ isLoggedIn }) {
  if (!isLoggedIn) {
    toast.error("Please login first", {
      toastId: "login-required",
    });
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;