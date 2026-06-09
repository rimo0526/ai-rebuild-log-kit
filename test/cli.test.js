import test from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function runCli(...args) {
  return execFileAsync(process.execPath, ["src/cli.js", ...args], {
    cwd: new URL("..", import.meta.url)
  });
}

test("help output documents the guardrails command", async () => {
  const { stdout } = await runCli("help");

  assert.match(stdout, /node src\/cli\.js guardrails/);
  assert.match(stdout, /node src\/cli\.js review --text/);
  assert.match(stdout, /node src\/cli\.js review --text "..." --json/);
  assert.match(stdout, /node src\/cli\.js version/);
  assert.match(stdout, /Review before publishing/);
});

test("guardrails command prints every guardrail", async () => {
  const { stdout } = await runCli("guardrails");

  assert.match(stdout, /Do not invent income, product results, or approval status\./);
  assert.match(stdout, /Do not use get-rich-quick framing\./);
  assert.match(stdout, /Keep the final draft reviewable by a human\./);
});

test("version command prints the package version", async () => {
  const { stdout } = await runCli("version");

  assert.equal(stdout.trim(), "0.1.0");
});

test("review command warns on obvious risky draft text", async () => {
  const { stdout } = await runCli("review", "--text", "This earned instant passive income.");

  assert.match(stdout, /Status: WARN/);
  assert.match(stdout, /Avoid invented income or results claims/);
  assert.match(stdout, /Avoid get-rich-quick framing/);
});

test("review command can print structured json", async () => {
  const { stdout } = await runCli("review", "--text", "I wrote down one spending lesson.", "--json");
  const review = JSON.parse(stdout);

  assert.equal(review.status, "PASS");
  assert.equal(review.summary, "No obvious guardrail issues found.");
  assert.equal(Array.isArray(review.checks), true);
});

test("review command fails cleanly when text is missing", async () => {
  await assert.rejects(
    runCli("review"),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stdout, /Status: ERROR/);
      assert.match(error.stdout, /No draft text provided\./);
      return true;
    }
  );
});

test("review json mode still exits non-zero on missing text", async () => {
  await assert.rejects(
    runCli("review", "--json"),
    (error) => {
      assert.equal(error.code, 1);
      const review = JSON.parse(error.stdout);
      assert.equal(review.status, "ERROR");
      assert.equal(review.summary, "No draft text provided.");
      return true;
    }
  );
});
