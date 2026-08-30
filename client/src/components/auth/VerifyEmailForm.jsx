import { Mail } from "lucide-react";
import Button from "../ui/Button";
import AuthShell from "./AuthShell";

export default function VerifyEmailForm() {
  return (
    <AuthShell>
      <div className="text-center">
        <div
          className="
            mx-auto
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            bg-[#354264]
          "
        >
          <Mail size={24} className="text-[#6678ff]" />
        </div>

        <h1 className="mt-5 text-2xl font-bold text-white">
          Verify Your Email
        </h1>

        <p className="mx-auto mt-3 max-w-[280px] text-xs leading-5 text-[#8793bd]">
          We've sent a verification code to your email address. Enter the code
          below to continue.
        </p>
      </div>

      <div className="mt-7 flex justify-center gap-2">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <input
            key={item}
            maxLength={1}
            inputMode="numeric"
            className="
              h-11
              w-10
              rounded-md
              bg-[#354264]
              text-center
              text-lg
              font-semibold
              text-white
              outline-none
              focus:ring-1
              focus:ring-[#6574ff]
            "
          />
        ))}
      </div>

      <Button className="mt-6">Verify Email</Button>

      <p className="mt-5 text-center text-[11px] text-[#8994b5]">
        Didn't receive the code?{" "}
        <button className="text-[#667cff] underline">Resend</button>
      </p>
    </AuthShell>
  );
}
