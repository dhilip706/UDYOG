# AI Architecture & Safety Protocols — Aura Platform

## 1. Provider Abstraction Architecture

Aura decouples high-level application intelligence from underlying LLM, STT, and TTS vendors using strongly typed provider interfaces located in `src/services/ai/aiProvider.ts`.

```typescript
export interface LLMProvider {
  name: string;
  generateCompletion(prompt: string, context?: Record<string, any>): Promise<string>;
  extractStructuredJson<T>(prompt: string, schemaDescription: string): Promise<T>;
}

export interface STTProvider {
  name: string;
  transcribeAudio(audioBlob: Blob, languageCode: string): Promise<string>;
  startRealtimeListening(onTranscript: (text: string, isFinal: boolean) => void, onError: (err: any) => void): () => void;
}

export interface TTSProvider {
  name: string;
  synthesizeSpeech(text: string, voiceId: string, languageCode: string): Promise<ArrayBuffer>;
}
```

This ensures that OpenAI, Anthropic, Google Gemini, Azure Cognitive Services, or local on-premise models (Ollama/vLLM) can be swapped seamlessly by modifying environment variables (`LLM_PROVIDER`, `STT_PROVIDER`, `TTS_PROVIDER`) without altering application code.

---

## 2. Voice Pipeline & AI Companion Orchestration

```
MICROPHONE INPUT
       ↓
VOICE ACTIVITY DETECTION (VAD)
       ↓
SPEECH TO TEXT (STT Engine / Web Speech API)
       ↓
CONVERSATIONAL CONTEXT PARSER
       ↓
STRUCTURED INTENT EXTRACTION (Zod Schema Validation)
       ↓
LLM REASONING & RESPONSE FORMULATION
       ↓
INDIC TEXT-TO-SPEECH SYNTHESIS (TTS)
       ↓
AUDIO OUTPUT & COMPANION STATE MACHINE
(idle → listening → processing → speaking → success/error)
```

### Aisha & Arjun Personas
The system incorporates realistic human visual portraits:
- **Aisha**: Warm, empathetic, patient, encouraging, and supportive. Ideal for first-time digital onboarding and rural artisans.
- **Arjun**: Calm, confident, structured, practical, and analytical. Ideal for technical diagnostics and vocational trades.

---

## 3. Explainable Job Matching Engine

Aura rejects black-box scoring algorithms. Match evaluations are computed transparently via `src/services/ai/matchingEngine.ts`:

- **Input Parameters**:
  - Beneficiary verified skills, practical tools, and years of field experience.
  - Job required competencies, preferred tools, minimum experience, and district location.
- **Output Signals**:
  - `matchedSkills`: Verified overlapping capabilities.
  - `missingSkills`: Specific gap skills required for full competency.
  - `locationFit`: True/False district or relocation alignment.
  - `experienceFit`: True/False field tenure alignment.
  - `transparentExplanation`: Clear natural-language rationale explaining *why* the candidate aligns and *what* learning steps bridge remaining gaps.

---

## 4. AI Safety & Non-Discrimination Guardrails

1. **Zero IQ Inferences**: The platform strictly prohibits calculating or inferring intelligence/IQ from speech cadence, dialect, or vocal timbre.
2. **Zero Demographic/Caste Bias**: Caste, religion, or community backgrounds are NEVER used as occupation suitability signals.
3. **No Hallucinated Accreditations**: Official NSQF or NCVET alignment marks are displayed exclusively when verified records exist in the national registry.
4. **Deterministic Confirmation**: Critical operations (Profile Submission, Job Application, Grievance Filing, Job Publication) require explicit human confirmation.
