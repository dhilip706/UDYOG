import { LLMProvider, LLMMessage, LLMResponse } from './aiProvider';

export class DevelopmentLLMProvider implements LLMProvider {
  public name = 'Aura-Dev-Engine';

  async chatCompletion(messages: LLMMessage[]): Promise<LLMResponse> {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
    const lower = lastUserMessage.toLowerCase();

    let content = "I understand. Let's examine your practical background and specific tools used.";

    if (lower.includes('mechanic') || lower.includes('engine') || lower.includes('diagnostic')) {
      content = "Your automotive and diagnostics background is recognized. We can evaluate your OBD-II and scanner experience to identify career pathways.";
    } else if (lower.includes('solar') || lower.includes('electric') || lower.includes('pv')) {
      content = "Solar and clean energy installations represent high-growth pathways. Let's document your grid-tie and inverter wiring experience.";
    } else if (lower.includes('job') || lower.includes('opportunity')) {
      content = "I can match you with verified local opportunities in your district. You will be able to review and confirm all details.";
    }

    return {
      content,
      usage: {
        promptTokens: messages.reduce((acc, m) => acc + m.content.length, 0),
        completionTokens: content.length,
        totalTokens: messages.reduce((acc, m) => acc + m.content.length, 0) + content.length,
      },
    };
  }
}

export class ExternalLLMProvider implements LLMProvider {
  public name: string;
  private endpoint: string;

  constructor(name: string, endpoint: string = '/api/ai/conversation') {
    this.name = name;
    this.endpoint = endpoint;
  }

  async chatCompletion(messages: LLMMessage[]): Promise<LLMResponse> {
    const lastMessage = messages[messages.length - 1]?.content || '';
    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: lastMessage }),
    });

    if (!res.ok) {
      throw new Error(`LLM provider error: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      content: data.reply || data.content,
    };
  }
}

export const defaultLLMProvider: LLMProvider = new DevelopmentLLMProvider();
