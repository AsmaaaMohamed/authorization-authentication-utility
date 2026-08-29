import { Outlet, useNavigate } from "react-router-dom";
import { C } from "../../constants/theme";

export default function AuthLayout() {

  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg" style={{ background: C.bg}}>
      
      
      {/* Page Content */}
      <div className="flex min-h-screen items-center justify-center px-4">
        <Outlet />
      </div>
    </main>
  );
}
