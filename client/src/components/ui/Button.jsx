export default function Button({
  children,
  type = "button",
  loading = false,
  className = "",
  ...props
}) {
  return (
    <button
      type={type}
      disabled={loading}
      className={`
        h-10
        w-full
        rounded-full
        bg-gradient-to-r
        from-[#626cf5]
        to-[#3739a8]
        text-sm
        font-semibold
        text-white
        transition
        hover:opacity-90
        disabled:cursor-not-allowed
        disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}
