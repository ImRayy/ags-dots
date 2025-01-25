import { exec } from "astal";

export const home = `/home/${exec("whoami")}`;

export const options = {
  terminal: "kitty",
  notification_timeout: 5000,
  quicksettings: {
    profile_picture: `${home}/.profile.png`,
    recording_path: `${home}/Video`,
    screenshot: {
      path: `${home}/Pictures/screenshots`,
    },
    random_wall: {
      path: `${home}/Pictures/wallpapers`,
    },
  },
  mpris: {
    fallback_img: "./lib/fallback.svg",
  },
  wallpaper_picker: {
    path: `${home}/.config/swww/compressed-walls`,
  },
};
