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
  // Deal details the owner needs at a glance mid-phone-call: what was
  // quoted and when the job is booked for. Free-form strings — "$80" and a
  // datetime-local value respectively.
  quotePrice?: string;
  scheduledFor?: string;
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
