import Hyprland from "gi://AstalHyprland";
import { bind } from "astal";

export default function Workspaces() {
  const hypr = Hyprland.get_default();

  return (
    <box className="workspaces">
      {bind(hypr, "workspaces").as((ws) => {
        return [...Array(5)]
          .map((_, i) => i + 1)
          .map((index) => (
            <button
              onClick={() => hypr.dispatch("workspace", index.toString())}
              className={bind(hypr, "focusedWorkspace").as((focused) =>
                focused.id === index
                  ? "focused"
                  : ws.find((w) => w.id === index)
                    ? "occupied"
                    : "default",
              )}
            />
          ));
      })}
    </box>
  );
}
