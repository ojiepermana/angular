# Material Override Plan

## Strategi

Semua override Angular Material menggunakan pendekatan **M3 theming API** (Sass mixin `mat.theme`, `mat.theme-overrides`, dan `mat.<component>-overrides`). Pendekatan ini resmi didukung Angular Material v19+ dan menggunakan CSS custom properties (`--mat-sys-*` dan component tokens).

Setiap file CSS di folder ini bertanggung jawab atas satu komponen Material, menggunakan Tailwind CSS `@apply` sebagai metode utama styling. Vanilla CSS hanya dipakai jika `@apply` tidak memungkinkan (misal: CSS custom property overrides yang harus di-set via `mat.theme-overrides`).

## Arsitektur File

```
projects/material/styles/material/
├── PLAN.md              # Dokumen ini
├── _theme.scss          # Base theme: mat.theme() + mat.theme-overrides() + font loading
├── _tokens.scss         # Custom design tokens (CSS variables dari DESIGN.md)
├── autocomplete.css     # Override: mat-autocomplete
├── badge.css            # Override: mat-badge
├── bottom-sheet.css     # Override: mat-bottom-sheet
├── button.css           # Override: mat-button (all variants)
├── button-toggle.css    # Override: mat-button-toggle
├── card.css             # Override: mat-card
├── checkbox.css         # Override: mat-checkbox
├── chips.css            # Override: mat-chips
├── datepicker.css       # Override: mat-datepicker
├── dialog.css           # Override: mat-dialog
├── divider.css          # Override: mat-divider
├── expansion.css        # Override: mat-expansion-panel
├── form-field.css       # Override: mat-form-field
├── grid-list.css        # Override: mat-grid-list
├── icon.css             # Override: mat-icon
├── input.css            # Override: mat-input
├── list.css             # Override: mat-list
├── menu.css             # Override: mat-menu
├── paginator.css        # Override: mat-paginator
├── progress-bar.css     # Override: mat-progress-bar
├── progress-spinner.css # Override: mat-progress-spinner
├── radio.css            # Override: mat-radio
├── select.css           # Override: mat-select
├── sidenav.css          # Override: mat-sidenav
├── slide-toggle.css     # Override: mat-slide-toggle
├── slider.css           # Override: mat-slider
├── snack-bar.css        # Override: mat-snack-bar
├── sort.css             # Override: mat-sort
├── stepper.css          # Override: mat-stepper
├── table.css            # Override: mat-table
├── tabs.css             # Override: mat-tabs
├── timepicker.css       # Override: mat-timepicker
├── toolbar.css          # Override: mat-toolbar
├── tooltip.css          # Override: mat-tooltip
├── tree.css             # Override: mat-tree
└── index.css            # Barrel file: @import semua file di atas
```

## CDK Override (jika diperlukan)

CDK module yang memiliki visual:

- `cdk/overlay` — backdrop & overlay panel
- `cdk/a11y` — focus indicator
- `cdk/text-field` — autofill styling

File CDK override ada di:

```
projects/material/styles/material/
├── cdk-overlay.css
├── cdk-a11y.css
└── cdk-text-field.css
```

## Design Token Mapping

Mapping dari DESIGN.md ke M3 system tokens:

| Design Token       | M3 System Token                | Value (Light)      |
| ------------------ | ------------------------------ | ------------------ |
| Primary            | `--mat-sys-primary`            | `#533afd`          |
| On Primary         | `--mat-sys-on-primary`         | `#ffffff`          |
| Primary Container  | `--mat-sys-primary-container`  | Override via theme |
| Surface            | `--mat-sys-surface`            | `#ffffff`          |
| On Surface         | `--mat-sys-on-surface`         | `#061b31`          |
| On Surface Variant | `--mat-sys-on-surface-variant` | `#64748d`          |
| Outline            | `--mat-sys-outline`            | `#e5edf5`          |
| Outline Variant    | `--mat-sys-outline-variant`    | `#e5edf5`          |
| Error              | `--mat-sys-error`              | `#ea2261`          |
| Corner Extra Small | `--mat-sys-corner-extra-small` | `4px`              |
| Corner Small       | `--mat-sys-corner-small`       | `4px`              |
| Corner Medium      | `--mat-sys-corner-medium`      | `4px`              |
| Corner Large       | `--mat-sys-corner-large`       | `6px`              |
| Corner Extra Large | `--mat-sys-corner-extra-large` | `8px`              |

