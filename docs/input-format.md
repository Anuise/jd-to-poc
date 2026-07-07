# Input Format

第一版只支援 Markdown。

## Required Files

- `inputs/company.md`
- `inputs/job-description.md`
- `inputs/profile.md`
- `inputs/skills.md`

每個檔案都不能是空檔。建議保留標題與段落，讓後續 module 更容易分析。

## JD Sections

`inputs/job-description.md` 建議保留以下 sections，並在每個 section 下使用 Markdown bullets：

```markdown
## Responsibilities

- 建立可維護的 UI

## Required Skills

- TypeScript
- Testing

## Preferred Skills

- Data visualization
```

目前 analyzer 會依 section 區分職責、必要技能與加分技能。若沒有使用 `- ` bullet，該段內容可能無法被精準分類。
