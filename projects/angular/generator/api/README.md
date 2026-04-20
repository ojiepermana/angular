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
ng generate @ojiepermana/angular/generator/api:init
ng generate @ojiepermana/angular/generator/api:sdk
```

## Schematics

The entrypoint exposes two schematics via `collection.json`:

| Schematic | Script                 | Purpose                                                         |
| --------- | ---------------------- | --------------------------------------------------------------- |
| `init`    | `bun run gen:sdk:init` | Create `sdk.config.json` at the workspace root from the example |
| `sdk`     | `bun run gen:sdk`      | Run the generator using `sdk.config.json`                       |

Both can be invoked directly with `ng generate` too:

```bash
bunx ng generate ./projects/angular/generator/api/collection.json:init [--force] [--path=custom/sdk.config.json]
bunx ng generate ./projects/angular/generator/api/collection.json:sdk  [--dry-run] [--config=sdk.config.json] [--target=1]

# after publish / inside a consuming workspace:
ng generate @ojiepermana/angular/generator/api:init [--force] [--path=custom/sdk.config.json]
ng generate @ojiepermana/angular/generator/api:sdk  [--dry-run] [--config=sdk.config.json] [--target=1]
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
      "rootUrl": "http://127.0.0.1:8080",
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
- `src/writer/` — mode wrappers (standalone / library / secondary entrypoint).
- `public-api.ts` — published TypeScript entrypoint for `@ojiepermana/angular/generator/api`.
- `schematics/init/` — creates `sdk.config.json` from the example template.
- `schematics/sdk/` — orchestrates engine and writes virtual files into the CLI `Tree`.

## Generated runtime conventions

- Tree-shakeable: `import { listUsers } from './sdk/fn/user/list-users'` pulls only one HTTP call.
- Services: every operation gets `op()` (body `Observable<T>`) and `op$Response()` (full `StrictHttpResponse<T>`).
- `RequestBuilder` is intentionally minimal — no `style`/`explode` logic — to keep the output lightweight.
- All files carry a `DO NOT EDIT` banner and `/* eslint-disable */`.
