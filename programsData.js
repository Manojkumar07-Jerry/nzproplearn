// Nexus GenZ Technology Courses & Training Programs Dataset

export const PROGRAM_CATEGORIES = [
  { id: 'all', label: 'All Programs' },
  { id: 'python', label: 'Python Programming' },
  { id: 'ai', label: 'AI & Generative AI' },
  { id: 'cybersecurity', label: 'Cybersecurity & Safety' },
  { id: 'webdev', label: 'Web Development' },
  { id: 'data', label: 'Data Analytics & Science' }
];

export const AUDIENCE_CATEGORIES = [
  { id: 'all', label: 'All Audiences', icon: 'Globe' },
  { id: 'School', label: 'School Students', icon: 'GraduationCap', description: 'Digital literacy, cyber safety, AI, coding & creativity.' },
  { id: 'College', label: 'College Students', icon: 'BookOpen', description: 'Programming, AI, cybersecurity, web dev, data & career readiness.' },
  { id: 'IT Roles', label: 'Roles in IT Companies', icon: 'Briefcase', description: 'Role-based upskilling for Software Engineers, Cyber Analysts, AI Engineers & Data Scientists.' }
];

export const DIFFICULTY_LEVELS = [
  { id: 'all', label: 'All Levels' },
  { id: 'EASY', label: 'EASY', color: 'emerald', badge: '🟢 EASY', tag: 'Beginner / Foundation / Awareness' },
  { id: 'MODERATE', label: 'MODERATE', color: 'amber', badge: '🟡 MODERATE', tag: 'Intermediate / Practical / Skill Development' },
  { id: 'HARD', label: 'HARD', color: 'red', badge: '🔴 HARD', tag: 'Advanced / Industry-Oriented / Project-Based' }
];

export const TECHNOLOGY_DOMAINS = [
  'All Domains',
  'Python',
  'AI',
  'Cybersecurity',
  'Web Development',
  'Data Analytics'
];

export const PROGRAM_TYPES = [
  'All Types',
  'Awareness',
  'Workshop',
  'Course',
  'Hands-on Workshop',
  'Project',
  'Corporate Training'
];

export const DURATIONS = [
  'All Durations',
  '1–2 Hours',
  'Half Day',
  '1 Day',
  '2–3 Days',
  '1 Week',
  '2 Weeks',
  '1 Month',
  'Custom'
];

export const MODES = [
  'All Modes',
  'Online'
];

