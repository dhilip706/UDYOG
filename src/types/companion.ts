export type CompanionId = 'aisha';

export type CompanionState = 
  | 'IDLE' 
  | 'LISTENING' 
  | 'SPEAKING' 
  | 'THINKING' 
  | 'GUIDING' 
  | 'SUCCESS' 
  | 'ERROR';

export interface CompanionProfile {
  id: CompanionId;
  name: string;
  avatarTone: 'warm-amber';
  persona: string;
  archetype: string;
  accentColor: string;
}

export interface CompanionDialogueState {
  text: string;
  state: CompanionState;
  targetFocusElementId?: string;
  isVoiceActive?: boolean;
}
