// Demo content for the public pages (jobs, events, resources, companies, people,
// project showcase, research labs, professors, publications).
//
// Used in two places:
//   1. As a fallback in the browser when the API is unreachable or empty.
//   2. By server/src/seed.js, which writes it into MongoDB.
//
// Jobs, companies and faculty research are REAL (official sources; see each block).
// Events and the project showcase are still illustrative demo content.

import { DEPARTMENTS } from '../utils/departments.js'

const day = 86400000
export const inDays = (n) => new Date(Date.now() + n * day).toISOString().slice(0, 10)
const ago = (n) => new Date(Date.now() - n * day).toISOString()
const dept = (abbr) => DEPARTMENTS.find((d) => d.includes(`(${abbr})`)) || abbr

/* ------------------------------ COMPANIES ------------------------------ */
export const SAMPLE_COMPANIES = [
  // Real employers. `website` is the official site; open roles are listed on their own careers pages.
  { name: 'Grameenphone', domain: 'Telecommunications', location: 'Dhaka', size: '1,000+', about: 'Largest mobile operator in Bangladesh; hires engineers for network, IT and data roles.', website: 'https://www.grameenphone.com/' },
  { name: 'Robi Axiata', domain: 'Telecommunications', location: 'Dhaka', size: '1,000+', about: 'National mobile operator with graduate and trainee engineering programmes.', website: 'https://www.robi.com.bd/' },
  { name: 'Banglalink', domain: 'Telecommunications', location: 'Dhaka', size: '1,000+', about: 'Mobile operator; network, technology and digital roles.', website: 'https://www.banglalink.net/' },
  { name: 'Teletalk Bangladesh', domain: 'Telecommunications', location: 'Dhaka', size: '1,000+', about: 'State-owned mobile operator; recruits through public circulars.', website: 'https://www.teletalk.com.bd/' },
  { name: 'Bangladesh Telecommunications Company (BTCL)', domain: 'Telecommunications', location: 'Dhaka', size: '1,000+', about: 'State telecom company: fixed network, transmission and internet bandwidth.', website: 'https://btcl.gov.bd/' },
  { name: 'Walton Hi-Tech Industries', domain: 'Electronics manufacturing', location: 'Gazipur', size: '1,000+', about: 'Large electronics and appliance manufacturer with R&D, production and maintenance engineering roles.', website: 'https://waltonbd.com/' },
  { name: 'Brain Station 23', domain: 'Software', location: 'Dhaka', size: '500–1,000', about: 'Software development company serving clients worldwide.', website: 'https://brainstation-23.com/' },
  { name: 'Cefalo Bangladesh', domain: 'Software', location: 'Dhaka', size: '200–500', about: 'Software and product development company.', website: 'https://www.cefalo.com/' },
  { name: 'Therap (BD) Ltd.', domain: 'Software', location: 'Dhaka', size: '500–1,000', about: 'Healthcare software company hiring software and QA engineers.', website: 'https://www.therapbd.com/' },
  { name: 'BJIT Group', domain: 'Software & IT services', location: 'Dhaka', size: '500–1,000', about: 'IT services company with software and embedded development.', website: 'https://bjitgroup.com/' },
  { name: 'Bangladesh Power Development Board (BPDB)', domain: 'Power utility', location: 'Dhaka', size: '1,000+', about: 'State power generation and distribution utility; recruits engineers via circulars.', website: 'https://www.bpdb.gov.bd/' },
  { name: 'Power Grid Company of Bangladesh (PGCB)', domain: 'Power transmission', location: 'Dhaka', size: '1,000+', about: 'Operates the national transmission grid.', website: 'https://www.pgcb.gov.bd/' },
  { name: 'DESCO', domain: 'Power distribution', location: 'Dhaka', size: '1,000+', about: 'Dhaka Electric Supply Company: distribution engineering roles.', website: 'https://www.desco.org.bd/' },
  { name: 'Bangladesh Rural Electrification Board (REB)', domain: 'Power distribution', location: 'Dhaka', size: '1,000+', about: 'Rural electrification programme; engineers across Palli Bidyut Samities.', website: 'https://www.reb.gov.bd/' },
  { name: 'Bangladesh Public Service Commission (BPSC)', domain: 'Public service', location: 'Dhaka', size: '—', about: 'Runs BCS recruitment, including technical/engineering cadres.', website: 'https://www.bpsc.gov.bd/' },
  { name: 'RUET (faculty & staff posts)', domain: 'University', location: 'Rajshahi', size: '1,000+', about: 'Official RUET career notices for lecturer and staff positions.', website: 'https://ruet.ac.bd/career' },
]

