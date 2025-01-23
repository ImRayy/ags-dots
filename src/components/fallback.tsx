import type { Binding } from "astal";
import { Icon } from "astal/gtk3/widget";

interface FallbackProps {
  iconType?: "label" | "icon";
  icon: string | Binding<string>;
  iconSize?: number;
  label?: string | Binding<string>;
}

export default function Fallback({
  iconType = "icon",
  iconSize = 42,
  icon,
  label,
}: FallbackProps) {
  const size = `font-size: ${iconSize}`;

  return (
    <centerbox
      className="fallback"
      vertical
      hexpand
      vexpand
      centerWidget={
        <box vertical spacing={10}>
          {iconType === "icon" ? (
            <Icon icon={icon} css={size} />
          ) : (
            <label label={icon} css={size} />
          )}
          <label label={label} />
        </box>
      }
    />
  );
}
