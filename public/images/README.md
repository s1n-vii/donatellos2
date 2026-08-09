# Photography

Files here are loaded directly by the pages. No stock photography is ever substituted
for a missing shot: sections without a photo fall back to a typographic layout instead.

## In place

| File                        | Where it appears                                        |
| --------------------------- | ------------------------------------------------------- |
| `interior/interior-01.webp` | Homepage "Stay for a slice." section, Visit page banner |
| `interior/interior-02.webp` | Homepage hero                                            |

Each has a `-640.webp` companion for phones, referenced through `srcSet`.

Both originals are 1024px wide, which the hero stretches a little past on large
screens. Higher-resolution versions of the same two shots would sharpen it; nothing
else needs to change.

## Not shot yet

| Slot                                | Where it would appear               |
| ----------------------------------- | ----------------------------------- |
| `food/pizza.webp`                   | Food grid                           |
| `food/cheesesteak.webp`             | Food grid                           |
| `food/cheeseburger-sub.webp`        | Food grid                           |
| `food/wings.webp`                   | Food grid                           |
| `food/pizza-making.webp`            | "Our dough. Our bread. Our sauce."  |

The food grid currently renders as four typographic blocks. Setting `src` and `srcSet`
on a tile in `FOOD_TILES` (`src/pages/Home.jsx`) switches that category to a photo; once
any tile has one, the grid returns to its photo mosaic proportions. The "made here"
photo is controlled by `MADE_HERE_PHOTO` in the same file and is hidden while null.

## Adding a file

```bash
npm run images -- ~/photos/wings.jpg public/images/food/wings 640 1024
```

Writes `wings-640.webp` and `wings.webp`, and never upscales past the source width.
The script drives the Chromium that Playwright already installs, so there is no image
library in the dependency list.

## Notes

- The hero is the only image that loads eagerly; everything else is lazy-loaded.
- Cropping is handled in CSS with `object-fit: cover`. Each slot has separate desktop
  and mobile focal points, set via the `objectPosition` and `objectPositionMobile`
  props where the image is used, so a subject near an edge stays in frame on phones.
- Alt text lives next to each image in the page files. If the photo content changes
  meaningfully, update the alt text with it.
