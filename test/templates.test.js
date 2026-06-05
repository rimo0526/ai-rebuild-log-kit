import test from "node:test";
import assert from "node:assert/strict";
import { dailyLogTemplate, guardrails, noteOutlineTemplate, xPostTemplate } from "../src/templates.js";

test("xPostTemplate includes topic, lesson, and human tone", () => {
  const draft = xPostTemplate({
    topic: "AIに課金して",
    lesson: "先に用途を決める"
  });

  assert.match(draft, /AIに課金して/);
  assert.match(draft, /先に用途を決める/);
  assert.match(draft, /小さく続けられる仕組み/);
});

test("dailyLogTemplate provides rebuilding fields", () => {
  const template = dailyLogTemplate();

  assert.match(template, /What I tried/);
  assert.match(template, /Money or time impact/);
  assert.match(template, /Draft Angle/);
});

test("noteOutlineTemplate produces a reusable outline", () => {
  const outline = noteOutlineTemplate({
    topic: "家計の見直し",
    lesson: "固定費から見る"
  });

  assert.match(outline, /家計の見直し/);
  assert.match(outline, /固定費から見る/);
  assert.match(outline, /次に試すこと/);
});

test("guardrails discourage unsafe growth claims", () => {
  assert.ok(guardrails.some((item) => item.includes("Do not invent income")));
  assert.ok(guardrails.some((item) => item.includes("get-rich-quick")));
});