## Pendekatan Override Per-Komponen

### Aturan Utama

1. **Tailwind `@apply` first**: Setiap class selector yang meng-override Material HARUS menggunakan `@apply`. Contoh:
   ```css
   .mat-mdc-button {
     @apply rounded-[4px] font-medium text-base;
   }
   ```
2. **CSS custom property fallback**: Jika perlu set token value yang tidak bisa di-`@apply`, gunakan vanilla CSS:
   ```css
   .mat-mdc-card {
     --mat-card-elevated-container-shape: 4px;
   }
   ```
3. **Tidak boleh override DOM internal**: Tidak ada deep selector (`::ng-deep`, `/deep/`). Gunakan component token overrides saja.

### Prioritas Komponen

**Tier 1 — Core (implementasi pertama)**

- `button.css` — Semua varian: primary, outlined, ghost, FAB
- `card.css` — Elevated & outlined
- `form-field.css` — Container, label, hint, error
- `input.css` — Text field styling
- `toolbar.css` — App bar / navigation bar
- `icon.css` — Sizing & color
- `dialog.css` — Container & actions
- `snack-bar.css` — Notification styling

**Tier 2 — Navigation & Data**

- `tabs.css`
- `sidenav.css`
- `menu.css`
- `table.css`
- `paginator.css`
- `sort.css`
- `list.css`
- `select.css`

**Tier 3 — Forms & Input**

- `checkbox.css`
- `radio.css`
- `slide-toggle.css`
- `slider.css`
- `datepicker.css`
- `timepicker.css`
- `autocomplete.css`
- `chips.css`

**Tier 4 — Feedback & Misc**

- `badge.css`
- `tooltip.css`
- `progress-bar.css`
- `progress-spinner.css`
- `expansion.css`
- `stepper.css`
- `bottom-sheet.css`
- `divider.css`
- `grid-list.css`
- `tree.css`
- `button-toggle.css`

**CDK**

- `cdk-overlay.css`
- `cdk-a11y.css`
- `cdk-text-field.css`

## Styling Rules dari DESIGN.md

### Border Radius

- Default semua komponen: `4px` (tight, brutal minimal)
- Navigation containers: `6px`
- Featured cards / hero: `8px`
- **Tidak ada** pill shape atau radius > 8px

### Shadows (Blue-tinted)

- Level 1 (ambient): `rgba(23,23,23,0.06) 0px 3px 6px`
- Level 2 (standard): `rgba(23,23,23,0.08) 0px 15px 35px`
- Level 3 (elevated): `rgba(50,50,93,0.25) 0px 30px 45px -30px, rgba(0,0,0,0.1) 0px 18px 36px -18px`
- Level 4 (deep): `rgba(3,3,39,0.25) 0px 14px 21px -14px, rgba(0,0,0,0.1) 0px 8px 17px -8px`

### Typography

- Brand font: `sohne-var` dengan `"ss01"` stylistic set
- Fallback: `SF Pro Display`, system sans-serif
- Headline weight: `300` (light, confident)
- UI/Button weight: `400`
- Progressive negative letter-spacing pada display sizes

### Color

- Primary interactive: `#533afd`
- Heading text: `#061b31` (deep navy, bukan hitam)
- Body text: `#64748d`
- Label text: `#273951`
- Border default: `#e5edf5`
- Error/alert: `#ea2261`
- Success: `#15be53`

## Light & Dark Mode

Menggunakan `color-scheme: light dark` dengan `light-dark()` CSS function di `mat.theme()`.

- Light: surface `#ffffff`, on-surface `#061b31`
- Dark: surface `#0d253d`, on-surface `#ffffff`, brand sections `#1c1e54`

## Cara Konsumsi

Consumer app cukup import satu file:

```css
@import 'material/styles/material/index.css';
```

Atau jika menggunakan Sass theme:

```scss
@import 'material/styles/material/theme';
```
