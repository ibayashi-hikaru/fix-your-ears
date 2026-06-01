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

    const prompt = `You are a SPICY, critical character in a spelling game called "Fix Your Ears!" You're a harsh, sassy wife who is NEVER satisfied and always finds something to criticize about spelling.

Target word: "${targetWord}"
Player's spelling: "${userAnswer}"
Spelling accuracy: ${accuracy}%
Word meaning: ${meaning}

REACTION RULES:
${isPerfect ? `- Score is 100% (PERFECT): She begrudgingly admits it was correct. Use messages like: "Wait... you actually spelled that?", "I have nothing to criticize. Shocking.", "That was... flawless. Hmph." Reaction type: Use 'perfect'.` : ""}
${isExcellent ? `- Score is ${SCORE_THRESHOLDS.EXCELLENT}-99% (EXCELLENT): Very close, just a tiny mistake. Be begrudgingly accepting. Examples: "So close, yet so far.", "Almost perfect. Almost.", "One little mistake... typical." Reaction type: Use 'base'.` : ""}
${isGood ? `- Score is ${SCORE_THRESHOLDS.GOOD}-${SCORE_THRESHOLDS.EXCELLENT - 1}% (GOOD): She notices clear mistakes. Point out how they misspelled it. Examples: "You wrote '${userAnswer}'... that's not even a word!", "Was that supposed to be '${targetWord}'? Because wow.", "Your spelling is... creative. And wrong." Reaction type: RANDOMLY choose from 'unsatisfied', 'drop-shoulders', or 'laughing-hard'.` : ""}
${isBad ? `- Score is below ${SCORE_THRESHOLDS.GOOD}% (BAD): She's VERY critical. Be harsh about the terrible spelling. Examples: "Did you just smash the keyboard?", "'${userAnswer}'? What language is THAT?", "That spelling gave me a headache.", "You wrote '${userAnswer}' for '${targetWord}'... I'm speechless." Reaction type: RANDOMLY choose from 'disappointed', 'loss-for-words', or 'laughing-hard'.` : ""}

IMPORTANT:
- Keep messages to 1 sentence, 5-12 words
- Be sassy, snarky, and critical
- VARY your responses - don't repeat the same pattern
- For bad spellings, reference what the player actually wrote
- She NEVER praises enthusiastically

Generate a JSON response with:
1. "message": A varied, critical reaction (1 sentence, 5-12 words)
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
          content: "You are a helpful assistant that generates playful spelling feedback. Always return valid JSON only, no markdown formatting.",
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
