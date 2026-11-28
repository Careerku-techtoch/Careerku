import type { Opportunity, StudentProfile, TrackedApplication } from '@/types'

export const DEFAULT_STUDENT_PROFILE: StudentProfile = {
  name: 'Raka Pratama',
  email: 'raka.pratama@university.ac.id',
  university: 'Bandung Institute of Technology',
  major: 'Computer Science',
  semester: 5,
  gpa: 3.62,
  skills: [
    'React',
    'TypeScript',
    'Tailwind CSS',
    'Node.js',
    'SQL',
    'Git',
    'REST API',
    'Problem Solving',
    'Team Communication',
  ],
  interests: [
    'Frontend Engineering',
    'Product Development',
    'AI Applications',
    'Leadership Scholarships',
  ],
  preferredCategories: ['internship', 'competition', 'scholarship'],
  experiences: [
    {
      id: 'exp-1',
      role: 'Technology Division Staff',
      organization: 'Computer Science Student Association',
      period: '2025 – Present',
      summary:
        'Built the campus event portal and registration workflow using React, TypeScript, and Express.js.',
    },
    {
      id: 'exp-2',
      role: 'Web Programming Lab Assistant',
      organization: 'Software Engineering Laboratory',
      period: 'Semester 4',
      summary:
        'Mentored 35 undergraduate students on responsive web apps and conducted weekly code reviews.',
    },
  ],
}

export const SUGGESTED_SKILLS: string[] = [
  'Next.js',
  'Docker',
  'Python',
  'PostgreSQL',
  'Testing (Vitest/Jest)',
  'Figma',
  'Go',
  'Redis',
  'Data Visualization',
  'Machine Learning',
  'Product Thinking',
  'Public Speaking',
  'Leadership',
  'System Design',
]

