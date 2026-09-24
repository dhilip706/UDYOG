/**
 * AI Provider Abstraction Interface
 * Pluggable architecture supporting OpenAI, Gemini, Anthropic, Bhashini, Whisper, and authentic Dev fallbacks.
 * Private API keys are never exposed to browser bundles.
 */

export interface LLMMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface LLMResponse {
  content: string;
  finishReason?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface LLMProvider {
  name: string;
  chatCompletion(messages: LLMMessage[], options?: { temperature?: number; maxTokens?: number }): Promise<LLMResponse>;
}

export interface STTResponse {
  transcript: string;
  confidence: number;
  detectedLanguage?: string;
}

export interface STTProvider {
  name: string;
  transcribeAudio(audioBlob: Blob, language?: string): Promise<STTResponse>;
}

export interface TTSResponse {
  audioUrl?: string;
  audioBlob?: Blob;
}

export interface TTSProvider {
  name: string;
  synthesizeSpeech(text: string, options?: { voiceId?: string; language?: string }): Promise<TTSResponse>;
}

export interface EmbeddingProvider {
  name: string;
  generateEmbeddings(texts: string[]): Promise<number[][]>;
}

export interface AIProviderConfig {
  llmProvider: LLMProvider;
  sttProvider: STTProvider;
  ttsProvider: TTSProvider;
  embeddingProvider: EmbeddingProvider;
}
