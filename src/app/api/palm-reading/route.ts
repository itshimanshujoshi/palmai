import { NextRequest, NextResponse } from 'next/server';
import { model } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const { imageBase64, mediaType, dominantHand } = await request.json();
    if (!imageBase64) return NextResponse.json({ error: 'No image provided' }, { status: 400 });

    const result = await model.generateContent([
      {
        text: `You are a mystical AI palmist with deep knowledge of traditional palmistry.

This is the person's ${dominantHand || 'right'} hand — their DOMINANT hand.

${dominantHand === 'right'
  ? 'The RIGHT (dominant) hand reveals the person\'s PRESENT life, conscious choices, career achievements, and future path — what they are actively creating.'
  : 'The LEFT (dominant) hand reveals the person\'s PRESENT life, conscious choices, career achievements, and future path — what they are actively creating.'}

${dominantHand === 'right'
  ? 'The left hand shows potential and past; the RIGHT hand (this one) shows WHO THEY ARE NOW and where they are heading.'
  : 'The right hand shows external actions; the LEFT hand (this one) shows their TRUE inner nature, innate gifts, and deepest potential.'}

Use this hand-specific context to make the reading uniquely different from the opposite hand — emphasize ${dominantHand === 'left' ? 'inner nature, raw talent, emotional truth, and subconscious patterns' : 'current reality, active choices, career trajectory, and conscious direction'}.

Analyze the palm image and return a JSON object ONLY — no markdown, no code fences.

{
  "overview": "2-3 sentence mystical opening that specifically references this being their ${dominantHand} hand and what that reveals",
  "loveLife": {
    "description": "Heart line analysis — emotional nature, relationships, love style (framed through the ${dominantHand} hand lens)",
    "insight": "A specific personal prediction about love or relationships"
  },
  "careerPath": {
    "description": "Fate line analysis — career direction, ambition, life purpose (framed through the ${dominantHand} hand lens)",
    "insight": "A specific insight about career or destiny"
  },
  "lifeEnergy": {
    "description": "Life line analysis — vitality, health energy, major life changes (framed through the ${dominantHand} hand lens)",
    "insight": "A specific insight about their life force or upcoming changes"
  },
  "hiddenTalents": {
    "description": "Head line analysis — intellect, creativity, hidden gifts (framed through the ${dominantHand} hand lens)",
    "insight": "A specific talent or mental gift revealed by the lines"
  },
  "luckyPeriod": {
    "description": "Overall reading about their most fortunate upcoming period",
    "insight": "When and why their luck peaks"
  },
  "luckyNumbers": ["7", "3", "21"],
  "luckyColors": ["Purple", "Gold"],
  "affirmation": "A powerful closing affirmation for this person"
}

Return ONLY the JSON object.`,
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
