import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import type { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';

export interface NgAddOptions {
  skipInstall?: boolean;
}

interface LibraryPackageJson {
  peerDependencies?: Record<string, string>;
  'ng-update'?: {
    packageGroup?: string[] | Record<string, string>;
  };
}

interface WorkspacePackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

interface RequiredDependency {
  readonly name: string;
  readonly version: string;
}

export function ngAdd(options: NgAddOptions = {}): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const manifest = loadLibraryManifest();
    const requiredDependencies = collectRequiredDependencies(manifest);

    if (requiredDependencies.length === 0) {
      context.logger.warn('[ng-add] No peer dependencies were declared by @ojiepermana/angular.');
      return;
    }

    const workspacePackageJson = readWorkspacePackageJson(tree);
    workspacePackageJson.dependencies ??= {};

    let changed = false;
    for (const dependency of requiredDependencies) {
      const existingSection = findExistingSection(workspacePackageJson, dependency.name);
      if (existingSection) {
        context.logger.info(`[ng-add] keeping existing ${dependency.name} from ${existingSection}.`);
        continue;
      }

      workspacePackageJson.dependencies[dependency.name] = dependency.version;
      changed = true;
      context.logger.info(`[ng-add] added ${dependency.name}@${dependency.version}.`);
    }

    if (!changed) {
      context.logger.info('[ng-add] Required dependencies are already present.');
      return;
    }

    workspacePackageJson.dependencies = sortSection(workspacePackageJson.dependencies);
    writeWorkspacePackageJson(tree, workspacePackageJson);

    if (!options.skipInstall) {
      context.addTask(new NodePackageInstallTask());
    }
  };
}

/**
 * Use the package manifest as the source of truth so ng-add stays aligned with
 * the published peerDependencies and ng-update packageGroup metadata.
 */
function loadLibraryManifest(): LibraryPackageJson {
  const candidates = [
    resolve(__dirname, '../../../../../package.json'),
    resolve(process.cwd(), 'node_modules/@ojiepermana/angular/package.json'),
    resolve(process.cwd(), 'projects/angular/package.json'),
  ];

  for (const candidate of candidates) {
    if (!existsSync(candidate)) continue;
    return JSON.parse(readFileSync(candidate, 'utf8')) as LibraryPackageJson;
  }

  throw new Error('Could not locate the @ojiepermana/angular package manifest for ng-add.');
}

function collectRequiredDependencies(manifest: LibraryPackageJson): RequiredDependency[] {
  const peerDependencies = manifest.peerDependencies ?? {};
  const packageGroup = normalizePackageGroup(manifest['ng-update']?.packageGroup);

  return Object.keys(peerDependencies)
    .sort((left, right) => left.localeCompare(right))
    .map((name) => ({
      name,
      version: packageGroup[name] ?? peerDependencies[name],
    }));
}

function normalizePackageGroup(packageGroup: string[] | Record<string, string> | undefined): Record<string, string> {
  if (!packageGroup) {
    return {};
  }

  if (Array.isArray(packageGroup)) {
    return {};
  }

  return packageGroup;
}

function readWorkspacePackageJson(tree: Tree): WorkspacePackageJson {
  const buffer = tree.read('/package.json');
  if (!buffer) {
    throw new Error('No package.json found at the workspace root.');
  }

  return JSON.parse(buffer.toString('utf8')) as WorkspacePackageJson;
}

function writeWorkspacePackageJson(tree: Tree, packageJson: WorkspacePackageJson): void {
  const content = `${JSON.stringify(packageJson, null, 2)}\n`;
  if (tree.exists('/package.json')) {
    tree.overwrite('/package.json', content);
  } else {
    tree.create('/package.json', content);
  }
}

function findExistingSection(packageJson: WorkspacePackageJson, dependencyName: string): string | null {
  if (packageJson.dependencies?.[dependencyName]) {
    return 'dependencies';
  }
  if (packageJson.devDependencies?.[dependencyName]) {
    return 'devDependencies';
  }
  if (packageJson.peerDependencies?.[dependencyName]) {
    return 'peerDependencies';
  }
  if (packageJson.optionalDependencies?.[dependencyName]) {
    return 'optionalDependencies';
  }
  return null;
}

function sortSection(section: Record<string, string>): Record<string, string> {
  return Object.fromEntries(Object.entries(section).sort(([left], [right]) => left.localeCompare(right)));
}
