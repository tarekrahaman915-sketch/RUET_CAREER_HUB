import 'dotenv/config'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import { connectDB } from './config/db.js'
import User from './models/User.js'
import Job from './models/Job.js'
import Event from './models/Event.js'
import Notice from './models/Notice.js'
import ResearchOpportunity from './models/ResearchOpportunity.js'
import Mentor from './models/Mentor.js'
import CareerTip from './models/CareerTip.js'
import SuccessStory from './models/SuccessStory.js'
import Project from './models/Project.js'
import Application from './models/Application.js'
import Scholarship from './models/Scholarship.js'
import ScholarshipTracker from './models/ScholarshipTracker.js'
import RecommendedStudent from './models/RecommendedStudent.js'
import RecommendedInternship from './models/RecommendedInternship.js'
import Resource from './models/Resource.js'
import VerifiedCompany from './models/VerifiedCompany.js'
import fs from 'fs'
import path from 'path'

// Creates the Admin account plus a full set of demo accounts and content so
// every page has something to show.
//
//   npm run seed          adds anything that's missing (safe to re-run)
//   npm run seed -- --reset   wipes the demo content first, then re-seeds
//
// All demo accounts share the password below (admin has its own).

const DEMO_PASSWORD = process.env.SEED_DEMO_PASSWORD || 'demo12345'
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || 'admin@ruet.ac.bd'
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || 'admin12345'

const CSE = 'Computer Science & Engineering (CSE)'
const EEE = 'Electrical & Electronic Engineering (EEE)'
const ETE = 'Electronics & Telecommunication Engineering (ETE)'
const ME = 'Mechanical Engineering (ME)'

const day = 86400000
const inDays = (n) => new Date(Date.now() + n * day).toISOString().slice(0, 10)