export const MOCK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-goto-fe',
    title: 'Software Engineer Intern (Frontend)',
    organization: 'GoTo Financial',
    orgInitials: 'GT',
    orgAccent: '#2d6b4e',
    category: 'internship',
    typeLabel: 'Internship • Hybrid',
    workMode: 'Hybrid',
    location: 'South Jakarta',
    summary:
      'Build large-scale fintech web interfaces with React, TypeScript, and modern accessibility standards.',
    description:
      'A 6-month internship with the GoTo Financial Web Platform team. You will collaborate with Product Designers and Backend Engineers to ship merchant dashboard features, optimize rendering performance, and write automated unit tests.',
    deadline: '2026-12-15',
    verifiedAt: '2026-11-23T09:15:00+07:00',
    sourceUrl: 'https://careers.gotocompany.com/',
    sourceName: 'GoTo Careers (AI + OCR Verified)',
    benefitLabel: 'Paid Stipend + Academic Credit Conversion',
    requirements: {
      minGpa: 3.2,
      minSemester: 5,
      maxSemester: 8,
      allowedMajors: ['Computer Science', 'Informatics', 'Information Systems'],
      technicalSkills: [
        'React',
        'TypeScript',
        'Tailwind CSS',
        'REST API',
        'Git',
        'Testing (Vitest/Jest)',
      ],
      softSkills: ['Team Communication', 'Problem Solving'],
      otherRequirements: [
        'Active undergraduate (S1) student, minimum semester 5',
        'Available for a 5–6 month hybrid internship in Jakarta',
        'Active GitHub portfolio showcasing web projects',
      ],
    },
    defaultDocuments: [
      {
        id: 'doc-cv',
        label: 'ATS-Friendly CV (PDF)',
        category: 'cv',
        required: true,
        tip: 'Highlight React/TypeScript projects with measurable outcomes such as load-time improvements or active users.',
      },
      {
        id: 'doc-portfolio',
        label: 'GitHub & Live Portfolio Links',
        category: 'portfolio',
        required: true,
        tip: 'Ensure at least 2 repositories include a clean README, UI previews, and setup instructions.',
      },
      {
        id: 'doc-ml',
        label: 'Motivation Letter / Cover Note',
        category: 'motivation_letter',
        required: false,
        tip: 'Explain your interest in fintech products and the frontend challenges you hope to tackle.',
      },
      {
        id: 'doc-transcript',
        label: 'Latest Academic Transcript',
        category: 'academic',
        required: true,
        tip: 'Download your latest unofficial transcript from your university portal to verify GPA and semester.',
      },
    ],
    cvHighlights: [
      'Highlight experience building React + TypeScript apps with clean state management.',
      'Include quantified impact (e.g., mentoring 35 lab students or reducing page load time).',
      'Place direct links to live demos and GitHub repositories in your CV header.',
    ],
    motivationLetterPrompts: [
      'Why are you excited to contribute to GoTo Financial’s digital payment ecosystem?',
      'Describe the toughest frontend bug or performance bottleneck you have resolved.',
      'What key engineering milestones do you aim to achieve during this 6-month internship?',
    ],
    aiImprovementMeta: {
      adviceSummary:
        'Your academic eligibility and React + TypeScript foundation are already strong. Adding unit tests (Vitest/Jest) to a portfolio project will significantly boost your technical screening readiness.',
      prioritySkills: [
        {
          skill: 'Testing (Vitest/Jest)',
          reason:
            'Large engineering teams require unit and component test coverage before merging production PRs.',
          resourceHint:
            'Practice React Testing Library + Vitest to test user interactions, forms, and API mocks.',
        },
        {
          skill: 'Next.js',
          reason:
            'Strong bonus for understanding SSR, caching strategies, and Core Web Vitals optimization.',
          resourceHint: 'Explore App Router patterns and client/server component boundaries.',
        },
      ],
      portfolioIdeas: [
        {
          id: 'proj-goto-1',
          title: 'Merchant Analytics Dashboard with 80%+ Test Coverage',
          description:
            'Build a mini merchant transaction dashboard with React, TypeScript, and Zod validation, backed by a Vitest suite covering filters, search, and error states.',
          estimatedDuration: '1–2 Weeks',
          targetSkills: ['Testing (Vitest/Jest)', 'TypeScript', 'React'],
          deliverable: 'GitHub repo with passing CI workflow + live Vercel deployment.',
        },
      ],
    },
  },
  {
    id: 'opp-traveloka-pm',
    title: 'Product Management Intern',
    organization: 'Traveloka',
    orgInitials: 'TV',
    orgAccent: '#366882',
    category: 'internship',
    typeLabel: 'Internship • Hybrid',
    workMode: 'Hybrid',
    location: 'BSD, Tangerang',
    summary:
      'Support user research, PRD drafting, SQL funnel analysis, and cross-functional sprint coordination.',
    description:
      'As a Product Management Intern in the Accommodation & Experience squad, you will analyze user behavior datasets, frame A/B experiment hypotheses, and partner closely with Engineering and Design.',
    deadline: '2026-12-08',
    verifiedAt: '2026-11-23T08:40:00+07:00',
    sourceUrl: 'https://www.traveloka.com/en-id/careers',
    sourceName: 'Traveloka Careers (Verified)',
    benefitLabel: 'Paid Internship + PM Mentorship',
    requirements: {
      minGpa: 3.3,
      minSemester: 5,
      maxSemester: 8,
      allowedMajors: ['All Majors'],
      technicalSkills: ['SQL', 'Product Thinking', 'Figma', 'Data Visualization'],
      softSkills: ['Team Communication', 'Problem Solving', 'Leadership'],
      otherRequirements: [
        'Undergraduate student in semesters 5–8 from any major',
        'Comfortable writing structured specs and presenting data insights',
      ],
    },
    defaultDocuments: [
      {
        id: 'doc-cv',
        label: 'Product & Impact-Focused CV',
        category: 'cv',
        required: true,
        tip: 'Emphasize project leadership, user discovery, or turning data into product decisions.',
      },
      {
        id: 'doc-ml',
        label: 'Motivation Letter & Mini Product Case',
        category: 'motivation_letter',
        required: true,
        tip: 'Propose one improvement idea for a travel booking flow complete with target success metrics.',
      },
      {
        id: 'doc-portfolio',
        label: 'Product Case Study / Mini PRD',
        category: 'portfolio',
        required: true,
        tip: 'Prepare a 2–3 page case study covering problem statement, personas, Figma wireframes, and KPIs.',
      },
    ],
    cvHighlights: [
      'Highlight cross-functional teamwork in student organizations alongside your technical SQL background.',
      'Structure experience bullet points using the STAR (Situation, Task, Action, Result) format.',
    ],
    motivationLetterPrompts: [
      'Which Traveloka feature do you use most, and how would you improve its user retention?',
      'How does your technical background help you collaborate effectively with engineers?',
    ],
    aiImprovementMeta: {
      adviceSummary:
        'Your SQL fluency and engineering background give you a great edge for PM roles, but you need concrete evidence of Product Thinking, Figma wireframing, and metric visualization.',
      prioritySkills: [
        {
          skill: 'Product Thinking',
          reason:
            'PM interviews evaluate how you prioritize user pain points using frameworks like RICE or ICE.',
          resourceHint: 'Practice writing a crisp 1-page PRD and defining North Star Metrics.',
        },
        {
          skill: 'Figma',
          reason:
            'Used to communicate user flows and low-fidelity wireframes before handing off to designers.',
          resourceHint: 'Design a 4–5 screen wireframe flow for a student travel feature.',
        },
        {
          skill: 'Data Visualization',
          reason:
            'Helps translate SQL query outputs into clear business insights for stakeholders.',
          resourceHint: 'Build a simple conversion funnel dashboard in Looker Studio or Metabase.',
        },
      ],
      portfolioIdeas: [
        {
          id: 'proj-tv-1',
          title: 'Product Teardown & Mini-PRD: Student Budget Stay Discovery',
          description:
            'Audit the budget accommodation search experience, wireframe an improved flow in Figma, and define A/B test metrics and projected conversion impact.',
          estimatedDuration: '1 Week',
          targetSkills: ['Product Thinking', 'Figma', 'Data Visualization'],
          deliverable: 'PDF/Notion product case study + interactive Figma prototype link.',
        },
      ],
    },
  },
  {
    id: 'opp-mandiri-da',
    title: 'Data Analyst & BI Intern',
    organization: 'Bank Mandiri',
    orgInitials: 'BM',
    orgAccent: '#26496b',
    category: 'internship',
    typeLabel: 'Internship • On-site',
    workMode: 'On-site',
    location: 'Central Jakarta',
    summary:
      'Process digital banking datasets with SQL & Python and build executive KPI dashboards.',
    description:
      'Join the Enterprise Data Analytics team to clean transaction datasets, automate reporting queries, and visualize digital banking adoption trends for management.',
    deadline: '2026-12-20',
    verifiedAt: '2026-11-22T16:20:00+07:00',
    sourceUrl: 'https://www.bankmandiri.co.id/mandiri-career',
    sourceName: 'Mandiri Career Portal',
    benefitLabel: 'Monthly Allowance + Official Certificate',
    requirements: {
      minGpa: 3.25,
      minSemester: 5,
      maxSemester: 8,
      allowedMajors: [
        'Computer Science',
        'Statistics',
        'Mathematics',
        'Information Systems',
        'Industrial Engineering',
      ],
      technicalSkills: ['SQL', 'Python', 'Data Visualization', 'PostgreSQL'],
      softSkills: ['Problem Solving', 'Team Communication'],
      otherRequirements: [
        'Proficient in SQL joins, window functions, and aggregations',
        'Familiar with BI tools (Tableau, Power BI, or Looker Studio)',
      ],
    },
    defaultDocuments: [
      {
        id: 'doc-cv',
        label: 'Data Analytics Focused CV',
        category: 'cv',
        required: true,
        tip: 'List analytics tools (SQL, Python, BI) and showcase end-to-end dataset explorations.',
      },
      {
        id: 'doc-transcript',
        label: 'Latest Academic Transcript',
        category: 'academic',
        required: true,
        tip: 'Make sure database, probability, or statistics coursework is clearly visible.',
      },
      {
        id: 'doc-portfolio',
        label: 'Analytics Notebook / BI Dashboard',
        category: 'portfolio',
        required: true,
        tip: 'Include at least 1 exploratory case study with concise, actionable business takeaways.',
      },
    ],
    cvHighlights: [
      'Highlight your SQL skills and pair them with an end-to-end data exploration project.',
      'Emphasize translating raw metrics into clear operational recommendations.',
    ],
    motivationLetterPrompts: [
      'How can data analytics improve digital banking retention among university students?',
    ],
    aiImprovementMeta: {
      adviceSummary:
        'Your GPA, major, and SQL fundamentals meet the baseline requirements. Prioritize adding a Python (pandas) cleaning workflow and an interactive BI dashboard to close the remaining gap.',
      prioritySkills: [
        {
          skill: 'Python',
          reason:
            'Core tool for data cleaning (pandas/numpy) and automating recurring analytical pipelines.',
          resourceHint:
            'Run a cohort & churn analysis notebook on a public Kaggle financial dataset.',
        },
        {
          skill: 'Data Visualization',
          reason:
            'Primary deliverable of BI interns is turning query outputs into clear executive dashboards.',
          resourceHint:
            'Connect a PostgreSQL dataset to Looker Studio or Power BI and track 5 key KPIs.',
        },
      ],
      portfolioIdeas: [
        {
          id: 'proj-bm-1',
          title: 'Digital Wallet Retention & Cohort Dashboard',
          description:
            'Use PostgreSQL and Python to compute monthly user retention on synthetic transaction records, then publish key business insights as an interactive dashboard.',
          estimatedDuration: '10 Days',
          targetSkills: ['Python', 'PostgreSQL', 'Data Visualization'],
          deliverable: 'GitHub Jupyter Notebook + public interactive dashboard link.',
        },
      ],
    },
  },
  {
    id: 'opp-tokopedia-be',
    title: 'Backend Cloud Engineer Intern',
    organization: 'Tokopedia',
    orgInitials: 'TK',
    orgAccent: '#3d7453',
    category: 'internship',
    typeLabel: 'Internship • Hybrid',
    workMode: 'Hybrid',
    location: 'South Jakarta',
    summary:
      'Design low-latency microservices using Go, Redis, PostgreSQL, and Docker containers.',
    description:
      'Learn distributed systems engineering at high transaction scale. You will build high-throughput API endpoints, Redis caching layers, and observability pipelines.',
    deadline: '2026-12-28',
    verifiedAt: '2026-11-23T10:05:00+07:00',
    sourceUrl: 'https://www.tokopedia.com/careers/',
    sourceName: 'Tokopedia Careers (OCR Poster + Official Link)',
    benefitLabel: 'Paid Internship + Full-Time Fast Track',
    requirements: {
      minGpa: 3.3,
      minSemester: 6,
      maxSemester: 8,
      allowedMajors: ['Computer Science', 'Informatics', 'Electrical Engineering'],
      technicalSkills: ['Go', 'Docker', 'Redis', 'PostgreSQL', 'System Design', 'REST API'],
      softSkills: ['Problem Solving', 'Team Communication'],
      otherRequirements: [
        'Preferred semester 6 and above',
        'Solid grasp of concurrency, caching, and relational database indexing',
      ],
    },
    defaultDocuments: [
      {
        id: 'doc-cv',
        label: 'Backend / Software Engineering CV',
        category: 'cv',
        required: true,
        tip: 'Focus on backend APIs, database query optimization, and service architecture.',
      },
      {
        id: 'doc-portfolio',
        label: 'Microservice / Backend API Repository',
        category: 'portfolio',
        required: true,
        tip: 'Include a Dockerfile, OpenAPI/Swagger documentation, and basic benchmark results.',
      },
      {
        id: 'doc-ml',
        label: 'Technical Motivation Letter',
        category: 'motivation_letter',
        required: false,
        tip: 'Share your motivation for building scalable, high-reliability backend systems.',
      },
    ],
    cvHighlights: [
      'Position your Node.js & SQL experience as a solid foundation for learning Go microservices.',
      'Add containerization and caching demos to stand out during technical screening.',
    ],
    motivationLetterPrompts: [
      'How has building REST APIs prepared you to work with Go, Redis, and distributed systems?',
    ],
    aiImprovementMeta: {
      adviceSummary:
        'This role currently shows a significant skill and semester gap (Go, Docker, Redis, System Design, and minimum semester 6). It is an ideal 1–2 month upskilling target.',
      prioritySkills: [
        {
          skill: 'Docker',
          reason:
            'Essential for reproducible local development and containerized microservice deployments.',
          resourceHint:
            'Write a Dockerfile and docker-compose setup running an API + PostgreSQL + Redis.',
        },
        {
          skill: 'Go',
          reason:
            'Primary backend language powering high-concurrency services at Tokopedia.',
          resourceHint: 'Build a lightweight CRUD REST API with Go (Gin or Fiber) and goroutines.',
        },
        {
          skill: 'Redis',
          reason: 'Core layer for response caching and rate limiting under traffic spikes.',
          resourceHint: 'Implement a cache-aside pattern and sliding-window rate limiter.',
        },
      ],
      portfolioIdeas: [
        {
          id: 'proj-tk-1',
          title: 'Flash-Sale Inventory API with Go, Redis Rate Limiter & Docker',
          description:
            'Build a traffic-resilient stock API in Go backed by PostgreSQL persistence, Redis caching/rate limiting, and Docker Compose orchestration.',
          estimatedDuration: '2–3 Weeks',
          targetSkills: ['Go', 'Docker', 'Redis', 'PostgreSQL', 'System Design'],
          deliverable: 'GitHub repo + architecture diagram + k6 load-test summary.',
        },
      ],
    },
  },
  {
    id: 'opp-gemastik-rpl',
    title: 'GEMASTIK XIX — Software Engineering Division',
    organization: 'Kemendikbudristek',
    orgInitials: 'GM',
    orgAccent: '#9f7235',
    category: 'competition',
    typeLabel: 'National Competition • Online',
    workMode: 'Online',
    location: 'National (Offline Finals)',
    summary:
      'National undergraduate software engineering competition tackling real-world campus and civic challenges.',
    description:
      'The National Student ICT Exhibition (GEMASTIK) Software Engineering division challenges teams of up to 3 undergraduates to design, build, and pitch high-impact software products.',
    deadline: '2026-12-05',
    verifiedAt: '2026-11-23T07:50:00+07:00',
    sourceUrl: 'https://pusatprestasinasional.kemdikbud.go.id/',
    sourceName: 'Official Puspresnas Portal',
    benefitLabel: 'National Medals + Coaching + Prize Grant',
    requirements: {
      minGpa: 3.0,
      minSemester: 1,
      maxSemester: 8,
      allowedMajors: ['All Majors'],
      technicalSkills: ['React', 'Node.js', 'Git', 'REST API'],
      softSkills: ['Problem Solving', 'Team Communication'],
      otherRequirements: [
        'Team of up to 3 active S1 students from the same university',
        'Endorsed by an official faculty advisor',
      ],
    },
    defaultDocuments: [
      {
        id: 'doc-proposal',
        label: 'Project Proposal & System Architecture (PDF)',
        category: 'portfolio',
        required: true,
        tip: 'Include data-backed problem framing, system architecture diagram, and user testing plan.',
      },
      {
        id: 'doc-ktm',
        label: 'Student IDs & Active Enrollment Letters',
        category: 'academic',
        required: true,
        tip: 'Verify that every team member’s ID and name matches official university records.',
      },
      {
        id: 'doc-video',
        label: 'Prototype Demo Video Link (Max 5 min)',
        category: 'other',
        required: true,
        tip: 'Demonstrate the core user journey clearly without a lengthy intro.',
      },
      {
        id: 'doc-cv',
        label: 'Team Member Mini CVs',
        category: 'cv',
        required: false,
        tip: 'Summarize each member’s role (Frontend, Backend, UI/UX) in the proposal appendix.',
      },
    ],
    cvHighlights: [
      'Clarify technical role ownership across every team member.',
      'Include evidence of campus user validation and prototype testing.',
    ],
    motivationLetterPrompts: [
      'What measurable impact does your software solution deliver for its target users?',
    ],
  },
  {
    id: 'opp-compfest-pic',
    title: 'COMPFEST 18 — Product Innovation Challenge',
    organization: 'Fasilkom UI',
    orgInitials: 'CF',
    orgAccent: '#4d556b',
    category: 'competition',
    typeLabel: 'National Competition • Hybrid',
    workMode: 'Hybrid',
    location: 'Depok / Online',
    summary:
      'Digital product innovation competition spanning problem validation, UI/UX prototyping, and industry pitching.',
    description:
      'Product Innovation Challenge invites cross-disciplinary student teams to design creative digital products, craft go-to-market strategies, and validate prototypes directly with users.',
    deadline: '2026-12-12',
    verifiedAt: '2026-11-22T20:10:00+07:00',
    sourceUrl: 'https://compfest.id/',
    sourceName: 'COMPFEST Official (Verified)',
    benefitLabel: 'Cash Prizes + Industry Mentorship',
    requirements: {
      minGpa: 2.75,
      minSemester: 1,
      maxSemester: 8,
      allowedMajors: ['All Majors'],
      technicalSkills: ['Figma', 'Product Thinking', 'React'],
      softSkills: ['Team Communication', 'Problem Solving', 'Public Speaking'],
      otherRequirements: [
        'Team of 2–3 active undergraduate students',
        'Original submission that has not won prior similar contests',
      ],
    },
    defaultDocuments: [
      {
        id: 'doc-deck',
        label: 'Pitch Deck & Business Model Canvas',
        category: 'portfolio',
        required: true,
        tip: 'Keep it concise (max 12 slides): problem, user insights, solution, prototype, and validation.',
      },
      {
        id: 'doc-ktm',
        label: 'Team Student ID Cards (Combined PDF)',
        category: 'academic',
        required: true,
        tip: 'Merge all team members’ student IDs into a single clear PDF file.',
      },
      {
        id: 'doc-cv',
        label: 'Team Profile & Short CVs',
        category: 'cv',
        required: false,
        tip: 'Showcase a balanced Hacker / Hustler / Hipster skill mix.',
      },
    ],
    cvHighlights: ['Highlight shipped product work and real user-testing outcomes.'],
    motivationLetterPrompts: [
      'Why is your digital product solution timely and ready for real-world adoption?',
    ],
  },
  {
    id: 'opp-bca-finhacks',
    title: 'BCA Finhacks AI — National Hackathon',
    organization: 'Bank Central Asia',
    orgInitials: 'BC',
    orgAccent: '#2e5a7d',
    category: 'competition',
    typeLabel: 'Hackathon • Hybrid',
    workMode: 'Hybrid',
    location: 'Jakarta / Online',
    summary:
      '48-hour AI & financial analytics hackathon focused on youth financial literacy and inclusion.',
    description:
      'An intensive hackathon for university builders to ship AI/LLM-powered MVPs addressing personal finance literacy, anomaly detection, or personalized student banking.',
    deadline: '2026-12-22',
    verifiedAt: '2026-11-23T11:00:00+07:00',
    sourceUrl: 'https://finhacks.id/',
    sourceName: 'BCA Finhacks Official',
    benefitLabel: 'Grand Prize + IT Recruitment Fast Track',
    requirements: {
      minGpa: 3.0,
      minSemester: 3,
      maxSemester: 8,
      allowedMajors: [
        'Computer Science',
        'Informatics',
        'Information Systems',
        'Statistics',
        'Mathematics',
      ],
      technicalSkills: ['Python', 'Machine Learning', 'REST API', 'React'],
      softSkills: ['Problem Solving', 'Team Communication'],
      otherRequirements: [
        'Team of 2–4 members',
        'Available for weekend hacking and final pitching sessions',
      ],
    },
    defaultDocuments: [
      {
        id: 'doc-idea',
        label: 'AI Solution Executive Summary (2 Pages)',
        category: 'portfolio',
        required: true,
        tip: 'Explain the LLM/ML pipeline architecture and how user data privacy is protected.',
      },
      {
        id: 'doc-cv',
        label: 'Technical CVs of Team Members',
        category: 'cv',
        required: true,
        tip: 'Include GitHub links and relevant web or AI projects.',
      },
      {
        id: 'doc-ktm',
        label: 'Proof of Active Student Status',
        category: 'academic',
        required: true,
        tip: 'Attach student ID or current semester study plan.',
      },
    ],
    cvHighlights: [
      'Highlight rapid MVP execution (React + REST API) and practical AI API integration.',
    ],
    motivationLetterPrompts: [
      'What concrete financial challenge does your team’s AI prototype solve?',
    ],
  },
  {
    id: 'opp-beasiswa-bi',
    title: 'Bank Indonesia Scholarship (GenBI) Regular S1',
    organization: 'Bank Indonesia',
    orgInitials: 'BI',
    orgAccent: '#284f6e',
    category: 'scholarship',
    typeLabel: 'S1 Scholarship • National',
    workMode: 'On-site',
    location: 'Partner Universities',
    summary:
      'Monthly education stipend paired with membership in the Generasi Baru Indonesia (GenBI) leadership network.',
    description:
      'Flagship Bank Indonesia scholarship for high-achieving undergraduates with strong social commitment, offering monthly financial aid plus national leadership training and community impact programs.',
    deadline: '2026-12-10',
    verifiedAt: '2026-11-23T08:00:00+07:00',
    sourceUrl: 'https://www.bi.go.id/',
    sourceName: 'Campus Student Affairs & Official BI',
    benefitLabel: 'Monthly Stipend + GenBI Leadership Network',
    requirements: {
      minGpa: 3.0,
      minSemester: 3,
      maxSemester: 7,
      allowedMajors: ['All Majors'],
      technicalSkills: [],
      softSkills: ['Team Communication', 'Leadership', 'Problem Solving'],
      otherRequirements: [
        'Completed at least 40 credits (min. semester 3)',
        'Active in campus organizations or community service',
        'Not currently receiving another scholarship',
      ],
    },
    defaultDocuments: [
      {
        id: 'doc-cv',
        label: 'Academic & Organization CV',
        category: 'cv',
        required: true,
        tip: 'Highlight social impact, committees, and leadership roles on campus.',
      },
      {
        id: 'doc-ml',
        label: 'Motivation Letter',
        category: 'motivation_letter',
        required: true,
        tip: 'Outline how you plan to contribute to GenBI initiatives and connect your studies to community impact.',
      },
      {
        id: 'doc-transcript',
        label: 'Stamped Transcript & Latest Grade Report',
        category: 'academic',
        required: true,
        tip: 'Request faculty endorsement at least 5 days before the deadline.',
      },
      {
        id: 'doc-rec',
        label: 'Recommendation Letter from Faculty Advisor',
        category: 'other',
        required: true,
        tip: 'Reach out to your academic advisor early and attach your updated CV.',
      },
    ],
    cvHighlights: [
      'Balance strong academic standing (GPA 3.62) with active student association and lab assistantship roles.',
      'Include a dedicated Community Service / Volunteering section if available.',
    ],
    motivationLetterPrompts: [
      'How can your academic field support GenBI’s financial literacy and community programs?',
      'Describe a leadership experience that shaped your character during university.',
    ],
  },
  {
    id: 'opp-djarum-plus',
    title: 'Djarum Beasiswa Plus — Beswan Djarum',
    organization: 'Djarum Foundation',
    orgInitials: 'DJ',
    orgAccent: '#2d3330',
    category: 'scholarship',
    typeLabel: 'Scholarship & Soft Skills',
    workMode: 'Hybrid',
    location: 'National (Partner Campuses)',
    summary:
      'One-year merit scholarship paired with intensive Character Building, Leadership, and Nation Building training.',
    description:
      'A merit scholarship for semester 4–6 undergraduates that combines 12-month financial support with structured soft-skill workshops, leadership bootcamps, and a national essay competition.',
    deadline: '2026-12-30',
    verifiedAt: '2026-11-22T18:45:00+07:00',
    sourceUrl: 'https://djarumbeasiswaplus.org/',
    sourceName: 'Djarum Beasiswa Plus Official',
    benefitLabel: '1-Year Stipend + Soft-Skills Training',
    requirements: {
      minGpa: 3.2,
      minSemester: 4,
      maxSemester: 6,
      allowedMajors: ['All Majors'],
      technicalSkills: [],
      softSkills: ['Public Speaking', 'Leadership', 'Team Communication'],
      otherRequirements: [
        'Undergraduate student in semesters 4–6 with minimum GPA 3.20',
        'Actively involved in campus or external organizations',
      ],
    },
    defaultDocuments: [
      {
        id: 'doc-cv',
        label: 'Achievement & Organization CV',
        category: 'cv',
        required: true,
        tip: 'Include organizational roles, committees, and academic/non-academic honors.',
      },
      {
        id: 'doc-ml',
        label: 'Motivation & National Impact Essay',
        category: 'motivation_letter',
        required: true,
        tip: 'Present an authentic idea on how your skills can address real challenges in society.',
      },
      {
        id: 'doc-transcript',
        label: 'Certified Transcript (Semester 1–Latest)',
        category: 'academic',
        required: true,
        tip: 'Verify that your cumulative GPA of at least 3.20 is clearly displayed.',
      },
      {
        id: 'doc-org',
        label: 'Copies of Organization / Committee Certificates',
        category: 'other',
        required: true,
        tip: 'Select your 3–5 strongest certificates demonstrating active contribution.',
      },
    ],
    cvHighlights: [
      'Feature your Student Association tech role and Web Programming Lab Assistant mentorship.',
    ],
    motivationLetterPrompts: [
      'Which soft skills are you most eager to sharpen through the Beswan Djarum program?',
      'What social or technology initiative would you build alongside fellow scholars?',
    ],
  },
]

