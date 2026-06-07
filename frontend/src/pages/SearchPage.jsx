import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ResultsTable from '../components/ResultsTable';
import AIAnalysis from '../components/AIAnalysis';
import JanAushadhi from '../components/JanAushadhi';

const API_URL = 'https://medismart-3yv7.onrender.com';

const SearchPage = () => {
  const [results, setResults]             = useState([]);
  const [aiAnalysis, setAiAnalysis]       = useState(null);
  const [janAushadhiData, setJanAushadhi] = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState('');
  const [searched, setSearched]           = useState(false);
  const [query, setQuery]                 = useState('');

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setError('');
    setResults([]);
    setAiAnalysis(null);
    setJanAushadhi(null);
    setSearched(true);
    setQuery(searchQuery);
    try {
      const response = await axios.get(
        `${API_URL}/api/medicine/search?name=${encodeURIComponent(searchQuery)}`
      );
      setResults(response.data.results);
      setAiAnalysis(response.data.aiAnalysis);
      setJanAushadhi(response.data.janAushadhi || null);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-lg shadow-md shadow-green-200">
              💊
            </div>
            <div>
              <div className="text-xl font-extrabold text-gray-900">
                Medi<span className="text-green-600">Smart</span>
              </div>
              <div className="text-xs text-gray-400 -mt-0.5">India's medicine price comparator</div>
            </div>
          </div>

          {/* Pharmacy badges */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Comparing on</span>
            {[
              ['1mg', 'text-red-600', 'bg-red-50', 'border-red-100'],
              ['Pharmeasy', 'text-green-600', 'bg-green-50', 'border-green-100'],
              ['Netmeds', 'text-blue-600', 'bg-blue-50', 'border-blue-100'],
            ].map(([name, text, bg, border]) => (
              <span key={name} className={`text-xs font-semibold px-3 py-1 rounded-full border ${text} ${bg} ${border}`}>
                {name}
              </span>
            ))}
          </div>

          {/* Right spacer for balance */}
          <div className="w-32 hidden md:block" />
        </div>
      </nav>

      {/* HERO */}
      <div className="bg-white border-b border-gray-100 py-16 px-8 text-center">
        <div className="max-w-3xl mx-auto">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-semibold mb-6">
            🇮🇳 India's medicine price comparator
          </div>

          {/* Title */}
          <h1 className="text-5xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
            Compare prices, save up to<br />
            <span className="text-green-600">51% on medicines</span>
          </h1>

          <p className="text-gray-500 text-base leading-relaxed mb-10">
            Search any medicine and instantly compare prices across 1mg, Pharmeasy & Netmeds.<br />
            Get AI-powered cheaper alternatives with the same active salt.
          </p>

          <SearchBar onSearch={handleSearch} loading={loading} />

          {/* Trust bar */}
          <div className="flex justify-center gap-8 flex-wrap mt-10 pt-8 border-t border-gray-100">
            {[
              ['🏪', '3 Pharmacies', 'compared live'],
              ['🤖', 'AI Analysis', 'salt composition'],
              ['💊', 'Same Salt', 'cheaper alternatives'],
              ['🇮🇳', 'Made for India', 'save on medicines'],
            ].map(([icon, bold, sub]) => (
              <div key={bold} className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-base">
                  {icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-900">{bold}</div>
                  <div className="text-xs text-gray-400">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS */}
      <div className="max-w-7xl mx-auto px-8 py-10 pb-20">

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="flex justify-center mb-5">
              <div className="w-11 h-11 border-4 border-green-100 border-t-green-600 rounded-full animate-spin" />
            </div>
            <p className="text-xl font-extrabold text-gray-900 mb-2">Searching across pharmacies...</p>
            <p className="text-gray-400 text-sm mb-8">This may take 15–20 seconds for fresh results</p>
            <div className="flex justify-center gap-7 flex-wrap">
              {['Scraping 1mg', 'Scraping Pharmeasy', 'Scraping Netmeds', 'AI Analysis'].map((step, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-400">
                  <div
                    className="w-2 h-2 rounded-full bg-green-500 animate-pulse"
                    style={{ animationDelay: `${i * 0.35}s` }}
                  />
                  {step}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 text-red-600 text-sm text-center">
            {error}
          </div>
        )}

        {/* Results header */}
        {!loading && searched && results.length > 0 && (
          <div className="mb-7">
            <div className="text-xs font-bold tracking-widest uppercase text-green-600 mb-1">Search Results</div>
            <div className="text-2xl font-extrabold text-gray-900">Results for "{query}"</div>
          </div>
        )}

        {/* No results */}
        {!loading && searched && results.length === 0 && !error && (
          <div className="text-center py-20 text-gray-400">
            No results found. Try a different medicine name.
          </div>
        )}

        {/* Side by side results */}
        {!loading && results.length > 0 && (
          <>
            <JanAushadhi data={janAushadhiData} />
            <div className="grid grid-cols-2 gap-8 items-start">
              <ResultsTable results={results} />
              <AIAnalysis aiAnalysis={aiAnalysis} />
            </div>
          </>
        )}

        {/* HOW IT WORKS */}
        {!searched && (
          <div className="mt-10">
            <div className="text-center mb-8">
              <div className="text-xs font-bold tracking-widest uppercase text-green-600 mb-2">How It Works</div>
              <div className="text-2xl font-extrabold text-gray-900">Save money in 3 simple steps</div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              {[
                { icon: '🔍', step: '01', title: 'Search your medicine', desc: 'Type any medicine name, salt, or brand. We search across 1mg, Pharmeasy and Netmeds simultaneously.' },
                { icon: '📊', step: '02', title: 'Compare live prices', desc: 'See all results sorted from cheapest to most expensive with direct buy links to each pharmacy.' },
                { icon: '🤖', step: '03', title: 'Get AI alternatives', desc: 'Our AI identifies the active salt and finds cheaper medicines with the same composition — verified and safe.' },
              ].map(({ icon, step, title, desc }) => (
                <div key={step} className="bg-white border border-gray-100 rounded-2xl p-7 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="absolute top-4 right-5 text-5xl font-black text-gray-100 leading-none select-none">{step}</div>
                  <div className="w-12 h-12 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-2xl mb-4 relative">
                    {icon}
                  </div>
                  <div className="text-base font-extrabold text-gray-900 mb-2 relative">{title}</div>
                  <div className="text-sm text-gray-500 leading-relaxed relative">{desc}</div>
                </div>
              ))}
            </div>

            {/* Dark stats strip */}
            <div className="mt-5 bg-gray-900 rounded-2xl p-6 flex items-center justify-between gap-5 flex-wrap">
              <div>
                <div className="text-base font-extrabold text-white mb-1">Why pay more for the same medicine?</div>
                <div className="text-sm text-gray-400">The same active salt is sold under different brand names at vastly different prices.</div>
              </div>
              <div className="flex gap-8 shrink-0">
                {[['₹155+', 'avg savings per search'], ['3', 'pharmacies compared'], ['51%', 'max savings found']].map(([val, label]) => (
                  <div key={label} className="text-center">
                    <div className="text-2xl font-extrabold text-green-400">{val}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <div className="bg-white border-t border-gray-100 py-6 px-8 text-center">
        <div className="text-sm text-gray-400 mb-1">
          <span className="font-bold text-gray-900">Medi<span className="text-green-600">Smart</span></span>
          {' · '}Built for educational purposes{' · '}Always consult a doctor before switching medicines
        </div>
        <div className="text-xs text-gray-300">© 2026 MediSmart · Prices sourced from 1mg, Pharmeasy & Netmeds</div>
      </div>
    </div>
  );
};

export default SearchPage;