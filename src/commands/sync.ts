import fs from "fs-extra";
import path from "path";
import { ApexFS } from "../core/apex-fs.js";
import { TreeManager } from "../core/tree-manager.js";
import {
  printHeader,
  printSyncSummary,
  printError,
  printSummary,
  theme,
} from "../ui/theme.js";

function resolveProjectRoot(): string {
  let dir = process.cwd();
  for (let i = 0; i < 20; i++) {
    if (fs.pathExistsSync(path.join(dir, "package.json"))) {
      return dir;
    }
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }
  return process.cwd();
}

export async function syncCommand(): Promise<void> {
  const projectRoot = resolveProjectRoot();

  printHeader("SYNC");

  const featuresDir = ApexFS.featuresDir(projectRoot);
  if (!(await ApexFS.fileExists(featuresDir))) {
    printError(
      "No .features/ directory found. Run `apex-feature-kit init` first."
    );
    process.exit(1);
  }

  const result = await TreeManager.syncFeatures(projectRoot);

  if (result.stale.length > 0) {
    console.log(theme.dim("  Stale entries (missing spec files):"));
    for (const file of result.stale) {
      console.log(theme.error(`    ✗ ${file}`));
    }
  }

  const stats = await TreeManager.getFeatureStats(projectRoot);

  printSyncSummary({
    synced: stats.featureCount,
    completed: stats.completedFeatures,
    inProgress: stats.featureCount - stats.completedFeatures,
    newlyIndexed: result.added,
  });

  if (stats.featureCount > 0) {
    printSummary({
      total: stats.totalTasks,
      completed: stats.completedTasks,
      unchecked: stats.uncheckedTasks,
      featureCount: stats.featureCount,
    });
  }
}
