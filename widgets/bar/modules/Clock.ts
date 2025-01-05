import GLib from "gi://GLib";
import { opt } from "lib/options";
import type { DateTime } from "types/@girs/glib-2.0/glib-2.0.cjs";

const format = opt("%A %d - %R");

const date = Variable(GLib.DateTime.new_now_local(), {
  poll: [1000, (): DateTime => GLib.DateTime.new_now_local()],
});

const time = Utils.derive([date, format], (c, f) => c.format(f) || "");

export default () =>
  Widget.Box({
    class_name: "clock",
    children: [
      Widget.Label({
        class_name: "icon",
        css: "padding-right: 3px;",
        label: " ",
      }),
      Widget.Label({
        class_name: "value",
        label: time.bind(),
      }),
    ],
  });
