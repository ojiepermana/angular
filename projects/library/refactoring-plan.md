# Theme Library Refactoring Plan

## Ringkasan

Refactor library theme ini akan dilakukan sebagai hard reset kontrak styling dan theming.

Keputusan utama:

- library masih dalam tahap development, jadi kompatibilitas dengan style atau kontrak saat ini tidak perlu dipertahankan
- tidak akan dibuat migration bridge untuk styling lama
- Angular-specific CSS variables harus dihilangkan dari source of truth library
- model theming baru mengikuti semantic token system ala shadcn
- styling harus Tailwind-first: gunakan utility class Tailwind di template kapan pun memungkinkan
- direct CSS hanya dipakai untuk token layer, selector layout, utility lintas komponen, dan adapter framework seperti Angular Material
- Angular tetap dipakai untuk state orchestration dan behavior, tetapi bukan lagi sumber nama token visual

## Hasil Akhir Yang Ingin Dicapai

Setelah refactor selesai, library harus memiliki karakter berikut:

- semantic theme tokens menjadi kontrak styling utama
- dark mode mengikuti pola `.dark` seperti shadcn
- Tailwind membaca token melalui `@theme inline`
- semua styling library memakai token semantik, bukan `--mat-sys-*`, `--mat-*`, atau `--mdc-*`
- Angular Material hanya boleh diperlakukan sebagai behavior layer, bukan visual source of truth
- struktur secondary entry point tetap dipertahankan karena sudah baik untuk pengembangan jangka panjang
- penambahan color preset, appearance preset, atau layout preset baru dapat dilakukan tanpa refactor besar

## Keputusan Arsitektur

### 0. Tailwind-First Styling Rule

Rule utama untuk authoring style ke depan:

- layout, spacing, sizing, typography, dan interaction state di template harus memakai utility class Tailwind lebih dulu
- direct CSS hanya boleh dipakai bila Tailwind tidak cukup jelas atau tidak cukup kuat untuk kasus tersebut
- direct CSS wajib terkonsentrasi pada token layer, variant preset, layout selectors, reusable utility class, atau adapter internal
- tidak boleh membuat styling component-level baru di CSS bila hasil yang sama bisa dicapai dengan utility class Tailwind yang jelas dan maintainable

### 1. Source Of Truth Baru

Source of truth styling library dipindahkan ke semantic CSS variables ala shadcn.

Yang menjadi kontrak utama:

- `background`
- `foreground`
- `card`
- `card-foreground`
- `popover`
- `popover-foreground`
- `primary`
- `primary-foreground`
- `secondary`
- `secondary-foreground`
- `muted`
- `muted-foreground`
- `accent`
- `accent-foreground`
- `destructive`
- `border`
- `input`
- `ring`
- `sidebar`
- `sidebar-foreground`
- `sidebar-primary`
- `sidebar-primary-foreground`
- `sidebar-accent`
- `sidebar-accent-foreground`
- `sidebar-border`
- `sidebar-ring`
- `radius`

Untuk kebutuhan library ini, token semantik boleh diperluas jika benar-benar diperlukan, tetapi wajib mengikuti aturan berikut:

- nama token harus berbasis intent
- nama token tidak boleh mengandung istilah Angular, Material, MDC, atau nama implementation detail lain
- token baru harus reusable dan bukan one-off fix

### 2. Runtime Root Contract Baru

Kontrak runtime yang disarankan:

- `.dark` untuk resolved dark mode
- `[data-theme-scheme]` untuk preference source: `system`, `light`, `dark`
- `[data-theme-color]` untuk preset warna
- `[data-theme-appearance]` untuk preset visual appearance
- `[data-layout-mode]` untuk layout navigation mode
- `[data-layout-container]` untuk layout container mode

Catatan penting:

- styling light dan dark harus mengikuti `.dark`, bukan atribut Angular-specific lama
- state lain boleh memakai `data-*` karena lebih jelas, netral, dan mudah di-scale
- atribut runtime lama seperti `theme-schemes`, `theme-colors`, `theme-appearances`, `layout-mode`, dan `layout-container` tidak perlu dipertahankan

### 3. Angular Bukan Kontrak Styling

Angular tetap dipakai untuk:

