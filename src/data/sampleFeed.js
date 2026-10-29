// Fallback content for the home page when the API can't be reached.
import { SAMPLE_SCHOLARSHIPS } from './sampleScholarships.js'

const day = 86400000
const inDays = (n) => new Date(Date.now() + n * day).toISOString().slice(0, 10)
const ago = (n) => new Date(Date.now() - n * day).toISOString()

export const SAMPLE_FEED = {
  isSample: true,
  notices: [
    { _id: 'n1', title: 'Circular: Final-year project proposal submission', createdAt: ago(1), faculty: { name: 'Dr. Abdul Karim', department: 'Computer Science & Engineering (CSE)' } },
    { _id: 'n2', title: 'Circular: Recommendation letters for foreign scholarships', createdAt: ago(3), faculty: { name: 'Dr. Salma Akter', department: 'Electronics & Telecommunication Engineering (ETE)' } },
    { _id: 'n3', title: 'Notice: Industry visit to Dhaka tech park', createdAt: ago(5), faculty: { name: 'Dr. Abdul Karim', department: 'Computer Science & Engineering (CSE)' } },
  ],
  jobs: [
    { _id: 'j1', title: 'Junior VLSI Design Engineer', company: 'NextWave Semiconductors', category: 'Job', type: 'Full-time', location: 'Dhaka' },
    { _id: 'j2', title: 'Embedded Firmware Intern', company: 'NextWave Semiconductors', category: 'Internship', type: 'Internship', location: 'Dhaka' },
    { _id: 'j3', title: 'RF Network Engineer', company: 'Orbit Telecom', category: 'Job', type: 'Full-time', location: 'Rajshahi' },
    { _id: 'j4', title: 'Backend Engineer (Node.js)', company: 'Vertex Systems', category: 'Job', type: 'Full-time', location: 'Remote' },
  ],
  events: [
    { _id: 'e1', title: 'Study Abroad Info Session: Germany & Japan', type: 'Seminar', date: inDays(8), venue: 'Central Auditorium' },
    { _id: 'e2', title: 'RUET Career Fair 2026', type: 'Job fair', date: inDays(21), venue: 'Sports Complex' },
    { _id: 'e3', title: 'Embedded Systems Workshop', type: 'Workshop', date: inDays(14), venue: 'ETE Lab 2' },
  ],
  scholarships: SAMPLE_SCHOLARSHIPS,
  counts: { jobs: 7, scholarships: SAMPLE_SCHOLARSHIPS.length, people: 120 },
}
