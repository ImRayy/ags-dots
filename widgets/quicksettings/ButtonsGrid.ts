import { bash } from "lib/utils";
import { nightlight } from "./nightlight";
import { CustomButton } from "custom-widgets/CustomButton";
import icons from "lib/icons";
import { options } from "options";

const showScreenthotOpts = Variable(false);
const { screenshot, random_wall } = options.quicksettings;

const ScreenshotOptions = () =>
  Widget.Revealer({
    revealChild: showScreenthotOpts.bind(),
    child: Widget.Box({
      spacing: 10,
      children: [
        CustomButton({
          hexpand: true,
          on_primary_click: () => {
            bash(`hyprshot -m window --output-folder ${screenshot.path}`);
            showScreenthotOpts.value = false;
          },
          icon: "󱂬",
          iconType: "text",
          label: "Window",
        }),
        CustomButton({
          icon: "󰒉",
          iconType: "text",
          label: "Region",
          hexpand: true,
          on_primary_click: () => {
            bash(`hyprshot -m region --output-folder ${screenshot.path}`);
            showScreenthotOpts.value = false;
          },
        }),
      ],
    }),
  });

export default () =>
  Widget.Box({
    class_name: "buttons-grid",
    children: [
      Widget.Box({
        class_name: "container",
        vertical: true,
        setup: (self) => {
          const spacing = () => {
            if (showScreenthotOpts.value) {
              self.spacing = 10;
            } else self.spacing = 5;
          };
          self.hook(showScreenthotOpts, spacing);
        },
        children: [
          Widget.Box({
            spacing: 10,
            children: [
              CustomButton({
                icon: icons.color.dark,
                label: "Nightlight",
                hexpand: true,
                on_primary_click: () => nightlight.toggle(),
              }).hook(nightlight.service, (self) =>
                self.toggleClassName("active", nightlight.service.value),
              ),
              Widget.Button({
                hexpand: true,
              }).hook(showScreenthotOpts, (self) => {
                self.on_primary_click = () => {
                  showScreenthotOpts.value = !showScreenthotOpts.value;
                };

                if (showScreenthotOpts.value) {
                  self.label = "";
                  return;
                }
                self.child = Widget.Box({
                  spacing: 10,
                  children: [
                    Widget.Separator({ hexpand: true }),
                    Widget.Label({ label: "" }),
                    Widget.Label({ label: "Screenshot" }),
                    Widget.Separator({ hexpand: true }),
                  ],
                });
              }),
            ],
          }),
          ScreenshotOptions(),
          Widget.Box({
            spacing: 10,
            children: [
              CustomButton({
                hexpand: true,
                on_primary_click: () => bash("hyprpicker | wl-copy"),
                icon: icons.ui.colorpicker,
                label: "Pick Color",
              }),
              CustomButton({
                hexpand: true,
                icon: "",
                iconType: "text",
                label: "Random Wall",
                on_primary_click: () =>
                  Utils.exec(
                    `bash -c '$HOME/.config/ags/scripts/randwall.sh ${random_wall.path}'`,
                  ),
              }),
            ],
          }),
        ],
      }),
    ],
  });
