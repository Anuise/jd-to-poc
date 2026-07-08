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
