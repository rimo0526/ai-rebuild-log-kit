import test from "node:test";
import assert from "node:assert/strict";
import { dailyLogTemplate, guardrails, noteOutlineTemplate, reviewDraft, xPostTemplate } from "../src/templates.js";

test("xPostTemplate includes topic, lesson, and human tone", () => {
  const draft = xPostTemplate({
    topic: "AIに課金しすぎた話",
    lesson: "使う前に用途を決める"
  });

  assert.match(draft, /AIに課金しすぎた話/);
  assert.match(draft, /使う前に用途を決める/);
  assert.match(draft, /まずは小さく続けられる形に戻します/);
});

test("dailyLogTemplate provides rebuilding fields", () => {
  const template = dailyLogTemplate();

  assert.match(template, /What I tried/);
  assert.match(template, /Money or time impact/);
  assert.match(template, /Draft Angle/);
});

test("noteOutlineTemplate produces a reusable outline", () => {
  const outline = noteOutlineTemplate({
    topic: "家計を立て直す過程",
    lesson: "記録を残すと次の判断が軽くなる"
  });

  assert.match(outline, /家計を立て直す過程/);
  assert.match(outline, /記録を残すと次の判断が軽くなる/);
  assert.match(outline, /次に試すこと/);
});

test("guardrails discourage unsafe growth claims", () => {
  assert.ok(guardrails.some((item) => item.includes("Do not invent income")));
  assert.ok(guardrails.some((item) => item.includes("get-rich-quick")));
});

test("reviewDraft flags obvious risky claims", () => {
  const review = reviewDraft("I earned instant passive income after one post.");

  assert.equal(review.status, "WARN");
  assert.match(review.summary, /warning/);
  assert.ok(review.warnings.some((warning) => warning.id === "income-claims"));
  assert.ok(review.warnings.some((warning) => warning.id === "get-rich-quick"));
});

test("reviewDraft passes a concrete non-hyped draft", () => {
  const review = reviewDraft("I wrote down one spending lesson and kept the claim small.");

  assert.equal(review.status, "PASS");
  assert.equal(review.warnings.length, 0);
});
