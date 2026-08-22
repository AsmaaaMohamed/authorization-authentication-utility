import { User, Mail, Lock } from "lucide-react";

import AuthCard from "../ui/AuthCard";
import Input from "../ui/Input";
import Button from "../ui/Button";

export default function SignupForm() {
  return (
    <AuthCard className="max-w-[336px]">
      <div className="text-center">
        <h1 className="text-[25px] font-bold text-white">Create Account</h1>

        <p className="mt-2 text-xs text-[#7180bd]">Create your account</p>
      </div>

      <form className="mt-6 space-y-3">
        <Input icon={User} type="text" placeholder="Full Name" />

        <Input icon={Mail} type="email" placeholder="Email id" />

        <Input icon={Lock} type="password" placeholder="Password" />

        <div className="pt-1">
          <a href="/forgot-password" className="text-xs text-[#5d6ef5]">
            Forgot Password?
          </a>
        </div>

        <Button type="submit">Sign Up</Button>
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
