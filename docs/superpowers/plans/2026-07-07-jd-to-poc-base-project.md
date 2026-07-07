# JD to POC Base Project Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立一個可複製使用的 CLI 型 JD-to-POC base project，能從公司文化、JD、個人資料與技能輸入產出 POC 規格、README 與 starter skeleton。

**Architecture:** 採用 TypeScript + Node.js CLI。`src/io` 負責檔案讀寫，`src/domain` 定義共享 types，`src/modules` 執行分析，`src/generators` 寫出 artifacts，`src/pipeline` 串接整體流程。

**Tech Stack:** Node.js 20+、TypeScript、Node built-in test runner、Markdown input/output。

## Global Constraints

- 所有對使用者可見的專案文件以繁體中文撰寫，技術識別字、檔名、指令與 type names 維持英文。
- 第一版不加入外部服務與 LLM provider integration。
- 第一版只支援 Markdown input files。
- 第一版不建立完整 hosted web application。
- 每個 module expose 一個 function，且不直接寫入檔案。
- generated files 與 source files 分離，輸出集中在 `generated/`。

---

## File Structure

本次實作會建立以下檔案：

- `package.json`：npm scripts 與 Node/TypeScript 專案設定。
- `tsconfig.json`：TypeScript build 設定。
- `README.md`：base project 目的、setup、usage、workflow。
- `inputs/company.md`：可編輯公司文化輸入 template。
- `inputs/job-description.md`：可編輯 JD 輸入 template。
- `inputs/profile.md`：可編輯個人背景輸入 template。
- `inputs/skills.md`：可編輯技能輸入 template。
- `examples/sample-inputs/company.md`：完整公司文化範例。
- `examples/sample-inputs/job-description.md`：完整 JD 範例。
- `examples/sample-inputs/profile.md`：完整個人背景範例。
- `examples/sample-inputs/skills.md`：完整技能範例。
- `generated/.gitkeep`：保留 generated folder。
- `src/domain/inputDocuments.ts`：input document types 與 required file names。
- `src/domain/poc.ts`：analysis 與 POC result types。
- `src/domain/skill.ts`：skill evidence type。
- `src/io/readInputs.ts`：讀取與驗證 `inputs/` Markdown files。
- `src/io/writeGeneratedFiles.ts`：寫入 generated files。
- `src/modules/analyzeCompanyCulture.ts`：分析公司文化。
- `src/modules/analyzeJobDescription.ts`：分析 JD。
- `src/modules/alignCandidateProfile.ts`：比對 candidate profile 與技能。
- `src/modules/proposePoc.ts`：產生單一 POC 方向。
- `src/generators/generatePocSpec.ts`：產出 `generated/poc-spec.md`。
- `src/generators/generateReadme.ts`：產出 `generated/README.md`。
- `src/generators/generateProjectSkeleton.ts`：產出 `generated/project/` skeleton。
- `src/pipeline/types.ts`：pipeline input/output types。
- `src/pipeline/runPipeline.ts`：pipeline orchestration。
- `src/cli.ts`：CLI entry。
- `templates/poc-spec.md`：POC spec template reference。
- `templates/generated-readme.md`：generated README template reference。
- `templates/project-skeleton/README.md`：starter skeleton template reference。
- `docs/architecture.md`：pipeline 與 module boundary 說明。
- `docs/input-format.md`：input files 撰寫說明。
- `docs/module-guide.md`：新增 modules 與 generators 說明。
- `tests/readInputs.test.ts`：input validation tests。
- `tests/runPipeline.test.ts`：pipeline generation tests。
- `tests/modules.test.ts`：core module tests。

---

### Task 1: 專案設定與輸入資料骨架

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `inputs/company.md`
- Create: `inputs/job-description.md`
- Create: `inputs/profile.md`
- Create: `inputs/skills.md`
- Create: `examples/sample-inputs/company.md`
- Create: `examples/sample-inputs/job-description.md`
- Create: `examples/sample-inputs/profile.md`
- Create: `examples/sample-inputs/skills.md`
- Create: `generated/.gitkeep`

