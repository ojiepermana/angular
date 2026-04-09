# Dokumentasi Penggunaan Lucide Icons (`@lucide/angular`)

Library ini menggunakan package resmi `@lucide/angular` yang didesain untuk Angular 17+ (standalone, signals, zoneless). File ini merupakan referensi utama tentang bagaimana icon disetup dan digunakan dalam project ini.

## Aturan Wajib di Library

- Semua icon di dalam package library wajib menggunakan `@lucide/angular`.
- Jangan gunakan `mat-icon`, Material Symbols, atau icon set lain di source library.
- Semua icon Lucide di dalam library wajib memakai `absoluteStrokeWidth`.

## Instalasi

```bash
npm install @lucide/angular
```

_(Catatan: Jangan gunakan `lucide-angular` karena itu adalah library legacy/usang)._

## Konfigurasi Global & Registrasi Icon

Berdasarkan kebutuhan UX project, icon secara otomatis menggunakan _default_ sebagai berikut:

- **Stroke Width**: `1.5`
- **Size**: `24`
- **Absolute Stroke Width**: wajib `true` untuk semua icon di source library

Selain itu, project ini menggunakan pendekatan **Dependency Injection (Dynamic Icons)** sehingga icon bisa dipanggil langsung menggunakan attribute string seperti `lucideIcon="arrow-big-left"`.

### 1. Setup di `app.config.ts`

Untuk me-register icon dan men-setup _default configuration_, atur melalui `provideLucideConfig` dan `provideLucideIcons` di tingkat global:

```typescript
// src/app/app.config.ts

import { ApplicationConfig } from '@angular/core';
// Import config dan icon yang ingin di-*register* secara string dari @lucide/angular
import {
  provideLucideIcons,
  provideLucideConfig,
  LucideArrowBigLeft,
  LucideAirVent,
} from '@lucide/angular';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... setting providers lainnya

    // 1. Set Default Settings Secara Global
    provideLucideConfig({
      strokeWidth: 1.5,
      size: 24,
    }),

    // 2. Daftarkan (Register) Icon agar bisa dipanggil namanya sebagai string
    provideLucideIcons(
      LucideArrowBigLeft,
      LucideAirVent,
      // WAJIB: Tambahkan icon Lucide lainnya di sini setiap kali ingin pakai icon baru di project
    ),
  ],
};
```

## Cara Penggunaan di Komponen

Setelah icon di-_register_ secara global di `app.config`, langkah yang perlu dilakukan di masing-masing komponen adalah:

### 1. Import `LucideIcon`

Panggil directivenya di property `imports` pada dekorator `@Component` yang membutuhkan icon.

```typescript
// Contoh di src/app/app.ts
import { Component } from '@angular/core';
import { LucideIcon } from '@lucide/angular';

@Component({
  selector: 'app-root',
  imports: [LucideIcon], // <-- WAJIB ditambahkan
  templateUrl: './app.html',
})
export class App {}
```

### 2. Menggunakan Icon pada HTML Template

Gunakan atribut `lucideIcon` disematkan ke dalam elemen `<svg>`. Gunakan nama icon (Kebab Case) dari icon yang telah di-_register_:

```html
<!-- Otomatis akan memakai Size = 24 dan Stroke Width = 1.5 sesuai config -->
<svg lucideIcon="arrow-big-left" absoluteStrokeWidth></svg>
<svg lucideIcon="air-vent" absoluteStrokeWidth></svg>

<!-- 
  Mengubah settingan secara lokal. 
  Anda tetap bisa menimpa default properties jika diperlukan pada beberapa page spesifik.
-->
<svg lucideIcon="air-vent" size="32" strokeWidth="2" color="red" absoluteStrokeWidth></svg>
```

## Referensi Tambahan Properties

Setiap elemen SVG icon dapat menerima atribut (props) di HTML:

| Atribut/Props         | Tipe      | Default _(Global Project)_      | Penjelasan                                                                                |
| :-------------------- | :-------- | :------------------------------ | :---------------------------------------------------------------------------------------- |
| `size`                | `number`  | `24`                            | Menentukan _width_ dan _height_ (dalam pixel).                                            |
| `color`               | `string`  | `currentColor`                  | Menentukan warna _stroke_ SVG. Jika _currentColor_, mengikuti text color elemen bapaknya. |
| `strokeWidth`         | `number`  | `1.5`                           | Menentukan ketebalan garis dari icon.                                                     |
| `absoluteStrokeWidth` | `boolean` | `true` _(wajib di library ini)_ | Jika `true`, setelan _strokeWidth_ tidak responsif terhadap perbesaran size SVG.          |

## Tips & Troubleshooting

1. **Kenapa icon yang saya ketik tidak muncul atau blank?**
   _A:_ Berarti icon tersebut belum diregister di `provideLucideIcons(...)` dalam file `app.config.ts`. Pastikan Anda sudah mengimport icon-nya terlebih dahulu dari `@lucide/angular` lalu mendaftarkannya supaya bisa dikenali lewat _string_.
2. **Error di Typescript "Module not found" atau Type error**
   _A:_ Pastikan package yang diimport selalu `@lucide/angular`, jangan tanpa awalan `@`.
3. **Boleh pakai `mat-icon` di package library?**
   _A:_ Tidak. Untuk source package library, semua icon wajib berasal dari `@lucide/angular` dan wajib memakai `absoluteStrokeWidth`.
