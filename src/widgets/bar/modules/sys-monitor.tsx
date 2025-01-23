import { bind } from "astal";
import { cpuUsage } from "~/src/globals/cpu";
import { memUsage } from "~/src/globals/mem";

const CPU = () => {
  return (
    <box className="cpu-usage">
      <label className="icon" label=" " />
      <label
        className="value"
        label={bind(cpuUsage).as((value) => `${value}%`)}
      />
    </box>
  );
};

const Mem = () => {
  return (
    <box className="memory-usage">
      <label className="icon" label=" " />
      <label
        className="value"
        label={bind(memUsage).as(
          (value) => `${(value.used / 1024).toFixed(0)} MiB`,
        )}
      />
    </box>
  );
};

export { CPU, Mem };
