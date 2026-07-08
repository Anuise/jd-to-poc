import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  type InputDocument,
  type InputDocuments,
  type RequiredInputFile,
  requiredInputFiles
} from "../domain/inputDocuments.js";

function inputDocumentKey(file: RequiredInputFile): keyof InputDocuments {
  if (file === "company.md") return "company";
  if (file === "job-description.md") return "jobDescription";
  if (file === "profile.md") return "profile";
  return "skills";
}

async function readRequiredFile(inputDir: string, file: RequiredInputFile): Promise<InputDocument> {
  const path = join(inputDir, file);

  try {
    await access(path);
  } catch {
    throw new Error(`Missing required input file: ${path}`);
  }

  const content = await readFile(path, "utf8");
  if (content.trim().length === 0) {
    throw new Error(`Input file is empty: ${path}`);
  }

  return { name: file, path, content };
}

export async function readInputs(inputDir: string): Promise<InputDocuments> {
  const entries = await Promise.all(
    requiredInputFiles.map(async (file) => [inputDocumentKey(file), await readRequiredFile(inputDir, file)] as const)
  );

  return Object.fromEntries(entries) as unknown as InputDocuments;
}
