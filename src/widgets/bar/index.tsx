import { App, Astal, type Gdk, Gtk } from "astal/gtk3";
import Audio from "./modules/audio";
import Clock from "./modules/clock";
import {
  FlatpakUpdatesCount,
  NotificationButton,
  QSButton,
} from "./modules/misc";
import Mpris from "./modules/mpris";
import Network from "./modules/network";
import QuickAccessButton from "./modules/quick-access-buttons";
import { CPU, Mem } from "./modules/sys-monitor";
import SysTray from "./modules/systray";
import Workspaces from "./modules/workspaces";

const SPACING = 6;

const LeftModules = (
  <box spacing={SPACING} hexpand halign={Gtk.Align.START}>
    <QSButton />
    <Workspaces />
    <CPU />
    <Mem />
    <FlatpakUpdatesCount />
  </box>
);

const CenterModules = (
  <box spacing={SPACING}>
    <Clock />
    <SysTray />
  </box>
);

const RightModules = (
  <box spacing={SPACING} hexpand halign={Gtk.Align.END}>
    <Mpris />
    <Network />
    <QuickAccessButton />
    <Audio />
    <NotificationButton />
  </box>
);

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor;

  return (
    <window
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      anchor={TOP | LEFT | RIGHT}
      application={App}
    >
      <centerbox
        className="bar"
        start_widget={LeftModules}
        center_widget={CenterModules}
        end_widget={RightModules}
      />
    </window>
  );
}
