import { Variable, bind } from "astal";
import { App, Astal, Gtk } from "astal/gtk3";
import { bash } from "~/lib/utils";
import { options } from "~/options";
import Fallback from "~/src/components/fallback";
import Separator from "~/src/components/separator";
import Title from "~/src/components/title";
import { removeWall, setWall, wallpapers } from "./utils";

export const WINDOW_NAME = "wall-picker";
const { path: WALL_PATH } = options.wallpaper_picker;

const Image = (image: string) => {
  const onClickHandler = (button: number) => {
    const { PRIMARY, SECONDARY } = Astal.MouseButton;
    switch (button) {
      case PRIMARY:
        setWall(image);
        break;
      case SECONDARY:
        removeWall(image);
        break;
    }
  };

  const border = Variable("none");

  return (
    <eventbox
      onClick={(_, { button }) => {
        onClickHandler(button);
      }}
      onHover={() => border.set("10px solid white")}
      onHoverLost={() => border.set("none")}
    >
      <box
        className="image"
        widthRequest={380}
        css={bind(border).as((c) => {
          return `
            border: ${c};
            background: url("${image}");
            background-size: cover;
            background-repeat: no-repeat;
            background-position: center;
          `;
        })}
      />
    </eventbox>
  );
};

const Walls = () => {
  const { NEVER, AUTOMATIC } = Gtk.PolicyType;

  return (
    <scrollable
      vscroll={NEVER}
      hscroll={AUTOMATIC}
      heightRequest={200}
      setup={(self) => {
        // Horizontal mouse scroll logic
        self.connect("scroll-event", (_, event: any) => {
          function scrollAni(t: number) {
            return t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
          }

          const [ok, , delta_y] = event.get_scroll_deltas();

          if (ok && delta_y !== 0) {
            const adj = self.get_hadjustment();

            const totalDuration = 300;
            const startTime = Date.now();

            self.add_tick_callback(() => {
              const now = Date.now();
              const elapsedTime = now - startTime;
              const progress = Math.min(elapsedTime / totalDuration, 1);
              const easedValue = scrollAni(progress);
              const stepSize = easedValue * Math.abs(delta_y * 8);
              adj.value += delta_y > 0 ? stepSize : -stepSize;
              self.set_hadjustment(adj);
              if (progress >= 1) {
                return false;
              }
              return true;
            });
          }
        });
      }}
    >
      <box spacing={8}>
        {bind(wallpapers).as((walls) =>
          walls.length > 0 ? (
            walls.map(Image)
          ) : (
            <Fallback icon="org.gnome.Shotwell" label="No wallpapers found" />
          ),
        )}
      </box>
    </scrollable>
  );
};

const Footer = () => {
  const addWalls = () => {
    const summary = "WALLPAPERS";
    const body = "Wallpapers successfully added:)";

    bash(`./scripts/swww.sh ${WALL_PATH}`).then((out) => {
      if (out) {
        wallpapers.set([...out.split("\n"), ...wallpapers.get()]);
        bash(`bash -c 'notify-send ${summary} ${body}'`);
      }
    });
  };

  return (
    <box className="footer" spacing={6}>
      <Title title="WALLPAPERS" />
      <box halign={Gtk.Align.END} hexpand spacing={6}>
        <button
          className="close-btn"
          onClick={() => App.toggle_window(WINDOW_NAME)}
        >
          Close
        </button>
        <button onClick={addWalls} className="add-walls-btn">
          Add Walls
        </button>
      </box>
    </box>
  );
};

export default function WallPicker() {
  const { TOP, RIGHT, LEFT, BOTTOM } = Astal.WindowAnchor;
  return (
    <window
      visible={false}
      name={WINDOW_NAME}
      anchor={LEFT | RIGHT | TOP | BOTTOM}
      application={App}
    >
      <box
        valign={Gtk.Align.START}
        vertical
        css="padding: 8px; padding-top: 4px;"
        spacing={8}
      >
        <Walls />
        <Separator />
        <Footer />
      </box>
    </window>
  );
}
