import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { readInputs } from "../src/io/readInputs.js";

async function createTempInputs(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "jd-to-poc-"));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "company.md"), "# Company\n\nCulture notes", "utf8");
  await writeFile(join(dir, "job-description.md"), "# JD\n\nTypeScript role", "utf8");
  await writeFile(join(dir, "profile.md"), "# Profile\n\nFrontend engineer", "utf8");
  await writeFile(join(dir, "skills.md"), "# Skills\n\nTypeScript\nReact", "utf8");
  return dir;
}

test("readInputs reads all required markdown files", async () => {
  const dir = await createTempInputs();
  try {
    const inputs = await readInputs(dir);
    assert.equal(inputs.company.path, join(dir, "company.md"));
    assert.match(inputs.jobDescription.content, /TypeScript role/);
    assert.match(inputs.profile.content, /Frontend engineer/);
    assert.match(inputs.skills.content, /React/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("readInputs rejects missing required files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "jd-to-poc-"));
  try {
    await assert.rejects(
      () => readInputs(dir),
      /Missing required input file: .*company\.md/
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("readInputs rejects empty input files", async () => {
  const dir = await createTempInputs();
  try {
    await writeFile(join(dir, "skills.md"), "   \n", "utf8");
    await assert.rejects(
      () => readInputs(dir),
      /Input file is empty: .*skills\.md/
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
