# Alert

Call-out box for informational or destructive messages.

## Import

```ts
import { AlertComponent, AlertTitleComponent, AlertDescriptionComponent } from '@ojiepermana/material/shadcn';
```

## Usage

```html
<ui-alert>
  <svg><!-- icon --></svg>
  <ui-alert-title>Heads up!</ui-alert-title>
  <ui-alert-description> You can add components to your app using the CLI. </ui-alert-description>
</ui-alert>

<ui-alert variant="destructive">
  <ui-alert-title>Error</ui-alert-title>
  <ui-alert-description>Your session has expired.</ui-alert-description>
</ui-alert>
```

## API

| Input     | Type                         | Default     |
| --------- | ---------------------------- | ----------- |
| `variant` | `'default' \| 'destructive'` | `'default'` |
| `class`   | `string`                     | `''`        |

Re-export: `alertVariants` + `AlertVariant`.

## Styling

Tokens consumed: `--border`, `--background`, `--foreground`, `--destructive`.
Leading SVG children are auto-positioned via descendant selectors
(`[&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4`) so an icon slots in cleanly.

## Accessibility

The root has `role="alert"` so assistive technologies announce the message when
it appears. For polite (non-interrupting) messages, prefer a toast
(`ToastService`) instead.
