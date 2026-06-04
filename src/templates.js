export const guardrails = [
  "Do not invent income, product results, or approval status.",
  "Do not use get-rich-quick framing.",
  "Do not shame the reader.",
  "Prefer concrete lessons over vague motivation.",
  "Keep the final draft reviewable by a human."
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
  const safeLesson = lesson || "先に目的と回収方法を決める";

  return [
    `${safeTopic}、やって分かったこと。`,
    "",
    `勢いだけで始めると、普通に散らかります。`,
    `${safeLesson}。`,
    "",
    "派手に勝つ前に、同じミスで負けない仕組みを作ります。"
  ].join("\n");
}

export function noteOutlineTemplate({ topic, lesson }) {
  const safeTopic = topic || "AIで生活再建を進めること";
  const safeLesson = lesson || "小さく試して、記録して、直す";

  return [
    `# ${safeTopic}で分かったこと`,
    "",
    "## 1. 最初に勘違いしていたこと",
    "",
    "## 2. 実際にやって詰まったこと",
    "",
    "## 3. そこで学んだこと",
    `- ${safeLesson}`,
    "",
    "## 4. 次に試すこと",
    "",
    "## 5. まとめ",
    "一発逆転ではなく、同じミスで負けない仕組みを作る。"
  ].join("\n");
}
