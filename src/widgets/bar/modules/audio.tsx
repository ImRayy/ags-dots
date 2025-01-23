import WirePlumber from "gi://AstalWp";
import { bind } from "astal";
import { EventBox } from "astal/gtk3/widget";

export default function Audio() {
  const speaker = WirePlumber.get_default()?.audio.default_speaker!;

  return (
    <EventBox onClick={() => speaker.set_mute(!speaker.mute)} className="audio">
      <box className="volume-indicator">
        <icon
          className="icon"
          css="padding-right: 6px;"
          icon={bind(speaker, "volumeIcon").as((v) => v)}
        />
        <label className="value">
          {bind(speaker, "volume").as((v) => Math.floor(v * 100))}
        </label>
      </box>
    </EventBox>
  );
}
