import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import { Lock } from "lucide-react";
import { useAuthStore } from "../../../store";

const NewPasswordStep = ({ resetToken }) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { resetPassword, isLoading } = useAuthStore();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPassword(
        resetToken,
        newPassword,
        confirmPassword
      );
      if (data.success) {
        toast.success(
          data.message || "Password reset successfully!"
        );
        navigate("/login");
      } else {
        toast.error(
          data.message || "Failed to reset password"
        );
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
    <>
      <div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          New Password
        </h1>

        <p className="text-indigo-200/80 text-sm mt-2">
          Set a strong password to secure your account.
        </p>
      </div>
      <form onSubmit={handleResetPassword}>
        <Field
          label="New password"
          name="newPassword"
          required
          icon={Lock}
          type="password"
          placeholder="At least 8 characters"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Field
          label="Confirm new password"
          name="confirmPassword"
          required
          icon={Lock}
          type="password"
          placeholder="Repeat password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          full
          type="submit"
          disabled={
            isLoading ||
            !newPassword ||
            !confirmPassword ||
            newPassword !== confirmPassword
          }
        >
          {isLoading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Updating Password...</span>
            </>
          ) : (
            "Submit New Password"
          )}
        </Button>
      </form>
    </>
  );
};

export default NewPasswordStep;