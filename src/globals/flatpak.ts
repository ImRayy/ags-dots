import Variable from "astal/variable";
import { bash } from "~/lib/utils";

export type Flatpak = {
  id: string;
  name: string;
  version: string;
  arch: string;
};

const updateAppStreamCmd = "flatpak update --appstream &>/dev/null";
const showUpdatesCmd = "flatpak remote-ls --updates --app";
export const loading = Variable(true);

const parseFlatpakUpdates = (out: string): Flatpak[] => {
  if (out === "") {
    loading.set(false);
    return [];
  }

  const splits = out.split("\n");

  return splits.map((item, index) => {
    const split = item.split("\t");

    if (index === splits.length - 1) {
      loading.set(false);
    }

    return {
      id: split[1],
      name: split[0],
      version: split[2] || "-----",
      arch: split[3],
    };
  });
};

export const flatpakUpdates = Variable([] as Flatpak[]).poll(
  1000 * 60 * 30,
  [
    "bash",
    "-c",
    `
      ${updateAppStreamCmd}
      ${showUpdatesCmd} 
      `,
  ],
  (out) => parseFlatpakUpdates(out),
);

export const refetchFlatpakUpdates = () =>
  bash(showUpdatesCmd).then((out) =>
    flatpakUpdates.set(parseFlatpakUpdates(out)),
  );