- provider configuration
- state management
- persistence
- orchestration antar controls dan host
- component behavior

Angular tidak lagi dipakai untuk:

- penamaan token visual
- public styling contract
- source of truth surface, border, shadow, focus, atau color naming

### 4. Angular Material Bukan Visual Source Of Truth

Angular Material harus diposisikan hanya sebagai behavior layer.

Rule tegas:

- styling library tidak boleh lahir dari `--mat-sys-*`
- styling library tidak boleh bergantung pada `--mat-*` atau `--mdc-*` sebagai kontrak utama
- bila Angular Material masih dipakai, adapter styling harus mengonsumsi semantic tokens milik library, bukan sebaliknya

## Scope Refactor

Refactor ini mencakup:

- kontrak token CSS
- struktur folder stylesheet
- service state contract
- directive host contract
- switcher components
- layout shell styling
- override strategy
- dokumentasi internal library
- consumer-facing tests

Refactor ini tidak bertujuan untuk mempertahankan style lama.

## Prinsip Refactor

1. Hapus kontrak lama, jangan tambahkan lapisan transisi.
2. Putuskan kontrak akhir lebih dulu, baru implementasi.
3. Gunakan utility class Tailwind sebagai default authoring path di template.
4. Jangan membawa istilah Angular ke dalam token model baru.
5. Gunakan semantic tokens sebagai API styling.
6. Jangan menambah fitur appearance baru sebelum kontrak dasarnya stabil.
7. Hindari raw visual values di luar token layer.
8. Dokumentasi hanya menjelaskan nilai yang benar-benar sudah diimplementasikan.

## Kontrak Token Final Yang Diusulkan

### Theme Tokens

Token inti yang wajib ada di `:root` dan `.dark`:

- `--background`
- `--foreground`
- `--card`
- `--card-foreground`
- `--popover`
- `--popover-foreground`
- `--primary`
- `--primary-foreground`
- `--secondary`
- `--secondary-foreground`
- `--muted`
- `--muted-foreground`
- `--accent`
- `--accent-foreground`
- `--destructive`
- `--border`
- `--input`
- `--ring`
- `--sidebar`
- `--sidebar-foreground`
- `--sidebar-primary`
- `--sidebar-primary-foreground`
- `--sidebar-accent`
- `--sidebar-accent-foreground`
- `--sidebar-border`
- `--sidebar-ring`
- `--radius`

### Tailwind Exposure

Token di atas harus diekspos melalui `@theme inline`, misalnya:

- `--color-background`
- `--color-foreground`
- `--color-card`
- `--color-card-foreground`
- `--color-primary`
- `--color-primary-foreground`
- `--color-border`
- `--color-input`
- `--color-ring`

Radius scale mengikuti pola shadcn:

- `--radius-sm`
- `--radius-md`
- `--radius-lg`
- `--radius-xl`
- `--radius-2xl`
- `--radius-3xl`
- `--radius-4xl`

### Extension Tokens Untuk Library

Jika dibutuhkan untuk shell, appearance, dan layout, gunakan extension token yang tetap semantik, misalnya:

- `--shell-surface`
- `--shell-foreground`
- `--shell-border`
- `--shell-shadow`
- `--shell-backdrop`
- `--surface-elevated`
- `--surface-elevated-foreground`

Catatan:

- extension token hanya dibuat bila token shadcn inti tidak cukup
- extension token tetap harus netral terhadap framework

## Struktur Folder Yang Diusulkan

Struktur stylesheet baru:

- `projects/library/theme/styles/tokens/`
- `projects/library/theme/styles/presets/colors/`
- `projects/library/theme/styles/presets/appearances/`
- `projects/library/theme/styles/modes/`
- `projects/library/theme/styles/layout/`
- `projects/library/theme/styles/adapters/material-ui/`
- `projects/library/theme/styles/utilities/`
- `projects/library/theme/styles/index.css`

Tanggung jawabnya:

- `tokens/` untuk foundation dan semantic tokens
- `presets/colors/` untuk preset warna
- `presets/appearances/` untuk flat, glass, dan preset visual berikutnya
- `modes/` untuk light dan dark behavior
- `layout/` untuk layout state dan shell rules
- `adapters/material-ui/` untuk Angular Material adapter internal
- `utilities/` untuk utility exposure yang resmi menjadi contract library

