/**
 * ISRO / Spaceflight Mission Control Audio Briefing Service
 * Synthesizes natural-sounding speech preceded by authentic radio telemetry squelch chimes
 */

let currentUtterance: SpeechSynthesisUtterance | null = null;
let audioContext: AudioContext | null = null;

// Generate realistic mission control radio squelch & telemetry chime using Web Audio API
export function playMissionRadioChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) {
        resolve();
        return;
      }

      if (!audioContext || audioContext.state === 'closed') {
        audioContext = new AudioCtx();
      }

      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }

      const ctx = audioContext;
      const now = ctx.currentTime;

      // Dual telemetry tone (NASA / ISRO Quindar style roger beep: 880Hz then 1760Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(940, now);
      osc1.frequency.exponentialRampToValueAtTime(1420, now + 0.08);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1860, now + 0.08);
      osc2.frequency.exponentialRampToValueAtTime(2340, now + 0.16);

      gainNode.gain.setValueAtTime(0.001, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.1);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.22);

      setTimeout(() => {
        resolve();
      }, 240);
    } catch {
      resolve();
    }
  });
}

export function playMissionAudioBriefing(
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }
): void {
  stopMissionAudioBriefing();

  if (!('speechSynthesis' in window)) {
    callbacks?.onError?.(new Error('Speech Synthesis not supported in this browser.'));
    return;
  }

  // Play tactical telemetry chime first
  playMissionRadioChime().then(() => {
    try {
      window.speechSynthesis.cancel();

      // Format text with mission control preamble
      const missionPreamble = `Mission Control downlink established. Reading remote sensing intelligence briefing: ${text}. Over and out.`;
      const utterance = new SpeechSynthesisUtterance(missionPreamble);

      utterance.rate = 1.02; // Crisp, professional pacing
      utterance.pitch = 0.95; // Authoritative, grounded mission control tone

      // Pick crisp English voice
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Daniel') ||
            v.name.includes('Arthur') ||
            v.name.includes('Samantha') ||
            v.name.includes('US English'))
      ) || voices.find((v) => v.lang.startsWith('en'));

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        callbacks?.onStart?.();
      };

      utterance.onend = () => {
        currentUtterance = null;
        callbacks?.onEnd?.();
      };

      utterance.onerror = (e) => {
        currentUtterance = null;
        callbacks?.onError?.(e);
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      callbacks?.onError?.(err);
    }
  });
}

export function stopMissionAudioBriefing(): void {
  try {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentUtterance = null;
  } catch {
    // ignore
  }
}
