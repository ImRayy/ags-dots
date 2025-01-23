import Notifd from "gi://AstalNotifd";
import { Variable, bind, timeout } from "astal";
import type { Subscribable } from "astal/binding";
import { Astal, type Gtk } from "astal/gtk3";
import Notification from "./notification";

const TIMEOUT_DELAY = 5000;

// Source: https://github.com/Aylur/astal/blob/main/examples/gtk3/js/
// notifications/notifications/Notification.tsx
// NOTE: Also for more detailed information checkout dynamic-children section
// https://aylur.github.io/astal/guide/typescript/first-widgets#dynamic-children
export class NotifiationMap implements Subscribable {
  // the underlying map to keep track of id widget pairs
  private map: Map<number, Gtk.Widget> = new Map();

  // it makes sense to use a Variable under the hood and use its
  // reactivity implementation instead of keeping track of subscribers ourselves
  private var: Variable<Array<Gtk.Widget>> = Variable([]);

  // notify subscribers to rerender when state changes
  private notifiy() {
    this.var.set([...this.map.values()].reverse());
  }

  constructor() {
    const notifd = Notifd.get_default();

    notifd.connect("notified", (_, id) => {
      this.set(
        id,
        Notification({
          noti: notifd.get_notification(id)!,
          onClick: () => {
            this.delete(id);
          },

          setup: () =>
            timeout(TIMEOUT_DELAY, () => {
              this.delete(id);
            }),
        }),
      );
    });

    // notifications can be closed by the outside before
    // any user input, which have to be handled too
    notifd.connect("resolved", (_, id) => {
      this.delete(id);
    });
  }

  private set(key: number, value: Gtk.Widget) {
    // in case of replacecment destroy previous widget
    this.map.get(key)?.destroy();
    this.map.set(key, value);
    this.notifiy();
  }

  private delete(key: number) {
    this.map.get(key)?.destroy();
    this.map.delete(key);
    this.notifiy();
  }

  // needed by the Subscribable interface
  get() {
    return this.var.get();
  }

  // needed by the Subscribable interface
  subscribe(callback: (list: Array<Gtk.Widget>) => void) {
    return this.var.subscribe(callback);
  }
}

export function NotificationPopups() {
  const { TOP, RIGHT } = Astal.WindowAnchor;

  const notifs = new NotifiationMap();

  return (
    <window
      name="notifications"
      anchor={TOP | RIGHT}
      layer={Astal.Layer.OVERLAY}
    >
      <box css="padding: 0.1px;">
        <box className="notifications" vertical vexpand>
          {bind(notifs)}
        </box>
      </box>
    </window>
  );
}
