import GLib from "gi://GLib";
import { Variable } from "astal";
import type { Subscribable } from "astal/binding";

const interfaceName = "enp5s0";

type NetStatData = {
  bytesIn: number;
  bytesOut: number;
  in: string;
  out: string;
};

let prevNetUsage = { rx: 0, tx: 0, time: 0 };

// Gets network statistics by given interface name
export const getNetUsage = (
  interfaceName: string,
  type: "rx" | "tx",
): number => {
  const file = `/sys/class/net/${interfaceName}/statistics/${type}_bytes`;
  const [success, data] = GLib.file_get_contents(file);

  if (!success) {
    console.error("Failed to read");
    return 0;
  }
  const value = new TextDecoder("utf-8").decode(data);

  return Number.parseInt(value, 10);
};

const formatData = (value: number): string => {
  const valueInKiB = value / 1e3;

  if (valueInKiB > 1000) {
    return `${(value / 1e6).toFixed(1)} MB/s`;
  }
  return `${valueInKiB.toFixed(1)} KB/s`;
};

const computeNetwork = (): NetStatData => {
  try {
    const tx = getNetUsage(interfaceName, "tx");
    const rx = getNetUsage(interfaceName, "rx");

    const currentTime = Date.now();

    if (prevNetUsage.time === 0) {
      prevNetUsage = { rx, tx, time: currentTime };
    }

    const timeDiff = Math.max((currentTime - prevNetUsage.time) / 1000, 1);

    const rxRate = (rx - prevNetUsage.rx) / timeDiff;
    const txRate = (tx - prevNetUsage.tx) / timeDiff;

    prevNetUsage = { rx, tx, time: currentTime };

    return {
      bytesIn: rxRate,
      bytesOut: txRate,
      in: formatData(rxRate),
      out: formatData(txRate),
    };
  } catch (error) {
    console.error("Error calculating network usage:", error);
    return { in: "", out: "" } as NetStatData;
  }
};

export const networkSpeed: Subscribable<NetStatData> = Variable({
  bytesIn: 0,
  bytesOut: 0,
  in: "",
  out: "",
}).poll(2000, computeNetwork);
