import PDFDocument from 'pdfkit'
import path from 'path'
import fs from 'fs'
import Project from '../models/Project.js'

const ACCENT = '#a85f2b'
const TEXT = '#1a221e'
const MUTED = '#5c6e67'

/**
 * Streams a professional-looking CV PDF, generated from a student's stored
 * profile data (and profile picture, if uploaded), directly to an HTTP
 * response. Always reflects whatever is currently saved on their profile —
 * nothing is pre-rendered or cached.
 */
export async function streamStudentCV(user, res) {
  const projects = await Project.find({ student: user._id }).sort({ createdAt: -1 })

  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Disposition', `inline; filename="${(user.name || 'resume').replace(/\s+/g, '_')}_CV.pdf"`)
  doc.pipe(res)

  const sp = user.studentProfile || {}
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  let headerBottom = doc.y

  // --- Profile picture (circular) ---
  const pic = user.profilePicture
  const picSize = 78
  const picX = doc.page.margins.left
  const picY = doc.y
  let textX = picX

  if (pic?.storedAs) {
    const filePath = path.resolve('uploads', pic.storedAs)
    if (fs.existsSync(filePath)) {
      doc.save()
      doc.circle(picX + picSize / 2, picY + picSize / 2, picSize / 2).clip()
      try {
        doc.image(filePath, picX, picY, { width: picSize, height: picSize })
      } catch {
        // Corrupt/unsupported image — skip silently rather than crash the CV
      }
      doc.restore()
      textX = picX + picSize + 20
    }
  }

  // --- Name / contact block ---
  doc.fontSize(22).fillColor(TEXT).font('Helvetica-Bold').text(user.name || 'Untitled', textX, picY)
  doc.fontSize(11).fillColor(MUTED).font('Helvetica').text(user.email || '', textX, doc.y + 2)
  if (user.department) doc.text(user.department, textX)
  headerBottom = Math.max(doc.y, picY + picSize) + 16

  const links = [sp.portfolio?.github, sp.portfolio?.linkedin, sp.portfolio?.website].filter(Boolean)
  if (links.length) {
    doc.fontSize(9.5).fillColor(ACCENT).text(links.join('   ·   '), doc.page.margins.left, headerBottom)
    headerBottom = doc.y + 14
  }

  doc.moveTo(doc.page.margins.left, headerBottom).lineTo(doc.page.width - doc.page.margins.right, headerBottom).strokeColor('#ddd').stroke()
  doc.y = headerBottom + 16

  function sectionTitle(title) {
    doc.moveDown(0.6)
    doc.fontSize(12).fillColor(ACCENT).font('Helvetica-Bold').text(title.toUpperCase())
    doc.moveDown(0.2)
    doc.fontSize(10.5).fillColor(TEXT).font('Helvetica')
  }

  // --- Education ---
  sectionTitle('Education')
  const eduLine = [
    sp.batch && `Batch ${sp.batch}`,
    sp.semester && `Semester ${sp.semester}`,
    sp.gpa && `GPA ${sp.gpa}`,
    sp.studentId,
  ].filter(Boolean).join('  ·  ')
  doc.text(eduLine || 'Not provided', { width: pageWidth })

  // --- Interests ---
  if (sp.careerInterest || sp.researchInterest) {
    sectionTitle('Interests')
    if (sp.careerInterest) doc.font('Helvetica-Bold').text('Career: ', { continued: true }).font('Helvetica').text(sp.careerInterest)
    if (sp.researchInterest) doc.font('Helvetica-Bold').text('Research: ', { continued: true }).font('Helvetica').text(sp.researchInterest)
  }

  // --- Skills ---
  if (sp.skills?.length || sp.languages?.length) {
    sectionTitle('Skills')
    if (sp.skills?.length) doc.font('Helvetica-Bold').text('Skills: ', { continued: true }).font('Helvetica').text(sp.skills.join(', '))
    if (sp.languages?.length) doc.font('Helvetica-Bold').text('Programming languages: ', { continued: true }).font('Helvetica').text(sp.languages.join(', '))
  }

  // --- Projects ---
  if (projects.length) {
    sectionTitle('Projects')
    projects.forEach((p) => {
      doc.font('Helvetica-Bold').fontSize(10.5).text(p.title)
      if (p.techStack?.length) doc.font('Helvetica-Oblique').fontSize(9.5).fillColor(MUTED).text(p.techStack.join(', '))
      doc.font('Helvetica').fontSize(10).fillColor(TEXT)
      if (p.description) doc.text(p.description, { width: pageWidth })
      const plinks = [p.github, p.demo].filter(Boolean).join('   ·   ')
      if (plinks) doc.fillColor(ACCENT).fontSize(9).text(plinks)
      doc.fillColor(TEXT).moveDown(0.4)
    })
  }

  // --- Certifications ---
  if (sp.certifications?.length) {
    sectionTitle('Certifications')
    sp.certifications.forEach((c) => {
      const line = [c.name, c.issuer, c.date].filter(Boolean).join('  ·  ')
      doc.text(line)
    })
  }

  doc.end()
}
