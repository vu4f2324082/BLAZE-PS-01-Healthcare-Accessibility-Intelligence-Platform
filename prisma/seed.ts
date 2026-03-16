import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const FEATURE_KEYS = [
  'wheelchair_ramp', 'elevator', 'accessible_restroom', 'braille_signage',
  'tactile_path', 'wide_doorway', 'adjustable_exam_table',
  'sign_language_interpreter', 'priority_queue', 'disabled_parking'
] as const;

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

const TYPES = ['Hospital', 'Clinic', 'Diagnostic_Center'] as const;

function randomBool(probability = 0.6) {
  return Math.random() < probability;
}

function calcScore(features: Record<string, boolean>) {
  const trueCount = FEATURE_KEYS.filter(f => features[f]).length;
  return Math.round((trueCount / FEATURE_KEYS.length) * 100);
}

async function main() {
  console.log('🌱 Seeding database with 50 accessible healthcare facilities...');

  // Clean slate
  await prisma.review.deleteMany();
  await prisma.issueReport.deleteMany();
  await prisma.facilityAccessibility.deleteMany();
  await prisma.facility.deleteMany();

  for (let i = 0; i < 50; i++) {
    const locality = LOCALITIES[Math.floor(Math.random() * LOCALITIES.length)];
    const baseName = FACILITY_NAMES[Math.floor(Math.random() * FACILITY_NAMES.length)];
    const type = TYPES[Math.floor(Math.random() * TYPES.length)];

    const features = Object.fromEntries(FEATURE_KEYS.map(k => [k, randomBool()])) as Record<string, boolean>;
    const score = calcScore(features);

    const facility = await prisma.facility.create({
      data: {
        name: `${baseName} ${locality}`,
        type,
        address: `${Math.floor(Math.random() * 500) + 1}, SV Road, ${locality}, Mumbai`,
        contact: `+91 22 ${Math.floor(Math.random() * 90000000) + 10000000}`,
        lat: 18.9 + Math.random() * 0.3,
        lng: 72.8 + Math.random() * 0.1,
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        accessibility_score: score,
        verified: Math.random() > 0.3,
        photos: [
          'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
          'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800'
        ],
        services: ['General Consultation', 'Emergency', 'Radiology'].slice(0, Math.floor(Math.random() * 3) + 1),
      }
    });

    await prisma.facilityAccessibility.create({
      data: {
        facility_id: facility.id,
        ...(features as any)
      }
    });

    // Seed 1-3 sample reviews per facility
    const reviewCount = Math.floor(Math.random() * 3) + 1;
    for (let r = 0; r < reviewCount; r++) {
      await prisma.review.create({
        data: {
          facility_id: facility.id,
          user_name: ['Anonymous', 'Riya M.', 'Arjun K.', 'Priya S.', null][Math.floor(Math.random() * 5)] as any,
          submitter_ip_hash: `${Math.random().toString(36).substring(2, 15)}hash`,
          rating: Math.floor(Math.random() * 3) + 3,
          comment: [
            'Excellent wheelchair ramps and helpful staff.',
            'Good accessibility but restrooms need improvement.',
            'Sign language support was very helpful for my family member.',
            'Tactile paths made navigation much easier.',
            'Priority queue for disabled patients was great.',
          ][Math.floor(Math.random() * 5)],
        }
      });
    }
  }

  console.log('✅ Seeded 50 facilities with accessibility data and reviews!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
