import AstalNetwork from "gi://AstalNetwork";
import { bind } from "astal";
import { networkSpeed } from "./net-speed";

export default function Network() {
  const network = AstalNetwork.get_default();
  return (
    <box className="network-indicator" spacing={4}>
      <icon
        className="icon"
        icon={bind(network.wired || network.wifi, "iconName")}
      />
      {bind(networkSpeed).as((v) => (
        <label
          className="value"
          label={v.bytesIn > v.bytesOut ? v.in : v.out}
        />
      ))}
    </box>
  );
}
