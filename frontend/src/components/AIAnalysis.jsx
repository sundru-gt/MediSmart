import React from 'react';

const confidenceConfig = {
  exact_match:    { label: 'Exact Match',    icon: '✓', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0', desc: 'Same salt & dose · Safe to switch' },
  same_class:     { label: 'Same Class',     icon: '~', color: '#d97706', bg: '#fffbeb', border: '#fde68a', desc: 'Same salt, different dose · Check with pharmacist' },
  consult_doctor: { label: 'Consult Doctor', icon: '!', color: '#dc2626', bg: '#fef2f2', border: '#fecaca', desc: 'Different salt · Consult your doctor' },
};

const AIAnalysis = ({ aiAnalysis }) => {
  if (!aiAnalysis || !aiAnalysis.activeSalt || aiAnalysis.activeSalt === 'Unknown') return null;

  return (
    <div>
      <style>{`
        .ai-salt-header {
          background: #0f172a;
          border-radius: 16px;
          padding: 24px;
          margin-bottom: 20px;
          position: relative;
          overflow: hidden;
        }
        .ai-salt-header::after {
          content: '💊';
          position: absolute;
          right: 24px;
          bottom: -10px;
          font-size: 80px;
          opacity: 0.06;
        }
        .ai-alt-card {
          background: #fff;
          border: 1.5px solid #e8edf2;
          border-radius: 14px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 10px;
          transition: all 0.2s;
        }
        .ai-alt-card:hover {
          border-color: #16a34a;
          box-shadow: 0 4px 16px rgba(22,163,74,0.08);
          transform: translateY(-1px);
        }
        .ai-conf-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 10px;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 100px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-top: 6px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .ai-section-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
      `}</style>

      {/* Salt header */}
      <div className="ai-salt-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>
              Active Salt Identified
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#4ade80', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px', lineHeight: 1.1 }}>
              {aiAnalysis.activeSalt}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: '320px' }}>
              {aiAnalysis.saltDescription}
            </div>
          </div>
          <div style={{
            background: 'rgba(74,222,128,0.1)',
            border: '1px solid rgba(74,222,128,0.2)',
            borderRadius: '12px',
            padding: '14px 18px',
            textAlign: 'center',
            flexShrink: 0,
          }}>
            <div style={{ fontSize: '32px', fontWeight: 800, color: '#4ade80', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1 }}>
              {aiAnalysis.alternatives?.length || 0}
            </div>
            <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '1px' }}>
              alternatives
            </div>
          </div>
        </div>
      </div>

      {/* Alternatives */}
      {aiAnalysis.alternatives?.length > 0 && (
        <>
          <div className="ai-section-title">
            🤖 Cheaper Alternatives
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#64748b' }}>AI-powered suggestions</span>
          </div>

          {aiAnalysis.alternatives.map((alt, i) => {
            const cfg = confidenceConfig[alt.confidence] || confidenceConfig.consult_doctor;
            return (
              <div key={i} className="ai-alt-card">
                {/* Icon */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '10px',
                  background: cfg.bg, border: `1.5px solid ${cfg.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                }}>
                  💊
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '2px' }}>
                    {alt.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>
                    {alt.reason}
                  </div>
                  <span className="ai-conf-badge" style={{ background: cfg.bg, color: cfg.color, border: `1.5px solid ${cfg.border}` }}>
                    <span style={{
                      width: '14px', height: '14px', borderRadius: '50%',
                      background: cfg.color, color: '#fff', fontSize: '9px',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, flexShrink: 0,
                    }}>{cfg.icon}</span>
                    {cfg.label}
                  </span>
                  <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {cfg.desc}
                  </div>
                </div>

                {/* Price */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#16a34a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {alt.price}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: '2px' }}>
                    {alt.source}
                  </div>
                </div>
              </div>
            );
          })}
        </>
      )}

      {/* Disclaimer — prominent */}
      <div style={{
        marginTop: '20px',
        padding: '20px 22px',
        background: 'linear-gradient(135deg, #fffbeb, #fef3c7)',
        borderRadius: '14px',
        border: '2px solid #f59e0b',
        display: 'flex',
        gap: '14px',
        alignItems: 'flex-start',
        boxShadow: '0 2px 12px rgba(245,158,11,0.15)',
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: '#f59e0b', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '18px', flexShrink: 0,
        }}>⚕️</div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#78350f', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px', letterSpacing: '0.2px' }}>
            Medical Disclaimer
          </div>
          <p style={{ fontSize: '12px', color: '#92400e', lineHeight: 1.7, margin: 0, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {aiAnalysis.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;