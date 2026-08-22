export default function AuthCard({ children, className = "" }) {
  return (
    <div
      className={`
        w-full
        rounded-lg
        bg-[#0d172c]
        px-9
        py-9
        shadow-2xl
        ${className}
      `}
      AuthCard
    >
      {children}
    </div>
  );
}
