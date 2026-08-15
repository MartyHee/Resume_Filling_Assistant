import type { BasicProfileField } from "../domain/profile";

export type PageField = {
  id: string;
  label: string;
  name: string;
  placeholder: string;
  type: string;
  value: string;
};

export type FillMatch = {
  pageFieldId: string;
  profileField: BasicProfileField;
  value: string;
  confidence: "high" | "low";
};

export type FillPlan = {
  fillable: FillMatch[];
  skippedExisting: PageField[];
  needsConfirmation: Array<{
    pageField: PageField;
    candidates: FillMatch[];
  }>;
  unmatched: PageField[];
};

export type FillSummary = {
  filled: number;
  skippedExisting: number;
  needsConfirmation: number;
  unmatched: number;
  failed: number;
};
