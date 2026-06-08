export const guardrails = [
  "Do not invent income, product results, or approval status.",
  "Do not use get-rich-quick framing.",
  "Do not shame the reader.",
  "Prefer concrete lessons over vague motivation.",
  "Keep the final draft reviewable by a human."
];

const reviewChecks = [
  {
    id: "income-claims",
    label: "Avoid invented income or results claims",
    pattern: /\b(earned|income|profit|revenue|sales|results?)\b/i,
    advice: "Remove or verify any claim about money, sales, or outcomes."
  },
  {
    id: "approval-claims",
    label: "Avoid invented approval or endorsement claims",
    pattern: /\b(approved|approval|endorsed|certified|officially accepted)\b/i,
    advice: "Do not imply approval unless you can verify it."
  },
  {
    id: "get-rich-quick",
    label: "Avoid get-rich-quick framing",
    pattern: /\b(get rich|overnight|instant|effortless|passive income|guaranteed)\b/i,
    advice: "Replace hype with a concrete, reviewable lesson."
  },
  {
    id: "shame-language",
    label: "Avoid shame-based advice",
    pattern: /\b(lazy|pathetic|stupid|loser|shame on you)\b/i,
    advice: "Keep the tone direct without attacking the reader."
  }
];

export function dailyLogTemplate() {
  return [
    "# Daily Rebuild Log",
    "",
    "## Today",
    "- What I tried:",
    "- What worked:",
    "- What failed:",
    "- Money or time impact:",
    "",
    "## Lesson",
    "- What I should repeat:",
    "- What I should avoid next time:",
    "",
    "## Draft Angle",
    "- Hook:",
    "- Useful point:",
    "- Honest ending:"
  ].join("\n");
}

export function xPostTemplate({ topic, lesson }) {
  const safeTopic = topic || "AIで生活を立て直そうとして思うこと";
  const safeLesson = lesson || "使う前に用途と検証方法を決める";

  return [
    `${safeTopic}について書いてみて思ったこと。`,
    "",
    "勢いだけで増やすと、あとから苦しくなります。",
    `${safeLesson}。`,
    "",
    "派手な話より先に、まずは小さく続けられる形に戻します。"
  ].join("\n");
}

export function noteOutlineTemplate({ topic, lesson }) {
  const safeTopic = topic || "AIで生活再建を進めること";
  const safeLesson = lesson || "試して、記録して、次に活かす";

  return [
    `# ${safeTopic}で分かったこと`,
    "",
    "## 1. 最初に困っていたこと",
    "",
    "## 2. 実際にやってみて変わったこと",
    "",
    "## 3. そこで学んだこと",
    `- ${safeLesson}`,
    "",
    "## 4. 次に試すこと",
    "",
    "## 5. まとめ",
    "一度に解決せず、続けられる形に戻す視点で整理する。"
  ].join("\n");
}

export function reviewDraft(text) {
  const normalizedText = (text || "").trim();

  if (!normalizedText) {
    return {
      status: "ERROR",
      summary: "No draft text provided.",
      warnings: [],
      checks: reviewChecks.map(({ id, label, advice }) => ({
        id,
        label,
        status: "SKIP",
        advice
      }))
    };
  }

  const checks = reviewChecks.map(({ id, label, pattern, advice }) => ({
    id,
    label,
    status: pattern.test(normalizedText) ? "WARN" : "PASS",
    advice
  }));
  const warnings = checks.filter((check) => check.status === "WARN");

  return {
    status: warnings.length > 0 ? "WARN" : "PASS",
    summary: warnings.length > 0
      ? `${warnings.length} review warning(s) found.`
      : "No obvious guardrail issues found.",
    warnings,
    checks
  };
}
