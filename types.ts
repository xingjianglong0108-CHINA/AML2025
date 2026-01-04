
export enum RiskLevel {
  Low = '标危',
  Medium = '中危',
  High = '高危'
}

export enum PrognosisType {
  Favorable = '预后好',
  Intermediate = '预后中等',
  Adverse = '预后差'
}

export interface GeneticAbnormality {
  gene: string;
  category: RiskLevel;
  notes: string;
}

export interface Table2Marker {
  name: string;
  description: string;
  modifiers?: {
    condition: string;
    impact: string;
  }[];
  significance?: string;
}

export interface Table2GeneticPrognosis {
  type: PrognosisType;
  markers: Table2Marker[];
}

export interface TargetedDrug {
  target: string;
  name: string;
  brandName?: string;
  dosage: string;
  precautions: string;
}

export interface ITDosage {
  ageLabel: string;
  mtx: string;
  araC: string;
  dxm: string;
  finalVolume: string;
}

export interface GeneticManualRow {
  risk: RiskLevel;
  abnormality: string;
  clinical: string;
}
