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
