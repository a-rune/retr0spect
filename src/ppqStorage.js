/** @typedef {{ id: string; at: string; durationSec: number | null; notes: string; marks: string }} PpqAttempt */

export function paperStorageKey(courseId, year, paper) {
  return `${courseId}|${year}|${paper}`;
}

export function newAttemptId() {
  return typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `a-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * @returns {{ paperNotes: Record<string, string>; questions: Record<string, { attempts: PpqAttempt[] }> }}
 */
export function emptyPpqData() {
  return { paperNotes: {}, questions: {} };
}

/**
 * Load from persisted blob (supports legacy ppqDone booleans).
 */
export function ppqDataFromParsed(parsed) {
  if (parsed?.ppqData?.questions && typeof parsed.ppqData.questions === "object") {
    return {
      paperNotes: typeof parsed.ppqData.paperNotes === "object" && parsed.ppqData.paperNotes ? { ...parsed.ppqData.paperNotes } : {},
      questions: { ...parsed.ppqData.questions },
    };
  }
  if (parsed?.ppqDone && typeof parsed.ppqDone === "object") {
    const questions = {};
    for (const [k, v] of Object.entries(parsed.ppqDone)) {
      if (v) {
        questions[k] = {
          attempts: [
            {
              id: newAttemptId(),
              at: new Date().toISOString(),
              durationSec: null,
              notes: "",
              marks: "",
            },
          ],
        };
      }
    }
    return { paperNotes: {}, questions };
  }
  return emptyPpqData();
}
