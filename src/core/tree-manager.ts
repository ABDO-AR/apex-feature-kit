import { ApexFS } from "./apex-fs.js";
import { parseTaskCounts, isCompleted } from "./markdown-parser.js";
import { generateId, generateFilename } from "./markdown-parser.js";
import type {
  FeatureEntry,
  TreeData,
  SyncResult,
  TaskCounts,
} from "./schema.js";

export class TreeManager {
  static async addFeature(
    projectRoot: string,
    entry: FeatureEntry
  ): Promise<void> {
    const tree = await ApexFS.readTree(projectRoot);
    tree.features.push(entry);
    await ApexFS.writeTree(projectRoot, tree);
  }

  static async syncFeatures(projectRoot: string): Promise<SyncResult> {
    const tree = await ApexFS.readTree(projectRoot);
    const specFiles = await ApexFS.listSpecs(projectRoot);

    let added = 0;
    let updated = 0;
    let completed = 0;
    const stale: string[] = [];

    const existingFiles = new Set(tree.features.map((f) => f.file));

    for (const specFile of specFiles) {
      const relativePath = `specs/${specFile}`;
      const content = await ApexFS.readSpec(projectRoot, specFile);
      const counts = parseTaskCounts(content);
      const featureIsComplete = isCompleted(content);

      const existingIndex = tree.features.findIndex(
        (f) => f.file === relativePath
      );

      if (existingIndex === -1) {
        const title = TreeManager.extractTitle(content) || specFile;
        tree.features.push({
          id: generateId(),
          file: relativePath,
          title,
          created_at: new Date().toISOString(),
          completed_at: featureIsComplete ? new Date().toISOString() : null,
        });
        added++;
        if (featureIsComplete) completed++;
      } else {
        const entry = tree.features[existingIndex];

        if (featureIsComplete && entry.completed_at === null) {
          entry.completed_at = new Date().toISOString();
          completed++;
        } else if (!featureIsComplete && entry.completed_at !== null) {
          entry.completed_at = null;
          updated++;
        } else {
          updated++;
        }
      }
    }

    for (const entry of tree.features) {
      const fullPath = ApexFS.specPath(
        projectRoot,
        entry.file.replace("specs/", "")
      );
      if (!(await ApexFS.fileExists(fullPath))) {
        stale.push(entry.file);
      }
    }

    await ApexFS.writeTree(projectRoot, tree);

    return { added, updated, completed, stale };
  }

  static async getFeatureStats(
    projectRoot: string
  ): Promise<{
    featureCount: number;
    totalTasks: number;
    completedTasks: number;
    uncheckedTasks: number;
    completedFeatures: number;
  }> {
    const tree = await ApexFS.readTree(projectRoot);

    let totalTasks = 0;
    let completedTasks = 0;
    let uncheckedTasks = 0;
    let completedFeatures = 0;

    for (const feature of tree.features) {
      const filename = feature.file.replace("specs/", "");
      const specPath = ApexFS.specPath(projectRoot, filename);

      if (await ApexFS.fileExists(specPath)) {
        const content = await ApexFS.readSpec(projectRoot, filename);
        const counts = parseTaskCounts(content);
        totalTasks += counts.total;
        completedTasks += counts.completed;
        uncheckedTasks += counts.unchecked;
      }

      if (feature.completed_at !== null) {
        completedFeatures++;
      }
    }

    return {
      featureCount: tree.features.length,
      totalTasks,
      completedTasks,
      uncheckedTasks,
      completedFeatures,
    };
  }

  static extractTitle(content: string): string | null {
    const match = content.match(/^#\s+(.+)$/m);
    return match ? match[1] : null;
  }
}
