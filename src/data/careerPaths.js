/*
 * Career paths + learning roadmaps for RUET departments.
 *
 * Each path has:
 *   - details  : what the work is, typical roles (entry -> senior), skills, tools, who hires
 *   - roadmap  : ordered phases, each with ticked-off-able steps (ids are stable —
 *                they're what gets saved as a person's progress)
 *
 * Content is deliberately general guidance, not salary promises. Learners should
 * check current job postings and talk to alumni (see /mentors) before committing.
 */

import { CAREER_GUIDES } from './careerGuides.js'
import { PATH_IMAGES } from './pathImages.js'

const step = (id, title, detail, resources = []) => ({ id, title, detail, resources })
const res = (label, url) => ({ label, url })

export const CAREER_PATHS = [
  {
    id: 'software',
    title: 'Software Engineering',
    icon: '💻',
    tagline: 'Build web, mobile and backend products used by real people.',
    departments: ['CSE', 'ECE', 'ETE', 'EEE'],
    overview:
      'Software engineers design, write, test and maintain applications. In Bangladesh the main routes are product companies, outsourcing/agency work, startups and remote jobs for overseas teams. A strong GitHub, a few shipped projects and solid data-structure fundamentals matter more than the exact degree.',
    dayToDay: ['Turning requirements into working features', 'Code review and pair debugging', 'Writing tests and fixing production bugs', 'Planning work with product and design teammates'],
    ladder: [
      { level: 'Entry', roles: ['Junior Software Engineer', 'Associate Developer', 'Software Intern'] },
      { level: 'Mid', roles: ['Software Engineer', 'Full-stack Developer', 'Backend Engineer'] },
      { level: 'Senior', roles: ['Senior Engineer', 'Tech Lead', 'Engineering Manager'] },
    ],
    skills: ['Data structures & algorithms', 'JavaScript/TypeScript or Python or Java', 'SQL & databases', 'Git', 'REST APIs', 'System design basics'],
    tools: ['VS Code', 'Git/GitHub', 'Docker', 'Postman', 'PostgreSQL/MongoDB'],
    employers: ['Product companies', 'Software agencies', 'Startups', 'Banks & fintech', 'Remote overseas teams'],
    goodFit: 'You enjoy building things, solving logic puzzles and learning new tools quickly.',
    roadmap: [
      {
        id: 'p1', name: 'Foundation', weeks: '0–2 months', goal: 'Get comfortable writing code every day.',
        steps: [
          step('s1', 'Pick one language and learn it properly', 'Python or JavaScript are the friendliest starts. Finish a full beginner course and write small programs daily.', [res('CS50x (free)', 'https://cs50.harvard.edu/x/'), res('freeCodeCamp', 'https://www.freecodecamp.org/')]),
          step('s2', 'Learn Git & GitHub', 'Commit, branch, open a pull request. Put every project on GitHub from day one.', [res('Git basics', 'https://git-scm.com/book/en/v2')]),
          step('s3', 'Solve 30 easy problems', 'Arrays, strings, hash maps. Focus on understanding, not speed.', [res('LeetCode', 'https://leetcode.com/'), res('Codeforces', 'https://codeforces.com/')]),
        ],
      },
      {
        id: 'p2', name: 'Core skills', weeks: '2–6 months', goal: 'Understand how real applications are built.',
        steps: [
          step('s4', 'Data structures & algorithms', 'Linked lists, trees, graphs, sorting, recursion, dynamic programming basics.'),
          step('s5', 'Web fundamentals', 'HTML, CSS, JavaScript, how HTTP works, and one frontend framework (React is common in job posts).', [res('The Odin Project', 'https://www.theodinproject.com/')]),
          step('s6', 'Databases & backend', 'SQL, one backend framework (Node/Express, Django or Spring), authentication, REST APIs.'),
          step('s7', 'Operating systems & networking basics', 'Processes, memory, TCP/IP, DNS — they come up in interviews and debugging.'),
        ],
      },
      {
        id: 'p3', name: 'Projects & proof', weeks: '6–9 months', goal: 'Show employers you can ship.',
        steps: [
          step('s8', 'Build 2 full-stack projects', 'Real users or real data, deployed online, with a README explaining decisions.'),
          step('s9', 'Contribute to open source or a team project', 'Even small documentation or bug-fix PRs show you can work with others’ code.'),
          step('s10', 'Write a one-page CV and polish GitHub/LinkedIn', 'Lead with projects and impact. Ask an alumnus to review it.'),
        ],
      },
      {
        id: 'p4', name: 'Job hunt', weeks: '9–12 months', goal: 'Land an internship or first role.',
        steps: [
          step('s11', 'Do mock interviews', 'Practice explaining your thinking aloud. Book a session with an alumni mentor.'),
          step('s12', 'Apply to 30 targeted roles', 'Mix internships, junior roles and RUET Hub job posts. Track applications in a sheet.'),
          step('s13', 'Learn system-design basics', 'Caching, queues, load balancing — needed once you move beyond junior interviews.'),
        ],
      },
    ],
  },
  {
    id: 'ai-ml',
    title: 'AI, ML & Data Science',
    icon: '🧠',
    tagline: 'Turn data into models, insights and intelligent features.',
    departments: ['CSE', 'EEE', 'ETE', 'ECE'],
    overview:
      'Data and ML roles range from analysts who answer business questions with data, to ML engineers who ship models, to researchers who push methods forward. Strong maths, Python and a few end-to-end projects are the common thread. Many people also use this route to apply for research masters abroad.',
    dayToDay: ['Cleaning and exploring data', 'Training and evaluating models', 'Building dashboards or model APIs', 'Explaining results to non-technical teammates'],
    ladder: [
      { level: 'Entry', roles: ['Data Analyst', 'Junior ML Engineer', 'Research Assistant'] },
      { level: 'Mid', roles: ['Data Scientist', 'ML Engineer', 'Applied Scientist'] },
      { level: 'Senior', roles: ['Senior/Staff ML Engineer', 'Research Scientist', 'Data Science Lead'] },
    ],
    skills: ['Python', 'Linear algebra, probability & statistics', 'Pandas/NumPy', 'Scikit-learn & PyTorch', 'SQL', 'Experiment design & evaluation'],
    tools: ['Jupyter', 'PyTorch', 'scikit-learn', 'Pandas', 'Docker', 'Weights & Biases'],
    employers: ['Tech companies', 'Telecom & banks', 'Research labs & universities', 'Startups', 'Overseas MS/PhD programmes'],
    goodFit: 'You like maths, experimentation and being comfortable with messy, uncertain problems.',
    roadmap: [
      {
        id: 'p1', name: 'Foundation', weeks: '0–3 months', goal: 'Python plus the maths that matters.',
        steps: [
          step('s1', 'Python for data', 'NumPy, Pandas, Matplotlib. Analyse one public dataset end to end.', [res('Kaggle Learn', 'https://www.kaggle.com/learn')]),
          step('s2', 'Maths refresher', 'Linear algebra, probability, basic statistics and calculus for gradients.', [res('3Blue1Brown', 'https://www.3blue1brown.com/')]),
          step('s3', 'SQL basics', 'Joins, aggregations, window functions — analysts use these daily.'),
        ],
      },
      {
        id: 'p2', name: 'Core ML', weeks: '3–7 months', goal: 'Understand and train standard models.',
        steps: [
          step('s4', 'Classic machine learning', 'Regression, trees, ensembles, cross-validation, overfitting, metrics.', [res('Andrew Ng – ML Specialization', 'https://www.coursera.org/specializations/machine-learning-introduction')]),
          step('s5', 'Deep learning basics', 'Neural nets, CNNs, sequence models, training tricks, in PyTorch.', [res('fast.ai', 'https://www.fast.ai/')]),
          step('s6', 'Do 2 Kaggle competitions or datasets', 'Aim to understand top solutions, not only your score.'),
        ],
      },
      {
        id: 'p3', name: 'Projects & depth', weeks: '7–10 months', goal: 'Show real, deployed work.',
        steps: [
          step('s7', 'Ship one end-to-end project', 'Data → model → API/web app, with a write-up. Embedded or local-language problems stand out.'),
          step('s8', 'Pick a specialty', 'NLP (Bangla NLP is an opportunity), computer vision, time series, or recommender systems.'),
          step('s9', 'Read and reproduce one paper', 'Document what you learned in a short blog post or notebook.'),
        ],
      },
      {
        id: 'p4', name: 'Career move', weeks: '10–12 months', goal: 'Industry role or research route.',
        steps: [
          step('s10', 'Build a portfolio page', 'Three projects with clear problem, method, result and links. Add them to your RUET Hub profile.'),
          step('s11', 'Choose: industry, or research masters', 'If research, start shortlisting supervisors and scholarships (see Study Abroad).'),
          step('s12', 'Prepare for ML interviews', 'Statistics questions, model-debugging cases, coding in Python.'),
        ],
      },
    ],
  },
  {
    id: 'embedded',
    title: 'Embedded Systems & IoT',
    icon: '🔌',
    tagline: 'Make hardware smart — sensors, microcontrollers and firmware.',
    departments: ['ECE', 'EEE', 'ETE', 'CSE'],
    overview:
      'Embedded engineers write firmware and design the electronics that run inside devices: industrial controllers, smart meters, wearables, drones and agricultural sensors. It sits between hardware and software, and demand grows with IoT and automation.',
    dayToDay: ['Writing C/C++ firmware', 'Debugging with oscilloscopes and logic analysers', 'Designing and testing PCBs', 'Connecting devices to cloud dashboards'],
    ladder: [
      { level: 'Entry', roles: ['Embedded Intern', 'Junior Firmware Engineer', 'Hardware Test Engineer'] },
      { level: 'Mid', roles: ['Embedded Software Engineer', 'IoT Engineer', 'PCB/Hardware Designer'] },
      { level: 'Senior', roles: ['Senior Firmware Engineer', 'Systems Architect', 'Hardware Lead'] },
    ],
    skills: ['C / C++', 'Microcontrollers (ARM Cortex-M, ESP32, AVR)', 'Digital & analog electronics', 'Communication protocols (I²C, SPI, UART, CAN)', 'RTOS basics', 'PCB design'],
    tools: ['Arduino IDE / PlatformIO', 'KiCad or Altium', 'Oscilloscope', 'STM32CubeIDE', 'MQTT'],
    employers: ['Electronics manufacturers', 'Telecom & energy companies', 'Automation firms', 'IoT startups', 'Defence & automotive suppliers'],
    goodFit: 'You like tinkering, soldering and seeing code make something physical move.',
    roadmap: [
      {
        id: 'p1', name: 'Foundation', weeks: '0–2 months', goal: 'Understand circuits and C.',
        steps: [
          step('s1', 'Refresh digital & analog basics', 'Logic, op-amps, power supplies, reading datasheets.'),
          step('s2', 'Learn C properly', 'Pointers, bit manipulation, memory layout, volatile and interrupts.'),
          step('s3', 'Blink, read, print', 'Arduino/ESP32: LEDs, buttons, ADC, serial output.'),
        ],
      },
      {
        id: 'p2', name: 'Core skills', weeks: '2–6 months', goal: 'Work with real peripherals and protocols.',
        steps: [
          step('s4', 'Learn I²C, SPI and UART', 'Talk to at least three different sensors/modules.'),
          step('s5', 'Move to an STM32 or similar ARM board', 'Use timers, DMA and interrupts without an Arduino abstraction.'),
          step('s6', 'Intro to an RTOS', 'FreeRTOS tasks, queues, mutexes.'),
        ],
      },
      {
        id: 'p3', name: 'Projects', weeks: '6–9 months', goal: 'Design and build a complete device.',
        steps: [
          step('s7', 'Design a custom PCB', 'Schematic, layout, order a small batch, bring it up.'),
          step('s8', 'Build a connected IoT node', 'Sensor → MQTT/LoRa → simple dashboard. Document power use.'),
          step('s9', 'Write a clear project report', 'Block diagram, schematic, firmware repo, test results.'),
        ],
      },
      {
        id: 'p4', name: 'Job hunt', weeks: '9–12 months', goal: 'Get hired or start a thesis in the area.',
        steps: [
          step('s10', 'Prepare for firmware interviews', 'C questions, bit tricks, debugging scenarios, protocol basics.'),
          step('s11', 'Connect with alumni in electronics/telecom', 'Ask which skills their teams actually screen for.'),
        ],
      },
    ],
  },
  {
    id: 'power-energy',
    title: 'Power & Renewable Energy',
    icon: '⚡',
    tagline: 'Generate, transmit and manage electricity — including solar and storage.',
    departments: ['EEE', 'ME', 'ECE'],
    overview:
      'Power engineers work in generation, transmission, distribution, industrial plants and the fast-growing renewable sector. Utilities and large industries are the stable base; solar, EV charging and energy storage are the growth areas.',
    dayToDay: ['Load-flow and protection studies', 'Plant or substation operation and maintenance', 'Designing solar/battery systems', 'Safety audits and compliance'],
    ladder: [
      { level: 'Entry', roles: ['Graduate Engineer / Trainee', 'Assistant Engineer', 'Site Engineer'] },
      { level: 'Mid', roles: ['Power Systems Engineer', 'Solar Design Engineer', 'Maintenance Engineer'] },
      { level: 'Senior', roles: ['Senior Engineer', 'Project Manager', 'Energy Consultant'] },
    ],
    skills: ['Power systems analysis', 'Power electronics', 'Protection & switchgear', 'MATLAB/Simulink', 'ETAP or PSS/E', 'Solar PV design (PVsyst)'],
    tools: ['MATLAB/Simulink', 'ETAP', 'PVsyst', 'AutoCAD Electrical'],
    employers: ['Power utilities (generation, transmission, distribution)', 'Industrial plants', 'Solar & energy developers', 'Consultancies', 'Overseas MS/PhD in power systems'],
    goodFit: 'You like large physical systems, safety-critical work, and the energy transition.',
    roadmap: [
      {
        id: 'p1', name: 'Foundation', weeks: '0–2 months', goal: 'Solid core theory.',
        steps: [
          step('s1', 'Revise machines, circuits & power-system fundamentals', 'Per-unit system, three-phase, transformers, induction and synchronous machines.'),
          step('s2', 'Learn MATLAB/Simulink basics', 'Simulate a simple converter and a basic power system.'),
        ],
      },
      {
        id: 'p2', name: 'Core skills', weeks: '2–6 months', goal: 'Industry tools and standards.',
        steps: [
          step('s3', 'Load-flow, fault analysis & protection', 'Learn the study types utilities actually run, using ETAP or similar.'),
          step('s4', 'Power electronics', 'Buck/boost converters, inverters, MPPT.'),
          step('s5', 'Solar PV design', 'Size a rooftop system by hand, then in PVsyst.'),
        ],
      },
      {
        id: 'p3', name: 'Projects & exposure', weeks: '6–9 months', goal: 'See real systems.',
        steps: [
          step('s6', 'Do a project or thesis in renewables or power electronics', 'Simulation plus a hardware prototype if possible.'),
          step('s7', 'Arrange a plant or substation visit / internship', 'Ask faculty or alumni to introduce you.'),
        ],
      },
      {
        id: 'p4', name: 'Next step', weeks: '9–12 months', goal: 'Job or masters.',
        steps: [
          step('s8', 'Prepare for utility & company recruitment tests', 'Past papers for core EEE topics; Resource Library has some.'),
          step('s9', 'Shortlist scholarships for energy masters', 'Sweden, Germany and Japan have strong programmes — see Study Abroad.'),
        ],
      },
    ],
  },
  {
    id: 'telecom',
    title: 'Telecom & Networking',
    icon: '📡',
    tagline: 'Design and run the networks that connect people and devices.',
    departments: ['ETE', 'EEE', 'CSE', 'ECE'],
    overview:
      'Telecom engineers plan, optimise and operate mobile and fixed networks — RF planning, core network, transmission, and increasingly cloud-native 5G and enterprise networking. Operators, vendors and ISPs are the main employers.',
    dayToDay: ['RF planning and drive-test analysis', 'Network optimisation and troubleshooting', 'Configuring routers/switches', 'Capacity planning and vendor coordination'],
    ladder: [
      { level: 'Entry', roles: ['Graduate Engineer (Trainee)', 'NOC Engineer', 'Field/Drive-test Engineer'] },
      { level: 'Mid', roles: ['RF Planning Engineer', 'Network Engineer', 'Transmission Engineer'] },
      { level: 'Senior', roles: ['Senior RF/Core Engineer', 'Network Architect', 'Technical Manager'] },
    ],
    skills: ['Wireless communication fundamentals', 'IP networking (TCP/IP, routing)', 'RF planning & propagation', 'Cisco/Juniper basics (CCNA level)', 'Linux & scripting', '4G/5G architecture'],
    tools: ['Cisco Packet Tracer', 'Wireshark', 'Atoll / Planet', 'Python', 'Linux'],
    employers: ['Mobile operators', 'Network vendors', 'ISPs & data centres', 'Tower companies', 'Government telecom bodies'],
    goodFit: 'You enjoy understanding how large connected systems work, and troubleshooting them.',
    roadmap: [
      {
        id: 'p1', name: 'Foundation', weeks: '0–2 months', goal: 'Networking and communication basics.',
        steps: [
          step('s1', 'Revise communication theory', 'Modulation, channel capacity, multiple access, link budgets.'),
          step('s2', 'Learn TCP/IP and routing', 'Subnetting, VLANs, OSPF/BGP basics.'),
        ],
      },
      {
        id: 'p2', name: 'Core skills', weeks: '2–6 months', goal: 'Operator-relevant skills.',
        steps: [
          step('s3', 'Prepare for CCNA', 'Even without sitting the exam, the syllabus is a strong foundation.'),
          step('s4', 'Learn 4G/5G architecture', 'RAN, core, key interfaces, what changes in 5G.'),
          step('s5', 'Linux & Python scripting', 'Automate checks and parse logs.'),
        ],
      },
      {
        id: 'p3', name: 'Projects', weeks: '6–9 months', goal: 'Hands-on evidence.',
        steps: [
          step('s6', 'Build a small lab in Packet Tracer or GNS3', 'Document the topology and configs.'),
          step('s7', 'Do an RF/antenna or propagation project', 'Simulation in HFSS/MATLAB with measured data if possible.'),
        ],
      },
      {
        id: 'p4', name: 'Job hunt', weeks: '9–12 months', goal: 'Join an operator, vendor or ISP.',
        steps: [
          step('s8', 'Target management-trainee / graduate programmes', 'Watch operator circulars; prepare for aptitude + technical tests.'),
          step('s9', 'Talk to telecom alumni', 'Ask about NOC vs planning vs core — the day-to-day differs a lot.'),
        ],
      },
    ],
  },
  {
    id: 'civil',
    title: 'Civil & Structural Engineering',
    icon: '🏗️',
    tagline: 'Design and build bridges, buildings, roads and water systems.',
    departments: ['CE', 'Arch', 'URP'],
    overview:
      'Civil engineers plan, design and supervise infrastructure. Paths include structural design consultancy, construction management, geotechnical and water-resources work, and government engineering departments. Professional registration and design-software skill are valuable.',
    dayToDay: ['Structural analysis and drawing review', 'Site supervision and quality checks', 'Estimating quantities and cost', 'Coordinating with architects and contractors'],
    ladder: [
      { level: 'Entry', roles: ['Site / Trainee Engineer', 'Junior Structural Designer', 'Assistant Engineer (public sector)'] },
      { level: 'Mid', roles: ['Structural Engineer', 'Project Engineer', 'Geotechnical Engineer'] },
      { level: 'Senior', roles: ['Senior Engineer', 'Project Manager', 'Consulting Principal'] },
    ],
    skills: ['Structural analysis & RCC design', 'ETABS / SAP2000 / STAAD', 'AutoCAD & Revit', 'Soil mechanics', 'Estimation (BoQ)', 'Building code (BNBC) knowledge'],
    tools: ['ETABS', 'SAP2000', 'AutoCAD', 'Revit', 'Primavera/MS Project'],
    employers: ['Consultancies', 'Construction firms', 'Public works / LGED / RHD / WASA', 'Real-estate developers', 'Overseas MS programmes'],
    goodFit: 'You like seeing tangible structures built and enjoy careful, code-driven design.',
    roadmap: [
      {
        id: 'p1', name: 'Foundation', weeks: '0–2 months', goal: 'Core mechanics and drawing skills.',
        steps: [
          step('s1', 'Revise structural analysis & RCC design', 'Beams, slabs, columns, load combinations.'),
          step('s2', 'Learn AutoCAD', 'Read and produce structural/architectural drawings.'),
        ],
      },
      {
        id: 'p2', name: 'Core skills', weeks: '2–6 months', goal: 'Industry design software and codes.',
        steps: [
          step('s3', 'Learn ETABS or STAAD', 'Model a multi-storey building and check results by hand.'),
          step('s4', 'Study BNBC provisions', 'Loads, seismic zoning, detailing requirements.'),
          step('s5', 'Learn estimation / BoQ', 'Prepare a quantity take-off for a small building.'),
        ],
      },
      {
        id: 'p3', name: 'Experience', weeks: '6–9 months', goal: 'Get close to real projects.',
        steps: [
          step('s6', 'Do a site internship', 'Keep a logbook: pours, formwork, inspections, problems solved.'),
          step('s7', 'Try BIM (Revit)', 'Model a project and run a clash check.'),
        ],
      },
      {
        id: 'p4', name: 'Next step', weeks: '9–12 months', goal: 'Job, public service or masters.',
        steps: [
          step('s8', 'Prepare for consultancy and public-sector exams', 'Watch circulars; practise technical + aptitude tests.'),
          step('s9', 'Consider structural/geotechnical masters abroad', 'See scholarships under Study Abroad.'),
        ],
      },
    ],
  },
  {
    id: 'mechanical',
    title: 'Mechanical, Robotics & Manufacturing',
    icon: '⚙️',
    tagline: 'Design machines, automate production and optimise operations.',
    departments: ['ME', 'IPE', 'ECE'],
    overview:
      'Mechanical and industrial engineers work in product design, manufacturing, maintenance, HVAC, automotive, robotics and operations. Automation and supply-chain optimisation are expanding areas, especially in the RMG and manufacturing sectors.',
    dayToDay: ['CAD modelling and design review', 'Production line improvement', 'Preventive maintenance planning', 'Prototyping and testing'],
    ladder: [
      { level: 'Entry', roles: ['Trainee Engineer', 'Maintenance Engineer', 'Design/CAD Engineer'] },
      { level: 'Mid', roles: ['Production Engineer', 'Automation Engineer', 'Quality Engineer'] },
      { level: 'Senior', roles: ['Plant/Operations Manager', 'Senior Design Engineer', 'Supply Chain Lead'] },
    ],
    skills: ['SolidWorks / Fusion 360', 'Thermodynamics & fluid mechanics', 'PLC & automation basics', 'Lean / Six Sigma', 'FEA basics', 'Project planning'],
    tools: ['SolidWorks', 'AutoCAD', 'ANSYS', 'PLC software', 'Excel / Python for analysis'],
    employers: ['Manufacturing & RMG', 'Power plants', 'Automotive & machinery', 'Automation integrators', 'Logistics & supply chain'],
    goodFit: 'You like physical systems, efficiency improvement and hands-on problem solving.',
    roadmap: [
      {
        id: 'p1', name: 'Foundation', weeks: '0–2 months', goal: 'Core design and analysis.',
        steps: [
          step('s1', 'Refresh thermodynamics, mechanics of materials & machine design', 'Be ready to explain core concepts in interviews.'),
          step('s2', 'Learn a CAD tool', 'SolidWorks or Fusion 360: parts, assemblies, drawings.'),
        ],
      },
      {
        id: 'p2', name: 'Core skills', weeks: '2–6 months', goal: 'Production and automation skills.',
        steps: [
          step('s3', 'Learn PLC basics', 'Ladder logic, sensors, actuators.'),
          step('s4', 'Study lean & quality methods', 'Value-stream mapping, 5S, root-cause analysis.'),
          step('s5', 'Intro to FEA', 'Run a static stress analysis and validate against hand calculation.'),
        ],
      },
      {
        id: 'p3', name: 'Projects', weeks: '6–9 months', goal: 'Build something that moves.',
        steps: [
          step('s6', 'Build a robot or automated rig', 'Arduino/ESP32 plus mechanical design; document tests.'),
          step('s7', 'Do an industry visit or internship', 'Map one production line and propose an improvement.'),
        ],
      },
      {
        id: 'p4', name: 'Next step', weeks: '9–12 months', goal: 'Job or masters.',
        steps: [
          step('s8', 'Prepare for MT / graduate programmes', 'Aptitude, technical and group-discussion rounds.'),
          step('s9', 'Explore robotics / manufacturing masters', 'Check lab fit and funding under Study Abroad.'),
        ],
      },
    ],
  },
  {
    id: 'research',
    title: 'Research & Higher Studies',
    icon: '🎓',
    tagline: 'Pursue an MS/PhD, work in a lab, or build an academic career.',
    departments: ['All'],
    overview:
      'A research path usually runs through undergraduate thesis, a funded masters or PhD, and then academia or an industrial research lab. It rewards strong grades, a clear research interest, publications and good relationships with supervisors.',
    dayToDay: ['Reading papers and forming questions', 'Running experiments or simulations', 'Writing papers and grant proposals', 'Teaching and supervising'],
    ladder: [
      { level: 'Entry', roles: ['Research Assistant', 'Lecturer', 'MS/PhD Student'] },
      { level: 'Mid', roles: ['PhD Researcher', 'Postdoc', 'Assistant Professor'] },
      { level: 'Senior', roles: ['Associate/Full Professor', 'Principal Investigator', 'Research Lead (industry)'] },
    ],
    skills: ['Reading & critiquing papers', 'Academic writing', 'Experiment/simulation design', 'Statistics', 'LaTeX & reference managers', 'Cold-emailing supervisors'],
    tools: ['Zotero', 'LaTeX/Overleaf', 'Google Scholar', 'MATLAB / Python', 'Domain-specific simulators'],
    employers: ['Universities', 'Research institutes', 'Industry R&D labs', 'Funded MS/PhD programmes abroad'],
    goodFit: 'You are curious, patient with slow progress, and like going deep into one problem.',
    roadmap: [
      {
        id: 'p1', name: 'Foundation', weeks: 'Year 3–4 of undergrad', goal: 'Find your area.',
        steps: [
          step('s1', 'Explore areas via faculty and the Research Hub', 'Talk to 3 faculty members whose work interests you.'),
          step('s2', 'Start reading papers weekly', 'Keep a short summary of each in Zotero or a notes file.', [res('Zotero', 'https://www.zotero.org/')]),
        ],
      },
      {
        id: 'p2', name: 'Build a record', weeks: 'Year 4', goal: 'Thesis and first publication.',
        steps: [
          step('s3', 'Do a strong undergraduate thesis', 'Pick a supervisor early; aim for a conference or journal submission.'),
          step('s4', 'Add publications to your RUET Hub profile', 'Even a symposium paper counts; link it so supervisors can open it.'),
          step('s5', 'Maintain a high CGPA', 'Many funded programmes screen on it.'),
        ],
      },
      {
        id: 'p3', name: 'Applications', weeks: '6–12 months before intake', goal: 'Funded offers.',
        steps: [
          step('s6', 'Take required tests (IELTS/TOEFL, GRE where needed)', 'Check each programme’s current requirements.'),
          step('s7', 'Shortlist supervisors and write personalised emails', 'Reference their recent papers specifically.'),
          step('s8', 'Prepare SOP, CV and recommendation letters', 'Ask referees at least a month ahead.'),
          step('s9', 'Apply to scholarships', 'See the Study Abroad page for current deadlines and always confirm on the official page.'),
        ],
      },
      {
        id: 'p4', name: 'Beyond', weeks: 'Ongoing', goal: 'Sustain a research career.',
        steps: [
          step('s10', 'Choose academia vs industry research', 'Talk to alumni who made each choice.'),
        ],
      },
    ],
  },
  {
    id: 'govt-mgmt',
    title: 'Management, Government & Entrepreneurship',
    icon: '🧭',
    tagline: 'Lead teams, serve the public sector, or build your own company.',
    departments: ['All'],
    overview:
      'Many engineers move into management, public service (BCS, utilities, government engineering cadres) or start businesses. These routes value communication, leadership and domain knowledge as much as technical depth.',
    dayToDay: ['Planning and coordinating projects', 'Managing budgets and stakeholders', 'Preparing policy or technical proposals', 'Pitching, selling and hiring (entrepreneurs)'],
    ladder: [
      { level: 'Entry', roles: ['Management Trainee', 'Assistant Engineer / Cadre entry', 'Startup Founder / Early team'] },
      { level: 'Mid', roles: ['Project Manager', 'Senior Officer', 'Product Manager'] },
      { level: 'Senior', roles: ['Director', 'Senior Government Officer', 'Founder / CEO'] },
    ],
    skills: ['Communication & presentation', 'Project management', 'Basic finance and accounting', 'Data-driven decision making', 'Negotiation', 'Public-sector exam preparation (if applicable)'],
    tools: ['Excel / Google Sheets', 'Notion/Jira', 'PowerPoint', 'Financial models'],
    employers: ['Corporates (MT programmes)', 'Government & public enterprises', 'Banks', 'Startups & your own venture', 'NGOs & development agencies'],
    goodFit: 'You enjoy coordinating people and decisions, and want broad impact rather than deep specialisation.',
    roadmap: [
      {
        id: 'p1', name: 'Foundation', weeks: '0–3 months', goal: 'Communication and business basics.',
        steps: [
          step('s1', 'Improve writing and speaking', 'Join a debate/presentation club; practise short structured talks.'),
          step('s2', 'Learn business basics', 'Accounting, marketing, unit economics.'),
        ],
      },
      {
        id: 'p2', name: 'Experience', weeks: '3–8 months', goal: 'Lead something.',
        steps: [
          step('s3', 'Lead a club project or event', 'Plan budget, team and timeline; write a short retrospective.'),
          step('s4', 'Do a business or product internship', 'See how decisions are made.'),
        ],
      },
      {
        id: 'p3', name: 'Direction', weeks: '8–12 months', goal: 'Choose a route and prepare.',
        steps: [
          step('s5', 'If public service: study the exam syllabus', 'Check the current circular and prepare systematically.'),
          step('s6', 'If entrepreneurship: validate an idea with 10 customers', 'Before writing code or buying equipment.'),
          step('s7', 'If corporate: prepare for MT recruitment', 'Aptitude tests, case interviews, group discussion.'),
        ],
      },
    ],
  },
]

CAREER_PATHS.forEach((p) => { p.guide = CAREER_GUIDES[p.id]; p.wiki = CAREER_GUIDES[p.id]?.wiki; p.localImage = PATH_IMAGES[p.id] || null })

export const getPath = (id) => CAREER_PATHS.find((p) => p.id === id)

export function pathProgress(path, doneSteps = []) {
  const all = path.roadmap.flatMap((ph) => ph.steps.map((s) => s.id))
  const done = all.filter((id) => doneSteps.includes(id)).length
  return { done, total: all.length, pct: all.length ? Math.round((done / all.length) * 100) : 0 }
}
