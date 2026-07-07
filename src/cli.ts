import { join } from "node:path";
import { runPipeline } from "./pipeline/runPipeline.js";

async function main(): Promise<void> {
  const cwd = process.cwd();
  const result = await runPipeline({
    inputDir: join(cwd, "inputs"),
    outputDir: join(cwd, "generated")
  });

  console.log("Generated POC files:");
  for (const file of result.files) {
    console.log(`- ${file}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
