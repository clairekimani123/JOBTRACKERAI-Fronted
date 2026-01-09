// User types
export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

// Application types
export type ApplicationStatus = 'applied' | 'interview' | 'offer' | 'rejected' | 'withdrawn';

export interface Application {
  id: number;
  user_id: number;
  company_name: string;
  position_title: string;
  job_description?: string;
  status: ApplicationStatus;
  applied_date: string;
  follow_up_date?: string;
  notes?: string;
  job_url?: string;
  salary_range?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationRequest {
  company_name: string;
  position_title: string;
  job_description?: string;
  status: ApplicationStatus;
  applied_date: string;
  follow_up_date?: string;
  notes?: string;
  job_url?: string;
  salary_range?: string;
  location?: string;
}

// Resume types
export interface Resume {
  id: number;
  original_filename: string;
  file_path: string;
  extracted_text?: string;
  uploaded_at: string;
}

// AI Analysis types
export interface AIAnalysis {
  id: number;
  user_id: number;
  application_id: number;
  resume_id: number;
  match_score: number;
  strengths: string;
  missing_skills: string;
  recommendation: string;
  created_at: string;
}

// Stats types
export interface ApplicationStats {
  total: number;
  applied: number;
  interview: number;
  offer: number;
  rejected: number;
}