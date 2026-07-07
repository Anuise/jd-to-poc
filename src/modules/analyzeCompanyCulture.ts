import type { CompanyAnalysis } from "../domain/poc.js";

function pickLines(content: string, keywords: string[]): string[] {
  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .filter((line) => keywords.some((keyword) => line.toLowerCase().includes(keyword.toLowerCase())))
    .slice(0, 5);
}

export function analyzeCompanyCulture(content: string): CompanyAnalysis {
  const values = pickLines(content, ["重視", "value", "culture", "合作", "溝通", "交付"]);
  const productSignals = pickLines(content, ["產品", "dashboard", "workflow", "automation", "AI", "使用者"]);
  const interviewSignals = [...values, ...productSignals].slice(0, 6);

  return {
    values: values.length > 0 ? values : ["強調清楚溝通與可交付成果"],
    productSignals: productSignals.length > 0 ? productSignals : ["需要從公司資料整理產品展示方向"],
    interviewSignals: interviewSignals.length > 0 ? interviewSignals : ["POC 應展示和公司目標的連結"]
  };
}
