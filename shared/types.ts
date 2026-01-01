export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number;
}
export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  instagram: string;
  linkedIn: string;
  resumeUrl: string;
  experienceLevel: string;
  motivation: string;
  dateIdea: string;
  availability: string;
  createdAt: number;
}