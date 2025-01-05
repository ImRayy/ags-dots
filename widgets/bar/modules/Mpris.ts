import icons from "lib/icons";

const mpris = await Service.import("mpris");

function statusIcon(status: "Playing" | "Paused" | "Stopped") {
  if (status === "Playing") return " Playing";
  return " Paused";
}

interface PlayerProps {
  name: string;
  track_artists: string[];
  track_title: string;
  play_back_status: "Playing" | "Paused" | "Stopped";
}

const Player = ({
  track_artists,
  track_title,
  play_back_status,
  name,
}: PlayerProps) => {
  const icon = Widget.Box({
    spacing: 2,
    children: [
      Widget.Button({
        css: "padding-right: 2px;",
        class_name: "player-icon",
        on_primary_click: () => App.toggleWindow("mpris-player-window"),
        child: Widget.Icon({
          icon:
            icons.mpris.playerIcons[name] ?? icons.mpris.playerIcons.default,
          size: 18,
        }),
      }),

      Widget.Label({
        label: "",
        css: "font-size: 10; padding-right: 1px;",
      }),
    ],
  });

  const title = Widget.Label({
    class_name: "title",
    max_width_chars: 24,
    truncate: "end",
    wrap: true,
    label: track_title,
  });

  const artist = Widget.Label({
    class_name: "artist",
    max_width_chars: 24,
    truncate: "end",
    wrap: true,
    label: `${track_artists.join(", ")} -`,
    setup: (self) =>
      self.hook(
        mpris,
        () => track_artists.filter((i) => i !== "").length === 0 && self.hide(),
      ),
  });

  const status = Widget.Label({
    class_name: "status-icon",
    label: statusIcon(play_back_status),
  });

  return Widget.Box({
    spacing: 6,
    children: [icon, artist, title, status],
  });
};

export default () =>
  Widget.Box({
    class_name: "media",
    child: Widget.EventBox().hook(mpris, (self) => {
      const player =
        mpris.getPlayer("spotify") ||
        mpris.getPlayer("tauon") ||
        mpris.getPlayer() ||
        null;

      if (!player) return;

      // Player controls
      self.on_primary_click = player.playPause;
      self.on_scroll_down = player.next;
      self.on_scroll_up = player.previous;

      self.class_name = player.play_back_status.toLowerCase();

      const { name, track_artists, track_title, play_back_status } = player;

      if (play_back_status !== "Stopped") {
        self.child = Player({
          name: name,
          track_artists: track_artists,
          track_title: track_title,
          play_back_status: play_back_status,
        });
      } else {
        self.child = Widget.Label({
          label: "",
        });
      }
    }),
  });
