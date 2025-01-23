import { Variable, bind } from "astal";
import { App, Astal, Gtk } from "astal/gtk3";

interface Alert {
  title?: string | null;
  func?: (() => void) | null;
}

export const alertDialog = Variable({ title: null, func: null } as Alert);

const resetDataAndClose = () => {
  alertDialog.set({ func: null, title: null });
};

const ActionButtons = () => {
  return (
    <box homogeneous spacing={8} css="min-height: 34px;">
      <button className="no" onClick={resetDataAndClose}>
        No
      </button>
      <button
        className="yes"
        onClick={() => {
          alertDialog.get().func?.();
          resetDataAndClose();
        }}
      >
        Yes
      </button>
    </box>
  );
};

const Dialog = () => {
  const containerStyle = `
      border-radius: 16px; 
      min-width: 280px; 
      min-height: 80px; 
      padding: 10px;
  `;

  const { CENTER } = Gtk.Align;

  return (
    <box halign={CENTER}>
      <box
        className="container"
        halign={CENTER}
        valign={CENTER}
        vertical
        css={containerStyle}
      >
        <box vexpand vertical>
          {bind(alertDialog).as(
            ({ title }) =>
              title !== null && <label visible={!!title} label={title} />,
          )}
          <label>Are You Sure?</label>
        </box>
        <ActionButtons />
      </box>
    </box>
  );
};

export default function Alert() {
  const { TOP, RIGHT, BOTTOM, LEFT } = Astal.WindowAnchor;
  return (
    <window
      name="alert"
      visible={bind(alertDialog).as(({ func }) => func !== null)}
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.IGNORE}
      anchor={TOP | RIGHT | BOTTOM | LEFT}
      application={App}
    >
      <eventbox onClick={resetDataAndClose}>
        <Dialog />
      </eventbox>
    </window>
  );
}
