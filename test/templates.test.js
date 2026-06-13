import test from "node:test";
import assert from "node:assert/strict";
import { dailyLogTemplate, guardrails, noteOutlineTemplate, reviewDraft, xPostTemplate } from "../src/templates.js";

test("xPostTemplate includes topic, lesson, and human tone", () => {
  const draft = xPostTemplate({
    topic: "AIとの振り返りで見えた詰まり",
    lesson: "使う前に記録する項目を決める"
  });

  assert.match(draft, /AIとの振り返りで見えた詰まり/);
  assert.match(draft, /使う前に記録する項目を決める/);
  assert.match(draft, /まずは今日の小さな変化をログに残します/);
});

test("xPostTemplate fallback copy stays readable in Japanese", () => {
  const draft = xPostTemplate({});

  assert.match(draft, /AIで生活を立て直そうとして気づいたこと/);
  assert.match(draft, /使う前に用途と記録方法を決める/);
});

test("dailyLogTemplate provides rebuilding fields", () => {
  const template = dailyLogTemplate();

  assert.match(template, /What I tried/);
  assert.match(template, /Money or time impact/);
  assert.match(template, /Draft Angle/);
});

test("noteOutlineTemplate produces a reusable outline", () => {
  const outline = noteOutlineTemplate({
    topic: "家計の立て直しで試したこと",
    lesson: "試した順番を残すと次の判断が楽になる"
  });

  assert.match(outline, /家計の立て直しで試したこと/);
  assert.match(outline, /試した順番を残すと次の判断が楽になる/);
  assert.match(outline, /## 4. 次に試すこと/);
});

test("noteOutlineTemplate fallback copy stays readable in Japanese", () => {
  const outline = noteOutlineTemplate({});

  assert.match(outline, /AIで生活を立て直すときに考えたこと/);
  assert.match(outline, /試して、記録して、次に活かす/);
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
