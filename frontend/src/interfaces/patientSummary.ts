export interface BaseItem {
  label: string;
}

export interface AllergyItem extends BaseItem {
  allergy_name: string;
}

export interface ConditionItem extends BaseItem {
  condition_name: string;
}

export interface PatientSummary {
  full_name: string;
  bloodtype: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-" | null;
  age: number;
  allergies: AllergyItem[];
  conditions: ConditionItem[];
  summary: string;
}
