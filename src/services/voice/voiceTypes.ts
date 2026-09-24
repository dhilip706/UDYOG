/**
 * UDYOG Realtime Voice Types & WebSocket Protocol
 * 
 * Supports the authentic VEXYL-TTS WebSocket protocol:
 * ws://127.0.0.1:8080 (ai4bharat/indic-parler-tts)
 */

export type VoiceConnectionState = 
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'CONNECTED'
  | 'SYNTHESIZING'
  | 'PLAYING'
  | 'ERROR'
  | 'RECONNECTING';

export interface TTSCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: Error | any) => void;
  onStateChange?: (state: VoiceConnectionState) => void;
  onLatency?: (latencyMs: number) => void;
}

export interface VoiceOptions {
  voice?: string;
  style?: 'default' | 'warm' | 'formal';
  rate?: number;
  pitch?: number;
  callbacks?: TTSCallbacks;
}

/**
 * Real VEXYL WebSocket Request Protocol
 */
export interface VexylSynthesizeRequest {
  type: 'synthesize';
  text: string;
  lang: string; // e.g. "ta-IN", "hi-IN", "ml-IN"
  style?: string; // "default" | "warm" | "formal"
  request_id: string;
  description?: string;
}

/**
 * Real VEXYL WebSocket Response Protocol
 */
export interface VexylAudioResponse {
  type: 'audio';
  request_id: string;
  audio_b64: string; // Base64 encoded WAV audio bytes
  sample_rate: number; // e.g. 22050
  cached?: boolean;
  latency_ms?: number;
}

export interface VexylReadyResponse {
  type: 'ready';
  model: string;
  sample_rate: number;
  languages: string[];
}

export interface VexylErrorResponse {
  type: 'error';
  message: string;
  request_id?: string;
}

export interface VexylStatsResponse {
  type: 'stats';
  cache_hits: number;
  cache_total: number;
  hit_rate: number;
}

export type VexylServerMessage = 
  | VexylReadyResponse 
  | VexylAudioResponse 
  | VexylErrorResponse 
  | VexylStatsResponse;

export interface IVoiceProvider {
  readonly name: string;
  isAvailable(): Promise<boolean> | boolean;
  speak(text: string, langCode: string, options?: VoiceOptions, callbacks?: TTSCallbacks): Promise<void> | void;
  stop(): void;
  isSpeaking(): boolean;
  getConnectionState?(): VoiceConnectionState;
}
