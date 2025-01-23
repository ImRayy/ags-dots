import type { Binding } from "astal";
import { Gtk } from "astal/gtk3";
import type { ButtonProps } from "astal/gtk3/widget";

interface CustomButtonProps extends ButtonProps {
  iconType: "gtk" | "label";
  icon: string | Binding<string>;
  label: string | Binding<string>;
}

export default function Button(props: Partial<CustomButtonProps>) {
  const { iconType = "gtk", label, icon, ...buttonAttrs } = props;

  const Icon =
    iconType === "gtk" ? <icon icon={icon} /> : <label label={icon} />;

  return (
    <button {...buttonAttrs}>
      <box
        spacing={iconType === "gtk" ? 4 : 10}
        className="custom-button"
        halign={Gtk.Align.CENTER}
      >
        {Icon}
        <label label={label} />
      </box>
    </button>
  );
}
