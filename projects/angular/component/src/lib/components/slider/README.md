# Slider

Styled native `<input type="range">`. Uses the browser's accessibility and
keyboard model — everything just works.

## Import

```ts
import { SliderComponent } from '@ojiepermana/angular/component';
```

## Usage

```html
<ui-label for="vol">Volume</ui-label>
<input id="vol" type="range" ui-slider min="0" max="100" step="1" [(ngModel)]="volume" />
```

## API

| Input   | Type     | Default |
| ------- | -------- | ------- |
| `class` | `string` | `''`    |

All native `<input type="range">` attributes (`min`, `max`, `step`, `disabled`,
…) are passed through.

## Styling

The thumb/track are styled in `slider.component.css` using token variables.
Focus-visible outlines follow `--ring`.

## Accessibility

Use a paired `<ui-label>` or `aria-label`. Arrow keys adjust by `step` as
provided by the browser.
