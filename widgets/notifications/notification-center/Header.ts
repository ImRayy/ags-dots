import type { Notifications } from "types/service/notifications";
import icons from "lib/icons";

export default (notis: Notifications) => {
  const title = Widget.Label({
    label: "NOTIFICATIONS",
    xalign: 0,
    hexpand: true,
  });

  const dndToggleBtn = Widget.Button({
    on_primary_click: () => {
      notis.dnd = !notis.dnd;
    },
    setup: (self) => {
      self.hook(notis, () => {
        self.toggleClassName("notifications-disabled", notis.dnd);
      });
    },
    child: Widget.Icon().hook(notis, (self) => {
      if (notis.dnd) {
        self.icon = icons.notification.disabled;
      } else {
        self.icon = icons.notification.default;
      }
    }),
  });

  const clearAllBtn = Widget.Button({
    on_primary_click: () => notis.Clear(),
    child: Widget.Icon().hook(notis, (self) => {
      if (notis.notifications.length > 0) {
        self.icon = icons.trash.full;
      } else self.icon = icons.trash.empty;
    }),
  });

  return Widget.Box({
    class_name: "notifications-header",
    children: [
      Widget.Box({
        spacing: 8,
        children: [
          Widget.Box([
            Widget.Separator({
              css: `
                margin: 6px 0; 
                margin-right: 4px;
                min-width: 3px; 
                border-radius: 1rem
              `,
            }),
            title,
          ]),
          dndToggleBtn,
          clearAllBtn,
        ],
      }),
    ],
  });
};
