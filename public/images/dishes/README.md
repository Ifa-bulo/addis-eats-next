# Dish photos

`public/dishes.json` ships with every `image` field left as `""` on purpose —
add your own photos here and wire them in yourself.

1. Save a photo in this folder, named after the dish id, e.g. `doro-wat.jpg`
   for the dish with `"id": "doro-wat"`.
2. In `public/dishes.json`, set that dish's `image` field to the path:
   `"image": "/images/dishes/doro-wat.jpg"`.
3. Refresh — `DishCard` already prefers the photo when `image` is non-empty,
   and falls back to the category icon when it's blank or fails to load, so
   you can add photos gradually without anything looking broken in between.
