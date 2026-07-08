import type { CandidateAlignment, CompanyAnalysis, JobAnalysis, PocProposal } from "../domain/poc.js";

export function proposePoc(
  company: CompanyAnalysis,
  job: JobAnalysis,
  alignment: CandidateAlignment
): PocProposal {
  const primarySkill = alignment.visibleSkills[0] ?? job.requiredSkills[0] ?? "TypeScript";

  return {
    title: `${primarySkill} Interview POC`,
    summary: `建立一個聚焦的 POC，展示 ${primarySkill}，並連結公司訊號：${company.productSignals[0]}.`,
    features: [
      "輸入公司與 JD 資訊後產出展示重點",
      "用清楚 README 說明功能、技術選擇與取捨",
      "提供最小可執行 skeleton 讓面試官能快速理解方向"
    ],
    skillEvidence: alignment.visibleSkills.map((skill) => `${skill}: 透過 POC 功能與文件明確展示`),
    implementationPlan: [
      "整理 POC scope 與核心 user flow",
      "建立最小 skeleton 與 README",
      "補上 demo talking points 與可延伸方向"
    ],
    demoTalkingPoints: [
      `此 POC 如何呼應公司重視的訊號：${company.interviewSignals[0]}`,
      `此 POC 如何展示 JD 需求：${job.evidenceToShow[0]}`,
      "此 POC 如何避開過度設計並保留擴充空間"
    ]
  };
}
