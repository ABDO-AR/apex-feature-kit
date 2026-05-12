import { z } from "zod";

export const FeatureEntrySchema = z.object({
  id: z.string(),
  file: z.string(),
  title: z.string(),
  created_at: z.string(),
  completed_at: z.string().nullable(),
});

export const TreeDataSchema = z.object({
  features: z.array(FeatureEntrySchema),
});

export const TaskCountsSchema = z.object({
  total: z.number(),
  completed: z.number(),
  unchecked: z.number(),
});

export const SyncResultSchema = z.object({
  added: z.number(),
  updated: z.number(),
  completed: z.number(),
  stale: z.array(z.string()),
});

export type FeatureEntry = z.infer<typeof FeatureEntrySchema>;
export type TreeData = z.infer<typeof TreeDataSchema>;
export type TaskCounts = z.infer<typeof TaskCountsSchema>;
export type SyncResult = z.infer<typeof SyncResultSchema>;

export const PlatformSchema = z.enum(["cursor", "kilo", "all"]);
export type Platform = z.infer<typeof PlatformSchema>;
