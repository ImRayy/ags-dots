import { Variable, bind, exec, execAsync } from "astal";
import icons from "~/lib/icons";
import { bash } from "~/lib/utils";
import { home, options } from "~/options";
import { sysTime } from "~/src/globals/sys-time";
import Button from "./button";

const { random_wall, recording_path } = options.quicksettings;

const ToggleDarkMode = () => {
  const nightLight = Variable(
    exec("hyprshade current") as "vibrance" | "blue-light-filter" | null,
  );

  return (
    <Button
      className={bind(nightLight).as((value) =>
        value === "blue-light-filter" ? "active" : "",
      )}
      onClick={() => {
        if (nightLight.get() === "blue-light-filter") {
          bash("hyprshade off").then(() => nightLight.set(null));
        } else {
          bash("hyprshade on blue-light-filter").then(() =>
            nightLight.set("blue-light-filter"),
          );
        }
      }}
      icon={icons.color.dark}
      label="NightLight"
    />
  );
};

const ScreenRecord = () => {
  const format = bind(sysTime).as(
    (d) => `recording_${d.format("%Y-%m-%d_%H-%M-%S")}.mp4`,
  );
  const isRecording = Variable(false);
  const className = bind(isRecording).as((r) => (r ? "recording" : ""));
  const icon = bind(isRecording).as((r) => (r ? "" : ""));
  const label = bind(isRecording).as((r) => (r ? "Stop" : "Screen Rec"));

  // Why not simply use `pgrep wf-recorder` & be done with comparing string?
  // Well this `Gio.IOErrorEnum: pgrep: no matching criteria specified`
  // fucker showing up in console, which looks ugly
  bash("pgrep wf-recorder > /dev/null && echo true || echo false").then(
    (out) => out === "true" && isRecording.set(true),
  );

  const recordHandler = () => {
    const cmd = `wf-recorder --audio --file="${recording_path}/${format.get()}"`;

    if (!isRecording.get()) {
      isRecording.set(true);
      bash(cmd);
    } else {
      bash("pkill wf-recorder").then(() => {
        isRecording.set(false);
        bash(`notify-send "Recording Saved at ${recording_path}"`);
      });
    }
  };

  return (
    <Button
      className={className}
      icon={icon}
      iconType="label"
      label={label}
      onClick={recordHandler}
    />
  );
};

export default function QSButtons() {
  return (
    <box vertical spacing={8} className="qs-buttons">
      <box spacing={8} className="container">
        <ToggleDarkMode />
        <ScreenRecord />
      </box>
      <box spacing={8} className="container">
        <Button
          icon={icons.ui.colorpicker}
          label="Pick Color"
          onClicked="bash -c hyprpicker | tr -d '\n' | wl-copy"
        />
        <Button
          icon=""
          iconType="label"
          label="Random Wall"
          onClicked={`bash -c '$HOME/.config/ags/scripts/randwall.sh ${random_wall.path}'`}
        />
      </box>
    </box>
  );
}
