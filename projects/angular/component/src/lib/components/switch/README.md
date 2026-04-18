# Switch

shadcn-styled wrapper over `mat-slide-toggle`. Binary on/off control.

## Import

```ts
import { SwitchComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-switch [(ngModel)]="airplaneMode">Airplane mode</ui-switch>

<ui-switch [formControl]="form.controls.notifications">Email notifications</ui-switch>
```

## API

| Input             | Type             | Default |
| ----------------- | ---------------- | ------- |
| `required`        | `boolean`        | `false` |
| `aria-label`      | `string \| null` | `null`  |
| `aria-labelledby` | `string \| null` | `null`  |
| `class`           | `string`         | `''`    |

| Output          | Payload   |
| --------------- | --------- |
| `checkedChange` | `boolean` |

## Styling

Wraps `mat-slide-toggle` with `hideIcon` + `disableRipple` for a shadcn-like
appearance. Theme via `switch.component.css` in the library.

## Accessibility

Exposed as a button with `role="switch"` and proper `aria-checked` by Angular
Material. Project label text in the content slot for an accessible name.
