import { monitorFile } from "astal";
import { App } from "astal/gtk3";
import { exec } from "astal/process";
import { bash } from "./lib/utils";
import Alert from "./src/components/alert";
import Bar from "./src/widgets/bar";
import Flatpak from "./src/widgets/flatpak";
import {
  NotificationCenter,
  NotificationPopups,
} from "./src/widgets/notifications";
import OSD from "./src/widgets/osd";
import QuickSettings from "./src/widgets/quick-settings";
import WallPicker from "./src/widgets/wall-picker";

const scss = "./src/style/style.scss";
const css = "/tmp/ags/style.css";

function reloadCSS() {
  App.reset_css();
  exec(`sass ${scss} ${css}`);
  App.apply_css(css);
}

// Initially apples css
reloadCSS();

// NOTE: This used to work, I dunno why not anymore
// Monitor scss changes and reapply css
// monitorFile("./src/style", () => {
//   reloadCSS();
// });

bash("find ./src/style -name '*.scss'").then((out) => {
  for (const path of out.split("\n")) {
    monitorFile(path, () => reloadCSS());
  }
});

App.start({
  css: css,
  main() {
    App.get_monitors().map(Bar);
    Alert();
    Flatpak();
    NotificationCenter();
    NotificationPopups();
    OSD();
    QuickSettings();
    WallPicker();
  },
});
