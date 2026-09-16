import { useRef } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import { verifyOtp, useAuthStore } from "../../../store";
import { C } from "../../../constants/theme";

const OtpStep = ({ email, onSuccess, onChangeEmail }) => {
  const inputRefs = useRef([]);
  const isVerifyingOtp = useAuthStore((state) => state.isVerifyingOtp);

  const handleOtpInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    pasteData.split("").forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char;
    });
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current.map((input) => input?.value || "").join("");

    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    try {
      const data = await verifyOtp(email, otpValue);
      toast.success("OTP verified successfully");
      onSuccess({ otp: otpValue, sentResetToken: data.resetToken });
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <form onSubmit={handleVerifyOtp} style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 12, color: C.textFaint, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 8 }}>
          Verification step
        </div>
        <h1 style={{ margin: 0, fontSize: 26, color: C.text, fontWeight: 700 }}>Enter OTP</h1>
        <p style={{ margin: "10px auto 0", maxWidth: 300, color: C.textMuted, fontSize: 13, lineHeight: 1.7 }}>
          Enter the 6-digit code sent to your email.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 4 }} onPaste={handleOtpPaste}>
        {Array.from({ length: 6 }).map((_, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            required
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            onInput={(e) => handleOtpInput(e, index)}
            onKeyDown={(e) => handleOtpKeyDown(e, index)}
            aria-label={`Digit ${index + 1}`}
            style={{
              width: 40,
              height: 46,
              borderRadius: 10,
              border: `1px solid ${C.border}`,
              background: C.panel2,
              textAlign: "center",
              color: C.text,
              fontWeight: 700,
              fontSize: 18,
              outline: "none",
            }}
          />
        ))}
      </div>

      <Button type="submit" full disabled={isVerifyingOtp}>
        {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
      </Button>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Button type="button" variant="text" onClick={onChangeEmail}>
          Change email
        </Button>
        <Button type="button" variant="textAccent">
          Resend code
        </Button>
      </div>
    </form>
  );
};

export default OtpStep;