import React from 'react';

const sourceConfig = {
  '1mg':       { text: 'text-red-600',   bg: 'bg-red-50',   dot: 'bg-red-300',   border: 'border-red-100' },
  'Pharmeasy': { text: 'text-green-600', bg: 'bg-green-50', dot: 'bg-green-300', border: 'border-green-100' },
  'Netmeds':   { text: 'text-blue-600',  bg: 'bg-blue-50',  dot: 'bg-blue-300',  border: 'border-blue-100' },
};

const parsePrice = p => parseFloat(p?.replace(/[^0-9.]/g, '') || 0);

const ResultsTable = ({ results }) => {
  if (!results || results.length === 0) return null;

  const cheapest = results[0];
  const priciest = results[results.length - 1];
  const savings  = parsePrice(priciest.price) - parsePrice(cheapest.price);

  return (
    <div>
      {/* Section label */}
      <div className="mb-4">
        <div className="text-xs font-bold tracking-widest uppercase text-green-600 mb-1">Price Comparison</div>
        <div className="text-2xl font-extrabold text-gray-900">{results.length} results found</div>
      </div>

      {/* Savings banner */}
      {savings > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5 flex items-center justify-between mb-5 gap-4">
          <div>
            <div className="text-xs font-semibold text-green-700 mb-1">💰 You could save up to</div>
            <div className="text-3xl font-extrabold text-green-700">₹{savings.toFixed(2)}</div>
            <div className="text-xs text-green-400 mt-1">vs most expensive option</div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-green-600 uppercase tracking-wide mb-1">Cheapest</div>
            <div className="text-2xl font-extrabold text-gray-900">{cheapest.price}</div>
            <div className="text-xs text-gray-400 max-w-[180px] text-right">{cheapest.name}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-4 gap-3 px-5 py-3 bg-gray-50 border-b border-gray-100">
          {['Medicine', 'Source', 'Price', 'Link'].map(h => (
            <div key={h} className="text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</div>
          ))}
        </div>

        {/* Rows */}
        {results.map((item, i) => {
          const cfg = sourceConfig[item.source] || { text: 'text-gray-600', bg: 'bg-gray-50', dot: 'bg-gray-300', border: 'border-gray-100' };
          const isBest = i === 0;
          return (
            <div
              key={i}
              className={`grid grid-cols-4 gap-3 px-5 py-4 border-b border-gray-50 last:border-0 items-center hover:bg-gray-50 transition-colors duration-100 ${isBest ? 'bg-green-50' : ''}`}
            >
              {/* Name */}
              <div className="flex items-center gap-2 min-w-0">
                {isBest && (
                  <span className="shrink-0 text-xs font-extrabold px-2 py-0.5 rounded-full bg-green-600 text-white uppercase tracking-wide">
                    Best
                  </span>
                )}
                <span className={`text-sm truncate ${isBest ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {item.name}
                </span>
              </div>

              {/* Source */}
              <div>
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${cfg.text} ${cfg.bg} border ${cfg.border}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                  {item.source}
                </span>
              </div>

              {/* Price */}
              <div className={`text-base font-extrabold ${isBest ? 'text-green-600' : 'text-gray-900'}`}>
                {item.price}
              </div>

              {/* Link */}
              <div>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-600 text-xs font-bold border border-green-200 hover:bg-green-600 hover:text-white transition-all duration-150"
                >
                  Buy
                </a>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-right mt-2 text-xs text-gray-400">
        Sorted cheapest first · {results.length} results across 3 pharmacies
      </div>
    </div>
  );
};

export default ResultsTable;