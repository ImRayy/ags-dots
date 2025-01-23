import { App } from "astal/gtk3";
import { options } from "~/options";
import { WINDOW_NAME as WALL_PICKER_WN } from "../../wall-picker";

const SCREENSHOT_PATH = options.quicksettings.screenshot.path;

export default function QuickAccessButtons() {
  return (
    <box className="quickaccess-buttons" spacing={15}>
      <button label="" onClicked={() => App.toggle_window(WALL_PICKER_WN)} />
      <button
        onClicked={`hyprshot -m region --output-folder ${SCREENSHOT_PATH}`}
        label=""
      />
    </box>
  );
}