## 12 Governance Points

### 1. One Feature = One Contract Update

Setiap penambahan atau perubahan feature theme wajib mengubah seluruh layer kontrak yang relevan:

- types
- config
- service
- styles
- controls
- layout behavior
- docs
- tests

Tidak boleh ada perubahan theme axis yang hanya selesai di satu tempat.

### 2. Public API Lifecycle

Semua export publik harus dianggap sebagai kontrak.

Walaupun library masih development, API tetap harus dibedakan jelas:

- `stable`
- `experimental`
- `internal`

Tujuannya agar evolusi API lebih terukur sejak awal.

### 3. No Raw Visual Values Outside Token Layers

Warna, blur, shadow, border tone, opacity, dan radius tidak boleh disebar di component styles, layout styles, atau override files.

Semua nilai visual harus berasal dari token layer.

### 4. Explicit Token Layers

Token harus dipisah eksplisit menjadi:

- foundation tokens
- semantic tokens
- preset tokens
- adapter tokens jika memang diperlukan

Tidak boleh lagi mencampur semuanya di satu file besar.

### 5. Appearance Is A Full Contract

Setiap appearance baru harus mendefinisikan kontrak lengkap, minimal:

- surface
- border
- shadow
- backdrop
- focus behavior
- elevated states
- layout shell impact
- component impact

Appearance tidak boleh hanya menjadi enum atau toggle dekoratif.

### 6. Browser Environment Must Be Reactive

Mode `system` harus benar-benar reaktif terhadap perubahan OS.

Service theme tidak boleh membaca environment browser hanya sekali lalu berhenti.

### 7. Persisted State Must Be Versioned

Storage contract wajib memiliki:

- key strategy yang jelas
- schema version
- fallback untuk stale values

Walaupun kompatibilitas lama diabaikan, persistence untuk kontrak baru tetap harus dirancang benar sejak awal.

### 8. Override Files Are Contracts, Not Patches

Override file bukan tempat quick fix.

Setiap override harus jelas:

- token yang dikonsumsi
- state yang dicakup
- alasan keberadaannya
- area komponen yang ditarget

### 9. Every Public Export Needs Consumer-facing Tests

Semua export publik minimal harus memiliki coverage terhadap penggunaan nyata oleh consumer.

Minimal area test:

- service
- directive
- layout shells
- controls
- entrypoint smoke tests
- accessibility behavior dasar

### 10. Docs Only Document Implemented Values

Dokumentasi tidak boleh menyebut future idea sebagai contract aktif.

Kalau token, preset, atau appearance belum benar-benar diimplementasikan, jangan ditulis sebagai bagian dari API library.

### 11. Internal Selectors Are Private

Yang boleh dianggap kontrak publik hanyalah:

- documented entry points
- documented selectors
- documented `data-*` attributes
- documented root classes
- documented token names
- documented stylesheet import paths

Selector internal lain dianggap private dan bebas berubah.

### 12. Dependency Upgrade Policy

Library harus punya aturan upgrade untuk:

- Angular
- Angular Material
- Tailwind
- Lucide

Tetapi rule ini hanya berlaku setelah kontrak baru stabil.

## Fase Refactor

### Phase 1. Finalize Semantic Token Contract

Ini fase paling penting dan harus selesai lebih dulu.

Deliverables:

- daftar final token semantik inti
- daftar extension token yang diizinkan
- keputusan `.dark` dan `data-*`
- keputusan radius scale
- keputusan utility exposure lewat `@theme inline`

Exit criteria:

- nama token final sudah disepakati
- tidak ada lagi nama token berbasis Angular di kontrak baru

### Phase 2. Replace Style Architecture

Tujuan:

- hapus struktur style lama
- bangun ulang folder style sesuai arsitektur baru
- pindahkan semua raw values ke token layers

Deliverables:

- folder styles baru
- token files baru
- preset warna baru
- preset appearance baru
- layout styles baru

Exit criteria:

- file style lama yang bergantung pada Angular naming sudah tidak lagi menjadi referensi

### Phase 3. Replace Runtime Theme Contract

