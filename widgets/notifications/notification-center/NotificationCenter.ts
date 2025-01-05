import { Fallback } from "custom-widgets/Fallback";
import icons from "lib/icons";
import Header from "./Header";
import Notifications from "./Notifications";

export const notifications = await Service.import("notifications");

export const NotificationCenter = () =>
  Widget.Box({
    css: "min-width: 20rem; min-height: 30rem; padding: 8px;",
    vertical: true,
    spacing: 8,
    children: [
      Header(notifications),
      Notifications(notifications),
      Widget.Box({
        class_name: "notifications-fallback",
        child: Fallback({
          icon: icons.notification.default,
          label: "You're all caught up",
          iconSize: 48,
        }),
      }).hook(notifications, (self) => {
        if (notifications.notifications.length > 0) {
          self.visible = false;
        } else self.visible = true;
      }),
    ],
  });

export default () =>
  Widget.Window({
    name: "notification-center",
    visible: false,
    margins: [6, 6],
    anchor: ["right", "top"],
    child: NotificationCenter(),
  });
