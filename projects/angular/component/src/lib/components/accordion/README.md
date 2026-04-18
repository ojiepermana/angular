# Accordion

Expandable disclosure list supporting single-open and multi-open modes.

## Import

```ts
import {
  AccordionComponent,
  AccordionItemComponent,
  AccordionTriggerComponent,
  AccordionContentComponent,
} from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-accordion type="single" [collapsible]="true" [(value)]="openItem">
  <ui-accordion-item value="faq-1">
    <button ui-accordion-trigger>Can I customize the components?</button>
    <ui-accordion-content>Yes. Every token is overridable.</ui-accordion-content>
  </ui-accordion-item>

  <ui-accordion-item value="faq-2">
    <button ui-accordion-trigger>Does it work with SSR?</button>
    <ui-accordion-content>Yes, the library is SSR-friendly.</ui-accordion-content>
  </ui-accordion-item>
</ui-accordion>
```

For multiple open sections, pass `type="multiple"` and bind a `string[]`:

```html
<ui-accordion type="multiple" [(value)]="openItems">...</ui-accordion>
```

## API

### `AccordionComponent`

| Input           | Type                         | Default    |
| --------------- | ---------------------------- | ---------- |
| `type`          | `'single' \| 'multiple'`     | `'single'` |
| `collapsible`   | `boolean`                    | `true`     |
| `value` (model) | `string \| string[] \| null` | `null`     |
| `class`         | `string`                     | `''`       |

### `AccordionItemComponent`

| Input      | Type      | Default |
| ---------- | --------- | ------- |
| `value`    | `string`  | —       |
| `disabled` | `boolean` | `false` |
| `class`    | `string`  | `''`    |

## Accessibility

- Trigger has `aria-expanded`, `aria-controls` pointing at content id.
- Content has `role="region"` + `aria-labelledby` pointing at trigger id.
- `disabled` items are skipped and set `aria-disabled`.
