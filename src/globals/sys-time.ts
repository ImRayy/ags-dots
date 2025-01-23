import { GLib, Variable } from "astal";

export const sysTime = Variable(GLib.DateTime.new_now_local()).poll(
  1000,
  (): GLib.DateTime => GLib.DateTime.new_now_local(),
);
