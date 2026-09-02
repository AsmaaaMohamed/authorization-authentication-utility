import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import AuthShell from "./AuthShell";
import { C } from "../../constants/theme";
import Field from "../ui/Field";
import Button from "../ui/Button";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
  const { login, isLoading } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const success = await login(email, password);
    console.log(success);
    if (success) {
      navigate("/workspaces");
    }
  };
  return (
    <>
      <AuthShell>
        <div
          style={{
            fontSize: 16,
            color: C.text,
            fontWeight: 600,
            marginBottom: 3,
          }}
        >
          Log in
        </div>
        <div style={{ fontSize: 12.5, color: C.textFaint, marginBottom: 22 }}>
          Required: email, password.
        </div>
        <form onSubmit={handleSubmit}>
          <Field
            label="Email"
            name="email"
            icon={Mail}
            type="email"
            placeholder="Your Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Field
            label="Password"
            name="password"
            required
            icon={Lock}
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            right={
              <span
                onClick={() => setShowPw(!showPw)}
                style={{ cursor: "pointer" }}
              >
                {showPw ? (
                  <Eye size={14} color={C.textFaint} />
                ) : (
                  <EyeOff size={14} color={C.textFaint} />
                )}
              </span>
            }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ textAlign: "right", marginBottom: 20 }}>
            <Link
              to="/reset-password"
              style={{ fontSize: 12, color: C.accent }}
            >
              Forgot password?
            </Link>
          </div>
          <Button full disabled={isLoading} type="submit">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <div
            style={{
              textAlign: "center",
              marginTop: 18,
              fontSize: 12.5,
              color: C.textFaint,
            }}
          >
            No account?{" "}
            <Link to="/signup" style={{ color: C.accent }}>
              Sign up
            </Link>
          </div>
        </form>
      </AuthShell>
    </>
  );
};

export default LoginForm;