**Interfaces:**
- Produces: npm scripts `build`, `test`, `generate`。
- Produces: required input file paths consumed by `readInputs(inputDir: string)`.

- [ ] **Step 1: Create TypeScript project config**

Create `package.json`:

```json
{
  "name": "jd-to-poc",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "test": "npm run build && node --test dist/tests/*.test.js",
    "generate": "npm run build && node dist/src/cli.js"
  },
  "devDependencies": {
    "typescript": "^5.5.0"
  },
  "engines": {
    "node": ">=20"
  }
}
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": ".",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

- [ ] **Step 2: Create editable input templates**

Create `inputs/company.md`:

```markdown
# Company

## 公司簡介

請填入目標公司的產品、產業、商業模式與主要使用者。

## 企業文化

請填入公司公開強調的價值觀、工作方式與團隊特質。

## 產品方向

請填入你觀察到的產品重點、近期方向或面試中可能被重視的議題。
```

Create `inputs/job-description.md`:

```markdown
# Job Description

## Role

請填入職缺名稱與團隊位置。

## Responsibilities

請貼上或整理主要職責。

## Required Skills

請列出必要技能。

## Preferred Skills

請列出加分技能。
```

Create `inputs/profile.md`:

```markdown
# Candidate Profile

## Summary

請填入你的背景摘要。

## Experience

請填入與職缺相關的經驗。

## Projects

請填入可被轉化成面試亮點的專案。
```

Create `inputs/skills.md`:

```markdown
# Skills

## Strong Skills

請列出你能在面試中有把握展示的技能。

## Familiar Skills

請列出你熟悉但不想過度宣稱的技能。

## Learning Goals

請列出針對此職缺想補強的技能。
```

- [ ] **Step 3: Create complete sample inputs**

Create `examples/sample-inputs/company.md`:

```markdown
# Company

## 公司簡介

Acme Analytics 是一間 B2B SaaS 公司，協助營運團隊把客服、銷售與產品事件整合成可行動的洞察。

## 企業文化

公司重視清楚溝通、資料驅動決策、快速交付與跨職能合作。

## 產品方向

近期產品方向聚焦在 AI-assisted workflow、dashboard automation 與降低非技術使用者的分析門檻。
```

Create `examples/sample-inputs/job-description.md`:

```markdown
# Job Description

## Role

Frontend Engineer, Growth Platform

## Responsibilities

- 建立可維護的 React UI。
- 與 product manager 和 designer 合作，把需求轉成可交付功能。
- 改善 dashboard 效能與使用者體驗。

## Required Skills

- TypeScript
- React
- API integration
- Testing

## Preferred Skills

- Data visualization
- Product analytics
- Accessibility
```

Create `examples/sample-inputs/profile.md`:

```markdown
# Candidate Profile

## Summary

我是一位偏前端與全端整合的工程師，重視可維護架構、清楚文件與快速驗證。

## Experience

- 建立過資料管理後台。
- 串接過 REST API。
- 撰寫過元件測試與端到端流程驗證。

## Projects

- Dashboard prototype
- Internal workflow tool
- Resume automation scripts
```

Create `examples/sample-inputs/skills.md`:

```markdown
# Skills

## Strong Skills

- TypeScript
- React
- Component design
- API integration

## Familiar Skills

- Data visualization
- Accessibility
- Node.js CLI

## Learning Goals

