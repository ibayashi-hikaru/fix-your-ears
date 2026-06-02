import OpenAI from "openai";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputDir = resolve(__dirname, "../public/audio");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// All sentences from DAILY_WORDS - must match constants.ts
const DAILY_WORDS = [
  // Day 1
  [
    { word: "ubiquitous", sentence: "Smartphones have become ubiquitous in modern society." },
    { word: "sycophant", sentence: "The king surrounded himself with sycophants who agreed with everything he said." },
    { word: "ephemeral", sentence: "The beauty of cherry blossoms is ephemeral, lasting only a few days." },
    { word: "cacophony", sentence: "The cacophony of car horns and construction noise gave me a headache." },
    { word: "schadenfreude", sentence: "He felt a twinge of schadenfreude when his rival tripped on stage." },
  ],
  // Day 2
  [
    { word: "obfuscate", sentence: "Politicians often obfuscate the truth to avoid accountability." },
    { word: "magnanimous", sentence: "Despite winning the debate, she was magnanimous toward her opponent." },
    { word: "surreptitious", sentence: "He took a surreptitious glance at the answers on her paper." },
    { word: "onomatopoeia", sentence: "Words like buzz and hiss are examples of onomatopoeia in English." },
    { word: "sangfroid", sentence: "She handled the crisis with remarkable sangfroid and composure." },
  ],
  // Day 3
  [
    { word: "recalcitrant", sentence: "The recalcitrant student refused to follow any of the classroom rules." },
    { word: "ameliorate", sentence: "The new policy was designed to ameliorate the living conditions in the city." },
    { word: "juxtaposition", sentence: "The juxtaposition of the old castle and the modern skyscraper was striking." },
    { word: "phantasmagoria", sentence: "The haunted house was a phantasmagoria of lights and strange noises." },
    { word: "syzygy", sentence: "A solar eclipse occurs during a syzygy of the Sun, Moon, and Earth." },
  ],
  // Day 4
  [
    { word: "perspicacious", sentence: "A perspicacious detective can solve a case with very few clues." },
    { word: "parsimonious", sentence: "The parsimonious millionaire never tipped at restaurants." },
    { word: "conflagration", sentence: "The conflagration destroyed several buildings in the downtown area." },
    { word: "quintessential", sentence: "She is the quintessential example of a dedicated teacher." },
    { word: "insouciant", sentence: "She maintained an insouciant attitude despite the mounting pressure." },
  ],
  // Day 5
  [
    { word: "perfunctory", sentence: "He gave a perfunctory nod before returning to his work." },
    { word: "equivocate", sentence: "When asked directly, the witness tried to equivocate rather than answer." },
    { word: "antediluvian", sentence: "His antediluvian views on technology made him resist using email." },
    { word: "verisimilitude", sentence: "The novel's verisimilitude made readers believe it was based on true events." },
    { word: "mellifluous", sentence: "The singer's mellifluous voice captivated the entire audience." },
  ],
  // Day 6
  [
    { word: "pulchritudinous", sentence: "The pulchritudinous landscape left every visitor in awe." },
    { word: "obstreperous", sentence: "The obstreperous crowd made it impossible for the speaker to continue." },
    { word: "defenestration", sentence: "The defenestration of the manager was a dramatic way to end the meeting." },
    { word: "loquacious", sentence: "My loquacious neighbor can talk for hours without stopping." },
    { word: "tergiversation", sentence: "The politician's tergiversation on the issue frustrated voters." },
  ],
  // Day 7
  [
    { word: "sesquipedalian", sentence: "The professor's sesquipedalian lectures confused most of the students." },
    { word: "supercilious", sentence: "Her supercilious attitude made it hard for anyone to approach her." },
    { word: "anachronistic", sentence: "Using a typewriter in a modern office seems anachronistic." },
    { word: "concatenation", sentence: "The failure was caused by a concatenation of unfortunate events." },
    { word: "propinquity", sentence: "The propinquity of the two offices made collaboration much easier." },
  ],
  // Day 8
  [
    { word: "pusillanimous", sentence: "The pusillanimous leader avoided making any difficult decisions." },
    { word: "circumlocution", sentence: "Instead of a straight answer, he gave a long circumlocution." },
    { word: "idiosyncratic", sentence: "His idiosyncratic style of painting set him apart from other artists." },
    { word: "prestidigitation", sentence: "The magician's prestidigitation amazed even the skeptics in the audience." },
    { word: "serendipity", sentence: "Finding that rare book at a garage sale was pure serendipity." },
  ],
  // Day 9
  [
    { word: "vituperative", sentence: "The vituperative review destroyed the restaurant's reputation overnight." },
    { word: "acquiesce", sentence: "After much debate, she decided to acquiesce to her team's decision." },
    { word: "grandiloquent", sentence: "His grandiloquent speech was full of fancy words but said very little." },
    { word: "tendentious", sentence: "The tendentious article clearly favored one political party over the other." },
    { word: "penultimate", sentence: "We are now on the penultimate chapter of this incredibly long textbook." },
  ],
  // Day 10
  [
    { word: "tintinnabulation", sentence: "The tintinnabulation of the church bells echoed through the quiet valley." },
    { word: "presupposition", sentence: "Her argument was based on the presupposition that everyone agreed." },
    { word: "lugubrious", sentence: "The lugubrious music at the funeral made everyone cry." },
    { word: "ebullient", sentence: "Her ebullient personality made her the life of every party." },
    { word: "truculent", sentence: "The truculent customer shouted at the staff over a minor issue." },
  ],
];

async function main() {
  if (!existsSync(outputDir)) {
    await mkdir(outputDir, { recursive: true });
  }

  let total = 0;
  let generated = 0;

  for (const day of DAILY_WORDS) {
    for (const item of day) {
      total++;
    }
  }

  console.log(`Generating audio for ${total} sentences...`);

  for (const day of DAILY_WORDS) {
    for (const item of day) {
      const filename = `${item.word}.mp3`;
      const filepath = resolve(outputDir, filename);

      if (existsSync(filepath)) {
        console.log(`  [skip] ${filename} (already exists)`);
        generated++;
        continue;
      }

      try {
        const response = await openai.audio.speech.create({
          model: "tts-1",
          voice: "nova",
          input: item.sentence,
          speed: 1.0,
        });

        const buffer = Buffer.from(await response.arrayBuffer());
        await writeFile(filepath, buffer);
        generated++;
        console.log(`  [done] ${filename} (${generated}/${total})`);
      } catch (error) {
        console.error(`  [FAIL] ${filename}: ${error.message}`);
      }

      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 200));
    }
  }

  console.log(`\nDone! Generated ${generated}/${total} audio files.`);
}

main().catch(console.error);
