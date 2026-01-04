
import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Activity, 
  Pill, 
  Stethoscope, 
  ChevronRight, 
  Info,
  Droplets,
  AlertCircle,
  RotateCcw,
  Dna,
  Layers,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock
} from 'lucide-react';
import { GENETIC_PROGNOSIS, TARGETED_DRUGS, IT_DOSAGES, TABLE2_GENETIC_PROGNOSIS } from './data';
import { RiskLevel, PrognosisType } from './types';
import GlassCard from './components/GlassCard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'risk' | 'wt1' | 'drugs' | 'it'>('risk');
  const [riskSubTab, setRiskSubTab] = useState<'calc' | 'ref'>('calc');

  // Comprehensive Risk States
  const [geneticRisk, setGeneticRisk] = useState<RiskLevel | null>(null);
  const [wbcOver100, setWbcOver100] = useState(false);
  const [mrdResult, setMrdResult] = useState<'low' | 'high' | null>(null);
  const [assessmentStage, setAssessmentStage] = useState<'induction' | 'consolidation1'>('induction');
  
  // WT1 States (Shared between calculator and standalone tab)
  const [wt1Initial, setWt1Initial] = useState<string>('');
  const [wt1Current, setWt1Current] = useState<string>('');

  const getWt1LogReduction = () => {
    const init = parseFloat(wt1Initial);
    const curr = parseFloat(wt1Current);
    if (isNaN(init) || isNaN(curr) || init <= 0) return null;
    const floor = 0.00001; 
    const effectiveCurr = curr <= 0 ? floor : curr;
    return Math.log10(init) - Math.log10(effectiveCurr);
  };

  const isWt1ResponseGood = () => {
    const logRed = getWt1LogReduction();
    if (logRed === null) return true; // Assume good if not tested or provide warning
    if (assessmentStage === 'induction') return logRed >= 1.0;
    return logRed >= 2.0;
  };

  const calculateFinalRisk = () => {
    if (!geneticRisk) return null;
    
    let finalRisk = geneticRisk;
    const wt1Good = isWt1ResponseGood();
    const mrdGood = mrdResult === 'low' || mrdResult === null;

    // Logic for Upgrading Risk based on response
    if (geneticRisk === RiskLevel.Low) {
      if (wbcOver100 || mrdResult === 'high' || !wt1Good) {
        finalRisk = RiskLevel.Medium;
      }
    } else if (geneticRisk === RiskLevel.Medium) {
      if (mrdResult === 'high' || !wt1Good) {
        finalRisk = RiskLevel.High;
      }
    }

    return finalRisk;
  };

  const resetRisk = () => {
    setGeneticRisk(null);
    setWbcOver100(false);
    setMrdResult(null);
    setWt1Initial('');
    setWt1Current('');
  };

  const renderRiskStratification = () => {
    const finalRisk = calculateFinalRisk();
    const wt1Log = getWt1LogReduction();
    
    return (
      <div className="space-y-4 animate-in fade-in duration-500">
        <div className="flex flex-col gap-4 px-2 pt-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">综合危险度评估</h1>
            {riskSubTab === 'calc' && (
              <button onClick={resetRisk} className="text-blue-500 p-2 hover:bg-blue-50 rounded-full transition-colors">
                <RotateCcw size={20} />
              </button>
            )}
          </div>
          
          <div className="bg-gray-200/50 p-1 rounded-xl flex">
            <button 
              onClick={() => setRiskSubTab('calc')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${riskSubTab === 'calc' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              综合判定 (表3)
            </button>
            <button 
              onClick={() => setRiskSubTab('ref')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${riskSubTab === 'ref' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
            >
              基因预后 (表2)
            </button>
          </div>
        </div>

        {riskSubTab === 'calc' ? (
          <>
            {/* 1. Genetics Selection */}
            <GlassCard title="1. 初始遗传基因预后">
              <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
                {GENETIC_PROGNOSIS.map((g, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setGeneticRisk(g.category)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all border ${
                      geneticRisk === g.category 
                        ? 'bg-blue-500 text-white shadow-lg border-blue-600' 
                        : 'bg-white/50 text-gray-800 border-transparent hover:border-blue-200'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-semibold text-sm leading-tight">{g.gene}</div>
                      <div className={`text-[10px] mt-0.5 ${geneticRisk === g.category ? 'text-blue-100' : 'text-gray-400'}`}>
                        {g.category}
                      </div>
                    </div>
                    {geneticRisk === g.category && <CheckCircle2 size={16} />}
                  </button>
                ))}
              </div>
            </GlassCard>

            {/* 2. Assessment Stage & Response */}
            <GlassCard title="2. 治疗反应评估 (动力学)">
              <div className="space-y-4">
                {/* Stage Selection */}
                <div className="flex gap-2">
                  <button 
                    onClick={() => setAssessmentStage('induction')}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1.5 ${assessmentStage === 'induction' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                  >
                    <Clock size={12} /> 诱导结束后
                  </button>
                  <button 
                    onClick={() => setAssessmentStage('consolidation1')}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-1.5 ${assessmentStage === 'consolidation1' ? 'bg-blue-100 border-blue-300 text-blue-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}
                  >
                    <Clock size={12} /> 巩固①结束后
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {/* WBC Check (Only relevant for Low Risk initially) */}
                  <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/50">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">初诊 WBC > 100×10⁹/L</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={wbcOver100} 
                      onChange={e => setWbcOver100(e.target.checked)}
                      className="w-5 h-5 accent-blue-500" 
                    />
                  </div>

                  {/* MRD Result */}
                  <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/50">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-700">流式 MRD 状态</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setMrdResult('low')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${mrdResult === 'low' ? 'bg-green-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
                      >
                        达标
                      </button>
                      <button 
                        onClick={() => setMrdResult('high')}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${mrdResult === 'high' ? 'bg-red-500 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}
                      >
                        不达标
                      </button>
                    </div>
                  </div>

                  {/* WT1 Values Integrated */}
                  <div className="p-3 bg-white/40 rounded-xl border border-white/50 space-y-3">
                    <span className="text-sm font-medium text-gray-700 block">WT1 表达 (用于对数评估)</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <input 
                          type="number" 
                          value={wt1Initial}
                          onChange={e => setWt1Initial(e.target.value)}
                          placeholder="初诊 %"
                          className="w-full bg-white/60 p-2.5 rounded-lg border border-transparent focus:border-blue-300 outline-none text-xs font-bold"
                        />
                        <span className="absolute right-2 top-2.5 text-[8px] font-black text-gray-300">%</span>
                      </div>
                      <div className="relative">
                        <input 
                          type="number" 
                          value={wt1Current}
                          onChange={e => setWt1Current(e.target.value)}
                          placeholder="当前 %"
                          className="w-full bg-white/60 p-2.5 rounded-lg border border-transparent focus:border-blue-300 outline-none text-xs font-bold"
                        />
                        <span className="absolute right-2 top-2.5 text-[8px] font-black text-gray-300">%</span>
                      </div>
                    </div>
                    {wt1Log !== null && (
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-[10px] text-gray-400">Log 下降: <b className="text-blue-600">{wt1Log.toFixed(2)}</b></span>
                        <span className={`text-[10px] font-bold ${isWt1ResponseGood() ? 'text-green-500' : 'text-red-500'}`}>
                          {isWt1ResponseGood() ? 'WT1 达标' : 'WT1 不达标'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Final Integrated Result Card */}
            <div className="ios-glass p-6 rounded-3xl flex flex-col items-center justify-center text-center shadow-xl border border-blue-200/50 bg-white/40 mb-2">
              <div className="text-blue-500/60 text-[10px] font-black uppercase tracking-[0.2em] mb-1">综合分层结论</div>
              <div className={`text-5xl font-black transition-all ${
                !finalRisk ? 'text-gray-300' :
                finalRisk === RiskLevel.Low ? 'text-green-500' : 
                finalRisk === RiskLevel.Medium ? 'text-orange-500' : 'text-red-600'
              }`}>
                {finalRisk || "等待评估"}
              </div>
              
              {geneticRisk && finalRisk && geneticRisk !== finalRisk && (
                <div className="mt-2 text-[11px] text-red-500 font-bold flex items-center gap-1">
                  <AlertCircle size={12} /> 因动力学不达标已上调分层
                </div>
              )}

              {/* Status Dashboard */}
              <div className="mt-4 w-full grid grid-cols-3 gap-2 border-t border-gray-100 pt-4">
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[8px] font-black text-gray-400">遗传学</div>
                  {geneticRisk ? <CheckCircle2 size={14} className="text-blue-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-dashed border-gray-300" />}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[8px] font-black text-gray-400">MRD</div>
                  {mrdResult === 'low' ? <CheckCircle2 size={14} className="text-green-500" /> : mrdResult === 'high' ? <XCircle size={14} className="text-red-500" /> : <div className="w-3.5 h-3.5 rounded-full border border-dashed border-gray-300" />}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-[8px] font-black text-gray-400">WT1</div>
                  {wt1Log === null ? <div className="w-3.5 h-3.5 rounded-full border border-dashed border-gray-300" /> : isWt1ResponseGood() ? <CheckCircle2 size={14} className="text-green-500" /> : <XCircle size={14} className="text-red-500" />}
                </div>
              </div>
            </div>
            
            <p className="text-[10px] text-center text-gray-400 px-4 leading-relaxed">
              基于 SCCCG-AML2025: 标危/中危患者如 MRD 不达标或 WT1 下降不足，建议按高一级危险度处理。
            </p>
          </>
        ) : (
          /* Table 2 View (Reference) */
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            {TABLE2_GENETIC_PROGNOSIS.map((group, idx) => (
              <div key={idx} className="space-y-3">
                <div className="flex items-center gap-2 px-2">
                  <Dna size={16} className={
                    group.type === PrognosisType.Favorable ? 'text-green-500' :
                    group.type === PrognosisType.Intermediate ? 'text-orange-500' : 'text-red-500'
                  } />
                  <h2 className="text-lg font-black text-gray-800">{group.type}</h2>
                </div>
                <div className="space-y-3">
                  {group.markers.map((marker, mIdx) => (
                    <GlassCard key={mIdx} className="!mb-0 border-white/60">
                      <div className="flex items-baseline justify-between mb-2">
                        <div className="text-base font-bold text-blue-700">{marker.name}</div>
                        <div className="text-[10px] font-medium text-gray-400">{marker.description}</div>
                      </div>
                      {marker.significance && (
                        <div className="mb-3 p-2.5 bg-blue-50/50 rounded-xl text-[11px] text-blue-900/80 border border-blue-100/50">
                          {marker.significance}
                        </div>
                      )}
                      {marker.modifiers && marker.modifiers.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[9px] font-black text-gray-400 uppercase flex items-center gap-1">
                            <Layers size={10} /> 合并其他异常
                          </div>
                          {marker.modifiers.map((mod, modIdx) => (
                            <div key={modIdx} className="bg-white/40 p-2 rounded-lg border border-white/60 text-[10px]">
                              <b className="text-gray-700">{mod.condition}:</b> <span className="text-gray-500">{mod.impact}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </GlassCard>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderWT1AnalysisStandAlone = () => {
    const logRed = getWt1LogReduction();
    return (
      <div className="space-y-4 animate-in slide-in-from-right duration-500">
        <h1 className="text-2xl font-bold px-2 pt-4">WT1 动力学参考</h1>
        <GlassCard title="快捷计算器">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 ml-1">初诊 WT1 (%)</label>
                <input 
                  type="number" 
                  value={wt1Initial}
                  onChange={e => setWt1Initial(e.target.value)}
                  className="w-full bg-white/60 p-3 rounded-xl border border-transparent focus:border-blue-300 outline-none font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-400 ml-1">当前评估 WT1 (%)</label>
                <input 
                  type="number" 
                  value={wt1Current}
                  onChange={e => setWt1Current(e.target.value)}
                  className="w-full bg-white/60 p-3 rounded-xl border border-transparent focus:border-blue-300 outline-none font-bold"
                />
              </div>
            </div>
          </div>
        </GlassCard>

        {logRed !== null && (
          <div className="ios-glass p-8 rounded-[2.5rem] text-center space-y-6 bg-white/40 border border-blue-200/50">
            <div>
              <div className="text-blue-500/60 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Log 下降对数值</div>
              <div className="text-7xl font-black text-blue-600 tracking-tighter">
                {logRed.toFixed(2)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-4 rounded-2xl border ${logRed >= 1 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                <div className="text-[9px] font-black mb-1">诱导后 (≥1)</div>
                <div className="text-xs font-bold">{logRed >= 1 ? '达标' : '未达标'}</div>
              </div>
              <div className={`p-4 rounded-2xl border ${logRed >= 2 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                <div className="text-[9px] font-black mb-1">巩固① (≥2)</div>
                <div className="text-xs font-bold">{logRed >= 2 ? '达标' : '未达标'}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Rest of the render components (Drugs, IT) stay similar but styled consistently
  const renderTargetedDrugs = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-500">
      <h1 className="text-2xl font-bold px-2 pt-4">靶向药物推荐</h1>
      <div className="space-y-3">
        {TARGETED_DRUGS.map((drug, idx) => (
          <GlassCard key={idx} className="group relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase mb-2">
                  Target: {drug.target}
                </div>
                <h2 className="text-lg font-bold">{drug.name}</h2>
              </div>
              <Pill size={20} className="text-blue-500" />
            </div>
            <div className="space-y-2">
              <div className="bg-white/40 p-3 rounded-xl border border-white/50">
                <div className="text-[9px] text-gray-400 font-black uppercase mb-1">参考剂量</div>
                <div className="text-xs font-bold text-gray-800">{drug.dosage}</div>
              </div>
              <div className="bg-orange-50/60 p-3 rounded-xl text-[11px] text-orange-900 border border-orange-100/50">
                <b>注意：</b>{drug.precautions}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );

  const renderITReference = () => (
    <div className="space-y-4 animate-in slide-in-from-right duration-500">
      <h1 className="text-2xl font-bold px-2 pt-4">鞘注 (IT) 参考</h1>
      {IT_DOSAGES.map((dose, idx) => (
        <GlassCard key={idx}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-5 bg-blue-500 rounded-full" />
            <h2 className="text-lg font-bold">年龄：{dose.ageLabel}</h2>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'MTX', val: dose.mtx },
              { label: 'Ara-C', val: dose.araC },
              { label: 'DXM', val: dose.dxm }
            ].map((item, i) => (
              <div key={i} className="bg-white/60 p-3 rounded-xl text-center shadow-sm">
                <div className="text-[8px] text-gray-400 font-black uppercase mb-1">{item.label}</div>
                <div className="text-sm font-black">{item.val}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-blue-600 p-3 rounded-xl flex justify-between items-center text-white">
            <span className="text-[9px] font-black uppercase opacity-80">补足盐水至</span>
            <span className="text-sm font-black">{dose.finalVolume}</span>
          </div>
        </GlassCard>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F2F2F7] pb-28">
      <div className="fixed top-[-10%] right-[-10%] w-80 h-80 bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] left-[-10%] w-80 h-80 bg-indigo-400/10 blur-[120px] rounded-full pointer-events-none" />

      <header className="sticky top-0 z-40 ios-glass border-b border-white/20 px-4 py-3 text-center">
        <div className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">SCCCG-AML2025</div>
        <div className="text-xs font-bold text-gray-400 italic">多维综合评估系统</div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-2">
        {activeTab === 'risk' && renderRiskStratification()}
        {activeTab === 'wt1' && renderWT1AnalysisStandAlone()}
        {activeTab === 'drugs' && renderTargetedDrugs()}
        {activeTab === 'it' && renderITReference()}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 ios-glass border-t border-white/20 px-6 pt-3 pb-8 safe-area-bottom z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <button onClick={() => setActiveTab('risk')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'risk' ? 'text-blue-600 scale-110' : 'text-gray-400 opacity-60'}`}>
            <Calculator size={22} strokeWidth={activeTab === 'risk' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">评估</span>
          </button>
          <button onClick={() => setActiveTab('wt1')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'wt1' ? 'text-blue-600 scale-110' : 'text-gray-400 opacity-60'}`}>
            <Activity size={22} strokeWidth={activeTab === 'wt1' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">WT1</span>
          </button>
          <button onClick={() => setActiveTab('drugs')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'drugs' ? 'text-blue-600 scale-110' : 'text-gray-400 opacity-60'}`}>
            <Pill size={22} strokeWidth={activeTab === 'drugs' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">靶向</span>
          </button>
          <button onClick={() => setActiveTab('it')} className={`flex flex-col items-center gap-1 transition-all ${activeTab === 'it' ? 'text-blue-600 scale-110' : 'text-gray-400 opacity-60'}`}>
            <Stethoscope size={22} strokeWidth={activeTab === 'it' ? 2.5 : 2} />
            <span className="text-[9px] font-black uppercase tracking-tighter">鞘注</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default App;