// Interactive Visual Learning Paths for the 5 Technology Domains
export const LEARNING_PATHS = [
  {
    id: 'python-path',
    title: '🐍 Python Learning Path',
    domain: 'Python',
    description: 'Master Python from fundamentals and OOP applications to scalable production backend systems.',
    nodes: [
      { step: 1, title: 'Python Programming Fundamentals', level: 'EASY', audience: 'School/College', duration: '1 Week', code: 'python-easy' },
      { step: 2, title: 'Intermediate Python & Application Development', level: 'MODERATE', audience: 'College', duration: '2 Weeks', code: 'python-moderate' },
      { step: 3, title: 'Advanced Python & Software Development', level: 'HARD', audience: 'College/IT Company', duration: '1 Month', code: 'python-hard' }
    ]
  },
  {
    id: 'ai-path',
    title: '🤖 AI Learning Path',
    domain: 'AI',
    description: 'Demystify LLMs, Prompt Engineering, RAG vector search, AI agents, fine-tuning, and multi-agent systems.',
    nodes: [
      { step: 1, title: 'AI & Generative AI Fundamentals', level: 'EASY', audience: 'School/College', duration: '1 Week', code: 'ai-easy' },
      { step: 2, title: 'Applied Generative AI & AI Application Development', level: 'MODERATE', audience: 'College/Corporate', duration: '2 Weeks', code: 'ai-moderate' },
      { step: 3, title: 'Advanced AI & Intelligent Systems', level: 'HARD', audience: 'IT Company', duration: '1 Month', code: 'ai-hard' }
    ]
  },
  {
    id: 'cybersecurity-path',
    title: '🛡️ Cybersecurity Learning Path',
    domain: 'Cybersecurity',
    description: 'From digital safety awareness to ethical hacking, lab penetration testing, and enterprise defense.',
    nodes: [
      { step: 1, title: 'Cybersecurity & Social Media Safety', level: 'EASY', audience: 'School/College', duration: '1 Week', code: 'cybersecurity-easy' },
      { step: 2, title: 'Ethical Hacking & Security Testing', level: 'MODERATE', audience: 'College/Corporate', duration: '2 Weeks', code: 'cybersecurity-moderate' },
      { step: 3, title: 'Advanced Cybersecurity & Penetration Testing', level: 'HARD', audience: 'IT Company', duration: '1 Month', code: 'cybersecurity-hard' }
    ]
  },
  {
    id: 'webdev-path',
    title: '🌐 Web Development Learning Path',
    domain: 'Web Development',
    description: 'Build modern responsive UIs, backend REST APIs, full-stack web apps, and scalable multi-user platforms.',
    nodes: [
      { step: 1, title: 'Web Development Fundamentals', level: 'EASY', audience: 'School/College', duration: '1 Week', code: 'webdev-easy' },
      { step: 2, title: 'Full-Stack Web Development', level: 'MODERATE', audience: 'College/Startup', duration: '2 Weeks', code: 'webdev-moderate' },
      { step: 3, title: 'Advanced Full-Stack & Scalable Applications', level: 'HARD', audience: 'IT Company', duration: '1 Month', code: 'webdev-hard' }
    ]
  },
  {
    id: 'data-path',
    title: '📊 Data Analytics Learning Path',
    domain: 'Data Analytics',
    description: 'Transform raw data into insights, build business analytics dashboards, and engineer predictive AI systems.',
    nodes: [
      { step: 1, title: 'Data Analytics Fundamentals', level: 'EASY', audience: 'School/College', duration: '1 Week', code: 'data-easy' },
      { step: 2, title: 'Advanced Data Analytics & Visualization', level: 'MODERATE', audience: 'College/Corporate', duration: '2 Weeks', code: 'data-moderate' },
      { step: 3, title: 'Data Science & Predictive Analytics', level: 'HARD', audience: 'IT Company', duration: '1 Month', code: 'data-hard' }
    ]
  }
];

