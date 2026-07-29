export type SubmissionStatus = "new" | "contacted" | "quoted" | "scheduled" | "won" | "lost";

export interface Submission {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  vehicleInfo: string;
  damageDescription: string;
  preferredContact: string;
  status: SubmissionStatus;
  notes: string;
  submittedAt: string;
  contactedAt?: string;
  updatedAt?: string;
  // Review-request tracking: set when the review-request SMS is opened for
  // this customer, and when the one follow-up reminder is sent.
  reviewRequestedAt?: string;
  reviewFollowupAt?: string;
  // Automated channels — set server-side when the job is marked Won
  // (initial) and ~3 days later (the single follow-up per channel).
  // Written via a conditional update BEFORE the send, so they double as
  // the send locks. Email goes through SES; SMS through AWS End User
  // Messaging once a verified toll-free number is configured.
  reviewEmailSentAt?: string;
  reviewEmailFollowupAt?: string;
  reviewSmsSentAt?: string;
  reviewSmsFollowupAt?: string;
  // How the lead arrived. Absent on records created before this field
  // existed — treat missing as "web".
  source?: "web" | "manual";
}
