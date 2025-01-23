import GLib from "gi://GLib";
import { Variable } from "astal";

type MemInfo = {
  total: number;
  used: number;
};

const getMemInfo = (): MemInfo => {
  const [success, meminfoBytes] = GLib.file_get_contents("/proc/meminfo");

  if (!success) {
    console.error("Failed to read /proc/meminfo");
    return {
      total: 0,
      used: 0,
    };
  }

  const mem = new TextDecoder("utf-8").decode(meminfoBytes);
  const memRegex = /MemTotal:\s+(\d+)[\s\S]*?MemAvailable:\s+(\d+)/;
  const match = mem.match(memRegex);

  if (!match)
    throw new Error(
      "Failed to obtain memory usage details from /proce/meminfo",
    );

  const total = Number.parseInt(match[1], 10);
  const available = Number.parseInt(match[2], 10);

  return {
    total: total,
    used: total - available,
  };
};

export const memUsage = Variable({ total: 0, used: 0 }).poll(2000, getMemInfo);
