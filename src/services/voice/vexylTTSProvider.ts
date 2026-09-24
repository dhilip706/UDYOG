/**
 * VEXYL-TTS Realtime WebSocket Voice Provider
 * 
 * Production Client for local/remote VEXYL-TTS server:
 * ws://127.0.0.1:8080 (ai4bharat/indic-parler-tts)
 * 
 * Features:
 * - Single persistent WebSocket connection (never reconnects per sentence)
 * - Real protocol: { type: 'synthesize', text, lang, style, request_id }
 * - Real audio: Decodes base64 WAV into Web Audio API buffers & plays on speakers
 * - Full connection state machine: DISCONNECTED, CONNECTING, CONNECTED, SYNTHESIZING, PLAYING, ERROR, RECONNECTING
 * - Interrupt/cancel support: Instantly stops playback and cancels stale requests
 * - Automatic exponential backoff reconnection
 */

import {
  VoiceConnectionState,
  TTSCallbacks,
  VoiceOptions,
  VexylSynthesizeRequest,
  VexylServerMessage,
  IVoiceProvider,
} from './voiceTypes';
import { getLanguageVoiceConfig } from './languageVoiceMap';

export class VexylTTSProvider implements IVoiceProvider {
  public readonly name = 'VexylTTS';
  private endpoint: string;
  private socket: WebSocket | null = null;
  private audioContext: AudioContext | null = null;
  private currentSource: AudioBufferSourceNode | null = null;
  private currentState: VoiceConnectionState = 'DISCONNECTED';
  private stateListeners: Set<(state: VoiceConnectionState) => void> = new Set();
  
  // Pending synthesis requests keyed by request_id
  private pendingRequests: Map<
    string,
    {
      resolve: () => void;
      reject: (err: any) => void;
      callbacks?: TTSCallbacks;
      createdAt: number;
      timer?: any;
    }
  > = new Map();

  // Active playing request id to reject stale audio
  private activeRequestId: string | null = null;

  // Reconnection state
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimer: any = null;
  private isExplicitlyClosed = false;
  private connectPromise: Promise<boolean> | null = null;

  constructor() {
    const envUrl =
      (typeof import.meta !== 'undefined' &&
        (import.meta.env?.VITE_VEXYL_TTS_URL || import.meta.env?.VITE_VEXYL_WS_URL)) ||
      'ws://127.0.0.1:8080';
    this.endpoint = envUrl;

    // Attach global user-gesture listeners to automatically unlock Web Audio AudioContext
    if (typeof window !== 'undefined') {
      const unlock = () => {
        this.unlockAudioContext().catch(() => {});
      };
      window.addEventListener('pointerdown', unlock, { passive: true });
      window.addEventListener('click', unlock, { passive: true });
      window.addEventListener('keydown', unlock, { passive: true });
    }
  }

  public getConnectionState(): VoiceConnectionState {
    return this.currentState;
  }

  public onStateChange(listener: (state: VoiceConnectionState) => void): () => void {
    this.stateListeners.add(listener);
    listener(this.currentState);
    return () => this.stateListeners.delete(listener);
  }

  private setState(state: VoiceConnectionState) {
    if (this.currentState === state) return;
    this.currentState = state;
    this.stateListeners.forEach((l) => {
      try {
        l(state);
      } catch {}
    });
  }

  /**
   * Initializes or returns the existing persistent WebSocket connection
   */
  public async ensureConnected(): Promise<boolean> {
    if (typeof window === 'undefined' || typeof WebSocket === 'undefined') {
      this.setState('DISCONNECTED');
      return false;
    }

    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.setState('CONNECTED');
      return true;
    }

    if (this.connectPromise) {
      return this.connectPromise;
    }

    this.setState(this.reconnectAttempts > 0 ? 'RECONNECTING' : 'CONNECTING');

