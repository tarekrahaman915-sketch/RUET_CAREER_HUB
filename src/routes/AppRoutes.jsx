import { Routes, Route } from 'react-router-dom'

import MainLayout from '../layouts/MainLayout.jsx'
import DashboardLayout from '../layouts/DashboardLayout.jsx'
import ProtectedRoute from '../components/common/ProtectedRoute.jsx'

import { StudentProvider } from '../context/StudentContext.jsx'
import { AlumniProvider } from '../context/AlumniContext.jsx'
import { FacultyProvider } from '../context/FacultyContext.jsx'
import { CompanyProvider } from '../context/CompanyContext.jsx'
import { AdminProvider } from '../context/AdminContext.jsx'

import Home from '../pages/public/Home.jsx'
import About from '../pages/public/About.jsx'
import Companies from '../pages/public/Companies.jsx'
import Jobs from '../pages/public/Jobs.jsx'
import Events from '../pages/public/Events.jsx'
import Research from '../pages/public/Research.jsx'
import Resources from '../pages/public/Resources.jsx'
import Login from '../pages/auth/Login.jsx'
import Register from '../pages/auth/Register.jsx'
import ForgotPassword from '../pages/auth/ForgotPassword.jsx'
import ResetPassword from '../pages/auth/ResetPassword.jsx'
import People from '../pages/public/People.jsx'
import StudyAbroad from '../pages/public/StudyAbroad.jsx'
import Circulars from '../pages/public/Circulars.jsx'
import PersonProfile from '../pages/public/PersonProfile.jsx'
import Mentors from '../pages/public/Mentors.jsx'
import Inbox from '../pages/public/Inbox.jsx'
import CareerPaths from '../pages/public/CareerPaths.jsx'
import CareerPathDetail from '../pages/public/CareerPathDetail.jsx'
import Roadmaps from '../pages/public/Roadmaps.jsx'
import CareerPlan from '../pages/student/CareerPlan.jsx'
import Publications from '../pages/shared/Publications.jsx'
import PublicProfileEditor from '../pages/shared/PublicProfileEditor.jsx'

import StudentOverview from '../pages/student/Overview.jsx'
import StudentProfile from '../pages/student/Profile.jsx'
import StudentDocuments from '../pages/student/Documents.jsx'
import StudentSkills from '../pages/student/Skills.jsx'
import StudentProjects from '../pages/student/Projects.jsx'
import StudentCertifications from '../pages/student/Certifications.jsx'
import StudentPortfolio from '../pages/student/Portfolio.jsx'
import StudentMentorship from '../pages/student/Mentorship.jsx'
import StudentAITools from '../pages/student/AITools.jsx'
import StudentDepartment from '../pages/student/Department.jsx'
import StudentStudyAbroad from '../pages/student/StudyAbroad.jsx'

import AlumniOverview from '../pages/alumni/Overview.jsx'
import AlumniJobPosition from '../pages/alumni/JobPosition.jsx'
import AlumniPostings from '../pages/alumni/Postings.jsx'
import AlumniMentorship from '../pages/alumni/Mentorship.jsx'
import AlumniCareerTips from '../pages/alumni/CareerTips.jsx'
import AlumniSuccessStory from '../pages/alumni/SuccessStory.jsx'

import FacultyOverview from '../pages/faculty/Overview.jsx'
import FacultyApproveEvents from '../pages/faculty/ApproveEvents.jsx'
import FacultyRecommendStudents from '../pages/faculty/RecommendStudents.jsx'
import FacultyPostNotice from '../pages/faculty/PostNotice.jsx'
import FacultyResearchOpportunity from '../pages/faculty/ResearchOpportunity.jsx'
import FacultyRecommendInternship from '../pages/faculty/RecommendInternship.jsx'

import CompanyOverview from '../pages/company/Overview.jsx'
import CompanyPostJobs from '../pages/company/PostJobs.jsx'
import CompanyPostInternship from '../pages/company/PostInternship.jsx'
import CompanyApplicants from '../pages/company/Applicants.jsx'

