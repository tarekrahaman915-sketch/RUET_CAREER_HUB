/*
 * Real, free-to-open learning resources for every career path.
 * All links point to the publisher's own site (courses, official docs,
 * professional bodies, government portals). They are not hosted here.
 * Types: Course · Docs · Book · Practice · Tool · Community · Official
 */
const r = (title, type, provider, url, note = '') => ({ title, type, provider, url, note })

export const CAREER_RESOURCES = {
  software: [
    r('CS50x: Introduction to Computer Science', 'Course', 'Harvard', 'https://cs50.harvard.edu/x/', 'Free; the best first course for C, Python, SQL and web.'),
    r('freeCodeCamp curriculum', 'Course', 'freeCodeCamp', 'https://www.freecodecamp.org/', 'Hands-on web development and Python with certificates.'),
    r('The Odin Project', 'Course', 'The Odin Project', 'https://www.theodinproject.com/', 'Full-stack JavaScript path built around projects.'),
    r('MDN Web Docs', 'Docs', 'Mozilla', 'https://developer.mozilla.org/', 'The reference for HTML, CSS and JavaScript.'),
    r('Pro Git (book)', 'Book', 'git-scm.com', 'https://git-scm.com/book/en/v2', 'Free online book on Git and GitHub workflows.'),
    r('The Missing Semester of Your CS Education', 'Course', 'MIT', 'https://missing.csail.mit.edu/', 'Shell, vim, git, debugging: tools nobody teaches in class.'),
    r('NeetCode roadmap', 'Practice', 'NeetCode', 'https://neetcode.io/roadmap', 'Structured data-structures and algorithms problem list.'),
    r('LeetCode', 'Practice', 'LeetCode', 'https://leetcode.com/', 'Interview-style coding practice.'),
    r('System Design Primer', 'Book', 'GitHub (donnemartin)', 'https://github.com/donnemartin/system-design-primer', 'Learn how large systems are designed.'),
    r('roadmap.sh', 'Community', 'roadmap.sh', 'https://roadmap.sh/', 'Community roadmaps for frontend, backend, DevOps and more.'),
  ],
  'ai-ml': [
    r('Machine Learning Specialization', 'Course', 'DeepLearning.AI / Coursera', 'https://www.coursera.org/specializations/machine-learning-introduction', 'Andrew Ng’s beginner-friendly ML foundation.'),
    r('Practical Deep Learning for Coders', 'Course', 'fast.ai', 'https://course.fast.ai/', 'Free, code-first deep learning.'),
    r('Kaggle Learn', 'Course', 'Kaggle', 'https://www.kaggle.com/learn', 'Short free courses: Python, Pandas, ML, SQL.'),
    r('Stanford CS229: Machine Learning', 'Course', 'Stanford', 'https://cs229.stanford.edu/', 'Rigorous university-level ML notes and lectures.'),
    r('Dive into Deep Learning', 'Book', 'd2l.ai', 'https://d2l.ai/', 'Interactive free textbook with code in PyTorch.'),
    r('Neural networks (video series)', 'Course', '3Blue1Brown', 'https://www.3blue1brown.com/topics/neural-networks', 'The best visual intuition for how networks learn.'),
    r('PyTorch tutorials', 'Docs', 'PyTorch', 'https://pytorch.org/tutorials/', 'Official tutorials from basics to production.'),
    r('scikit-learn user guide', 'Docs', 'scikit-learn', 'https://scikit-learn.org/stable/user_guide.html', 'Classic ML algorithms with examples.'),
    r('Hugging Face Learn', 'Course', 'Hugging Face', 'https://huggingface.co/learn', 'NLP, LLM and agents courses.'),
    r('Kaggle Competitions', 'Practice', 'Kaggle', 'https://www.kaggle.com/competitions', 'Real datasets and public notebooks to learn from.'),
  ],
  embedded: [
    r('Arduino documentation', 'Docs', 'Arduino', 'https://docs.arduino.cc/', 'Boards, language reference and tutorials.'),
    r('ESP-IDF programming guide', 'Docs', 'Espressif', 'https://docs.espressif.com/projects/esp-idf/en/latest/', 'Official ESP32 firmware framework docs.'),
    r('STM32 microcontrollers', 'Docs', 'STMicroelectronics', 'https://www.st.com/en/microcontrollers-microprocessors/stm32-32-bit-arm-cortex-mcus.html', 'ARM Cortex-M parts, datasheets, CubeIDE.'),
    r('FreeRTOS documentation', 'Docs', 'FreeRTOS', 'https://www.freertos.org/Documentation/00-Overview', 'The most-used real-time OS for MCUs.'),
    r('Ben Eater: build an 8-bit computer', 'Course', 'eater.net', 'https://eater.net/', 'Learn how computers work from logic gates up.'),
    r('KiCad learning resources', 'Tool', 'KiCad', 'https://www.kicad.org/help/learning-resources/', 'Free PCB design software and tutorials.'),
    r('Embedded Artistry', 'Community', 'Embedded Artistry', 'https://embeddedartistry.com/', 'Firmware architecture and best practices.'),
    r('MATLAB Academy', 'Course', 'MathWorks', 'https://matlabacademy.mathworks.com/', 'Free MATLAB/Simulink onramps.'),
  ],
  'power-energy': [
    r('Introduction to Electric Power Systems', 'Course', 'MIT OpenCourseWare', 'https://ocw.mit.edu/courses/6-061-introduction-to-electric-power-systems-spring-2011/', 'Free lecture notes and problem sets.'),
    r('NPTEL online courses', 'Course', 'IIT / IISc', 'https://nptel.ac.in/', 'Power systems, power electronics, machines: search by topic.'),
    r('MATLAB Academy', 'Course', 'MathWorks', 'https://matlabacademy.mathworks.com/', 'Simulink onramp for converters and drives.'),
    r('PVsyst', 'Tool', 'PVsyst', 'https://www.pvsyst.com/', 'Industry software for solar PV system design.'),
    r('IEEE Power & Energy Society', 'Community', 'IEEE PES', 'https://www.ieee-pes.org/', 'Student membership, webinars, standards.'),
    r('International Energy Agency', 'Official', 'IEA', 'https://www.iea.org/', 'Global energy data and outlook reports.'),
    r('SREDA Bangladesh', 'Official', 'Govt. of Bangladesh', 'https://sreda.gov.bd/', 'Renewable-energy policy and programmes in Bangladesh.'),
    r('Bangladesh Power Development Board', 'Official', 'BPDB', 'https://www.bpdb.gov.bd/', 'Utility employer: circulars and recruitment notices.'),
  ],
  telecom: [
    r('Cisco Networking Academy', 'Course', 'Cisco', 'https://www.netacad.com/', 'Free networking courses leading to CCNA.'),
    r('CCNA certification', 'Official', 'Cisco', 'https://www.cisco.com/c/en/us/training-events/training-certifications/certifications/associate/ccna.html', 'Exam topics and study material.'),
    r('Computer Networking: A Top-Down Approach', 'Book', 'Kurose & Ross', 'https://gaia.cs.umass.edu/kurose_ross/', 'Companion site with slides, labs and videos.'),
    r('Wireshark documentation', 'Docs', 'Wireshark', 'https://www.wireshark.org/docs/', 'Packet analysis for troubleshooting.'),
    r('GNS3', 'Tool', 'GNS3', 'https://www.gns3.com/', 'Network emulator to practise routing labs.'),
    r('3GPP specifications', 'Docs', '3GPP', 'https://www.3gpp.org/', 'The actual 4G/5G standards.'),
    r('ITU Academy', 'Course', 'ITU', 'https://academy.itu.int/', 'Telecom and digital-skills courses.'),
    r('BTRC (regulator)', 'Official', 'Govt. of Bangladesh', 'https://btrc.gov.bd/', 'Licensing and industry news for Bangladesh.'),
  ],
  civil: [
    r('NPTEL civil engineering', 'Course', 'IIT / IISc', 'https://nptel.ac.in/', 'Structures, geotechnical, hydrology: search by topic.'),
    r('ETABS', 'Tool', 'CSI', 'https://www.csiamerica.com/products/etabs', 'Building analysis and design software.'),
    r('Mechanical & civil courses', 'Course', 'MIT OpenCourseWare', 'https://ocw.mit.edu/courses/civil-and-environmental-engineering/', 'Free university course material.'),
    r('Housing and Building Research Institute', 'Official', 'HBRI (BNBC)', 'https://hbri.gov.bd/', 'Home of the Bangladesh National Building Code.'),
    r('Institution of Engineers, Bangladesh', 'Community', 'IEB', 'https://www.iebbd.org/', 'Professional membership and events.'),
    r('ASCE', 'Community', 'ASCE', 'https://www.asce.org/', 'Standards, journals, and student resources.'),
    r('Autodesk Revit learning', 'Course', 'Autodesk', 'https://www.autodesk.com/learn', 'BIM tutorials from the vendor.'),
  ],
  mechanical: [
    r('Mechanical engineering courses', 'Course', 'MIT OpenCourseWare', 'https://ocw.mit.edu/courses/mechanical-engineering/', 'Free thermodynamics, design and controls courses.'),
    r('Fusion 360 for education', 'Tool', 'Autodesk', 'https://www.autodesk.com/campaigns/education/fusion', 'Free-for-students CAD/CAM software.'),
    r('ROS documentation', 'Docs', 'Open Robotics', 'https://docs.ros.org/', 'Robot Operating System tutorials.'),
    r('ASME', 'Community', 'ASME', 'https://www.asme.org/', 'Standards, student sections, learning.'),
    r('ASQ: Lean Six Sigma resources', 'Official', 'ASQ', 'https://asq.org/quality-resources/lean-six-sigma', 'Quality and process-improvement basics.'),
    r('NPTEL mechanical engineering', 'Course', 'IIT / IISc', 'https://nptel.ac.in/', 'Machine design, heat transfer, manufacturing.'),
  ],
  research: [
    r('DAAD: study and research in Germany', 'Official', 'DAAD', 'https://www.daad.de/en/', 'Funding database and course search.'),
    r('Chevening', 'Official', 'UK FCDO', 'https://www.chevening.org/', 'One-year UK masters scholarship.'),
    r('IEEE Xplore', 'Tool', 'IEEE', 'https://ieeexplore.ieee.org/', 'Find and read papers in your field.'),
    r('arXiv', 'Tool', 'Cornell', 'https://arxiv.org/', 'Free preprints.'),
    r('Google Scholar', 'Tool', 'Google', 'https://scholar.google.com/', 'Search papers, track citations, build your profile.'),
    r('Zotero', 'Tool', 'Zotero', 'https://www.zotero.org/', 'Reference manager.'),
    r('Overleaf: Learn LaTeX', 'Docs', 'Overleaf', 'https://www.overleaf.com/learn', 'Write papers and theses in LaTeX.'),
    r('How to Read a Paper (S. Keshav)', 'Book', 'Univ. of Waterloo', 'https://blizzard.cs.uwaterloo.ca/keshav/home/Papers/data/07/paper-reading.pdf', 'A three-pass method for reading research.'),
  ],
  'govt-mgmt': [
    r('Google Project Management Certificate', 'Course', 'Coursera', 'https://www.coursera.org/professional-certificates/google-project-management', 'Entry-level project management.'),
    r('Startup School', 'Course', 'Y Combinator', 'https://www.startupschool.org/', 'Free course for building a startup.'),
    r('The Lean Startup', 'Book', 'Eric Ries', 'https://theleanstartup.com/', 'Validate ideas before building.'),
    r('Bangladesh Public Service Commission', 'Official', 'BPSC', 'https://www.bpsc.gov.bd/', 'BCS circulars, syllabus and results.'),
    r('Project Management Institute', 'Community', 'PMI', 'https://www.pmi.org/', 'PMP/CAPM information and student resources.'),
  ],
}

// RUET-specific resources shown for everyone
export const RUET_RESOURCES = [
  r('ETE course curriculum', 'Official', 'Dept. of ETE, RUET', 'https://www.ete.ruet.ac.bd/page/course-curriculum', 'Official syllabus for the ETE programme.'),
  r('RUET Central Library', 'Official', 'RUET', 'https://ruet.ac.bd/page/central-library', 'Library facilities and services.'),
  r('RUET career notices', 'Official', 'RUET', 'https://ruet.ac.bd/career', 'Official job circulars published by RUET.'),
  r('RUET Alumni portal', 'Community', 'RUET', 'https://alumni.ruet.ac.bd/', 'Official alumni network site.'),
  r('Publications of ETE faculty', 'Official', 'Dept. of ETE, RUET', 'https://www.ete.ruet.ac.bd/publications', 'Research output by department.'),
]

export const resourcesFor = (pathId) => CAREER_RESOURCES[pathId] || []
export const ALL_RESOURCES = Object.entries(CAREER_RESOURCES).flatMap(([pathId, list]) => list.map((x) => ({ ...x, pathId })))
