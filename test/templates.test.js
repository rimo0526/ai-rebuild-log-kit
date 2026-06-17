import test from "node:test";
import assert from "node:assert/strict";
import { dailyLogTemplate, guardrails, noteOutlineTemplate, reviewDraft, xPostTemplate } from "../src/templates.js";

test("xPostTemplate includes topic, lesson, and human tone", () => {
  const draft = xPostTemplate({
    topic: "AIとの節約メモづくりで見えた失敗",
    lesson: "使い回す前に検証手順を整える"
  });

  assert.match(draft, /AIとの節約メモづくりで見えた失敗/);
  assert.match(draft, /使い回す前に検証手順を整える/);
  assert.match(draft, /大きな話より先に、まずは今日の小さな改善をログに残します。/);
});

test("xPostTemplate fallback copy stays readable in Japanese", () => {
  const draft = xPostTemplate({});

  assert.match(draft, /AIで生活を立て直そうとして失敗したことについて書いてみて思ったこと。/);
  assert.match(draft, /使い回しより運用と検証の手順を整える。/);
});

test("dailyLogTemplate provides rebuilding fields", () => {
  const template = dailyLogTemplate();

  assert.match(template, /What I tried/);
  assert.match(template, /Money or time impact/);
  assert.match(template, /Draft Angle/);
});

test("noteOutlineTemplate produces a reusable outline", () => {
  const outline = noteOutlineTemplate({
    topic: "再建メモを続けて分かったこと",
    lesson: "試して、記録して、次に活かす"
  });

  assert.match(outline, /再建メモを続けて分かったこと/);
  assert.match(outline, /試して、記録して、次に活かす/);
  assert.match(outline, /## 4\./);
});

test("noteOutlineTemplate fallback copy stays readable in Japanese", () => {
  const outline = noteOutlineTemplate({});

  assert.match(outline, /AIで生活を立て直そうとして気づいたことで分かったこと/);
  assert.match(outline, /試して、記録して、次に活かす/);
});

test("guardrails discourage unsafe growth claims", () => {
  assert.ok(guardrails.some((item) => item.includes("Do not invent income")));
  assert.ok(guardrails.some((item) => item.includes("Do not invent virality")));
  assert.ok(guardrails.some((item) => item.includes("get-rich-quick")));
});

test("reviewDraft flags obvious risky claims", () => {
  const review = reviewDraft("I earned instant passive income after one post.");

  assert.equal(review.status, "WARN");
  assert.match(review.summary, /warning/);
  assert.ok(review.warnings.some((warning) => warning.id === "income-claims"));
  assert.ok(review.warnings.some((warning) => warning.id === "get-rich-quick"));
});

test("reviewDraft flags invented virality claims", () => {
  const review = reviewDraft("This note went viral and gained 10,000 followers overnight.");

  assert.equal(review.status, "WARN");
  assert.ok(review.warnings.some((warning) => warning.id === "virality-claims"));
  assert.ok(review.warnings.some((warning) => warning.id === "get-rich-quick"));
});

test("reviewDraft passes a concrete non-hyped draft", () => {
  const review = reviewDraft("I wrote down one spending lesson and kept the claim small.");

  assert.equal(review.status, "PASS");
  assert.equal(review.warnings.length, 0);
});
