# SDK Generator

OpenAPI → Angular SDK generator shipped as the secondary entrypoint
`@ojiepermana/angular/generator/api`.

It generates a **lightweight Angular SDK** from any OpenAPI 3.x spec (including
3.2.0): typed `HttpClient` services, tree-shakeable fn modules, optional
metadata (permissions / validators), and a navigation tree.

## Local development in this repo

```bash
# 1. Build the schematic runtime
bun run gen:sdk:build

# 2. Scaffold a workspace config
bun run gen:sdk:init

# 3. Edit sdk.config.json, then generate
bun run gen:sdk
```

## Consumer usage after publish

```bash
# inside an Angular workspace that installed @ojiepermana/angular
ng generate @ojiepermana/angular:sdk-init
ng generate @ojiepermana/angular:sdk
```

## Schematics

The entrypoint exposes two schematics, registered in the parent collection at [`projects/angular/collection.json`](../../collection.json):

| Schematic  | Script                 | Purpose                                                         |
| ---------- | ---------------------- | --------------------------------------------------------------- |
| `sdk-init` | `bun run gen:sdk:init` | Create `sdk.config.json` at the workspace root from the example |
| `sdk`      | `bun run gen:sdk`      | Run the generator using `sdk.config.json`                       |

Both can be invoked directly with `ng generate` too:

```bash
bunx ng generate ./projects/angular/collection.json:sdk-init [--force] [--path=custom/sdk.config.json]
bunx ng generate ./projects/angular/collection.json:sdk      [--dry-run] [--config=sdk.config.json] [--target=1]

# after publish / inside a consuming workspace:
ng generate @ojiepermana/angular:sdk-init [--force] [--path=custom/sdk.config.json]
ng generate @ojiepermana/angular:sdk      [--dry-run] [--config=sdk.config.json] [--target=1]
```

### `init` options

| Option    | Type    | Default           | Description                                   |
| --------- | ------- | ----------------- | --------------------------------------------- |
| `--path`  | string  | `sdk.config.json` | Destination path, relative to workspace root. |
| `--force` | boolean | `false`           | Overwrite the file if it already exists.      |

### `sdk` options

| Option      | Type   | Default           | Description                                                        |
| ----------- | ------ | ----------------- | ------------------------------------------------------------------ |
| `--config`  | string | `sdk.config.json` | Path to the config file, relative to workspace root.               |
| `--target`  | string | _(all)_           | Only generate one target. Accepts a 1-based index or `clientName`. |
| `--dry-run` | flag   | —                 | Preview file operations without writing anything.                  |

## Config shape

```jsonc
{
  "$schema": "./node_modules/@ojiepermana/angular/generator/api/schematics/sdk/schema.json",
  "targets": [
    {
      "input": "./openapi.yaml",
      "output": "./sdk",
      "mode": "standalone", // "standalone" | "library" | "secondary-entrypoint"
      "clientName": "Api",
      "packageName": "@my-scope/sdk", // only used in "library" mode
      "packageVersion": "0.0.1", // only used in "library" mode
      "rootUrl": "", // optional; empty string means same-origin requests
      "splitByDomain": false, // optional, default false — see "Per-domain layout"
      "splitDepth": "service", // "service" (default) | "tag"
      "features": {
        "models": true,
        "operations": true,
        "services": true,
        "client": true,
        "metadata": true,
        "navigation": true,
      },
    },
  ],
}
```

Multiple targets are supported — one config run can emit several SDKs.

If `rootUrl` is omitted or left empty, the generated SDK uses same-origin
requests by default. Consumer apps can override it at runtime with
`provideApiConfiguration(...)`.

### Runtime base URL

The generated SDK does not read `sdk.config.json` at runtime. The value of
`targets[].rootUrl` is only used during code generation to seed the default
`ApiConfiguration.rootUrl` value.

- `rootUrl: ""` or omitted: requests use the current origin, for example
  `/api/users` on the same host as the Angular app.
- `rootUrl: "https://api.example.com"`: the generated SDK defaults to that
  absolute backend URL.
- Runtime override: consumer apps can replace the default by providing a new
  value during bootstrap.

Example runtime override in a consumer app:

```ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app/app.component';
import { provideApiConfiguration } from '@my-scope/sdk';

bootstrapApplication(AppComponent, {
  providers: [provideHttpClient(), provideApiConfiguration('https://api.example.com')],
});
```

For standalone generated output inside the same workspace, import
`provideApiConfiguration` from the generated SDK barrel instead of an npm
package path.

## Per-domain layout

By default the generator emits a flat layout (`models/`, `fn/`, `services/`, …
all at the output root). Set `splitByDomain: true` to reorganise the output
into one folder per domain, derived from OpenAPI tags. Cross-domain models and
client primitives land in `shared/`.