const ACCOUNTS = [
  // Students
  {
    name: 'Rafi Ahmed', email: 'rafi.student@ruet.ac.bd', role: 'Student', department: CSE,
    headline: 'CSE student · embedded ML · aiming for a Masters in Germany',
    bio: 'Building small, efficient ML models that run on microcontrollers. Looking for research internships and DAAD opportunities.',
    contactLinks: { linkedin: 'https://linkedin.com/in/example-rafi', github: 'https://github.com/example-rafi' },
    careerPath: { primary: 'ai-ml', interests: ['software', 'research'] },
    publications: [{ title: 'Lightweight Leaf-Disease Classification on Low-Cost Microcontrollers', authors: 'R. Ahmed, T. Akter', venue: 'RUET Undergraduate Research Symposium', year: '2026', link: 'https://example.com/papers/leaf-disease', type: 'Conference' }],
    studentProfile: {
      studentId: '2003041', semester: '7th', batch: '2020', gpa: '3.62',
      researchInterest: 'Machine learning for embedded devices', careerInterest: 'Software engineering, higher studies in Germany',
      skills: ['React', 'Node.js', 'Python', 'TensorFlow Lite', 'C++'], languages: ['Bangla', 'English'],
      certifications: [{ name: 'Deep Learning Specialization', issuer: 'Coursera', date: '2026-03', link: '' }],
      portfolio: { github: 'https://github.com/example-rafi', linkedin: 'https://linkedin.com/in/example-rafi', website: '' },
    },
  },
  {
    name: 'Nusrat Jahan', email: 'nusrat.student@ruet.ac.bd', role: 'Student', department: EEE,
    studentProfile: {
      studentId: '2001012', semester: '8th', batch: '2019', gpa: '3.81',
      researchInterest: 'Power electronics and renewable energy', careerInterest: 'Masters in Japan or Sweden',
      skills: ['MATLAB', 'Simulink', 'PCB design', 'Power systems'], languages: ['Bangla', 'English', 'Japanese (basic)'],
      certifications: [{ name: 'IELTS Academic 7.5', issuer: 'British Council', date: '2026-01', link: '' }],
      portfolio: { github: '', linkedin: 'https://linkedin.com/in/example-nusrat', website: '' },
    },
  },
  {
    name: 'Imran Hossain', email: 'imran.student@ruet.ac.bd', role: 'Student', department: ETE,
    studentProfile: {
      studentId: '2102033', semester: '5th', batch: '2021', gpa: '3.45',
      researchInterest: 'Antenna design', careerInterest: 'Telecom industry',
      skills: ['HFSS', 'Embedded C', 'Arduino'], languages: ['Bangla', 'English'],
    },
  },
  // Alumni
  {
    name: 'Tanvir Rahman', email: 'tanvir.alumni@ruet.ac.bd', role: 'Alumni', department: CSE,
    headline: 'Senior Software Engineer at Vertex Systems',
    bio: 'RUET CSE alumnus. Six years building backend and cloud systems; I run mock interviews for juniors.',
    contactLinks: { linkedin: 'https://linkedin.com/in/example-tanvir', github: 'https://github.com/example-tanvir' },
    careerPath: { primary: 'software', interests: ['cloud'] },
    alumniProfile: {
      jobPosition: { position: 'Senior Software Engineer', company: 'Vertex Systems', experience: '6 years' },
      mentor: { isMentor: true, bio: 'Backend and cloud. Happy to review CVs and run mock technical interviews.', expertise: ['Backend', 'System design', 'Interview prep'] },
    },
  },
  {
    name: 'Sadia Islam', email: 'sadia.alumni@ruet.ac.bd', role: 'Alumni', department: EEE,
    headline: 'PhD researcher, TU Munich · DAAD scholar',
    bio: 'Power electronics researcher. Happy to review SOPs and supervisor emails for RUET students applying abroad.',
    contactLinks: { linkedin: 'https://linkedin.com/in/example-sadia' },
    careerPath: { primary: 'research', interests: ['power-energy'] },
    publications: [
      { title: 'A Compact MPPT Controller for Low-Irradiance Solar Systems', authors: 'S. Islam, M. Karim', venue: 'IEEE Access', year: '2025', link: 'https://example.com/papers/mppt-low-irradiance', type: 'Journal' },
      { title: 'Efficiency Trade-offs in Wide-Bandgap DC-DC Converters', authors: 'S. Islam', venue: 'ECCE Europe', year: '2026', link: 'https://example.com/papers/wbg-dcdc', type: 'Conference' },
    ],
    alumniProfile: {
      jobPosition: { position: 'PhD Researcher', company: 'TU Munich', experience: '3 years' },
      mentor: { isMentor: true, bio: 'DAAD scholar, now doing a PhD in Germany. Ask me about SOPs, supervisor emails and the DAAD process.', expertise: ['Study abroad', 'DAAD', 'Research proposals'] },
    },
  },
  // Faculty
  {
    name: 'Dr. Abdul Karim', email: 'karim.faculty@ruet.ac.bd', role: 'Faculty', department: CSE,
    headline: 'Professor, CSE · machine learning and embedded systems',
    bio: 'Supervises undergraduate theses in applied ML and IoT. Open to students with a clear research question.',
    contactLinks: { website: 'https://example.com/~karim' },
    publications: [{ title: 'Edge Inference for Smart Agriculture: A Survey', authors: 'A. Karim', venue: 'Computers and Electronics in Agriculture', year: '2024', link: 'https://example.com/papers/edge-agri-survey', type: 'Journal' }],
  },
  { name: 'Dr. Salma Akter', email: 'salma.faculty@ruet.ac.bd', role: 'Faculty', department: ETE },
  // Recruiters
  { name: 'Farhana Chowdhury', email: 'hr@nextwave.example', role: 'Recruiter', department: '', companyProfile: { companyName: 'NextWave Semiconductors' } },
  { name: 'Shakil Mahmud', email: 'hr@orbittelecom.example', role: 'Recruiter', department: '', companyProfile: { companyName: 'Orbit Telecom' } },
]

