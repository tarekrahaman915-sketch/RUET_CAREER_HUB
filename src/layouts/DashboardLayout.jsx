import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import NotificationBell from '../components/common/NotificationBell.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import Avatar from '../components/ui/Avatar.jsx'

const NAV_BY_ROLE = {
  student: [
    { label: 'Overview', to: '/student', end: true },
    { label: 'Profile', to: '/student/profile' },
    { label: 'Documents', to: '/student/documents' },
    { label: 'Skills', to: '/student/skills' },
    { label: 'Projects', to: '/student/projects' },
    { label: 'Certifications', to: '/student/certifications' },
    { label: 'Portfolio', to: '/student/portfolio' },
    { label: 'Department', to: '/student/department' },
    { label: 'Study Abroad', to: '/student/study-abroad' },
    { label: 'Mentorship', to: '/student/mentorship' },
    { label: 'AI Tools', to: '/student/ai-tools' },
    { label: 'Public profile', to: '/student/public-profile' },
    { label: 'Publications', to: '/student/publications' },
    { label: 'Messages', to: '/messages' },
    { label: 'Career plan', to: '/student/career' },
  ],
  alumni: [
    { label: 'Overview', to: '/alumni', end: true },
    { label: 'Job Position', to: '/alumni/job-position' },
    { label: 'Postings', to: '/alumni/postings' },
    { label: 'Mentorship', to: '/alumni/mentorship' },
    { label: 'Career Tips', to: '/alumni/career-tips' },
    { label: 'Success Story', to: '/alumni/success-story' },
    { label: 'Public profile', to: '/alumni/public-profile' },
    { label: 'Publications', to: '/alumni/publications' },
    { label: 'Messages', to: '/messages' },
    { label: 'Post Scholarship', to: '/study-abroad' },
  ],
  faculty: [
    { label: 'Overview', to: '/faculty', end: true },
    { label: 'Approve Events', to: '/faculty/events' },
    { label: 'Recommend Students', to: '/faculty/recommend-students' },
    { label: 'Post Notice', to: '/faculty/notices' },
    { label: 'Research Opportunity', to: '/faculty/research' },
    { label: 'Recommend Internship', to: '/faculty/recommend-internship' },
    { label: 'Public profile', to: '/faculty/public-profile' },
    { label: 'Publications', to: '/faculty/publications' },
    { label: 'Messages', to: '/messages' },
    { label: 'Post Scholarship', to: '/study-abroad' },
  ],
  company: [
    { label: 'Overview', to: '/company', end: true },
    { label: 'Post Jobs', to: '/company/jobs' },
    { label: 'Post Internship', to: '/company/internships' },
    { label: 'Applicants', to: '/company/applicants' },
  ],
  admin: [
    { label: 'Overview', to: '/admin', end: true },
    { label: 'Users', to: '/admin/users' },
    { label: 'Companies', to: '/admin/companies' },
    { label: 'Jobs', to: '/admin/jobs' },
    { label: 'Events', to: '/admin/events' },
    { label: 'Reports', to: '/admin/reports' },
    { label: 'Verification', to: '/admin/verification' },
    { label: 'Analytics', to: '/admin/analytics' },
    { label: 'Messages', to: '/admin/messages' },
  ],
}

export default function DashboardLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const role = pathname.split('/')[1] || 'student'
  const items = NAV_BY_ROLE[role] || NAV_BY_ROLE.student

  const { user, signOut: clearSession } = useAuth()
  const signOut = () => {
    clearSession()
    navigate('/')
  }

  return (
    <div className="dash-shell">
      <div className="grid-bg" />
      <aside className="dash-sidebar">
        <NavLink to="/" className="dash-home-link">
          ← Back to home
        </NavLink>
        {user && (
          <div className="dash-who">
            <Avatar person={user} size={40} />
            <span><b>{user.name}</b><small>{user.email}</small></span>
          </div>
        )}
        <h4>{role}</h4>
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end}>
            {item.label}
          </NavLink>
        ))}
        <button className="dash-signout" style={{ marginTop: 'auto' }} onClick={signOut}>
          Sign out
        </button>
      </aside>
      <div className="dash-content">
        <div className="dash-topbar">
          <NotificationBell />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
