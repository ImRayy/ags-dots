|![image1](https://ik.imagekit.io/rayshold/dotfiles/ags/2024-11-04-133359_hyprshot.png?updatedAt=1730733654701)|
|---|

|![image2](https://ik.imagekit.io/rayshold/dotfiles/ags/2024-11-04-134310_hyprshot.png?updatedAt=1730733654687)|![image3](https://ik.imagekit.io/rayshold/dotfiles/ags/2024-11-04-133932_hyprshot.png?updatedAt=1730733654956)|
|---|---|

## Requirements

- `bun` - for building & compiling stuff
- `sassc` - to compile "scss" files to "css"
- `pipewire` - volume Control
- `libtop` - resource usage
- `networkmanager`
- `hyprshade`, `hyprpicker` - nightlight & colorpicker
- `swww` - wallpaper-picker & other related stuff
- `imagemagick` - for compressing images
- `flatpak` - flatpak update widget

**Fonts**

- `CommitMono Nerd Font`

**Optional**

- `inotify-tools` - for hot-reload script

## Installation

1. [Install AGS](https://aylur.github.io/ags-docs/config/installation/)
2. Clone this repo `git clone https://github.com/ImRayy/ags-dots ~/.config/ags`
3. On terminal `ags`, yes, it's that simple

## Notes

**Flatpak update widget & module :**  If you don’t use Flatpak, simply remove `Flatpak()` from `widgets/main.ts` and `FlatpakUpdatesCount()` from `widgets/bar/Bar.ts`. Otherwise, AGS might not run at all—though I’m not entirely sure.

**Wallpaper Picker :** It’s important to add wallpapers only using the wallpaper-picker widget. Why? Because if you add wallpapers manually, the file sizes are larger, which causes AGS to boot up slowly. Compressing the wallpapers fixes this issue, but setting them directly reduces quality. So, I created a method where you add wallpapers using the `Add Walls` button on the wallpaper-picker widget, which automatically compresses them and saves the actual file location in a file called `log.txt`. I hope that covers everything! Also, it’s recommended to `right-click` on any wallpaper to remove it from the list.
