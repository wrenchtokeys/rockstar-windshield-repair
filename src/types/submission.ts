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
  // How the lead arrived. Absent on records created before this field
  // existed — treat missing as "web".
  source?: "web" | "manual";
}
