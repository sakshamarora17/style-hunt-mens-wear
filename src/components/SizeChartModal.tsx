import React, { useState } from 'react';
import { X, Ruler, CheckCircle } from 'lucide-react';

interface SizeChartModalProps {
  onClose: () => void;
}

export const SizeChartModal: React.FC<SizeChartModalProps> = ({ onClose }) => {
  const [unit, setUnit] = useState<'inches' | 'cm'>('inches');
  const [activeTab, setActiveTab] = useState<'jeans' | 'shirts' | 'tshirts'>('jeans');

  const jeansData = [
    { size: '28', waist: unit === 'inches' ? '28.0' : '71.1', hip: unit === 'inches' ? '36.5' : '92.7', inseam: unit === 'inches' ? '30.0' : '76.2', length: unit === 'inches' ? '39.5' : '100.3' },
    { size: '30', waist: unit === 'inches' ? '30.0' : '76.2', hip: unit === 'inches' ? '38.5' : '97.8', inseam: unit === 'inches' ? '31.0' : '78.7', length: unit === 'inches' ? '40.0' : '101.6' },
    { size: '32', waist: unit === 'inches' ? '32.0' : '81.3', hip: unit === 'inches' ? '40.5' : '102.9', inseam: unit === 'inches' ? '32.0' : '81.3', length: unit === 'inches' ? '41.0' : '104.1' },
    { size: '34', waist: unit === 'inches' ? '34.0' : '86.4', hip: unit === 'inches' ? '42.5' : '107.9', inseam: unit === 'inches' ? '32.0' : '81.3', length: unit === 'inches' ? '41.5' : '105.4' },
    { size: '36', waist: unit === 'inches' ? '36.0' : '91.4', hip: unit === 'inches' ? '44.5' : '113.0', inseam: unit === 'inches' ? '32.5' : '82.5', length: unit === 'inches' ? '42.0' : '106.7' },
    { size: '38', waist: unit === 'inches' ? '38.0' : '96.5', hip: unit === 'inches' ? '46.5' : '118.1', inseam: unit === 'inches' ? '33.0' : '83.8', length: unit === 'inches' ? '42.5' : '107.9' },
  ];

  const shirtsData = [
    { size: '38 (S)', chest: unit === 'inches' ? '39.0' : '99.0', shoulder: unit === 'inches' ? '17.5' : '44.5', length: unit === 'inches' ? '29.0' : '73.6', sleeve: unit === 'inches' ? '25.0' : '63.5' },
    { size: '40 (M)', chest: unit === 'inches' ? '41.0' : '104.1', shoulder: unit === 'inches' ? '18.2' : '46.2', length: unit === 'inches' ? '29.5' : '74.9', sleeve: unit === 'inches' ? '25.5' : '64.8' },
    { size: '42 (L)', chest: unit === 'inches' ? '43.0' : '109.2', shoulder: unit === 'inches' ? '19.0' : '48.3', length: unit === 'inches' ? '30.2' : '76.7', sleeve: unit === 'inches' ? '26.0' : '66.0' },
    { size: '44 (XL)', chest: unit === 'inches' ? '45.5' : '115.5', shoulder: unit === 'inches' ? '19.8' : '50.3', length: unit === 'inches' ? '31.0' : '78.7', sleeve: unit === 'inches' ? '26.5' : '67.3' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 z-10">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Style Hunt Fit & Size Guide</h2>
              <p className="text-xs text-slate-500">Standard Indian & International Sizing</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab & Unit Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('jeans')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'jeans' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Jeans, Trousers & Lycra
            </button>
            <button
              onClick={() => setActiveTab('shirts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'shirts' ? 'bg-white text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Shirts & T-Shirts
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <span>Unit:</span>
            <div className="inline-flex bg-slate-100 p-0.5 rounded-lg">
              <button
                onClick={() => setUnit('inches')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${unit === 'inches' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'}`}
              >
                Inches
              </button>
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 rounded-md text-xs font-bold ${unit === 'cm' ? 'bg-amber-500 text-slate-950' : 'text-slate-600'}`}
              >
                CM
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="mt-4 border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
              {activeTab === 'jeans' ? (
                <tr>
                  <th className="p-3">Waist Size</th>
                  <th className="p-3">Waist ({unit})</th>
                  <th className="p-3">Seat / Hip ({unit})</th>
                  <th className="p-3">Inseam ({unit})</th>
                  <th className="p-3">Outseam ({unit})</th>
                </tr>
              ) : (
                <tr>
                  <th className="p-3">Collar / Size</th>
                  <th className="p-3">Chest ({unit})</th>
                  <th className="p-3">Shoulder ({unit})</th>
                  <th className="p-3">Length ({unit})</th>
                  <th className="p-3">Sleeve ({unit})</th>
                </tr>
              )}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeTab === 'jeans'
                ? jeansData.map((row) => (
                    <tr key={row.size} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900 bg-slate-50/50">{row.size}</td>
                      <td className="p-3 text-slate-700">{row.waist}</td>
                      <td className="p-3 text-slate-700">{row.hip}</td>
                      <td className="p-3 text-slate-700">{row.inseam}</td>
                      <td className="p-3 text-slate-700">{row.length}</td>
                    </tr>
                  ))
                : shirtsData.map((row) => (
                    <tr key={row.size} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 font-bold text-slate-900 bg-slate-50/50">{row.size}</td>
                      <td className="p-3 text-slate-700">{row.chest}</td>
                      <td className="p-3 text-slate-700">{row.shoulder}</td>
                      <td className="p-3 text-slate-700">{row.length}</td>
                      <td className="p-3 text-slate-700">{row.sleeve}</td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Local Fitting Service Notice */}
        <div className="mt-4 p-3 bg-amber-50 border border-amber-200/80 rounded-xl flex items-start gap-2 text-xs text-amber-900">
          <CheckCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Local Shop Alteration Guarantee:</strong> If the length or waist requires slight customization, walk in to our store with your receipt for complimentary same-day hem alterations!
          </span>
        </div>
      </div>
    </div>
  );
};
