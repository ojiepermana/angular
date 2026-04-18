# Radio Group

Accessible radio group composed from `ui-radio-group` + `ui-radio`.

## Import

```ts
import { RadioGroupComponent, RadioComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-radio-group name="plan" [(ngModel)]="plan">
  <ui-radio value="free">Free</ui-radio>
  <ui-radio value="pro">Pro</ui-radio>
  <ui-radio value="enterprise" [disabled]="true">Enterprise (contact us)</ui-radio>
</ui-radio-group>

<!-- horizontal -->
<ui-radio-group orientation="horizontal" [(ngModel)]="size">
  <ui-radio value="s">S</ui-radio>
  <ui-radio value="m">M</ui-radio>
  <ui-radio value="l">L</ui-radio>
</ui-radio-group>
```

## API

### `RadioGroupComponent`

| Input         | Type                         | Default      |
| ------------- | ---------------------------- | ------------ |
| `name`        | `string`                     | `''`         |
| `orientation` | `'horizontal' \| 'vertical'` | `'vertical'` |
| `class`       | `string`                     | `''`         |

| Output        | Payload          |
| ------------- | ---------------- |
| `valueChange` | `string \| null` |

### `RadioComponent`

| Input      | Type      | Default |
| ---------- | --------- | ------- |
| `value`    | `string`  | —       |
| `disabled` | `boolean` | `false` |
| `class`    | `string`  | `''`    |

## Styling

Wraps `mat-radio-group` + `mat-radio-button`. Group uses CSS grid; orientation
flips `grid-flow-col auto-cols-max`.

## Accessibility

Roving tabindex + arrow-key navigation handled by Angular Material. Pair the
group with a `<label>` or `aria-label` to describe the choice.
