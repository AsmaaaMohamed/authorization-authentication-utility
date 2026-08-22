/**
 * File: src/pages/ResetPassword.jsx
 * Description: Multi-stage password recovery page handling email OTP dispatch, 6-digit OTP verification with auto-focus/paste support, and new password submission.
 * 
 * Steps:
 * 1. Initializes component state for email, 6-digit OTP, new password, stage tracking (isEmailSent, isOtpSubmitted), and loading indicators.
 * 2. Implements OTP input keyboard navigation, backspace deletion, and auto-paste distribution across 6 individual input fields.
 * 3. handleSendOtp submits email to /api/auth/send-reset-otp and advances view to OTP entry stage upon success.
 * 4. handleVerifyOtp collects and validates the 6-digit OTP string before advancing view to new password stage.
 * 5. handleResetPassword submits email, OTP, and newPassword to /api/auth/reset-password, shows success feedback, and navigates to /login.
 * 6. Renders responsive dark-themed glassmorphism card containing interactive forms corresponding to the active stage.
 */

import React, { useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useAuthStore } from "../store";

const ResetPassword = () => {
  const navigate = useNavigate();
  const backendUrl = useAuthStore((state) => state.backendUrl);

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);

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
    const pasteData = e.clipboardData.getData("text").slice(0, 6);
    const pasteArray = pasteData.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
    const nextIndex = Math.min(pasteArray.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email }
      );

      if (data.success) {
        toast.success(data.message || "OTP sent successfully!");
        setIsEmailSent(true);
      } else {
        toast.error(data.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpValue = inputRefs.current
      .map((input) => input?.value || "")
      .join("");

    if (otpValue.length < 6) {
      toast.error("Please enter the complete 6-digit OTP");
      return;
    }

    setOtp(otpValue);
    setIsOtpSubmitted(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    try {
      setLoading(true);
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        {
          email,
          otp,
          newPassword,
        }
      );

      if (data.success) {
        toast.success(data.message || "Password reset successfully!");
        navigate("/login");
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || error.message || "An error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-slate-900 to-indigo-950 px-4 sm:px-6">
      <img
        src={assets.bg_img}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
      />

      <header className="absolute top-6 left-6 sm:left-10 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 transition-transform hover:scale-105"
          aria-label="Go to homepage"
        >
          <img src={assets.logo} alt="Logo" className="w-28 sm:w-32" />
        </Link>
      </header>

      <main className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-950/50">
        {!isEmailSent && (
          <form
            onSubmit={handleSendOtp}
            className="flex flex-col gap-5 text-center"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Reset Password
              </h1>
              <p className="text-indigo-200/80 text-sm mt-2">
                Enter your registered email address to receive a recovery code.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full px-4 py-3 rounded-full bg-slate-800/80 border border-slate-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <img
                src={assets.mail_icon}
                alt=""
                aria-hidden="true"
                className="w-5 h-5 opacity-70"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent outline-none w-full text-white placeholder:text-slate-400 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Sending OTP...</span>
                </>
              ) : (
                "Send Reset OTP"
              )}
            </button>

            <p className="text-xs text-slate-400 mt-2">
              Remember your password?{" "}
              <Link
                to="/login"
                className="text-indigo-400 hover:text-indigo-300 font-medium underline"
              >
                Log in
              </Link>
            </p>
          </form>
        )}

        {isEmailSent && !isOtpSubmitted && (
          <form
            onSubmit={handleVerifyOtp}
            className="flex flex-col gap-6 text-center"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                Enter OTP
              </h1>
              <p className="text-indigo-200/80 text-sm mt-2">
                We sent a 6-digit code to{" "}
                <span className="text-indigo-400 font-medium">{email}</span>
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
                  maxLength={1}
                  required
                  ref={(el) => (inputRefs.current[index] = el)}
                  onInput={(e) => handleOtpInput(e, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  className="w-11 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-bold text-white bg-slate-800/90 border border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none transition-all"
                  aria-label={`Digit ${index + 1}`}
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 cursor-pointer"
            >
              Verify OTP
            </button>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <button
                type="button"
                onClick={() => setIsEmailSent(false)}
                className="hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Change Email
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
              >
                Resend Code
              </button>
            </div>
          </form>
        )}

        {isEmailSent && isOtpSubmitted && (
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col gap-5 text-center"
          >
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
                New Password
              </h1>
              <p className="text-indigo-200/80 text-sm mt-2">
                Set a strong password to secure your account.
              </p>
            </div>

            <div className="flex items-center gap-3 w-full px-4 py-3 rounded-full bg-slate-800/80 border border-slate-700 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
              <img
                src={assets.lock_icon}
                alt=""
                aria-hidden="true"
                className="w-5 h-5 opacity-70"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="bg-transparent outline-none w-full text-white placeholder:text-slate-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-slate-400 hover:text-indigo-300 focus:outline-none cursor-pointer"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 active:scale-[0.99] text-white font-medium text-sm transition-all duration-200 shadow-lg shadow-indigo-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Updating Password...</span>
                </>
              ) : (
                "Submit New Password"
              )}
            </button>
          </form>
        )}
      </main>
    </div>
  );
};

export default ResetPassword;
