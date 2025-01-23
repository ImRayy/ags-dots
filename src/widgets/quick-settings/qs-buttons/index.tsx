import { Variable, bind, exec, execAsync } from "astal";
import icons from "~/lib/icons";
import { options } from "~/options";
import { sysTime } from "~/src/globals/sys-time";
import Button from "./button";

const { random_wall } = options.quicksettings;

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
          execAsync("hyprshade off").then(() => nightLight.set(null));
        } else {
          execAsync("hyprshade on blue-light-filter").then(() =>
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
  const format = `recording_${sysTime.get().format("%Y-%m-%d_%H-%M-%S")}.mp4`;
  const isRecording = Variable(false);
  const className = bind(isRecording).as((r) => (r ? "recording" : ""));
  const icon = bind(isRecording).as((r) => (r ? "" : ""));
  const label = bind(isRecording).as((r) => (r ? "Stop" : "Screen Rec"));

  execAsync("pgrep wf-recorder").then(() => isRecording.set(true));

  const recordHandler = () => {
    const cmd = `wf-recorder --audio --file="/home/ray/${format}"`;

    if (!isRecording.get()) {
      isRecording.set(true);
      execAsync(cmd);
    } else {
      execAsync("pkill wf-recorder").then(() => {
        isRecording.set(false);
        execAsync(`notify-send "${format} Saved"`);
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
