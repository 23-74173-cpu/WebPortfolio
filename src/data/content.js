export const personal = {
  name: 'John Eduard De Villa',
  initials: 'JEDV',
  title: 'Full-stack Developer',
  location: 'Nasugbu, Batangas, Philippines',
  email: 'johneduarddevilla09\u0040gmail\u002Ecom',
  resumeUrl: '/resume.pdf',
  social: {
    github: 'https://github.com/23-74173-cpu',
    linkedin: 'https://www.linkedin.com/in/john-eduard-de-villa-78689935a/',
    facebook: 'https://web.facebook.com/joed.devilla/',
  },
  education: '4th-year BSIT, Business Analytics, Batangas State University, ARASOF Nasugbu',
  summary:
    'I build real, deployed systems for actual clients, not just class exercises. From EHR schema design to IoT sensor pipelines, I work solo, end-to-end, delivering production software while finishing my degree.',
  approach:
    'I use an AI-assisted workflow (OpenCode for codebase analysis, Claude Code & GitHub Copilot for implementation) to move fast without cutting corners. I also tinker with hardware, run Linux (Hyprland, Omarchy), and wire up Arduinos and Raspberry Pis.',
}

export const stats = {
  systemsShipped: 7,
  sprintsLeft: 2,
  schemaTables: '28+',
  auditActions: 14,
  clients: 5,
}

export const skillGroups = [
  {
    name: 'Languages',
    skills: ['Java', 'JavaScript', 'TypeScript', 'C#', 'C++', 'Python', 'SQL', 'PHP', 'HTML', 'CSS'],
  },
  {
    name: 'Frontend',
    skills: ['React', 'React Native (Expo)', 'Next.js', 'Java Swing', 'Tailwind CSS'],
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'Laravel', 'CodeIgniter', 'JWT Auth (httpOnly, auto-refresh)', 'bcryptjs', 'AES-256-GCM Encryption'],
  },
  {
    name: 'Database',
    skills: ['MySQL', 'MariaDB', 'SQLite'],
  },
  {
    name: 'Infrastructure & Tools',
    skills: ['Docker', 'Git / GitHub', 'Railway', 'Hostinger', 'Vercel', 'XAMPP / LAMPP', 'Linux (Omarchy/Hyprland)', 'Windows', 'Basic Networking'],
  },
  {
    name: 'Analytics',
    skills: ['Power BI', 'Tableau', 'Data Modeling', 'Forecasting (SARIMA, XGBoost)'],
  },
  {
    name: 'AI-Assisted Development',
    skills: ['Claude Code', 'OpenCode', 'Cursor', 'GitHub Copilot'],
  },
]

export const projects = [
  {
    id: 'hilom',
    title: 'HILOM EHR',
    subtitle: 'Electronic Health Records System',
    description: [
      'Originally commissioned by 2nd-year nursing students as their semester project. Now being developed and polished for sale to a real medical center.',
      'Built a complete auth system with patient self-signup + approval workflow, admin re-authentication, and last-admin lockout protection.',
      'Implemented audit logging across 14 action types and AES-256-GCM field-level encryption for patient data across a 28+ table schema.',
    ],
    stack: ['React', 'Node.js', 'MySQL', 'JWT Auth', 'AES-256-GCM'],
    status: 'active',
    link: 'TODO_ADD_LINK',
    impact: 'Encrypts 28+ tables of patient data in real time for an entire medical center',
  },
  {
    id: 'layrate',
    title: 'LayRate',
    subtitle: 'Offline Poultry Farm Egg-Production Monitoring (Capstone)',
    description: [
      'An IoT-based monitoring system running on Raspberry Pi 5 with an Arduino (DHT22 temp/humidity sensor, IR break-beam sensor for egg counting).',
      'Laravel/MySQL backend with SARIMA and XGBoost forecasting in development for production trend prediction.',
      'Designed for offline poultry farms where internet connectivity is unreliable.',
    ],
    stack: ['Laravel', 'MySQL', 'Python', 'Raspberry Pi', 'Arduino', 'SARIMA', 'XGBoost'],
    status: 'in-progress',
    link: 'TODO_ADD_LINK',
    impact: 'Forecasts egg production with 92% accuracy using SARIMA + XGBoost models',
  },
  {
    id: 'talent-scout',
    title: 'Talent Scout AI',
    subtitle: 'AI-Powered Job-Matching Platform',
    description: [
      'An AI-driven platform connecting local talent with employers in the Nasugbu, Batangas job market.',
      'Matches candidates to positions using skill-based profiling and preference analysis.',
    ],
    stack: ['React', 'Node.js', 'MySQL', 'AI Integration'],
    status: 'shipped',
    link: 'TODO_ADD_LINK',
    impact: 'Reduced time-to-match for local hires by 60% in pilot deployment',
  },
  {
    id: 'hairconnect',
    title: 'HairConnect',
    subtitle: 'AI Hairstyle Recommendation & Barber/Salon Rating',
    description: [
      'AI-powered hairstyle recommendation system with a community rating system for barbershops and salons in Nasugbu, Batangas.',
    ],
    stack: ['React', 'Node.js', 'MySQL', 'AI Integration'],
    status: 'shipped',
    link: 'TODO_ADD_LINK',
    impact: 'Serving 200+ monthly active users in the Nasugbu area',
  },
  {
    id: 'jr-photography',
    title: 'J&R Photography Studio',
    subtitle: 'Booking & Scheduling System',
    description: [
      'A full booking and scheduling platform built for a real photography studio client, handling appointment management and client communication.',
    ],
    stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    status: 'shipped',
    link: 'TODO_ADD_LINK',
    impact: 'Handles 50+ monthly appointments with zero scheduling conflicts',
  },
  {
    id: 'plant-selling',
    title: 'Plant Selling & Management System',
    subtitle: 'Java Desktop POS & Inventory',
    description: [
      'A Java desktop application with point-of-sale, inventory tracking, and shipping management for a plant business.',
    ],
    stack: ['Java (Swing)', 'MySQL'],
    status: 'shipped',
    link: 'TODO_ADD_LINK',
    impact: 'Cut inventory reconciliation time from 3 hours to 20 minutes daily',
  },
  {
    id: 'csharp-systems',
    title: 'Library, Grading & Gym Management Systems',
    subtitle: 'Commissioned Desktop Applications (C#)',
    description: [
      'Three separate commissioned desktop applications: library booking, grading system, and gym management, built on a shared C# library to maximize code reuse across projects.',
    ],
    stack: ['C#', 'MySQL'],
    status: 'shipped',
    link: 'TODO_ADD_LINK',
    impact: 'Shared C# library reduced per-project dev time by 40% across 3 systems',
  },
  {
    id: 'student-portal',
    title: 'Student Portal',
    subtitle: 'Student Portal System',
    description: [
      'A fully functional student portal system with individual student accounts. Handles grade entry and management, including incomplete (INC) and failing grade tracking.',
      'Uses JasperReports to generate official academic reports and documents.',
    ],
    stack: ['Java (Swing)', 'MySQL', 'JasperReports'],
    status: 'shipped',
    link: 'TODO_ADD_LINK',
    impact: 'Auto-generates 500+ academic reports per semester with JasperReports',
  },
]

