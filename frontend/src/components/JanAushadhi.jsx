import React from 'react';

const JanAushadhi = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mb-6 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-lg shrink-0">
            🏥
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-extrabold text-blue-900">
                Jan Aushadhi Generic Available
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold border border-blue-200">
                Govt. Initiative
              </span>
            </div>
            <div className="text-base font-bold text-gray-900 mb-0.5">
              {data.genericName}
            </div>
            <div className="text-xs text-gray-500">
              Pack: {data.unitSize} · Category: {data.groupName}
            </div>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-extrabold text-blue-700">₹{data.mrp}</div>
          <div className="text-xs text-blue-500 font-medium">MRP per pack</div>
          <div className="text-xs text-gray-400 mt-0.5">50-90% cheaper</div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-blue-100 flex items-center justify-between">
        <div className="text-xs text-blue-600 font-medium">
          ✅ Available at Jan Aushadhi Kendras across India
        </div>
        <a
          href="https://janaushadhi.gov.in/storeList.aspx"
          target="_blank"
          rel="noreferrer"
          className="text-xs font-bold text-blue-700 hover:text-blue-900 underline"
        >
          Find nearest Kendra →
        </a>
      </div>
    </div>
  );
};

export default JanAushadhi;