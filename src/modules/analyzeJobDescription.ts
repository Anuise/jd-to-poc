import type { JobAnalysis } from "../domain/poc.js";

function extractBullets(content: string): string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter(Boolean);
}

export function analyzeJobDescription(content: string): JobAnalysis {
  const bullets = extractBullets(content);
  const requiredSkills = bullets.filter((item) => /typescript|react|testing|api|node|資料|data/i.test(item));
  const preferredSkills = bullets.filter((item) => /preferred|加分|visualization|accessibility|analytics/i.test(item));
  const responsibilities = bullets.filter((item) => !preferredSkills.includes(item)).slice(0, 6);

  return {
    responsibilities: responsibilities.length > 0 ? responsibilities : ["將 JD 需求轉成可展示的產品功能"],
    requiredSkills: requiredSkills.length > 0 ? requiredSkills : ["TypeScript", "清楚的功能拆解"],
    preferredSkills,
    evidenceToShow: [
      "以 POC 功能直接對應 JD 職責",
      "在 README 說明技術選擇與取捨",
      "用可執行 skeleton 展示落地能力"
    ]
  };
}
