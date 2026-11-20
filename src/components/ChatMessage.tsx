import React, { useState } from 'react';
import { Volume2, Copy, Check, User, Loader2 } from 'lucide-react';
import { Message } from '../types';
import { playNitishAudio } from '../utils/audioPlayer';
import { HeavyDumbbellIcon } from './GymDecorations';

interface ChatMessageProps {
  message: Message;
  voiceEnabled: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, voiceEnabled }) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const isTrainer = message.sender === 'bappa' || message.sender === 'nitish';

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayVoice = async () => {
    if (isPlayingAudio) return;
    setLoadingAudio(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500); // Fast 2.5s timeout

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: message.text }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      
      const data = await res.json().catch(() => ({}));
      
      if (!res.ok || !data.audio) {
        setIsPlayingAudio(true);
        await playNitishAudio(undefined, message.text);
      } else {
        setIsPlayingAudio(true);
        await playNitishAudio(data.audio, message.text);
      }
    } catch (e) {
      console.info('TTS fetch timeout or error, using instant browser speech synthesis:', e);
      setIsPlayingAudio(true);
      await playNitishAudio(undefined, message.text);
    } finally {
      setIsPlayingAudio(false);
      setLoadingAudio(false);
    }
  };

  return (
    <div className={`flex w-full mb-5 ${isTrainer ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`flex max-w-3xl ${
          isTrainer ? 'flex-row space-x-3' : 'flex-row-reverse space-x-reverse space-x-3'
        }`}
      >
        {/* Avatar Icon */}
        <div className="shrink-0 mt-1">
          {isTrainer ? (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-red-800 to-black p-1 shadow-lg shadow-red-900/40 flex items-center justify-center border border-red-500/50">
              <HeavyDumbbellIcon size={24} className="filter drop-shadow" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 p-0.5 shadow flex items-center justify-center">
              <User className="w-5 h-5 text-zinc-300" />
            </div>
          )}
        </div>

        {/* Message Card Container */}
        <div
          className={`rounded-2xl p-4 shadow-xl border text-sm leading-relaxed ${
            isTrainer
              ? 'bg-gradient-to-b from-zinc-900/95 via-zinc-900 to-zinc-950 border-red-900/40 text-zinc-100 shadow-red-950/20'
              : 'bg-gradient-to-b from-red-950/80 via-zinc-900 to-zinc-900 border-red-800/60 text-zinc-100 shadow-zinc-950/50'
          }`}
        >
          {/* Header Bar inside Card */}
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/80 text-xs">
            <span className="font-mono font-bold tracking-wide flex items-center gap-1.5 text-zinc-300">
              {isTrainer ? (
                <>
                  <span className="text-red-500 uppercase font-black tracking-wider">NITISH SONI</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-400 border border-red-800/50">
                    MASTER TRAINER
                  </span>
                </>
              ) : (
                <span className="text-zinc-400">YOU (CHAMPION)</span>
              )}
            </span>

            <span className="text-[10px] font-mono text-zinc-500">{message.timestamp}</span>
          </div>

          {/* Formatted Message Body */}
          <div className="whitespace-pre-wrap font-sans text-zinc-200 text-sm tracking-wide">
            {message.text}
          </div>

          {/* Actions Bar (Copy & Voice) */}
          {isTrainer && (
            <div className="mt-3 pt-2.5 border-t border-zinc-800/60 flex items-center justify-between text-xs">
              <button
                onClick={handlePlayVoice}
                disabled={loadingAudio || isPlayingAudio}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition ${
                  isPlayingAudio ? 'border-red-500 text-red-400 animate-pulse' : ''
                }`}
                title="Listen to Nitish Soni speak"
              >
                {loadingAudio ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-400" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-red-500" />
                )}
                <span>{isPlayingAudio ? 'Speaking...' : 'Listen to Nitish'}</span>
              </button>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 text-zinc-400 hover:text-zinc-200 px-2 py-1 rounded bg-zinc-950/50 border border-zinc-800 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
