# `@ojiepermana/angular/generator/guide`

Build-time schematic that compiles a folder of Markdown files into Angular standalone components plus a nested `Routes` file.

This entry point ships **no runtime code**. It is only invoked through the Angular CLI:

```bash
# 1. scaffold a config file at the workspace root
bun run gen:guide:init

# 2. edit guide.config.json (sourceDir, outputDir, ...)

# 3. generate components + routes
bun run gen:guide
```

Inside this monorepo the schematic factory is registered in the parent collection at [`projects/angular/collection.json`](../../collection.json).
After publishing, consumers run `ng generate @ojiepermana/angular:guide` (and `:guide-init` to scaffold the config).

## Config (`guide.config.json`)

| Key               | Type                        | Default         | Description                                                         |
| ----------------- | --------------------------- | --------------- | ------------------------------------------------------------------- |
| `sourceDir`       | `string` (required)         | —               | Folder containing `.md` files. Nested folders become nested routes. |
| `outputDir`       | `string` (required)         | —               | Destination folder for generated components and the routes file.    |
| `routeFile`       | `string`                    | `doc.routes.ts` | File name of the generated routes file at `outputDir`.              |
| `componentPrefix` | `string`                    | `Doc`           | Prefix on generated component class names.                          |
| `componentStyle`  | `'none' \| 'css' \| 'scss'` | `'none'`        | Whether to emit a sibling stylesheet per component.                 |
| `routeExportName` | `string`                    | `DOC_ROUTES`    | Identifier used for the exported `Routes` constant.                 |

## Frontmatter

Each `.md` file may declare YAML-style frontmatter:

```md
---
title: Getting Started
order: 1
path: getting-started
---

# Hello
```

- `title` → `data.title` on the route
- `order` → controls sibling sort order (lower comes first)
- `path` → overrides the URL segment derived from the file name (`index.md` → empty path)

## Output shape

For `sourceDir: ./docs` containing `docs/intro/overview.md`:

```
<outputDir>/
  intro/
    overview.component.ts        // standalone @Component, OnPush, inline template
  doc.routes.ts                  // exports DOC_ROUTES: Routes
```

Routes mirror the folder tree with lazy `loadComponent`:

```ts
export const DOC_ROUTES: Routes = [
  {
    path: 'intro',
    children: [
      {
        path: 'overview',
        loadComponent: () => import('./intro/overview.component').then((m) => m.DocIntroOverviewComponent),
        data: { title: 'Overview', order: 1 },
      },
    ],
  },
];
```

Then plug into your app:

```ts
{
  path: 'docs',
  loadChildren: () => import('./docs/doc.routes').then((m) => m.DOC_ROUTES),
},
```
