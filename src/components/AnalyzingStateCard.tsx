import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

export const AnalyzingStateCard: React.FC = () => {
  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 py-3">
      <div
        data-testid="analyzing_state_card"
        className="bg-[#0B1528] rounded-2xl border border-[#00E5FF]/40 p-8 shadow-xl text-center flex flex-col items-center justify-center text-white"
      >
        <Loader2 className="w-9 h-9 text-[#00E5FF] animate-spin mb-4" />
        <h3 className="text-[15px] font-bold text-white mb-1.5 font-mono">
          Processing Remote Sensing Vision Model...
        </h3>
        <p className="text-[12px] text-slate-400 max-w-md">
          Multimodal vision encoding orthophoto pixels • Text query synthesis • Zero GPU memory footprint
        </p>
      </div>
    </div>
  );
};

interface ErrorStateCardProps {
  errorMessage: string;
  onRetry: () => void;
}

export const ErrorStateCard: React.FC<ErrorStateCardProps> = ({ errorMessage, onRetry }) => {
  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 py-3">
      <div
        data-testid="error_state_card"
        className="bg-[#0B1528] rounded-2xl border border-red-500/50 p-5 shadow-xl text-white"
      >
        <h3 className="text-[15px] font-bold text-red-400 mb-1 font-mono">
          Analysis Notification
        </h3>
        <p className="text-[12px] text-slate-300 mb-4">
          {errorMessage}
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#00E5FF] hover:bg-[#38BDF8] text-slate-950 rounded-lg font-black text-[12px] inline-flex items-center gap-2 cursor-pointer shadow-lg transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Analysis</span>
        </button>
      </div>
    </div>
  );
};
