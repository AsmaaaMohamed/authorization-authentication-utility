import { Mail, ShieldCheck } from "lucide-react";
import Button from "../ui/Button";
import AuthShell from "./AuthShell";
import { C } from "../../constants/theme";

export default function VerifyEmailForm() {
  return (
    <AuthShell>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: `${C.accent}1A`,
            border: `1px solid ${C.accent}33`,
            margin: "0 auto 18px",
            color: C.accent,
          }}
        >
          <Mail size={22} />
        </div>

        <div style={{ fontSize: 12, color: C.textFaint, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 8 }}>
          Account verification
        </div>

        <h1 style={{ margin: 0, fontSize: 28, color: C.text, fontWeight: 700 }}>Verify your email</h1>

        <p style={{ margin: "12px auto 0", maxWidth: 300, fontSize: 13, lineHeight: 1.7, color: C.textMuted }}>
          We sent a 6-digit verification code to your email address. Enter it below to continue.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 24 }}>
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            maxLength={1}
            inputMode="numeric"
            aria-label={`Verification digit ${index + 1}`}
            style={{
              width: 38,
              height: 42,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.panel2,
              textAlign: "center",
              fontSize: 18,
              fontWeight: 700,
              color: C.text,
              outline: "none",
            }}
          />
        ))}
      </div>

      <div style={{ marginTop: 22 }}>
        <Button full>
          <ShieldCheck size={14} />
          Verify email
        </Button>
      </div>

      <p style={{ margin: "18px 0 0", textAlign: "center", fontSize: 12.5, color: C.textFaint }}>
        Didn’t receive the code? <button type="button" style={{ color: C.accent, background: "transparent", border: "none", cursor: "pointer", textDecoration: "underline" }}>Resend</button>
      </p>
    </AuthShell>
  );
}
