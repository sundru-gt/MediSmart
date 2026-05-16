import React from 'react';

const sourceConfig = {
  '1mg':       { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  'Pharmeasy': { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  'Netmeds':   { color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
};

const parsePrice = p => parseFloat(p?.replace(/[^0-9.]/g, '') || 0);

const ResultsTable = ({ results }) => {
  if (!results || results.length === 0) return null;

  const cheapest = results[0];
  const priciest = results[results.length - 1];
  const savings  = parsePrice(priciest.price) - parsePrice(cheapest.price);

  return (
    <div>
      <style>{`
        .tm-card {
          background: #fff;
          border: 1.5px solid #e8edf2;
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.2s;
          margin-bottom: 12px;
        }
        .tm-card:hover {
          border-color: #16a34a;
          box-shadow: 0 4px 20px rgba(22,163,74,0.10);
          transform: translateY(-1px);
        }
        .tm-med-icon {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border: 1.5px solid #bbf7d0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          flex-shrink: 0;
        }
        .tm-buy-btn {
          padding: 8px 20px;
          background: #16a34a;
          color: #fff;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          text-decoration: none;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tm-buy-btn:hover { background: #15803d; }
        .tm-savings-strip {
          background: linear-gradient(135deg, #f0fdf4, #dcfce7);
          border: 1.5px solid #bbf7d0;
          border-radius: 14px;
          padding: 18px 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          gap: 16px;
        }
        .tm-section-title {
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

      {/* Savings strip */}
      {savings > 0 && (
        <div className="tm-savings-strip">
          <div>
            <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 600, fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>
              💰 Potential savings on this search
            </div>
            <div style={{ fontSize: '30px', fontWeight: 800, color: '#15803d', fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1 }}>
              ₹{savings.toFixed(2)}
            </div>
            <div style={{ fontSize: '12px', color: '#4ade80', fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: '2px' }}>
              vs most expensive option
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
              Cheapest Available
            </div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {cheapest.price}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: '200px', textAlign: 'right' }}>
              {cheapest.name}
            </div>
          </div>
        </div>
      )}

      {/* Section title */}
      <div className="tm-section-title">
        🏪 All Results
        <span style={{ fontSize: '13px', fontWeight: 500, color: '#64748b' }}>
          ({results.length} found · sorted cheapest first)
        </span>
      </div>

      {/* Medicine cards */}
      {results.map((item, i) => {
        const cfg = sourceConfig[item.source] || { color: '#6b7280', bg: '#f9fafb', border: '#e5e7eb' };
        const isBest = i === 0;
        const priceNum = parsePrice(item.price);
        const savingVsCheapest = priceNum - parsePrice(cheapest.price);
        const pctOff = priciest.price !== cheapest.price
          ? Math.round(((parsePrice(priciest.price) - priceNum) / parsePrice(priciest.price)) * 100)
          : 0;

        return (
          <div key={i} className="tm-card" style={{ background: isBest ? '#f0fdf4' : '#fff', borderColor: isBest ? '#16a34a' : '#e8edf2' }}>
            {/* Icon */}
            <div className="tm-med-icon">💊</div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                {isBest && (
                  <span style={{
                    fontSize: '10px', fontWeight: 800, padding: '2px 10px',
                    borderRadius: '100px', background: '#16a34a', color: '#fff',
                    textTransform: 'uppercase', letterSpacing: '0.5px',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}>Best Price</span>
                )}
                {pctOff > 0 && (
                  <span style={{
                    fontSize: '10px', fontWeight: 700, padding: '2px 8px',
                    borderRadius: '100px', background: '#fff7ed', color: '#ea580c',
                    border: '1px solid #fed7aa', fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}>{pctOff}% cheaper</span>
                )}
              </div>
              <div style={{
                fontSize: '14px', fontWeight: isBest ? 700 : 500,
                color: '#0f172a', fontFamily: 'Plus Jakarta Sans, sans-serif',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                marginBottom: '6px',
              }}>
                {item.name}
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '5px',
                fontSize: '11px', fontWeight: 600, color: cfg.color,
                background: cfg.bg, padding: '2px 10px', borderRadius: '100px',
                border: `1px solid ${cfg.border}`, fontFamily: 'Plus Jakarta Sans, sans-serif',
              }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                {item.source}
              </span>
            </div>

            {/* Price + Buy */}
            <div style={{ textAlign: 'right', flexShrink: 0 }}>
              <div style={{
                fontSize: '22px', fontWeight: 800,
                color: isBest ? '#16a34a' : '#0f172a',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                marginBottom: '8px',
              }}>
                {item.price}
              </div>
              <a href={item.link} target="_blank" rel="noreferrer" className="tm-buy-btn">
                Buy Now
              </a>
            </div>
          </div>
        );
      })}

      <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '11px', color: '#94a3b8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        Prices are live and may vary · Always verify on the pharmacy website
      </div>
    </div>
  );
};

export default ResultsTable;