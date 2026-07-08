# JD to POC Base Project Design

## 目標

此 repository 會成為一個可重複複製使用的面試準備 base project。
使用者可以複製此專案，放入目標公司的企業文化、職缺描述、所需技能與
個人背景資料，然後產出一個適合面試展示的 POC 專案。

第一版會採用 CLI 型 POC generator。它會從結構化輸入檔案產出 POC 規格與
專案骨架。第一版不會嘗試產生所有可能的應用程式類型。

## 假設

- base project 應該容易針對不同公司或職缺複製使用。
- 輸入資料應該使用純文字或 Markdown，方便直接編輯。
- 第一版輸出應該優先重視清楚度：POC 概念、功能範圍、技術對齊、
  實作計畫與 starter code skeleton。
- 架構應該讓後續新增 analyzer 或 generator 變得容易。
- 第一版不應依賴外部服務，除非使用者後續明確加入。

## 非目標

- 第一版不建立完整 hosted web application。
- 第一版不產生適用所有 JD 的 production-ready business application。
- 在本地 pipeline 與檔案結構清楚前，不加入 LLM provider integration。
- 在 Markdown input 被證明足夠前，不支援多種輸入格式。

## 建議方案

採用小型 CLI pipeline：

1. 從 `inputs/` 讀取 Markdown input files。
2. 將輸入正規化成 domain models。
3. 執行分析 modules，處理企業文化、JD 需求、技能對齊與 POC 方向。
4. 執行 generators，將輸出寫入 `generated/`。
5. 將 generated files 與 source files 分離，讓專案能安全重複使用。

這個方案能讓專案具備真正可執行的行為，同時避免太早綁定大型產品 UI
或特定 demo app framework。

## 專案結構

```text
.
|-- README.md
|-- LICENSE
|-- package.json
|-- tsconfig.json
|-- inputs/
|   |-- company.md
|   |-- job-description.md
|   |-- profile.md
|   `-- skills.md
|-- examples/
|   `-- sample-inputs/
|       |-- company.md
|       |-- job-description.md
|       |-- profile.md
|       `-- skills.md
|-- generated/
|   `-- .gitkeep
|-- src/
|   |-- cli.ts
|   |-- pipeline/
|   |   |-- runPipeline.ts
|   |   `-- types.ts
|   |-- domain/
|   |   |-- inputDocuments.ts
|   |   |-- poc.ts
|   |   `-- skill.ts
|   |-- modules/
|   |   |-- analyzeCompanyCulture.ts
|   |   |-- analyzeJobDescription.ts
|   |   |-- alignCandidateProfile.ts
|   |   `-- proposePoc.ts
|   |-- generators/
|   |   |-- generatePocSpec.ts
|   |   |-- generateReadme.ts
|   |   `-- generateProjectSkeleton.ts
|   `-- io/
|       |-- readInputs.ts
|       `-- writeGeneratedFiles.ts
|-- templates/
|   |-- poc-spec.md
|   |-- generated-readme.md
|   `-- project-skeleton/
`-- docs/
    |-- architecture.md
    |-- input-format.md
    |-- module-guide.md
    `-- superpowers/
        `-- specs/
            `-- 2026-07-07-jd-to-poc-base-project-design.md
