
import React, { useState } from 'react';
import { 
  Calculator, 
  Activity, 
  Pill, 
  Stethoscope, 
  ChevronRight, 
  Info,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  HelpCircle,
  ShieldCheck,
  AlertTriangle,
  Biohazard,
  ChevronDown,
  Dna,
  History,
  Target,
  FileText,
  Table as TableIcon,
  Search,
  Link2,
  Zap,
  Brain,
  Library
} from 'lucide-react';
import { GENETIC_PROGNOSIS, TARGETED_DRUGS, IT_DOSAGES, GENETIC_MANUAL } from './data';
import { RiskLevel, PrognosisType } from './types';
import GlassCard from './components/GlassCard';

type TabType = 'risk' | 'genetic' | 'wt1' | 'drugs' | 'it';
type StageType = 'initial' | 'induction' | 'consolidation1';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('risk');
  const [searchTerm, setSearchTerm] = useState('');
  
  // States for other tabs...
  const [stage, setStage] = useState<StageType>('initial');
  const [geneticBase, setGeneticBase] = useState<string>(GENETIC_PROGNOSIS[0].gene);
  const [wbc, setWbc] = useState<string>('');
  const [isCR, setIsCR] = useState<boolean>(true);
  const [mrd, setMrd] = useState<string>('');
  const [wt1DeltaRisk, setWt1DeltaRisk] = useState<string>('');
  const [wt1Prev, setWt1Prev] = useState<string>('');
  const [wt1Curr, setWt1Curr] = useState<string>('');

  const calculateDeltaLog = () => {
    const prev = parseFloat(wt1Prev);
    const curr = parseFloat(wt1Curr);
    if (isNaN(prev) || isNaN(curr) || prev <= 0 || curr <= 0) return null;
    return Math.log10(prev / curr);
  };

  const getRiskDetails = () => {
    const baseRiskObj = GENETIC_PROGNOSIS.find(g => g.gene === geneticBase);
    let currentRisk = baseRiskObj?.category || RiskLevel.Low;
    let reason = "";
    const wbcVal = parseFloat(wbc) || 0;
    const mrdVal = parseFloat(mrd) || 0;
    const wt1Val = parseFloat(wt1DeltaRisk) || 0;

    if (stage === 'initial') {
      if (currentRisk === RiskLevel.Low && wbcVal > 100) { currentRisk = RiskLevel.Medium; reason = "初诊标危基因但 WBC > 100×10⁹/L，上调至中危。"; }
      else { reason = currentRisk === RiskLevel.Low ? "初诊标危基因且 WBC ≤ 100×10⁹/L。" : `基于初始遗传学分类：${currentRisk}。`; }
    } else if (stage === 'induction') {
      if (!isCR) { currentRisk = RiskLevel.High; reason = "诱导后骨髓未达 CR，直接判定为高危。"; }
      else if (mrdVal >= 0.1 || wt1Val < 1.0) { currentRisk = RiskLevel.High; reason = `MRD 缓解深度不足 (MRD ≥ 0.1% 或 WT1 下降 < 1log)，转为高危。`; }
      else { reason = "诱导后达 CR 且 MRD/WT1 动力学达标，维持原分层。"; }
    } else if (stage === 'consolidation1') {
      if (mrdVal > 0 || wt1Val < 2.0) { currentRisk = RiskLevel.High; reason = "巩固①后 MRD 持续阳性或 WT1 下降不足 (目标 2log)，最终判定为高危。"; }
      else { reason = "巩固①后评估达标，维持当前治疗方案。"; }
    }
    return { level: currentRisk, reason };
  };

  const renderGeneticPrognosis = () => (
    <div className="space-y-8 animate-ios py-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="inline-flex px-3 py-1 bg-[#FEF9C3] rounded-full text-[10px] font-black text-[#854D0E] uppercase tracking-wider">
          REFERENCE LIBRARY
        </div>
        <h1 className="text-4xl font-black text-[#1C1C1E] tracking-tight">遗传学预后手册</h1>
        <p className="text-sm font-semibold text-[#8E8E93]">AML 遗传学异常及预后价值对照表 (表2)</p>
      </div>

      {/* Manual Table */}
      <GlassCard className="!p-0 overflow-hidden border border-black/[0.03] bg-white/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F8FAFC] text-[11px] font-black text-[#8E8E93] uppercase tracking-widest border-b border-black/[0.02]">
                <th className="px-6 py-5">危险分层</th>
                <th className="px-6 py-5">遗传学异常</th>
                <th className="px-6 py-5">合并异常及临床意义</th>
              </tr>
            </thead>
            <tbody className="text-[13px] font-medium text-[#4A5568]">
              {GENETIC_MANUAL.map((row, i) => (
                <tr key={i} className="border-b border-black/[0.02] hover:bg-white/20 transition-colors">
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black text-white ${
                      row.risk === RiskLevel.Low ? 'bg-[#34C759]' : 
                      row.risk === RiskLevel.Medium ? 'bg-[#FF9500]' : 'bg-[#FF3B30]'
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#1C1C1E]">{row.abnormality}</td>
                  <td className="px-6 py-4 italic text-[#8E8E93]">{row.clinical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Summary Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: '标危特征', 
            icon: <ShieldCheck size={28} />, 
            color: 'text-[#059669]', 
            bg: 'bg-[#ECFDF5]',
            border: 'border-[#10B981]/20',
            desc: '多见于 CBF-AML (t(8;21), inv(16)) 且 MRD 快速阴转者，及 CEBPA 双突变。' 
          },
          { 
            title: '中危特征', 
            icon: <AlertTriangle size={28} />, 
            color: 'text-[#D97706]', 
            bg: 'bg-[#FFFBEB]',
            border: 'border-[#F59E0B]/20',
            desc: '初诊定中危者，若有效使用靶向药物 (如 Gilteritinib) 可显著改善生存。' 
          },
          { 
            title: '高危特征', 
            icon: <div className="text-white font-black">高</div>, 
            color: 'text-[#DC2626]', 
            bg: 'bg-[#FEF2F2]',
            border: 'border-[#EF4444]/20',
            desc: '包含复杂核型、TP53 突变或诱导治疗 2 周骨髓原始细胞仍 > 5% 者。' 
          }
        ].map((feat, i) => (
          <div key={i} className={`${feat.bg} ${feat.border} border rounded-[32px] p-8 space-y-4 shadow-sm group hover:-translate-y-1 transition-all duration-300`}>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feat.color === 'text-[#DC2626]' ? 'bg-[#DC2626]' : 'bg-white shadow-sm'} ${feat.color}`}>
              {feat.icon}
            </div>
            <h3 className={`text-lg font-black ${feat.color}`}>{feat.title}</h3>
            <p className="text-[13px] font-bold text-[#4A5568] leading-relaxed opacity-80">
              {feat.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRiskStratification = () => {
    const { level, reason } = getRiskDetails();
    return (
      <div className="space-y-6 animate-ios pt-4">
        <div className="text-center space-y-1 mb-2">
          <div className="inline-flex px-3 py-1 bg-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-wider mb-2">SCCCG-AML2025 Protocol</div>
          <h1 className="text-3xl font-black text-[#1C1C1E] tracking-tight">危险度分层评估</h1>
          <p className="text-sm text-[#8E8E93] font-medium">综合遗传学、MRD (流式) 与 WT1 动力学判定</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <GlassCard>
              <div className="space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#007AFF]"><Clock size={16} /><span className="text-xs font-bold uppercase">当前治疗阶段</span></div>
                  <div className="bg-[#E3E3E8] p-[3px] rounded-xl flex">
                    {(['initial', 'induction', 'consolidation1'] as StageType[]).map((s) => (
                      <button key={s} onClick={() => setStage(s)} className={`flex-1 py-2 text-[12px] font-bold rounded-[9px] transition-all ${stage === s ? 'bg-white shadow-sm text-[#007AFF]' : 'text-[#8E8E93]'}`}>{s === 'initial' ? '初诊' : s === 'induction' ? '诱导后' : '巩固①后'}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#007AFF]"><Dna size={16} /><span className="text-xs font-bold uppercase">初诊遗传学风险</span></div>
                  <div className="relative">
                    <select value={geneticBase} onChange={(e) => setGeneticBase(e.target.value)} className="w-full appearance-none bg-white border border-black/[0.05] p-4 pr-10 rounded-2xl text-[14px] font-bold text-[#1C1C1E] outline-none">
                      {GENETIC_PROGNOSIS.map((g, idx) => (<option key={idx} value={g.gene}>{g.category}: {g.gene}</option>))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  </div>
                </div>
                {stage === 'initial' ? (
                  <div className="space-y-3">
                    <label className="text-xs font-bold text-[#1C1C1E] block ml-1">初诊外周血 WBC (×10⁹/L)</label>
                    <div className="relative">
                      <input type="number" value={wbc} onChange={(e) => setWbc(e.target.value)} placeholder="0.0" className="w-full bg-white border border-black/[0.05] p-4 rounded-2xl text-lg font-black outline-none" />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-300">X10⁹/L</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/[0.05]">
                      <span className="text-[15px] font-bold">骨髓是否达到 CR?</span>
                      <button onClick={() => setIsCR(!isCR)} className={`w-14 h-8 rounded-full transition-colors relative ${isCR ? 'bg-[#34C759]' : 'bg-[#D1D1D6]'}`}><div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${isCR ? 'right-1' : 'left-1'}`} /></button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><label className="text-[11px] font-black text-[#8E8E93] ml-1 uppercase">流式 MRD (%)</label><input type="number" value={mrd} onChange={(e) => setMrd(e.target.value)} className="w-full bg-white border border-black/[0.05] p-4 rounded-2xl font-black text-lg outline-none" /></div>
                      <div className="space-y-2"><label className="text-[11px] font-black text-[#8E8E93] ml-1 uppercase">WT1 Δlog</label><input type="number" value={wt1DeltaRisk} onChange={(e) => setWt1DeltaRisk(e.target.value)} className="w-full bg-white border border-black/[0.05] p-4 rounded-2xl font-black text-lg outline-none" /></div>
                    </div>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
          <div className="space-y-4">
            <div className="ios-glass rounded-[40px] p-8 flex flex-col items-center justify-center text-center shadow-2xl bg-white/60 border border-white min-h-[400px]">
              <div className={`w-36 h-36 rounded-full flex items-center justify-center shadow-lg mb-6 ${level === RiskLevel.Low ? 'bg-[#34C759]' : level === RiskLevel.Medium ? 'bg-[#FF9500]' : 'bg-[#FF3B30]'}`}>{level === RiskLevel.Low ? <ShieldCheck size={72} color="white" /> : level === RiskLevel.Medium ? <AlertTriangle size={72} color="white" /> : <Biohazard size={72} color="white" />}</div>
              <div className={`text-5xl font-black tracking-tighter mb-6 ${level === RiskLevel.Low ? 'text-[#34C759]' : level === RiskLevel.Medium ? 'text-[#FF9500]' : 'text-[#FF3B30]'}`}>{level}</div>
              <div className="bg-white/60 px-6 py-5 rounded-[24px] border border-black/[0.02] shadow-sm max-w-[280px]"><p className="text-[14px] font-bold text-[#1C1C1E] leading-relaxed">{reason}</p></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderWT1Analysis = () => {
    const deltaLog = calculateDeltaLog();
    return (
      <div className="space-y-8 animate-ios py-6">
        <div className="space-y-3">
          <div className="inline-flex px-3 py-1 bg-[#E0E7FF] rounded-full text-[10px] font-black text-[#4F46E5] uppercase tracking-wider">DYNAMICS MONITORING</div>
          <h1 className="text-4xl font-black text-[#1C1C1E] tracking-tight">WT1 动力学监测</h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 border border-black/[0.03] rounded-xl text-[12px] font-medium text-[#8E8E93]">计算方法 <span className="italic font-bold text-[#1C1C1E]">log [ (上一次数值) ÷ (本次数值) ]</span></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="!p-8">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#007AFF]"><History size={16} /><span className="text-[11px] font-black uppercase tracking-widest">上一次 WT1 表达量 (%)</span></div>
                <div className="relative"><input type="number" value={wt1Prev} onChange={(e) => setWt1Prev(e.target.value)} placeholder="0.00" className="w-full bg-white border border-black/[0.05] p-6 rounded-[24px] text-2xl font-black text-[#1C1C1E] outline-none" /><span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-bold text-[#C7C7CC]">%</span></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-[#FF3B30]"><Target size={16} /><span className="text-[11px] font-black uppercase tracking-widest">本次 WT1 表达量 (%)</span></div>
                <div className="relative"><input type="number" value={wt1Curr} onChange={(e) => setWt1Curr(e.target.value)} placeholder="0.00" className="w-full bg-white border border-black/[0.05] p-6 rounded-[24px] text-2xl font-black text-[#1C1C1E] outline-none" /><span className="absolute right-6 top-1/2 -translate-y-1/2 text-lg font-bold text-[#C7C7CC]">%</span></div>
              </div>
              <div className="pt-6 border-t border-black/[0.03] space-y-4"><span className="text-[11px] font-black text-[#8E8E93] uppercase tracking-widest">预后分界参考 (ΔLOG)</span><div className="grid grid-cols-2 gap-4"><div className="bg-[#34C759]/5 border border-[#34C759]/10 p-4 rounded-2xl"><div className="text-[10px] font-black text-[#34C759] uppercase mb-1">诱导后标危</div><div className="text-lg font-black text-[#1C1C1E]">≥ 1.0</div></div><div className="bg-[#007AFF]/5 border border-[#007AFF]/10 p-4 rounded-2xl"><div className="text-[10px] font-black text-[#007AFF] uppercase mb-1">巩固①后标危</div><div className="text-lg font-black text-[#1C1C1E]">≥ 2.0</div></div></div></div>
            </div>
          </GlassCard>
          <div className="ios-glass rounded-[40px] p-10 flex flex-col items-center justify-center text-center shadow-2xl bg-white/60 border border-white">
            <span className="text-[14px] font-bold text-[#8E8E93] mb-8">计算所得对数下降幅度</span>
            <div className="flex items-baseline gap-2 mb-10"><span className={`text-9xl font-black tracking-tighter ${deltaLog !== null ? 'text-[#1C1C1E]' : 'text-[#C7C7CC]'}`}>{deltaLog !== null ? deltaLog.toFixed(2) : "0.00"}</span><span className="text-2xl font-black text-[#C7C7CC] uppercase">LOG</span></div>
            <button className={`px-10 py-4 rounded-full font-bold text-[15px] shadow-lg transition-all active:scale-95 ${deltaLog === null ? 'bg-[#F2F2F7] text-[#8E8E93]' : deltaLog >= 1.0 ? 'bg-[#34C759] text-white' : 'bg-[#FF3B30] text-white'}`}>{deltaLog === null ? "等待数据录入..." : deltaLog >= 1.0 ? "动力学达标" : "动力学不佳"}</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTargetedDrugs = () => {
    const filteredDrugs = TARGETED_DRUGS.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.target.toLowerCase().includes(searchTerm.toLowerCase()));
    return (
      <div className="space-y-8 animate-ios py-6">
        <div className="space-y-3"><div className="inline-flex px-3 py-1 bg-[#FFF1F2] rounded-full text-[10px] font-black text-[#E11D48] uppercase tracking-wider">PRECISION MEDICINE</div><h1 className="text-4xl font-black text-[#1C1C1E] tracking-tight">靶向药物推荐</h1><p className="text-sm font-semibold text-[#8E8E93]">基于突变谱的个性化治疗选择 (表6)</p></div>
        <div className="relative group"><div className="absolute inset-y-0 left-5 flex items-center pointer-events-none"><Search size={20} className="text-[#C7C7CC] group-focus-within:text-[#007AFF]" /></div><input type="text" placeholder="搜索基因靶点 (如 FLT3) 或药物名称..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white border border-black/[0.05] p-5 pl-14 rounded-[24px] text-[15px] font-bold text-[#1C1C1E] outline-none" /></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredDrugs.map((drug, idx) => (
            <GlassCard key={idx} className="!mb-0 relative hover:shadow-xl transition-all duration-300 border border-white hover:border-blue-500/20">
              <div className="flex justify-between items-start mb-6"><div className="inline-flex px-3 py-1 bg-[#E0F2FE] rounded-full text-[10px] font-black text-[#007AFF] uppercase tracking-widest">{drug.target}</div><Link2 size={18} className="text-[#C7C7CC] hover:text-[#007AFF] cursor-pointer" /></div>
              <h2 className="text-xl font-black text-[#1C1C1E] mb-6 tracking-tight">{drug.name}</h2>
              <div className="space-y-4"><div className="space-y-1.5"><span className="text-[11px] font-black text-[#8E8E93] uppercase tracking-wider">建议用量</span><div className="text-[14px] font-bold text-[#1C1C1E]">{drug.dosage}</div></div><div className="bg-[#F8FAFC] p-4 rounded-2xl border border-black/[0.01]"><span className="text-[11px] font-black text-[#8E8E93] uppercase tracking-wider block mb-1.5">注意事项</span><div className="text-[13px] font-medium text-[#4A5568] italic">{drug.details}</div></div></div>
            </GlassCard>
          ))}
        </div>
        <div className="bg-[#0F172A] p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 bg-[#FACC15] rounded-xl flex items-center justify-center text-[#0F172A]"><Zap size={22} fill="currentColor" /></div><h2 className="text-xl font-black text-white">临床决策要点</h2></div>
          <div className="space-y-6">{[{ id: '01.', text: '维奈克拉 (VEN) 与强效 CYP3A 抑制剂 (如泊沙康唑) 联用时需减量 1/3。' }, { id: '02.', text: '吉瑞替尼仅推荐用于 FLT3-ITD 比率 ≥ 0.5 的初治或复发难治患者。' }, { id: '03.', text: '如有条件，建议尽早 (诱导期) 加入靶向治疗以提高 MRD 阴转率。' }].map((item, i) => (<div key={i} className="flex gap-4 items-start"><span className="text-[14px] font-black text-[#FACC15] mt-0.5">{item.id}</span><p className="text-[14px] font-medium text-blue-100/80">{item.text}</p></div>))}</div>
        </div>
      </div>
    );
  };

  const renderITReference = () => (
    <div className="space-y-8 animate-ios py-6">
      <div className="space-y-3"><div className="inline-flex px-3 py-1 bg-blue-100 rounded-full text-[10px] font-black text-blue-600 uppercase tracking-wider">PROPHYLAXIS</div><h1 className="text-4xl font-black text-[#1C1C1E] tracking-tight">鞘注剂量参考</h1><p className="text-sm font-semibold text-[#8E8E93]">按年龄划分的三联鞘注用量 (表7A)</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {IT_DOSAGES.map((dose, idx) => (
          <div key={idx} className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-black/[0.03] hover:shadow-md transition-shadow">
            <div className="bg-[#1C1C1E] p-6 text-center"><span className="text-[11px] font-black text-white/50 uppercase tracking-[0.2em] block mb-1">适用年龄</span><h2 className="text-3xl font-black text-white tracking-tight">{dose.ageLabel}</h2></div>
            <div className="p-6 space-y-5">
              <div className="flex justify-between items-center text-[14px]"><span className="font-bold text-[#8E8E93]">MTX (甲氨蝶呤)</span><span className="font-black text-blue-600">{dose.mtx}</span></div>
              <div className="flex justify-between items-center text-[14px]"><span className="font-bold text-[#8E8E93]">Ara-C (阿糖胞苷)</span><span className="font-black text-indigo-600">{dose.araC}</span></div>
              <div className="flex justify-between items-center text-[14px]"><span className="font-bold text-[#8E8E93]">DXM (地塞米松)</span><span className="font-black text-green-600">{dose.dxm}</span></div>
              <div className="pt-5 border-t border-black/[0.03] flex justify-between items-center"><span className="text-[11px] font-black text-[#C7C7CC] uppercase tracking-widest">最终容量</span><span className="text-lg font-black text-[#1C1C1E]">{dose.finalVolume}</span></div>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-[#4F46E5] rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-10 relative z-10"><div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white backdrop-blur-md"><Brain size={32} /></div><div><h2 className="text-2xl font-black text-white tracking-tight">中枢受累诊断标准 (CNS 2)</h2><p className="text-blue-100/80 font-bold text-sm">中枢神经系统白血病 (CNSL) 判定标准</p></div></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
          {[{ id: 1, text: "CSF WBC ≤ 5/ul, 但离心涂片或流式细胞术发现 AML 细胞。" }, { id: 2, text: "腰穿损伤但无 AML 细胞，且外周血 WBC > 50×10⁹/L。" }, { id: 3, text: "CSF 正常但影像学 (MRI) 发现明确的软脑膜或脑实质浸润。" }].map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 flex flex-col gap-4 shadow-lg hover:-translate-y-1 transition-transform"><div className="w-8 h-8 bg-[#4F46E5]/10 rounded-lg flex items-center justify-center text-[#4F46E5] font-black text-sm">{item.id}</div><p className="text-[13px] font-bold text-[#1C1C1E]">{item.text}</p></div>
          ))}
        </div>
        <div className="mt-8 bg-black/10 border border-white/10 rounded-2xl p-5 relative z-10"><p className="text-[13px] font-bold text-blue-50 italic">* 注：凡初诊判定为 CNS 2/3 的患者，需增加 IT 频次 (QOD 直至 CSF 阴性，后继续 IT qw × 3)。</p></div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'risk', icon: Calculator, label: '危险度分层' },
    { id: 'genetic', icon: Library, label: '遗传学' },
    { id: 'wt1', icon: Activity, label: 'WT1监测' },
    { id: 'drugs', icon: Pill, label: '靶向治疗' },
    { id: 'it', icon: Stethoscope, label: '鞘注参考' }
  ];

  return (
    <div className="min-h-screen pb-32">
      <div className="fixed top-[-15%] right-[-20%] w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-15%] left-[-20%] w-[500px] h-[500px] bg-indigo-400/10 blur-[120px] rounded-full pointer-events-none" />
      <main className="max-w-screen-xl mx-auto px-6">
        {activeTab === 'risk' && renderRiskStratification()}
        {activeTab === 'genetic' && renderGeneticPrognosis()}
        {activeTab === 'wt1' && renderWT1Analysis()}
        {activeTab === 'drugs' && renderTargetedDrugs()}
        {activeTab === 'it' && renderITReference()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 ios-tab-glass px-10 pt-4 pb-8 safe-area-bottom z-50">
        <div className="max-w-screen-sm mx-auto flex justify-between items-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`flex flex-col items-center gap-1.5 transition-all group ${isSelected ? 'text-[#007AFF] scale-110' : 'text-[#C7C7CC] hover:text-[#8E8E93]'}`}>
                <div className={`p-2 rounded-[14px] transition-all ${isSelected ? 'bg-blue-50 shadow-sm' : 'bg-transparent'}`}><Icon size={24} strokeWidth={isSelected ? 2.5 : 2} /></div>
                <span className={`text-[10px] font-black uppercase tracking-tight ${isSelected ? 'opacity-100' : 'opacity-60'}`}>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default App;
