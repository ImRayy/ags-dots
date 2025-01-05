import GLib from "gi://GLib";
import { isFileExists } from "lib/utils";
import type { Notification } from "types/service/notifications";

const time = (time: number, format = "%H:%M") =>
  GLib.DateTime.new_from_unix_local(time).format(format);
export const notifications = await Service.import("notifications");

export const NotificationIcon = (noti: Notification) => {
  return Widget.Box({
    vpack: "start",
    hexpand: false,
    class_name: "notification-image",
  }).hook(notifications, (self) => {
    const { image } = noti;

    if (image && isFileExists(image)) {
      self.css = `
        background-image: url("${image}");
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        min-height: 80px;
        min-width: 80px;
        margin-right: 8px
      `;
    }
  });
};

type NotificationOptions = {
  config: {
    width: number;
  };
};

export default (noti: Notification, options?: Partial<NotificationOptions>) => {
  const icon = Widget.Box({
    vpack: "start",
    class_name: "icon",
    child: NotificationIcon(noti),
  });

  // Title
  const title = Widget.Label({
    class_name: "title",
    css: "margin-right: 20px;",
    xalign: 0,
    justification: "left",
    hexpand: true,
    truncate: "end",
    wrap: true,
    label: noti.summary.trim(),
    use_markup: true,
  });

  // Description
  const description = Widget.Label({
    class_name: "description",
    css: "margin-top: 2px;",
    hexpand: true,
    use_markup: true,
    xalign: 0,
    justification: "left",
    label: noti.body.trim(),
    max_width_chars: 28,
    wrap: true,
  });

  const clock = Widget.Label({
    hexpand: true,
    css: "margin-right: 0;",
    class_name: "time",
    xalign: 1,
    label: time(noti.time),
  });

  const appname = Widget.Label({
    class_name: "app-name",
    vexpand: true,
    xalign: 1,
    yalign: 1,
    css: "margin-top: 8px",
    label: noti.app_name,
  });

  // Main Window
  return Widget.EventBox({
    on_primary_click: noti.close,
    vexpand: false,
    child: Widget.Box({
      css: `min-width: ${options?.config?.width || 22}rem;`,
      class_name: `notification ${noti.urgency}`,
      children: [
        icon,
        Widget.Box({
          hexpand: true,
          vertical: true,
          children: [
            Widget.Box({
              children: [title, clock],
            }),
            description,
            appname,
          ],
        }),
      ],
    }),
  });
};
