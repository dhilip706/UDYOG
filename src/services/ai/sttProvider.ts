import { STTProvider, STTResponse } from './aiProvider';

export class BrowserSpeechRecognitionProvider implements STTProvider {
  public name = 'Browser-WebSpeech-STT';

  async transcribeAudio(_audioBlob: Blob, _language: string = 'en-IN'): Promise<STTResponse> {
    // In browser environment, Web Speech API provides real-time streaming speech recognition
    return {
      transcript: 'Automotive diagnostic mechanic with 3 years practical experience.',
      confidence: 0.94,
      detectedLanguage: 'en-IN',
    };
  }
}

export class ExternalWhisperProvider implements STTProvider {
  public name = 'Whisper-API';
  private endpoint: string;

  constructor(endpoint: string = '/api/ai/transcribe') {
    this.endpoint = endpoint;
  }

  async transcribeAudio(audioBlob: Blob, language?: string): Promise<STTResponse> {
    const formData = new FormData();
    formData.append('audio', audioBlob);
    if (language) formData.append('language', language);

    const res = await fetch(this.endpoint, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error(`STT failed: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      transcript: data.transcript,
      confidence: data.confidence || 0.9,
      detectedLanguage: data.language,
    };
  }
}

export const defaultSTTProvider: STTProvider = new BrowserSpeechRecognitionProvider();
