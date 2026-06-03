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
  convertToScore10,
  generateDiff,
  getScoreColorClass,
  createSentenceWithBlank,
  playCorrectSound,
  playIncorrectSound,
} from "./utils";

type GameState = "start" | "playing" | "finished";

type RoundResult = {
  word: string;
  userAnswer: string;
  accuracy: number;
  meaning: string;
  ja: string;
};

const OPENING_LINE = "I heard you have great listening skill. Let's see about that.";

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

  // Preload all character images
  useEffect(() => {
    Object.values(REACTION_IMAGES).forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
    const img = new window.Image();
    img.src = DEFAULT_IMAGE;
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

  const handleSubmit = () => {
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
      playCorrectSound();
    } else if (accuracy >= SCORE_THRESHOLDS.EXCELLENT) {
      playCorrectSound();
    } else {
      playIncorrectSound();
    }

    // Generate reaction from templates
    let comment = "";
    let type: ReactionType;

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

      if (finalAvg === 100) {
        comment = FINAL_EXCELLENT_COMMENTS[Math.floor(Math.random() * FINAL_EXCELLENT_COMMENTS.length)];
        type = "perfect";
        triggerConfetti();
      } else if (finalAvg >= SCORE_THRESHOLDS.EXCELLENT) {
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
                  Start
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
        <div className="flex flex-col items-center justify-center min-h-screen px-4 py-6">
          {/* Logo */}
          <Image
            src="/images/logo.png"
            alt="Fix Your Ears"
            width={800}
            height={240}
            className="h-20 object-contain mb-4 animate-pop-in"
          />

          {/* Character + Speech Bubble */}
          <div className="flex items-center gap-2 w-full max-w-md mb-4 animate-pop-in">
            <div className="flex-1 min-w-0 relative">
              <div
                className={`px-4 py-3 ${isThoughtBubble(finalReactionType) ? "rounded-[50px]" : "rounded-lg"}`}
                style={{ background: '#FFFFFF', boxShadow: '0px 3px 0px #5E5E5E', border: '2px solid #5E5E5E' }}
              >
                <p className="text-base font-semibold text-[#5E5E5E] text-center">
                  {finalComment}
                </p>
              </div>
              {isThoughtBubble(finalReactionType) ? (
                <div className="absolute right-[-16px] top-1/2 -translate-y-1/2 flex items-center gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#5E5E5E]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white border-[1.5px] border-[#5E5E5E]" />
                </div>
              ) : (
                <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-white" style={{ filter: 'drop-shadow(3px 0 0 #5E5E5E)' }} />
              )}
            </div>
            <Image
              src={getCharacterImage(finalReactionType)}
              alt="Character"
              width={160}
              height={160}
              className="w-44 h-44 object-contain flex-shrink-0 animate-character"
            />
          </div>

          {/* Round Results */}
          <div className="w-full max-w-md mb-4 animate-slide-up delay-200">
            {roundResults.map((round, index) => (
              <div
                key={`result-${index}`}
                className="flex items-center justify-between py-1.5 border-b border-gray-200 last:border-b-0"
              >
                <span className="text-sm font-semibold text-[#5E5E5E]">Round {index + 1}</span>
                <span className={`text-sm font-bold ${getScoreColorClass(convertToScore10(round.accuracy))}`}>
                  {convertToScore10(round.accuracy)} pt
                </span>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 animate-slide-up delay-300">
            <button
              onClick={handleRestart}
              className="btn-glossy btn-green !text-xs !px-4 !py-1.5 !shadow-[0px_2px_0px_#5E5E5E] !rounded-full"
            >
              Play Again
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const dateStr = `${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}/${today.getFullYear()}`;
                const avgScore = convertToScore10(averageScore);
                const roundScores = roundResults.map((r, i) => `R${i + 1}: ${convertToScore10(r.accuracy)}`).join(" | ");
                const shareText = `Fix Your Ears! — ${dateStr}\n\n👂 Average: ${avgScore}/10\n${roundScores}\n\n👩‍🏫 "${finalComment || ''}"\n\n#FixYourEars\nCreated by Hikaru (@hhp_hikaru)\nhttps://www.fix-your-ears.app`;
                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                window.open(twitterUrl, '_blank', 'width=550,height=420');
              }}
              className="btn-glossy !text-xs !px-4 !py-1.5 !shadow-[0px_2px_0px_#5E5E5E] !rounded-full"
              style={{
                background: '#000000',
                color: 'white',
              }}
            >
              Share on X
            </button>
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
      <div className="flex flex-col items-center fixed inset-0 overflow-hidden px-4 py-3 bg-[#FFF9E6]">
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt="Fix Your Ears"
          width={800}
          height={240}
          className="h-20 object-contain mb-2"
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
              <p className="text-base font-semibold text-[#5E5E5E] text-center">
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

        {/* Sentence Display with inline input */}
        <div className="sentence-display w-full max-w-md mb-3 animate-slide-up">
          <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
            <button
              onClick={playAudio}
              disabled={playsRemaining === 0 || isPlaying || showResult}
              className="btn-glossy btn-blue !py-1.5 !px-3 !text-xs !shadow-[0px_2px_0px_#5E5E5E] !rounded-full"
            >
              {isPlaying ? "▶ Playing..." : `▶ Play (${playsRemaining} left)`}
            </button>
            {!showResult && (
              <button
                onClick={handleSubmit}
                disabled={!userInput.trim() || isProcessing}
                className="btn-glossy btn-green !py-1.5 !px-3 !text-xs !shadow-[0px_2px_0px_#5E5E5E] !rounded-full"
              >
                {isProcessing ? "Checking..." : "Submit"}
              </button>
            )}
            {showResult && currentAccuracy !== null && (
              <span className={`text-xl font-bold ${getScoreColorClass(convertToScore10(currentAccuracy))}`}>
                Score: {convertToScore10(currentAccuracy)}
              </span>
            )}
          </div>
          <p className="text-center">
            <span className="text-gray-400 mr-1">🔊</span>
            {sentenceWithBlank.split("_____").map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  showResult ? (
                    <span className="inline-block mx-1 font-bold border-b-2" style={{ minWidth: '60px', borderColor: currentAccuracy === 100 ? '#16a34a' : '#FF4A4A', color: currentAccuracy === 100 ? '#16a34a' : '#FF4A4A' }}>
                      {userInput.trim() || "—"}
                    </span>
                  ) : (
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && userInput.trim() && !isProcessing) {
                          handleSubmit();
                        }
                      }}
                      placeholder="???"
                      disabled={isProcessing}
                      className="inline-block border-2 border-[#5E5E5E] bg-white text-[#5E5E5E] outline-none text-center font-bold mx-1 w-[130px] rounded-none px-1 text-base"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck={false}
                      autoFocus
                    />
                  )
                )}
              </span>
            ))}
          </p>
        </div>

        {/* Result */}
        {showResult && (
          <div className="w-full max-w-md space-y-3">
            {/* Flash Card */}
            {currentWord && (
              <div className="result-card w-full animate-slide-up">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xl font-bold text-[#5E5E5E] animate-word-reveal">{currentWord.word}</span>
                    <div className="text-sm font-medium text-[#5E5E5E]">{currentWord.ja}</div>
                  </div>
                  <button
                    onClick={handleNext}
                    className="btn-glossy btn-green !py-1 !px-3 !text-xs !shadow-[0px_2px_0px_#5E5E5E] !rounded-full flex-shrink-0 ml-2"
                  >
                    {currentWordIndex < TOTAL_WORDS_PER_GAME - 1 ? "Next →" : "Results →"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
