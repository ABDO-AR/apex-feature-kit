import { type TaskCounts } from "./schema.js";

const CHECKBOX_REGEX = /- \[([ xX])\]/g;

export function parseTaskCounts(content: string): TaskCounts {
  let total = 0;
  let completed = 0;

  const matches = content.matchAll(CHECKBOX_REGEX);
  for (const match of matches) {
    total++;
    if (match[1] === "x" || match[1] === "X") {
      completed++;
    }
  }

  return {
    total,
    completed,
    unchecked: total - completed,
  };
}

export function isCompleted(content: string): boolean {
  const counts = parseTaskCounts(content);
  return counts.total > 0 && counts.unchecked === 0;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateFilename(name: string): string {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const timestamp = [
    now.getFullYear().toString(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
    pad(now.getHours()),
    pad(now.getMinutes()),
  ].join("");

  const slug = generateSlug(name);
  return `${timestamp}-${slug}.md`;
}

export function generateId(): string {
  return Date.now().toString(36);
}
