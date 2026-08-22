import { Outlet } from "react-router-dom";
import Logo from "../ui/Logo";

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#b9d4ff] via-[#c7c5ff] to-[#c39bff]">
      {/* Logo */}
      <div className="absolute left-16 top-8">
        <Logo />
      </div>

      {/* Page Content */}
      <div className="flex min-h-screen items-center justify-center px-4">
        <Outlet />
      </div>
    </main>
  );
}
