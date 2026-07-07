import type { JobAnalysis } from "../domain/poc.js";

type SectionName = "responsibilities" | "requiredSkills" | "preferredSkills";

const sectionPatterns: Array<[SectionName, RegExp]> = [
  ["responsibilities", /^(?:#{1,6}\s*)?responsibilities\s*$/i],
  ["requiredSkills", /^(?:#{1,6}\s*)?required skills\s*$/i],
  ["preferredSkills", /^(?:#{1,6}\s*)?preferred skills\s*$/i]
];

function detectSection(line: string): SectionName | null {
  for (const [section, pattern] of sectionPatterns) {
    if (pattern.test(line)) return section;
  }
  return null;
}

function extractSections(content: string): Record<SectionName, string[]> {
  const sections: Record<SectionName, string[]> = {
    responsibilities: [],
    requiredSkills: [],
    preferredSkills: []
  };
  let currentSection: SectionName | null = null;

  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim();
    const nextSection = detectSection(line);
    if (nextSection) {
      currentSection = nextSection;
      continue;
    }

    if (currentSection && line.startsWith("- ")) {
      const item = line.slice(2).trim();
      if (item) sections[currentSection].push(item);
    }
  }

  return sections;
}

export function analyzeJobDescription(content: string): JobAnalysis {
  const sections = extractSections(content);
  const responsibilities = sections.responsibilities.slice(0, 6);
  const requiredSkills = sections.requiredSkills;
  const preferredSkills = sections.preferredSkills;

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
