import { Routes, Route } from "react-router-dom";
import AuthLayout from "../components/auth/AuthLayout";
import Signup from "../pages/auth/Signup";
import VerifyEmail from "../pages/auth/VerifyEmail";
import ResetPassword from "../pages/auth/ResetPassword/ResetPassword";
import Login from "../pages/auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import RootRedirect from "./RootRedirect";
import WorkspacesPage from "../pages/WorkSpaces/WorkSpaces";
import { useAuthStore } from "../store";
import WorkspaceSettingsPage from "../pages/WorkSpaces/WorkspaceSettingsPage";
import MembersPage from "../pages/Members/Members";
import AppLayout from "../components/AppLayout";
import BoardPage from "../pages/Board/Board";
import SettingsPage from "../pages/SettingsPage/SettingsPage";

export default function AppRoutes() {
  const { isLoggedIn } = useAuthStore();
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
        <Route path="/settings" element={<SettingsPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute isLoggedIn={true} />}>
          <Route path="/workspaces" element={<WorkspacesPage />} />
          <Route path="/workspaces/:workspaceId" element={<AppLayout />}>
            <Route path="board" element={<BoardPage />} />
            <Route path="members" element={<MembersPage />} />
            {/* <Route path="notifications" element={<NotificationsPage />} />
              <Route path="settings" element={<SettingsPage />} /> */}
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