Tujuan:

- ganti atribut runtime lama ke kontrak baru
- implementasikan `.dark` dan `data-*`
- pastikan system mode reaktif

Deliverables:

- service contract baru
- host application strategy baru
- persistence contract baru

Exit criteria:

- root state contract baru aktif penuh
- runtime styling tidak lagi tergantung pada atribut lama

### Phase 4. Rebuild Components And Layouts

Tujuan:

- sesuaikan switcher dan layout shell dengan token dan runtime contract baru
- hapus ketergantungan styling terhadap Angular variables

Deliverables:

- controls baru atau yang diperbarui
- layout shell baru atau yang diperbarui
- utility classes baru bila memang menjadi public contract

Exit criteria:

- seluruh komponen tema bekerja di atas semantic contract baru

### Phase 5. Rebuild Material Integration

Tujuan:

- jadikan Material adapter internal yang mengonsumsi semantic tokens
- hilangkan authored dependency ke Angular CSS variable naming

Deliverables:

- adapter `material-ui` baru
- override strategy baru
- dokumentasi internal adapter

Exit criteria:

- tidak ada lagi `--mat-sys-*`, `--mat-*`, atau `--mdc-*` sebagai kontrak styling utama library

### Phase 6. Test And Documentation

Tujuan:

- lindungi kontrak baru dengan test dan dokumentasi yang lebih tegas

Deliverables:

- test service
- test directive
- test controls
- test layout
- smoke test entrypoints
- README dan theme docs baru

Exit criteria:

- docs selaras dengan implementasi
- kontrak publik baru sudah terlindungi oleh test

## Backlog Implementasi Per Phase

Bagian ini adalah turunan eksekusi langsung dari fase di atas. Karena kompatibilitas lama diabaikan, backlog ini memakai pendekatan rewrite, bukan adaptasi.

### Phase 1 Backlog: Finalize Semantic Token Contract

Tujuan batch ini adalah menghasilkan kontrak token final sebelum file kode disentuh secara luas.

File target:

- `projects/library/refactoring-plan.md`
- `projects/library/theme/README.md`
- `projects/library/theme/shadn-ui-theming.md`

Pekerjaan:

- finalkan daftar token semantik inti yang wajib ada di `:root` dan `.dark`
- finalkan extension tokens minimum untuk shell, appearance, dan layout
- finalkan kontrak runtime `.dark` dan `data-*`
- finalkan daftar utility yang akan diekspos lewat `@theme inline`
- finalkan naming policy untuk preset warna, preset appearance, dan layout state

Definition of done:

- tidak ada lagi nama token berbasis Angular di plan dan docs target
- token contract cukup lengkap untuk mulai implementasi stylesheet baru

### Phase 2 Backlog: Replace Style Architecture

Tujuan batch ini adalah mengganti total struktur style lama dengan struktur modular baru.

File lama yang sudah dihapus:

- legacy stylesheet files dari arsitektur pra-semantic-token

File atau folder baru yang harus dibuat:

- `projects/library/theme/styles/tokens/`
- `projects/library/theme/styles/presets/colors/`
- `projects/library/theme/styles/presets/appearances/`
- `projects/library/theme/styles/modes/`
- `projects/library/theme/styles/layout/`
- `projects/library/theme/styles/utilities/`
- `projects/library/theme/styles/index.css`

Pekerjaan:

- buat foundation token layer
- buat semantic token layer
- buat radius scale layer ala shadcn
- buat preset warna berdasarkan semantic mapping, bukan Angular token mapping
- buat preset appearance berdasarkan semantic mapping, bukan Angular token mapping
- pindahkan seluruh raw visual values ke token dan preset layer
- rewrite `styles/index.css` agar hanya mengimpor arsitektur baru

Definition of done:

- seluruh authored style utama sudah berasal dari struktur folder baru
- file style lama tidak lagi menjadi referensi aktif

### Phase 3 Backlog: Replace Runtime Theme Contract

Tujuan batch ini adalah menyelaraskan runtime state Angular ke kontrak root baru.

File target:

- `projects/library/theme/service/src/theme.types.ts`
- `projects/library/theme/service/src/theme.provider.ts`
- `projects/library/theme/service/src/theme.token.ts`
- `projects/library/theme/service/src/theme.service.ts`
- `projects/library/theme/directive/src/theme-host.directive.ts`

