"use client";

import React from 'react';
import Image from 'next/image';

type Mood = 'base' | 'perfect' | 'disappointed' | 'laughing' | 'unsatisfied' | 'loss-for-words' | 'drop-shoulders';

interface CharacterProps {
  mood?: Mood;
  className?: string;
}

const MOOD_IMAGES: Record<Mood, string> = {
  base: '/images/base.png',
  perfect: '/images/perfect.png',
  disappointed: '/images/disappointed.png',
  laughing: '/images/laughing.png',
  unsatisfied: '/images/unsatisfied.png',
  'loss-for-words': '/images/loss_for_words.png',
  'drop-shoulders': '/images/drop_shoulders.png',
};

export function Character({ mood = 'base', className = '' }: CharacterProps) {
  return (
    <div className={`relative ${className}`}>
      <Image
        src={MOOD_IMAGES[mood]}
        alt="Character"
        width={400}
        height={400}
        className="w-full h-auto max-w-[400px] mx-auto drop-shadow-lg"
      />
    </div>
  );
}
