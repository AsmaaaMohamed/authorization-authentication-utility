import { NavLink, Outlet } from "react-router-dom";
import { C } from "../../constants/theme";

export default function AuthLayout() {
  const links = [
    { path: "/login", label: "Login" },
    { path: "/signup", label: "Sign Up" },
    { path: "/workspaces", label: "Workspaces" },
    { path: "/settings", label: "Settings" },
  ];

  return (
    <div>
      <nav className="fixed top-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-[#262B33] bg-[#15181D]/95 p-1.5 shadow-lg backdrop-blur-md">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              `
              rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200
              ${isActive
                ? "bg-[#4FE0C4] text-[#08130F] shadow-sm"
                : "text-[#8890A0] hover:bg-[#1B1F26] hover:text-[#E4E7EC]"
              }
              `
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <main className="min-h-screen bg" style={{ background: C.bg }}>
        {/* Page Content */}
        <div className="min-h-screen items-center justify-center">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
