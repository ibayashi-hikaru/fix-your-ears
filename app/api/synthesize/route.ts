import { NextRequest, NextResponse } from "next/server";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export async function POST(request: NextRequest) {
  try {
    const { text, rate = 1.0 } = await request.json();

    if (!text) {
      return NextResponse.json(
        { error: "Text is required" },
        { status: 400 }
      );
    }

    const speechKey = process.env.AZURE_SPEECH_KEY;
    const speechRegion = process.env.AZURE_SPEECH_REGION;

    if (!speechKey || !speechRegion) {
      console.error("Azure Speech credentials not configured");
      return NextResponse.json(
        { error: "Speech service not configured" },
        { status: 500 }
      );
    }

    const speechConfig = sdk.SpeechConfig.fromSubscription(
      speechKey,
      speechRegion
    );

    // Use a female US English voice
    speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

    // Set speech rate (0.5 to 1.5)
    const speechRate = Math.max(0.5, Math.min(1.5, rate));

    // Create SSML with rate adjustment
    const ssml = `
      <speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">
        <voice name="en-US-JennyNeural">
          <prosody rate="${speechRate}">
            ${text}
          </prosody>
        </voice>
      </speak>
    `;

    // Synthesize to audio data
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

    return new Promise<NextResponse>((resolve) => {
      synthesizer.speakSsmlAsync(
        ssml,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            const audioData = result.audioData;
            synthesizer.close();

            resolve(
              new NextResponse(audioData, {
                status: 200,
                headers: {
                  "Content-Type": "audio/wav",
                  "Content-Length": audioData.byteLength.toString(),
                },
              })
            );
          } else {
            console.error("Speech synthesis failed:", result.errorDetails);
            synthesizer.close();
            resolve(
              NextResponse.json(
                { error: "Speech synthesis failed" },
                { status: 500 }
              )
            );
          }
        },
        (error) => {
          console.error("Speech synthesis error:", error);
          synthesizer.close();
          resolve(
            NextResponse.json(
              { error: "Speech synthesis error" },
              { status: 500 }
            )
          );
        }
      );
    });
  } catch (error) {
    console.error("Error in synthesize API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
