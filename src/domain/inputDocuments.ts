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
