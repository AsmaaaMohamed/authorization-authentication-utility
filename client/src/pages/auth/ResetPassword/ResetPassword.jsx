import { useState } from "react";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import NewPasswordStep from "./NewPasswordStep";
import AuthShell from "../../../components/auth/AuthShell";
import { C } from "../../../constants/theme";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);
  const [step, setStep] = useState("email");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: C.bg,
        padding: "32px 18px",
      }}
    >
      <div style={{ width: "100%", maxWidth: 460 }}>
        <AuthShell>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: C.textFaint, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 8 }}>
              Password recovery
            </div>
            <div style={{ fontSize: 28, color: C.text, fontWeight: 700 }}>Reset your password</div>
          </div>

          {step === "email" && (
            <EmailStep email={email} setEmail={setEmail} onSuccess={() => setStep("otp")} />
          )}

          {step === "otp" && (
            <OtpStep
              onSuccess={({ otp, sentResetToken }) => {
                setOtp(otp);
                setResetToken(sentResetToken);
                setStep("password");
              }}
              onChangeEmail={() => setStep("email")}
              email={email}
            />
          )}

          {step === "password" && <NewPasswordStep resetToken={resetToken} />}
        </AuthShell>
      </div>
    </div>
  );
};

export default ResetPassword;
