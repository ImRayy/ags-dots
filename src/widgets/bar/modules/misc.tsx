import Notifd from "gi://AstalNotifd";
import { bind } from "astal";
import { App } from "astal/gtk3";
import icons from "~/lib/icons";
import { flatpakUpdates } from "~/src/globals/flatpak";
import { WINDOW_NAME as FLATPAK_WN } from "../../flatpak";

export function FlatpakUpdatesCount() {
  return (
    <button
      className="flatpak-updates-count"
      onClick={() => App.toggle_window(FLATPAK_WN)}
    >
      <box>
        <label className="icon" css="padding-right: 5px;" label=" " />
        <label
          className="value"
          label={bind(flatpakUpdates).as((apps) =>
            apps.length.toString().padStart(2, "0"),
          )}
        />
      </box>
    </button>
  );
}

export function QSButton() {
  return (
    <button
      className="qs-button"
      onClick={() => App.toggle_window("quicksettings")}
      child={<icon className="qs icon" icon={icons.ui.link} />}
    />
  );
}

export function NotificationButton() {
  const notifd = Notifd.get_default();

  return (
    <button
      className={bind(notifd, "notifications").as((notis) => {
        if (notis.length > 0 && !notifd.get_dont_disturb()) {
          return "notify-icon has-notifications";
        }
        return "notify-icon";
      })}
      onClick={() => App.toggle_window("notification-center")}
    >
      <icon
        icon={bind(notifd, "dontDisturb").as((dnd) =>
          dnd ? icons.notification.disabled : icons.notification.default,
        )}
      />
    </button>
  );
}
