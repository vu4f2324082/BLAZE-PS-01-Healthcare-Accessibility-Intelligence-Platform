export type AccessibilityFeature =
  | 'wheelchair_ramp'
  | 'elevator'
  | 'accessible_restroom'
  | 'braille_signage'
  | 'tactile_path'
  | 'wide_doorway'
  | 'adjustable_exam_table'
  | 'sign_language_interpreter'
  | 'priority_queue'
  | 'disabled_parking';

export interface FacilityAccessibility {
  facility_id: string;
  wheelchair_ramp: boolean;
  elevator: boolean;
  accessible_restroom: boolean;
  braille_signage: boolean;
  tactile_path: boolean;
  wide_doorway: boolean;
  adjustable_exam_table: boolean;
  sign_language_interpreter: boolean;
  priority_queue: boolean;
  disabled_parking: boolean;
  services: string[];
}

export interface Facility {
  id: string;
  name: string;
  address: string;
  contact: string;
  lat: number;
  lng: number;
  // Flat accessibility_features map retained for backward compat with existing components
  accessibility_features: Record<AccessibilityFeature, boolean>;
  services: string[];
  rating: number;
  accessibility_score: number;
  photos: string[];
  type: 'Hospital' | 'Clinic' | 'Diagnostic Center';
  verified: boolean;
}

export interface Review {
  id: string;
  facility_id: string;
  user_name?: string;          // Optional — anonymous portal
  submitter_ip_hash?: string;  // Hashed for spam prevention
  rating: number;              // 1-5
  comment: string;
  date: string;                // ISO date string
}

export type IssueReportStatus = 'OPEN' | 'RESOLVED';

export interface IssueReport {
  id: string;
  facility_id: string;
  issue_type: string;
  description: string;
  status: IssueReportStatus;
  created_at: string;
}

// ---- API shape helpers ----

export interface FacilityDetailResponse {
  facility: Facility;
  accessibility: FacilityAccessibility;
  reviews: Review[];
}

export interface FacilitiesQueryParams {
  q?: string;
  lat?: number;
  lng?: number;
  radius?: number;
  features?: string;   // comma-separated AccessibilityFeature keys
  type?: Facility['type'];
  ids?: string;        // comma-separated ids for dashboard bulk-fetch
}