Pekerjaan:

- tetapkan ulang enum dan config type bila perlu agar sesuai kontrak baru
- rewrite `ThemeService` agar mengelola `.dark` dan `data-*`
- buat penyelesaian mode `system` yang reaktif terhadap perubahan OS
- tambahkan storage versioning untuk state theme baru
- rewrite `ThemeHostDirective` agar menerapkan class dan attribute baru, bukan kontrak lama

Definition of done:

- service dan directive tidak lagi menempelkan atribut runtime lama
- runtime root state sepenuhnya memakai `.dark` dan `data-*`

### Phase 4 Backlog: Rebuild Components And Layouts

Tujuan batch ini adalah membuat komponen dan layout bekerja di atas kontrak styling baru.

File target komponen:

- `projects/library/theme/component/src/appearance-switcher.ts`
- `projects/library/theme/component/src/color-picker.ts`
- `projects/library/theme/component/src/layout-container-switcher.ts`
- `projects/library/theme/component/src/layout-mode-switcher.ts`
- `projects/library/theme/component/src/scheme-switcher.ts`
- `projects/library/theme/component/src/theme-icon.directive.ts`

File target layout:

- `projects/library/theme/layout/src/elements.directive.ts`
- `projects/library/theme/layout/src/horizontal.ts`
- `projects/library/theme/layout/src/vertical.ts`

Pekerjaan:

- rewrite komponen kontrol agar membaca state baru dan tidak bergantung pada styling lama
- hilangkan authored dependency ke Angular CSS variable naming di component-local styles
- rewrite shell layout agar memakai semantic tokens dan utility contract baru
- evaluasi ulang apakah `elements.directive.ts` tetap dibutuhkan atau bisa disederhanakan

Definition of done:

- controls dan layout shell hanya mengonsumsi semantic tokens dan runtime contract baru

### Phase 5 Backlog: Rebuild Material Integration

Tujuan batch ini adalah memindahkan Angular Material ke adapter internal murni.

Target struktur baru:

- `projects/library/theme/styles/adapters/material-ui/`

Pekerjaan:

- pindahkan override Material ke adapter folder baru
- rewrite seluruh override agar mengonsumsi semantic tokens library
- hapus authored dependency ke `--mat-sys-*`, `--mat-*`, dan `--mdc-*` sebagai kontrak visual utama
- dokumentasikan bahwa adapter ini internal dan bukan public source of truth

Definition of done:

- Angular Material hanya menjadi adapter consumer terhadap token library
- kontrak styling utama library sepenuhnya netral dari Angular naming

### Phase 6 Backlog: Tests And Documentation

Tujuan batch ini adalah menutup refactor dengan kontrak publik yang terdokumentasi dan terlindungi.

File dokumentasi target:

- `projects/library/README.md`
- `projects/library/theme/README.md`
- `projects/library/theme/shadn-ui-theming.md`

File test yang harus diperbarui atau ditambahkan:

- `projects/library/entrypoints.spec.ts`
- `projects/library/theme/service/src/theme.service.spec.ts`
- `projects/library/theme/directive/src/theme-host.directive.spec.ts`
- `projects/library/theme/component/src/appearance-switcher.spec.ts`
- `projects/library/theme/component/src/color-picker.spec.ts`
- `projects/library/theme/component/src/layout-container-switcher.spec.ts`
- `projects/library/theme/component/src/layout-mode-switcher.spec.ts`
- `projects/library/theme/component/src/scheme-switcher.spec.ts`
- `projects/library/theme/layout/src/horizontal.spec.ts`
- `projects/library/theme/layout/src/vertical.spec.ts`

Pekerjaan:

- rewrite README root library agar mengikuti kontrak baru
- rewrite README theme agar menjelaskan token contract baru, bukan kontrak lama
- gunakan `shadn-ui-theming.md` sebagai referensi internal dan sesuaikan dokumentasi library dengan pola tersebut
- tambah test consumer-facing untuk service, directive, controls, dan layout shell
- pastikan smoke test entry points tetap menjaga kontrak public API

Definition of done:

