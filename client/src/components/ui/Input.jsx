export default function Input({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-[#9aa5ce]
          "
        />
      )}

      <input
        {...props}
        className="
          h-10
          w-full
          rounded-full
          bg-[#354264]
          pl-10
          pr-4
          text-sm
          text-white
          outline-none
          placeholder:text-[#9aa5ce]
          focus:ring-1
          focus:ring-[#6574ff]
        "
      />
    </div>
  );
}
