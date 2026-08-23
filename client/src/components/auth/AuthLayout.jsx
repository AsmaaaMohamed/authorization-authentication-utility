import { Outlet, useNavigate } from "react-router-dom";
import Logo from "../ui/Logo";
import { ArrowRight } from "lucide-react";

export default function AuthLayout() {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-linear-to-br from-[#b9d4ff] via-[#c7c5ff] to-[#c39bff]">
      {/* Logo */}
      <div className="flex justify-evenly items-center p-4">
        <Logo/>
        <button 
          onClick={() => navigate("/login")} 
          className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-[#cec0db] transition-all cursor-pointer'>Login<ArrowRight />
        </button>
      </div>
      
      {/* Page Content */}
      <div className="flex min-h-screen items-center justify-center px-4">
        <Outlet />
      </div>
    </main>
  );
}
