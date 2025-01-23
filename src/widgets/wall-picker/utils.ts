import GLib from "gi://GLib";
import { Variable, exec } from "astal";
import { App } from "astal/gtk3";
import { bash } from "~/lib/utils";
import { options } from "~/options";
import { WINDOW_NAME } from ".";

const { path: WALL_PATH } = options.wallpaper_picker;

export const wallpapers = Variable(
  exec(
    `find -L ${WALL_PATH}  -iname "*.png" -or -iname "*.jpg" -or -iname "*.webp"`,
  )
    .split("\n")
    .filter((i) => i !== ""),
);

// Functions/Methods
export const getWallList = (): string[] => {
  const [success, logfile] = GLib.file_get_contents(`${WALL_PATH}/log.txt`);
  if (!success) {
    console.error("Failed to read file");
  }

  const log = new TextDecoder("utf-8").decode(logfile);
  return log.split("\n");
};

export const setWall = (path: string) => {
  const fileName = path.split("/").splice(-1)[0];
  const wallpaper = getWallList()
    .find((n) => n.startsWith(fileName))
    ?.split(":")[1];

  bash(
    `swww img ${wallpaper} \
    --transition-fps 60 \
    --transition-duration 2 \
    --transition-type grow \
    --transition-bezier 0.25,1,0.5,1`,
  ).then(() => App.toggle_window(WINDOW_NAME));
};

export const removeWall = (path: string) => {
  const fileName = path.split("/").splice(-1)[0];

  const filteredList = getWallList().filter(
    (path) => path && !path.startsWith(fileName),
  );

  const text = new TextEncoder().encode(`${filteredList.join("\n")}\n`);
  const success = GLib.file_set_contents(`${WALL_PATH}/log.txt`, text);

  if (!success) {
    console.error("Failed to write to file");
    return;
  }

  bash(`rm ${WALL_PATH}/${fileName}`)
    .then(() => {
      wallpapers.set(wallpapers.get().filter((p: string) => p !== path));
    })
    .then(() => bash("notify-send 'Successfully removed selected wall'"));
};
