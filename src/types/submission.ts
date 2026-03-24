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
}
