import React, { useRef } from 'react';
import { ImagePlus, CheckCircle2 } from 'lucide-react';
import { SatelliteScene } from '../types';

interface SceneSelectorRowProps {
  scenes: SatelliteScene[];
  selectedScene: SatelliteScene;
  onSceneSelected: (scene: SatelliteScene) => void;
  onCustomImageSelected: (dataUrl: string, name: string) => void;
}

export const SceneSelectorRow: React.FC<SceneSelectorRowProps> = ({
  scenes,
  selectedScene,
  onSceneSelected,
  onCustomImageSelected
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        onCustomImageSelected(dataUrl, file.name);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-[1520px] mx-auto px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-slate-400 tracking-wider uppercase font-mono">
          TARGET SATELLITE SCENES
        </span>
        <span className="text-[11px] font-mono text-[#00E5FF]">
          {scenes.length} Scenes Ready
        </span>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {/* Upload Custom Tile Button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          data-testid="upload_satellite_tile_button"
          className="flex-shrink-0 w-32 h-28 rounded-xl bg-[#0B1528] border border-dashed border-[#00B0FF]/50 hover:border-[#00E5FF] hover:bg-[#122340] transition-all flex flex-col items-center justify-center p-2.5 shadow-md group cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF] group-hover:scale-110 transition-transform">
            <ImagePlus className="w-5 h-5" />
          </div>
          <span className="text-[12px] font-semibold text-white mt-2">
            Import Tile
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            Custom Photo
          </span>
        </button>

        {/* Scene Cards */}
        {scenes.map((scene) => {
          const isSelected = scene.id === selectedScene.id;

          return (
            <div
              key={scene.id}
              onClick={() => onSceneSelected(scene)}
              data-testid={`scene_card_${scene.id}`}
              className={`flex-shrink-0 w-44 h-28 rounded-xl overflow-hidden cursor-pointer transition-all border relative flex flex-col shadow-md ${
                isSelected
                  ? 'border-[#00E5FF] ring-2 ring-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                  : 'border-[#182C4D] hover:border-[#00B0FF]/60 bg-[#0B1528]'
              }`}
            >
              {/* Scene thumbnail */}
              <div className="h-16 w-full bg-slate-950 overflow-hidden relative">
                <img
                  src={scene.imageSrc}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 bg-[#00E5FF] text-slate-950 rounded-full p-0.5 shadow-md">
                    <CheckCircle2 className="w-3.5 h-3.5 font-bold" />
                  </div>
                )}
              </div>

              {/* Scene label */}
              <div className="flex-1 bg-[#0B1528] p-2 flex flex-col justify-center">
                <div
                  className={`text-[11px] font-semibold truncate ${
                    isSelected ? 'text-[#00E5FF]' : 'text-slate-200'
                  }`}
                >
                  {scene.title}
                </div>
                <div className="text-[10px] text-slate-400 truncate font-mono">
                  {scene.domainCategory}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
