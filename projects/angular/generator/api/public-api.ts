/*
 * Public API Surface of @ojiepermana/angular/generator/api
 *
 * This secondary entrypoint is primarily consumed as an Angular schematic
 * collection (`init` and `sdk`). The TypeScript surface intentionally stays
 * small and Node-free so it can be published inside the main library package.
 */

export type {
  ResolvedFeatureFlags,
  ResolvedSdkTarget,
  SdkConfig,
  SdkFeatureFlags,
  SdkOutputMode,
  SdkTargetConfig,
} from './src/config/schema';
export { resolveConfig, resolveTarget } from './src/config/schema';
