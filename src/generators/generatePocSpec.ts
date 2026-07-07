import type { PocProposal } from "../domain/poc.js";
import type { GeneratedFile } from "../io/writeGeneratedFiles.js";

export function generatePocSpec(proposal: PocProposal): GeneratedFile {
  return {
    path: "poc-spec.md",
    content: `# ${proposal.title}

## 摘要

${proposal.summary}

## 功能

${proposal.features.map((item) => `- ${item}`).join("\n")}

## Skill Evidence（技能證據）

${proposal.skillEvidence.map((item) => `- ${item}`).join("\n")}

## 實作計畫

${proposal.implementationPlan.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Demo 重點

${proposal.demoTalkingPoints.map((item) => `- ${item}`).join("\n")}
`
  };
}