export function createInitialTrackedApplications(): TrackedApplication[] {
  const gotoOpp = MOCK_OPPORTUNITIES.find((item) => item.id === 'opp-goto-fe')
  const biOpp = MOCK_OPPORTUNITIES.find((item) => item.id === 'opp-beasiswa-bi')
  const gemastikOpp = MOCK_OPPORTUNITIES.find((item) => item.id === 'opp-gemastik-rpl')

  const initial: TrackedApplication[] = []

  if (gotoOpp) {
    initial.push({
      opportunityId: gotoOpp.id,
      status: 'preparing',
      savedAt: '2026-11-20T10:00:00+07:00',
      updatedAt: '2026-11-22T15:30:00+07:00',
      documents: gotoOpp.defaultDocuments.map((doc, idx) => ({
        ...doc,
        completed: idx < 2,
      })),
      notes: 'Add Vitest unit tests to the portfolio repo before submitting.',
      cvDraftNote: 'Updated Lab Assistantship and Student Association portal metrics.',
      motivationLetterDraft:
        'I am excited to apply for the Frontend Software Engineer Intern role at GoTo Financial because I enjoy crafting fast, accessible web interfaces...',
    })
  }

  if (biOpp) {
    initial.push({
      opportunityId: biOpp.id,
      status: 'saved',
      savedAt: '2026-11-21T14:15:00+07:00',
      updatedAt: '2026-11-21T14:15:00+07:00',
      documents: biOpp.defaultDocuments.map((doc, idx) => ({
        ...doc,
        completed: idx === 0,
      })),
      notes: 'Schedule faculty advisor signature for recommendation letter this week.',
      cvDraftNote: '',
      motivationLetterDraft: '',
    })
  }

  if (gemastikOpp) {
    initial.push({
      opportunityId: gemastikOpp.id,
      status: 'applied',
      savedAt: '2026-11-18T09:00:00+07:00',
      updatedAt: '2026-11-22T19:00:00+07:00',
      documents: gemastikOpp.defaultDocuments.map((doc) => ({
        ...doc,
        completed: true,
      })),
      notes: 'Proposal PDF and demo video uploaded to the campus submission portal.',
      cvDraftNote: 'Full 3-member team confirmed (Frontend, Backend, UI/UX).',
      motivationLetterDraft: '',
    })
  }

  return initial
}
