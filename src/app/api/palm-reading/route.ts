import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mediaType, dominantHand } = await request.json();
    if (!imageBase64) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    const result = await model.generateContent([
      {
        text: `You are a mystical AI palmist. Analyze this ${dominantHand || 'dominant'} hand palm image and return a JSON object ONLY — no markdown, no code fences.

{
  "overview": "2-3 sentence mystical opening about what you see",
  "loveLife": {
    "description": "Heart line analysis — emotional nature, relationships, love style",
    "insight": "A specific personal prediction about love or relationships"
  },
  "careerPath": {
    "description": "Fate line analysis — career direction, ambition, life purpose",
    "insight": "A specific insight about career or destiny"
  },
  "lifeEnergy": {
    "description": "Life line analysis — vitality, health energy, major life changes",
    "insight": "A specific insight about their life force or upcoming changes"
  },
  "hiddenTalents": {
    "description": "Head line analysis — intellect, creativity, hidden gifts",
    "insight": "A specific talent or mental gift revealed by the lines"
  },
  "luckyPeriod": {
    "description": "Overall palm reading about their most fortunate upcoming period",
    "insight": "When and why their luck peaks"
  },
  "luckyNumbers": ["7", "3", "21"],
  "luckyColors": ["Purple", "Gold"],
  "affirmation": "A powerful closing affirmation for this person",
  "disclaimer": "For entertainment purposes only"
}

Be mystical, poetic, and personal. Return ONLY the JSON object.`,
      },
      {
        inlineData: {
          mimeType: (mediaType || 'image/jpeg') as string,
          data: imageBase64,
        },
      },
    ]);

    const raw = result.response.text();
    const match = raw.match(/\{[\s\S]*\}/);
    const reading = JSON.parse(match ? match[0] : raw);

    return NextResponse.json({ reading });
  } catch (err: any) {
    console.error('Palm reading error:', err);
    return NextResponse.json({ error: err.message || 'Failed to analyze palm.' }, { status: 500 });
  }
}
