import assert from "node:assert/strict";
import test from "node:test";
import { analyzeCompanyCulture } from "../src/modules/analyzeCompanyCulture.js";
import { analyzeJobDescription } from "../src/modules/analyzeJobDescription.js";
import { alignCandidateProfile } from "../src/modules/alignCandidateProfile.js";
import { proposePoc } from "../src/modules/proposePoc.js";

const company = "# Company\n\n重視資料驅動、快速交付與跨職能合作。產品聚焦 dashboard automation。";
const jd = "# JD\n\nResponsibilities\n- 建立 React UI\nRequired Skills\n- TypeScript\n- Testing\nPreferred Skills\n- Data visualization";
const profile = "# Profile\n\n我有 React dashboard 與 API integration 經驗。";
const skills = "# Skills\n\nTypeScript\nReact\nAPI integration";

test("analyzeCompanyCulture extracts interview signals", () => {
  const result = analyzeCompanyCulture(company);
  assert.ok(result.values.length > 0);
  assert.ok(result.productSignals.some((item) => item.includes("dashboard")));
});

test("analyzeJobDescription extracts skill signals", () => {
  const result = analyzeJobDescription(jd);
  assert.ok(result.requiredSkills.some((item) => item.includes("TypeScript")));
  assert.ok(result.evidenceToShow.length > 0);
});

test("alignCandidateProfile finds visible skills", () => {
  const job = analyzeJobDescription(jd);
  const result = alignCandidateProfile(profile, skills, job);
  assert.ok(result.visibleSkills.some((item) => item.includes("TypeScript")));
  assert.ok(result.strengths.length > 0);
});

test("proposePoc returns one focused proposal", () => {
  const proposal = proposePoc(
    analyzeCompanyCulture(company),
    analyzeJobDescription(jd),
    alignCandidateProfile(profile, skills, analyzeJobDescription(jd))
  );
  assert.match(proposal.title, /POC/);
  assert.ok(proposal.features.length >= 3);
  assert.ok(proposal.demoTalkingPoints.length > 0);
});
