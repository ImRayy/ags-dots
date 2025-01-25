import type Mpris from "gi://AstalMpris";
import { type Binding, bind } from "astal";
import { Gtk } from "astal/gtk3";
import icons from "~/lib/icons";
import { isIcon } from "~/lib/utils";
import { options } from "~/options";

const { fallback_img } = options.mpris;

const AlbumArt = ({ image }: { image: string | Binding<string> }) => {
  return (
    <box
      css={`
        background-image: url('${image || fallback_img}');
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        min-height: 96px;
        min-width: 96px;
        margin-right: 8px;
      `}
    />
  );
};

const Title = ({ title }: { title: Binding<string> }) => (
  <label
    className="title"
    halign={Gtk.Align.START}
    max_width_chars={18}
    truncate
    wrap
  >
    {title}
  </label>
);

const Artists = ({ artists }: { artists: Binding<string> }) => (
  <label
    className="artists"
    halign={Gtk.Align.START}
    max_width_chars={24}
    truncate
    wrap
  >
    {artists}
  </label>
);

const PlaybackControls = ({ player }: { player: Mpris.Player }) => {
  const icon = 12.5;

  const currentPosition = (
    <label
      halign={Gtk.Align.START}
      visible={bind(player, "length").as((l) => l > 0)}
      label={bind(player, "position").as(lengthStr)}
    />
  );

  const buttons = (
    <box spacing={4} className="playback-controls">
      <button onClick={() => player.previous()}>
        <icon icon={icons.mpris.prev} css={`font-size: ${icon}px;`} />
      </button>
      <button onClick={() => player.play_pause()}>
        {bind(player, "playbackStatus").as((status) => (
          <icon
            icon={status === 0 ? icons.mpris.playing : icons.mpris.paused}
            css={`font-size: ${icon}px;`}
          />
        ))}
      </button>
      <button onClick={() => player.next()}>
        <icon icon={icons.mpris.next} css={`font-size: ${icon}px;`} />
      </button>
    </box>
  );

  const totalLength = (
    <label
      halign={Gtk.Align.END}
      visible={bind(player, "length").as((l) => l > 0)}
      label={bind(player, "length").as(lengthStr)}
    />
  );

  return (
    <centerbox
      css="padding-top: 4px;"
      hexpand
      startWidget={currentPosition}
      centerWidget={buttons}
      endWidget={totalLength}
    />
  );
};

const SeekBar = ({ player }: { player: Mpris.Player }) => {
  const position = bind(player, "position").as((p) =>
    player.length > 0 ? p / player.length : 0,
  );

  return (
    <slider
      visible={bind(player, "length").as((l) => l > 0)}
      className="player-progress"
      css="padding: 0px;"
      valign={Gtk.Align.END}
      vexpand
      onDragged={({ value }) => {
        player.position = value * player.length;
        return player.position;
      }}
      value={position}
    />
  );
};

function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

export default function Player({
  player,
  name,
}: { name: string; player: Mpris.Player }) {
  const title = bind(player, "title").as((title) => title || "");
  const playerIcon = bind(player, "entry").as((i) =>
    isIcon(i) ? i : icons.mpris.playerIcons.default,
  );
  const artists = bind(player, "albumArtist").as((artists) => artists || "");

  return (
    <box
      name={name}
      hexpand
      css="min-height: 92px; min-width: 18rem; padding: 8px;"
    >
      {bind(player, "cover_art").as((art) => (
        <AlbumArt image={art} />
      ))}
      <box vertical hexpand>
        <box vertical>
          <box>
            <Title title={title} />
            <icon
              hexpand
              css={bind(playerIcon).as((i) =>
                i === icons.mpris.playerIcons.default
                  ? "font-size: 14px;"
                  : "font-size: 18px;",
              )}
              halign={Gtk.Align.END}
              icon={playerIcon}
            />
          </box>
          <Artists artists={artists} />
        </box>
        <SeekBar player={player} />
        <PlaybackControls player={player} />
      </box>
    </box>
  );
}
