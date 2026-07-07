import type { PocProposal } from "../domain/poc.js";

export interface RunPipelineOptions {
  inputDir: string;
  outputDir: string;
}

export interface RunPipelineResult {
  proposal: PocProposal;
  files: string[];
}
