export type ComplaintCategory =
  | 'employer_issue'
  | 'training_issue'
  | 'application_issue'
  | 'harassment_abuse'
  | 'discrimination'
  | 'payment_issue'
  | 'technical_issue'
  | 'incorrect_profile'
  | 'other_complaint';

export type SupportChannel =
  | 'callback'
  | 'email'
  | 'whatsapp'
  | 'chat';

export type ComplaintStatus =
  | 'Submitted'
  | 'Received'
  | 'Assigned'
  | 'Under Review'
  | 'Action Required'
  | 'Resolved'
  | 'Closed';

export interface ComplaintEvent {
  timestamp: string;
  note: string;
  author: string;
}

export interface SupportComplaint {
  id: string; // e.g. CMP-2026-8921
  category: ComplaintCategory;
  channel: SupportChannel;
  title: string;
  description: string;
  evidenceAttachments?: string[];
  status: ComplaintStatus;
  assignedTeam: string;
  createdAt: string;
  updatedAt: string;
  responseHistory: ComplaintEvent[];
  resolution?: string;
  escalationAvailable: boolean;
  userContact: {
    name: string;
    phoneNumber?: string;
    email?: string;
    district?: string;
  };
}

export interface SupportChannelInfo {
  id: SupportChannel;
  title: string;
  description: string;
  isAiAssisted: boolean;
  availabilityLabel: string;
  badge: string;
}