```jsonc
{
  "splitByDomain": true,
  "splitDepth": "service", // or "tag"
}
```

`splitDepth` controls granularity. It is only read when `splitByDomain` is
`true`.

| `splitDepth` | Folder strategy                                                                                                  | Example (spec with tags `Access/Role`, `Access/Permission`, `Storage/GCS`, `Storage/S3`, `Auth`)                                         |
| ------------ | ---------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `service`    | One folder per **root** tag (each tag's `parent` chain collapses to its root). One folder per backend service.   | `access/` (holds Role + Permission + Role-Permission + …), `storage/` (holds GCS + S3), `auth/`, `shared/`, root `public-api.ts`         |
| `tag`        | One folder per **leaf** tag, nested under the parent chain. Keeps fine-grained separation while staying grouped. | `access/role/`, `access/permission/`, `access/role-permission/`, `storage/gcs/`, `storage/s3/`, `auth/`, `shared/`, root `public-api.ts` |

Every domain folder contains `services/`, `fn/`, `models/`, `permissions/`,
and its own `public-api.ts` (which re-exports `shared/public-api` for
convenience). The root `public-api.ts` aggregates `shared` plus every domain,
so consumers can still do `import { UserService } from './sdk'` regardless of
layout.

Model ownership rule (per-domain mode):

- A model used by exactly one domain → emitted inside that domain's `models/`.
- A model shared across two or more domains → emitted inside `shared/models/`.
- Client primitives (`ApiConfiguration`, `BaseService`, `RequestBuilder`,
  `StrictHttpResponse`, `Api`), metadata, validators, and the top-level
  `permissions/index.ts` always live under `shared/`.

Example consumption when using `mode: 'library'` with `splitByDomain: true`:

```ts
import { RoleService } from '@my-scope/sdk/access';
import { ApprovalInstanceService, SubmitRequest } from '@my-scope/sdk/approval';
import { GCSService } from '@my-scope/sdk/storage'; // splitDepth: 'service'
import { GCSService } from '@my-scope/sdk/storage/gcs'; // splitDepth: 'tag'
```

## Output modes

| Mode                   | What it emits                                                                             | Use when…                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `standalone`           | A plain folder (no `ng-package.json`).                                                    | You consume the SDK via path alias / `tsconfig.paths` inside the same app.             |
| `library`              | Standalone output **plus** `ng-package.json`, `package.json` (peerDeps), and `README.md`. | You want to build it with ng-packagr and publish to npm.                               |
| `secondary-entrypoint` | Standalone output **plus** a minimal `ng-package.json` pointing at `public-api.ts`.       | You drop the folder inside an existing library so ng-packagr picks it up as a subpath. |

## Feature flags

All default to `true`. Turn off anything you don't need to shrink the output.

| Flag         | Emits                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------ |
| `models`     | `models/*.ts` — flat interfaces, enum aliases, array aliases.                              |
| `operations` | `fn/<tag>/<operation-id>.ts` — tree-shakeable request functions with `.PATH`.              |
| `services`   | `services/<tag>.service.ts` — `@Injectable({providedIn:'root'})` wrappers.                 |
| `client`     | `api-configuration.ts`, `base-service.ts`, `request-builder.ts`, `api.ts`.                 |
| `metadata`   | `permissions/*`, `validators/*`, `metadata.ts`, `openapi-helpers.ts`.                      |
| `navigation` | `api.navigation.ts` — `NavigationItem[]` ready for `NavigationService.registerItems(...)`. |

## Pipeline

```
sdk.config.json → loader → spec (YAML/JSON) → IR → emitters → writer → Angular CLI Tree
```

- `src/config/` — config schema + loader (supports JSONC and `.js`/`.cjs`).
- `src/parser/` — OpenAPI → intermediate representation.
- `src/emit/` — one module per output concern (models, operations, services, client, metadata, navigation, public-api).
- `src/layout/` — post-emit layout transforms (e.g. `splitByDomain` reorganisation).
- `src/writer/` — mode wrappers (standalone / library / secondary entrypoint).
- `public-api.ts` — published TypeScript entrypoint for `@ojiepermana/angular/generator/api`.
- `schematics/init/` — creates `sdk.config.json` from the example template.
- `schematics/sdk/` — orchestrates engine and writes virtual files into the CLI `Tree`.

## Generated runtime conventions

- Tree-shakeable: `import { listUsers } from './sdk/fn/user/list-users'` pulls only one HTTP call.
- Services: every operation gets `op()` (body `Observable<T>`) and `op$Response()` (full `StrictHttpResponse<T>`).
- `RequestBuilder` is intentionally minimal — no `style`/`explode` logic — to keep the output lightweight.
- All files carry a `DO NOT EDIT` banner and `/* eslint-disable */`.
