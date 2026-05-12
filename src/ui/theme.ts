import chalk from "chalk";

const gold = chalk.hex("#FFD700");

export const theme = {
  header: chalk.gray.dim,
  title: chalk.white.bold,
  completed: gold,
  active: chalk.gray,
  success: gold,
  error: chalk.red,
  timestamp: chalk.gray.dim,
  filePath: chalk.cyan.dim,
  info: chalk.white,
  dim: chalk.gray.dim,
};

export function printHeader(title: string): void {
  const line = "═".repeat(30);
  console.log();
  console.log(theme.header(line));
  console.log(theme.header("  APEX FEATURE KIT"), theme.title(` — ${title}`));
  console.log(theme.header(line));
}

export function printSuccess(message: string): void {
  console.log(theme.success("✓"), theme.info(message));
}

export function printError(message: string): void {
  console.log(theme.error("✗"), theme.info(message));
}

export function printSummary(stats: {
  total: number;
  completed: number;
  unchecked: number;
  featureCount: number;
}): void {
  const line = "═".repeat(30);
  console.log();
  console.log(theme.header(line));
  console.log(theme.header("  APEX FEATURE KIT — STATUS"));
  console.log(theme.header(line));
  console.log(
    theme.info(`  Features: ${stats.featureCount}  │  Tasks: ${stats.completed}/${stats.total}`)
  );
  console.log(
    `  ${theme.completed("✓ Completed:")} ${stats.completed}  │  ${theme.active("○ Active:")} ${stats.unchecked}`
  );
  console.log(theme.header(line));
  console.log();
}

export function printSyncSummary(result: {
  synced: number;
  completed: number;
  inProgress: number;
  newlyIndexed: number;
}): void {
  console.log();
  console.log(theme.info(`  Synced ${result.synced} features`));
  const parts: string[] = [];
  if (result.completed > 0) {
    parts.push(`${theme.completed("✓")} ${result.completed} completed`);
  }
  if (result.inProgress > 0) {
    parts.push(`${theme.active("○")} ${result.inProgress} in progress`);
  }
  if (result.newlyIndexed > 0) {
    parts.push(`${theme.success("+")} ${result.newlyIndexed} new spec indexed`);
  }
  if (parts.length > 0) {
    console.log(`  ${parts.join("  |  ")}`);
  }
  console.log();
}
