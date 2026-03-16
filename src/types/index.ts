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

export interface Facility {
  id: string;
  name: string;
  address: string;
  contact: string;
  lat: number;
  lng: number;
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
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  date: string;
}
