# Fix Your Ears

A dictation game to improve your English listening skills. Listen to sentences and type what you hear, then get feedback from a brutally honest American wife character.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- An Azure account with Speech Services subscription

### Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory and add your Azure Speech Services credentials:

```
AZURE_SPEECH_KEY=your_azure_speech_key_here
AZURE_SPEECH_REGION=your_azure_region_here
```

To get your Azure Speech Services credentials:
1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new "Speech" resource
3. Copy the "Key" and "Region" from the resource overview page

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to play the game.

## How to Play

1. Click "Start" to begin the game
2. Click "Play Audio" to hear a sentence (you can play each sentence up to 2 times)
3. Adjust the playback speed using the slider if needed (0.5x to 1.5x)
4. Type what you hear in the input field
5. Click "Submit" to check your answer
6. The game will show you the correct answer and give you feedback
7. Complete 10 rounds to see your final score

## Features

- **Multiple Difficulty Levels**: Sentences range from beginner to advanced
- **Adjustable Speed**: Control playback speed from 0.5x to 1.5x
- **Limited Playback**: Each sentence can be played up to 2 times
- **Exact Matching**: Your answer must match the sentence exactly (punctuation is ignored)
- **Sassy Feedback**: Get brutally honest reactions from the American wife character
- **Visual Feedback**: Character expressions change based on your performance

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Azure Speech Services for text-to-speech
- Tailwind CSS for styling
- Canvas Confetti for celebrations

## Based On

This game is a sequel to [That's Not a Word!](https://github.com/yourusername/thats_not_a_word) - a pronunciation practice game.
