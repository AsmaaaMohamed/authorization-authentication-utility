import { toast } from "react-toastify";
import { Mail, ArrowRight } from "lucide-react";
import Field from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import { sendResetOtp, useAuthStore } from "../../../store";
import { C } from "../../../constants/theme";

const EmailStep = ({ email, setEmail, onSuccess }) => {
  const isSendingOtp = useAuthStore((state) => state.isSendingOtp);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const data = await sendResetOtp(email);
      if (data.success) {
        toast.success(data.message || "OTP sent successfully!");
        onSuccess();
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  return (
    <form onSubmit={handleSendOtp}>
      <div style={{ fontSize: 13.5, color: C.textMuted, lineHeight: 1.7, marginBottom: 18 }}>
        Enter the email address associated with your account and we’ll send the verification code.
      </div>

      <Field type="email" placeholder="Email Address" name="email" icon={Mail} value={email} onChange={(e) => setEmail(e.target.value)} required />

      <Button full type="submit" disabled={isSendingOtp}>
        {isSendingOtp ? "Sending OTP..." : (
          <>
            Send reset OTP
            <ArrowRight size={14} />
          </>
        )}
      </Button>
    </form>
  );
};

export default EmailStep;