/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Sparkles, Loader2, Dumbbell, ShieldAlert, RefreshCw, ExternalLink } from 'lucide-react';
import { Header } from './components/Header';
import { BiggerMottoBanner } from './components/BiggerMottoBanner';
import { ChatMessage } from './components/ChatMessage';
import { BmiCalculatorModal } from './components/BmiCalculatorModal';
import { PlanGeneratorModal } from './components/PlanGeneratorModal';
import { SupplementGuideModal } from './components/SupplementGuideModal';
import { BeginnerShieldModal } from './components/BeginnerShieldModal';
import { ProfileModal } from './components/ProfileModal';
import { Message } from './types';
import { playNitishAudio } from './utils/audioPlayer';

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'nitish',
      text: "Namaskar! Welcome to the gym floor, my friend. I am Nitish Soni. For over 15 years, I have lived by the iron, sweat, and honest science of bodybuilding and nutrition.\n\nWhether you need a 7-day workout and calorie-deficit diet, BMI calculation, supplement guidance (Whey, Creatine, Ashwagandha, Shilajit), or form advice—I am here to guide you with discipline and care.\n\nTell me, Champion: What is your current height, weight, and fitness goal today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [bgTheme, setBgTheme] = useState('hardcore');
  const [activeModal, setActiveModal] = useState<'bmi' | 'plan' | 'supplements' | 'beginner' | 'profile' | null>(null);

  const [userProfile, setUserProfile] = useState<{
    name: string;
    experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced';
    heightCm: number;
    weightKg: number;
    dietPreference: string;
    isProfileSaved: boolean;
  }>(() => {
    try {
      const saved = localStorage.getItem('nitish_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          name: parsed.name || 'Champion',
          experienceLevel: parsed.experienceLevel || 'Beginner',
          heightCm: parsed.heightCm || 175,
          weightKg: parsed.weightKg || 80,
          dietPreference: parsed.dietPreference || 'Non-Vegetarian',
          isProfileSaved: parsed.isProfileSaved ?? true,
        };
      }
    } catch (e) {
      console.error('Error reading user profile from localStorage:', e);
    }
    return {
      name: '',
      experienceLevel: 'Beginner',
      heightCm: 175,
      weightKg: 80,
      dietPreference: 'Non-Vegetarian',
      isProfileSaved: false,
    };
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Mandatory initial setup popup if profile is not saved yet
  useEffect(() => {
    if (!userProfile.isProfileSaved) {
      const timer = setTimeout(() => {
        setActiveModal('profile');
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [userProfile.isProfileSaved]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    if (!userProfile.isProfileSaved) {
      setActiveModal('profile');
      setSpeechError('⚠️ MANDATORY SETUP: Please fill in and save your Profile & Stats before asking Nitish Soni!');
      return;
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      // Format messages history for Gemini API
      const apiMessages = messages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('model' as const),
        parts: [{ text: m.text }],
      }));
      apiMessages.push({ role: 'user', parts: [{ text }] });

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          userProfile,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Server error');

      const nitishMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'nitish',
        text: data.text || 'Keep grinding, my friend!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, nitishMsg]);

      // If voiceEnabled, play speech output safely with fast 2.5s timeout fallback
      if (voiceEnabled) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2500);

          const ttsRes = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: nitishMsg.text }),
            signal: controller.signal,
          });
          clearTimeout(timeoutId);

          const ttsData = await ttsRes.json().catch(() => ({}));
          await playNitishAudio(ttsData.audio, nitishMsg.text);
        } catch (audioErr) {
          console.info('Audio auto-play timeout or error, playing instant browser voice:', audioErr);
          await playNitishAudio(undefined, nitishMsg.text);
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'nitish',
          text: `My friend, there was a minor disturbance in our gym signal (${err.message}). Take a breath, drink some water, and let's try again!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const [speechError, setSpeechError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  // Mic speech recognition support
  const handleMicToggle = async () => {
    setSpeechError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError(
        'Speech recognition is not supported in this browser. Please use Chrome/Edge or type your query.'
      );
      return;
    }

    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.error('Error stopping speech recognition:', e);
      }
      setIsListening(false);
      return;
    }

    // 1. First explicitly request getUserMedia to verify browser mic access
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Immediately release tracks so SpeechRecognition service can access mic hardware
        stream.getTracks().forEach((track) => track.stop());
      }
    } catch (micErr: any) {
      console.warn('Microphone getUserMedia permission error:', micErr);
      setSpeechError(
        'Microphone permission was denied or blocked. Please allow microphone access in your browser site permissions.'
      );
      setIsListening(false);
      return;
    }

    // 2. Initialize and start Web Speech Recognition
    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = navigator.language || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        const inIframe = window.self !== window.top;

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          if (inIframe) {
            setSpeechError(
              '⚠️ Embedded Preview Restriction: Chrome restricts Web Speech recognition inside embedded preview frames. Please click "Open in New Tab" (top-right of screen) to use voice speech-to-text!'
            );
          } else {
            setSpeechError('Microphone permission denied by browser. Please allow microphone access in your address bar.');
          }
        } else if (event.error === 'no-speech') {
          setSpeechError('No speech was detected. Please try speaking closer to your microphone.');
        } else if (event.error !== 'aborted') {
          setSpeechError(`Voice input issue (${event.error}). Opening the app in a new tab resolves iframe restrictions.`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e: any) {
      console.error('Failed to start speech recognition:', e);
      setSpeechError('Could not launch speech recognition. Try opening the app in a new tab.');
      setIsListening(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        sender: 'nitish',
        text: "Namaskar Champion! A fresh session on the gym floor. Let's work hard!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  // Background style based on user selected theme
  const getBgStyle = () => {
    if (bgTheme === 'chalk') {
      return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900 via-zinc-950 to-zinc-950';
    }
    if (bgTheme === 'neon') {
      return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/80 via-zinc-950 to-black';
    }
    return 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/50 via-zinc-950 to-zinc-950';
  };

  return (
    <div className={`min-h-screen text-zinc-100 font-sans flex flex-col relative overflow-x-hidden bg-zinc-950`}>
      {/* Real Gym Photo Background Layer with Atmospheric Dark Vignette Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop"
          alt="Aesthetic Dark Gym Background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter blur-[3px] scale-105 opacity-40 brightness-75 contrast-125"
        />
        {/* Dark Vignette & Ambient Warm Red/Amber Spotlight Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/85 via-zinc-950/75 to-black/95" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] bg-red-600/15 blur-[140px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[300px] bg-amber-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header Bar */}
      <div className="relative z-10">
        <Header
          userProfile={userProfile}
          setUserProfile={setUserProfile}
          voiceEnabled={voiceEnabled}
          setVoiceEnabled={setVoiceEnabled}
          openModal={(modal) => setActiveModal(modal)}
          bgTheme={bgTheme}
          setBgTheme={setBgTheme}
        />
      </div>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 flex flex-col justify-between relative z-10">
        <div>
          {/* Gym Motivational Motto Wall & Banner */}
          <BiggerMottoBanner
            onQuickPrompt={(p) => handleSendMessage(p)}
            openModal={(modal) => setActiveModal(modal)}
            experienceLevel={userProfile.experienceLevel}
          />

          {/* Quick Scenario Prompt Chips */}
          <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-red-500" /> Quick Topics:
            </span>

            <button
              onClick={() =>
                handleSendMessage('Which Whey protein and Creatine should I buy? Please recommend trusted brands.')
              }
              className="bg-zinc-900 hover:bg-red-950/80 border border-zinc-800 hover:border-red-600/60 text-zinc-300 hover:text-zinc-100 text-xs px-3 py-1.5 rounded-full transition"
            >
              💊 Whey & Creatine Brands
            </button>

            <button
              onClick={() =>
                handleSendMessage('Nitish sir, which is better: Ayurveda or modern supplements like whey and creatine?')
              }
              className="bg-zinc-900 hover:bg-red-950/80 border border-zinc-800 hover:border-red-600/60 text-zinc-300 hover:text-zinc-100 text-xs px-3 py-1.5 rounded-full transition"
            >
              🌿 Ayurveda vs Modern Science
            </button>

            <button
              onClick={() =>
                handleSendMessage('Nitish sir, can I perform 1-rep max heavy Deadlifts and Kipping pull-ups as a beginner?')
              }
              className="bg-zinc-900 hover:bg-amber-950/80 border border-zinc-800 hover:border-amber-600/60 text-amber-300 text-xs px-3 py-1.5 rounded-full transition"
            >
              🛡️ Beginner Deadlift Test
            </button>
          </div>

          {/* Chat Messages Stream */}
          <div className="space-y-4 mb-6" id="chat-stream-container">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} voiceEnabled={voiceEnabled} />
            ))}

            {loading && (
              <div className="flex items-center space-x-3 text-red-400 font-mono text-xs bg-zinc-950/80 p-3 rounded-xl border border-red-900/40 w-fit animate-pulse">
                <Dumbbell className="w-4 h-4 animate-spin text-red-500" />
                <span>Nitish Soni is analyzing form & nutrition...</span>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Floating Bottom Input Bar */}
        <div className="sticky bottom-3 z-30 pt-2">
          {speechError && (
            <div className="mb-2 p-2.5 rounded-xl bg-red-950/95 border border-red-600/80 text-red-100 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xl backdrop-blur-md">
              <div className="flex items-center space-x-2 flex-1 min-w-[200px]">
                <ShieldAlert className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>{speechError}</span>
              </div>
              <div className="flex items-center gap-3">
                {window.self !== window.top && (
                  <a
                    href={window.location.href}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-[11px] font-mono tracking-wide transition flex items-center gap-1 shadow-md"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Open in New Tab
                  </a>
                )}
                <button
                  onClick={() => setSpeechError(null)}
                  className="text-xs text-red-300 hover:text-white underline font-mono"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className={`relative flex items-center bg-zinc-950/90 backdrop-blur-md border rounded-2xl p-2 shadow-2xl shadow-black/80 transition ${
              isListening
                ? 'border-red-500 ring-2 ring-red-600/50 shadow-red-950/50'
                : 'border-red-900/50 focus-within:border-red-600'
            }`}
          >
            <button
              type="button"
              onClick={handleClearChat}
              className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 rounded-xl transition"
              title="Reset Chat Session"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isListening
                  ? '🎙️ Listening to your voice... Speak now!'
                  : 'Ask Nitish Soni about workouts, diet, macros, supplements, or form...'
              }
              className={`flex-1 bg-transparent border-none text-sm focus:outline-none px-3 transition ${
                isListening ? 'text-red-300 font-medium placeholder-red-400 animate-pulse' : 'text-zinc-100 placeholder-zinc-500'
              }`}
              disabled={loading}
              id="chat-input-field"
            />

            <button
              type="button"
              onClick={handleMicToggle}
              className={`p-2 rounded-xl transition flex items-center gap-1.5 ${
                isListening
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/80 animate-pulse ring-2 ring-red-400'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak to Nitish Soni (Voice Input)'}
              id="voice-input-mic-button"
            >
              {isListening ? (
                <>
                  <MicOff className="w-4 h-4 text-white" />
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider hidden sm:inline">Listening</span>
                </>
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="ml-1 p-2.5 rounded-xl bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-500 hover:to-red-700 text-white disabled:opacity-40 transition shadow-lg shadow-red-950/50 flex items-center justify-center"
              id="send-message-button"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-[10px] text-zinc-400 text-center font-mono mt-1">
            NITISH SONI • 15+ Years Veteran Master Trainer • Always consult a physician before changing your physical regime.
          </p>
        </div>
      </main>

      {/* Tool Modals */}
      <BmiCalculatorModal
        isOpen={activeModal === 'bmi'}
        onClose={() => setActiveModal(null)}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
        userProfile={userProfile}
      />

      <PlanGeneratorModal
        isOpen={activeModal === 'plan'}
        onClose={() => setActiveModal(null)}
        userProfile={userProfile}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
      />

      <SupplementGuideModal
        isOpen={activeModal === 'supplements'}
        onClose={() => setActiveModal(null)}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
      />

      <BeginnerShieldModal
        isOpen={activeModal === 'beginner'}
        onClose={() => setActiveModal(null)}
        onSendToChat={(prompt) => handleSendMessage(prompt)}
      />

      <ProfileModal
        isOpen={activeModal === 'profile'}
        onClose={() => setActiveModal(null)}
        userProfile={userProfile}
        setUserProfile={setUserProfile}
      />
    </div>
  );
}
