import { Routes, Route } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Signup from "../pages/auth/Signup";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword/ResetPassword";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        {/* Root */}
        <Route path="/" element={<RootRedirect />} />
        {/* Public */}
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        {/* Protected */}
      <Route element={<ProtectedRoute />}>
        {/* <Route path="/workspaces" element={<Workspaces />} />
        <Route path="/board" element={<Board />} />
        <Route path="/members" element={<Members />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} /> */}
      </Route>
      </Route>
    </Routes>
  );
}
