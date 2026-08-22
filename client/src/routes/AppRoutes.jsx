import { Routes, Route } from "react-router-dom";

import AuthLayout from "../components/auth/AuthLayout";

import Signup from "../pages/auth/Signup";
import VerifyEmail from "../pages/auth/VerifyEmail";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/signup" element={<Signup />} />

        <Route path="/verify-email" element={<VerifyEmail />} />
      </Route>
    </Routes>
  );
}
