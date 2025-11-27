import React from 'react';
import { AdvisorResponse } from '../types';
import { Lightbulb, AlertTriangle, CheckCircle2, RefreshCw } from 'lucide-react';

interface Props {
  analysis: AdvisorResponse | null;
  loading: boolean;
  onAnalyze: () => void;
  canAnalyze: boolean;
}

const AdvisorPanel: React.FC<Props> = ({ analysis, loading, onAnalyze, canAnalyze }) => {
  if (loading) {
    return (
      <div className="w-full h-64 bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center space-y-4 p-8 animate-pulse">
        <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
        <p className="text-emerald-800 font-medium">Nutri Advisor กำลังวิเคราะห์มื้ออาหารของคุณ...</p>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="w-full bg-emerald-50 rounded-2xl border-2 border-dashed border-emerald-200 p-8 flex flex-col items-center justify-center text-center">
        <div className="bg-white p-4 rounded-full shadow-sm mb-4">
          <Lightbulb className="text-emerald-500" size={32} />
        </div>
        <h3 className="text-lg font-bold text-emerald-900 mb-2">ยังไม่มีคำแนะนำ</h3>
        <p className="text-emerald-700 mb-6 max-w-md">
          หมุนวงล้อให้ครบทุกหมวดหมู่ แล้วกดปุ่มวิเคราะห์เพื่อรับคำแนะนำจาก AI
        </p>
        <button 
          onClick={onAnalyze}
          disabled={!canAnalyze}
          className={`px-6 py-3 rounded-full font-bold shadow-md transition-all flex items-center gap-2
            ${canAnalyze 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg transform hover:-translate-y-1' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          <Lightbulb size={20} />
          วิเคราะห์มื้ออาหาร
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Lightbulb className="text-yellow-300" />
            <h2 className="text-xl font-bold">Nutri Advisor</h2>
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
            <span className="text-sm font-medium">Health Score: </span>
            <span className="text-lg font-bold">{analysis.health_score_overall}/10</span>
          </div>
        </div>
        <p className="text-emerald-50 opacity-90">{analysis.summary_th}</p>
      </div>

      <div className="p-6 space-y-6">
        {/* Evaluation */}
        <div className="flex items-start gap-3">
          <div className={`mt-1 p-2 rounded-lg ${
            analysis.evaluation_th.includes("ดี") ? 'bg-green-100 text-green-600' :
            analysis.evaluation_th.includes("ระวัง") ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'
          }`}>
             {analysis.evaluation_th.includes("ดี") ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">ผลการประเมิน</h3>
            <p className="text-gray-600">{analysis.evaluation_th}</p>
          </div>
        </div>

        {/* Advice */}
        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
          <h3 className="font-bold text-blue-900 mb-1 flex items-center gap-2">
             <Lightbulb size={18} /> คำแนะนำ
          </h3>
          <p className="text-blue-800 text-sm leading-relaxed">{analysis.advice_th}</p>
        </div>

        {/* Risks */}
        {analysis.risk_factors_th.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2 text-sm uppercase tracking-wider text-red-500">
              <AlertTriangle size={16} /> สิ่งที่ต้องระวัง
            </h3>
            <ul className="space-y-1">
              {analysis.risk_factors_th.map((risk, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Alternatives */}
        {analysis.suggested_alternatives.length > 0 && (
          <div className="border-t pt-4">
             <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
               <RefreshCw size={18} className="text-emerald-500" /> ทางเลือกที่สุขภาพดีกว่า
             </h3>
             <div className="grid gap-3 sm:grid-cols-2">
                {analysis.suggested_alternatives.map((alt, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg border hover:border-emerald-300 transition-colors">
                     <div className="text-xs text-gray-400 uppercase font-bold mb-1">{alt.from_category}</div>
                     <div className="font-semibold text-gray-800">{alt.name_th}</div>
                     <div className="text-xs text-emerald-600 mt-1">{alt.reason_th}</div>
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvisorPanel;