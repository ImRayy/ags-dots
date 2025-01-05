import { bash } from "lib/utils";

export type Flatpak = {
  id: string;
  name: string;
  version: string;
  arch: string;
};

const updateCmd = "flatpak remote-ls --updates";

const parseFlatpakUpdates = (out: string): Flatpak[] => {
  if (out === "") return [];
  return out.split("\n").map((item) => {
    const split = item.split("\t");
    const version = split[2]?.match(/(\d+(\.\d+){1,2})$/)?.[1];
    return {
      id: split[1],
      name: split[0],
      version: version || "-----",
      arch: split[3],
    };
  });
};

export const flatpakUpdates = Variable([] as Flatpak[], {
  poll: [1000 * 60 * 30, updateCmd, (out) => parseFlatpakUpdates(out)],
});

export const refetchFlatpakUpdates = () =>
  bash(updateCmd).then((out) => {
    flatpakUpdates.setValue(parseFlatpakUpdates(out));
  });
