# Calendar

Inline calendar built on `MatCalendar`, themed with shadcn tokens.

## Requires a date adapter

The consumer app must provide a date adapter:

```ts
// app.config.ts
import { provideNativeDateAdapter } from '@angular/material/core';

export const appConfig = {
  providers: [provideNativeDateAdapter()],
};
```

## Import

```ts
import { CalendarComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-calendar [(value)]="date" [min]="minDate" [max]="maxDate" />
```

## API

| Input / Model | Type           | Default |
| ------------- | -------------- | ------- |
| `value`       | `Date \| null` | `null`  |
| `min`         | `Date \| null` | `null`  |
| `max`         | `Date \| null` | `null`  |
| `startAt`     | `Date \| null` | `null`  |
| `class`       | `string`       | `''`    |

Implements `ControlValueAccessor` — usable with `[(ngModel)]` and reactive forms.

## Styling

Wrapper uses `--border`, `--background`, and `--radius`. Inner Material
calendar is styled via the shadcn cascade layer.

## Accessibility

Inherits the full a11y contract from `MatCalendar` — keyboard navigation
(arrows, PgUp/PgDn, Home/End) and proper ARIA grid roles.
