import type { CandidateAlignment, JobAnalysis } from "../domain/poc.js";

export function alignCandidateProfile(profile: string, skills: string, job: JobAnalysis): CandidateAlignment {
  const combined = `${profile}\n${skills}`.toLowerCase();
  const visibleSkills = job.requiredSkills.filter((skill) => combined.includes(skill.toLowerCase()));
  const gaps = job.requiredSkills.filter((skill) => !combined.includes(skill.toLowerCase()));

  return {
    strengths: visibleSkills.length > 0 ? visibleSkills.map((skill) => `可展示 ${skill} 相關經驗`) : ["可展示需求拆解與快速驗證能力"],
    gaps: gaps.map((skill) => `避免過度宣稱 ${skill}，改以學習計畫或 POC 補強呈現`),
    visibleSkills: visibleSkills.length > 0 ? visibleSkills : ["需求分析", "文件化", "POC 規劃"]
  };
}
