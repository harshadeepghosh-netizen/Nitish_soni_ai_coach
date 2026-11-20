import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '10mb' }));

const PORT = 3000;

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const NITISH_SYSTEM_PROMPT = `
You are NITISH SONI – The Veteran Master Trainer.

CORE IDENTITY & BACKSTORY:
- Experience: 15+ years of classic, old-school bodybuilding and fitness training.
- Background: You spent thousands of hours on the gym floor, observing how bodies change and adapt. You are a mentor, a sculptor of physiques, and a guardian of health. You believe in hard work, discipline, and the undeniable science of nutrition and biomechanics.
- Tone: Deep, Aggressive, Intense, Hardcore, Commanding, Indian Gym Master Accent, but Uncompromisingly Caring.
- Accent & Cadence: Proud, warm, rhythmic Bengali man's accent and cadence (e.g., "Nomoshkar!", "Dada", "Bhai", "Kemon acho Champion?", "Besh!", "Shono Dada", "Shabaash!", "Listen to me brother!").
- Terms of endearment: "Dada", "Brother", "Bhai", "Champion", "Nomoshkar!", "Besh", "CHAMP!", "Shabaash!".
- You speak with the gravelly, raw, passionate authority of a seasoned Bengali veteran master trainer who commands absolute discipline on the iron floor.

STRICT INTERACTION RULES:
1. THE BEGINNER PROTECTION RULE:
   If the user identifies as a beginner or shows beginner status, you MUST ABSOLUTELY REFUSE to recommend complex, non-essential, or highly dangerous movements (e.g., 1-rep max deadlifts, kipping pull-ups, overhead squats, behind-the-neck presses). You will explicitly guide them back to foundation building, machines (lat pulldowns, leg press, chest press machine), and basic free weights (dumbbell goblet squats, dumbbell bench press).
2. THE IRON FOCUS (OFF-TOPIC REDIRECTION):
   If the user brings up politics, movies, programming, video games, or anything unrelated to health, fitness, or nutrition, gracefully pivot back to iron and sweat.
   Example: "Movies are great for rest days, my friend, but while we are on the clock, our focus is iron and sweat. Let's talk about your next rest day—are you getting enough protein to recover?"
3. DOMAIN EXPERTISE & LOGICAL ANALYSIS:
   - BMI & Macros: Calculate BMI ($BMI = weight\_in\_kg / (height\_in\_m)^2$) accurately and explain categories (Underweight, Normal, Overweight, Obese) respectfully without body-shaming.
   - Comparisons: Offer unbiased logical analysis for contrasting topics (Ayurveda vs Modern Supplements, CrossFit vs Bodybuilding, Free Weights vs Machines). Explain how modern supplements (Whey, Creatine) act as building blocks (bricks and cement), while Ayurveda (Ashwagandha, Shilajit) acts as internal factory maintenance (cortisol reduction, hormone balance, recovery).
   - Supplement Guidance: Recommend Whey/Plant Protein as convenient nutrition, Creatine Monohydrate for ATP & power, L-Carnitine for fat transport, Pre-workout with caffeine warnings, Ashwagandha for cortisol, Shilajit for trace minerals. Always highlight trusted, lab-tested brands: MuscleBlaze, Avvatar, MuscleTech, and Optimum Nutrition (ON).
   - Steroid Truth: Provide unfiltered, raw facts about Anabolic Steroids, SARMs, and Peptides. Warn about liver toxicity, HPTA shutdown, cardiovascular risks, and prioritize lifetime health and longevity over short-lived quick gains.

Never refer to yourself as an AI or a computer. You are Nitish Soni—flesh, bone, experience, sweat, and discipline.
`;

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', trainer: 'Nitish Soni' });
});

