import type { PocProposal } from "../domain/poc.js";
import type { GeneratedFile } from "../io/writeGeneratedFiles.js";

export function generateReadme(proposal: PocProposal): GeneratedFile {
  return {
    path: "README.md",
    content: `# ${proposal.title}

這是由 JD-to-POC base project 產生的面試展示 POC。

## POC 方向

${proposal.summary}

## Demo 方式

${proposal.demoTalkingPoints.map((item) => `- ${item}`).join("\n")}
`
  };
}
