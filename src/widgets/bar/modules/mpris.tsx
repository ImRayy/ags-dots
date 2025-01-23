import AstalMpris from "gi://AstalMpris";
import { bind } from "astal";

const Player = ({ player }: { player: AstalMpris.Player }) => {
  const title = bind(player, "title").as((value) =>
    value.replace(/\[.*?\]|\(.*?\)|\{.*?\}/g, "").trim(),
  );
  const artist = bind(player, "artist").as((value) => value && ` - ${value}`);

  return (
    <box className="media-info">
      <label label="󰎇" css="padding-right: 4px;" />
      <label max_width_chars={16} truncate wrap label={title} />
      <label max_width_chars={20} truncate wrap label={artist} />
    </box>
  );
};

export default function Mpris() {
  const mpris = AstalMpris.get_default();

  return (
    <eventbox
      className="media"
      visible={bind(mpris, "players").as((p) => p.length > 0)}
    >
      {bind(mpris, "players").as((players) => {
        if (players.length === 0) {
          return null;
        }

        const player = players?.[0];
        return (
          <button
            onClick={() => player.play_pause()}
            className={bind(player, "playbackStatus").as((v) =>
              v === 0 ? "playing" : "paused",
            )}
          >
            <Player player={player} />
          </button>
        );
      })}
    </eventbox>
  );
}
