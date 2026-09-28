import React from 'react';
import { X, Bookmark, Trash2, Calendar, MapPin } from 'lucide-react';
import { AnalysisRecord } from '../types';

interface SavedAnalysesSheetProps {
  records: AnalysisRecord[];
  onDismiss: () => void;
  onDeleteRecord: (id: number) => void;
  onClearAll: () => void;
}

export const SavedAnalysesSheet: React.FC<SavedAnalysesSheetProps> = ({
  records,
  onDismiss,
  onDeleteRecord,
  onClearAll
}) => {
  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-md h-full bg-[#0B1528] shadow-2xl flex flex-col border-l border-[#182C4D] animate-in slide-in-from-right duration-200 text-white">
        {/* Header */}
        <div className="p-4 border-b border-[#182C4D] flex items-center justify-between bg-[#08101E]">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#00E5FF]" />
            <div>
              <h3 className="text-[15px] font-bold text-white">
                Saved Remote Sensing Records
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {records.length} persisted reports in local database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {records.length > 0 && (
              <button
                onClick={onClearAll}
                data-testid="clear_all_records_button"
                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Clear All Records"
                aria-label="Clear all records"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onDismiss}
              className="p-2 text-slate-400 hover:text-white hover:bg-[#122340] rounded-lg transition-colors cursor-pointer"
              title="Close"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {records.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <Bookmark className="w-12 h-12 text-slate-600 mb-3" />
              <h4 className="text-[14px] font-semibold text-slate-300 mb-1">
                No saved analyses yet
              </h4>
              <p className="text-[12px] text-slate-500 max-w-xs">
                Run an AI query on any satellite scene and tap the bookmark icon to save reports here.
              </p>
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                data-testid={`saved_record_${record.id}`}
                className="bg-[#08101E] border border-[#182C4D] rounded-xl p-3.5 shadow-md hover:border-[#00B0FF]/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[13px] font-bold text-[#00E5FF] truncate">
                    {record.sceneTitle}
                  </h4>
                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    className="text-slate-400 hover:text-red-400 p-1 rounded-sm transition-colors cursor-pointer"
                    title="Delete Record"
                    aria-label="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mb-2">
                  <Calendar className="w-3 h-3 text-[#00B0FF]" />
                  <span>{formatDate(record.timestamp)}</span>
                </div>

                <div className="text-[11px] font-medium text-[#FF9100] mb-1 font-mono">
                  Query: "{record.queryPrompt}"
                </div>

                <p className="text-[12px] text-slate-300 line-clamp-3 leading-relaxed mb-2">
                  {record.plainSummary}
                </p>

                <div className="flex items-center gap-1 text-[10px] font-medium text-[#00E676] font-mono">
                  <MapPin className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Band: {record.spectralBand} • {record.coordinates}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
