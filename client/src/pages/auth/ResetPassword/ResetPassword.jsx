import { useState } from "react";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import NewPasswordStep from "./NewPasswordStep";
import { useAuthStore } from "../../../store";
import AuthShell from "../../../components/auth/AuthShell";
import { C } from "../../../constants/theme";

const ResetPassword = () => {
  const backendUrl = useAuthStore((state) => state.backendUrl);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [step, setStep] = useState("email");

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
      <main className="relative z-10 w-full max-w-lg  p-8 sm:p-10">
          <AuthShell>
            <div style={{ fontSize: 16, color: C.text, fontWeight: 600, marginBottom: 3 }}>Reset password</div>
            <div style={{ fontSize: 12.5, color: C.textFaint, marginBottom: 22 }}>Required: email</div>
                  {step === "email" && (
                    <EmailStep
                      email={email}
                      setEmail={setEmail}
                      backendUrl={backendUrl}
                      onSuccess={() => setStep("otp")}
                    />
                  )}

                  {step === "otp" && (
                    <OtpStep
                      onSuccess={(otpValue) => {
                        setOtp(otpValue);
                        setStep("password");
                      }}
                      onChangeEmail={() => setStep("email")}
                    />
                  )}

                  {step === "password" && (
                    <NewPasswordStep
                      email={email}
                      otp={otp}
                      backendUrl={backendUrl}
                    />
                  )}
          </AuthShell>

      </main>
    </div>
  );
};

export default ResetPassword;
