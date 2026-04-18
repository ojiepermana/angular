# Date Picker

Popup date picker using `MatDatepicker` wrapped in a shadcn-styled form field.

## Requires a date adapter

```ts
import { provideNativeDateAdapter } from '@angular/material/core';
export const appConfig = { providers: [provideNativeDateAdapter()] };
```

## Import

```ts
import { DatePickerComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-date-picker [(value)]="date" placeholder="Pick a date" [min]="minDate" [max]="maxDate" />
```

## API

| Input / Model | Type           | Default         |
| ------------- | -------------- | --------------- |
| `value`       | `Date \| null` | `null`          |
| `placeholder` | `string`       | `'Pick a date'` |
| `min`         | `Date \| null` | `null`          |
| `max`         | `Date \| null` | `null`          |
| `disabled`    | `boolean`      | `false`         |
| `class`       | `string`       | `''`            |

Implements `ControlValueAccessor`.

## Styling

Popup panel gets class `ui-datepicker-panel`. Form field uses the shadcn
outline appearance bridged through the `tokens` cascade layer.

## Accessibility

Inherits focus management, keyboard support, and ARIA from `MatDatepicker`.
