/** Question PDFs on the department site (same pattern as tripospro ingest). */
export function pastPaperPdfUrl(pdfFilename) {
  const f = (pdfFilename || "").trim();
  if (!f) return "";
  return `https://www.cl.cam.ac.uk/teaching/exams/pastpapers/${encodeURIComponent(f)}`;
}

export function normalizeSolutionUrl(url) {
  return (url || "").trim().replace(/\r$/, "");
}

/** Stable id across sessions (matches tripos row identity). */
export function stableQuestionKey(q) {
  return `${q.year}|${q.paper}|${q.question}|${q.topic}`;
}

export const TRIPOS_QUESTIONS_URL =
  "https://raw.githubusercontent.com/olifog/tripospro/main/questions.json";

export function formatDuration(sec) {
  if (sec == null || Number.isNaN(sec) || sec < 0) return "—";
  const s = Math.floor(sec);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
