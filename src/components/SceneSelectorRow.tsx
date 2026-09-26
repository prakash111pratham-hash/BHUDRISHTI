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
    // Reset file input value so re-selecting same file works
    e.target.value = '';
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold text-[#708FAE] tracking-wider uppercase">
          TARGET SATELLITE SCENES
        </span>
        <span className="text-[11px] font-medium text-[#0288D1]">
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
          className="flex-shrink-0 w-32 h-28 rounded-xl bg-white border border-dashed border-[#0288D1]/70 hover:border-[#0288D1] hover:bg-[#F0F7FF] transition-all flex flex-col items-center justify-center p-2.5 shadow-2xs group"
        >
          <div className="w-9 h-9 rounded-full bg-[#0288D1]/10 flex items-center justify-center text-[#0288D1] group-hover:scale-110 transition-transform">
            <ImagePlus className="w-5 h-5" />
          </div>
          <span className="text-[12px] font-semibold text-[#0A2239] mt-2">
            Import Tile
          </span>
          <span className="text-[10px] text-[#708FAE]">
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
              className={`flex-shrink-0 w-44 h-28 rounded-xl overflow-hidden cursor-pointer transition-all border relative flex flex-col shadow-2xs ${
                isSelected
                  ? 'border-[#0288D1] ring-2 ring-[#0288D1]/30'
                  : 'border-[#D0E4F8] hover:border-[#0288D1]/60'
              }`}
            >
              {/* Scene thumbnail */}
              <div className="h-16 w-full bg-[#0A2239] overflow-hidden relative">
                <img
                  src={scene.imageSrc}
                  alt={scene.title}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 bg-[#0288D1] text-white rounded-full p-0.5 shadow-xs">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Scene label */}
              <div className="flex-1 bg-white p-2 flex flex-col justify-center">
                <div
                  className={`text-[11px] font-semibold truncate ${
                    isSelected ? 'text-[#0288D1]' : 'text-[#0A2239]'
                  }`}
                >
                  {scene.title}
                </div>
                <div className="text-[10px] text-[#708FAE] truncate">
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
