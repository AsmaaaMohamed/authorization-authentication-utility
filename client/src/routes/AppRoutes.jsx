import { Routes, Route } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Signup from "../pages/auth/Signup";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword";
import Login from "../pages/auth/Login";
import Home from "../pages/home/Home";
import WorkspacesPage from "../pages/home/WorkspacePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>
      <Route path="/workspace" element={<WorkspacesPage />} />
    </Routes>
  );
}
