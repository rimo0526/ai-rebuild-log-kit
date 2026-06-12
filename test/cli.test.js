import test from "node:test";
import assert from "node:assert/strict";
import { execFile, spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

async function runCli(args, options = {}) {
  const { input, ...execOptions } = options;

  if (typeof input === "string") {
    return new Promise((resolve, reject) => {
      const child = spawn(process.execPath, ["src/cli.js", ...args], {
        ...execOptions,
        cwd: new URL("..", import.meta.url),
        stdio: ["pipe", "pipe", "pipe"]
      });

      let stdout = "";
      let stderr = "";

      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });

      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });

      child.on("error", reject);
      child.on("close", (code) => {
        if (code === 0) {
          resolve({ stdout, stderr });
          return;
        }

        const error = new Error(`Command failed: ${args.join(" ")}`);
        error.code = code;
        error.stdout = stdout;
        error.stderr = stderr;
        reject(error);
      });

      child.stdin.end(input);
    });
  }

  return execFileAsync(process.execPath, ["src/cli.js", ...args], {
    ...execOptions,
    cwd: new URL("..", import.meta.url)
  });
}

test("help output documents the guardrails command", async () => {
  const { stdout } = await runCli(["help"]);

  assert.match(stdout, /node src\/cli\.js guardrails/);
  assert.match(stdout, /node src\/cli\.js review --text/);
  assert.match(stdout, /node src\/cli\.js review --file \.\/draft\.txt/);
  assert.match(stdout, /node src\/cli\.js review --stdin/);
  assert.match(stdout, /node src\/cli\.js review --text "..." --strict/);
  assert.match(stdout, /node src\/cli\.js review --text "..." --json/);
  assert.match(stdout, /node src\/cli\.js version/);
  assert.match(stdout, /Review before publishing/);
});

test("guardrails command prints every guardrail", async () => {
  const { stdout } = await runCli(["guardrails"]);

  assert.match(stdout, /Do not invent income, product results, or approval status\./);
  assert.match(stdout, /Do not use get-rich-quick framing\./);
  assert.match(stdout, /Keep the final draft reviewable by a human\./);
});

test("version command prints the package version", async () => {
  const { stdout } = await runCli(["version"]);

  assert.equal(stdout.trim(), "0.1.0");
});

test("review command warns on obvious risky draft text", async () => {
  const { stdout } = await runCli(["review", "--text", "This earned instant passive income."]);

  assert.match(stdout, /Status: WARN/);
  assert.match(stdout, /Avoid invented income or results claims/);
  assert.match(stdout, /Avoid get-rich-quick framing/);
});

test("review command can print structured json", async () => {
  const { stdout } = await runCli(["review", "--text", "I wrote down one spending lesson.", "--json"]);
  const review = JSON.parse(stdout);

  assert.equal(review.status, "PASS");
  assert.equal(review.summary, "No obvious guardrail issues found.");
  assert.equal(Array.isArray(review.checks), true);
});

test("review strict mode exits non-zero on warnings", async () => {
  await assert.rejects(
    runCli(["review", "--text", "This earned instant passive income.", "--strict"]),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stdout, /Status: WARN/);
      assert.match(error.stdout, /Avoid get-rich-quick framing/);
      return true;
    }
  );
});

test("review strict json mode exits non-zero on warnings", async () => {
  await assert.rejects(
    runCli(["review", "--text", "This earned instant passive income.", "--strict", "--json"]),
    (error) => {
      assert.equal(error.code, 1);
      const review = JSON.parse(error.stdout);
      assert.equal(review.status, "WARN");
      assert.equal(review.summary, "2 review warning(s) found.");
      return true;
    }
  );
});

test("review command can read a draft from file", async () => {
  const tempDir = await mkdtemp(join(tmpdir(), "ai-rebuild-log-kit-"));
  const draftPath = join(tempDir, "draft.txt");
  await writeFile(draftPath, "\uFEFFThis earned instant passive income.", "utf8");

  const { stdout } = await runCli(["review", "--file", draftPath]);

  assert.match(stdout, /Status: WARN/);
  assert.match(stdout, /Avoid invented income or results claims/);
  assert.match(stdout, /Avoid get-rich-quick framing/);
});

test("review command can read a draft from stdin", async () => {
  const { stdout } = await runCli(["review", "--stdin"], {
    input: "This earned instant passive income."
  });

  assert.match(stdout, /Status: WARN/);
  assert.match(stdout, /Avoid invented income or results claims/);
  assert.match(stdout, /Avoid get-rich-quick framing/);
});

test("review command fails cleanly when text is missing", async () => {
  await assert.rejects(
    runCli(["review"]),
    (error) => {
      assert.equal(error.code, 1);
      assert.match(error.stdout, /Status: ERROR/);
      assert.match(error.stdout, /No draft text provided\./);
      return true;
    }
  );
});

test("review command reports file read errors in json mode", async () => {
  await assert.rejects(
    runCli(["review", "--file", "missing-draft.txt", "--json"]),
    (error) => {
      assert.equal(error.code, 1);
      const review = JSON.parse(error.stdout);
      assert.equal(review.status, "ERROR");
      assert.equal(review.summary, "Could not read file: missing-draft.txt");
      return true;
    }
  );
});

test("review json mode still exits non-zero on missing text", async () => {
  await assert.rejects(
    runCli(["review", "--json"]),
    (error) => {
      assert.equal(error.code, 1);
      const review = JSON.parse(error.stdout);
      assert.equal(review.status, "ERROR");
      assert.equal(review.summary, "No draft text provided.");
      return true;
    }
  );
});
