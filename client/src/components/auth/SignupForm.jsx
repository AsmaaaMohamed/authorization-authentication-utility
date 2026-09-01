import { User, Mail, Lock } from "lucide-react";
import Button from "../ui/Button";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import AuthShell from "./AuthShell";
import Field from "../ui/Field";
import { Link } from "react-router-dom";
import { C } from "../../constants/theme";
import FileDrop from "../ui/FileDrop";

export default function SignupForm() {
    const { signup, isLoading } = useAuthStore();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const handleSubmit = async (e) => {
      e.preventDefault();
      await signup(fullName, email, password, confirmPassword);
    };
  return (
    <>
    <AuthShell>
      <div style={{ fontSize: 16, color: C.text, fontWeight: 600, marginBottom: 3 }}>Create your account</div>
      <div style={{ fontSize: 12.5, color: C.textFaint, marginBottom: 22 }}>Required: name, email, password. Avatar is optional.</div>
      <form className="mt-6 space-y-3" onSubmit={handleSubmit}>
          <Field label="Full name" name="fullName" required icon={User} type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)}/>
          <Field label="Email" name="email" required icon={Mail} type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          <Field label="Password" name="password" required icon={Lock} type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)}/>
          <Field label="Confirm password" name="confirmPassword" required icon={Lock} type="password" placeholder="Repeat password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
          <FileDrop label="Avatar (optional)" hint="JPG or PNG, up to 5MB" />
          <Button full  type="submit" disabled={isLoading}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
          <div style={{ textAlign: "center", marginTop: 18, fontSize: 12.5, color: C.textFaint }}>
            Already have one? <Link to="/login" style={{ color: C.accent }}>Log in</Link>
          </div>
      </form>
    </AuthShell>
    </>
  );
}
