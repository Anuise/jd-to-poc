# Task 4 Report: Generators 與 Pipeline

## Status

完成。

## Scope

本次只新增 Task 4 brief 指定的 pipeline、generator、writer 與測試檔案：

- `src/io/writeGeneratedFiles.ts`
- `src/generators/generatePocSpec.ts`
- `src/generators/generateReadme.ts`
- `src/generators/generateProjectSkeleton.ts`
- `src/pipeline/types.ts`
- `src/pipeline/runPipeline.ts`
- `tests/runPipeline.test.ts`

未實作 CLI、templates、docs，也未加入外部服務或 LLM provider integration。

## Implementation Notes

- `runPipeline(options)` 讀取 Markdown input files，串接 Task 3 modules，產生 `PocProposal`。
- generators 只回傳 `GeneratedFile`，不直接寫檔。
- `writeGeneratedFiles` 負責集中寫入 `outputDir`，並回傳 slash-normalized written file paths，讓 Windows 與 POSIX 測試行為一致。
- 產出檔案集中在呼叫端傳入的 `generated/` output directory 下，source files 與 generated files 分離。
- 使用者可見 generated Markdown 文字以繁體中文為主；保留 `Skill Evidence` 字樣以符合既有測試與 task brief。

## Verification

- 先新增 `tests/runPipeline.test.ts`。
- 第一次 `npm test` 因缺少本機 npm dependencies 無法找到 `tsc`。
- 執行 `npm install` 後重跑 `npm test`，測試因缺少 `../src/pipeline/runPipeline.js` 失敗，確認 RED。
- 完成實作後執行 `npm test`。

Final result:

```text
1..8
# tests 8
# pass 8
# fail 0
```

## Concerns

- 此 checkout 原本沒有 `node_modules` 或 `package-lock.json`；測試前需要先執行 `npm install` 安裝 `typescript`。
- Task 3 modules 的繁體中文字串在 PowerShell output 中呈現 mojibake，但本任務未修改那些檔案。
