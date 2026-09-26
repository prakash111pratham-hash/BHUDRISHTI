import React from 'react';
import { Sparkles, Radio, Loader2 } from 'lucide-react';

interface QueryConsoleProps {
  userQuery: string;
  onQueryChange: (query: string) => void;
  suggestions: string[];
  isAnalyzing: boolean;
  onAnalyze: (queryOverride?: string) => void;
}

export const QueryConsole: React.FC<QueryConsoleProps> = ({
  userQuery,
  onQueryChange,
  suggestions,
  isAnalyzing,
  onAnalyze
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAnalyzing) {
      onAnalyze();
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2">
      <div
        data-testid="query_console"
        className="bg-white rounded-2xl border border-[#D0E4F8] p-4 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-[#0288D1]" />
          <h2 className="text-[12px] font-bold tracking-wider text-[#0288D1] uppercase">
            GEOSPATIAL SPECTRAL QUERY
          </h2>
        </div>
        <p className="text-[11px] text-[#43607E] mb-3">
          Specify biophysical criteria or select research telemetry preset:
        </p>

        {/* Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2.5 scrollbar-none">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onQueryChange(suggestion);
                onAnalyze(suggestion);
              }}
              className="flex-shrink-0 bg-[#F0F7FF] hover:bg-[#0288D1]/10 text-[#0A2239] hover:text-[#0288D1] border border-[#D0E4F8] rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors text-left"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Query Input & Action */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 mt-1">
          <div className="relative flex-1">
            <input
              type="text"
              value={userQuery}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="e.g. Explain deforestation boundaries in simple language..."
              data-testid="user_query_input_field"
              className="w-full h-11 px-3.5 rounded-xl bg-white border border-[#D0E4F8] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none text-[13px] text-[#0A2239] placeholder-[#708FAE] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            data-testid="run_analysis_button"
            className="h-11 px-5 rounded-xl bg-[#0288D1] hover:bg-[#0277BD] disabled:bg-[#0288D1]/40 text-white font-bold text-[12px] tracking-wide flex items-center justify-center gap-2 shadow-xs transition-colors flex-shrink-0 cursor-pointer disabled:cursor-not-allowed"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Radio className="w-4 h-4" />
                <span>Process Scene</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