/* -------------------------------- JOBS --------------------------------- */
const J = (id, d) => ({ _id: `rj${id}`, createdAt: ago(0), external: true, deadline: '', ...d })
// Real hiring sources. Individual vacancies change constantly, so each entry
// points to the employer's own careers/recruitment page. Always read the live
// circular for the exact post, qualification and deadline.
export const SAMPLE_JOBS = [
  J(1, { title: 'Graduate / Trainee Engineer (Network, RF, Transmission)', company: 'Grameenphone', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://www.grameenphone.com/', description: 'Telecom operator careers. Look for graduate and engineering trainee programmes; ETE, EEE and CSE graduates apply.' }),
  J(2, { title: 'Engineering & Technology Roles / Graduate Programme', company: 'Robi Axiata', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://www.robi.com.bd/', description: 'Network, IT and data roles at a national operator. Check the careers section for current openings.' }),
  J(3, { title: 'Network & Technology Engineer Roles', company: 'Banglalink', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://www.banglalink.net/', description: 'Technology and digital roles at a mobile operator. Openings are listed on the company site.' }),
  J(4, { title: 'Assistant Engineer / Technical Posts (public circulars)', company: 'Bangladesh Telecommunications Company (BTCL)', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://btcl.gov.bd/', description: 'State telecom company. Recruitment is announced through official circulars on the website and national newspapers.' }),
  J(5, { title: 'Assistant Engineer (Electrical) and Technical Posts', company: 'Bangladesh Power Development Board (BPDB)', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://www.bpdb.gov.bd/', description: 'Power utility recruitment for EEE graduates. Follow the “Recruitment/Notice” section for live circulars.' }),
  J(6, { title: 'Engineer Recruitment (Transmission)', company: 'Power Grid Company of Bangladesh (PGCB)', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://www.pgcb.gov.bd/', description: 'National transmission grid operator. Engineering posts are announced as circulars on the site.' }),
  J(7, { title: 'Engineer / Technical Recruitment', company: 'DESCO', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://www.desco.org.bd/', description: 'Electricity distribution company. Check the career/notice section.' }),
  J(8, { title: 'Assistant Engineer (Palli Bidyut recruitment)', company: 'Bangladesh Rural Electrification Board (REB)', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://www.reb.gov.bd/', description: 'Rural electrification recruitment. Circulars are published on the REB website.' }),
  J(9, { title: 'BCS (Technical) and other engineering cadre posts', company: 'Bangladesh Public Service Commission (BPSC)', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Nationwide', link: 'https://www.bpsc.gov.bd/', description: 'Government recruitment for engineers through BCS. Circulars, syllabus and results are on the BPSC site.' }),
  J(10, { title: 'Software Engineer / QA Engineer roles', company: 'Brain Station 23', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://brainstation-23.com/', description: 'Software company with regular fresh-graduate hiring. See the Careers page for live roles.' }),
  J(11, { title: 'Software Engineer roles (incl. internships)', company: 'Cefalo Bangladesh', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://www.cefalo.com/', description: 'Product and software development roles; check the careers section for current openings.' }),
  J(12, { title: 'Software Engineer and QA Engineer roles', company: 'Therap (BD) Ltd.', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://www.therapbd.com/', description: 'Healthcare software company; look for current openings on the careers page.' }),
  J(13, { title: 'Software and embedded engineering roles', company: 'BJIT Group', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Dhaka', link: 'https://bjitgroup.com/', description: 'IT services with software and embedded teams. Openings are on the company site.' }),
  J(14, { title: 'R&D / Production / Maintenance Engineer', company: 'Walton Hi-Tech Industries', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Gazipur', link: 'https://waltonbd.com/', description: 'Electronics and appliance manufacturer with R&D and production engineering roles. Check the career section.' }),
  J(15, { title: 'Lecturer and staff positions (official notices)', company: 'RUET', category: 'Job', type: 'Full-time', experience: 'Entry-level', location: 'Rajshahi', link: 'https://ruet.ac.bd/career', description: 'Official RUET recruitment circulars for teaching and staff posts.' }),
  J(16, { title: 'Search all current engineering vacancies', company: 'BDJobs', category: 'Job', type: 'Full-time', experience: 'All levels', location: 'Bangladesh', link: 'https://jobs.bdjobs.com/', description: 'Bangladesh’s largest job board. Filter by Engineering/Telecommunication, fresher level and location to find live vacancies and internships.' }),
]

/* ------------------------------- EVENTS -------------------------------- */
const E = (id, d) => ({ _id: `se${id}`, status: 'Approved', createdAt: ago(id), ...d })
export const SAMPLE_EVENTS = [
  E(1, { title: 'Study Abroad Info Session: Germany & Japan', organizer: 'Career Hub + alumni', type: 'Seminar', date: inDays(8), venue: 'Central Auditorium', description: 'Alumni talk through SOPs, supervisor emails and the scholarship timeline.' }),
  E(2, { title: 'RUET Career Fair', organizer: 'Career Hub', type: 'Job fair', date: inDays(21), venue: 'Sports Complex', description: 'Twenty companies, on-the-spot interviews. Bring printed CVs.' }),
  E(3, { title: 'Embedded Systems Workshop', organizer: 'ETE Department', type: 'Workshop', date: inDays(14), venue: 'ETE Lab 2', description: 'Hands-on session with microcontrollers and sensor interfacing.' }),
  E(4, { title: 'Inter-University Hackathon', organizer: 'CSE Society', type: 'Hackathon', date: inDays(35), venue: 'CSE Building', description: '24-hour build for teams of up to four. Prizes for the top three.' }),
  E(5, { title: 'Resume Clinic with Alumni', organizer: 'Career Hub', type: 'Workshop', date: inDays(-6), venue: 'Seminar Room 3', description: 'Past event: one-to-one CV reviews with alumni from industry.' }),
  E(6, { title: 'Renewable Energy Seminar', organizer: 'EEE Department', type: 'Seminar', date: inDays(18), venue: 'EEE Seminar Hall', description: 'Solar, storage and grid integration, with a Q&A from practising engineers.' }),
  E(7, { title: 'Robotics Expo', organizer: 'ME Department', type: 'Exhibition', date: inDays(45), venue: 'ME Workshop', description: 'Student-built robots and a line-follower race.' }),
  E(8, { title: 'IELTS & GRE Prep Bootcamp', organizer: 'Career Hub', type: 'Workshop', date: inDays(5), venue: 'Library Seminar Room', description: 'Two-day crash course on test strategy for scholarship applicants.' }),
  E(9, { title: 'Alumni Homecoming & Networking Night', organizer: 'Alumni Association', type: 'Networking', date: inDays(60), venue: 'Central Field', description: 'Meet graduates working across Bangladesh and abroad.' }),
]

export const SAMPLE_RESOURCES = [] // real resources now live in careerResources.js

/* -------------------------------- PEOPLE ------------------------------- */
export const SAMPLE_PEOPLE = [] // replaced by real RUET data in realPeople.js

// The project showcase fills from real student submissions (Student → Projects → Showcase).
export const SAMPLE_PROJECTS = []

/* ----------------------------- RESEARCH LABS --------------------------- */
import { REAL_FACULTY } from './realPeople.js'

// Real: ETE faculty research areas and publications from the department website.
export const SAMPLE_LABS = []
export const SAMPLE_PROFESSORS = REAL_FACULTY.filter((f) => f.researchAreas.length).map((f) => ({
  _id: f._id, name: f.name, title: f.designation, department: f.department, interests: f.researchAreas.join(', '), photoUrl: f.photoUrl, email: f.email, officialProfile: f.officialProfile,
}))
export const SAMPLE_PUBLICATIONS = REAL_FACULTY.flatMap((f) => f.publications.map((p) => ({ ...p, authors: p.authors, venue: p.venue, link: p.link })))
