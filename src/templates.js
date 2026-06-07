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
  const safeTopic = topic || "AIで生活を立て直すこと";
  const safeLesson = lesson || "先に用途と成果物を決める";

  return [
    `${safeTopic}について書いてみて分かったこと。`,
    "",
    "勢いだけで決めると、後から苦しくなります。",
    `${safeLesson}。`,
    "",
    "派手な話より先に、まずは小さく続けられる仕組みを作ります。"
  ].join("\n");
}

export function noteOutlineTemplate({ topic, lesson }) {
  const safeTopic = topic || "AIで生活再建を進めること";
  const safeLesson = lesson || "試して、記録して、判断する";

  return [
    `# ${safeTopic}で分かったこと`,
    "",
    "## 1. 最初に困っていたこと",
    "",
    "## 2. 実際にやって変わったこと",
    "",
    "## 3. そこで学んだこと",
    `- ${safeLesson}`,
    "",
    "## 4. 次に試すこと",
    "",
    "## 5. まとめ",
    "一発逆転ではなく、続けられる仕組みとして整理する。"
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
