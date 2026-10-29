/*
 * REAL people shown in the directory.
 *
 * FACULTY — copied from the Department of ETE, RUET website (ete.ruet.ac.bd,
 * "Faculty Short Info" page): name, designation, official email, photo and
 * profile link. Bios, research areas and publications are included where the
 * individual profile page was read (see ruetFacultyDetails.json); for everyone
 * else the card links to their official profile, which has the full list.
 * Personal mobile numbers are deliberately not copied.
 *
 * STUDENTS — the ETE 8th-semester roster you supplied. ONLY name, student ID
 * and the derived department/batch are used. Parents' names, phone numbers,
 * religion and gender in that sheet are NOT imported. These are "unclaimed"
 * entries: they can't be messaged until the student creates an account.
 */
import faculty from './ruetFaculty.json' with { type: 'json' }
import details from './ruetFacultyDetails.json' with { type: 'json' }
import roster from './eteRoster.json' with { type: 'json' }

const ETE = 'Electronics & Telecommunication Engineering (ETE)'
const BASE = 'https://www.ete.ruet.ac.bd'

export const REAL_FACULTY = faculty.map(([name, designation, email, slug, photo, office]) => {
  const d = details[slug] || {}
  const key = decodeURIComponent(slug).toLowerCase().replace(/[^a-z0-9]+/g, '-')
  return {
    _id: `fac-${key}`,
    name,
    role: 'Faculty',
    department: ETE,
    designation,
    email,
    office,
    photoUrl: photo ? `${BASE}/public/storage/profile/${photo}` : '',
    officialProfile: `${BASE}/${slug}`,
    headline: d.headline || `${designation}, Dept. of ETE, RUET`,
    bio: d.bio || '',
    education: d.education || [],
    researchAreas: d.researchAreas || [],
    contactLinks: { website: d.links?.website || '' },
    academicLinks: d.links || {},
    publications: (d.publications || []).map((p, i) => ({ _id: `${key}-p${i}`, ...p })),
    hasFullDetails: Boolean(d.bio),
    isReal: true,
  }
})

const batchOf = (id) => `20${String(id).slice(0, 2)}`
export const REAL_STUDENTS = roster.map(([id, name]) => ({
  _id: `stu-${id}`,
  name,
  role: 'Student',
  department: ETE,
  studentId: id,
  headline: `ETE · Batch ${batchOf(id)} · 8th semester`,
  studentProfile: { batch: batchOf(id) },
  unclaimed: true,
  isReal: true,
}))

export const REAL_PEOPLE = [...REAL_FACULTY, ...REAL_STUDENTS]
export const findRealPerson = (id) => REAL_PEOPLE.find((p) => p._id === id)