    this.connectPromise = new Promise<boolean>((resolve) => {
      try {
        const ws = new WebSocket(this.endpoint);

        const openTimeout = setTimeout(() => {
          if (ws.readyState !== WebSocket.OPEN) {
            try {
              ws.close();
            } catch {}
            this.setState('ERROR');
            resolve(false);
          }
        }, 3000);

        ws.onopen = () => {
          clearTimeout(openTimeout);
          this.socket = ws;
          this.reconnectAttempts = 0;
          this.setState('CONNECTED');
          this.setupSocketEvents(ws);
          resolve(true);
        };

        ws.onerror = () => {
          clearTimeout(openTimeout);
          this.setState('ERROR');
          resolve(false);
        };

        ws.onclose = () => {
          clearTimeout(openTimeout);
          this.handleSocketClose();
          resolve(false);
        };
      } catch {
        this.setState('ERROR');
        resolve(false);
      }
    }).finally(() => {
      this.connectPromise = null;
    });

    return this.connectPromise;
  }

  private setupSocketEvents(ws: WebSocket) {
    ws.onmessage = async (event: MessageEvent) => {
      try {
        if (typeof event.data !== 'string') return;
        const msg: VexylServerMessage = JSON.parse(event.data);

        if (msg.type === 'ready') {
          this.setState('CONNECTED');
          return;
        }

        if (msg.type === 'error') {
          const reqId = msg.request_id;
          if (reqId && this.pendingRequests.has(reqId)) {
            const req = this.pendingRequests.get(reqId)!;
            if (req.timer) clearTimeout(req.timer);
            this.pendingRequests.delete(reqId);
            req.callbacks?.onError?.(new Error(msg.message));
            req.reject(new Error(msg.message));
          }
          this.setState('ERROR');
          return;
        }

        if (msg.type === 'audio') {
          const { request_id, audio_b64, latency_ms } = msg;

          // Check if this request is still active (not cancelled by newer request or stop)
          if (request_id !== this.activeRequestId) {
            // Stale audio packet, discard immediately
            const old = this.pendingRequests.get(request_id);
            if (old?.timer) clearTimeout(old.timer);
            this.pendingRequests.delete(request_id);
            return;
          }

          const pending = this.pendingRequests.get(request_id);
          if (pending?.timer) clearTimeout(pending.timer);
          this.pendingRequests.delete(request_id);

          if (pending) {
            const totalElapsed = Date.now() - pending.createdAt;
            if (process.env.NODE_ENV !== 'production') {
              console.debug(`[VEXYL_DIAG] TTS_FIRST_AUDIO received in ${totalElapsed}ms (server reported ${latency_ms || 0}ms)`);
            }
            if (latency_ms) {
              pending.callbacks?.onLatency?.(latency_ms);
            }
          }

          // Decode base64 WAV audio bytes
          await this.playAudioBase64(audio_b64, pending?.resolve, pending?.reject, pending?.callbacks);
        }
      } catch (err) {
        console.warn('[VexylTTS] Message processing error:', err);
      }
    };

    ws.onclose = () => {
      this.handleSocketClose();
    };
  }

  private handleSocketClose() {
    this.socket = null;
    if (this.isExplicitlyClosed) {
      this.setState('DISCONNECTED');
      return;
    }

    this.setState('DISCONNECTED');

    // Trigger exponential backoff reconnect
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 8000);
      this.reconnectAttempts++;
      if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
      this.reconnectTimer = setTimeout(() => {
        this.ensureConnected().catch(() => {});
      }, delay);
    }
  }

  public async unlockAudioContext(): Promise<void> {
    if (typeof window === 'undefined') return;
    try {
      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }
    } catch {}
  }

  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume().catch(() => {});
    }
    return this.audioContext;
  }

  /**
   * Decodes Base64 WAV audio and plays it via Web Audio API
   */
  private async playAudioBase64(
    b64: string,
    resolve?: () => void,
    reject?: (err: any) => void,
    callbacks?: TTSCallbacks
  ): Promise<void> {
    try {
      this.stopCurrentAudio();

      const binaryStr = atob(b64);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const ctx = this.getAudioContext();
      if (ctx.state === 'suspended') {
        await ctx.resume().catch(() => {});
      }
      const audioBuffer = await ctx.decodeAudioData(bytes.buffer.slice(0));

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      this.currentSource = source;

      this.setState('PLAYING');
      callbacks?.onStart?.();

      source.onended = () => {
        if (this.currentSource === source) {
          this.currentSource = null;
          this.setState('CONNECTED');
          callbacks?.onEnd?.();
          resolve?.();
        }
      };

      source.start(0);
    } catch (err) {
      this.setState('ERROR');
      callbacks?.onError?.(err);
      reject?.(err);
    }
  }

  private stopCurrentAudio(): void {
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch {}
      this.currentSource = null;
    }
  }

  /**
   * Check if VEXYL server is alive and ready
   */
  public async isAvailable(): Promise<boolean> {
    return this.ensureConnected();
  }

  public isSpeaking(): boolean {
    return this.currentState === 'PLAYING' || this.currentState === 'SYNTHESIZING';
  }

  /**
   * Speaks text using the VEXYL WebSocket server
   */
  public async speak(
    text: string,
    langCode: string,
    options?: VoiceOptions,
    callbacks?: TTSCallbacks
  ): Promise<void> {
    const trimmed = text.trim();
    if (!trimmed) {
      callbacks?.onEnd?.();
      return;
    }

    // Instantly cancel any ongoing playback
    this.stop();

    const config = getLanguageVoiceConfig(langCode);
    if (!config.ttsAvailable || !config.vexylLangCode) {
      throw new Error(`TTS unavailable for language ${langCode}`);
    }

    const connected = await this.ensureConnected();
    if (!connected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error(`VEXYL WebSocket server not connected at ${this.endpoint}`);
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    this.activeRequestId = requestId;
    this.setState('SYNTHESIZING');

    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[VEXYL_DIAG] TTS_REQUEST_START id=${requestId} lang=${config.vexylLangCode} len=${trimmed.length}`);
    }

    return new Promise<void>((resolve, reject) => {
      // 30-second fail-safe timeout so UI never hangs waiting for synthesis,
      // while allowing complete neural transformer synthesis on CPU/GPU without dropping audio
      const timer = setTimeout(() => {
        if (this.pendingRequests.has(requestId)) {
          console.warn(`[VexylTTS] Request ${requestId} timed out after 30000ms`);
          this.pendingRequests.delete(requestId);
          this.setState('ERROR');
          callbacks?.onError?.(new Error('VEXYL synthesis timeout'));
          reject(new Error('VEXYL synthesis timeout'));
        }
      }, 30000);

      this.pendingRequests.set(requestId, {
        resolve,
        reject,
        callbacks,
        createdAt: Date.now(),
        timer,
      });

      const payload: VexylSynthesizeRequest = {
        type: 'synthesize',
        text: trimmed,
        lang: config.vexylLangCode!,
        style: options?.style || config.defaultStyle || 'formal',
        request_id: requestId,
      };

      try {
        this.socket!.send(JSON.stringify(payload));
      } catch (err) {
        clearTimeout(timer);
        this.pendingRequests.delete(requestId);
        this.setState('ERROR');
        reject(err);
      }
    });
  }

  /**
   * Pre-warm persistent WebSocket connection and model
   */
  public async warmUp(): Promise<void> {
    try {
      await this.ensureConnected();
    } catch {}
  }

  /**
   * Pre-synthesizes and primes VEXYL's server cache for an anticipated prompt
   */
  public async preWarmPrompt(text: string, langCode: string): Promise<void> {
    try {
      const trimmed = text.trim();
      if (!trimmed) return;
      const config = getLanguageVoiceConfig(langCode);
      if (!config.ttsAvailable || !config.vexylLangCode) return;
      const connected = await this.ensureConnected();
      if (!connected || !this.socket || this.socket.readyState !== WebSocket.OPEN) return;

      const requestId = `prewarm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
      const payload: VexylSynthesizeRequest = {
        type: 'synthesize',
        text: trimmed,
        lang: config.vexylLangCode,
        style: config.defaultStyle || 'formal',
        request_id: requestId,
      };
      this.socket.send(JSON.stringify(payload));
    } catch {}
  }

  /**
   * Instantly stops playback and cancels pending synthesis
   */
  public stop(): void {
    this.stopCurrentAudio();
    this.activeRequestId = null;
    this.pendingRequests.forEach((req) => {
      if (req.timer) clearTimeout(req.timer);
    });
    this.pendingRequests.clear();
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.setState('CONNECTED');
    } else {
      this.setState('DISCONNECTED');
    }
  }

  public disconnect(): void {
    this.isExplicitlyClosed = true;
    this.stop();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      try {
        this.socket.close();
      } catch {}
      this.socket = null;
    }
    this.setState('DISCONNECTED');
  }
}

export const vexylTTSProvider = new VexylTTSProvider();
