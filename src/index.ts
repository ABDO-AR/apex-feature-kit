#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { syncCommand } from "./commands/sync.js";

const program = new Command();

program
  .name("apex-feature-kit")
  .description("Feature-Driven Development CLI for AI-agent execution")
  .version("0.1.0");

program
  .command("init")
  .description(
    "Initialize .features/ directory and inject slash commands into IDE"
  )
  .argument(
    "<platform>",
    "Target platform: cursor, kilo, or all"
  )
  .action(async (platform: string) => {
    await initCommand(platform);
  });

program
  .command("sync")
  .description(
    "Scan specs and auto-complete features in tree.yaml when all tasks are done"
  )
  .action(async () => {
    await syncCommand();
  });

program.parse();
