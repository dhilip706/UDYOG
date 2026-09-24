import { SupportComplaint, SupportChannelInfo } from '../types/complaints';

const STORAGE_KEY = 'udyog_user_complaints';

const INITIAL_DEMO_COMPLAINTS: SupportComplaint[] = [];

export const SUPPORT_CHANNELS: SupportChannelInfo[] = [
  {
    id: 'callback',
    title: 'Support Call-Back Request',
    description: 'Request a phone call from an authorized regional livelihood officer.',
    isAiAssisted: false,
    availabilityLabel: 'Mon-Sat 9:30 AM - 6:00 PM (Human Officers)',
    badge: 'HUMAN OFFICER',
  },
  {
    id: 'email',
    title: 'Official Email Support',
    description: 'Submit detailed documentation or formal grievance statements.',
    isAiAssisted: false,
    availabilityLabel: 'Response within 24-48 business hours',
    badge: 'OFFICIAL RECORD',
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp 24/7 Support',
    description: 'Instant automated assistance, status tracking, and document upload.',
    isAiAssisted: true,
    availabilityLabel: '24/7 Automated / AI-Assisted (Not human 24/7)',
    badge: 'AI-ASSISTED 24/7',
  },
  {
    id: 'chat',
    title: 'Aisha Live Help & Grievance Chat',
    description: 'Voice & text grievance structuring guided by your AI assistant.',
    isAiAssisted: true,
    availabilityLabel: '24/7 Automated Voice & Text Intake',
    badge: 'AI-ASSISTED 24/7',
  },
];

export class ComplaintService {
  public static getComplaints(): SupportComplaint[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_DEMO_COMPLAINTS;
  }

  public static submitComplaint(data: {
    category: SupportComplaint['category'];
    channel: SupportComplaint['channel'];
    title: string;
    description: string;
    userContact: SupportComplaint['userContact'];
    evidenceAttachments?: string[];
  }): SupportComplaint {
    const id = `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newComplaint: SupportComplaint = {
      id,
      category: data.category,
      channel: data.channel,
      title: data.title,
      description: data.description,
      evidenceAttachments: data.evidenceAttachments || [],
      status: 'Submitted',
      assignedTeam: this.getAssignedTeam(data.category),
      createdAt: now,
      updatedAt: now,
      responseHistory: [
        {
          timestamp: now,
          note: `Grievance registered through ${data.channel}. Assigned ticket number ${id}.`,
          author: 'System Intake',
        },
      ],
      escalationAvailable: false,
      userContact: data.userContact,
    };

    const all = [newComplaint, ...this.getComplaints()];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // ignore storage error
    }

    return newComplaint;
  }

  public static escalateComplaint(complaintId: string, note?: string): SupportComplaint | null {
    const all = this.getComplaints();
    const idx = all.findIndex((c) => c.id === complaintId);
    if (idx === -1) return null;

    const target = all[idx];
    const now = new Date().toISOString();
    target.status = 'Action Required';
    target.updatedAt = now;
    target.responseHistory.push({
      timestamp: now,
      note: note ? `User escalated: ${note}` : 'User requested urgent administrative escalation to State Cell.',
      author: 'Beneficiary Escalation',
    });
    target.escalationAvailable = false;

    all[idx] = target;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch {
      // ignore
    }

    return target;
  }

  private static getAssignedTeam(category: SupportComplaint['category']): string {
    switch (category) {
      case 'employer_issue':
      case 'payment_issue':
        return 'Employer Oversight & Fair Labor Bureau';
      case 'training_issue':
        return 'Regional Directorate of Skilling & Labs';
      case 'harassment_abuse':
      case 'discrimination':
        return 'Special Ethics, Protection & Grievance Directorate';
      case 'technical_issue':
      case 'incorrect_profile':
        return 'Platform Identity & Records Verification Unit';
      default:
        return 'Central Public Grievance Operations Desk';
    }
  }
}
