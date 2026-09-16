import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../../../components/ui/Field";
import Button from "../../../components/ui/Button";
import { Lock } from "lucide-react";
import { resetPassword, useAuthStore } from "../../../store";
import { C } from "../../../constants/theme";

const NewPasswordStep = ({ resetToken }) => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const isResettingPassword = useAuthStore((state) => state.isResettingPassword);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const data = await resetPassword(resetToken, newPassword, confirmPassword);
      if (data.success) {
        toast.success(data.message || "Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "An error occurred");
    }
  };

  return (
    <>
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 12, color: C.textFaint, letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 8 }}>
          Secure account
        </div>
        <h1 style={{ margin: 0, fontSize: 28, color: C.text, fontWeight: 700 }}>Create a new password</h1>
        <p style={{ margin: "10px 0 0", fontSize: 13, lineHeight: 1.7, color: C.textMuted }}>
          Choose a strong password to secure your account.
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
          disabled={isResettingPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
        >
          {isResettingPassword ? "Updating password..." : "Submit new password"}
        </Button>
      </form>
    </>
  );
};

export default NewPasswordStep;