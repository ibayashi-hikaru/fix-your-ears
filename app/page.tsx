"use client";

import { useState, useRef } from "react";
import { Volume2, Trophy, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import { Logo } from "./components/Logo";
import { Character } from "./components/Character";
import { SpeechBubble } from "./components/SpeechBubble";
import { Button } from "./components/Button";
import { Input } from "./components/Input";
import { GamePanel } from "./components/GamePanel";
import {
  SENTENCES,
  TOTAL_SENTENCES_PER_GAME,
  SCORE_THRESHOLDS,
  PERFECT_COMMENTS,
  EXCELLENT_COMMENTS,
  GOOD_COMMENTS,
  BAD_COMMENTS,
  FINAL_EXCELLENT_COMMENTS,
  FINAL_GOOD_COMMENTS,
  FINAL_BAD_COMMENTS,
  getRandomReaction,
  GOOD_REACTIONS,
  BAD_REACTIONS,
  type ReactionType,
  type SentenceItem,
} from "./constants";
import { triggerConfetti, isExactMatch, calculateAccuracy } from "./utils";

type GameState = "start" | "playing" | "finished";
type Mood = "base" | "perfect" | "disappointed" | "laughing" | "unsatisfied" | "loss-for-words" | "drop-shoulders";

const MOOD_MAP: Record<ReactionType, Mood> = {
  perfect: "perfect",
  base: "base",
  disappointed: "disappointed",
  "laughing-hard": "laughing",
  unsatisfied: "unsatisfied",
  "loss-for-words": "loss-for-words",
  "drop-shoulders": "drop-shoulders",
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [allScores, setAllScores] = useState<number[]>([]);
  const [reaction, setReaction] = useState<string>("I heard your listening skills are terrible. Prove me wrong.");
  const [reactionType, setReactionType] = useState<ReactionType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [playsRemaining, setPlaysRemaining] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [finalComment, setFinalComment] = useState<string | null>(null);
  const [finalReactionType, setFinalReactionType] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sentencesRef = useRef<SentenceItem[]>([]);

  // Initialize sentences on first render
  if (sentencesRef.current.length === 0) {
    const shuffled = [...SENTENCES].sort(() => Math.random() - 0.5);
    sentencesRef.current = shuffled.slice(0, TOTAL_SENTENCES_PER_GAME);
  }

  const currentSentence = sentencesRef.current[currentSentenceIndex];

  const handleStart = () => {
    setGameState("playing");
    setReaction("Listen carefully and type what you hear.");
  };

  const playAudio = async () => {
    if (playsRemaining <= 0 || isPlaying) return;

    setIsPlaying(true);
    setPlaysRemaining((prev) => prev - 1);

    try {
      const response = await fetch("/api/synthesize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: currentSentence.text,
          rate: playbackRate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to synthesize speech");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.playbackRate = playbackRate;
        await audioRef.current.play();

        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
      setReaction("Hmm, something went wrong. Try again.");
    }
  };

  const handleSubmit = () => {
    const correct = isExactMatch(userInput, currentSentence.text);
    const accuracy = calculateAccuracy(userInput, currentSentence.text);

    setIsCorrect(correct);
    setAllScores((prev) => [...prev, accuracy]);

    if (correct) {
      setScore((prev) => prev + 1);
    }

    // Generate reaction based on accuracy
    let comment = "";
    let type: ReactionType | null = null;

    if (accuracy === SCORE_THRESHOLDS.PERFECT) {
      comment = PERFECT_COMMENTS[Math.floor(Math.random() * PERFECT_COMMENTS.length)];
      type = "perfect";
      triggerConfetti();
    } else if (accuracy >= SCORE_THRESHOLDS.EXCELLENT) {
      comment = EXCELLENT_COMMENTS[Math.floor(Math.random() * EXCELLENT_COMMENTS.length)];
      type = "base";
    } else if (accuracy >= SCORE_THRESHOLDS.GOOD) {
      comment = GOOD_COMMENTS[Math.floor(Math.random() * GOOD_COMMENTS.length)];
      type = getRandomReaction(GOOD_REACTIONS);
    } else {
      comment = BAD_COMMENTS[Math.floor(Math.random() * BAD_COMMENTS.length)];
      type = getRandomReaction(BAD_REACTIONS);
    }

    setReaction(comment);
    setReactionType(type);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentSentenceIndex < TOTAL_SENTENCES_PER_GAME - 1) {
      setCurrentSentenceIndex((prev) => prev + 1);
      setUserInput("");
      setShowResult(false);
      setPlaysRemaining(2);
      setReaction("Listen carefully and type what you hear.");
      setReactionType(null);
    } else {
      // Game finished
      const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;

      let comment = "";
      let type: ReactionType | null = null;

      if (avgScore >= SCORE_THRESHOLDS.EXCELLENT) {
        comment = FINAL_EXCELLENT_COMMENTS[Math.floor(Math.random() * FINAL_EXCELLENT_COMMENTS.length)];
        type = "perfect";
        setShowConfetti(true);
        triggerConfetti();
      } else if (avgScore >= SCORE_THRESHOLDS.GOOD) {
        comment = FINAL_GOOD_COMMENTS[Math.floor(Math.random() * FINAL_GOOD_COMMENTS.length)];
        type = "base";
      } else {
        comment = FINAL_BAD_COMMENTS[Math.floor(Math.random() * FINAL_BAD_COMMENTS.length)];
        type = getRandomReaction(BAD_REACTIONS);
      }

      setFinalComment(comment);
      setFinalReactionType(type);
      setGameState("finished");
    }
  };

  const handleRestart = () => {
    const shuffled = [...SENTENCES].sort(() => Math.random() - 0.5);
    sentencesRef.current = shuffled.slice(0, TOTAL_SENTENCES_PER_GAME);
    setCurrentSentenceIndex(0);
    setUserInput("");
    setScore(0);
    setAllScores([]);
    setGameState("start");
    setReaction("I heard your listening skills are terrible. Prove me wrong.");
    setReactionType(null);
    setShowResult(false);
    setPlaysRemaining(2);
    setPlaybackRate(1.0);
    setFinalComment(null);
    setFinalReactionType(null);
    setShowConfetti(false);
  };

  const getCurrentMood = (): Mood => {
    if (!reactionType) return "base";
    return MOOD_MAP[reactionType] || "base";
  };

  const getFinalMood = (): Mood => {
    if (!finalReactionType) return "base";
    return MOOD_MAP[finalReactionType as ReactionType] || "base";
  };

  // Start Screen
  if (gameState === "start") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
        <div className="max-w-6xl w-full">
          {/* Logo */}
          <div className="flex justify-center mb-6 md:mb-12">
            <Logo size="large" />
          </div>

          {/* Character - Mobile (Top) */}
          <div className="md:hidden mb-6 flex flex-col items-center gap-3">
            <SpeechBubble message={reaction} className="max-w-xs" />
            <div className="w-32">
              <Character mood="base" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Start Button */}
            <div className="flex justify-center md:justify-start">
              <Button
                onClick={handleStart}
                variant="success"
                size="large"
                className="w-full max-w-md"
              >
                Start Game
              </Button>
            </div>

            {/* Character - Desktop (Right) */}
            <div className="hidden md:flex flex-col items-center gap-6">
              <SpeechBubble message={reaction} />
              <Character mood="base" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (gameState === "finished") {
    const avgScore = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    const perfectCount = allScores.filter((s) => s === 100).length;

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden">
        {/* Confetti Effect */}
        {showConfetti && typeof window !== 'undefined' && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -20,
                  rotate: 0
                }}
                animate={{
                  y: window.innerHeight + 20,
                  rotate: 360,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  backgroundColor: ['#4DC7FF', '#4ADE80', '#FF4A4A', '#FFE8CC'][Math.floor(Math.random() * 4)]
                }}
              />
            ))}
          </div>
        )}

        <div className="max-w-7xl w-full relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-4 md:mb-8">
            <Logo size="small" />
          </div>

          {/* Character & Feedback - Mobile (Top) */}
          <div className="md:hidden mb-4 flex flex-col items-center gap-2">
            {finalComment && <SpeechBubble message={finalComment} className="max-w-xs" />}
            <div className="w-32">
              <Character mood={getFinalMood()} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Results Panel */}
            <div>
              <GamePanel>
                <div className="space-y-4 md:space-y-6">
                  {/* Title */}
                  <div className="flex items-center gap-3 pb-4 border-b-2 border-gray-200">
                    <Trophy className="w-6 h-6 md:w-8 md:h-8 text-[var(--blue-dark)]" />
                    <h2 className="text-xl md:text-2xl font-bold text-[var(--dark-gray)]">Results</h2>
                  </div>

                  {/* Perfect Count */}
                  <div className="bg-gradient-to-br from-[var(--green-light)] to-[var(--green-dark)] text-white p-4 md:p-6 rounded-2xl border-[3px] border-[var(--dark-gray)] shadow-[4px_4px_0_0_var(--dark-gray)]">
                    <div className="text-sm font-medium opacity-90">Perfect Scores</div>
                    <div className="text-4xl md:text-5xl font-bold mt-2">
                      {perfectCount}/{TOTAL_SENTENCES_PER_GAME}
                    </div>
                  </div>

                  {/* Average Score */}
                  <div className={`p-4 md:p-6 rounded-2xl border-[3px] border-[var(--dark-gray)] shadow-[4px_4px_0_0_var(--dark-gray)] ${
                    avgScore >= 85 ? 'bg-gradient-to-br from-[var(--blue-light)] to-[var(--blue-dark)] text-white' :
                    avgScore >= 70 ? 'bg-white text-[var(--dark-gray)]' :
                    'bg-gradient-to-br from-[var(--red-light)] to-[var(--red-dark)] text-white'
                  }`}>
                    <div className="text-sm font-medium opacity-90">Average Score</div>
                    <div className="text-4xl md:text-5xl font-bold mt-2">
                      {avgScore.toFixed(1)}%
                    </div>
                  </div>

                  {/* Play Again Button */}
                  <Button
                    onClick={handleRestart}
                    variant="success"
                    size="large"
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-5 h-5" />
                    Play Again
                  </Button>
                </div>
              </GamePanel>
            </div>

            {/* Character & Feedback - Desktop (Right) */}
            <div className="hidden md:flex flex-col items-center gap-6">
              {finalComment && <SpeechBubble message={finalComment} />}
              <Character mood={getFinalMood()} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6">
      <audio ref={audioRef} />
      <div className="max-w-7xl w-full">
        {/* Logo */}
        <div className="flex justify-center mb-4 md:mb-8">
          <Logo size="small" />
        </div>

        {/* Character & Feedback - Mobile (Top) */}
        <div className="md:hidden mb-4 flex flex-col items-center gap-2">
          <SpeechBubble message={reaction} className="max-w-xs" />
          <div className="w-32">
            <Character mood={getCurrentMood()} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Game Controls Panel */}
          <div>
            <GamePanel>
              <div className="space-y-4 md:space-y-6">
                {/* Round Info */}
                <div className="flex justify-center items-center pb-4 border-b-2 border-gray-200">
                  <div className="text-center">
                    <div className="text-xl md:text-2xl font-bold text-[var(--dark-gray)]">
                      <span className="text-gray-500">Round </span>
                      {currentSentenceIndex + 1} of {TOTAL_SENTENCES_PER_GAME}
                    </div>
                    <div className="text-base md:text-lg font-semibold text-[var(--dark-gray)] mt-1">
                      {currentSentence.difficulty.charAt(0).toUpperCase() + currentSentence.difficulty.slice(1)}
                    </div>
                  </div>
                </div>

                {/* Play Audio Button */}
                <Button
                  onClick={playAudio}
                  variant="primary"
                  size="large"
                  disabled={playsRemaining === 0 || isPlaying || showResult}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
                  {isPlaying ? "Playing..." : `Play Audio (${playsRemaining} left)`}
                </Button>

                {/* Input Field */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-[var(--dark-gray)]">Type what you hear:</label>
                  <Input
                    value={userInput}
                    onChange={setUserInput}
                    placeholder="Type your answer here..."
                    disabled={showResult}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !showResult && userInput.trim()) {
                        handleSubmit();
                      }
                    }}
                  />
                </div>

                {/* Submit/Next Button */}
                {!showResult ? (
                  <Button
                    onClick={handleSubmit}
                    variant="success"
                    size="large"
                    disabled={!userInput.trim()}
                    className="w-full"
                  >
                    Submit
                  </Button>
                ) : (
                  <div className="space-y-4">
                    {/* Score Display */}
                    <div className={`p-4 rounded-2xl border-[3px] border-[var(--dark-gray)] text-center ${
                      isCorrect ? 'bg-gradient-to-br from-[var(--green-light)] to-[var(--green-dark)]' :
                      'bg-gradient-to-br from-[var(--red-light)] to-[var(--red-dark)]'
                    } text-white`}>
                      <div className="text-2xl md:text-4xl font-bold">
                        {isCorrect ? "Perfect!" : "Not quite..."}
                      </div>
                    </div>

                    {/* Correct Answer */}
                    <div className="p-4 bg-gray-100 rounded-2xl border-[3px] border-[var(--dark-gray)]">
                      <div className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</div>
                      <div className="font-semibold text-sm md:text-base text-[var(--dark-gray)]">{currentSentence?.text}</div>
                    </div>

                    {/* Next Button */}
                    <Button
                      onClick={handleNext}
                      variant="primary"
                      size="large"
                      className="w-full"
                    >
                      {currentSentenceIndex < TOTAL_SENTENCES_PER_GAME - 1 ? 'Next Round' : 'See Results'}
                    </Button>
                  </div>
                )}
              </div>
            </GamePanel>
          </div>

          {/* Character & Feedback - Desktop (Right) */}
          <div className="hidden md:flex flex-col items-center gap-6">
            <SpeechBubble message={reaction} />
            <Character mood={getCurrentMood()} />
          </div>
        </div>
      </div>
    </div>
  );
}
