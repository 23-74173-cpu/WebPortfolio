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
    link: null,
    impact: 'Streamlining patient data management for an entire medical center',
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
    link: null,
    impact: 'Bringing data-driven insights to offline poultry farms',
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
    link: null,
    impact: 'Connecting local talent with employers through AI-powered matching',
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
    link: null,
    impact: 'Helping users discover their perfect hairstyle with AI',
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
    link: null,
    impact: 'Simplifying appointment booking for a real photography studio',
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
    link: null,
    impact: 'Digitizing POS and inventory for a local plant business',
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
    link: null,
    impact: 'Maximizing code reuse across three commissioned desktop applications',
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
    link: null,
    impact: 'Automating academic report generation with JasperReports',
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

export const statusMessages = {
  hero: 'STATUS: 8 SYSTEMS · STUDENT · SHIPPING',
  about: 'PROFILE: FULL-STACK · BSIT-BA · CLIENT-FIRST',
  skills: 'STACK: 10 LANGUAGES · 7 DOMAINS · AI-ASSISTED',
  projects: 'PROJECTS: 7 SHIPPED · 1 IN PROGRESS · REAL LIMITS',
  certifications: 'CERTIFIED: MICROSOFT IT SPECIALIST · CISCO CCNA',
  contact: 'CONTACT: AVAILABLE FOR NEW SYSTEMS · LET\'S BUILD',
}
