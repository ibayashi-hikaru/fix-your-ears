// Word item type for the spelling game
export type WordItem = {
  word: string;
  sentence: string;
  meaning: string;
  ja: string;
};

// Daily word sets - 5 words per day, 10 days total
// Days 1-5: balanced variety for broad audience
// Days 6-10: harder/rarer for core players
export const DAILY_WORDS: WordItem[][] = [
  // === Day 1: Accessible, diverse origins ===
  [
    {
      word: "ubiquitous",
      sentence: "Smartphones have become ubiquitous in modern society.",
      meaning: "present, appearing, or found everywhere",
      ja: "どこにでもある、遍在する",
    },
    {
      word: "sycophant",
      sentence: "The king surrounded himself with sycophants who agreed with everything he said.",
      meaning: "a person who flatters someone important to gain advantage",
      ja: "おべっか使い、追従者",
    },
    {
      word: "ephemeral",
      sentence: "The beauty of cherry blossoms is ephemeral, lasting only a few days.",
      meaning: "lasting for a very short time",
      ja: "はかない、つかの間の",
    },
    {
      word: "cacophony",
      sentence: "The cacophony of car horns and construction noise gave me a headache.",
      meaning: "a harsh, discordant mixture of sounds",
      ja: "不協和音、耳障りな音",
    },
    {
      word: "schadenfreude",
      sentence: "He felt a twinge of schadenfreude when his rival tripped on stage.",
      meaning: "pleasure derived from another person's misfortune",
      ja: "他人の不幸を喜ぶ気持ち",
    },
  ],

  // === Day 2: Mix of verbs and borrowed words ===
  [
    {
      word: "obfuscate",
      sentence: "Politicians often obfuscate the truth to avoid accountability.",
      meaning: "to make something unclear or difficult to understand",
      ja: "曖昧にする、分かりにくくする",
    },
    {
      word: "magnanimous",
      sentence: "Despite winning the debate, she was magnanimous toward her opponent.",
      meaning: "generous or forgiving, especially toward a rival",
      ja: "寛大な、度量の大きい",
    },
    {
      word: "surreptitious",
      sentence: "He took a surreptitious glance at the answers on her paper.",
      meaning: "kept secret, especially because it would not be approved of",
      ja: "こっそりした、内密の",
    },
    {
      word: "onomatopoeia",
      sentence: "Words like buzz and hiss are examples of onomatopoeia in English.",
      meaning: "the formation of a word from a sound associated with it",
      ja: "擬声語、擬音語",
    },
    {
      word: "sangfroid",
      sentence: "She handled the crisis with remarkable sangfroid and composure.",
      meaning: "composure or coolness under difficult circumstances",
      ja: "冷静さ、沈着",
    },
  ],

  // === Day 3: Academic and dramatic words ===
  [
    {
      word: "recalcitrant",
      sentence: "The recalcitrant student refused to follow any of the classroom rules.",
      meaning: "having an obstinately uncooperative attitude",
      ja: "反抗的な、言うことを聞かない",
    },
    {
      word: "ameliorate",
      sentence: "The new policy was designed to ameliorate the living conditions in the city.",
      meaning: "to make something bad or unsatisfactory better",
      ja: "改善する、良くする",
    },
    {
      word: "juxtaposition",
      sentence: "The juxtaposition of the old castle and the modern skyscraper was striking.",
      meaning: "the fact of placing two things close together for contrasting effect",
      ja: "並置、対比",
    },
    {
      word: "phantasmagoria",
      sentence: "The haunted house was a phantasmagoria of lights and strange noises.",
      meaning: "a sequence of real or imaginary images like those seen in a dream",
      ja: "幻想的な光景、走馬灯",
    },
    {
      word: "syzygy",
      sentence: "A solar eclipse occurs during a syzygy of the Sun, Moon, and Earth.",
      meaning: "a conjunction or opposition of celestial bodies",
      ja: "朔望（天体の直列配置）",
    },
  ],

  // === Day 4: Intelligence and personality words ===
  [
    {
      word: "perspicacious",
      sentence: "A perspicacious detective can solve a case with very few clues.",
      meaning: "having a ready insight into and understanding of things",
      ja: "洞察力のある、明敏な",
    },
    {
      word: "parsimonious",
      sentence: "The parsimonious millionaire never tipped at restaurants.",
      meaning: "extremely unwilling to spend money; miserly",
      ja: "けちな、吝嗇な",
    },
    {
      word: "conflagration",
      sentence: "The conflagration destroyed several buildings in the downtown area.",
      meaning: "an extensive fire which destroys a great deal",
      ja: "大火災、大火",
    },
    {
      word: "quintessential",
      sentence: "She is the quintessential example of a dedicated teacher.",
      meaning: "representing the most perfect or typical example of something",
      ja: "典型的な、真髄の",
    },
    {
      word: "insouciant",
      sentence: "She maintained an insouciant attitude despite the mounting pressure.",
      meaning: "showing a casual lack of concern; indifferent",
      ja: "無頓着な、平気な",
    },
  ],

  // === Day 5: Literary and musical words ===
  [
    {
      word: "perfunctory",
      sentence: "He gave a perfunctory nod before returning to his work.",
      meaning: "carried out without real interest or care",
      ja: "おざなりの、形式的な",
    },
    {
      word: "equivocate",
      sentence: "When asked directly, the witness tried to equivocate rather than answer.",
      meaning: "to use ambiguous language so as to conceal the truth",
      ja: "あいまいなことを言う、言葉を濁す",
    },
    {
      word: "antediluvian",
      sentence: "His antediluvian views on technology made him resist using email.",
      meaning: "ridiculously old-fashioned",
      ja: "非常に古い、時代遅れの",
    },
    {
      word: "verisimilitude",
      sentence: "The novel's verisimilitude made readers believe it was based on true events.",
      meaning: "the appearance of being true or real",
      ja: "真実らしさ、迫真性",
    },
    {
      word: "mellifluous",
      sentence: "The singer's mellifluous voice captivated the entire audience.",
      meaning: "sweet or musical; pleasant to hear",
      ja: "甘美な、聞き心地の良い",
    },
  ],

  // === Day 6: Extreme words for core players ===
  [
    {
      word: "pulchritudinous",
      sentence: "The pulchritudinous landscape left every visitor in awe.",
      meaning: "beautiful (used humorously or formally)",
      ja: "美しい（堅い表現）",
    },
    {
      word: "obstreperous",
      sentence: "The obstreperous crowd made it impossible for the speaker to continue.",
      meaning: "noisy and difficult to control",
      ja: "騒々しい、手に負えない",
    },
    {
      word: "defenestration",
      sentence: "The defenestration of the manager was a dramatic way to end the meeting.",
      meaning: "the act of throwing someone out of a window; dismissal",
      ja: "窓からの投げ出し、追放",
    },
    {
      word: "loquacious",
      sentence: "My loquacious neighbor can talk for hours without stopping.",
      meaning: "tending to talk a great deal; talkative",
      ja: "おしゃべりな、多弁な",
    },
    {
      word: "tergiversation",
      sentence: "The politician's tergiversation on the issue frustrated voters.",
      meaning: "evasion of straightforward action or clear-cut statement",
      ja: "変節、言い逃れ",
    },
  ],

  // === Day 7: Meta and abstract words ===
  [
    {
      word: "sesquipedalian",
      sentence: "The professor's sesquipedalian lectures confused most of the students.",
      meaning: "characterized by long words; long-winded",
      ja: "長い言葉を使う、大げさな",
    },
    {
      word: "supercilious",
      sentence: "Her supercilious attitude made it hard for anyone to approach her.",
      meaning: "behaving as though one thinks one is superior to others",
      ja: "横柄な、傲慢な",
    },
    {
      word: "anachronistic",
      sentence: "Using a typewriter in a modern office seems anachronistic.",
      meaning: "belonging to a period other than that being portrayed",
      ja: "時代錯誤の",
    },
    {
      word: "concatenation",
      sentence: "The failure was caused by a concatenation of unfortunate events.",
      meaning: "a series of interconnected things or events",
      ja: "連結、連鎖",
    },
    {
      word: "propinquity",
      sentence: "The propinquity of the two offices made collaboration much easier.",
      meaning: "the state of being close to someone or something; proximity",
      ja: "近接、近さ",
    },
  ],

  // === Day 8: Personality and magic ===
  [
    {
      word: "pusillanimous",
      sentence: "The pusillanimous leader avoided making any difficult decisions.",
      meaning: "showing a lack of courage or determination; timid",
      ja: "臆病な、小心な",
    },
    {
      word: "circumlocution",
      sentence: "Instead of a straight answer, he gave a long circumlocution.",
      meaning: "the use of many words where fewer would do; evasive speech",
      ja: "遠回しな表現、婉曲表現",
    },
    {
      word: "idiosyncratic",
      sentence: "His idiosyncratic style of painting set him apart from other artists.",
      meaning: "relating to individual peculiarity or eccentricity",
      ja: "独特の、風変わりな",
    },
    {
      word: "prestidigitation",
      sentence: "The magician's prestidigitation amazed even the skeptics in the audience.",
      meaning: "magic tricks performed as entertainment; sleight of hand",
      ja: "手品、手先の早業",
    },
    {
      word: "serendipity",
      sentence: "Finding that rare book at a garage sale was pure serendipity.",
      meaning: "the occurrence of events by chance in a happy way",
      ja: "偶然の幸運、セレンディピティ",
    },
  ],

  // === Day 9: Speech and bias words ===
  [
    {
      word: "vituperative",
      sentence: "The vituperative review destroyed the restaurant's reputation overnight.",
      meaning: "bitter and abusive",
      ja: "罵倒的な、口汚い",
    },
    {
      word: "acquiesce",
      sentence: "After much debate, she decided to acquiesce to her team's decision.",
      meaning: "to accept something reluctantly but without protest",
      ja: "黙認する、しぶしぶ同意する",
    },
    {
      word: "grandiloquent",
      sentence: "His grandiloquent speech was full of fancy words but said very little.",
      meaning: "pompous or extravagant in language, style, or manner",
      ja: "大げさな、仰々しい",
    },
    {
      word: "tendentious",
      sentence: "The tendentious article clearly favored one political party over the other.",
      meaning: "expressing or intending to promote a particular cause or point of view",
      ja: "偏った、傾向的な",
    },
    {
      word: "penultimate",
      sentence: "We are now on the penultimate chapter of this incredibly long textbook.",
      meaning: "last but one in a series; second to last",
      ja: "最後から2番目の",
    },
  ],

  // === Day 10: Rare and exotic words ===
  [
    {
      word: "tintinnabulation",
      sentence: "The tintinnabulation of the church bells echoed through the quiet valley.",
      meaning: "a ringing or tinkling sound",
      ja: "鈴の音、チリンチリンという音",
    },
    {
      word: "presupposition",
      sentence: "Her argument was based on the presupposition that everyone agreed.",
      meaning: "a thing tacitly assumed beforehand",
      ja: "前提、先入観",
    },
    {
      word: "lugubrious",
      sentence: "The lugubrious music at the funeral made everyone cry.",
      meaning: "looking or sounding sad and dismal",
      ja: "陰気な、悲しげな",
    },
    {
      word: "ebullient",
      sentence: "Her ebullient personality made her the life of every party.",
      meaning: "cheerful and full of energy; enthusiastic",
      ja: "元気いっぱいの、熱狂的な",
    },
    {
      word: "truculent",
      sentence: "The truculent customer shouted at the staff over a minor issue.",
      meaning: "eager or quick to argue or fight; aggressively defiant",
      ja: "好戦的な、攻撃的な",
    },
  ],
];

