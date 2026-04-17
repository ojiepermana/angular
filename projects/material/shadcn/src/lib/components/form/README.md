# Form primitives

Composition of `<ui-form-field>`, label, description, message, and a
`uiFormControl` directive that auto-wires `id` / `aria-describedby` /
`aria-invalid` between them.

## Import

```ts
import {
  FormFieldComponent,
  FormLabelComponent,
  FormDescriptionComponent,
  FormMessageComponent,
  FormControlDirective,
} from '@ojiepermana/material/shadcn';
```

## Usage

```html
<form [formGroup]="form">
  <ui-form-field>
    <ui-form-label>Email</ui-form-label>
    <input ui-input uiFormControl [formControl]="form.controls.email" type="email" />
    <ui-form-description>We'll never share your email.</ui-form-description>
    <ui-form-message />
  </ui-form-field>
</form>
```

## What the directive does

The `[uiFormControl]` directive, when placed on a native form control inside
`<ui-form-field>`, sets the control's:

- `id` to a shared id from the field context (matching the label's `for`).
- `aria-describedby` to the description id plus the message id when invalid.
- `aria-invalid` to `"true"` once the control is invalid and touched/dirty.

## Parts

| Primitive                  | Selector                                      |
| -------------------------- | --------------------------------------------- |
| `FormFieldComponent`       | `ui-form-field`                               |
| `FormLabelComponent`       | `ui-form-label, label[ui-form-label]`         |
| `FormDescriptionComponent` | `ui-form-description, p[ui-form-description]` |
| `FormMessageComponent`     | `ui-form-message, p[ui-form-message]`         |
| `FormControlDirective`     | `[uiFormControl]`                             |

The message is hidden until the control becomes invalid and touched/dirty. By
default it surfaces the first validation error key; project custom text to
override.

## Accessibility

- `<ui-form-message>` emits `role="alert"` + `aria-live="polite"`.
- `aria-describedby` references both description and message when applicable.
- Label turns `text-destructive` automatically on invalid state.