import AdminOverview from '../pages/admin/Overview.jsx'
import AdminUsers from '../pages/admin/Users.jsx'
import AdminCompanies from '../pages/admin/CompaniesAdmin.jsx'
import AdminJobs from '../pages/admin/JobsAdmin.jsx'
import AdminEvents from '../pages/admin/EventsAdmin.jsx'
import AdminReports from '../pages/admin/Reports.jsx'
import AdminVerification from '../pages/admin/Verification.jsx'
import AdminAnalytics from '../pages/admin/Analytics.jsx'
import AdminMessages from '../pages/admin/Messages.jsx'

export default function AppRoutes() {
  return (
    // StudentProvider wraps everything (not just /student/*) so public pages
    // like the Job Portal, Events, and Research Hub can read/write a signed-in
    // student's saved jobs, applications, event registrations, and showcased
    // projects too.
    <StudentProvider>
      <Routes>
        {/* Public site */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/research" element={<Research />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/people" element={<People />} />
          <Route path="/people/:id" element={<PersonProfile />} />
          <Route path="/mentors" element={<Mentors />} />
          <Route path="/messages" element={<Inbox />} />
          <Route path="/messages/:userId" element={<Inbox />} />
          <Route path="/careers" element={<CareerPaths />} />
          <Route path="/careers/:id" element={<CareerPathDetail />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/study-abroad" element={<StudyAbroad />} />
          <Route path="/circulars" element={<Circulars />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* Student dashboard */}
        <Route
          path="/student/*"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<StudentOverview />} />
          <Route path="profile" element={<StudentProfile />} />
          <Route path="documents" element={<StudentDocuments />} />
          <Route path="skills" element={<StudentSkills />} />
          <Route path="projects" element={<StudentProjects />} />
          <Route path="certifications" element={<StudentCertifications />} />
          <Route path="portfolio" element={<StudentPortfolio />} />
          <Route path="mentorship" element={<StudentMentorship />} />
          <Route path="ai-tools" element={<StudentAITools />} />
          <Route path="department" element={<StudentDepartment />} />
          <Route path="study-abroad" element={<StudentStudyAbroad />} />
          <Route path="career" element={<CareerPlan />} />
          <Route path="public-profile" element={<PublicProfileEditor />} />
          <Route path="publications" element={<Publications />} />
        </Route>

        {/* Alumni dashboard */}
        <Route
          path="/alumni/*"
          element={
            <ProtectedRoute>
              <AlumniProvider>
                <DashboardLayout />
              </AlumniProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<AlumniOverview />} />
          <Route path="job-position" element={<AlumniJobPosition />} />
          <Route path="postings" element={<AlumniPostings />} />
          <Route path="mentorship" element={<AlumniMentorship />} />
          <Route path="career-tips" element={<AlumniCareerTips />} />
          <Route path="success-story" element={<AlumniSuccessStory />} />
          <Route path="public-profile" element={<PublicProfileEditor />} />
          <Route path="publications" element={<Publications />} />
        </Route>

        {/* Faculty dashboard */}
        <Route
          path="/faculty/*"
          element={
            <ProtectedRoute>
              <FacultyProvider>
                <DashboardLayout />
              </FacultyProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<FacultyOverview />} />
          <Route path="events" element={<FacultyApproveEvents />} />
          <Route path="recommend-students" element={<FacultyRecommendStudents />} />
          <Route path="notices" element={<FacultyPostNotice />} />
          <Route path="research" element={<FacultyResearchOpportunity />} />
          <Route path="recommend-internship" element={<FacultyRecommendInternship />} />
          <Route path="public-profile" element={<PublicProfileEditor />} />
          <Route path="publications" element={<Publications />} />
        </Route>

        {/* Company dashboard */}
        <Route
          path="/company/*"
          element={
            <ProtectedRoute>
              <CompanyProvider>
                <DashboardLayout />
              </CompanyProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<CompanyOverview />} />
          <Route path="jobs" element={<CompanyPostJobs />} />
          <Route path="internships" element={<CompanyPostInternship />} />
          <Route path="applicants" element={<CompanyApplicants />} />
        </Route>

        {/* Admin dashboard */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminProvider>
                <DashboardLayout />
              </AdminProvider>
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="events" element={<AdminEvents />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="verification" element={<AdminVerification />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="messages" element={<AdminMessages />} />
        </Route>
      </Routes>
    </StudentProvider>
  )
}
