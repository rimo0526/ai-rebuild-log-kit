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