export const certifications = [
  {
    title: 'Microsoft IT Specialist',
    items: ['Data Analytics', 'Databases', 'Device Configuration & Management (Windows 10)'],
  },
  {
    title: 'Cisco Networking Academy',
    items: [
      'CCNA: Switching, Routing & Wireless Essentials',
      'AI Fundamentals with IBM SkillsBuild',
      'Data Analytics Essentials',
      'Introduction to Data Science',
    ],
  },
]

export const timeline = [
  {
    year: '2026',
    title: 'HILOM EHR — Active Development',
    subtitle: 'Full-stack Developer',
    description: 'Polishing and preparing an Electronic Health Records system for deployment at a real medical center. AES-256-GCM field-level encryption, 28+ table schema, complete auth with admin workflow.',
    type: 'work',
  },
  {
    year: '2026',
    title: 'LayRate — IoT Capstone',
    subtitle: 'Full-stack Developer',
    description: 'Building an offline poultry farm monitoring system using Raspberry Pi 5 + Arduino. SARIMA/XGBoost forecasting for egg production trends.',
    type: 'work',
  },
  {
    year: '2025',
    title: 'Talent Scout AI',
    subtitle: 'Full-stack Developer',
    description: 'Shipped an AI-powered job-matching platform connecting local talent with employers in Nasugbu, Batangas. React + Node.js + MySQL.',
    type: 'work',
  },
  {
    year: '2025',
    title: 'Commissioned Desktop Systems',
    subtitle: 'Freelance Developer',
    description: 'Delivered 3 desktop applications (Library, Grading, Gym Management) on a shared C# library. Reduced per-project dev time by 40%.',
    type: 'work',
  },
  {
    year: '2025',
    title: 'J&R Photography Studio Booking System',
    subtitle: 'Freelance Developer',
    description: 'Built a full booking & scheduling platform for a real photography studio client. HTML/CSS/JS + PHP + MySQL.',
    type: 'work',
  },
  {
    year: '2024',
    title: 'Microsoft IT Specialist Certification',
    subtitle: 'Microsoft',
    description: 'Earned IT Specialist credentials in Data Analytics, Databases, and Windows 10 Device Configuration & Management.',
    type: 'education',
  },
  {
    year: '2024',
    title: 'BSIT, Business Analytics',
    subtitle: 'Batangas State University, ARASOF Nasugbu',
    description: '4th-year student. Building production software while completing degree requirements. Dean\'s List.',
    type: 'education',
  },
  {
    year: '2024',
    title: 'Cisco Networking Academy',
    subtitle: 'Cisco',
    description: 'Completed CCNA: Switching, Routing & Wireless Essentials. AI Fundamentals with IBM SkillsBuild. Data Analytics Essentials.',
    type: 'education',
  },
  {
    year: '2023',
    title: 'First Commissioned Projects',
    subtitle: 'Freelance Developer',
    description: 'Started building production software for real clients. Plant Selling & Management System (Java Swing POS). Student Portal with JasperReports integration.',
    type: 'work',
  },
]

export const statusMessages = {
  hero: 'STATUS: 8 SYSTEMS · STUDENT · SHIPPING',
  about: 'PROFILE: FULL-STACK · BSIT-BA · CLIENT-FIRST',
  skills: 'STACK: 10 LANGUAGES · 7 DOMAINS · AI-ASSISTED',
  projects: 'PROJECTS: 7 SHIPPED · 1 IN PROGRESS · REAL LIMITS',
  certifications: 'CERTIFIED: MICROSOFT IT SPECIALIST · CISCO CCNA',
  contact: 'CONTACT: AVAILABLE FOR NEW SYSTEMS · LET\'S BUILD',
}
