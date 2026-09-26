import React, { useState } from 'react';
import { Key, ShieldCheck, X } from 'lucide-react';

interface ApiKeyDialogProps {
  currentCustomKey: string;
  onKeySaved: (key: string) => void;
  onDismiss: () => void;
}

export const ApiKeyDialog: React.FC<ApiKeyDialogProps> = ({
  currentCustomKey,
  onKeySaved,
  onDismiss
}) => {
  const [keyInput, setKeyInput] = useState(currentCustomKey);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onKeySaved(keyInput.trim());
    onDismiss();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#D0E4F8] shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 text-[#708FAE] hover:text-[#0A2239] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#0288D1]/10 flex items-center justify-center text-[#0288D1]">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#0A2239]">
              Gemini Cloud API Configuration
            </h3>
            <p className="text-[11px] text-[#708FAE]">
              Multimodal Vision & Language Processing
            </p>
          </div>
        </div>

        <p className="text-[12px] text-[#43607E] leading-relaxed mb-3">
          BHUदृष्टि leverages Gemini 2.5 Flash / 3.8 Flash multimodal vision encoding to interpret
          high-res satellite and user-uploaded orthophotos with zero local device GPU load.
        </p>

        <div className="flex items-center gap-2 bg-[#E8F5E9] border border-[#2E7D32]/30 rounded-xl p-2.5 mb-4 text-[11px] text-[#2E7D32] font-medium">
          <ShieldCheck className="w-4 h-4 flex-shrink-0" />
          <span>Real optical pixel computer vision engine runs automatically when offline or without key.</span>
        </div>

        <form onSubmit={handleSave}>
          <div className="mb-2">
            <label className="block text-[11px] font-semibold text-[#0A2239] mb-1">
              Custom Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              data-testid="api_key_input_field"
              className="w-full h-11 px-3 rounded-xl bg-white border border-[#D0E4F8] focus:border-[#0288D1] focus:ring-2 focus:ring-[#0288D1]/20 outline-none text-[13px] font-mono"
            />
          </div>

          <p className="text-[10px] text-[#708FAE] mb-5">
            Tip: In AI Studio, keys can also be injected via the Secrets panel as GEMINI_API_KEY.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onDismiss}
              className="px-4 py-2 text-[12px] font-semibold text-[#43607E] hover:bg-[#F0F7FF] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              data-testid="save_api_key_button"
              className="px-5 py-2 bg-[#0288D1] hover:bg-[#0277BD] text-white text-[12px] font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
