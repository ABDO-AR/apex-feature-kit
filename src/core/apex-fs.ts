import fs from "fs-extra";
import path from "path";
import yaml from "js-yaml";
import { TreeDataSchema, type TreeData } from "./schema.js";

const FEATURES_DIR = ".features";
const SPECS_DIR = "specs";
const TREE_FILE = "tree.yaml";
const INSTRUCTIONS_FILE = "instructions.md";

export class ApexFS {
  static featuresDir(projectRoot: string): string {
    return path.join(projectRoot, FEATURES_DIR);
  }

  static specsDir(projectRoot: string): string {
    return path.join(projectRoot, FEATURES_DIR, SPECS_DIR);
  }

  static treePath(projectRoot: string): string {
    return path.join(projectRoot, FEATURES_DIR, TREE_FILE);
  }

  static instructionsPath(projectRoot: string): string {
    return path.join(projectRoot, FEATURES_DIR, INSTRUCTIONS_FILE);
  }

  static specPath(projectRoot: string, filename: string): string {
    return path.join(projectRoot, FEATURES_DIR, SPECS_DIR, filename);
  }

  static async ensureFeaturesDir(projectRoot: string): Promise<string> {
    const dir = ApexFS.featuresDir(projectRoot);
    const specsDir = ApexFS.specsDir(projectRoot);
    await fs.ensureDir(specsDir);
    return dir;
  }

  static async readTree(projectRoot: string): Promise<TreeData> {
    const treePath = ApexFS.treePath(projectRoot);
    if (!(await fs.pathExists(treePath))) {
      return { features: [] };
    }
    const raw = await fs.readFile(treePath, "utf-8");
    const parsed = yaml.load(raw);
    const result = TreeDataSchema.safeParse(parsed);
    if (!result.success) {
      return { features: [] };
    }
    return result.data;
  }

  static async writeTree(projectRoot: string, data: TreeData): Promise<void> {
    const treePath = ApexFS.treePath(projectRoot);
    const tmpPath = treePath + ".tmp";

    const originalComments = await ApexFS.extractComments(treePath);
    const yamlContent = yaml.dump(data, { lineWidth: -1, quotingType: '"' });
    const finalContent = ApexFS.reinjectComments(yamlContent, originalComments);

    await fs.writeFile(tmpPath, finalContent, "utf-8");
    await fs.rename(tmpPath, treePath);
  }

  static async readSpec(projectRoot: string, filename: string): Promise<string> {
    const specPath = ApexFS.specPath(projectRoot, filename);
    return fs.readFile(specPath, "utf-8");
  }

  static async writeSpec(
    projectRoot: string,
    filename: string,
    content: string
  ): Promise<void> {
    const specPath = ApexFS.specPath(projectRoot, filename);
    const tmpPath = specPath + ".tmp";
    await fs.writeFile(tmpPath, content, "utf-8");
    await fs.rename(tmpPath, specPath);
  }

  static async readInstructions(projectRoot: string): Promise<string> {
    const instPath = ApexFS.instructionsPath(projectRoot);
    if (!(await fs.pathExists(instPath))) {
      return "";
    }
    return fs.readFile(instPath, "utf-8");
  }

  static async writeInstructions(
    projectRoot: string,
    content: string
  ): Promise<void> {
    const instPath = ApexFS.instructionsPath(projectRoot);
    const tmpPath = instPath + ".tmp";
    await fs.writeFile(tmpPath, content, "utf-8");
    await fs.rename(tmpPath, instPath);
  }

  static async fileExists(filePath: string): Promise<boolean> {
    return fs.pathExists(filePath);
  }

  static async listSpecs(projectRoot: string): Promise<string[]> {
    const specsDir = ApexFS.specsDir(projectRoot);
    if (!(await fs.pathExists(specsDir))) {
      return [];
    }
    const files = await fs.readdir(specsDir);
    return files.filter((f) => f.endsWith(".md")).sort();
  }

  private static async extractComments(
    treePath: string
  ): Promise<Map<number, string>> {
    const comments = new Map<number, string>();
    if (!(await fs.pathExists(treePath))) {
      return comments;
    }
    const raw = await fs.readFile(treePath, "utf-8");
    const lines = raw.split("\n");
    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("#")) {
        comments.set(index, line);
      }
    });
    return comments;
  }

  private static reinjectComments(
    yamlContent: string,
    comments: Map<number, string>
  ): string {
    if (comments.size === 0) return yamlContent;

    const lines = yamlContent.split("\n");
    const result: string[] = [];
    let yamlLineIndex = 0;

    for (const [commentLineIndex, commentLine] of comments) {
      while (result.length < commentLineIndex && yamlLineIndex < lines.length) {
        result.push(lines[yamlLineIndex++]);
      }
      if (result.length === commentLineIndex) {
        result.push(commentLine);
      }
    }

    while (yamlLineIndex < lines.length) {
      result.push(lines[yamlLineIndex++]);
    }

    return result.join("\n");
  }
}
