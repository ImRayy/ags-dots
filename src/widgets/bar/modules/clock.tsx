import { bind } from "astal";
import { sysTime } from "~/src/globals/sys-time";

export default function Clock() {
  const time = bind(sysTime).as((value) => value.format("%A, %d %B at %R"));

  return (
    <box className="clock">
      <label className="icon" label=" " css="padding-right: 3px;" />
      <label className="value">{time}</label>
    </box>
  );
}