async function wipeDemoContent() {
  await Promise.all([
    Job.deleteMany({}), Event.deleteMany({}), Notice.deleteMany({}), ResearchOpportunity.deleteMany({}),
    Mentor.deleteMany({}), CareerTip.deleteMany({}), SuccessStory.deleteMany({}), Project.deleteMany({}),
    Application.deleteMany({}), Scholarship.deleteMany({}), ScholarshipTracker.deleteMany({}),
    RecommendedStudent.deleteMany({}), RecommendedInternship.deleteMany({}),
    Resource.deleteMany({}), VerifiedCompany.deleteMany({}),
    User.deleteMany({ email: { $regex: /@(ruet\.ac\.bd|[a-z0-9-]+\.example)$/ }, role: { $ne: 'Admin' } }),
  ])
  console.log('Cleared demo content.')
}

async function seed() {
  await connectDB()
  const reset = process.argv.includes('--reset')
  if (reset) await wipeDemoContent()

  // ---- Admin ----
  if (!(await User.findOne({ email: ADMIN_EMAIL }))) {
    await User.create({
      name: 'Platform Admin', email: ADMIN_EMAIL, role: 'Admin', department: '', status: 'Active',
      passwordHash: await bcrypt.hash(ADMIN_PASSWORD, 10),
    })
    console.log(`Admin created — ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  }
  const admin = await User.findOne({ email: ADMIN_EMAIL })

  // ---- Demo accounts (already Active, so you can sign in straight away) ----
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10)
  const byEmail = {}
  for (const acc of ACCOUNTS) {
    let user = await User.findOne({ email: acc.email })
    if (!user) user = await User.create({ ...acc, passwordHash, status: 'Active' })
    byEmail[acc.email] = user
  }
  // ---- More people + one recruiter per company, generated from the shared sample data ----
  const { SAMPLE_PEOPLE, SAMPLE_COMPANIES, SAMPLE_JOBS, SAMPLE_EVENTS, SAMPLE_RESOURCES, SAMPLE_PROJECTS } = await import('../../src/data/sampleData.js')
  const slug = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, '')
  const knownNames = new Set(ACCOUNTS.map((a) => a.name))
  for (const p of SAMPLE_PEOPLE) {
    if (knownNames.has(p.name)) continue
    const first = slug(p.name.replace(/^Dr\.\s*/, '').split(' ')[0])
    const email = `${first}.${p.role.toLowerCase()}@ruet.ac.bd`
    if (await User.findOne({ email })) { byEmail[email] = await User.findOne({ email }); continue }
    const { _id, ...rest } = p
    byEmail[email] = await User.create({ ...rest, email, passwordHash, status: 'Active' })
  }
  const recruiterFor = {}
  for (const c of SAMPLE_COMPANIES) {
    const email = c.name === 'NextWave Semiconductors' ? 'hr@nextwave.example' : c.name === 'Orbit Telecom' ? 'hr@orbittelecom.example' : `hr@${slug(c.name)}.example`
    let u = byEmail[email] || (await User.findOne({ email }))
    if (!u && c.name !== 'Vertex Systems') u = await User.create({ name: `${c.name} HR`, email, passwordHash, role: 'Recruiter', department: '', status: 'Active', companyProfile: { companyName: c.name } })
    if (u) { byEmail[email] = u; recruiterFor[c.name] = u }
  }

  const [rafi, nusrat] = [byEmail['rafi.student@ruet.ac.bd'], byEmail['nusrat.student@ruet.ac.bd']]
  const [tanvir, sadia] = [byEmail['tanvir.alumni@ruet.ac.bd'], byEmail['sadia.alumni@ruet.ac.bd']]
  const [karim, salma] = [byEmail['karim.faculty@ruet.ac.bd'], byEmail['salma.faculty@ruet.ac.bd']]
  const [nextwave, orbit] = [byEmail['hr@nextwave.example'], byEmail['hr@orbittelecom.example']]

  // Only fill content collections that are empty, so re-running never duplicates.
  const empty = async (Model) => (await Model.countDocuments()) === 0

  if (await empty(Mentor)) {
    const alumni = await User.find({ role: 'Alumni', 'alumniProfile.mentor.isMentor': true })
    for (const a of alumni) {
      await Mentor.create({
        alumni: a._id, name: a.name, company: a.alumniProfile.jobPosition.company,
        position: a.alumniProfile.jobPosition.position, bio: a.alumniProfile.mentor.bio,
        expertise: a.alumniProfile.mentor.expertise,
      })
    }
  }

  let jobs = []
  if (await empty(Job)) {
    jobs = await Job.insertMany(
      SAMPLE_JOBS.map(({ _id, createdAt, ...j }) => {
        const poster = recruiterFor[j.company]
        return { ...j, postedBy: (poster || tanvir)._id, postedByRole: poster ? 'Recruiter' : 'Alumni', createdAt: new Date(createdAt) }
      })
    )
  }

  if (jobs.length) {
    await Application.create([
      { student: rafi._id, job: jobs[1]._id, status: 'Shortlisted' },
      { student: rafi._id, job: jobs[4]._id, status: 'Applied' },
      { student: nusrat._id, job: jobs[0]._id, status: 'Interview scheduled', interview: { date: inDays(5), time: '11:00', link: 'https://meet.example/nextwave-interview' } },
    ])
  }

  if (await empty(Event)) {
    const hosts = [karim, salma]
    await Event.insertMany(
      SAMPLE_EVENTS.map(({ _id, createdAt, ...e }, i) => ({ ...e, createdBy: hosts[i % 2]._id, createdAt: new Date(createdAt) }))
    )
    // One pending event so the faculty approval screen has something to approve
    await Event.create({ title: 'Cybersecurity Awareness Day (awaiting approval)', organizer: 'CSE Society', type: 'Seminar', date: inDays(50), venue: 'CSE Building', description: 'Pending example for the approval screen.', status: 'Pending', createdBy: karim._id })
  }

  if (await empty(Notice)) {
    await Notice.insertMany([
      { faculty: karim._id, title: 'Circular: Final-year project proposal submission', content: 'All 7th-semester students must submit their project proposals to the department office by the end of next week.' },
      { faculty: salma._id, title: 'Circular: Recommendation letters for foreign scholarships', content: 'Students applying for scholarships abroad should request recommendation letters at least ten days before the deadline.' },
      { faculty: karim._id, title: 'Notice: Industry visit to Dhaka tech park', content: 'Registration for the one-day industry visit opens on Sunday. Seats are limited to 40.' },
      { faculty: salma._id, title: 'Circular: Internship credit rules updated', content: 'Internships of eight weeks or more now count towards the industrial attachment requirement.' },
    ])
  }

  if (await empty(ResearchOpportunity)) {
    await ResearchOpportunity.insertMany([
      { faculty: salma._id, title: 'Undergraduate RA: 5G antenna arrays', description: 'Looking for two students with HFSS or CST experience for a conference-paper project.', deadline: inDays(25) },
      { faculty: karim._id, title: 'Thesis topics in computer vision', description: 'Several open topics on low-power vision for agriculture. Python and PyTorch preferred.', deadline: inDays(40) },
    ])
  }

  if (await empty(CareerTip)) {
    await CareerTip.insertMany([
      { alumni: tanvir._id, title: 'Three projects beat ten certificates', content: 'Recruiters read your GitHub before your certificates. Ship small, finished projects and write a clear README for each.' },
      { alumni: sadia._id, title: 'Email supervisors before you apply', content: 'For PhD and research master’s applications, a short, specific email to a professor often decides whether your application is read at all.' },
    ])
  }

  if (await empty(SuccessStory)) {
    await SuccessStory.insertMany([
      { alumni: sadia._id, title: 'From RUET EEE to a PhD in Munich', content: 'I applied to DAAD in my final year with a half-finished thesis and two recommendation letters. It took two rounds, but the second time my research plan was much sharper.' },
      { alumni: tanvir._id, title: 'My first job came from an alumni referral', content: 'A senior from my department forwarded my CV. That one email is why I now try to refer juniors every hiring cycle.' },
    ])
  }

  if (await empty(Project)) {
    const students = await User.find({ role: 'Student' })
    const byName = Object.fromEntries(students.map((u) => [u.name, u]))
    const docs = SAMPLE_PROJECTS.filter((p) => byName[p.student.name]).map(({ _id, student, ...p }) => ({ ...p, student: byName[student.name]._id, showcase: true }))
    await Project.insertMany(docs)
  }

  // ---- Resource library: placeholder text files so Download works ----
  if (await empty(Resource)) {
    const dir = path.resolve('uploads')
    fs.mkdirSync(dir, { recursive: true })
    const docs = SAMPLE_RESOURCES.map((r, i) => {
      const fileName = `${slug(r.title).slice(0, 40) || 'resource'}.txt`
      const storedAs = `seed-${i + 1}-${fileName}`
      const body = `${r.title}\n${r.type} · ${r.department}\n\nThis is a placeholder file created by the seed script. Upload a real file from the Resources page as Faculty or Admin.\n`
      fs.writeFileSync(path.join(dir, storedAs), body)
      return { title: r.title, type: r.type, department: r.department, uploadedBy: (i % 2 ? salma : karim)._id, fileName, storedAs, size: Buffer.byteLength(body) }
    })
    await Resource.insertMany(docs)
  }

  // ---- Admin-verified companies ----
  if (await empty(VerifiedCompany)) {
    await VerifiedCompany.insertMany(SAMPLE_COMPANIES.slice(0, 6).map((c) => ({ name: c.name })))
  }

  if (await empty(RecommendedStudent)) {
    await RecommendedStudent.create({ faculty: karim._id, studentName: 'Rafi Ahmed', recommendedFor: 'Software engineering internships', reason: 'Top of the class in algorithms and consistently delivers on team projects.' })
  }
  if (await empty(RecommendedInternship)) {
    await RecommendedInternship.create({ faculty: salma._id, title: 'RF lab internship', company: 'Orbit Telecom', description: 'Two-month placement in the RF planning team.', deadline: inDays(18) })
  }

  // ---- Scholarships (same list the frontend uses as its fallback) ----
  let scholarships = []
  if (await empty(Scholarship)) {
    const { SAMPLE_SCHOLARSHIPS } = await import('../../src/data/sampleScholarships.js')
    const posters = [admin, sadia, karim]
    scholarships = await Scholarship.insertMany(
      SAMPLE_SCHOLARSHIPS.map(({ _id, ...s }, i) => {
        const poster = posters[i % posters.length]
        return { ...s, postedBy: poster._id, postedByRole: poster.role }
      })
    )
  }
  if (scholarships.length) {
    await ScholarshipTracker.create([
      { student: nusrat._id, scholarship: scholarships[2]._id, status: 'Preparing', note: 'Need a supervisor reply and IELTS copy.' },
      { student: nusrat._id, scholarship: scholarships[4]._id, status: 'Saved' },
      { student: rafi._id, scholarship: scholarships[1]._id, status: 'Preparing', note: 'Draft motivation letter by next week.' },
    ])
  }

  console.log('\nDemo data ready. Sign in with:')
  console.log(`  Admin      ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
  for (const a of ACCOUNTS) console.log(`  ${a.role.padEnd(9)}  ${a.email} / ${DEMO_PASSWORD}`)
  console.log(`  (plus ${Object.keys(byEmail).length - ACCOUNTS.length} more students, alumni, faculty and recruiters, same password)`)
  console.log('\nChange the admin password before putting this anywhere public.')

  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
