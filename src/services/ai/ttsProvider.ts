import { TTSProvider, TTSResponse } from './aiProvider';
import { voiceService } from '../voice/voiceService';

export class BrowserSynthesisProvider implements TTSProvider {
  public name = 'Vexyl-Voice-TTS';

  async synthesizeSpeech(text: string, options?: { voiceId?: string; language?: string }): Promise<TTSResponse> {
    await voiceService.speak(text, options?.language || 'ta');
    return { audioUrl: undefined };
  }
}

export class ExternalTTSProvider implements TTSProvider {
  public name = 'Neural-TTS';
  private endpoint: string;

  constructor(endpoint: string = '/api/ai/synthesize') {
    this.endpoint = endpoint;
  }

  async synthesizeSpeech(text: string, options?: { voiceId?: string; language?: string }): Promise<TTSResponse> {
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, ...options }),
    });

    if (!res.ok) {
      throw new Error(`TTS failed: ${res.statusText}`);
    }

    const blob = await res.blob();
    return {
      audioBlob: blob,
      audioUrl: URL.createObjectURL(blob),
    };
  }
}

export const defaultTTSProvider: TTSProvider = new BrowserSynthesisProvider();