// Official Nexus GenZ Dataset — Exactly 5 Technology Domains (Easy → Moderate → Hard)
const RAW_PROGRAMS = [
  // 1. Python Learning Path
  {
    id: 'python-easy',
    code: 'python-easy',
    title: 'Python Programming Fundamentals',
    domain: 'Python',
    difficulty: 'EASY',
    badge: '🟢 EASY',
    type: 'Course',
    duration: '1 Week',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'None',
    category: 'python',
    audience: 'School / College',
    skillsLearned: ['Variables', 'Data types', 'Operators', 'If/else', 'Loops', 'Lists, tuples, dictionaries', 'Functions', 'Exception handling', 'Basic packages'],
    summary: 'Master foundational Python programming concepts from variables and control flow to data structures, functions, and exception handling.',
    overview: 'This course introduces Python from absolute scratch. Learn Python syntax, data types, logic building with loops & conditionals, list/tuple/dictionary operations, reusable functions, error handling, and core packages while building a complete project.',
    projects: ['Student Result Management System'],
    project: 'Student Result Management System',
    nextRecommendedLevel: 'Intermediate Python & Application Development',
    status: 'active'
  },
  {
    id: 'python-moderate',
    code: 'python-moderate',
    title: 'Intermediate Python & Application Development',
    domain: 'Python',
    difficulty: 'MODERATE',
    badge: '🟡 MODERATE',
    type: 'Course',
    duration: '2 Weeks',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'Python Fundamentals',
    category: 'python',
    audience: 'College / IT Professional',
    skillsLearned: ['OOP', 'File handling', 'Modules & packages', 'APIs', 'Database connectivity', 'NumPy', 'Pandas', 'Advanced exception handling'],
    summary: 'Advance your Python mastery with Object-Oriented Programming (OOP), file operations, REST APIs, database connectivity, NumPy, and Pandas.',
    overview: 'Take your Python skills to application-level development. Learn object-oriented design patterns, JSON/CSV file processing, HTTP requests with REST APIs, SQL database connections, and data analysis using NumPy and Pandas.',
    projects: ['Inventory Management Application'],
    project: 'Inventory Management Application',
    nextRecommendedLevel: 'Advanced Python & Software Development',
    status: 'active'
  },
  {
    id: 'python-hard',
    code: 'python-hard',
    title: 'Advanced Python & Software Development',
    domain: 'Python',
    difficulty: 'HARD',
    badge: '🔴 HARD',
    type: 'Course',
    duration: '1 Month',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'Intermediate Python',
    category: 'python',
    audience: 'College / IT Roles',
    skillsLearned: ['Advanced OOP', 'Advanced APIs', 'Backend development', 'Authentication', 'Database architecture', 'Testing', 'Performance', 'Deployment'],
    summary: 'Build production-grade backend software platforms, microservices, authentication systems, automated testing suites, and cloud deployments.',
    overview: 'Master enterprise Python software engineering. Architect production web applications using FastAPI/Django, complex database schemas with ORMs, JWT/OAuth2 authentication, pytest automated testing suites, performance profiling, and Docker deployment.',
    projects: ['Production-style Python Web Application'],
    project: 'Production-style Python Web Application',
    nextRecommendedLevel: 'Completed Path / AI Recommendation Engine',
    status: 'active'
  },

  // 2. AI Learning Path
  {
    id: 'ai-easy',
    code: 'ai-easy',
    title: 'AI & Generative AI Fundamentals',
    domain: 'AI',
    difficulty: 'EASY',
    badge: '🟢 EASY',
    type: 'Course',
    duration: '1 Week',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'None',
    category: 'ai',
    audience: 'School / College',
    skillsLearned: ['What is AI?', 'Machine Learning basics', 'Generative AI', 'LLMs', 'Prompt engineering', 'AI tools', 'Responsible AI'],
    summary: 'Discover core concepts of AI, Machine Learning, Generative AI, Large Language Models (LLMs), prompt engineering, and responsible AI.',
    overview: 'An engaging foundational course introducing how AI systems work. Explore Artificial Intelligence vs. Machine Learning, understand Large Language Models (LLMs), master zero-shot/few-shot prompt engineering techniques, use top AI tools, and learn ethical AI practices.',
    projects: ['AI Student Assistant'],
    project: 'AI Student Assistant',
    nextRecommendedLevel: 'Applied Generative AI & AI Application Development',
    status: 'active'
  },
  {
    id: 'ai-moderate',
    code: 'ai-moderate',
    title: 'Applied Generative AI & AI Application Development',
    domain: 'AI',
    difficulty: 'MODERATE',
    badge: '🟡 MODERATE',
    type: 'Course',
    duration: '2 Weeks',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'AI & Generative AI Fundamentals',
    category: 'ai',
    audience: 'College / IT Professional',
    skillsLearned: ['LLM APIs', 'Prompt design', 'Embeddings', 'RAG', 'AI application development', 'AI agents', 'Basic evaluation', 'AI safety'],
    summary: 'Build real-world AI applications using LLM APIs, vector embeddings, Retrieval-Augmented Generation (RAG), and autonomous AI agents.',
    overview: 'Transition from AI user to AI software developer. Learn to connect to LLM APIs (OpenAI, Gemini, Anthropic), convert text into vector embeddings, implement RAG search over custom documents, build autonomous AI agents with tool calling, and enforce safety guardrails.',
    projects: ['AI Knowledge Assistant'],
    project: 'AI Knowledge Assistant',
    nextRecommendedLevel: 'Advanced AI & Intelligent Systems',
    status: 'active'
  },
  {
    id: 'ai-hard',
    code: 'ai-hard',
    title: 'Advanced AI & Intelligent Systems',
    domain: 'AI',
    difficulty: 'HARD',
    badge: '🔴 HARD',
    type: 'Course',
    duration: '1 Month',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'Applied Generative AI',
    category: 'ai',
    audience: 'IT Company / Professional',
    skillsLearned: ['AI architecture', 'Advanced RAG', 'Agentic workflows', 'Fine-tuning concepts', 'AI evaluation', 'Model selection', 'AI deployment', 'Production AI systems'],
    summary: 'Architect production enterprise AI systems with multi-agent workflows, model fine-tuning concepts, advanced RAG, and cloud AI deployment.',
    overview: 'Engineer production-scale AI systems. Design multi-agent workflows using framework orchestration, master advanced hybrid RAG (reranking, graph search), fine-tuning concepts (LoRA/QLoRA), model evaluation benchmarks, latency optimization, and cloud container deployment.',
    projects: ['Multi-Agent AI Application'],
    project: 'Multi-Agent AI Application',
    nextRecommendedLevel: 'Completed Path / AI Recommendation Engine',
    status: 'active'
  },

  // 3. Cybersecurity Learning Path
  {
    id: 'cybersecurity-easy',
    code: 'cybersecurity-easy',
    title: 'Cybersecurity & Social Media Safety',
    domain: 'Cybersecurity',
    difficulty: 'EASY',
    badge: '🟢 EASY',
    type: 'Course',
    duration: '1 Week',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'None',
    category: 'cybersecurity',
    audience: 'School / College',
    skillsLearned: ['Cybersecurity fundamentals', 'Password security', 'Phishing', 'Social engineering', 'Social media security', 'Privacy', 'Safe browsing', 'Account protection'],
    summary: 'Master essential cyber safety habits, password security, phishing detection, social media privacy, and personal digital account defense.',
    overview: 'An interactive safety masterclass protecting students and users online. Learn how cybersecurity works, create unbreakable passwords, enable 2FA, identify deceptive phishing links and social engineering tactics, configure social media privacy locks, and browse safely.',
    projects: ['Social Media Security Awareness Campaign'],
    project: 'Social Media Security Awareness Campaign',
    nextRecommendedLevel: 'Ethical Hacking & Security Testing',
    status: 'active'
  },
  {
    id: 'cybersecurity-moderate',
    code: 'cybersecurity-moderate',
    title: 'Ethical Hacking & Security Testing',
    domain: 'Cybersecurity',
    difficulty: 'MODERATE',
    badge: '🟡 MODERATE',
    type: 'Course',
    duration: '2 Weeks',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'Cybersecurity Fundamentals',
    category: 'cybersecurity',
    audience: 'College / Corporate',
    skillsLearned: ['Networking fundamentals', 'Linux basics', 'Reconnaissance', 'Vulnerability assessment', 'Web security fundamentals', 'Security testing', 'Basic penetration-testing methodology'],
    summary: 'Learn hands-on ethical hacking covering networking, Linux CLI, Nmap reconnaissance, OWASP web security, and vulnerability audits.',
    overview: 'Develop the technical skills of an ethical hacker and security analyst. Master TCP/IP networking, Linux terminal commands, Nmap port scanning & reconnaissance, vulnerability scanning, OWASP Top 10 web security flaws, and structured penetration testing methodologies.',
    projects: ['Security Assessment of a Controlled Lab'],
    project: 'Security Assessment of a Controlled Lab',
    nextRecommendedLevel: 'Advanced Cybersecurity & Penetration Testing',
    status: 'active'
  },
  {
    id: 'cybersecurity-hard',
    code: 'cybersecurity-hard',
    title: 'Advanced Cybersecurity & Penetration Testing',
    domain: 'Cybersecurity',
    difficulty: 'HARD',
    badge: '🔴 HARD',
    type: 'Course',
    duration: '1 Month',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'Ethical Hacking & Security Testing',
    category: 'cybersecurity',
    audience: 'IT Company / Professional',
    skillsLearned: ['Advanced network security', 'Web application security', 'Vulnerability analysis', 'Security testing methodologies', 'Incident response', 'Security monitoring', 'Advanced lab-based penetration testing'],
    summary: 'Master enterprise-level penetration testing, advanced web exploitation, SIEM security monitoring, threat hunting, and incident response.',
    overview: 'Execute controlled enterprise security assessments. Deep-dive into advanced web app exploitation, active network penetration testing, SIEM log monitoring, threat hunting, incident response protocols, and enterprise risk management.',
    projects: ['Controlled Enterprise Security Assessment'],
    project: 'Controlled Enterprise Security Assessment',
    nextRecommendedLevel: 'Completed Path / AI Recommendation Engine',
    status: 'active'
  },

  // 4. Web Development Learning Path
  {
    id: 'webdev-easy',
    code: 'webdev-easy',
    title: 'Web Development Fundamentals',
    domain: 'Web Development',
    difficulty: 'EASY',
    badge: '🟢 EASY',
    type: 'Course',
    duration: '1 Week',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'None',
    category: 'webdev',
    audience: 'School / College',
    skillsLearned: ['HTML', 'CSS', 'JavaScript basics', 'Forms', 'Responsive design', 'Basic deployment'],
    summary: 'Build responsive modern websites using HTML5, CSS3 styling, flexbox/grid, interactive JavaScript, forms, and cloud deployment.',
    overview: 'Your entry point into web engineering. Learn semantic HTML5 markup, CSS styling with Flexbox & Grid, responsive mobile design, JavaScript interactive DOM manipulation, HTML forms, and publish your personal portfolio online.',
    projects: ['Personal Portfolio Website'],
    project: 'Personal Portfolio Website',
    nextRecommendedLevel: 'Full-Stack Web Development',
    status: 'active'
  },
  {
    id: 'webdev-moderate',
    code: 'webdev-moderate',
    title: 'Full-Stack Web Development',
    domain: 'Web Development',
    difficulty: 'MODERATE',
    badge: '🟡 MODERATE',
    type: 'Course',
    duration: '2 Weeks',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'Web Development Fundamentals',
    category: 'webdev',
    audience: 'College / Corporate',
    skillsLearned: ['Advanced JavaScript', 'Frontend framework', 'Backend development', 'REST APIs', 'Databases', 'Authentication', 'Deployment'],
    summary: 'Engineer dynamic full-stack web apps using modern React, Node.js/Express REST APIs, relational/NoSQL databases, JWT auth, and cloud hosting.',
    overview: 'Develop modern full-stack web applications. Master modern React components, hooks, state management, Node.js & Express RESTful API backends, database CRUD operations (SQL & MongoDB), user authentication with JWT, and full-stack cloud deployment.',
    projects: ['E-Commerce / Service Booking Application'],
    project: 'E-Commerce / Service Booking Application',
    nextRecommendedLevel: 'Advanced Full-Stack & Scalable Applications',
    status: 'active'
  },
  {
    id: 'webdev-hard',
    code: 'webdev-hard',
    title: 'Advanced Full-Stack & Scalable Applications',
    domain: 'Web Development',
    difficulty: 'HARD',
    badge: '🔴 HARD',
    type: 'Course',
    duration: '1 Month',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'Full-Stack Web Development',
    category: 'webdev',
    audience: 'IT Company / Professional',
    skillsLearned: ['Advanced frontend architecture', 'Backend architecture', 'Authentication & authorization', 'Cloud deployment', 'Performance', 'Security', 'Scalability', 'CI/CD'],
    summary: 'Architect scalable multi-user cloud web platforms with microservices, advanced auth, caching, WebSockets, performance tuning, and CI/CD pipelines.',
    overview: 'Engineer high-throughput enterprise web platforms. Master microservices architecture, server-side rendering, role-based authorization (RBAC), Redis caching, WebSocket real-time data, Docker containerization, security hardening, and automated CI/CD pipelines.',
    projects: ['Scalable Multi-User Web Platform'],
    project: 'Scalable Multi-User Web Platform',
    nextRecommendedLevel: 'Completed Path / AI Recommendation Engine',
    status: 'active'
  },

  // 5. Data Analytics Learning Path
  {
    id: 'data-easy',
    code: 'data-easy',
    title: 'Data Analytics Fundamentals',
    domain: 'Data Analytics',
    difficulty: 'EASY',
    badge: '🟢 EASY',
    type: 'Course',
    duration: '1 Week',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'None',
    category: 'data',
    audience: 'School / College',
    skillsLearned: ['Data concepts', 'Excel', 'Data cleaning', 'Basic statistics', 'Charts', 'Introduction to Python/Pandas', 'Basic dashboards'],
    summary: 'Learn foundational data analysis using Excel formulas, data cleaning, basic statistics, charts, Python/Pandas introduction, and visual dashboards.',
    overview: 'Transform raw data into meaningful business insights. Learn core data lifecycle concepts, Excel pivot tables and lookup formulas, data cleaning techniques, descriptive statistics (mean, median, variance), visual charts, and introductory Python/Pandas data manipulation.',
    projects: ['Student Performance Dashboard'],
    project: 'Student Performance Dashboard',
    nextRecommendedLevel: 'Advanced Data Analytics & Visualization',
    status: 'active'
  },
  {
    id: 'data-moderate',
    code: 'data-moderate',
    title: 'Advanced Data Analytics & Visualization',
    domain: 'Data Analytics',
    difficulty: 'MODERATE',
    badge: '🟡 MODERATE',
    type: 'Course',
    duration: '2 Weeks',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'Data Analytics Fundamentals',
    category: 'data',
    audience: 'College / Corporate',
    skillsLearned: ['Advanced Pandas', 'Data cleaning', 'Exploratory data analysis', 'SQL', 'Advanced visualization', 'Dashboard development', 'Statistical analysis'],
    summary: 'Perform exploratory data analysis using advanced Python Pandas, relational SQL queries, statistical hypothesis testing, and BI dashboards.',
    overview: 'Become a proficient data analyst. Master complex SQL queries (joins, aggregations, window functions), advanced Pandas data wrangling, Exploratory Data Analysis (EDA), statistical hypothesis testing, and interactive BI dashboards (Power BI / Tableau / Plotly).',
    projects: ['Business Sales Analytics Dashboard'],
    project: 'Business Sales Analytics Dashboard',
    nextRecommendedLevel: 'Data Science & Predictive Analytics',
    status: 'active'
  },
  {
    id: 'data-hard',
    code: 'data-hard',
    title: 'Data Science & Predictive Analytics',
    domain: 'Data Analytics',
    difficulty: 'HARD',
    badge: '🔴 HARD',
    type: 'Course',
    duration: '1 Month',
    mode: 'Online',
    price: 'will update soon..',
    prerequisites: 'Advanced Data Analytics',
    category: 'data',
    audience: 'IT Company / Professional',
    skillsLearned: ['Statistics', 'Machine learning fundamentals', 'Feature engineering', 'Regression', 'Classification', 'Model evaluation', 'Predictive analytics', 'Deployment basics'],
    summary: 'Build predictive machine learning models using statistical inference, feature engineering, regression, classification, evaluation metrics, and API deployment.',
    overview: 'Master predictive data science. Learn statistical inference, feature engineering & encoding, supervised machine learning models (linear/logistic regression, decision trees, random forests, XGBoost), model evaluation metrics (ROC-AUC, F1, RMSE), and deploy predictive REST APIs.',
    projects: ['Customer/Business Prediction System'],
    project: 'Customer/Business Prediction System',
    nextRecommendedLevel: 'Completed Path / AI Recommendation Engine',
    status: 'active'
  }
];

export const PROGRAMS = RAW_PROGRAMS.map(prog => ({
  ...prog,
  price: 'will update soon..',
  mode: 'Online',
  duration: '2 Weeks'
}));
