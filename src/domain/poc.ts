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
