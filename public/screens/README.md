# Product screenshots

Product imagery is registered in `src/config/screens.ts`. Each `ScreenDef` has an
optional `image` path under `public/screens/`. When `image` is omitted,
`<DeviceFrame />` renders the branded placeholder automatically.

## Replacing placeholders

1. Add the screenshot under the matching product folder.
2. Set the `image` field for the screen in `src/config/screens.ts`.
3. Keep the original frame components untouched.

## Target asset layout

```text
public/screens/
  buyer/{iphone,android-phone,ipad,android-tablet}/
  business/{iphone,android-phone,ipad,android-tablet}/
  rider/{iphone,android-phone,ipad,android-tablet}/
  fleet/{iphone,android-phone,ipad,android-tablet}/
  desktop/{imac,hp-monitor,macbook,windows-laptop}/
  web/
  whatsapp/{iphone,android-phone,ipad,android-tablet}/
```

Desktop screenshots already include their window chrome, so do not add another
window bar in the frame. Mobile screenshots are expected to be portrait
(1170 x 2532) and desktop screenshots landscape (3644 x 2192 or similar).
