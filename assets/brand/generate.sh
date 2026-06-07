#!/usr/bin/env bash
#
# Regenerate the Home Assistant brand PNGs from the SVG sources in this directory.
#
# Outputs to custom_components/ambience/brand/ following the HA brands spec:
#   icon.png / dark_icon.png        256x256  (+ @2x = 512x512)
#   logo.png / dark_logo.png        height 256  (+ @2x = height 512), landscape
#
# Non-prefixed files use the "light" colourway (optimised for a white background);
# dark_ files use the vibrant colourway (optimised for a dark background).
# All PNGs are transparent, trimmed, lossless-optimised and Adam7 interlaced.
#
# Requires: inkscape, oxipng. Fonts: "Avenir Next" must be installed to render the wordmark.
set -euo pipefail
cd "$(dirname "$0")"
OUT=../../custom_components/ambience/brand
mkdir -p "$OUT"

render_icon() { # svg out size
  inkscape "$1" --export-type=png --export-filename="$2" \
    --export-width="$3" --export-height="$3" --export-background-opacity=0 2>/dev/null
}
render_logo() { # svg out height  (width scales; landscape => height is the shortest side)
  inkscape "$1" --export-type=png --export-filename="$2" \
    --export-area-drawing --export-height="$3" --export-background-opacity=0 2>/dev/null
}

render_icon icon-light.svg "$OUT/icon.png"          256
render_icon icon-light.svg "$OUT/icon@2x.png"       512
render_icon icon-dark.svg  "$OUT/dark_icon.png"     256
render_icon icon-dark.svg  "$OUT/dark_icon@2x.png"  512

render_logo logo-light.svg "$OUT/logo.png"          256
render_logo logo-light.svg "$OUT/logo@2x.png"       512
render_logo logo-dark.svg  "$OUT/dark_logo.png"     256
render_logo logo-dark.svg  "$OUT/dark_logo@2x.png"  512

# Lossless optimise + Adam7 interlace + strip non-essential metadata.
# --force: keep interlacing even when it marginally increases size (the HA
# brands spec prefers interlaced; oxipng otherwise reverts it to save bytes).
oxipng -o max --interlace 1 --force --strip safe "$OUT"/*.png

# Publish the logo PNGs alongside the panel bundle (a static-served directory)
# so the frontend can load them via new URL("./logo.png", import.meta.url).
PANEL=../../custom_components/ambience/frontend
cp "$OUT/logo.png" "$OUT/logo@2x.png" "$OUT/dark_logo.png" "$OUT/dark_logo@2x.png" "$PANEL/"
cp "$OUT/icon.png" "$OUT/icon@2x.png" "$OUT/dark_icon.png" "$OUT/dark_icon@2x.png" "$PANEL/"

echo "Done. Generated:"
ls -1 "$OUT"
echo "Published to panel dir:"
ls -1 "$PANEL"/*.png
