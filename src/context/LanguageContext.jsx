import { createContext, useContext, useEffect, useState } from 'react'

const STORAGE_KEY = 'ruet_lang'

// Deep translation of every page isn't practical yet — this covers the
// highest-visibility text (nav, hero, footer, auth forms) so the toggle is
// genuinely useful without overclaiming full localization. Dashboard pages
// remain in English for now.
const STRINGS = {
  en: {
    nav_jobs: 'Jobs',
    nav_events: 'Events',
    nav_research: 'Research',
    nav_resources: 'Resources',
    nav_companies: 'Companies',
    nav_about: 'About',
    nav_signIn: 'Sign in',
    nav_createProfile: 'Create profile',

    nav_studyAbroad: 'Study abroad',
    nav_people: 'People',
    nav_mentors: 'Mentors',
    nav_careers: 'Careers',
    nav_roadmaps: 'Roadmaps',

    hero_eyebrow: 'RUET career platform, open to every department',
    hero_headline: 'Find your next job, lab or scholarship.',
    hero_sub: 'RUET students, alumni, faculty and recruiters in one place: job openings, mentors, research projects and funded study abroad.',
    hero_cta1: 'Create your profile',
    hero_cta2: 'Explore study abroad',

    find_label: 'What are you looking for?',
    find_jobs: 'Jobs',
    find_study: 'Study abroad',
    find_events: 'Events',
    find_ph_jobs: 'Job title, company or skill',
    find_ph_study: 'Country, field or scholarship name',
    find_ph_events: 'Event name or type',
    find_go: 'Search',

    slide_campus_t: 'Hiring from campus',
    slide_campus_d: 'Jobs and internships from companies that recruit at RUET.',
    slide_abroad_t: 'Study abroad',
    slide_abroad_d: 'Funded masters and PhD options across many countries.',
    slide_research_t: 'Research and labs',
    slide_research_d: 'Join a faculty project or find a supervisor.',
    slide_mentor_t: 'Alumni mentors',
    slide_mentor_d: 'Book a session with someone who has done it.',
    slide_depts_t: 'All 18 departments',
    slide_depts_d: 'From Architecture to CSE, one board for the whole campus.',
    float_daysLeft: 'days left',
    float_latestCircular: 'Latest circular',
    float_openRoles: 'open roles',

    abroad_title: 'Study abroad, from shortlist to departure',
    abroad_sub: 'Browse scholarships posted by faculty and alumni, track your applications, and ask alumni who already made the move.',
    abroad_step1: 'Shortlist',
    abroad_step1d: 'Filter by country, level and funding.',
    abroad_step2: 'Prepare',
    abroad_step2d: 'Recommendation letters, test scores, SOP.',
    abroad_step3: 'Apply',
    abroad_step3d: 'Track every deadline in one list.',
    abroad_step4: 'Depart',
    abroad_step4d: 'Visa, travel and a mentor on the other side.',
    abroad_closing: 'Closing soon',
    abroad_all: 'See all scholarships',
    abroad_mentors: 'Talk to alumni abroad',

    board_title: 'Latest on the board',
    board_circulars: 'Circulars',
    board_jobs: 'Jobs and internships',
    board_events: 'Events',
    board_viewAll: 'View all',
    board_empty: 'Nothing posted yet.',
    board_sample: 'Showing sample content. Start the server and run the seed script to see live data.',

    stats_title: 'The board right now',
    stats_members: 'Active members',
    stats_jobs: 'Open jobs and internships',
    stats_scholarships: 'Scholarships listed',
    stats_departments: 'Departments covered',

    cta_title: 'Start with a profile. The rest follows.',
    cta_primary: 'Create your profile',
    cta_secondary: 'Post a job as a recruiter',

    footer_tagline: 'Connecting RUET students, alumni, industry & research under one platform.',
    footer_portals: 'Portals',
    footer_platform: 'Platform',
    footer_resources: 'Resources',
    footer_department: 'Department',
    footer_student: 'Student',
    footer_alumni: 'Alumni',
    footer_faculty: 'Faculty',
    footer_recruiter: 'Recruiter',
    footer_jobPortal: 'Job Portal',
    footer_researchHub: 'Research Hub',
    footer_mentorship: 'Mentorship',
    footer_aiTools: 'AI Tools',
    footer_resourceLibrary: 'Resource Library',
    footer_companyDirectory: 'Company Directory',
    footer_events: 'Events',
    footer_circulars: 'Circulars',
    footer_aboutRuet: 'About RUET',
    footer_contact: 'Contact',
    footer_adminLogin: 'Admin login',
    footer_copyright: '© 2026 RUET Carrier HUB — Rajshahi University of Engineering & Technology',
    footer_tagline2: 'Built on one circuit.',

    auth_signInTitle: 'Sign in',
    auth_signInSub: 'Welcome back to RUET Carrier HUB.',
    auth_signInAs: 'Sign in as',
    auth_email: 'University email',
    auth_password: 'Password',
    auth_signInBtn: 'Sign in →',
    auth_forgotPassword: 'Forgot password?',
    auth_newHere: 'New here?',
    auth_createProfileLink: 'Create a profile',

    auth_registerTitle: 'Create your profile',
    auth_registerSub: 'Join the board as a student, alumnus, faculty member, or recruiter.',
    auth_fullName: 'Full name',
    auth_iAmA: 'I am a',
    auth_registerBtn: 'Create profile →',
    auth_alreadyHave: 'Already have an account?',
    auth_signInLink: 'Sign in',

    role_student: 'Student',
    role_alumni: 'Alumni',
    role_faculty: 'Faculty',
    role_recruiter: 'Recruiter',
    role_admin: 'Admin',
  },
  bn: {
    nav_jobs: 'চাকরি',
    nav_events: 'ইভেন্ট',
    nav_research: 'গবেষণা',
    nav_resources: 'রিসোর্স',
    nav_companies: 'কোম্পানি',
    nav_about: 'সম্পর্কে',
    nav_signIn: 'সাইন ইন',
    nav_createProfile: 'প্রোফাইল তৈরি করুন',

    nav_studyAbroad: 'বিদেশে পড়াশোনা',
    nav_people: 'মানুষ',
    nav_mentors: 'মেন্টর',
    nav_careers: 'ক্যারিয়ার',
    nav_roadmaps: 'রোডম্যাপ',

    hero_eyebrow: 'সকল বিভাগের জন্য RUET ক্যারিয়ার প্ল্যাটফর্ম',
    hero_headline: 'আপনার পরবর্তী চাকরি, গবেষণা বা স্কলারশিপ খুঁজে নিন।',
    hero_sub: 'RUET-এর শিক্ষার্থী, প্রাক্তন শিক্ষার্থী, শিক্ষক ও নিয়োগকর্তারা এক জায়গায় — চাকরির বিজ্ঞপ্তি, মেন্টর, গবেষণা প্রকল্প এবং বিদেশে ফান্ডেড উচ্চশিক্ষা।',
    hero_cta1: 'প্রোফাইল তৈরি করুন',
    hero_cta2: 'বিদেশে পড়াশোনা দেখুন',

    find_label: 'আপনি কী খুঁজছেন?',
    find_jobs: 'চাকরি',
    find_study: 'বিদেশে পড়াশোনা',
    find_events: 'ইভেন্ট',
    find_ph_jobs: 'পদের নাম, কোম্পানি বা দক্ষতা',
    find_ph_study: 'দেশ, বিষয় বা স্কলারশিপের নাম',
    find_ph_events: 'ইভেন্টের নাম বা ধরন',
    find_go: 'খুঁজুন',

    slide_campus_t: 'ক্যাম্পাস থেকে নিয়োগ',
    slide_campus_d: 'RUET থেকে নিয়োগ দেয় এমন কোম্পানির চাকরি ও ইন্টার্নশিপ।',
    slide_abroad_t: 'বিদেশে পড়াশোনা',
    slide_abroad_d: 'বিভিন্ন দেশে ফান্ডেড মাস্টার্স ও পিএইচডির সুযোগ।',
    slide_research_t: 'গবেষণা ও ল্যাব',
    slide_research_d: 'শিক্ষকের প্রকল্পে যোগ দিন বা সুপারভাইজার খুঁজুন।',
    slide_mentor_t: 'প্রাক্তন শিক্ষার্থী মেন্টর',
    slide_mentor_d: 'যিনি পথটা পার হয়েছেন, তাঁর সাথে সেশন বুক করুন।',
    slide_depts_t: 'সব ১৮টি বিভাগ',
    slide_depts_d: 'আর্কিটেকচার থেকে সিএসই, পুরো ক্যাম্পাসের জন্য একটি বোর্ড।',
    float_daysLeft: 'দিন বাকি',
    float_latestCircular: 'সর্বশেষ সার্কুলার',
    float_openRoles: 'টি খোলা পদ',

    abroad_title: 'বিদেশে পড়াশোনা: বাছাই থেকে যাত্রা পর্যন্ত',
    abroad_sub: 'শিক্ষক ও প্রাক্তন শিক্ষার্থীদের দেওয়া স্কলারশিপ দেখুন, আবেদনের অবস্থা ট্র্যাক করুন এবং যারা আগে গেছেন তাঁদের কাছ থেকে জেনে নিন।',
    abroad_step1: 'বাছাই',
    abroad_step1d: 'দেশ, স্তর ও ফান্ডিং দিয়ে ফিল্টার করুন।',
    abroad_step2: 'প্রস্তুতি',
    abroad_step2d: 'সুপারিশপত্র, টেস্ট স্কোর, এসওপি।',
    abroad_step3: 'আবেদন',
    abroad_step3d: 'সব ডেডলাইন এক তালিকায় দেখুন।',
    abroad_step4: 'যাত্রা',
    abroad_step4d: 'ভিসা, ভ্রমণ এবং ওপারে একজন মেন্টর।',
    abroad_closing: 'শীঘ্রই শেষ হচ্ছে',
    abroad_all: 'সব স্কলারশিপ দেখুন',
    abroad_mentors: 'বিদেশে থাকা প্রাক্তনদের সাথে কথা বলুন',

    board_title: 'বোর্ডে সর্বশেষ',
    board_circulars: 'সার্কুলার',
    board_jobs: 'চাকরি ও ইন্টার্নশিপ',
    board_events: 'ইভেন্ট',
    board_viewAll: 'সব দেখুন',
    board_empty: 'এখনও কিছু পোস্ট করা হয়নি।',
    board_sample: 'নমুনা কনটেন্ট দেখানো হচ্ছে। লাইভ ডেটা দেখতে সার্ভার চালু করে সিড স্ক্রিপ্ট চালান।',

    stats_title: 'এই মুহূর্তে বোর্ডে',
    stats_members: 'সক্রিয় সদস্য',
    stats_jobs: 'খোলা চাকরি ও ইন্টার্নশিপ',
    stats_scholarships: 'তালিকাভুক্ত স্কলারশিপ',
    stats_departments: 'অন্তর্ভুক্ত বিভাগ',

    cta_title: 'একটি প্রোফাইল দিয়ে শুরু করুন, বাকিটা এগিয়ে যাবে।',
    cta_primary: 'প্রোফাইল তৈরি করুন',
    cta_secondary: 'নিয়োগকর্তা হিসেবে চাকরি পোস্ট করুন',

    footer_tagline: 'RUET-এর শিক্ষার্থী, প্রাক্তন শিক্ষার্থী, শিল্প ও গবেষণাকে একত্রিত করছে একটি প্ল্যাটফর্মে।',
    footer_portals: 'পোর্টাল',
    footer_platform: 'প্ল্যাটফর্ম',
    footer_resources: 'রিসোর্স',
    footer_department: 'বিভাগ',
    footer_student: 'শিক্ষার্থী',
    footer_alumni: 'প্রাক্তন শিক্ষার্থী',
    footer_faculty: 'শিক্ষক',
    footer_recruiter: 'নিয়োগকর্তা',
    footer_jobPortal: 'চাকরি পোর্টাল',
    footer_researchHub: 'গবেষণা হাব',
    footer_mentorship: 'মেন্টরশিপ',
    footer_aiTools: 'এআই টুলস',
    footer_resourceLibrary: 'রিসোর্স লাইব্রেরি',
    footer_companyDirectory: 'কোম্পানি ডিরেক্টরি',
    footer_events: 'ইভেন্ট',
    footer_circulars: 'সার্কুলার',
    footer_aboutRuet: 'RUET সম্পর্কে',
    footer_contact: 'যোগাযোগ',
    footer_adminLogin: 'অ্যাডমিন লগইন',
    footer_copyright: '© ২০২৬ RUET Carrier HUB — রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়',
    footer_tagline2: 'একটি প্ল্যাটফর্মে গড়া।',

    auth_signInTitle: 'সাইন ইন',
    auth_signInSub: 'RUET Carrier HUB-এ আবার স্বাগতম।',
    auth_signInAs: 'হিসেবে সাইন ইন করুন',
    auth_email: 'বিশ্ববিদ্যালয় ইমেইল',
    auth_password: 'পাসওয়ার্ড',
    auth_signInBtn: 'সাইন ইন →',
    auth_forgotPassword: 'পাসওয়ার্ড ভুলে গেছেন?',
    auth_newHere: 'নতুন এসেছেন?',
    auth_createProfileLink: 'প্রোফাইল তৈরি করুন',

    auth_registerTitle: 'আপনার প্রোফাইল তৈরি করুন',
    auth_registerSub: 'শিক্ষার্থী, প্রাক্তন শিক্ষার্থী, শিক্ষক বা নিয়োগকর্তা হিসেবে যোগ দিন।',
    auth_fullName: 'পূর্ণ নাম',
    auth_iAmA: 'আমি একজন',
    auth_registerBtn: 'প্রোফাইল তৈরি করুন →',
    auth_alreadyHave: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
    auth_signInLink: 'সাইন ইন করুন',

    role_student: 'শিক্ষার্থী',
    role_alumni: 'প্রাক্তন শিক্ষার্থী',
    role_faculty: 'শিক্ষক',
    role_recruiter: 'নিয়োগকর্তা',
    role_admin: 'অ্যাডমিন',
  },
}

const LanguageContext = createContext(null)

function loadInitial() {
  try {
    return localStorage.getItem(STORAGE_KEY) || 'en'
  } catch {
    return 'en'
  }
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // storage unavailable — language still applies for this session
    }
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => setLang((l) => (l === 'en' ? 'bn' : 'en'))
  const t = (key) => STRINGS[lang][key] ?? STRINGS.en[key] ?? key

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider')
  return ctx
}
