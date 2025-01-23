import AstalTray from "gi://AstalTray";
import { bind } from "astal";

const TrayItem = ({ item }: { item: AstalTray.TrayItem }) => {
  return (
    <menubutton
      className="systray-icon"
      css="padding: 0px 4px;"
      tooltipMarkup={bind(item, "tooltipMarkup")}
      usePopover={false}
      actionGroup={bind(item, "actionGroup").as((ag) => ["dbusmenu", ag])}
      menuModel={bind(item, "menuModel")}
    >
      <icon gicon={item.gicon} />
    </menubutton>
  );
};

export default function SysTray() {
  const tray = AstalTray.get_default();

  return (
    <box
      className="systray"
      visible={bind(tray, "items").as((items) => items.length > 0)}
    >
      {bind(tray, "items").as((items) =>
        items.map((item) => <TrayItem item={item} />),
      )}
    </box>
  );
}
