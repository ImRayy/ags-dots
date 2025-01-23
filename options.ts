import { exec } from "astal";

const home = `/home/${exec("whoami")}`;

export const options = {
  terminal: "kitty",
  notification_timeout: 5000,
  quicksettings: {
    profile_picture: `${home}/.profile.png`,
    screenshot: {
      path: `${home}/Pictures/screenshots`,
    },
    random_wall: {
      path: `${home}/Pictures/wallpapers`,
    },
  },
  mpris: {
    fallback_img: "/home/ray/.config/ags/lib/fallback.svg",
  },
  wallpaper_picker: {
    path: `${home}/.config/swww/compressed-walls`,
  },
};
