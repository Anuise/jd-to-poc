import type { PocProposal } from "../domain/poc.js";
import type { GeneratedFile } from "../io/writeGeneratedFiles.js";

export function generateProjectSkeleton(proposal: PocProposal): GeneratedFile[] {
  return [
    {
      path: "project/README.md",
      content: `# ${proposal.title} Skeleton

## 目的

${proposal.summary}

## 第一批要建立的檔案

${proposal.features.map((feature) => `- ${feature}`).join("\n")}
`
    },
    {
      path: "project/src/main.ts",
      content: `export function describePoc(): string {
  return ${JSON.stringify(proposal.title)};
}
`
    }
  ];
}
