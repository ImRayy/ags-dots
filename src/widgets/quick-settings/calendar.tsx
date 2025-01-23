import { bind } from "astal";
import { Gtk, astalify } from "astal/gtk3";
import { sysTime } from "~/src/globals/sys-time";

const getCharArray = (str: string): string[] => {
  return str.toUpperCase().split("");
};

const DateWidget = () => {
  const currentDate = bind(sysTime).as((d) => d.format("%b-%d-%a") ?? "");

  const dateChars = (
    <box css="min-width: 28px;" vertical>
      <label className="char">
        {bind(currentDate).as((d) =>
          getCharArray(d)
            .map((c) => (c === "-" ? "" : c))
            .join("\n"),
        )}
      </label>
    </box>
  );

  const separators = (
    <label
      className="separator"
      css="opacity: 1;"
      label={bind(currentDate).as((value) =>
        getCharArray(value.toString())
          .map((c) => (c !== "-" ? "" : c))
          .join("\n"),
      )}
    />
  );

  return (
    <box className="date-widget" homogeneous vertical spacing={6}>
      <box className="container">
        <overlay
          valign={Gtk.Align.CENTER}
          child={dateChars}
          overlay={separators}
        />
      </box>
    </box>
  );
};

export default function Calendar() {
  const C = astalify(Gtk.Calendar);

  return (
    <box className="calendar" spacing={6}>
      <DateWidget />
      <box className="container" css="padding: 0px 4px;">
        <C hexpand />
      </box>
    </box>
  );
}
