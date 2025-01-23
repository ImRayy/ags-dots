#!/usr/bin/env bash

if systemctl is-active --quiet "wayland-wm@Hyprland.service" --user; then
    uwsm stop
else
    hyprctl dispatch exit
fi
