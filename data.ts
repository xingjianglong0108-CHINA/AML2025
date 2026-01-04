
import { RiskLevel, PrognosisType, GeneticAbnormality, Table2GeneticPrognosis, TargetedDrug, ITDosage, GeneticManualRow } from './types';

export const GENETIC_MANUAL: GeneticManualRow[] = [
  { risk: RiskLevel.Low, abnormality: 't(8;21)(q22;q22.1)/RUNX1-RUNX1T1', clinical: '合并KIT D816V转为中危' },
  { risk: RiskLevel.Low, abnormality: 'inv(16)/t(16;16); CBFB-MYH11', clinical: '合并+22预后好' },
  { risk: RiskLevel.Low, abnormality: 't(1;11)(q21;q23.3)/KMT2A-MLLT11', clinical: '--' },
  { risk: RiskLevel.Low, abnormality: 'NPM1 突变', clinical: '合并FLT3-ITD且比率≥0.5为中危' },
  { risk: RiskLevel.Low, abnormality: 'CEBPA-bZip', clinical: 'bZip区内，无论双或单突变' },
  { risk: RiskLevel.Medium, abnormality: 't(9;11)(p21.3;q23.3)/MLLT3-KMT2A', clinical: '合并FLT3-ITD/EVI1过表达则预后差' },
  { risk: RiskLevel.Medium, abnormality: 'NUP98-KDM5A / NUP98-X', clinical: '合并13号染色体异常属预后差' },
  { risk: RiskLevel.Medium, abnormality: 't(1;22)(p13.3;q13.1)/RBM15-MKL1', clinical: '--' },
  { risk: RiskLevel.Medium, abnormality: 'FLT3-ITD (比率<0.5)', clinical: '--' },
  { risk: RiskLevel.High, abnormality: '复杂核型 / 单体核型', clinical: '--' },
  { risk: RiskLevel.High, abnormality: 't(6;9)(p23;q34.1)/DEK-NUP214', clinical: '--' },
  { risk: RiskLevel.High, abnormality: 't(v;11q23.3)/KMT2A(MLL)', clinical: '除外t(1;11), t(9;11)' },
  { risk: RiskLevel.High, abnormality: 't(9;22)(q34.1;q11.2)/BCR-ABL1', clinical: '--' },
  { risk: RiskLevel.High, abnormality: 'Inv(16)(p13.3q24.3)/CBFA2T3-GLIS2', clinical: '--' },
  { risk: RiskLevel.High, abnormality: 't(5;11)(q35.3;p15.5)/NUP98-NSD1', clinical: '--' },
  { risk: RiskLevel.High, abnormality: 'Inv(3)/t(3;3)/GATA2/MECOM(EVI1)', clinical: '--' },
  { risk: RiskLevel.High, abnormality: '-5 / del(5q); -7; -17/abn(17p)', clinical: '--' },
  { risk: RiskLevel.High, abnormality: 'TP53 变异 (VAF > 10%)', clinical: '--' }
];

export const GENETIC_PROGNOSIS: GeneticAbnormality[] = [
  { gene: 't(8;21) / RUNX1-RUNX1T1', category: RiskLevel.Low, notes: 'KIT D816V转为中危' },
  { gene: 'inv(16) / CBFB-MYH11', category: RiskLevel.Low, notes: '核心结合因子AML' },
  { gene: 'NPM1 突变', category: RiskLevel.Low, notes: '伴FLT3-ITD(AR≥0.5)转为中危' },
  { gene: 'CEBPA-bZip 突变', category: RiskLevel.Low, notes: '预后好' },
  { gene: 't(9;11) / MLLT3-KMT2A', category: RiskLevel.Medium, notes: '中危' },
  { gene: 'FLT3-ITD (AR<0.5)', category: RiskLevel.Medium, notes: '低比例ITD' },
  { gene: 't(6;9) / DEK-NUP214', category: RiskLevel.High, notes: '高危' },
  { gene: 'KMT2A重排 (除外9;11)', category: RiskLevel.High, notes: '如t(4;11)' },
  { gene: '复杂核型 / TP53突变', category: RiskLevel.High, notes: '极高危' }
];

export const TARGETED_DRUGS: (TargetedDrug & { details?: string })[] = [
  { 
    target: 'BCL2', 
    name: '维奈克拉 (Venetoclax)', 
    dosage: '200-250mg/m².d qd', 
    details: '不用于TP53突变；D8理想峰浓度2000-3000ng/ml',
    precautions: 'CYP3A4强抑制剂合用需减量1/3'
  },
  { 
    target: 'FLT3-ITD/TKD', 
    name: '米哚妥林 / 吉瑞替尼', 
    dosage: '米: 20-30mg/m².次 q12h; 吉: 60-70mg/m².d qd', 
    details: '吉瑞替尼用于FLT3-ITD比率≥0.5',
    precautions: '需关注QT间期延长'
  },
  { 
    target: 'IDH1/IDH2', 
    name: '艾伏尼布 / 恩西地平', 
    dosage: '艾: 200-300mg/m².d; 恩: 50-60mg/m².d', 
    details: '艾伏尼布需根据CYP3A抑制剂调整',
    precautions: '关注分化综合征风险'
  },
  { 
    target: 'KMT2A / NPM1', 
    name: '瑞维美尼 (Revumenib)', 
    dosage: '150-160mg/m².次 q12h', 
    details: 'FDA批准用于>1岁复发/难治KMT2A白血病',
    precautions: 'MENIN抑制剂，关注QT延长'
  },
  { 
    target: 'NRAS/KRAS', 
    name: '曲美替尼', 
    dosage: '0.02-0.03mg/kg.d qd', 
    details: '餐前1h或餐后2h整粒服',
    precautions: 'MEK抑制剂，关注心功能及视力'
  },
  { 
    target: 'KIT', 
    name: '达沙替尼', 
    dosage: '60-70mg/m².d qd', 
    details: '用于CBF-AML或KIT突变',
    precautions: '监测胸腔积液及肺动脉高压'
  }
];

export const IT_DOSAGES: ITDosage[] = [
  { ageLabel: '～1岁', mtx: '5mg', araC: '10mg', dxm: '2mg', finalVolume: '4ml' },
  { ageLabel: '～2岁', mtx: '7.5mg', araC: '15mg', dxm: '2mg', finalVolume: '5ml' },
  { ageLabel: '～3岁', mtx: '10mg', araC: '25mg', dxm: '5mg', finalVolume: '6ml' },
  { ageLabel: '＞3岁', mtx: '12.5mg', araC: '35mg', dxm: '5mg', finalVolume: '6ml' }
];