```

## 資料夾職責

- `inputs/`：針對單一公司或職缺填寫的工作資料。複製專案後，優先修改這些檔案。
- `examples/sample-inputs/`：完整範例，用來示範 input files 應該如何撰寫。
- `generated/`：CLI 產出的結果。這些檔案可以刪除並重新產生。
- `src/domain/`：共用 TypeScript types，描述 input documents、requirements、
  candidate skills 與 POC output。
- `src/modules/`：獨立分析步驟。每個 module 接收正規化後的 context，並回傳 typed result。
- `src/generators/`：輸出產生器。generators 將 pipeline results 轉成檔案。
- `src/io/`：檔案系統讀寫。此資料夾讓 file access 不混入 domain logic。
- `src/pipeline/`：串接 input、modules 與 generators 的 orchestration layer。
- `templates/`：generators 使用的 Markdown templates 與 skeleton templates。
- `docs/`：說明使用方式、架構、輸入格式與 module extension 的文件。

## 資料流

```text
inputs/
  -> src/io/readInputs.ts
  -> src/domain/*
  -> src/modules/*
  -> src/pipeline/runPipeline.ts
  -> src/generators/*
  -> generated/
```

pipeline 應保持簡單且明確。每個 module 應只 expose 一個 function，且不應直接寫入檔案。

## 核心 Modules

### `analyzeCompanyCulture`

從 `inputs/company.md` 萃取價值觀、產品方向、協作風格與可能的面試訊號。

### `analyzeJobDescription`

從 JD 萃取職責、必要技能、加分技能、領域線索，以及 POC 應該展示的證據。

### `alignCandidateProfile`

比對 candidate profile、skills 與 JD。它應該識別：

- 應強調的優勢；
- 不應過度宣稱的缺口；
- 應在 POC 中被看見的技能。

### `proposePoc`

整合企業文化、JD 與 profile analysis，產生實際可做的 POC 方向。
第一版應選擇一個聚焦的 project idea，而不是產生多個替代方案。

## Generators

### `generatePocSpec`

寫入 `generated/poc-spec.md`，內容包含：

- 目標公司與職缺摘要；
- 為什麼此 POC 符合公司與 JD；
- 功能範圍；
- skill evidence map；
- 建議實作計畫；
- demo talking points。

### `generateReadme`

替 generated POC project 寫入 `generated/README.md`。

### `generateProjectSkeleton`

在 `generated/project/` 寫入最小 starter skeleton。第一版 skeleton 應刻意保持小，
並放入與 POC spec 對齊的 placeholders，不假裝已經是 production-ready 專案。

## CLI 行為

第一個 CLI command 應為：

```bash
npm run generate
```

預期行為：

1. 驗證 `inputs/` 中必要檔案存在。
2. 讀取並正規化 input files。
3. 依序執行 modules。
4. 清除或覆寫已知 generated files。
5. 寫入 generated POC spec、generated README 與 starter skeleton。
6. 印出已產生的檔案路徑。

## 錯誤處理

錯誤處理保持務實：

- 如果缺少必要 input file，顯示缺少的 path 並停止。
- 如果 input file 是空的，顯示該 file path 並停止。
- 如果 generated output 無法寫入，顯示失敗 path 並停止。

第一版不加入複雜 recovery、config system 或 partial generation behavior。

## 測試策略

第一版 implementation 應包含聚焦測試：

- required input validation；
- 使用 sample inputs 的 pipeline orchestration；
- generated file names 與核心內容；
- 若引入 module registry，測試 module extension shape。

手動驗證應使用 `examples/sample-inputs/` 複製到 `inputs/`，執行 CLI 後確認
`generated/` 包含預期檔案。

## 擴充模型

未來改進應以 module 或 generator 形式加入：

- 當 pipeline 需要新的 analysis result，新增 module。
- 當 pipeline 需要新的 output artifact，新增 generator。
- 當現有 generator 需要不同輸出形狀，新增 template。

後續可擴充範例：

- interview question preparation；
- resume bullet alignment；
- technology stack recommendation；
- React 或 Next.js demo skeleton generation；
- company-specific talking points；
- LLM provider integration。

## 成功標準

implementation 完成時，應滿足：

- repository 包含文件中定義的資料夾結構。
- `README.md` 說明 base project 目的、setup、usage 與 workflow。
- `docs/architecture.md` 說明 pipeline 與 module boundaries。
- `docs/input-format.md` 說明 input files 如何撰寫。
- `docs/module-guide.md` 說明如何新增 modules 與 generators。
- `inputs/` 包含可編輯 templates。
- `examples/sample-inputs/` 包含完整範例。
- `npm run generate` 能在 `generated/` 建立 POC spec 與 starter skeleton。
- 程式碼包含 pipeline 與 generation behavior 的聚焦測試。
