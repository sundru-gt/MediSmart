import React from 'react';

const confidenceConfig = {
  exact_match:    { label: 'Exact Match',    icon: '✓', text: 'text-green-700', bg: 'bg-green-50',  border: 'border-green-200', desc: 'Same salt & dose · Safe to switch' },
  same_class:     { label: 'Same Class',     icon: '~', text: 'text-amber-700', bg: 'bg-amber-50',  border: 'border-amber-200', desc: 'Same salt, different dose · Check with pharmacist' },
  consult_doctor: { label: 'Consult Doctor', icon: '!', text: 'text-red-700',   bg: 'bg-red-50',    border: 'border-red-200',   desc: 'Different salt · Consult your doctor' },
};

const AIAnalysis = ({ aiAnalysis }) => {
  if (!aiAnalysis || !aiAnalysis.activeSalt || aiAnalysis.activeSalt === 'Unknown') return null;

  return (
    <div>
      {/* Section label */}
      <div className="mb-4">
        <div className="text-xs font-bold tracking-widest uppercase text-green-600 mb-1">AI Analysis</div>
        <div className="text-2xl font-extrabold text-gray-900">Salt Composition</div>
      </div>

      {/* Salt card */}
      <div className="bg-gray-900 rounded-2xl p-6 mb-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-green-500 opacity-5 rounded-full translate-x-10 -translate-y-10" />
        <div className="flex justify-between items-start gap-4 relative">
          <div className="flex-1">
            <div className="text-xs font-bold tracking-widest uppercase text-gray-500 mb-2">Active Salt Identified</div>
            <div className="text-3xl font-extrabold text-green-400 mb-2 leading-tight">{aiAnalysis.activeSalt}</div>
            <div className="text-sm text-gray-400 leading-relaxed max-w-sm">{aiAnalysis.saltDescription}</div>
          </div>
          <div className="shrink-0 bg-green-500 bg-opacity-10 border border-green-500 border-opacity-20 rounded-xl p-4 text-center">
            <div className="text-3xl font-extrabold text-green-400 leading-none">{aiAnalysis.alternatives?.length || 0}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wide">alternatives</div>
          </div>
        </div>
      </div>

      {/* Alternatives */}
      {aiAnalysis.alternatives?.length > 0 && (
        <div>
          <div className="text-sm font-bold text-gray-700 mb-3">Cheaper Alternatives</div>
          <div className="flex flex-col gap-3">
            {aiAnalysis.alternatives.map((alt, i) => {
              const cfg = confidenceConfig[alt.confidence] || confidenceConfig.consult_doctor;
              return (
                <div
                  key={i}
                  className="bg-white border border-gray-100 rounded-xl p-4 flex items-start justify-between gap-4 hover:border-green-400 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 mb-1">{alt.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{alt.reason}</div>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.text} ${cfg.bg} ${cfg.border}`}>
                      <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-xs font-black ${cfg.text.replace('text-', 'bg-')}`}>
                        {cfg.icon}
                      </span>
                      {cfg.label}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">{cfg.desc}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-extrabold text-green-600">{alt.price}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{alt.source}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-5 p-4 bg-amber-50 rounded-xl border-2 border-amber-400 flex gap-3 items-start shadow-sm">
        <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-lg shrink-0">⚕️</div>
        <div>
          <div className="text-xs font-extrabold text-amber-800 mb-1 uppercase tracking-wide">Medical Disclaimer</div>
          <p className="text-xs text-amber-700 leading-relaxed">{aiAnalysis.disclaimer}</p>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;