- 更完整展示 dashboard performance tradeoffs。
- 把 AI-assisted workflow 轉成可展示的產品功能。
```

- [ ] **Step 4: Keep generated folder**

Create `generated/.gitkeep` as an empty file.

- [ ] **Step 5: Verify config shape**

Run: `npm run build`

Expected: FAIL with TypeScript reporting no input files or missing source files. This is acceptable in Task 1 because source files are created in later tasks.

- [ ] **Step 6: Commit**

```bash
git add package.json tsconfig.json inputs examples generated/.gitkeep
git commit -m "chore: add project config and input templates"
```

---

### Task 2: Domain Types 與 Input Reader

**Files:**
- Create: `src/domain/inputDocuments.ts`
- Create: `src/domain/poc.ts`
- Create: `src/domain/skill.ts`
- Create: `src/io/readInputs.ts`
- Create: `tests/readInputs.test.ts`

**Interfaces:**
- Produces: `readInputs(inputDir: string): Promise<InputDocuments>`
- Produces: `InputDocuments`, `CompanyAnalysis`, `JobAnalysis`, `CandidateAlignment`, `PocProposal`

- [ ] **Step 1: Write failing input validation tests**

Create `tests/readInputs.test.ts`:

```ts
import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { readInputs } from "../src/io/readInputs.js";

async function createTempInputs(): Promise<string> {
  const dir = await mkdtemp(join(tmpdir(), "jd-to-poc-"));
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, "company.md"), "# Company\n\nCulture notes", "utf8");
  await writeFile(join(dir, "job-description.md"), "# JD\n\nTypeScript role", "utf8");
  await writeFile(join(dir, "profile.md"), "# Profile\n\nFrontend engineer", "utf8");
  await writeFile(join(dir, "skills.md"), "# Skills\n\nTypeScript\nReact", "utf8");
  return dir;
}

