// Game constants

// Type for sentence item
export type SentenceItem = {
  text: string;
  difficulty: "beginner" | "intermediate" | "advanced";
};

// Sentences for dictation (10-15 words each)
export const SENTENCES: SentenceItem[] = [
  // Beginner
  { text: "I went to the store yesterday to buy some fresh vegetables.", difficulty: "beginner" },
  { text: "She always drinks coffee in the morning before going to work.", difficulty: "beginner" },
  { text: "The children played in the park until it started to rain.", difficulty: "beginner" },
  { text: "We are planning to visit our grandparents this weekend if possible.", difficulty: "beginner" },
  { text: "He enjoys reading books and listening to music in his free time.", difficulty: "beginner" },

  // Intermediate
  { text: "The presentation was quite informative and covered all the essential topics thoroughly.", difficulty: "intermediate" },
  { text: "She decided to pursue a career in medicine after volunteering at the hospital.", difficulty: "intermediate" },
  { text: "The weather has been particularly unpredictable lately with sudden temperature changes.", difficulty: "intermediate" },
  { text: "They have been working on this project for several months without any significant progress.", difficulty: "intermediate" },
  { text: "The restaurant received excellent reviews for its authentic cuisine and friendly service.", difficulty: "intermediate" },

  // Advanced
  { text: "Despite the circumstances, she managed to remain optimistic throughout the entire ordeal.", difficulty: "advanced" },
  { text: "The committee unanimously agreed that further investigation into the matter was absolutely necessary.", difficulty: "advanced" },
  { text: "His comprehensive analysis of the situation provided valuable insights into potential solutions.", difficulty: "advanced" },
  { text: "The archaeological discovery has significantly challenged previously accepted theories about ancient civilizations.", difficulty: "advanced" },
  { text: "She demonstrated remarkable perseverance in pursuing her ambitions despite numerous obstacles.", difficulty: "advanced" },

  // More Beginner
  { text: "My brother is learning how to play the guitar with online lessons.", difficulty: "beginner" },
  { text: "They decided to postpone the meeting until next week because of the weather.", difficulty: "beginner" },
  { text: "The cat was sleeping peacefully on the couch all afternoon yesterday.", difficulty: "beginner" },

  // More Intermediate
  { text: "The government announced new policies to address environmental concerns and reduce pollution.", difficulty: "intermediate" },
  { text: "Students are encouraged to participate actively in class discussions and group activities.", difficulty: "intermediate" },

  // More Advanced
  { text: "The economic implications of this decision will likely reverberate throughout the industry indefinitely.", difficulty: "advanced" },
  { text: "Her eloquent speech captivated the audience and inspired many to reconsider their perspectives.", difficulty: "advanced" },
];

export const TOTAL_SENTENCES_PER_GAME = 5;

// Score thresholds
export const SCORE_THRESHOLDS = {
  PERFECT: 100,
  EXCELLENT: 90,
  GOOD: 70,
  PASSING: 50,
} as const;

// Reaction types (same as original game)
export type ReactionType =
  | "perfect"
  | "base"
  | "disappointed"
  | "laughing-hard"
  | "unsatisfied"
  | "loss-for-words"
  | "drop-shoulders";

// Reaction image mapping
export const REACTION_IMAGES: Record<ReactionType, string> = {
  perfect: "/images/perfect.png",
  base: "/images/poker_clapping.png",
  disappointed: "/images/disappointed.png",
  "laughing-hard": "/images/laughing.png",
  unsatisfied: "/images/unsatisfied.png",
  "loss-for-words": "/images/loss_for_words.png",
  "drop-shoulders": "/images/drop_shoulders.png",
};

// Default image
export const DEFAULT_IMAGE = "/images/base.png";

// Reaction arrays for randomization
export const GOOD_REACTIONS: ReactionType[] = [
  "unsatisfied",
  "disappointed",
  "laughing-hard",
];

export const BAD_REACTIONS: ReactionType[] = [
  "disappointed",
  "loss-for-words",
  "drop-shoulders",
  "laughing-hard",
];

// Helper function to get random reaction
export function getRandomReaction(reactions: ReactionType[]): ReactionType {
  return reactions[Math.floor(Math.random() * reactions.length)];
}

// Comments for different score ranges
export const PERFECT_COMMENTS = [
  "Wait... that was actually perfect.",
  "I have nothing to criticize. Shocking.",
  "Well, well... looks like you CAN hear.",
  "That was... flawless. I'm impressed.",
  "Perfect. I didn't expect that from you.",
];

export const EXCELLENT_COMMENTS = [
  "That was acceptable. Barely.",
  "Hmm, not bad. For once.",
  "I suppose that's good enough.",
  "Well, you got it right. This time.",
  "That'll do, I guess.",
];

export const GOOD_COMMENTS = [
  "Close, but not quite there.",
  "You're missing something important.",
  "That was almost right. Almost.",
  "You need to listen more carefully.",
  "Some parts were good, but...",
];

export const BAD_COMMENTS = [
  "That's not even close.",
  "Did we listen to the same thing?",
  "Oh honey, that was painful.",
  "You really need to fix your ears.",
  "That was... interesting. And not in a good way.",
];

export const FINAL_EXCELLENT_COMMENTS = [
  "Well, I'm genuinely surprised. That was excellent.",
  "I have to admit, you did really well.",
  "Looks like your ears work after all.",
  "That was impressive. I didn't expect that.",
  "You actually have decent listening skills.",
];

export const FINAL_GOOD_COMMENTS = [
  "That was acceptable. I've seen worse.",
  "Not bad. But there's room for improvement.",
  "You passed. Barely.",
  "Well, at least you tried.",
  "That was... okay, I suppose.",
];

export const FINAL_BAD_COMMENTS = [
  "You really need to fix your ears.",
  "That was painful to witness.",
  "Did you even try?",
  "I don't know what to say.",
  "That was... something.",
];
