import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ResultsTable from '../components/ResultsTable';
import AIAnalysis from '../components/AIAnalysis';

const SearchPage = () => {
  const [results, setResults]       = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [searched, setSearched]     = useState(false);
  const [fromCache, setFromCache]   = useState(false);
  const [query, setQuery]           = useState('');

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setError('');
    setResults([]);
    setAiAnalysis(null);
    setSearched(true);
    setQuery(searchQuery);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/medicine/search?name=${encodeURIComponent(searchQuery)}`
      );
      setResults(response.data.results);
      setAiAnalysis(response.data.aiAnalysis);
      setFromCache(response.data.fromCache);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", minHeight: '100vh', background: '#f5f4f0' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .tm-nav {
          background: #fff;
          border-bottom: 1px solid #e8edf2;
          padding: 0 40px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 1px 8px rgba(0,0,0,0.04);
        }

        .tm-logo {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .tm-logo span { color: #16a34a; }

        .tm-hero {
          background: #fff;
          padding: 64px 40px 56px;
          text-align: center;
          border-bottom: 1px solid #e8edf2;
        }

        .tm-hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 16px;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 100px;
          color: #16a34a;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 20px;
        }

        .tm-hero-title {
          font-size: clamp(32px, 4.5vw, 52px);
          font-weight: 800;
          color: #0f172a;
          line-height: 1.15;
          letter-spacing: -1.5px;
          margin-bottom: 14px;
        }

        .tm-hero-title span { color: #16a34a; }

        .tm-hero-sub {
          color: #64748b;
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 36px;
        }

        .tm-trust-bar {
          display: flex;
          justify-content: center;
          gap: 32px;
          flex-wrap: wrap;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid #f1f5f9;
        }

        .tm-trust-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #475569;
          font-weight: 500;
        }

        .tm-trust-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: #f0fdf4;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        }

        .tm-results-area {
          max-width: 1400px;
          margin: 0 auto;
          padding: 40px 32px 80px;
        }

        .tm-spinner {
          width: 44px;
          height: 44px;
          border: 3px solid #bbf7d0;
          border-top-color: #16a34a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .tm-step-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #16a34a;
          animation: pulse 1.4s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.7); }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* NAV */}
      <nav className="tm-nav">
        {/* Left — Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '18px', boxShadow: '0 2px 8px rgba(22,163,74,0.3)',
          }}>💊</div>
          <div>
            <div className="tm-logo">Medi<span>Smart</span></div>
            <div style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: '-2px', letterSpacing: '0.3px' }}>
              India's medicine price comparator
            </div>
          </div>
        </div>

        {/* Center — pharmacy pills */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', marginRight: '4px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Comparing on</span>
          {[['1mg','#fef2f2','#dc2626','#fecaca'],['Pharmeasy','#f0fdf4','#16a34a','#bbf7d0'],['Netmeds','#eff6ff','#2563eb','#bfdbfe']].map(([name, bg, color, border]) => (
            <span key={name} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '100px', background: bg, color, fontWeight: 600, border: `1px solid ${border}`, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
              {name}
            </span>
          ))}
        </div>

        {/* Right — empty to balance flex */}
        <div style={{ width: '140px' }} />
      </nav>

      {/* HERO */}
      <div className="tm-hero">
        <div className="tm-hero-eyebrow">
          <span>🇮🇳</span> India's medicine price comparator
        </div>
        <h1 className="tm-hero-title">
          Compare prices, save up to<br /><span>51% on medicines</span>
        </h1>
        <p className="tm-hero-sub">
          Search any medicine and instantly compare prices across 1mg, Pharmeasy & Netmeds.<br />
          Get AI-powered cheaper alternatives with the same active salt.
        </p>

        <SearchBar onSearch={handleSearch} loading={loading} />

        {/* Trust bar */}
        <div className="tm-trust-bar">
          {[
            ['🏪', '3 Pharmacies', 'compared live'],
            ['🤖', 'AI Analysis', 'salt composition'],
            ['💊', 'Same Salt', 'cheaper alternatives'],
            ['🇮🇳', 'Made for India', 'save on medicines'],
          ].map(([icon, bold, sub]) => (
            <div key={bold} className="tm-trust-item">
              <div className="tm-trust-icon">{icon}</div>
              <div>
                <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '13px' }}>{bold}</div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      <div className="tm-results-area">

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <div className="tm-spinner" />
            </div>
            <p style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
              Searching across pharmacies...
            </p>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '32px' }}>
              This may take 15–20 seconds for fresh results
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', flexWrap: 'wrap' }}>
              {['Scraping 1mg', 'Scraping Pharmeasy', 'Scraping Netmeds', 'AI Analysis'].map((step, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#94a3b8' }}>
                  <div className="tm-step-dot" style={{ animationDelay: `${i * 0.35}s` }} />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '14px', padding: '18px 24px', color: '#dc2626', textAlign: 'center', fontSize: '14px' }}>
            {error}
          </div>
        )}

        {/* Results header */}
        {!loading && searched && results.length > 0 && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#16a34a', marginBottom: '4px' }}>
              Search Results
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a' }}>
              Results for "{query}"
            </div>
          </div>
        )}

        {/* No results */}
        {!loading && searched && results.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            No results found. Try a different medicine name.
          </div>
        )}

        {/* Side by side */}
        {!loading && results.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
            <ResultsTable results={results} />
            <AIAnalysis aiAnalysis={aiAnalysis} />
          </div>
        )}

        {/* HOW IT WORKS — shown only when no search has happened */}
        {!searched && (
          <div style={{ marginTop: '40px' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#16a34a', marginBottom: '8px', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                How It Works
              </div>
              <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                Save money in 3 simple steps
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              {[
                { icon: '🔍', step: '01', title: 'Search your medicine', desc: 'Type any medicine name, salt, or brand. We search across 1mg, Pharmeasy and Netmeds simultaneously.' },
                { icon: '📊', step: '02', title: 'Compare live prices', desc: 'See all results sorted from cheapest to most expensive with direct buy links to each pharmacy.' },
                { icon: '🤖', step: '03', title: 'Get AI alternatives', desc: 'Our AI identifies the active salt and finds cheaper medicines with the same composition — verified and safe.' },
              ].map(({ icon, step, title, desc }) => (
                <div key={step} style={{
                  background: '#fff',
                  border: '1.5px solid #e8edf2',
                  borderRadius: '20px',
                  padding: '28px 24px',
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', top: '16px', right: '20px',
                    fontSize: '48px', fontWeight: 900, color: '#f1f5f9',
                    fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1,
                  }}>{step}</div>
                  <div style={{
                    width: '52px', height: '52px', borderRadius: '14px',
                    background: '#f0fdf4', border: '1.5px solid #bbf7d0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '24px', marginBottom: '16px',
                  }}>{icon}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '8px' }}>
                    {title}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {desc}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom info strip */}
            <div style={{
              marginTop: '20px',
              background: '#0f172a',
              borderRadius: '20px',
              padding: '24px 32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              flexWrap: 'wrap',
            }}>
              <div>
                <div style={{ fontSize: '18px', fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>
                  Why pay more for the same medicine?
                </div>
                <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  The same active salt is sold under different brand names at vastly different prices. MediSmart helps you find the cheapest one.
                </div>
              </div>
              <div style={{ display: 'flex', gap: '24px', flexShrink: 0 }}>
                {[['₹155+', 'avg savings per search'], ['3', 'pharmacies compared'], ['51%', 'max savings found']].map(([val, label]) => (
                  <div key={label} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 800, color: '#4ade80', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{val}</div>
                    <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontFamily: 'Plus Jakarta Sans, sans-serif', marginTop: '2px' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div style={{
        borderTop: '1px solid #e8edf2', background: '#fff',
        padding: '28px 40px', textAlign: 'center',
        color: '#94a3b8', fontSize: '12px',
      }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ fontWeight: 700, color: '#0f172a' }}>Medi<span style={{ color: '#16a34a' }}>Smart</span></span>
          {' · '}Built for educational purposes
          {' · '}Always consult a doctor before switching medicines
        </div>
        <div>© 2026 MediSmart · Prices sourced from 1mg, Pharmeasy & Netmeds</div>
      </div>
    </div>
  );
};

export default SearchPage;