- dokumentasi menjelaskan kontrak baru secara konsisten
- test sudah melindungi perilaku utama dan public contract

## Backlog Implementasi Per File

Bagian ini merangkum tindakan yang paling mungkin dilakukan terhadap file yang sudah ada sekarang.

### Rewrite Total

File berikut diasumsikan akan ditulis ulang penuh:

- `projects/library/theme/service/src/theme.types.ts`
- `projects/library/theme/service/src/theme.provider.ts`
- `projects/library/theme/service/src/theme.service.ts`
- `projects/library/theme/directive/src/theme-host.directive.ts`
- `projects/library/theme/component/src/appearance-switcher.ts`
- `projects/library/theme/component/src/color-picker.ts`
- `projects/library/theme/component/src/layout-container-switcher.ts`
- `projects/library/theme/component/src/layout-mode-switcher.ts`
- `projects/library/theme/component/src/scheme-switcher.ts`
- `projects/library/theme/layout/src/horizontal.ts`
- `projects/library/theme/layout/src/vertical.ts`
- `projects/library/theme/styles/index.css`
- `projects/library/theme/README.md`
- `projects/library/README.md`

### Evaluasi Ulang Keberadaan File

File berikut harus diputuskan tetap dipakai, dipindah, atau dihapus:

- `projects/library/theme/layout/src/elements.directive.ts`
- `projects/library/theme/component/src/theme-icon.directive.ts`
- `projects/library/theme/service/src/theme.token.ts`

### Sudah Dihapus Dari Source Aktif

File berikut sudah dihapus dari source aktif:

- legacy stylesheet files dari arsitektur pra-semantic-token
- legacy override tree untuk Angular Material

### Ditambahkan Sebagai Bagian Dari Kontrak Baru

File atau folder berikut diharapkan dibuat:

- `projects/library/theme/styles/tokens/`
- `projects/library/theme/styles/presets/colors/`
- `projects/library/theme/styles/presets/appearances/`
- `projects/library/theme/styles/modes/`
- `projects/library/theme/styles/layout/`
- `projects/library/theme/styles/utilities/`
- `projects/library/theme/styles/adapters/material-ui/`
- file test baru untuk service, directive, controls, dan layout

## Urutan Eksekusi Yang Disarankan

Supaya implementasi tidak berantakan, eksekusi sebaiknya dilakukan dengan urutan berikut:

1. finalisasi semantic token contract dan runtime contract
2. bangun struktur stylesheet baru dan hentikan referensi ke style lama
3. refactor service dan directive ke root state baru
4. refactor controls dan layout shell ke token contract baru
5. bangun adapter internal untuk Angular Material
6. tutup dengan tests dan dokumentasi akhir

## Area Yang Harus Dihapus Atau Ditulis Ulang

Area berikut diasumsikan akan ditulis ulang, bukan diadaptasi:

- semua authored CSS yang menjadikan Angular token names sebagai basis visual
- kontrak atribut runtime lama
- struktur style lama yang bercampur antara token, utility, appearance, dan adapter
- dokumentasi theme lama yang menjelaskan theme melalui Angular naming

## Non-goals

Hal berikut tidak menjadi fokus tahap awal:

- menjaga backward compatibility
- mempertahankan nama kontrak styling lama
- membuat migration layer sementara
- menambah preset visual baru sebelum token contract stabil
- mengoptimalkan detail visual minor sebelum arsitektur selesai

## Success Criteria

Refactor dianggap berhasil bila:

- semantic token ala shadcn menjadi source of truth
- dark mode mengikuti `.dark`
- Angular-specific CSS variables tidak lagi menjadi kontrak styling library
- state theme Angular hanya menjadi orchestration layer
- structure style baru lebih modular dan mudah di-scale
- public API library lebih jelas dan lebih aman untuk dikembangkan
- tests melindungi contract baru, bukan implementation detail lama

## Prioritas Langsung

Urutan kerja yang paling tepat dimulai dari:

1. finalisasi semantic token contract
2. finalisasi runtime root contract
3. susun ulang folder style architecture
4. hapus authored dependency ke Angular CSS variable naming
5. refactor service, layout, dan controls ke contract baru
6. tambahkan tests dan dokumentasi final
