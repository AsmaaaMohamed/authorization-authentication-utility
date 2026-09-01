import { MONO, TAGS } from "../../constants/theme";

export default function TagChip({ tagKey }) {
  const tag = TAGS[tagKey];

  if (!tag) return null;

  return (
    <span
      style={{
        fontFamily: MONO,
        fontSize: 10.5,
        letterSpacing: 0.3,
        padding: "2px 7px",
        borderRadius: 4,
        color: tag.color,
        background: `${tag.color}1A`,
        border: `1px solid ${tag.color}33`,
      }}
    >
      {tag.label}
    </span>
  );
}
