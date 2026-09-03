import { useRef } from "react";
import { toast } from "react-toastify";
import Button from "../../../components/ui/Button";
import { useAuthStore } from "../../../store/useAuthStore";

const OtpStep = ({ email, onSuccess, onChangeEmail }) => {
  const inputRefs = useRef([]);
  const { verifyOtp, isLoading } = useAuthStore();
  const handleOtpInput = (e, index) => {
    if (
      e.target.value.length > 0 &&
      index < inputRefs.current.length - 1
    ) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleOtpKeyDown = (e, index) => {
    if (
      e.key === "Backspace" &&
      e.target.value === "" &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    pasteData.split("").forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    const nextIndex = Math.min(pasteData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current
      .map((input) => input?.value || "")
      .join("");

    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }
    try {
      const data = await verifyOtp(email, otpValue);
      toast.success("OTP verified successfully");
      onSuccess({
          otp: otpValue,
          sentResetToken: data.resetToken,
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Invalid or expired OTP"
      );
    }
  };

  return (
    <form
      onSubmit={handleVerifyOtp}
      className="flex flex-col gap-6 text-center"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Enter OTP
        </h1>

        <p className="text-indigo-200/80 text-sm mt-2">
          Enter the 6-digit code sent to your email.
        </p>
      </div>
      <div
        className="flex justify-between gap-2 sm:gap-3 my-2"
        onPaste={handleOtpPaste}
      >
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
            className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold text-white bg-slate-800/90 border border-slate-700 rounded-xl focus:ring-indigo-500/30 outline-none transition-all"
            aria-label={`Digit ${index + 1}`}
          />
        ))}
      </div>
      <Button
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify OTP"}
      </Button>
      <div className="flex justify-between items-center text-xs text-slate-400">
        <Button
          type="button"
          onClick={onChangeEmail}
          variant="text"
        >
          Change Email
        </Button>
        <Button
          type="button"
          variant="textAccent"
        >
          Resend Code
        </Button>
      </div>
    </form>
  );
};

export default OtpStep;