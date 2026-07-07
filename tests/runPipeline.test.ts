import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { runPipeline } from "../src/pipeline/runPipeline.js";

async function createInputs(root: string): Promise<string> {
  const inputDir = join(root, "inputs");
  await mkdir(inputDir, { recursive: true });
  await writeFile(join(inputDir, "company.md"), "# Company\n\n重視資料驅動與 dashboard automation。", "utf8");
  await writeFile(join(inputDir, "job-description.md"), "# JD\n\n- TypeScript\n- React\n- Testing", "utf8");
  await writeFile(join(inputDir, "profile.md"), "# Profile\n\nReact dashboard engineer", "utf8");
  await writeFile(join(inputDir, "skills.md"), "# Skills\n\nTypeScript\nReact", "utf8");
  return inputDir;
}

test("runPipeline writes generated POC files", async () => {
  const root = await mkdtemp(join(tmpdir(), "jd-to-poc-"));
  try {
    const inputDir = await createInputs(root);
    const outputDir = join(root, "generated");
    const result = await runPipeline({ inputDir, outputDir });

    assert.ok(result.files.some((file) => file.endsWith("poc-spec.md")));
    assert.ok(result.files.some((file) => file.endsWith("README.md")));
    assert.ok(result.files.some((file) => file.endsWith("project/README.md")));

    const spec = await readFile(join(outputDir, "poc-spec.md"), "utf8");
    assert.match(spec, /# .*POC/);
    assert.match(spec, /Skill Evidence/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
