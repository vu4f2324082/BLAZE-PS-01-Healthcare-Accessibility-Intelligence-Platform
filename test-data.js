import { generateMockFacilities } from './src/lib/mockData.js';

try {
  const data = generateMockFacilities(10);
  console.log('SUCCESS: Generated facilities:');
  data.forEach(f => console.log(`- ${f.name} (${f.accessibility_score}%)`));
  if (data.length === 10) {
    console.log('COUNT_MATCH: Generated exactly 10 facilities.');
  } else {
    console.log(`COUNT_MISMATCH: Expected 10, got ${data.length}`);
  }
} catch (err) {
  console.error('FAILURE:', err);
  process.exit(1);
}
