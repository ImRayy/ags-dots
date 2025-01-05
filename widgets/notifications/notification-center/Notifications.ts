import type { Notifications } from "types/service/notifications";
import Notification from "../Notification";

export default (notifications: Notifications) =>
  Widget.Scrollable({
    hscroll: "never",
    vscroll: "always",
    class_name: "notifications-scrollable",
    vexpand: true,
    child: Widget.Box({
      vertical: true,
      children: notifications
        .bind("notifications")
        .as((value) =>
          value.map((noti) => Notification(noti, { config: { width: 18 } })),
        ),
    }),
    setup: (self) =>
      self.hook(notifications, () => {
        if (notifications.notifications.length === 0) {
          self.visible = false;
        } else self.visible = true;
      }),
  });
