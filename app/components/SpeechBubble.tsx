import React from 'react';

interface SpeechBubbleProps {
  message: string;
  isPerfect?: boolean;
  className?: string;
}

export function SpeechBubble({ message, isPerfect = false, className = '' }: SpeechBubbleProps) {
  return (
    <div className={`relative w-full ${className}`}>
      <div
        className={`game-speech-bubble ${isPerfect ? "thought-bubble" : ""} bg-white border-[3px] border-[var(--dark-gray)] shadow-[0px_4px_0px_var(--dark-gray)]`}
      >
        <p className="text-sm md:text-lg leading-relaxed font-semibold text-[var(--dark-gray)] text-center">
          {message}
        </p>

        {/* Conditional tail: モクモク for perfect, triangle for normal */}
        {isPerfect ? (
          <div className="game-speech-bubble-tail-outer"></div>
        ) : (
          /* Speech bubble tail pointing down */
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -translate-y-1">
            <div
              className="w-0 h-0 border-l-8 md:border-l-12 border-r-8 md:border-r-12 border-t-8 md:border-t-12 border-l-transparent border-r-transparent"
              style={{ borderTopColor: '#FFFFFF' }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
