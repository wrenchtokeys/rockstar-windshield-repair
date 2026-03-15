export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  vehicleInfo: string;
  damageDescription: string;
  preferredContact: "phone" | "email" | "text";
  honeypot: string;
}

export interface FormState {
  success: boolean;
  message: string;
}
