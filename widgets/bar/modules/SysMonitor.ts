import { cpuUsage } from "module-vars/cpu";
import { memUsage } from "module-vars/mem";

const CpuUsage = () =>
  Widget.Box({
    class_name: "cpu-usage",
    children: [
      Widget.Label({
        class_name: "icon",
        label: " ",
      }),
      Widget.Label({
        class_name: "value",
        setup: (self) =>
          self.hook(cpuUsage, () => {
            self.label = `${Math.round(cpuUsage.value)}%`;
          }),
      }),
    ],
  });

const divide = (num1: number, num2: number) => (num1 / num2).toFixed(1);

const MemoryUsage = () =>
  Widget.Box({
    class_name: "memory-usage",
    children: [
      Widget.Label({
        class_name: "icon",
        label: " ",
      }),
      Widget.Label({
        class_name: "value",
        setup: (self) =>
          self.hook(memUsage, () => {
            const used = divide(memUsage.value.used, 1024 ** 2);
            const total = divide(memUsage.value.total, 1024 ** 2);
            self.label = `${used}GB/${total}GB`;
          }),
      }),
    ],
  });

export { CpuUsage, MemoryUsage };
