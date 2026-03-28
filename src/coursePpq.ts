import type { TopicData } from "./types";

/** Per-course PPQ confidence (0–100) for the Topics tab — one value per course, not per topic. */
export type CoursePpqMap = Record<string, number>;

export function emptyCoursePpq(): CoursePpqMap {
  return {};
}

/** Drop legacy per-topic `ppq` from stored topic rows. */
export function normalizeTopicData(raw: Record<string, TopicData & { ppq?: number }>): Record<string, TopicData> {
  const out: Record<string, TopicData> = {};
  for (const [k, v] of Object.entries(raw)) {
    if (!v || typeof v !== "object") continue;
    out[k] = {
      theory: typeof v.theory === "number" && Number.isFinite(v.theory) ? v.theory : 0,
      notes: typeof v.notes === "string" ? v.notes : undefined,
      links: Array.isArray(v.links) ? v.links : undefined,
    };
  }
  return out;
}

/**
 * Legacy: PPQ used to be stored on each topic row. Average those values per course into a single course PPQ.
 */
export function migratePerTopicPpqToCourse(
  topics: Record<string, TopicData & { ppq?: number }>,
  validCourseIds: Set<string>
): CoursePpqMap {
  const acc: Record<string, number[]> = {};
  for (const cid of validCourseIds) acc[cid] = [];

  for (const [key, td] of Object.entries(topics)) {
    const m = /^(.+)_(\d+)$/.exec(key);
    if (!m) continue;
    const cid = m[1];
    if (!validCourseIds.has(cid)) continue;
    const ppq = td.ppq;
    if (typeof ppq === "number" && Number.isFinite(ppq)) {
      acc[cid].push(ppq);
    }
  }

  const out: CoursePpqMap = {};
  for (const cid of validCourseIds) {
    const arr = acc[cid];
    if (arr.length) {
      out[cid] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
    }
  }
  return out;
}

export function parseCoursePpqFromBlob(parsed: unknown, validCourseIds: Set<string>): CoursePpqMap | null {
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return null;
  const p = parsed as { coursePpq?: unknown };
  if (p.coursePpq == null || typeof p.coursePpq !== "object" || Array.isArray(p.coursePpq)) return null;
  const out: CoursePpqMap = {};
  for (const [id, v] of Object.entries(p.coursePpq)) {
    if (!validCourseIds.has(id)) continue;
    if (typeof v === "number" && Number.isFinite(v)) {
      out[id] = Math.max(0, Math.min(100, Math.round(v)));
    }
  }
  return out;
}
