import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

function ProtectedRoute({ isLoggedIn, isLoggedOut }) {
  useEffect(() => {
    // متظهرش الرسالة لو السبب إن المستخدم عمل logout بنفسه
    if (!isLoggedIn && !isLoggedOut) {
      toast.error("Please login first", {
        toastId: "login-required",
      });
    }
  }, [isLoggedIn, isLoggedOut]);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export default ProtectedRoute;