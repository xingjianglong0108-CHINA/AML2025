
import { RiskLevel, PrognosisType, GeneticAbnormality, Table2GeneticPrognosis, TargetedDrug, ITDosage } from './types';

// 表2：AML基因异常的预后分类（含合并异常及意义）
export const TABLE2_GENETIC_PROGNOSIS: Table2GeneticPrognosis[] = [
  {
    type: PrognosisType.Favorable,
    markers: [
      { 
        name: 't(8;21)(q22;q22.1)', 
        description: 'RUNX1-RUNX1T1',
        modifiers: [
          { condition: '伴 KIT 突变 (D816)', impact: '可能抵消预后优势，建议按中危监测' },
          { condition: '单纯缺失性染色体', impact: '不影响其优良预后' }
        ],
        significance: '核心结合因子(CBF) AML，诱导缓解率高，长期生存率好。'
      },
      { 
        name: 'inv(16)(p13.1q22) / t(16;16)', 
        description: 'CBFB-MYH11',
        modifiers: [
          { condition: '伴 KIT 突变', impact: '预后意义同 t(8;21)，需关注复发风险' }
        ],
        significance: 'CBF-AML，对中大剂量 Ara-C 反应极佳。'
      },
      { 
        name: 'NPM1 突变', 
        description: '核磷蛋白突变',
        modifiers: [
          { condition: '不伴 FLT3-ITD', impact: '独立预后良好因子' },
          { condition: '伴 FLT3-ITD (AR < 0.5)', impact: '仍维持预后好分类' }
        ],
        significance: '正常核型 AML 中最重要的良好预后标记。'
      },
      { 
        name: 'CEBPA bZip 突变', 
        description: 'bZip 结构域突变',
        significance: '无论是单突变或双突变，只要涉及 bZip 结构域，预后通常较好。'
      }
    ]
  },
  {
    type: PrognosisType.Intermediate,
    markers: [
      { 
        name: 't(9;11)(p21.3;q23.3)', 
        description: 'MLLT3-KMT2A',
        significance: 'KMT2A 重排中预后相对较好的一种。'
      },
      { 
        name: 'FLT3-ITD (AR < 0.5)', 
        description: '低比例突变',
        modifiers: [
          { condition: '伴 NPM1 突变', impact: '分类为预后好' },
          { condition: '野生型 NPM1', impact: '维持预后中等' }
        ],
        significance: 'FLT3 突变负荷（等位基因比例）是决定预后的关键。'
      },
      { 
        name: '其他非特定核型', 
        description: '如正常核型 (CN-AML)',
        significance: '需结合其他分子学标记如 WT1、ASXL1 等进一步细分。'
      }
    ]
  },
  {
    type: PrognosisType.Adverse,
    markers: [
      { 
        name: 't(6;9)(p23;q34.1)', 
        description: 'DEK-NUP214',
        significance: '常伴 FLT3-ITD，化疗反应差，建议早期移植。'
      },
      { 
        name: 't(v;11q23.3)', 
        description: 'KMT2A 重排 (除外 9;11)',
        modifiers: [
          { condition: 't(4;11) 或 t(10;11)', impact: '预后极差，复发率极高' }
        ],
        significance: '具有高度侵袭性。'
      },
      { 
        name: '复杂核型 (≥3 种)', 
        description: 'Complex Karyotype',
        significance: '对标准强烈化疗反应差，缓解期短。'
      },
      { 
        name: 'TP53 突变', 
        description: '抑癌基因失活',
        significance: 'AML 中最差的分子学标记，对常规化疗耐药。'
      },
      { 
        name: '髓系异常相关突变', 
        description: 'ASXL1, RUNX1, STAG2 等',
        significance: '提示继发性 AML 或具有类 MDS 生物学特征。'
      }
    ]
  }
];

// 表3：危险度分层依据
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

export const TARGETED_DRUGS: TargetedDrug[] = [
  { target: 'BCL2', name: '维奈克拉', brandName: 'Venetoclax', dosage: '200-250mg/m².d qd', precautions: '禁用于TP53突变；CYP3A抑制剂减量1/3' },
  { target: 'FLT3', name: '米哚妥林', brandName: 'Midostaurin', dosage: '20-30mg/m².次 q12h', precautions: 'CYP3A抑制剂需减量' },
  { target: 'FLT3', name: '吉瑞替尼', brandName: 'Gilteritinib', dosage: '60-70mg/m².d qd', precautions: '用于复发或难治性FLT3+' },
  { target: 'IDH1', name: '艾伏尼布', brandName: 'Ivosidenib', dosage: '200-300mg/m².d qd', precautions: 'CYP3A抑制剂需减量' }
];

export const IT_DOSAGES: ITDosage[] = [
  { ageLabel: '～1岁', mtx: '5mg', araC: '10mg', dxm: '2mg', finalVolume: '4ml' },
  { ageLabel: '～2岁', mtx: '7.5mg', araC: '15mg', dxm: '2mg', finalVolume: '5ml' },
  { ageLabel: '～3岁', mtx: '10mg', araC: '25mg', dxm: '5mg', finalVolume: '6ml' },
  { ageLabel: '＞3岁', mtx: '12.5mg', araC: '35mg', dxm: '5mg', finalVolume: '6ml' }
];
