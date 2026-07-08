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
