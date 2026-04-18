# Avatar

Rounded image with an automatic text fallback when the image fails to load.

## Import

```ts
import { AvatarComponent, AvatarImageComponent, AvatarFallbackComponent } from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-avatar>
  <ui-avatar-image src="/me.jpg" alt="Ojie Permana" />
  <ui-avatar-fallback>OP</ui-avatar-fallback>
</ui-avatar>
```

If `src` fails to load, the `<img>` is removed and the fallback becomes visible.

## API

| Primitive                 | Input(s)                         |
| ------------------------- | -------------------------------- |
| `AvatarComponent`         | `class`                          |
| `AvatarImageComponent`    | `src` (required), `alt`, `class` |
| `AvatarFallbackComponent` | `class`                          |

## Styling

Tokens consumed: `--muted`, `--muted-foreground`. Default size is `h-10 w-10`.

## Accessibility

Always pass a meaningful `alt` to `<ui-avatar-image>`. If the avatar is purely
decorative (user's name already shown), use `alt=""`. The fallback text is
readable by screen readers.
