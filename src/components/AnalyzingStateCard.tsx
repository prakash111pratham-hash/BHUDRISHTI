import React from 'react';
import { Loader2, RefreshCw } from 'lucide-react';

export const AnalyzingStateCard: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3">
      <div
        data-testid="analyzing_state_card"
        className="bg-white rounded-2xl border border-[#0288D1]/40 p-8 shadow-sm text-center flex flex-col items-center justify-center"
      >
        <Loader2 className="w-9 h-9 text-[#0288D1] animate-spin mb-4" />
        <h3 className="text-[15px] font-bold text-[#0A2239] mb-1.5">
          Processing Remote Sensing Model...
        </h3>
        <p className="text-[12px] text-[#43607E] max-w-md">
          Vision encoding orthophoto pixels • Text encoding query • Zero GPU memory strain
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
    <div className="w-full max-w-5xl mx-auto px-4 py-3">
      <div
        data-testid="error_state_card"
        className="bg-white rounded-2xl border border-[#D32F2F]/40 p-5 shadow-sm"
      >
        <h3 className="text-[15px] font-bold text-[#D32F2F] mb-1">
          Analysis Error
        </h3>
        <p className="text-[12px] text-[#43607E] mb-4">
          {errorMessage}
        </p>
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#0288D1] hover:bg-[#0277BD] text-white rounded-lg font-bold text-[12px] inline-flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Analysis</span>
        </button>
      </div>
    </div>
  );
};
