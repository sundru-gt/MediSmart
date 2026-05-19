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
    } catch (error) {
      alert('Failed to read prescription. Please try again.');
    } finally {
      setOcrLoading(false);
      e.target.value = '';
    }
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

        .ocr-section {
          margin-top: 20px;
          border: 2px dashed #bbf7d0;
          border-radius: 16px;
          padding: 20px 24px;
          background: #f0fdf4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          transition: all 0.2s;
        }
        .ocr-section:hover {
          border-color: #16a34a;
          background: #dcfce7;
        }
        .ocr-upload-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 24px;
          border-radius: 10px;
          background: #16a34a;
          color: #fff;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: background 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .ocr-upload-label:hover { background: #15803d; }

        .ocr-chip {
          padding: 6px 16px;
          border-radius: 100px;
          border: 1.5px solid #bbf7d0;
          background: #fff;
          color: #16a34a;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          font-family: 'Plus Jakarta Sans', sans-serif;
          transition: all 0.15s;
        }
        .ocr-chip:hover {
          background: #16a34a;
          color: #fff;
        }

        .ocr-loading-bar {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #15803d;
          font-size: 14px;
          font-weight: 600;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }

        .ocr-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #bbf7d0;
          border-top-color: #16a34a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          flex-shrink: 0;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* Search form */}
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
            disabled={loading || ocrLoading}
          />
          <button className="tm-search-btn" type="submit" disabled={loading || ocrLoading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Popular searches */}
      <div className="tm-quick">
        <span style={{ fontSize: '12px', color: '#94a3b8', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Popular:</span>
        {['Dolo 650', 'Paracetamol', 'Azithromycin', 'Metformin'].map(s => (
          <button
            key={s}
            className="tm-quick-chip"
            onClick={() => { setQuery(s); onSearch(s); }}
            disabled={loading || ocrLoading}
          >
            {s}
          </button>
        ))}
      </div>

      {/* OCR Upload Section — prominent, separate */}
      <div className="ocr-section">
        <div>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#15803d', fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '4px' }}>
            📋 Have a prescription?
          </div>
          <div style={{ fontSize: '12px', color: '#4ade80', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Upload a photo and we'll auto-detect all medicines
          </div>
        </div>

        {ocrLoading ? (
          <div className="ocr-loading-bar">
            <div className="ocr-spinner" />
            Reading prescription...
          </div>
        ) : (
          <label className="ocr-upload-label">
            📤 Upload Photo
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              style={{ display: 'none' }}
              onChange={handlePrescriptionUpload}
              disabled={loading || ocrLoading}
            />
          </label>
        )}
      </div>

      {/* Medicines found from prescription */}
      {ocrMedicines.length > 1 && (
        <div style={{
          marginTop: '12px',
          padding: '14px 18px',
          background: '#fff',
          borderRadius: '12px',
          border: '1.5px solid #bbf7d0',
          boxShadow: '0 2px 8px rgba(22,163,74,0.08)',
        }}>
          <div style={{ fontSize: '12px', color: '#15803d', fontWeight: 700, fontFamily: 'Plus Jakarta Sans, sans-serif', marginBottom: '10px' }}>
            ✅ Medicines found in your prescription:
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {ocrMedicines.map((med, i) => (
              <button
                key={i}
                className="ocr-chip"
                onClick={() => { setQuery(med); onSearch(med); }}
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