/**
 * Public configuration shape for the `guide` schematic.
 *
 * The schematic reads `guide.config.json` at the workspace root and produces
 * standalone Angular components plus a nested `Routes` file under `outputDir`.
 *
 * Node / Angular CLI utilities stay in the schematic package itself. This file
 * is the only surface re-exported by the secondary entry point and therefore
 * MUST stay free of Node-specific imports.
 */

export type ComponentStyle = 'none' | 'css' | 'scss';

export interface GuideConfig {
  /**
   * Folder containing the source `.md` files, relative to the workspace root.
   * Nested folders become nested route children.
   */
  sourceDir: string;

  /**
   * Destination folder for generated components and the routes file,
   * relative to the workspace root.
   */
  outputDir: string;

  /**
   * File name for the generated route tree written at `outputDir`.
   * Defaults to `doc.routes.ts`.
   */
  routeFile?: string;

  /**
   * Prefix applied to generated component class names. Defaults to `Doc`.
   * A file `docs/intro/overview.md` with prefix `Doc` becomes `DocIntroOverviewComponent`.
   */
  componentPrefix?: string;

  /**
   * How generated components should handle styles.
   * - `none`: no style file is emitted and the component declares no `styles`.
   * - `css` / `scss`: a sibling stylesheet file is emitted and referenced.
   */
  componentStyle?: ComponentStyle;

  /**
   * Identifier used for the exported `Routes` constant.
   * Defaults to `DOC_ROUTES`.
   */
  routeExportName?: string;
}

export interface ResolvedGuideConfig {
  readonly sourceDir: string;
  readonly outputDir: string;
  readonly routeFile: string;
  readonly componentPrefix: string;
  readonly componentStyle: ComponentStyle;
  readonly routeExportName: string;
}
