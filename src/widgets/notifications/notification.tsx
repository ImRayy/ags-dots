import Notifd from "gi://AstalNotifd";
import { GLib, bind } from "astal";
import { Gtk } from "astal/gtk3";
import type { EventBox } from "astal/gtk3/widget";
import icons from "~/lib/icons";
import Separator from "~/src/components/separator";
import { sysTime } from "~/src/globals/sys-time";

function getRelativeTime(mins: number) {
  // Seconds
  if (mins === 0) return "now";

  // Minutes
  if (mins < 60) {
    return `${mins} minute${mins > 1 ? "s" : ""} ago`;
  }

  // Hours
  if (mins < 1440) {
    const hours = Math.trunc(mins / 60);
    return `${hours} hours${hours > 1 ? "s" : ""} ago`;
  }

  // Days
  const days = Math.trunc(mins / 1440);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}

const urgency = (n: Notifd.Notification) => {
  const { LOW, NORMAL, CRITICAL } = Notifd.Urgency;

  switch (n.urgency) {
    case LOW:
      return "low";
    case CRITICAL:
      return "critical";
    case NORMAL:
      return "normal";
    default:
      return "normal";
  }
};

const fileExists = (path: string) => GLib.file_test(path, GLib.FileTest.EXISTS);

const NotificationIcon = ({ icon }: { icon: string }) => {
  if (!icon) {
    return null;
  }

  return (
    <icon
      icon={icon}
      visible={Boolean(icon)}
      css="margin-right: 6px; font-size: 16px;"
    />
  );
};

const NotificationImage = ({ image }: { image: string }) => {
  const css = `
     background-image: url("${image}");
     background-size: cover;
     background-repeat: no-repeat;
     background-position: center;
     min-height: 70px;
     min-width: 70px;
     margin-right: 8px;
     border-radius: 8px;
  `;

  if (!image || !fileExists(image)) {
    return null;
  }

  return (
    <box valign={Gtk.Align.START} className="notification-image" css={css} />
  );
};

const Title = ({ title }: { title: string }) => {
  return (
    <label
      className="title"
      label={title}
      hexpand
      justify={Gtk.Justification.LEFT}
      truncate
      use_markup
      wrap
      xalign={0}
    />
  );
};

const Description = ({ desc }: { desc: string }) => {
  return (
    <label
      className="description"
      label={desc}
      hexpand
      justify={Gtk.Justification.LEFT}
      max_width_chars={28}
      use_markup
      wrap
      xalign={0}
    />
  );
};

const TimePassed = ({ notiTime }: { notiTime: number }) => {
  return (
    <label
      className="time"
      css="margin-right: 8px; font-size: 12px;"
      hexpand
      xalign={1}
      label={bind(sysTime).as((currTime) => {
        const time = GLib.DateTime.new_from_unix_local(notiTime).to_unix();
        const diff = currTime.to_unix() - time;
        const diffInMins = Math.trunc(diff / 60);
        return getRelativeTime(diffInMins);
      })}
    />
  );
};
const CloseBtn = ({ func }: { func: () => void }) => {
  return (
    <button className="close-button" onClick={func} css="all:unset;">
      <icon icon={icons.ui.close} css="font-size: 17px;" />
    </button>
  );
};

const Actions = ({
  actions,
  invoke,
  dismiss,
}: {
  actions: Notifd.Action[];
  invoke: (id: string) => void;
  dismiss: () => void;
}) => {
  const buttons = actions.map(({ id, label }) => (
    <button
      css="min-height: 28px;"
      onClick={() => {
        invoke(id);
        dismiss();
      }}
    >
      <label label={label} />
    </button>
  ));

  return (
    <revealer
      revealChild={
        actions.length > 0 && actions.every((a) => a.label.trim() !== "")
      }
    >
      <box
        homogeneous
        spacing={6}
        className="action-buttons"
        css="margin-top: 8px;"
      >
        {buttons}
      </box>
    </revealer>
  );
};

const Header = ({ noti }: { noti: Notifd.Notification }) => {
  return (
    <box>
      <NotificationIcon icon={noti.appIcon || noti.desktopEntry} />
      <label
        css="font-size: 12px;"
        label={bind(noti, "app_name").as(
          (app_name) =>
            app_name.charAt(0).toUpperCase() +
            app_name.slice(1).replace("-", " "),
        )}
      />
      <TimePassed notiTime={noti.time} />
      <CloseBtn func={() => noti.dismiss()} />
    </box>
  );
};

const Content = ({ noti }: { noti: Notifd.Notification }) => {
  return (
    <box className="notification-content">
      <NotificationImage image={noti.image} />
      <box hexpand vertical>
        <box>
          <Title title={noti.summary} />
        </box>
        <Description desc={noti.body} />
      </box>
    </box>
  );
};

type NotificationProps = {
  noti: Notifd.Notification;
  width?: number;
  setup?(self: EventBox): void;
  onClick?(self: EventBox): void;
};

export default function Notification(props: NotificationProps) {
  const { noti, setup, onClick, width = 20 } = props;

  return (
    <eventbox setup={setup} onClick={onClick}>
      <box
        className={`notification ${urgency(noti)}`}
        css={`padding: 8px; min-width: ${width}rem`}
        vertical
      >
        <Header noti={noti} />
        <Separator />
        <Content noti={noti} />
        <Actions
          actions={noti.actions}
          invoke={noti.invoke}
          dismiss={noti.dismiss}
        />
      </box>
    </eventbox>
  );
}
