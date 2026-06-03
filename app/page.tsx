"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  getTodaysWords,
  TOTAL_WORDS_PER_GAME,
  SCORE_THRESHOLDS,
  REACTION_IMAGES,
  DEFAULT_IMAGE,
  GOOD_REACTIONS,
  BAD_REACTIONS,
  PERFECT_COMMENTS,
  EXCELLENT_COMMENTS,
  GOOD_COMMENTS,
  BAD_COMMENTS,
  FINAL_EXCELLENT_COMMENTS,
  FINAL_GOOD_COMMENTS,
  FINAL_BAD_COMMENTS,
  getRandomReaction,
  type ReactionType,
} from "./constants";
import {
  triggerConfetti,
  calculateSpellingScore,
  generateDiff,
  getScoreColorClass,
  createSentenceWithBlank,
} from "./utils";

type GameState = "start" | "playing" | "finished";

type RoundResult = {
  word: string;
  userAnswer: string;
  accuracy: number;
  meaning: string;
  ja: string;
};

const OPENING_LINE = "I heard your listening skills are impressive. Let's see about that.";

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("start");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [userInput, setUserInput] = useState("");
  const [perfectCount, setPerfectCount] = useState(0);
  const [allScores, setAllScores] = useState<number[]>([]);
  const [roundResults, setRoundResults] = useState<RoundResult[]>([]);
  const [currentAccuracy, setCurrentAccuracy] = useState<number | null>(null);

  const [reaction, setReaction] = useState<string>(OPENING_LINE);
  const [reactionType, setReactionType] = useState<ReactionType | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [playsRemaining, setPlaysRemaining] = useState(2);
  const [isPlaying, setIsPlaying] = useState(false);

  const [finalComment, setFinalComment] = useState<string | null>(null);
  const [finalReactionType, setFinalReactionType] = useState<ReactionType | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const todaysWords = getTodaysWords();
  const currentWord = todaysWords[currentWordIndex];
  const averageScore = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;

  const stopAudioPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
    }
    setIsPlaying(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.onended = null;
        audioRef.current.onerror = null;
      }
    };
  }, []);

  const handleStart = () => {
    setGameState("playing");
    setReaction("Listen carefully, then spell the missing word.");
  };

  const playAudio = () => {
    if (!currentWord || playsRemaining <= 0 || isPlaying) return;

    setIsPlaying(true);

    try {
      if (audioRef.current) {
        audioRef.current.src = `/audio/${currentWord.word}.mp3`;
        audioRef.current.play();
        setPlaysRemaining((prev) => Math.max(prev - 1, 0));

        audioRef.current.onended = () => {
          setIsPlaying(false);
        };

        audioRef.current.onerror = () => {
          setIsPlaying(false);
          setReaction("Hmm, something went wrong with the audio. Try again.");
        };
      }
    } catch (error) {
      console.error("Error playing audio:", error);
      setIsPlaying(false);
    }
  };

  const handleSubmit = async () => {
    if (showResult || !currentWord || !userInput.trim() || isProcessing) return;

    stopAudioPlayback();
    setIsProcessing(true);

    const accuracy = calculateSpellingScore(userInput, currentWord.word);
    const isPerfect = accuracy === 100;

    setAllScores((prev) => [...prev, accuracy]);
    setRoundResults((prev) => [
      ...prev,
      {
        word: currentWord.word,
        userAnswer: userInput.trim(),
        accuracy,
        meaning: currentWord.meaning,
        ja: currentWord.ja,
      },
    ]);
    setCurrentAccuracy(accuracy);

    if (isPerfect) {
      setPerfectCount((prev) => prev + 1);
      triggerConfetti();
    }

    // Generate reaction - try API first, fallback to templates
    let comment = "";
    let type: ReactionType;

    try {
      const reactionResponse = await fetch("/api/generate-reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetWord: currentWord.word,
          userAnswer: userInput.trim(),
          accuracy,
          meaning: currentWord.meaning,
        }),
      });

      if (reactionResponse.ok) {
        const data = await reactionResponse.json();
        comment = data.message;
        type = data.reactionType as ReactionType;
      } else {
        throw new Error("API failed");
      }
    } catch {
      // Fallback to template comments
      if (isPerfect) {
        comment = PERFECT_COMMENTS[Math.floor(Math.random() * PERFECT_COMMENTS.length)];
        type = "perfect";
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
    }

    setReaction(comment);
    setReactionType(type);
    setShowResult(true);
    setIsProcessing(false);
  };

  const handleNext = () => {
    stopAudioPlayback();

    if (currentWordIndex < TOTAL_WORDS_PER_GAME - 1) {
      setCurrentWordIndex((prev) => prev + 1);
      setUserInput("");
      setShowResult(false);
      setPlaysRemaining(2);
      setCurrentAccuracy(null);
      setReaction("Listen carefully, then spell the missing word.");
      setReactionType(null);
    } else {
      // Game finished
      const finalAvg = [...allScores].reduce((a, b) => a + b, 0) / allScores.length;
      let comment = "";
      let type: ReactionType;

      if (finalAvg >= SCORE_THRESHOLDS.EXCELLENT) {
        comment = FINAL_EXCELLENT_COMMENTS[Math.floor(Math.random() * FINAL_EXCELLENT_COMMENTS.length)];
        type = "perfect";
        triggerConfetti();
      } else if (finalAvg >= SCORE_THRESHOLDS.GOOD) {
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
    stopAudioPlayback();
    setCurrentWordIndex(0);
    setUserInput("");
    setPerfectCount(0);
    setAllScores([]);
    setRoundResults([]);
    setCurrentAccuracy(null);
    setGameState("start");
    setReaction(OPENING_LINE);
    setReactionType(null);
    setShowResult(false);
    setPlaysRemaining(2);
    setFinalComment(null);
    setFinalReactionType(null);
    setIsProcessing(false);
  };

  const getCharacterImage = (type: ReactionType | null): string => {
    if (!type) return DEFAULT_IMAGE;
    return REACTION_IMAGES[type] || DEFAULT_IMAGE;
  };

  const isThoughtBubble = (type: ReactionType | null): boolean => {
    return type === "perfect";
  };

  // ========== RENDER ==========

  // Start Screen
  if (gameState === "start") {
    return (
      <div className="game-container">
        <div className="game-content-wrapper">
          {/* Logo */}
          <div className="game-logo animate-pop-in">
            <Image
              src="/images/logo.png"
              alt="Fix Your Ears"
              width={800}
              height={240}
              priority
              className="h-32 md:h-48 object-contain"
            />
          </div>

          {/* Game Grid */}
          <div className="game-grid">
            {/* Left: Start Button */}
            <div className="game-left-column">
              <div className="game-action-area">
                <button
                  onClick={handleStart}
                  className="btn-glossy btn-green text-lg md:text-xl px-8 md:px-12 py-4 md:py-5 animate-pop-in"
                >
                  Start Game
                </button>
              </div>
            </div>

            {/* Right: Character */}
            <div className="game-character-container">
              <div className="game-speech-bubble-wrapper animate-speech-bubble" style={{ width: '50vw', maxWidth: '260px', left: '50%', transform: 'translateX(-50%) translateY(-100%)' }}>
                <div className="game-speech-bubble" style={{ background: '#FFFFFF', boxShadow: '0px 4px 0px #5E5E5E', border: '3px solid #5E5E5E' }}>
                  <p className="text-sm md:text-2xl font-bold text-center" style={{ color: '#5E5E5E' }}>
                    {reaction}
                  </p>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1">
                    <div className="w-0 h-0 border-l-8 md:border-l-12 border-r-8 md:border-r-12 border-t-8 md:border-t-12 border-l-transparent border-r-transparent" style={{ borderTopColor: '#FFFFFF' }}></div>
                  </div>
                </div>
              </div>
              <Image
                src={DEFAULT_IMAGE}
                alt="Character"
                width={320}
                height={320}
                className="game-character-image animate-character"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Finished Screen
  if (gameState === "finished") {
    return (
      <div className="game-container">
        <div className="game-content-wrapper">
          {/* Logo */}
          <div className="game-logo animate-pop-in">
            <Image
              src="/images/logo.png"
              alt="Fix Your Ears"
              width={800}
              height={240}
              className="h-20 md:h-32 object-contain"
            />
          </div>

          {/* Game Grid */}
          <div className="game-grid">
            {/* Left: Results */}
            <div className="game-left-column" style={{ gap: "1rem" }}>
              {/* Score Summary */}
              <div className="result-card w-full animate-pop-in">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b-2 border-gray-200">
                  <span className="text-xl md:text-2xl">🏆</span>
                  <h2 className="text-lg md:text-xl font-bold text-[#5E5E5E]">Results</h2>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-[#f0fdf4] border-2 border-[#5E5E5E] text-center">
                    <div className="text-xs text-gray-500">Perfect</div>
                    <div className="text-2xl md:text-3xl font-bold text-[#16a34a]">
                      {perfectCount}/{TOTAL_WORDS_PER_GAME}
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#f0f9ff] border-2 border-[#5E5E5E] text-center">
                    <div className="text-xs text-gray-500">Average</div>
                    <div className={`text-2xl md:text-3xl font-bold ${getScoreColorClass(averageScore)}`}>
                      {averageScore.toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Round Breakdown */}
                <div className="space-y-2">
                  {roundResults.map((round, index) => (
                    <div
                      key={`result-${index}`}
                      className="p-3 bg-gray-50 rounded-xl border-2 border-gray-200 animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-[#5E5E5E]">
                          Round {index + 1}
                        </span>
                        <span className={`font-bold text-sm ${getScoreColorClass(round.accuracy)}`}>
                          {round.accuracy}%
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <span className="font-semibold text-[#5E5E5E]">{round.word}</span>
                        {" — "}
                        {round.userAnswer ? (
                          round.accuracy === 100 ? (
                            <span className="text-[#16a34a]">✓ {round.userAnswer}</span>
                          ) : (
                            <span className="text-[#FF4A4A]">{round.userAnswer}</span>
                          )
                        ) : (
                          <span className="text-gray-400">(blank)</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full animate-slide-up delay-500">
                <button
                  onClick={handleRestart}
                  className="btn-glossy btn-green flex-1 text-sm md:text-base"
                >
                  Play Again
                </button>
              </div>
            </div>

            {/* Right: Character */}
            <div className="game-character-container">
              {finalComment && (
                <div className="game-speech-bubble-wrapper animate-speech-bubble">
                  <div
                    className={`game-speech-bubble ${isThoughtBubble(finalReactionType) ? "thought-bubble" : ""}`}
                    style={{ background: '#FFFFFF', boxShadow: '0px 4px 0px #5E5E5E', border: '3px solid #5E5E5E' }}
                  >
                    <p className="text-sm md:text-2xl font-bold text-center" style={{ color: '#5E5E5E' }}>
                      {finalComment}
                    </p>
                    {isThoughtBubble(finalReactionType) ? (
                      <div className="game-speech-bubble-tail-outer" />
                    ) : (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1">
                        <div className="w-0 h-0 border-l-8 md:border-l-12 border-r-8 md:border-r-12 border-t-8 md:border-t-12 border-l-transparent border-r-transparent" style={{ borderTopColor: '#FFFFFF' }}></div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <Image
                src={getCharacterImage(finalReactionType)}
                alt="Character"
                width={320}
                height={320}
                className="game-character-image animate-character"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Playing Screen
  const sentenceWithBlank = currentWord ? createSentenceWithBlank(currentWord.sentence, currentWord.word) : "";

  return (
    <div className="game-container">
      <audio ref={audioRef} />
      <div className="flex flex-col items-center min-h-screen px-4 py-3">
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="Fix Your Ears"
          width={800}
          height={240}
          className="h-32 object-contain mb-2"
        />

        {/* Round Info */}
        <div className="text-sm font-bold text-[#5E5E5E] mb-2 animate-fade-in">
          <span className="text-gray-400">Round </span>
          {currentWordIndex + 1} of {TOTAL_WORDS_PER_GAME}
        </div>

        {/* Character + Speech Bubble row */}
        <div key={`bubble-${reaction}`} className="flex items-center gap-1 w-full max-w-md mb-3 animate-pop-in">
          {/* Speech/Thought Bubble */}
          <div className="flex-1 min-w-0 relative">
            <div
              className={`px-3 py-2 ${isThoughtBubble(reactionType) ? "rounded-[50px]" : "rounded-lg"}`}
              style={{ background: '#FFFFFF', boxShadow: '0px 3px 0px #5E5E5E', border: '2px solid #5E5E5E' }}
            >
              <p className="text-xs font-semibold text-[#5E5E5E]">
                {reaction}
              </p>
            </div>
            {/* Tail or thought dots - absolutely positioned on right edge */}
            {isThoughtBubble(reactionType) ? (
              <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#5E5E5E]" />
                <div className="w-1.5 h-1.5 rounded-full bg-white border-[1.5px] border-[#5E5E5E]" />
              </div>
            ) : (
              <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white" style={{ filter: 'drop-shadow(3px 0 0 #5E5E5E)' }} />
            )}
          </div>
          {/* Character */}
          <Image
            src={getCharacterImage(reactionType)}
            alt="Character"
            width={160}
            height={160}
            className="w-36 h-36 object-contain flex-shrink-0"
            key={reactionType || "base"}
          />
        </div>

        {/* Sentence Display */}
        <div className="sentence-display w-full max-w-md mb-3 animate-slide-up">
          <p className="text-left">
            <span className="text-gray-400 mr-1">🔊</span>
            {sentenceWithBlank.split("_____").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <span className="sentence-blank">?????</span>
                )}
              </span>
            ))}
          </p>
          <div className="flex justify-center mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={playAudio}
              disabled={playsRemaining === 0 || isPlaying || showResult}
              className="btn-glossy btn-gray !py-1.5 !px-3 !text-xs !shadow-[0px_2px_0px_#5E5E5E] !rounded-full"
            >
              {isPlaying ? "Playing..." : `Play (${playsRemaining} left)`}
            </button>
          </div>
        </div>

        {/* Input & Submit / Result */}
        {!showResult ? (
          <div className="w-full max-w-md space-y-2 animate-slide-up delay-200">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && userInput.trim() && !isProcessing) {
                  handleSubmit();
                }
              }}
              placeholder="Type the word..."
              disabled={isProcessing}
              className="spelling-input w-full"
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
            />
            <button
              onClick={handleSubmit}
              disabled={!userInput.trim() || isProcessing}
              className="btn-glossy btn-green w-full text-sm py-2.5"
            >
              {isProcessing ? "Checking..." : "Submit"}
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-3">
            {/* Result Card */}
            {currentWord && (
              <div className="result-card w-full animate-slide-up">
                {/* Score line */}
                <div className={`text-sm font-bold mb-2 animate-score-pop ${getScoreColorClass(currentAccuracy ?? 0)}`}>
                  Score: {currentAccuracy !== null ? currentAccuracy : "--"} out of 100
                </div>
                {/* Correct/Yours */}
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-gray-400">Correct:</span>
                  <span className="text-sm font-bold text-[#5E5E5E] animate-word-reveal">{currentWord.word}</span>
                </div>
                {currentAccuracy !== null && currentAccuracy < 100 && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-gray-400">Yours:</span>
                    <span className="text-sm font-mono font-bold tracking-wider">
                      {(() => {
                        const { userDiff } = generateDiff(userInput.trim(), currentWord.word);
                        return userDiff.map((d, i) => (
                          <span key={i} className={`diff-${d.status}`}>
                            {d.char}
                          </span>
                        ));
                      })()}
                    </span>
                  </div>
                )}
                <div className="pt-2 border-t border-gray-200">
                  <div className="text-sm text-gray-400">{currentWord.ja}</div>
                </div>
              </div>
            )}

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="btn-glossy btn-blue w-full text-sm py-2.5 animate-slide-up delay-300"
            >
              {currentWordIndex < TOTAL_WORDS_PER_GAME - 1 ? "Next Round" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
