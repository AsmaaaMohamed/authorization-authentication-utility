import { User, Mail, Lock } from "lucide-react";
import AuthCard from "../ui/AuthCard";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";

export default function SignupForm() {
    const { signup, isLoading } = useAuthStore();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
      e.preventDefault();
      await signup(fullName, email, password);
    };
  return (
    <AuthCard className="max-w-[336px]">
      <div className="text-center">
        <h1 className="text-[25px] font-bold text-white">Create Account</h1>

        <p className="mt-2 text-xs text-[#7180bd]">Create your account</p>
      </div>

      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
        <Input icon={User} type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}/>

        <Input icon={Mail} type="email" placeholder="Email id" value={email} onChange={(e) => setEmail(e.target.value)}/>

        <Input icon={Lock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <p className="mt-4 text-center text-[11px] text-[#8c97b7]">
        Already have an account?{" "}
        <a href="/login" className="text-[#6682ff] underline">
          Login here
        </a>
      </p>
    </AuthCard>
  );
}
