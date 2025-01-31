import WirePlumber from "gi://AstalWp";
import { Variable, timeout } from "astal";
import { Astal, Gtk } from "astal/gtk3";

let startupVisibility = false;

timeout(1600, () => {
  startupVisibility = true;
});

const Progress = ({ visible }: { visible: Variable<boolean> }) => {
  const speaker = WirePlumber.get_default()?.get_default_speaker();

  const volume = Variable(0);
  const volumeIcon = Variable("");

  let count = 0;
  const show = (v: number, icon: string) => {
    if (startupVisibility) visible.set(true);
    volume.set(v);
    volumeIcon.set(icon);
    count++;
    timeout(2000, () => {
      count--;
      if (count === 0) visible.set(false);
    });
  };

  return (
    <revealer
      revealChild={visible()}
      transitionDuration={1000}
      setup={(self) => {
        if (speaker) {
          self.hook(speaker, "notify::volume", () => {
            show(speaker.volume, speaker.volumeIcon);
          });
        }
      }}
    >
      <box className="osd-bar" vertical>
        <icon className="osd-icon" icon={volumeIcon()} />
        <levelbar
          halign={Gtk.Align.CENTER}
          inverted
          value={volume()}
          vertical
          vexpand
        />
      </box>
    </revealer>
  );
};

export default function OSD() {
  const visible = Variable(false);
  return (
    <window
      name="osd"
      layer={Astal.Layer.OVERLAY}
      anchor={Astal.WindowAnchor.RIGHT}
      setup={(self) => {
        self.clickThrough = true;
      }}
    >
      <box className="osd-bar-container">
        <Progress visible={visible} />
      </box>
    </window>
  );
}