test("readInputs reads all required markdown files", async () => {
  const dir = await createTempInputs();
  try {
    const inputs = await readInputs(dir);
    assert.equal(inputs.company.path, join(dir, "company.md"));
    assert.match(inputs.jobDescription.content, /TypeScript role/);
    assert.match(inputs.profile.content, /Frontend engineer/);
    assert.match(inputs.skills.content, /React/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("readInputs rejects missing required files", async () => {
  const dir = await mkdtemp(join(tmpdir(), "jd-to-poc-"));
  try {
    await assert.rejects(
      () => readInputs(dir),
      /Missing required input file: .*company\.md/
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test("readInputs rejects empty input files", async () => {
  const dir = await createTempInputs();
  try {
    await writeFile(join(dir, "skills.md"), "   \n", "utf8");
    await assert.rejects(
      () => readInputs(dir),
      /Input file is empty: .*skills\.md/
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test`

Expected: FAIL with module resolution errors for `../src/io/readInputs.js`.

- [ ] **Step 3: Implement domain types**

Create `src/domain/inputDocuments.ts`:

```ts
export const requiredInputFiles = [
  "company.md",
  "job-description.md",
  "profile.md",
  "skills.md"
] as const;

export type RequiredInputFile = (typeof requiredInputFiles)[number];

export interface InputDocument {
  name: RequiredInputFile;
  path: string;
  content: string;
}

export interface InputDocuments {
  company: InputDocument;
  jobDescription: InputDocument;
  profile: InputDocument;
  skills: InputDocument;
}
```

Create `src/domain/poc.ts`:

```ts
export interface CompanyAnalysis {
  values: string[];
  productSignals: string[];
  interviewSignals: string[];
}

export interface JobAnalysis {
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  evidenceToShow: string[];
}

export interface CandidateAlignment {
  strengths: string[];
  gaps: string[];
  visibleSkills: string[];
}

export interface PocProposal {
  title: string;
  summary: string;
  features: string[];
  skillEvidence: string[];
  implementationPlan: string[];
  demoTalkingPoints: string[];
}
```

Create `src/domain/skill.ts`:

```ts
export interface SkillEvidence {
  skill: string;
  evidence: string;
}
```

- [ ] **Step 4: Implement input reader**

Create `src/io/readInputs.ts`:

```ts
import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
import {
  type InputDocument,
  type InputDocuments,
  type RequiredInputFile,
  requiredInputFiles
} from "../domain/inputDocuments.js";

function inputDocumentKey(file: RequiredInputFile): keyof InputDocuments {
  if (file === "company.md") return "company";
  if (file === "job-description.md") return "jobDescription";
  if (file === "profile.md") return "profile";
  return "skills";
}

async function readRequiredFile(inputDir: string, file: RequiredInputFile): Promise<InputDocument> {
  const path = join(inputDir, file);

  try {
    await access(path);
  } catch {
    throw new Error(`Missing required input file: ${path}`);
  }

  const content = await readFile(path, "utf8");
  if (content.trim().length === 0) {
    throw new Error(`Input file is empty: ${path}`);
  }

  return { name: file, path, content };
}

export async function readInputs(inputDir: string): Promise<InputDocuments> {
  const entries = await Promise.all(
    requiredInputFiles.map(async (file) => [inputDocumentKey(file), await readRequiredFile(inputDir, file)] as const)
  );

  return Object.fromEntries(entries) as unknown as InputDocuments;
}
```

- [ ] **Step 5: Run test to verify pass**

Run: `npm test`

Expected: PASS for `readInputs` tests.

- [ ] **Step 6: Commit**

```bash
git add src/domain src/io tests/readInputs.test.ts
git commit -m "feat: add input reader and domain types"
```

---

### Task 3: Analysis Modules

**Files:**
- Create: `src/modules/analyzeCompanyCulture.ts`
- Create: `src/modules/analyzeJobDescription.ts`
- Create: `src/modules/alignCandidateProfile.ts`
- Create: `src/modules/proposePoc.ts`
- Create: `tests/modules.test.ts`

**Interfaces:**
- Consumes: `InputDocuments`, `CompanyAnalysis`, `JobAnalysis`, `CandidateAlignment`
- Produces: module functions matching names in the spec.

- [ ] **Step 1: Write failing module tests**

Create `tests/modules.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test`

Expected: FAIL with missing module files.

- [ ] **Step 3: Implement modules**

Create `src/modules/analyzeCompanyCulture.ts`:

```ts
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
```

Create `src/modules/analyzeJobDescription.ts`:

```ts
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
```

Create `src/modules/alignCandidateProfile.ts`:

```ts
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
```

Create `src/modules/proposePoc.ts`:

```ts
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
      `此 POC 如何避開過度設計並保留擴充空間`
    ]
  };
}
```

- [ ] **Step 4: Run module tests**

Run: `npm test`

Expected: PASS for `modules` and `readInputs` tests.

- [ ] **Step 5: Commit**

```bash
git add src/modules tests/modules.test.ts
git commit -m "feat: add analysis modules"
```

---

### Task 4: Generators 與 Pipeline

**Files:**
- Create: `src/io/writeGeneratedFiles.ts`
- Create: `src/generators/generatePocSpec.ts`
- Create: `src/generators/generateReadme.ts`
- Create: `src/generators/generateProjectSkeleton.ts`
- Create: `src/pipeline/types.ts`
- Create: `src/pipeline/runPipeline.ts`
- Create: `tests/runPipeline.test.ts`

**Interfaces:**
- Consumes: module outputs from Task 3.
- Produces: `runPipeline(options: RunPipelineOptions): Promise<RunPipelineResult>`.

- [ ] **Step 1: Write failing pipeline test**

Create `tests/runPipeline.test.ts`:

```ts
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";
import { runPipeline } from "../src/pipeline/runPipeline.js";

async function createInputs(root: string): Promise<string> {
  const inputDir = join(root, "inputs");
  await mkdir(inputDir, { recursive: true });
  await writeFile(join(inputDir, "company.md"), "# Company\n\n重視資料驅動與 dashboard automation。", "utf8");
  await writeFile(join(inputDir, "job-description.md"), "# JD\n\n- TypeScript\n- React\n- Testing", "utf8");
  await writeFile(join(inputDir, "profile.md"), "# Profile\n\nReact dashboard engineer", "utf8");
  await writeFile(join(inputDir, "skills.md"), "# Skills\n\nTypeScript\nReact", "utf8");
  return inputDir;
}

test("runPipeline writes generated POC files", async () => {
  const root = await mkdtemp(join(tmpdir(), "jd-to-poc-"));
  try {
    const inputDir = await createInputs(root);
    const outputDir = join(root, "generated");
    const result = await runPipeline({ inputDir, outputDir });

    assert.ok(result.files.some((file) => file.endsWith("poc-spec.md")));
    assert.ok(result.files.some((file) => file.endsWith("README.md")));
    assert.ok(result.files.some((file) => file.endsWith("project/README.md")));

    const spec = await readFile(join(outputDir, "poc-spec.md"), "utf8");
    assert.match(spec, /# .*POC/);
    assert.match(spec, /Skill Evidence/);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
```

- [ ] **Step 2: Run test to verify failure**

Run: `npm test`

Expected: FAIL with missing pipeline files.

- [ ] **Step 3: Implement generated file writer**

Create `src/io/writeGeneratedFiles.ts`:

```ts
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

export interface GeneratedFile {
  path: string;
  content: string;
}

export async function writeGeneratedFiles(outputDir: string, files: GeneratedFile[]): Promise<string[]> {
  const written: string[] = [];

  for (const file of files) {
    const fullPath = join(outputDir, file.path);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, file.content, "utf8");
    written.push(fullPath);
  }

  return written;
}
```

- [ ] **Step 4: Implement generators**

Create `src/generators/generatePocSpec.ts`:

```ts
import type { PocProposal } from "../domain/poc.js";
import type { GeneratedFile } from "../io/writeGeneratedFiles.js";

export function generatePocSpec(proposal: PocProposal): GeneratedFile {
  return {
    path: "poc-spec.md",
    content: `# ${proposal.title}

## Summary

${proposal.summary}

## Features

${proposal.features.map((item) => `- ${item}`).join("\n")}

## Skill Evidence

${proposal.skillEvidence.map((item) => `- ${item}`).join("\n")}

## Implementation Plan

${proposal.implementationPlan.map((item, index) => `${index + 1}. ${item}`).join("\n")}

## Demo Talking Points

${proposal.demoTalkingPoints.map((item) => `- ${item}`).join("\n")}
`
  };
}
```

Create `src/generators/generateReadme.ts`:

```ts
import type { PocProposal } from "../domain/poc.js";
import type { GeneratedFile } from "../io/writeGeneratedFiles.js";

export function generateReadme(proposal: PocProposal): GeneratedFile {
  return {
    path: "README.md",
    content: `# ${proposal.title}

這是由 JD-to-POC base project 產生的面試展示 POC。

## POC Direction

${proposal.summary}

## How To Demo

${proposal.demoTalkingPoints.map((item) => `- ${item}`).join("\n")}
`
  };
}
```

Create `src/generators/generateProjectSkeleton.ts`:

```ts
import type { PocProposal } from "../domain/poc.js";
import type { GeneratedFile } from "../io/writeGeneratedFiles.js";

export function generateProjectSkeleton(proposal: PocProposal): GeneratedFile[] {
  return [
    {
      path: "project/README.md",
      content: `# ${proposal.title} Skeleton

## Purpose

${proposal.summary}

## First Files To Build

${proposal.features.map((feature) => `- ${feature}`).join("\n")}
`
    },
    {
      path: "project/src/main.ts",
      content: `export function describePoc(): string {
  return "${proposal.title}";
}
`
    }
  ];
}
```

- [ ] **Step 5: Implement pipeline**

Create `src/pipeline/types.ts`:

```ts
import type { PocProposal } from "../domain/poc.js";

export interface RunPipelineOptions {
  inputDir: string;
  outputDir: string;
}

export interface RunPipelineResult {
  proposal: PocProposal;
  files: string[];
}
```

Create `src/pipeline/runPipeline.ts`:

```ts
import { readInputs } from "../io/readInputs.js";
import { writeGeneratedFiles } from "../io/writeGeneratedFiles.js";
import { analyzeCompanyCulture } from "../modules/analyzeCompanyCulture.js";
import { analyzeJobDescription } from "../modules/analyzeJobDescription.js";
import { alignCandidateProfile } from "../modules/alignCandidateProfile.js";
import { proposePoc } from "../modules/proposePoc.js";
import { generatePocSpec } from "../generators/generatePocSpec.js";
import { generateReadme } from "../generators/generateReadme.js";
import { generateProjectSkeleton } from "../generators/generateProjectSkeleton.js";
import type { RunPipelineOptions, RunPipelineResult } from "./types.js";

export async function runPipeline(options: RunPipelineOptions): Promise<RunPipelineResult> {
  const inputs = await readInputs(options.inputDir);
  const company = analyzeCompanyCulture(inputs.company.content);
  const job = analyzeJobDescription(inputs.jobDescription.content);
  const alignment = alignCandidateProfile(inputs.profile.content, inputs.skills.content, job);
  const proposal = proposePoc(company, job, alignment);

  const generatedFiles = [
    generatePocSpec(proposal),
    generateReadme(proposal),
    ...generateProjectSkeleton(proposal)
  ];

  const files = await writeGeneratedFiles(options.outputDir, generatedFiles);
  return { proposal, files };
}
```

- [ ] **Step 6: Run pipeline tests**

Run: `npm test`

Expected: PASS for all tests.

- [ ] **Step 7: Commit**

```bash
git add src/io/writeGeneratedFiles.ts src/generators src/pipeline tests/runPipeline.test.ts
git commit -m "feat: add POC generation pipeline"
```

---

### Task 5: CLI、Templates 與文件

**Files:**
- Create: `src/cli.ts`
- Create: `templates/poc-spec.md`
- Create: `templates/generated-readme.md`
- Create: `templates/project-skeleton/README.md`
- Create: `README.md`
- Create: `docs/architecture.md`
- Create: `docs/input-format.md`
- Create: `docs/module-guide.md`

**Interfaces:**
- Consumes: `runPipeline({ inputDir, outputDir })`
- Produces: `npm run generate`

- [ ] **Step 1: Implement CLI**

Create `src/cli.ts`:

```ts
import { join } from "node:path";
import { runPipeline } from "./pipeline/runPipeline.js";

async function main(): Promise<void> {
  const cwd = process.cwd();
  const result = await runPipeline({
    inputDir: join(cwd, "inputs"),
    outputDir: join(cwd, "generated")
  });

  console.log("Generated POC files:");
  for (const file of result.files) {
    console.log(`- ${file}`);
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
```

- [ ] **Step 2: Create template references**

Create `templates/poc-spec.md`:

```markdown
# {{title}}

## Summary

{{summary}}

## Features

{{features}}

## Skill Evidence

{{skillEvidence}}
```

Create `templates/generated-readme.md`:

```markdown
# {{title}}

這是產生後的 POC README 範本。
```

Create `templates/project-skeleton/README.md`:

```markdown
# Project Skeleton

此資料夾代表 generated POC project 的最小骨架。
```

- [ ] **Step 3: Write user-facing docs**

Create `README.md`:

```markdown
# JD to POC

這是一個可複製使用的面試準備 base project。你可以針對不同公司或職缺複製此專案，填入企業文化、JD、個人資料與技能，然後產出適合面試展示的 POC 規格與 starter skeleton。

## Setup

```bash
npm install
```

## Usage

1. 編輯 `inputs/company.md`。
2. 編輯 `inputs/job-description.md`。
3. 編輯 `inputs/profile.md`。
4. 編輯 `inputs/skills.md`。
5. 執行：

```bash
npm run generate
```

輸出會產生在 `generated/`。

## Workflow

`inputs/` 提供每次面試情境的資料，`src/modules/` 分析資料，`src/generators/` 產生輸出。若要新增能力，優先新增 module 或 generator。
```

Create `docs/architecture.md`:

```markdown
# Architecture

此專案採用 CLI pipeline。

```text
inputs -> io -> modules -> pipeline -> generators -> generated
```

## Boundaries

- `src/io/` 只處理檔案讀寫。
- `src/domain/` 只放共享 types。
- `src/modules/` 負責分析，不寫檔。
- `src/generators/` 負責產生輸出檔案內容。
- `src/pipeline/` 負責串接流程。
```

Create `docs/input-format.md`:

```markdown
# Input Format

第一版只支援 Markdown。

## Required Files

- `inputs/company.md`
- `inputs/job-description.md`
- `inputs/profile.md`
- `inputs/skills.md`

每個檔案都不能是空檔。建議保留標題與段落，讓後續 module 更容易分析。
```

Create `docs/module-guide.md`:

```markdown
# Module Guide

新增分析能力時，請新增 module。新增輸出 artifact 時，請新增 generator。

## Add A Module

1. 在 `src/modules/` 新增一個檔案。
2. expose 一個 function。
3. 不要在 module 中寫檔。
4. 在 `src/pipeline/runPipeline.ts` 串接它。
5. 在 `tests/` 加上聚焦測試。

## Add A Generator

1. 在 `src/generators/` 新增一個檔案。
2. 回傳 `GeneratedFile` 或 `GeneratedFile[]`。
3. 在 pipeline 中加入輸出。
4. 測試產生的檔名與核心內容。
```

- [ ] **Step 4: Verify CLI generation**

Run: `npm run generate`

Expected: PASS and prints generated files including `generated/poc-spec.md`, `generated/README.md`, and `generated/project/README.md`.

- [ ] **Step 5: Verify full test suite**

Run: `npm test`

Expected: PASS for all tests.

- [ ] **Step 6: Commit**

```bash
git add src/cli.ts templates README.md docs/architecture.md docs/input-format.md docs/module-guide.md
git commit -m "docs: add CLI usage and extension guides"
```

---

### Task 6: Completion Audit

**Files:**
- Modify only if audit finds a mismatch.

**Interfaces:**
- Consumes: all project files.
- Produces: verified base project against the approved spec.

- [ ] **Step 1: Verify expected file structure**

Run: `rg --files`

Expected includes:

```text
README.md
package.json
tsconfig.json
inputs/company.md
inputs/job-description.md
inputs/profile.md
inputs/skills.md
examples/sample-inputs/company.md
examples/sample-inputs/job-description.md
examples/sample-inputs/profile.md
examples/sample-inputs/skills.md
src/cli.ts
src/pipeline/runPipeline.ts
src/modules/proposePoc.ts
src/generators/generatePocSpec.ts
docs/architecture.md
docs/input-format.md
docs/module-guide.md
```

- [ ] **Step 2: Verify build**

Run: `npm run build`

Expected: PASS.

- [ ] **Step 3: Verify tests**

Run: `npm test`

Expected: PASS.

- [ ] **Step 4: Verify generation**

Run: `npm run generate`

Expected: PASS and `generated/` contains:

```text
generated/poc-spec.md
generated/README.md
generated/project/README.md
generated/project/src/main.ts
```

- [ ] **Step 5: Inspect generated core content**

Run: `Get-Content -LiteralPath generated\\poc-spec.md -Encoding UTF8`

Expected: file contains `Skill Evidence`, `Implementation Plan`, and `Demo Talking Points`.

- [ ] **Step 6: Final commit if audit changed files**

If any fixes were needed:

```bash
git add .
git commit -m "chore: complete base project audit"
```

If no fixes were needed, do not create an empty commit.

---

## Self-Review

Spec coverage:

- 可複製 base project：Task 1、Task 5。
- 公司文化、JD、技能、個人資料 input：Task 1、Task 2、Task 5。
- 根據輸入產出展示 POC：Task 3、Task 4、Task 5。
- 模組化設計：Task 2、Task 3、Task 4、Task 5。
- 完整資料夾結構與說明：Task 1、Task 5、Task 6。
- 聚焦測試與驗證：Task 2、Task 3、Task 4、Task 6。

Placeholder scan:

- 本 plan 沒有保留未定義的待補內容。
- 所有 code-writing steps 都包含目標檔案內容。

Type consistency:

- `InputDocuments` 由 `readInputs` 回傳，供 `runPipeline` 使用。
- `CompanyAnalysis`、`JobAnalysis`、`CandidateAlignment`、`PocProposal` 由 modules 與 generators 共用。
- `GeneratedFile` 由 generators 回傳，供 `writeGeneratedFiles` 使用。
