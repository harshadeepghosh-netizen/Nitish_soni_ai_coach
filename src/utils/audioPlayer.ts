/**
 * Utility to reliably play TTS audio from base64 PCM/WAV data or fallback to SpeechSynthesis API.
 * Prevents "Failed to load because no supported source was found" media errors.
 */

export async function playNitishAudio(base64Data?: string, textFallback?: string): Promise<void> {
  if (base64Data) {
    try {
      const binaryStr = atob(base64Data);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      // Check if binary has RIFF/WAVE header (0x52494646)
      const hasRiffHeader =
        bytes.length > 12 &&
        bytes[0] === 0x52 &&
        bytes[1] === 0x49 &&
        bytes[2] === 0x46 &&
        bytes[3] === 0x46;

      let wavBytes: Uint8Array;
      if (hasRiffHeader) {
        wavBytes = bytes;
      } else {
        // Construct standard 44-byte WAV header (24kHz, 16-bit, 1 channel PCM)
        const sampleRate = 24000;
        const numChannels = 1;
        const bitsPerSample = 16;
        const dataSize = bytes.length;
        const header = new ArrayBuffer(44);
        const view = new DataView(header);

        // RIFF header
        view.setUint32(0, 0x52494646, false); // "RIFF"
        view.setUint32(4, 36 + dataSize, true);
        view.setUint32(8, 0x57415645, false); // "WAVE"

        // fmt chunk
        view.setUint32(12, 0x666d7420, false); // "fmt "
        view.setUint32(16, 16, true);
        view.setUint16(20, 1, true); // PCM
        view.setUint16(22, numChannels, true);
        view.setUint32(24, sampleRate, true);
        view.setUint32(28, sampleRate * numChannels * (bitsPerSample / 8), true);
        view.setUint16(32, numChannels * (bitsPerSample / 8), true);
        view.setUint16(34, bitsPerSample, true);

        // data chunk
        view.setUint32(36, 0x64617461, false); // "data"
        view.setUint32(40, dataSize, true);

        const merged = new Uint8Array(44 + dataSize);
        merged.set(new Uint8Array(header), 0);
        merged.set(bytes, 44);
        wavBytes = merged;
      }

      const blob = new Blob([wavBytes], { type: 'audio/wav' });
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.playbackRate = 1.15; // Fast, energetic gym trainer speed

      await new Promise<void>((resolve, reject) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve();
        };
        audio.onerror = (e) => {
          URL.revokeObjectURL(url);
          reject(e);
        };
        audio.play().catch(reject);
      });
      return;
    } catch (err) {
      console.warn('Audio element play failed, falling back to Web Speech synthesis:', err);
    }
  }

  // Web Speech Fallback (Fast & Energetic Speech)
  if (textFallback && typeof window !== 'undefined' && 'speechSynthesis' in window) {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const cleanText = textFallback
        .replace(/[\#\*\_`~\-><]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      // Keep voice summary crisp (< 350 chars) for fast reading
      let shortText = cleanText;
      if (cleanText.length > 350) {
        const truncated = cleanText.slice(0, 350);
        const lastPeriod = truncated.lastIndexOf('.');
        shortText = lastPeriod > 100 ? truncated.slice(0, lastPeriod + 1) : truncated + '.';
      }

      const utterance = new SpeechSynthesisUtterance(shortText);
      utterance.rate = 1.05; // Expressive, rhythmic Bengali cadence
      utterance.pitch = 0.65; // Warm, resonant male tone
      utterance.volume = 1.0;
      utterance.lang = 'en-IN'; // Force Indian/Bengali English locale

      // Select Bengali or Indian male voice if available (filter out known female voices)
      const voices = window.speechSynthesis.getVoices();
      const bengaliOrIndianVoice = voices.find((v) => {
        const name = v.name.toLowerCase();
        const lang = v.lang.toLowerCase();
        const isBengali = lang.includes('bn') || name.includes('bengali') || name.includes('bangla');
        const isIndian = lang.includes('en-in') || lang.includes('hi-in') || lang.includes('en_in') || name.includes('india');
        const isFemale = name.includes('female') || name.includes('neerja') || name.includes('veena') || name.includes('aditi') || name.includes('heera') || name.includes('zira') || name.includes('hazel');
        const isMale = name.includes('male') || name.includes('prabhat') || name.includes('raju') || name.includes('karan') || name.includes('david') || name.includes('guy') || name.includes('joy');
        
        return (isBengali || isIndian) && (isMale || !isFemale);
      });

      if (bengaliOrIndianVoice) {
        utterance.voice = bengaliOrIndianVoice;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  }
}

export const playBappaAudio = playNitishAudio;
