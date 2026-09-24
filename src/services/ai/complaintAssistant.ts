export interface StructuredGrievance {
  category: 'EMPLOYER' | 'TRAINING_PROVIDER' | 'APPLICATION' | 'PAYMENT' | 'MISTREATMENT' | 'ABUSE' | 'TECHNICAL_ISSUE' | 'ACCOUNT_ISSUE' | 'OTHER';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  subject: string;
  description: string;
}

export function structureVoiceGrievance(transcript: string): StructuredGrievance {
  const t = transcript.toLowerCase();

  let category: StructuredGrievance['category'] = 'OTHER';
  let priority: StructuredGrievance['priority'] = 'MEDIUM';
  let subject = 'Grievance / Platform Assistance Request';

  if (t.includes('payment') || t.includes('salary') || t.includes('wage') || t.includes('unpaid') || t.includes('money')) {
    category = 'PAYMENT';
    priority = 'HIGH';
    subject = 'Wage / Payment Non-Disbursement Issue';
  } else if (t.includes('harass') || t.includes('mistreat') || t.includes('abuse') || t.includes('threat')) {
    category = 'MISTREATMENT';
    priority = 'URGENT';
    subject = 'Urgent Workplace Grievance / Safety Escalation';
  } else if (t.includes('training') || t.includes('certificate') || t.includes('course') || t.includes('instructor')) {
    category = 'TRAINING_PROVIDER';
    priority = 'MEDIUM';
    subject = 'Training Center Course / Certificate Inquiry';
  } else if (t.includes('employer') || t.includes('job') || t.includes('contract') || t.includes('hours')) {
    category = 'EMPLOYER';
    priority = 'MEDIUM';
    subject = 'Employer Compliance / Working Terms Clarification';
  } else if (t.includes('app') || t.includes('login') || t.includes('otp') || t.includes('bug')) {
    category = 'TECHNICAL_ISSUE';
    priority = 'LOW';
    subject = 'Platform Technical Support';
  }

  return {
    category,
    priority,
    subject,
    description: transcript.trim(),
  };
}
