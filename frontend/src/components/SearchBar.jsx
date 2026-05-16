import React, { useState, useEffect } from 'react';

const medicines = ['Dolo 650', 'Paracetamol', 'Azithromycin', 'Metformin', 'Atorvastatin', 'Pantoprazole', 'Crocin', 'Amoxicillin'];

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [tickerIdx, setTickerIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [charIdx, setCharIdx] = useState(0);

  // Animated ticker effect
  useEffect(() => {
    if (query) return; // Don't animate if user is typing

    const current = `Search for ${medicines[tickerIdx]}...`;

    if (typing) {
      if (charIdx < current.length) {
        const t = setTimeout(() => {
          setPlaceholder(current.slice(0, charIdx + 1));
          setCharIdx(c => c + 1);
        }, 60);
        return () => clearTimeout(t);
      } else {
        const t = setTimeout(() => setTyping(false), 1500);
        return () => clearTimeout(t);
      }
    } else {
      if (charIdx > 0) {
        const t = setTimeout(() => {
          setPlaceholder(current.slice(0, charIdx - 1));
          setCharIdx(c => c - 1);
        }, 30);
        return () => clearTimeout(t);
      } else {
        setTickerIdx(i => (i + 1) % medicines.length);
        setTyping(true);
      }
    }
  }, [charIdx, typing, tickerIdx, query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div style={{ width: '100%', maxWidth: '700px', margin: '0 auto' }}>
      <style>{`
        .tm-search-outer {
          display: flex;
          border-radius: 12px;
          border: 2px solid #e2e8f0;
          background: #fff;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.08);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .tm-search-outer:focus-within {
          border-color: #16a34a;
          box-shadow: 0 4px 32px rgba(22,163,74,0.15);
        }
        .tm-input {
          flex: 1;
          padding: 18px 20px;
          border: none;
          outline: none;
          font-size: 16px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          color: #1e293b;
          background: transparent;
        }
        .tm-input::placeholder { color: #94a3b8; }
        .tm-search-btn {
          padding: 0 36px;
          background: #16a34a;
          color: #fff;
          border: none;
          font-size: 16px;
          font-weight: 700;
          font-family: 'Plus Jakarta Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .tm-search-btn:hover { background: #15803d; }
        .tm-search-btn:disabled { background: #86efac; cursor: not-allowed; }
        .tm-quick {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 14px;
          align-items: center;
        }
        .tm-quick-chip {
          padding: 5px 14px;
          border-radius: 100px;
          border: 1.5px solid #e2e8f0;
          background: #fff;
          color: #475569;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s;
        }
        .tm-quick-chip:hover {
          border-color: #16a34a;
          color: #16a34a;
          background: #f0fdf4;
        }
      `}</style>

      <form onSubmit={handleSubmit}>
        <div className="tm-search-outer">
          <span style={{ display: 'flex', alignItems: 'center', paddingLeft: '20px', color: '#94a3b8', flexShrink: 0 }}>
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            className="tm-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
          />
          <button className="tm-search-btn" type="submit" disabled={loading}>
            {loading ? (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 0.8s linear infinite' }}>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
                Searching
              </>
            ) : 'Search'}
          </button>
        </div>
      </form>

      <div className="tm-quick">
        <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Popular:</span>
        {['Dolo 650', 'Paracetamol', 'Azithromycin', 'Metformin'].map(s => (
          <button key={s} className="tm-quick-chip" onClick={() => { setQuery(s); onSearch(s); }} disabled={loading}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;