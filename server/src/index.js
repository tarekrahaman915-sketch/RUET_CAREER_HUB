import dns from 'node:dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path'
import { connectDB } from './config/db.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

import authRoutes from './routes/auth.routes.js'
import studentsRoutes from './routes/students.routes.js'
import alumniRoutes from './routes/alumni.routes.js'
import companyRoutes from './routes/company.routes.js'
import facultyRoutes from './routes/faculty.routes.js'
import jobsRoutes from './routes/jobs.routes.js'
import eventsRoutes from './routes/events.routes.js'
import projectsRoutes from './routes/projects.routes.js'
import mentorsRoutes from './routes/mentors.routes.js'
import adminRoutes from './routes/admin.routes.js'
import profileRoutes from './routes/profile.routes.js'
import resourcesRoutes from './routes/resources.routes.js'
import peopleRoutes from './routes/people.routes.js'
import notificationsRoutes from './routes/notifications.routes.js'
import scholarshipsRoutes from './routes/scholarships.routes.js'
import feedRoutes from './routes/feed.routes.js'
import messagesRoutes from './routes/messages.routes.js'

const app = express()

const rawOrigin = process.env.CLIENT_ORIGIN
const allowedOrigins = rawOrigin
  ? rawOrigin.split(',').map((o) => o.trim().replace(/\/$/, ''))
  : ['http://localhost:5173']

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }
      return callback(null, false)
    },
    credentials: true,
  })
)
app.use(express.json())
app.use('/uploads', express.static(path.resolve('uploads')))

app.get('/api/health', (req, res) => res.json({ ok: true }))

app.use('/api/auth', authRoutes)
app.use('/api/students', studentsRoutes)
app.use('/api/alumni', alumniRoutes)
app.use('/api/company', companyRoutes)
app.use('/api/faculty', facultyRoutes)
app.use('/api/jobs', jobsRoutes)
app.use('/api/events', eventsRoutes)
app.use('/api/projects', projectsRoutes)
app.use('/api/mentors', mentorsRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/resources', resourcesRoutes)
app.use('/api/people', peopleRoutes)
app.use('/api/notifications', notificationsRoutes)
app.use('/api/scholarships', scholarshipsRoutes)
app.use('/api/feed', feedRoutes)
app.use('/api/messages', messagesRoutes)

app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT || 5000

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`RUET Carrier HUB API running on http://localhost:${port}`))
  })
  .catch((err) => {
    console.error('Failed to start server:', err.message)
    process.exit(1)
  })
