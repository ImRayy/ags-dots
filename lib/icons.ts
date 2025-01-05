export const substitutes = {
  "transmission-gtk": "transmission",
  "blueberry.py": "blueberry",
  Caprine: "facebook-messenger",
  "com.raggesilver.BlackBox-symbolic": "terminal-symbolic",
  "org.wezfurlong.wezterm-symbolic": "terminal-symbolic",
  "audio-headset-bluetooth": "audio-headphones-symbolic",
  "audio-card-analog-usb": "audio-speakers-symbolic",
  "audio-card-analog-pci": "audio-card-symbolic",
  "preferences-system": "emblem-system-symbolic",
  "com.github.Aylur.ags-symbolic": "controls-symbolic",
  "com.github.Aylur.ags": "controls-symbolic",
} as const;

export default {
  ui: {
    colorpicker: "color-select-symbolic",
  },
  notification: {
    default: "notifications-symbolic",
    disabled: "notifications-disabled-symbolic",
  },
  trash: {
    full: "user-trash-full-symbolic",
    empty: "user-trash-symbolic",
  },
  mpris: {
    shuffle: {
      enabled: "media-playlist-shuffle-symbolic",
      disabled: "media-playlist-consecutive-symbolic",
    },
    loop: {
      none: "media-playlist-repeat-symbolic",
      track: "media-playlist-repeat-song-symbolic",
      playlist: "media-playlist-repeat-symbolic",
    },
    playing: "media-playback-pause-symbolic",
    paused: "media-playback-start-symbolic",
    stopped: "media-playback-start-symbolic",
    prev: "media-skip-backward-symbolic",
    next: "media-skip-forward-symbolic",
    playerIcons: {
      spotify: "com.spotify.Client",
      lollypop: "org.gnome.Lollypop",
      firefox: "io.gitlab.librewolf-community",
      chromium: "com.google.Chrome",
      brave: "com.brave.Browser",
      tauon: "com.github.taiko2k.tauonmb",
      default: "sh.cider.Cider-symbolic",
    },
  },
  color: {
    dark: "dark-mode-symbolic",
    light: "light-mode-symbolic",
  },
};
