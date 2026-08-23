import { useNavigate } from "react-router-dom";

export default function Logo() {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-2 cursor-pointer"onClick={() => navigate("/")}>
      <div className="flex gap-1">
        <span className="h-5 w-2 skew-x-[-25deg] bg-[#4f6df5]" />
        <span className="h-5 w-2 skew-x-[-25deg] bg-[#4f6df5]" />
        <span className="h-5 w-2 skew-x-[-25deg] bg-[#4f6df5]" />
      </div>

      <span className="text-2xl font-bold text-[#101a2f]">auth</span>
    </div>
  );
}
