import { type GLib, Variable, bind, exec } from "astal";
import icons from "~/lib/icons";
import { bash } from "~/lib/utils";
import { options } from "~/options";
import { alertDialog } from "~/src/components/alert";
import Avatar from "~/src/components/avatar";
import { sysTime } from "~/src/globals/sys-time";

const { profile_picture } = options.quicksettings;

const ExtraButtons = () => {
  const uptime = Variable("").poll(
    60 * 1000,
    `bash -c "uptime | awk '{print $3}' | tr ',' ' '"`,
  );

  return (
    <box className="buttons-container" spacing={4}>
      <button hexpand>{bind(uptime).as((v) => `󰔟 ${v}`)}</button>
      <button
        className="lock"
        onClick={() => exec("hyprlock")}
        child={<icon icon={icons.ui.lock} />}
      />
      <button
        className="logOut"
        onClick={() =>
          alertDialog.set({
            title: "Logout",
            func: () => bash("./scripts/logout.sh"),
          })
        }
        child={<icon icon={icons.powermenu.logout} />}
      />
    </box>
  );
};

const DayProgress = () => {
  function timePassedInADay(date: GLib.DateTime) {
    const current = date.get_minute() + date.get_hour() * 60;
    return Math.floor((current * 100) / (24 * 60));
  }

  return (
    <box className="day-progress" vertical spacing={4}>
      {bind(sysTime).as((date) => {
        const timePassed = timePassedInADay(date);

        return (
          <>
            <box
              className="day-progress label-container"
              css="border-radius: 6px; padding: 1px 0;"
            >
              <label hexpand>{`${date.format("%A")} | ${timePassed}%`}</label>
            </box>
            <box vexpand />
            <levelbar hexpand max_value={100} value={timePassed} />
          </>
        );
      })}
    </box>
  );
};

export default function Profile() {
  return (
    <box className="profile" spacing={10}>
      <Avatar image={profile_picture} />
      <box
        className="options"
        vertical
        spacing={6}
        hexpand
        css="border-radius: 8px; padding: 8px;"
      >
        <ExtraButtons />
        <DayProgress />
      </box>
    </box>
  );
}
