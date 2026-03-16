import { Facility, AccessibilityFeature } from '../types';

const FEATURES: AccessibilityFeature[] = [
  'wheelchair_ramp', 'elevator', 'accessible_restroom', 'braille_signage', 
  'tactile_path', 'wide_doorway', 'adjustable_exam_table', 
  'sign_language_interpreter', 'priority_queue', 'disabled_parking'
];

const FACILITY_NAMES = [
  'City Care Hospital', 'Sunshine Clinic', 'Metro Health Center', 
  'Gateway Diagnostic', 'Unity Wellness Hub', 'Lifeline Medical', 
  'Global Heart Institute', 'Safe Hands Clinic', 'Pearl Dental Care', 
  'Apex Trauma Center'
];

const LOCALITIES = [
  'Andheri West', 'Bandra East', 'Colaba', 'Dharavi', 'Goregaon', 
  'Juhu', 'Kandivali', 'Lower Parel', 'Malad', 'Powai'
];

function calculateScore(features: Record<AccessibilityFeature, boolean>): number {
  const total = FEATURES.length;
  const active = FEATURES.filter(f => features[f]).length;
  return Math.round((active / total) * 100);
}

export function generateMockFacilities(count: number = 50): Facility[] {
  return Array.from({ length: count }).map((_, i) => {
    const features: Record<AccessibilityFeature, boolean> = FEATURES.reduce((acc, f) => {
      acc[f] = Math.random() > 0.4;
      return acc;
    }, {} as Record<AccessibilityFeature, boolean>);

    const locality = LOCALITIES[Math.floor(Math.random() * LOCALITIES.length)];
    const name = `${FACILITY_NAMES[Math.floor(Math.random() * FACILITY_NAMES.length)]} ${locality}`;

    return {
      id: `f-${i + 1}`,
      name,
      address: `${Math.floor(Math.random() * 500) + 1}, SV Road, ${locality}, Mumbai`,
      contact: `+91 22 ${Math.floor(Math.random() * 90000000) + 10000000}`,
      lat: 18.9 + Math.random() * 0.3,
      lng: 72.8 + Math.random() * 0.1,
      accessibility_features: features,
      services: ['General Consultation', 'Emergency', 'Radiology'].slice(0, Math.floor(Math.random() * 3) + 1),
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      accessibility_score: calculateScore(features),
      photos: [
        `https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=400`,
        `https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=400`
      ],
      type: (['Hospital', 'Clinic', 'Diagnostic Center'] as const)[Math.floor(Math.random() * 3)],
      verified: Math.random() > 0.3
    };
  });
}
