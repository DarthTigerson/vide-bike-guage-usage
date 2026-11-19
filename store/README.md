# Bike Gauge for vIDE

A dashboard look for the usage panel: your session as a speedometer, your week as a fuel gauge.

## What it looks like

- The session window is a speedometer with a needle, ticks and a red zone from 90%
- The week window is a fuel gauge, from E to F
- A hatched arc shows where your usage is heading at the current burn rate by the time the window resets
- A small triangle on the rim shows how much of the window's time has already passed
- A pace chip under each dial reads "Under pace", "Ahead of pace" or "Runs out in ...", with the reset time and burn rate below it
- A fuel-pump light sits between the dials and turns red and pulses once a limit is reached ("Out of usage")

## How to use it

Right-click the usage panel, choose View, then Bike Gauge. Choose Bars in the same menu to go back to the built-in look. Uninstalling the app also returns the panel to Bars.

## Needs

vIDE 0.3.7 or later. The app only draws the dials; the numbers come from vIDE's own usage tracking.
