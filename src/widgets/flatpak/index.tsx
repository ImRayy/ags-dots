import { bind } from "astal";
import { App, Astal, Gtk } from "astal/gtk3";
import { bash } from "~/lib/utils";
import { options } from "~/options";
import Fallback from "~/src/components/fallback";
import {
  type Flatpak as FlatpakProps,
  flatpakUpdates,
  loading,
  refetchFlatpakUpdates,
} from "~/src/globals/flatpak";

export const WINDOW_NAME = "flatpak-updates";

const UpdateItem = (update: FlatpakProps) => {
  const name = (
    <label className="name" max_width_chars={22} truncate label={update.name} />
  );

  const icon = <icon icon={update.id} icon_size={20} />;

  const version = <label className="update-value" label={update.version} />;

  const updateIcon = <label className="update-icon" label="󰁡 " />;

  return (
    <button
      className="update-item"
      onClick={() => {
        App.toggle_window(WINDOW_NAME);
        bash(`${options.terminal} -e --hold flatpak update ${update.id}`).then(
          () => refetchFlatpakUpdates(),
        );
      }}
    >
      <box spacing={6}>
        {icon}
        {name}
        <box hexpand halign={Gtk.Align.END} spacing={8}>
          {version}
          {updateIcon}
        </box>
      </box>
    </button>
  );
};

const UpdateList = () => {
  return (
    <scrollable className="update-list">
      <box vexpand vertical>
        {bind(flatpakUpdates).as((updates) => updates.map(UpdateItem))}
      </box>
    </scrollable>
  );
};

const ActionButtons = () => {
  const cancel = () => App.toggle_window(WINDOW_NAME);
  const update = () => {
    App.toggle_window(WINDOW_NAME);
    loading.set(true);

    bash(`${options.terminal} -e --hold flatpak update`).then(() =>
      refetchFlatpakUpdates(),
    );
  };

  return (
    <box className="action-buttons" halign={Gtk.Align.END} spacing={8}>
      <button
        className="action-buttons cancel"
        label="Cancel"
        onClick={cancel}
      />
      <button
        className="action-buttons update"
        label="Update all"
        onClick={update}
      />
    </box>
  );
};

const Updates = () => {
  return (
    <box vertical css="min-width:24rem; min-height: 14rem;" spacing={8}>
      <UpdateList />
      <ActionButtons />
    </box>
  );
};

const Main = () => {
  return (
    <box css="min-width:24rem; min-height: 14rem; padding: 8px;">
      {bind(flatpakUpdates).as((updates) => {
        if (updates.length > 0) {
          return <Updates />;
        }
        return (
          <Fallback
            iconType="label"
            icon={bind(loading).as((l) => (l ? "🍞" : "🎊"))}
            label={bind(loading).as((l) =>
              l ? "Loading..." : "All apps are updates :)",
            )}
          />
        );
      })}
    </box>
  );
};

export default function Flatpak() {
  const { LEFT, TOP } = Astal.WindowAnchor;
  return (
    <window
      visible={false}
      name={WINDOW_NAME}
      margin={6}
      anchor={LEFT | TOP}
      application={App}
    >
      <Main />
    </window>
  );
}
