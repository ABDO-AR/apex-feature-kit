import fs from "fs-extra";
import path from "path";
import { ApexFS } from "../core/apex-fs.js";
import { PlatformSchema, type Platform } from "../core/schema.js";
import { INSTRUCTIONS_CONTENT } from "../templates/instructions.js";
import { NEW_FEATURE_CONTENT } from "../templates/slash-commands/new-feature.md.js";
import { IMPLEMENT_FEATURE_CONTENT } from "../templates/slash-commands/implement-feature.md.js";
import { VERIFY_FEATURE_CONTENT } from "../templates/slash-commands/verify-feature.md.js";
import { UPDATE_FEATURE_CONTENT } from "../templates/slash-commands/update-feature.md.js";
import { printHeader, printSuccess, printError, theme } from "../ui/theme.js";

const SLASH_COMMANDS: Record<string, string> = {
  "new-feature.md": NEW_FEATURE_CONTENT,
  "implement-feature.md": IMPLEMENT_FEATURE_CONTENT,
  "verify-feature.md": VERIFY_FEATURE_CONTENT,
  "update-feature.md": UPDATE_FEATURE_CONTENT,
};

const PLATFORM_DIRS: Record<string, string> = {
  kilo: ".kilo/commands",
  cursor: ".cursor/commands",
};

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

export async function initCommand(platform: string): Promise<void> {
  const parsed = PlatformSchema.safeParse(platform);
  if (!parsed.success) {
    printError(
      `Invalid platform "${platform}". Valid values: cursor, kilo, all`
    );
    process.exit(1);
  }

  const validPlatform = parsed.data;
  const projectRoot = resolveProjectRoot();

  printHeader("INIT");

  await ApexFS.ensureFeaturesDir(projectRoot);
  printSuccess(`Features directory ready at ${theme.filePath(".features/")}`);

  const treePath = ApexFS.treePath(projectRoot);
  if (!(await ApexFS.fileExists(treePath))) {
    await ApexFS.writeTree(projectRoot, { features: [] });
    printSuccess(`Created ${theme.filePath(".features/tree.yaml")}`);
  } else {
    console.log(
      theme.dim(`  .features/tree.yaml already exists — skipping`)
    );
  }

  const instructionsPath = ApexFS.instructionsPath(projectRoot);
  if (!(await ApexFS.fileExists(instructionsPath))) {
    await ApexFS.writeInstructions(projectRoot, INSTRUCTIONS_CONTENT);
    printSuccess(`Created ${theme.filePath(".features/instructions.md")}`);
  } else {
    console.log(
      theme.dim(`  .features/instructions.md already exists — skipping`)
    );
  }

  const platforms: string[] =
    validPlatform === "all" ? ["kilo", "cursor"] : [validPlatform];

  for (const pf of platforms) {
    const commandDir = path.join(projectRoot, PLATFORM_DIRS[pf]);
    await fs.ensureDir(commandDir);
    printSuccess(
      `Ensured ${theme.filePath(PLATFORM_DIRS[pf] + "/")} directory exists`
    );

    for (const [filename, content] of Object.entries(SLASH_COMMANDS)) {
      const filePath = path.join(commandDir, filename);
      if (!(await ApexFS.fileExists(filePath))) {
        await fs.writeFile(filePath, content, "utf-8");
        printSuccess(
          `Created ${theme.filePath(PLATFORM_DIRS[pf] + "/" + filename)}`
        );
      } else {
        console.log(
          theme.dim(
            `  ${PLATFORM_DIRS[pf]}/${filename} already exists — skipping`
          )
        );
      }
    }
  }

  console.log();
  printSuccess("Apex Feature Kit initialized successfully!");
  console.log(
    theme.dim(
      `  Platform: ${validPlatform} | Project: ${projectRoot}`
    )
  );
  console.log();
}
