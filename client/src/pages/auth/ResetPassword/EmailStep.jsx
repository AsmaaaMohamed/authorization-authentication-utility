import { toast } from "react-toastify";
import { Mail } from "lucide-react";
import Field from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import { useAuthStore } from "../../../store";

const EmailStep = ({ email, setEmail, onSuccess }) => {
  const { sendResetOtp, isLoading } = useAuthStore();
  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      const data = await sendResetOtp(email);
      console.log("sendResetOtp response:", data);
      if (data.success) {
        toast.success(data.message || "OTP sent successfully!");
        onSuccess();
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "An error occurred"
      );
    }
  };

  return (
    <form onSubmit={handleSendOtp}>
        <Field 
            type="email"
            placeholder="Email Address"
            icon={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required />
        <Button full type="submit" disabled={isLoading}>
            {isLoading ? (
                  <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending OTP...</span>
                  </>
                ) : (
                "Send Reset OTP"
            )}
        </Button>
    </form>
  );
};

export default EmailStep;