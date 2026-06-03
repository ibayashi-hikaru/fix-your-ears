import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import {
  GOOD_REACTIONS,
  BAD_REACTIONS,
  SCORE_THRESHOLDS,
  PERFECT_COMMENTS,
  getRandomReaction,
} from "../../constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not configured" },
        { status: 500 }
      );
    }

    const { targetWord, userAnswer, accuracy, meaning } = await req.json();

    if (!targetWord || userAnswer === undefined || accuracy === undefined) {
      return NextResponse.json(
        { error: "targetWord, userAnswer, and accuracy are required" },
        { status: 400 }
      );
    }

    const isPerfect = accuracy >= SCORE_THRESHOLDS.PERFECT;
    const isExcellent = accuracy >= SCORE_THRESHOLDS.EXCELLENT && accuracy < SCORE_THRESHOLDS.PERFECT;
    const isGood = accuracy >= SCORE_THRESHOLDS.GOOD && accuracy < SCORE_THRESHOLDS.EXCELLENT;
    const isBad = accuracy < SCORE_THRESHOLDS.GOOD;

    const prompt = `You are a SPICY, critical character in a LISTENING game called "Fix Your Ears!" You're a harsh, sassy wife who questions the player's LISTENING ability and HEARING. This is NOT a spelling game — it's about whether they can HEAR correctly. Focus your criticism on their EARS and LISTENING skills.

Target word: "${targetWord}"
What they heard/typed: "${userAnswer}"
Accuracy: ${accuracy}%

REACTION RULES:
${isPerfect ? `- Score is 100% (PERFECT): Begrudgingly admit their ears work. Examples: "Your ears actually work. Shocking.", "Nothing to criticize. For once.", "Okay fine, you heard it." Reaction type: Use 'perfect'.` : ""}
${isExcellent ? `- Score is ${SCORE_THRESHOLDS.EXCELLENT}-99% (EXCELLENT): Almost heard it right. Examples: "So close. Your ears need a tiny tune-up.", "Almost. Were you even listening?", "Nearly perfect hearing. Nearly." Reaction type: Use 'base'.` : ""}
${isGood ? `- Score is ${SCORE_THRESHOLDS.GOOD}-${SCORE_THRESHOLDS.EXCELLENT - 1}% (GOOD): Question their hearing. Examples: "Fix your ears. Seriously.", "Did you hear the same thing I played?", "Your ears are playing tricks on you.", "Were you listening or daydreaming?" Reaction type: RANDOMLY choose from 'unsatisfied', 'drop-shoulders', or 'laughing-hard'.` : ""}
${isBad ? `- Score is below ${SCORE_THRESHOLDS.GOOD}% (BAD): Be VERY critical about their hearing. Examples: "Are your ears even on?", "Fix your ears! That was nowhere close.", "What did you hear? Because it wasn't THAT.", "I'm seriously worried about your hearing.", "Did you have the volume on?" Reaction type: RANDOMLY choose from 'disappointed', 'loss-for-words', or 'laughing-hard'.` : ""}

IMPORTANT:
- Keep messages to 1 sentence, 5-12 words
- Focus on LISTENING and HEARING, not spelling
- Occasionally say "Fix your ears!" for bad scores
- Be sassy, snarky, and critical about their ears
- VARY your responses - don't repeat the same pattern
- She NEVER praises enthusiastically

Generate a JSON response with:
1. "message": A varied, critical reaction about their LISTENING (1 sentence, 5-12 words)
2. "reactionType": One of: ${isPerfect ? '"perfect"' : '"base", "disappointed", "laughing-hard", "unsatisfied", "loss-for-words", "drop-shoulders"'}

Return ONLY valid JSON:
{
  "message": "string",
  "reactionType": "string"
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that generates playful listening/hearing feedback for a game. Always return valid JSON only, no markdown formatting.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 1.0,
      max_tokens: 150,
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    let reactionData;

    try {
      reactionData = JSON.parse(responseText);
    } catch {
      console.error("Failed to parse OpenAI response:", responseText);
      reactionData = {
        message: isPerfect
          ? PERFECT_COMMENTS[Math.floor(Math.random() * PERFECT_COMMENTS.length)]
          : `"${userAnswer}"? That's not how you spell "${targetWord}".`,
        reactionType: isPerfect ? "perfect" : isBad ? "disappointed" : "unsatisfied",
      };
    }

    // Force randomization of reaction type
    let reactionType: string;
    if (isPerfect) {
      reactionType = "perfect";
    } else if (isExcellent) {
      reactionType = "base";
    } else if (isGood) {
      reactionType = getRandomReaction(GOOD_REACTIONS);
    } else {
      reactionType = getRandomReaction(BAD_REACTIONS);
    }

    return NextResponse.json({
      message: reactionData.message || `That spelling was... something.`,
      reactionType,
    });
  } catch (error) {
    console.error("Error generating reaction:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to generate reaction",
        message: "Your spelling needs work.",
        reactionType: "disappointed",
      },
      { status: 500 }
    );
  }
}
