#!/usr/bin/env node
import packageJson from "../package.json" with { type: "json" };
import { dailyLogTemplate, guardrails, noteOutlineTemplate, reviewDraft, xPostTemplate } from "./templates.js";

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith("--")) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    } else {
      args._.push(token);
    }
  }
  return args;
}

function printHelp() {
  console.log([
    "AI Rebuild Log Kit",
    "",
    "Usage:",
    "  node src/cli.js demo",
    "  node src/cli.js guardrails",
    "  node src/cli.js log",
    "  node src/cli.js post --topic \"...\" --lesson \"...\"",
    "  node src/cli.js note --topic \"...\" --lesson \"...\"",
    "  node src/cli.js review --text \"...\"",
    "  node src/cli.js version",
    "",
    "This tool generates drafts only. Review before publishing."
  ].join("\n"));
}

function printReview(result) {
  console.log(`Status: ${result.status}`);
  console.log(`Summary: ${result.summary}`);
  console.log("");

  for (const check of result.checks) {
    console.log(`[${check.status}] ${check.label}`);
    if (check.status === "WARN") {
      console.log(`  - ${check.advice}`);
    }
  }
}

function run() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0] || "help";

  if (command === "help" || args.help) {
    printHelp();
    return;
  }

  if (command === "version" || args.version) {
    console.log(packageJson.version);
    return;
  }

  if (command === "demo") {
    console.log("## X Post Draft\n");
    console.log(xPostTemplate({
      topic: "AIへの課金",
      lesson: "何を減らすかより、どこで成果が出るかまで決める"
    }));
    console.log("\n## Guardrails\n");
    console.log(guardrails.map((item) => `- ${item}`).join("\n"));
    return;
  }

  if (command === "guardrails") {
    console.log(guardrails.map((item) => `- ${item}`).join("\n"));
    return;
  }

  if (command === "review") {
    const result = reviewDraft(args.text);
    printReview(result);

    if (result.status === "ERROR") {
      process.exitCode = 1;
    }

    return;
  }

  if (command === "log") {
    console.log(dailyLogTemplate());
    return;
  }

  if (command === "post") {
    console.log(xPostTemplate({ topic: args.topic, lesson: args.lesson }));
    return;
  }

  if (command === "note") {
    console.log(noteOutlineTemplate({ topic: args.topic, lesson: args.lesson }));
    return;
  }

  console.error(`Unknown command: ${command}`);
  printHelp();
  process.exitCode = 1;
}

run();
