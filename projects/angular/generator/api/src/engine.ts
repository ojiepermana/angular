import { isAbsolute, resolve } from 'node:path';

import type { ResolvedSdkTarget } from './config/schema';
import { emitClient } from './emit/client';
import { emitMetadata } from './emit/metadata';
import { emitModels } from './emit/models';
import { emitNavigation } from './emit/navigation';
import { emitOperations } from './emit/operations';
import { emitPublicApi } from './emit/public-api';
import { emitServices } from './emit/services';
import { relayoutPerDomain } from './layout/per-domain';
import { buildIR } from './parser/ir';
import { loadSpec } from './parser/bundle';
import type { SdkIR } from './parser/types';
import type { VirtualFile } from './render/template';
import { writeLibrary, writeSecondaryEntrypoint, writeStandalone } from './writer/index';

export interface GenerateResult {
  target: ResolvedSdkTarget;
  /** Absolute output directory. */
  outputDir: string;
  /** Virtual files keyed by path relative to the output directory. */
  files: VirtualFile[];
  /** Stats for logs / summary. */
  stats: {
    schemas: number;
    operations: number;
    tags: number;
    files: number;
  };
}

/**
 * Run the generator for a single resolved target. Pure in the sense that it
 * does **not** touch the filesystem — the caller is expected to materialize
 * `result.files` either into an Angular schematic `Tree` or onto disk.
 */
export async function generate(target: ResolvedSdkTarget, workspaceRoot: string): Promise<GenerateResult> {
  const specPath = isAbsolute(target.input) ? target.input : resolve(workspaceRoot, target.input);
  const doc = await loadSpec(specPath);
  const ir = buildIR(doc);

  const files: VirtualFile[] = [];
  if (target.features.client) files.push(...emitClient(ir, target));
  if (target.features.models) files.push(...emitModels(ir, target));
  if (target.features.operations) files.push(...emitOperations(ir, target));
  if (target.features.services) files.push(...emitServices(ir, target));
  if (target.features.metadata) files.push(...emitMetadata(ir, target));
  if (target.features.navigation) files.push(...emitNavigation(ir, target));

  // public-api barrel is emitted last so it sees the final feature set.
  files.push(...emitPublicApi(ir, target));

  const laidOut = target.splitByDomain ? relayoutPerDomain(files, ir, target) : files;
  const wrapped = applyMode(laidOut, ir, target);
  const outputDir = isAbsolute(target.output) ? target.output : resolve(workspaceRoot, target.output);

  return {
    target,
    outputDir,
    files: wrapped,
    stats: {
      schemas: ir.schemas.length,
      operations: ir.operations.length,
      tags: new Set(ir.operations.map((o) => o.tag)).size,
      files: wrapped.length,
    },
  };
}

function applyMode(files: VirtualFile[], ir: SdkIR, target: ResolvedSdkTarget): VirtualFile[] {
  switch (target.mode) {
    case 'library':
      return writeLibrary(files, ir, target);
    case 'secondary-entrypoint':
      return writeSecondaryEntrypoint(files, ir, target);
    case 'standalone':
    default:
      return writeStandalone(files);
  }
}
