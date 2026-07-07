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
