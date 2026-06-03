import confetti from "canvas-confetti";

// Sound effects using Web Audio API
export function playCorrectSound() {
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  gain.gain.value = 0.3;
  // Two-note chime (C5 → E5)
  osc.frequency.setValueAtTime(523, ctx.currentTime);
  osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
}

export function playIncorrectSound() {
  const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = "sine";
  gain.gain.value = 0.25;
  // Low descending tone (E4 → C4)
  osc.frequency.setValueAtTime(330, ctx.currentTime);
  osc.frequency.setValueAtTime(262, ctx.currentTime + 0.15);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.35);
}

// Trigger confetti animation
export const triggerConfetti = () => {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: ReturnType<typeof setInterval> = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
    });
  }, 250);
};

// Levenshtein distance
export function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Calculate spelling score (0-100) based on Levenshtein distance
export function calculateSpellingScore(userInput: string, correctWord: string): number {
  const normalized = userInput.toLowerCase().trim();
  const target = correctWord.toLowerCase().trim();

  if (normalized === target) return 100;
  if (normalized.length === 0) return 0;

  const distance = levenshteinDistance(normalized, target);
  const maxLen = Math.max(normalized.length, target.length);
  const score = Math.max(0, Math.round((1 - distance / maxLen) * 100));

  return score;
}

// Diff character type
export type DiffChar = {
  char: string;
  status: "correct" | "wrong" | "missing" | "extra";
};

// Generate diff between user input and correct word using LCS
export function generateDiff(userInput: string, correctWord: string): {
  userDiff: DiffChar[];
  correctDiff: DiffChar[];
} {
  const a = userInput.toLowerCase().trim();
  const b = correctWord.toLowerCase().trim();

  // Build LCS table
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to find the diff
  const userDiff: DiffChar[] = [];
  const correctDiff: DiffChar[] = [];
  let i = m;
  let j = n;

  const userResult: DiffChar[] = [];
  const correctResult: DiffChar[] = [];

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
      userResult.push({ char: a[i - 1], status: "correct" });
      correctResult.push({ char: b[j - 1], status: "correct" });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      correctResult.push({ char: b[j - 1], status: "missing" });
      j--;
    } else {
      userResult.push({ char: a[i - 1], status: "extra" });
      i--;
    }
  }

  userDiff.push(...userResult.reverse());
  correctDiff.push(...correctResult.reverse());

  return { userDiff, correctDiff };
}

// Convert 0-100 score to 0-10 with harsh curve
// 100->10, 98->9.6, 95->9.0, 90->8.1, 85->7.2, 80->6.4, 70->4.9, 60->3.6, 50->2.5
export function convertToScore10(score100: number): number {
  if (score100 === 100) return 10;
  if (score100 <= 0) return 0;
  const score10 = Math.pow(score100 / 100, 2) * 10;
  return Math.round(score10 * 10) / 10;
}

// Get score color class (based on 10-point scale)
export function getScoreColorClass(score10: number): string {
  if (score10 === 10) return "score-perfect";
  if (score10 >= 9.5) return "score-excellent";
  if (score10 >= 5) return "score-good";
  return "score-bad";
}

// Create sentence with blank for the target word
export function createSentenceWithBlank(sentence: string, word: string): string {
  // Case-insensitive replacement of the word with blank
  const regex = new RegExp(`\\b${word}\\b`, "i");
  return sentence.replace(regex, "_____");
}