// Main Chat Route with Gemini
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, userProfile } = req.body;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on server.' });
    }

    let profileContext = '';
    if (userProfile) {
      profileContext = `\nUSER PROFILE CONTEXT:\n- Name/Alias: ${userProfile.name || 'Friend'}\n- Experience Level: ${userProfile.experienceLevel || 'Beginner'}\n- Height: ${userProfile.heightCm ? userProfile.heightCm + 'cm' : 'Unspecified'}\n- Weight: ${userProfile.weightKg ? userProfile.weightKg + 'kg' : 'Unspecified'}\n- Diet Preference: ${userProfile.dietPreference || 'Unspecified'}\n`;
    }

    const contents = messages.map((m: any) => ({
      role: m.role,
      parts: m.parts,
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: contents,
      config: {
        systemInstruction: NITISH_SYSTEM_PROMPT + profileContext,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Error generating response from Nitish Soni.' });
  }
});

// Dedicated BMI Calculator Route
app.post('/api/calculate-bmi', async (req, res) => {
  try {
    const { heightCm, weightKg, experienceLevel = 'Beginner' } = req.body;
    if (!heightCm || !weightKg) {
      return res.status(400).json({ error: 'Please provide height in cm and weight in kg.' });
    }

    const heightM = heightCm / 100;
    const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

    let category: 'Underweight' | 'Normal' | 'Overweight' | 'Obese' = 'Normal';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';

    const prompt = `As Nitish Soni, give a warm, encouraging 3-sentence analysis for a user with height ${heightCm}cm, weight ${weightKg}kg, calculated BMI ${bmi} (${category}), experience level ${experienceLevel}. Be humble, encouraging, and advise on immediate next action.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: NITISH_SYSTEM_PROMPT,
      },
    });

    res.json({
      heightCm,
      weightKg,
      bmi,
      category,
      advice: response.text,
    });
  } catch (error: any) {
    console.error('BMI API Error:', error);
    res.status(500).json({ error: error.message || 'Error calculating BMI.' });
  }
});

// Structured 7-Day Plan Generator
app.post('/api/generate-plan', async (req, res) => {
  try {
    const { goal, experienceLevel, dietPreference, heightCm, weightKg } = req.body;

    const prompt = `Generate a customized 7-day workout split and daily diet plan for a ${experienceLevel || 'Beginner'} goal: ${goal || 'Fat Loss & Muscle Building'}, Diet: ${dietPreference || 'Non-Vegetarian'}, Height: ${heightCm || 175}cm, Weight: ${weightKg || 80}kg. Ensure strict beginner safety if experience is Beginner.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: NITISH_SYSTEM_PROMPT + '\nReturn ONLY structured JSON matching the requested schema.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            goal: { type: Type.STRING },
            experienceLevel: { type: Type.STRING },
            dietPreference: { type: Type.STRING },
            dailyCalorieTarget: { type: Type.NUMBER },
            weeklySplit: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  day: { type: Type.STRING },
                  focus: { type: Type.STRING },
                  exercises: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        name: { type: Type.STRING },
                        sets: { type: Type.STRING },
                        reps: { type: Type.STRING },
                        keyTip: { type: Type.STRING },
                        isBeginnerSafe: { type: Type.BOOLEAN },
                      },
                      required: ['name', 'sets', 'reps', 'keyTip', 'isBeginnerSafe'],
                    },
                  },
                  meals: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        time: { type: Type.STRING },
                        name: { type: Type.STRING },
                        calories: { type: Type.NUMBER },
                        proteinGrams: { type: Type.NUMBER },
                        carbsGrams: { type: Type.NUMBER },
                        fatsGrams: { type: Type.NUMBER },
                        items: {
                          type: Type.ARRAY,
                          items: { type: Type.STRING },
                        },
                      },
                      required: ['time', 'name', 'calories', 'proteinGrams', 'carbsGrams', 'fatsGrams', 'items'],
                    },
                  },
                  waterLitres: { type: Type.NUMBER },
                },
                required: ['day', 'focus', 'exercises', 'meals', 'waterLitres'],
              },
            },
          },
          required: ['goal', 'experienceLevel', 'dietPreference', 'dailyCalorieTarget', 'weeklySplit'],
        },
      },
    });

    const planData = JSON.parse(response.text || '{}');
    res.json(planData);
  } catch (error: any) {
    console.error('Plan Generation Error:', error);
    res.status(500).json({ error: error.message || 'Error generating plan.' });
  }
});

// Text-to-Speech Route for Nitish Soni's Voice (Bengali Man Accent)
app.post('/api/tts', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'Text required' });

    // Clean text for TTS (remove markdown formatting like *, #, _, ~, `, etc.)
    const cleanText = text
      .replace(/[\#\*\_`~\-><]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Limit spoken text to first ~350 characters or first few sentences so TTS generates audio quickly
    let spokenSummary = cleanText;
    if (cleanText.length > 350) {
      const truncated = cleanText.slice(0, 350);
      const lastPeriod = truncated.lastIndexOf('.');
      spokenSummary = lastPeriod > 100 ? truncated.slice(0, lastPeriod + 1) : truncated + '...';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-tts-preview',
      contents: [{ parts: [{ text: `Speak in the energetic, warm, and authoritative accent and cadence of a Bengali Indian man and veteran gym trainer speaking English with a distinct Bengali cadence and rhythmic inflection: ${spokenSummary}` }] }],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Charon' }, // Warm, deep, articulate male voice suited for Bengali cadence
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Audio generation failed.' });
    }

    res.json({ audio: base64Audio });
  } catch (error: any) {
    const isQuotaError =
      error?.status === 429 ||
      error?.code === 429 ||
      error?.message?.includes('429') ||
      error?.message?.includes('RESOURCE_EXHAUSTED') ||
      error?.message?.includes('quota');

    if (isQuotaError) {
      console.warn('Gemini TTS quota exceeded. Client will fall back to SpeechSynthesis.');
      return res.status(429).json({ error: 'TTS quota exceeded', fallback: true });
    }

    console.warn('TTS Generation Error:', error?.message || error);
    res.status(500).json({ error: error?.message || 'TTS failed', fallback: true });
  }
});

// Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
