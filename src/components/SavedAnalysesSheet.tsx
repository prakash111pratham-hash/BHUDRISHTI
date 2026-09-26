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
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs transition-opacity">
      <div className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col border-l border-[#D0E4F8] animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-[#D0E4F8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-[#0288D1]" />
            <div>
              <h3 className="text-[15px] font-bold text-[#0A2239]">
                Saved Remote Sensing Records
              </h3>
              <p className="text-[11px] text-[#708FAE]">
                {records.length} persisted reports in local database
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {records.length > 0 && (
              <button
                onClick={onClearAll}
                data-testid="clear_all_records_button"
                className="p-2 text-[#D32F2F] hover:bg-[#D32F2F]/10 rounded-lg transition-colors"
                title="Clear All Records"
                aria-label="Clear all records"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onDismiss}
              className="p-2 text-[#708FAE] hover:bg-[#F0F7FF] rounded-lg transition-colors"
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
              <Bookmark className="w-12 h-12 text-[#D0E4F8] mb-3" />
              <h4 className="text-[14px] font-semibold text-[#43607E] mb-1">
                No saved analyses yet
              </h4>
              <p className="text-[12px] text-[#708FAE] max-w-xs">
                Run an AI query on any satellite scene and tap the bookmark icon to save reports here.
              </p>
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                data-testid={`saved_record_${record.id}`}
                className="bg-[#F0F7FF] border border-[#D0E4F8] rounded-xl p-3.5 shadow-2xs hover:border-[#0288D1]/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-[13px] font-bold text-[#0288D1] truncate">
                    {record.sceneTitle}
                  </h4>
                  <button
                    onClick={() => onDeleteRecord(record.id)}
                    className="text-[#708FAE] hover:text-[#D32F2F] p-1 rounded-sm transition-colors"
                    title="Delete Record"
                    aria-label="Delete record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-[#708FAE] font-mono mb-2">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(record.timestamp)}</span>
                </div>

                <div className="text-[11px] font-medium text-[#E65100] mb-1">
                  Query: "{record.queryPrompt}"
                </div>

                <p className="text-[12px] text-[#0A2239] line-clamp-3 leading-relaxed mb-2">
                  {record.plainSummary}
                </p>

                <div className="flex items-center gap-1 text-[10px] font-medium text-[#2E7D32]">
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
