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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0B1528] rounded-2xl border border-[#182C4D] shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-150 text-white">
        <button
          onClick={onDismiss}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-9 h-9 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] border border-[#00E5FF]/30">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-white">
              Gemini Cloud API Configuration
            </h3>
            <p className="text-[11px] text-slate-400 font-mono">
              Multimodal Vision & Language Processing
            </p>
          </div>
        </div>

        <p className="text-[12px] text-slate-300 leading-relaxed mb-3">
          BHUदृष्टि leverages Gemini 2.5 Flash multimodal vision encoding to interpret
          high-res satellite and user-uploaded orthophotos with zero local device GPU load.
        </p>

        <div className="flex items-center gap-2 bg-[#00E676]/10 border border-[#00E676]/30 rounded-xl p-2.5 mb-4 text-[11px] text-emerald-300 font-medium">
          <ShieldCheck className="w-4 h-4 flex-shrink-0 text-emerald-400" />
          <span>Real optical pixel computer vision engine runs automatically when offline or without key.</span>
        </div>

        <form onSubmit={handleSave}>
          <div className="mb-2">
            <label className="block text-[11px] font-semibold text-slate-300 mb-1 font-mono">
              Custom Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="AIzaSy..."
              data-testid="api_key_input_field"
              className="w-full h-11 px-3 rounded-xl bg-[#08101E] border border-[#182C4D] text-white focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF] outline-none text-[13px] font-mono placeholder-slate-600"
            />
          </div>

          <p className="text-[10px] text-slate-400 mb-5 font-mono">
            Tip: In AI Studio, keys can also be injected via the Secrets panel as GEMINI_API_KEY.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onDismiss}
              className="px-4 py-2 text-[12px] font-semibold text-slate-400 hover:text-white hover:bg-[#122340] rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              data-testid="save_api_key_button"
              className="px-5 py-2 bg-[#00E5FF] hover:bg-[#38BDF8] text-slate-950 text-[12px] font-black rounded-lg shadow-lg transition-colors cursor-pointer"
            >
              Save Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
