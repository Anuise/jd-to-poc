import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface GeneratedFile {
  path: string;
  content: string;
}

export async function writeGeneratedFiles(outputDir: string, files: GeneratedFile[]): Promise<string[]> {
  const written: string[] = [];

  for (const file of files) {
    const fullPath = join(outputDir, file.path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, file.content, "utf8");
    written.push(fullPath.replace(/\\/g, "/"));
  }

  return written;
}
