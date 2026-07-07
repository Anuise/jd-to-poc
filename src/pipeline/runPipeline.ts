import { generatePocSpec } from "../generators/generatePocSpec.js";
import { generateProjectSkeleton } from "../generators/generateProjectSkeleton.js";
import { generateReadme } from "../generators/generateReadme.js";
import { readInputs } from "../io/readInputs.js";
import { writeGeneratedFiles } from "../io/writeGeneratedFiles.js";
import { alignCandidateProfile } from "../modules/alignCandidateProfile.js";
import { analyzeCompanyCulture } from "../modules/analyzeCompanyCulture.js";
import { analyzeJobDescription } from "../modules/analyzeJobDescription.js";
import { proposePoc } from "../modules/proposePoc.js";
import type { RunPipelineOptions, RunPipelineResult } from "./types.js";

export async function runPipeline(options: RunPipelineOptions): Promise<RunPipelineResult> {
  const inputs = await readInputs(options.inputDir);
  const company = analyzeCompanyCulture(inputs.company.content);
  const job = analyzeJobDescription(inputs.jobDescription.content);
  const alignment = alignCandidateProfile(inputs.profile.content, inputs.skills.content, job);
  const proposal = proposePoc(company, job, alignment);

  const generatedFiles = [generatePocSpec(proposal), generateReadme(proposal), ...generateProjectSkeleton(proposal)];
  const files = await writeGeneratedFiles(options.outputDir, generatedFiles);

  return { proposal, files };
}