export const TOTAL_WORDS_PER_GAME = 5;

// Get today's word set based on the current date
// Loops after all days are used
export function getTodaysWords(): WordItem[] {
  const now = new Date();
  // Use UTC date to avoid timezone issues
  const startDate = new Date("2026-06-01");
  const diffTime = now.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const dayIndex = ((diffDays % DAILY_WORDS.length) + DAILY_WORDS.length) % DAILY_WORDS.length;
  return DAILY_WORDS[dayIndex];
}

// Score thresholds for spelling accuracy
export const SCORE_THRESHOLDS = {
  PERFECT: 100,
  EXCELLENT: 85,
  GOOD: 60,
  PASSING: 40,
} as const;

// Reaction types
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

// Comments for different score ranges (used as fallbacks)
export const PERFECT_COMMENTS = [
  "Wait... you spelled that perfectly?",
  "I have nothing to criticize. Shocking.",
  "Well, well... someone's been studying.",
  "That was... flawless. I'm speechless.",
  "Perfect spelling. I didn't expect that.",
];

export const EXCELLENT_COMMENTS = [
  "Almost perfect. Almost.",
  "Hmm, so close. Not bad.",
  "I suppose that's acceptable.",
  "Well, you nearly got it right.",
  "That'll do, I guess.",
];

export const GOOD_COMMENTS = [
  "Close, but your spelling needs work.",
  "You heard it but couldn't spell it.",
  "That was almost right. Almost.",
  "You need to read more books.",
  "Some letters were right, at least.",
];

export const BAD_COMMENTS = [
  "That's not even close to the right spelling.",
  "Did you just mash the keyboard?",
  "Oh honey, that spelling was painful.",
  "You really need to fix your ears AND your spelling.",
  "That was... creative. And wrong.",
];

export const FINAL_EXCELLENT_COMMENTS = [
  "Well, I'm genuinely surprised. Excellent spelling.",
  "I have to admit, you did really well.",
  "Looks like your ears AND your spelling work.",
  "That was impressive. I didn't expect that.",
  "You actually know how to spell. Shocking.",
];

export const FINAL_GOOD_COMMENTS = [
  "That was acceptable. I've seen worse.",
  "Not bad. But your spelling needs more work.",
  "You passed. Barely.",
  "Well, at least you tried.",
  "That was... okay, I suppose.",
];

export const FINAL_BAD_COMMENTS = [
  "You really need to fix your ears.",
  "That was painful to witness.",
  "Did you even try to spell these words?",
  "I don't know what to say about your spelling.",
  "Maybe start with easier words next time.",
];
