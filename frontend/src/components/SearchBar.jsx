import React, { useState, useEffect } from 'react';
import axios from 'axios';

const medicines = ['Dolo 650', 'Paracetamol', 'Azithromycin', 'Metformin', 'Atorvastatin', 'Pantoprazole', 'Crocin', 'Amoxicillin'];

const API_URL = 'https://medismart-3yv7.onrender.com';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [tickerIdx, setTickerIdx] = useState(0);
  const [typing, setTyping] = useState(true);
  const [charIdx, setCharIdx] = useState(0);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrMedicines, setOcrMedicines] = useState([]);

  useEffect(() => {
    if (query) return;
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

  const handlePrescriptionUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOcrLoading(true);
    setOcrMedicines([]);
    try {
      const formData = new FormData();
      formData.append('prescription', file);
      const response = await axios.post(
        `${API_URL}/api/ocr/extract`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      const found = response.data.medicines;
      if (found && found.length > 0) {
        setOcrMedicines(found);
        setQuery(found[0]);
        onSearch(found[0]);
      } else {
        alert('No medicines found in the prescription. Please try a clearer image.');
      }
    } catch {
      alert('Failed to read prescription. Please try again.');
    } finally {
      setOcrLoading(false);
      e.target.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">

      {/* Search form */}
      <form onSubmit={handleSubmit}>
        <div className="flex rounded-xl border-2 border-gray-200 bg-white overflow-hidden shadow-lg focus-within:border-green-600 focus-within:shadow-green-100 transition-all duration-200">
          <span className="flex items-center pl-5 text-gray-400">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={loading || ocrLoading}
            className="flex-1 px-4 py-4 text-base text-gray-800 bg-transparent outline-none placeholder-gray-400 font-medium"
          />
          <button
            type="submit"
            disabled={loading || ocrLoading}
            className="px-8 bg-green-600 text-white text-base font-bold hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed transition-colors duration-150"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Popular searches */}
      <div className="flex gap-2 flex-wrap mt-3 items-center">
        <span className="text-xs text-gray-400">Popular:</span>
        {['Dolo 650', 'Paracetamol', 'Azithromycin', 'Metformin'].map(s => (
          <button
            key={s}
            onClick={() => { setQuery(s); onSearch(s); }}
            disabled={loading || ocrLoading}
            className="px-3 py-1 rounded-full border border-gray-200 bg-white text-gray-500 text-xs font-medium hover:border-green-600 hover:text-green-600 hover:bg-green-50 transition-all duration-150 disabled:opacity-50"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Prescription upload section */}
      <div className="mt-4 border-2 border-dashed border-green-200 rounded-2xl p-5 bg-green-50 flex items-center justify-between gap-4 hover:border-green-400 hover:bg-green-100 transition-all duration-200">
        <div>
          <div className="text-sm font-bold text-green-700 mb-1">📋 Have a prescription?</div>
          <div className="text-xs text-green-500">Upload a photo and we'll auto-detect all medicines</div>
        </div>

        {ocrLoading ? (
          <div className="flex items-center gap-2 text-green-700 text-sm font-semibold">
            <div className="w-5 h-5 border-2 border-green-200 border-t-green-600 rounded-full animate-spin" />
            Reading...
          </div>
        ) : (
          <label className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-bold rounded-xl cursor-pointer hover:bg-green-700 transition-colors duration-150 whitespace-nowrap">
            📤 Upload Photo
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              className="hidden"
              onChange={handlePrescriptionUpload}
              disabled={loading || ocrLoading}
            />
          </label>
        )}
      </div>

      {/* Medicines found from prescription */}
      {ocrMedicines.length > 1 && (
        <div className="mt-3 p-4 bg-white rounded-xl border border-green-200 shadow-sm">
          <div className="text-xs font-bold text-green-700 mb-2">✅ Medicines found in your prescription:</div>
          <div className="flex gap-2 flex-wrap">
            {ocrMedicines.map((med, i) => (
              <button
                key={i}
                onClick={() => { setQuery(med); onSearch(med); }}
                className="px-4 py-1.5 rounded-full border border-green-200 bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-600 hover:text-white transition-all duration-150"
              >
                {med}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;