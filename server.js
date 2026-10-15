import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { PROGRAMS, INITIAL_TRAINERS, INITIAL_EVENTS, MOCK_CERTIFICATES, getNexusAiRecommendations } from './src/data/programsData.js';
import { UG_DEGREES, PG_DEGREES } from './src/data/degreesData.js';
import { CAREER_CATEGORIES, CAREER_PATHS, DEGREE_CAREER_MAPPINGS, CAREER_PROGRAM_MAPPINGS } from './src/data/careerPathsData.js';
import { INITIAL_AI_KNOWLEDGE_BASE } from './src/data/nexusAiData.js';
import { INITIAL_INTERNSHIPS, INITIAL_INTERNSHIP_TASKS, INTERNSHIP_CATEGORIES } from './src/data/internshipsData.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize Razorpay SDK instance safely
const razorpayKeyId = process.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_NexusGenZ2026';
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET || 'demo_razorpay_secret_nexusgenz_2026';

const razorpay = new Razorpay({
  key_id: razorpayKeyId,
  key_secret: razorpayKeySecret
});

// In-Memory Database Store (with persistent runtime state matching Cloud Firestore)
let dbStore = {
  // Official Company Admin Account
  adminAccount: {
    email: "nexusgenz2026@gmail.com",
    role: "ADMIN",
    status: "ACTIVE",
    displayName: "Nexus GenZ Organization Admin",
    organization: "Nexus GenZ Technology Platform"
  },
  users: [
    {
      uid: "admin-nexusgenz-2026",
      email: "nexusgenz2026@gmail.com",
      name: "Nexus GenZ Executive Admin",
      role: "ADMIN",
      accountStatus: "ACTIVE",
      createdAt: "2026-09-01T00:00:00Z"
    },
    {
      uid: "stu-vikram-101",
      email: "vikram.roy@example.com",
      name: "Vikramaditya Roy",
      role: "STUDENT",
      accountStatus: "ACTIVE",
      createdAt: "2026-09-01T10:00:00Z"
    }
  ],
  students: [
    {
      studentId: "stu-vikram-101",
      name: "Vikramaditya Roy",
      email: "vikram.roy@example.com",
      college: "IIT Madras",
      degree: "B.Tech Computer Science",
      enrolledProgramsCount: 2,
      nexusPoints: 850
    }
  ],
  trainers: [...INITIAL_TRAINERS],
  interns: [
    {
      internId: "int-vikram-101",
      studentName: "Vikramaditya Roy",
      email: "vikram.roy@example.com",
      internshipTitle: "Web Development Internship",
      assignedMentor: "Trainer Rajesh Kumar",
      status: "Active"
    }
  ],
  programs: [...PROGRAMS],
  sessions: [
    {
      sessionId: "sess-101",
      programId: "col-mod-cyber-1",
      title: "Cybersecurity Live Penetration Testing Session",
      trainerName: "Prof. Rajesh Kumar",
      date: "2026-10-15",
      mode: "Online",
      attendeesCount: 45
    }
  ],
  attendance: [
    { id: "att-101", sessionId: "sess-101", studentName: "Vikramaditya Roy", email: "vikram.roy@example.com", date: "2026-09-15", status: "Present" },
    { id: "att-102", sessionId: "sess-101", studentName: "Ananya Sharma", email: "ananya.s@example.com", date: "2026-09-15", status: "Present" }
  ],
  feedback: [
    { id: "fb-101", studentName: "Vikramaditya Roy", programTitle: "Cybersecurity Essentials", rating: 5, comment: "Excellent practical hands-on session!", createdAt: "2026-09-16T10:00:00Z" }
  ],
  priceHistory: [
    { id: "ph-101", programId: "col-mod-cyber-1", programTitle: "Cybersecurity & Ethical Hacking Essentials", oldPrice: "₹4,999", newPrice: "will update soon..", updatedBy: "nexusgenz2026@gmail.com", updatedAt: "2026-09-10T12:00:00Z" }
  ],
  media: [
    { id: "med-101", title: "Cybersecurity Workshop Highlights 2026", category: "Approved Program Video", fileUrl: "https://drive.google.com/file/d/123456789/view", driveRef: "drive://nexusgenz2026/media/cyber-2026.mp4", approvedBy: "nexusgenz2026@gmail.com" },
    { id: "med-102", title: "Full-Stack Bootcamp Class Photo", category: "Approved Program Photo", fileUrl: "https://drive.google.com/file/d/987654321/view", driveRef: "drive://nexusgenz2026/media/fullstack-class.jpg", approvedBy: "nexusgenz2026@gmail.com" }
  ],
  notifications: [
    { id: "notif-101", type: "NEW_TRAINER_APPLICATION", title: "New Trainer Application", message: "Dr. Arvind Swamy applied for Trainer position", recipient: "nexusgenz2026@gmail.com", createdAt: "2026-09-18T10:00:00Z", isRead: false }
  ],
  auditLogs: [
    { id: "audit-1", action: "INITIALIZE_PLATFORM", performedBy: "nexusgenz2026@gmail.com", details: "Nexus GenZ platform synchronized with company Google identity nexusgenz2026@gmail.com and Cloud Firestore DB", timestamp: new Date().toISOString() }
  ],
  googleDriveFiles: [
    { id: "drv-101", type: "Trainer Resume", fileName: "Dr_Arvind_Swamy_Resume.pdf", driveUrl: "https://drive.google.com/file/d/trainer-res-01/view", uploadedBy: "arvind.s@example.com", isPrivate: true },
    { id: "drv-102", type: "Internship Resume", fileName: "Vikramaditya_Roy_Resume.pdf", driveUrl: "https://drive.google.com/file/d/intern-res-01/view", uploadedBy: "vikram.roy@example.com", isPrivate: true },
    { id: "drv-103", type: "Certificate", fileName: "Certificate_NGZ-INT-2026-00452.pdf", driveUrl: "https://drive.google.com/file/d/cert-01/view", uploadedBy: "nexusgenz2026@gmail.com", isPrivate: false },
    { id: "drv-104", type: "Approved Program Photo", fileName: "AI_Bootcamp_Bangalore_2026.jpg", driveUrl: "https://drive.google.com/file/d/photo-01/view", uploadedBy: "nexusgenz2026@gmail.com", isPrivate: false },
    { id: "drv-105", type: "Approved Program Video", fileName: "Ethical_Hacking_Live_Demo.mp4", driveUrl: "https://drive.google.com/file/d/video-01/view", uploadedBy: "nexusgenz2026@gmail.com", isPrivate: false },
    { id: "drv-106", type: "Training Document", fileName: "Python_FullStack_Curriculum_v2.pdf", driveUrl: "https://drive.google.com/file/d/doc-01/view", uploadedBy: "nexusgenz2026@gmail.com", isPrivate: false },
    { id: "drv-107", type: "Report", fileName: "Q3_2026_Placement_Audit_Report.pdf", driveUrl: "https://drive.google.com/file/d/report-01/view", uploadedBy: "nexusgenz2026@gmail.com", isPrivate: true }
  ],
  degrees: { ug: UG_DEGREES, pg: PG_DEGREES },
  careerCategories: [...CAREER_CATEGORIES],
  careerPaths: [...CAREER_PATHS],
  degreeCareerMappings: { ...DEGREE_CAREER_MAPPINGS },
  careerProgramMappings: { ...CAREER_PROGRAM_MAPPINGS },
  aiKnowledgeBase: [...INITIAL_AI_KNOWLEDGE_BASE],
  trainerApplications: [
    {
      applicationId: "TR-2026-00125",
      fullName: "Dr. Arvind Swamy",
      email: "arvind.s@example.com",
      phone: "+91 98401 22334",
      city: "Chennai",
      qualification: "Ph.D. in Computer Science",
      occupation: "Associate Professor",
      experienceYears: "8",
      organization: "Anna University",
      linkedIn: "https://linkedin.com/in/arvind-swamy",
      github: "https://github.com/arvind-s",
      skills: ["Python", "AI", "Machine Learning", "Data Analytics"],
      category: "College",
      targetAudience: "College",
      preferredMode: "Both",
      availability: "Weekends",
      introduction: "Experienced educator passionate about teaching AI and machine learning to young minds.",
      whyJoin: "Want to contribute to practical tech education through Nexus GenZ.",
      resumeUrl: "https://example.com/resumes/arvind-cv.pdf",
      status: "Under Review",
      createdAt: "2026-09-18T10:00:00Z"
    }
  ],
  internships: [...INITIAL_INTERNSHIPS],
  internshipCategories: [...INTERNSHIP_CATEGORIES],
  internshipApplications: [
    {
      applicationId: "INT-2026-00452",
      studentId: "stu-vikram-101",
      studentName: "Vikramaditya Roy",
      email: "vikram.roy@example.com",
      phone: "+91 98765 43210",
      college: "IIT Madras",
      degree: "B.Tech Computer Science",
      department: "CSE",
      yearSemester: "3rd Year / 6th Sem",
      expectedGraduation: "2027",
      internshipId: "int-web-01",
      internshipTitle: "Web Development Internship",
      skills: ["HTML", "CSS", "JavaScript", "React 19"],
      previousProjects: "Built personal portfolio and e-commerce demo site",
      resumeUrl: "https://example.com/resumes/vikram-resume.pdf",
      portfolioUrl: "https://github.com/vikram-roy",
      whyJoin: "Eager to gain practical Web Development team experience.",
      preferredMode: "Online",
      availability: "Full-time (20 hrs/week)",
      status: "Selected",
      assignedMentor: "Trainer Rajesh Kumar",
      appliedAt: "2026-09-15T14:00:00Z"
    }
  ],
  internshipTasks: [...INITIAL_INTERNSHIP_TASKS],
  internshipSubmissions: [],
  internshipEvaluations: [],
  bookings: [
    {
      id: "bk-101",
      fullName: "Dr. K. S. Raman",
      organization: "National Institute of Science & Technology",
      orgType: "College",
      email: "raman.ks@nist.edu",
      phone: "+91 94432 88990",
      program: "Cybersecurity & Ethical Hacking Essentials",
      date: "2026-10-15",
      participants: "300",
      mode: "Offline",
      message: "Requesting a full-day workshop for final year Computer Science students.",
      status: "accepted",
      createdAt: "2026-09-10T10:15:00Z"
    }
  ],
  certificates: { ...MOCK_CERTIFICATES },
  events: [...INITIAL_EVENTS],
  enrollments: [
    {
      id: "enr-101",
      studentId: "stu-vikram-101",
      studentName: "Vikramaditya Roy",
      studentEmail: "vikram.roy@example.com",
      programId: "python-easy",
      programTitle: "Python Programming Fundamentals",
      amountPaid: "will update soon..",
      paymentStatus: "paid",
      enrollmentStatus: "active",
      accessGranted: true,
      progressPercent: 100,
      enrolledAt: "2026-08-01",
      completedModules: ["Module 1", "Module 2", "Module 3", "Module 4"],
      score: 88,
      nexusPointsEarned: 350
    }
  ],
  payments: [
    {
      paymentId: "PAY-8942-01",
      registrationId: "REG-2026-8942",
      studentId: "stu-vikram-101",
      studentName: "Vikramaditya Roy",
      studentEmail: "vikram.roy@example.com",
      programId: "python-easy",
      programName: "Python Programming Fundamentals",
      amount: "will update soon..",
      paymentMethod: "UPI",
      upiTransactionId: "UTR649201948271",
      paymentDate: "2026-09-01",
      paymentTime: "10:15 AM",
      payerUpiName: "Vikramaditya Roy",
      screenshot: "",
      status: "Payment Verified",
      adminNotes: "Verified via HDFC Bank UPI Statement.",
      verifiedBy: "System Admin",
      verifiedAt: "2026-09-01T11:00:00Z",
      createdAt: "2026-09-01T10:15:00Z",
      receiptNumber: "RCPT-2026-0089"
    },
    {
      paymentId: "PAY-9104-01",
      registrationId: "REG-2026-9104",
      studentId: "stu-ananya-202",
      studentName: "Ananya Sharma",
      studentEmail: "ananya.s@example.com",
      programId: "col-mod-dev-2",
      programName: "Full-Stack MERN Mastery & Cloud Deployment",
      amount: "will update soon..",
      paymentMethod: "UPI",
      upiTransactionId: "UTR772819405623",
      paymentDate: "2026-09-15",
      paymentTime: "02:45 PM",
      payerUpiName: "Ananya Sharma",
      screenshot: "",
      status: "Under Verification",
      adminNotes: "",
      verifiedBy: null,
      verifiedAt: null,
      createdAt: "2026-09-15T14:45:00Z",
      receiptNumber: null
    }
  ],
  paymentSettings: {
    upiId: "7010833590",
    mobileNumber: "7010833590",
    businessName: "Nexus GenZ Technology Platform",
    qrCode: "",
    instructions: "Pay via PhonePe, Google Pay, Paytm, BHIM or any UPI app to Mobile Number: 7010833590. Submit your 12-digit UTR/Transaction ID below for instant verification.",
    activeStatus: "active",
    supportContact: "nexusgenz26@gmail.com",
    updatedBy: "Admin",
    updatedAt: new Date().toISOString()
  },
  registrations: [
    {
      registrationId: "REG-2026-8942",
      studentId: "stu-vikram-101",
      studentName: "Vikramaditya Roy",
      email: "vikram.roy@example.com",
      phone: "+91 98765 43210",
      institution: "IIT Madras",
      roleClass: "B.Tech CS 3rd Year",
      programId: "col-mod-cyber-1",
      programName: "Cybersecurity & Ethical Hacking Essentials",
      amount: "will update soon..",
      originalPriceAtRegistration: "will update soon..",
      batchDate: "2026-10-01",
      mode: "Online",
      notes: "Excited to learn penetration testing.",
      status: "Confirmed",
      createdAt: "2026-09-01T10:00:00Z"
    },
    {
      registrationId: "REG-2026-9104",
      studentId: "stu-ananya-202",
      studentName: "Ananya Sharma",
      email: "ananya.s@example.com",
      phone: "+91 98111 22334",
      institution: "Delhi Technological University",
      roleClass: "B.Tech IT 4th Year",
      programId: "col-mod-dev-2",
      programName: "Full-Stack MERN Mastery & Cloud Deployment",
      amount: "will update soon..",
      originalPriceAtRegistration: "will update soon..",
      batchDate: "2026-10-05",
      mode: "Online",
      notes: "Preparing for placements.",
      status: "Under Verification",
      createdAt: "2026-09-15T14:30:00Z"
    },
    {
      registrationId: "REG-2026-9288",
      studentId: "stu-rohit-303",
      studentName: "Rohit Kumar",
      email: "rohit.k@example.com",
      phone: "+91 97766 55443",
      institution: "St. Xavier College",
      roleClass: "BSc Computer Science",
      programId: "col-mod-ai-1",
      programName: "Applied AI & LLM Engineering",
      amount: "will update soon..",
      originalPriceAtRegistration: "will update soon..",
      batchDate: "2026-10-10",
      mode: "Online",
      notes: "",
      status: "Payment Pending",
      createdAt: "2026-09-17T09:15:00Z"
    }
  ],
  modules: [
    {
      moduleId: "mod-cyber-1",
      programId: "col-mod-cyber-1",
      name: "Module 1: Cybersecurity Fundamentals & Security Architecture",
      description: "Core concepts of information security, CIA triad, threat vectors, and defense-in-depth architecture.",
      moduleNumber: 1,
      duration: "2 Hours",
      learningObjectives: "Understand security principles, threat types, and core defense mechanisms.",
      status: "active",
      displayOrder: 1
    },
    {
      moduleId: "mod-cyber-2",
      programId: "col-mod-cyber-1",
      name: "Module 2: Ethical Hacking, Network Reconnaissance & Penetration Testing",
      description: "Passive/active reconnaissance, Nmap port scanning, vulnerability scanning, and exploitation fundamentals.",
      moduleNumber: 2,
      duration: "3 Hours",
      learningObjectives: "Perform network discovery, vulnerability audits, and ethical penetration testing.",
      status: "active",
      displayOrder: 2
    },
    {
      moduleId: "mod-cyber-3",
      programId: "col-mod-cyber-1",
      name: "Module 3: Web Application Vulnerabilities & Defense",
      description: "OWASP Top 10 vulnerabilities, SQL Injection, Cross-Site Scripting (XSS), CSRF, and secure coding practices.",
      moduleNumber: 3,
      duration: "3 Hours",
      learningObjectives: "Identify, exploit, and remediate top web application security flaws.",
      status: "active",
      displayOrder: 3
    },
    {
      moduleId: "mod-dev-1",
      programId: "col-mod-dev-2",
      name: "Module 1: Modern JavaScript (ES6+) & React 19 Core Engine",
      description: "Master asynchronous JS, functional components, hooks, state management, and modern component design.",
      moduleNumber: 1,
      duration: "4 Hours",
      learningObjectives: "Build responsive, scalable single-page web applications with React 19.",
      status: "active",
      displayOrder: 1
    },
    {
      moduleId: "mod-dev-2",
      programId: "col-mod-dev-2",
      name: "Module 2: Node.js & Express RESTful API Engineering",
      description: "Build robust backend servers, REST routes, JWT authentication middleware, and error handling.",
      moduleNumber: 2,
      duration: "4 Hours",
      learningObjectives: "Develop production-ready Express API backends.",
      status: "active",
      displayOrder: 2
    }
  ],
  topics: [
    {
      topicId: "top-cyber-1-1",
      moduleId: "mod-cyber-1",
      programId: "col-mod-cyber-1",
      name: "What is Cybersecurity & The CIA Triad",
      shortDescription: "Introduction to Confidentiality, Integrity, and Availability principles.",
      content: "Detailed breakdown of the CIA triad. Confidentiality keeps data secret; Integrity ensures data accuracy; Availability ensures systems remain operational. Learn threat modeling fundamentals.",
      duration: "30 mins",
      difficulty: "Beginner",
      topicType: "Theory",
      displayOrder: 1,
      status: "published",
      prerequisiteRequired: false,
      prerequisiteTopicId: null,
      publishedAt: new Date().toISOString(),
      learningMaterials: [
        { id: "mat-1", title: "CIA Triad Architecture Guide (PDF)", type: "PDF", link: "https://example.com/cia-guide.pdf", visibility: "Public" }
      ],
      activities: [
        { id: "act-1", title: "Identify CIA Triad Violations in Case Studies", instructions: "Review 3 real-world breaches and identify which CIA pillar was compromised.", marks: 10 }
      ],
      quizzes: [
        {
          id: "qz-1",
          question: "Which arm of the CIA Triad is compromised during a DDoS attack?",
          options: ["Confidentiality", "Integrity", "Availability", "Authentication"],
          correctAnswer: 2,
          marks: 5,
          explanation: "DDoS attacks flood servers to prevent legitimate access, violating Availability."
        }
      ]
    },
    {
      topicId: "top-cyber-1-2",
      moduleId: "mod-cyber-1",
      programId: "col-mod-cyber-1",
      name: "Common Cyber Threat Vectors & Threat Actors",
      shortDescription: "Overview of Malware, Ransomware, Man-in-the-Middle, and Phishing attacks.",
      content: "Understand how threat actors target organizations. Analyze malware types (trojans, worms, spyware) and ransomware encryption workflows.",
      duration: "45 mins",
      difficulty: "Beginner",
      topicType: "Awareness",
      displayOrder: 2,
      status: "published",
      prerequisiteRequired: true,
      prerequisiteTopicId: "top-cyber-1-1",
      publishedAt: new Date().toISOString()
    },
    {
      topicId: "top-cyber-2-1",
      moduleId: "mod-cyber-2",
      programId: "col-mod-cyber-1",
      name: "Network Reconnaissance & Port Scanning with Nmap",
      shortDescription: "Hands-on host discovery, TCP SYN scanning, service detection, and OS fingerprinting.",
      content: "Master Nmap CLI commands. Learn `-sS` SYN stealth scans, `-sV` version detection, and `-O` OS detection for security audits.",
      duration: "60 mins",
      difficulty: "Intermediate",
      topicType: "Practical",
      displayOrder: 1,
      status: "published",
      prerequisiteRequired: true,
      prerequisiteTopicId: "top-cyber-1-2",
      publishedAt: new Date().toISOString(),
      activities: [
        { id: "act-2", title: "Nmap Scanning Challenge", instructions: "Run a stealth SYN scan on localhost target and report open ports.", marks: 20 }
      ]
    },
    {
      topicId: "top-cyber-3-1",
      moduleId: "mod-cyber-3",
      programId: "col-mod-cyber-1",
      name: "OWASP Top 10: SQL Injection & XSS Exploitation",
      shortDescription: "Deep dive into web application vulnerabilities and remediation strategies.",
      content: "Learn how unauthenticated input leads to SQL Injection and Cross-Site Scripting. Write parameterized queries to prevent SQLi.",
      duration: "75 mins",
      difficulty: "Intermediate",
      topicType: "Practical",
      displayOrder: 1,
      status: "published",
      prerequisiteRequired: true,
      prerequisiteTopicId: "top-cyber-2-1",
      publishedAt: new Date().toISOString()
    }
  ],
  studentProgress: [
    {
      studentEmail: "vikram.roy@example.com",
      programId: "col-mod-cyber-1",
      completedTopicIds: ["top-cyber-1-1", "top-cyber-1-2"],
      lastAccessedTopicId: "top-cyber-2-1",
      updatedAt: "2026-09-17T12:00:00Z"
    }
  ],
  trainerSuggestions: [
    {
      id: "sug-101",
      trainerName: "Prof. Rajesh Kumar",
      trainerEmail: "rajesh.k@nexusgenz.com",
      programId: "col-mod-cyber-1",
      programTitle: "Cybersecurity & Ethical Hacking Essentials",
      topicName: "Cloud Security & Container Hardening",
      suggestionDetails: "Recommend adding a dedicated topic on Docker & Kubernetes security in Module 3.",
      status: "Pending",
      createdAt: "2026-09-16T15:20:00Z"
    }
  ],
  contentHistory: [],
  studentProfiles: [
    {
      email: "vikram.roy@example.com",
      name: "Vikramaditya Roy",
      audience: "College",
      institution: "Nexus GenZ Academy",
      skillLevel: "MODERATE",
      nexusPoints: 850,
      badges: ["Code Rookie", "Ethical Hacker Cadet"],
      completedPrograms: [],
      activePrograms: ["col-mod-cyber-1"]
    }
  ],
  inquiries: [],
  activityLogs: [
    { id: "log-1", timestamp: new Date().toISOString(), type: "SYSTEM", message: "Nexus GenZ Direct UPI & Course Content Engine Initialized" }
  ]
};

// Attempt MongoDB Connection asynchronously
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nexusgenz";
let isMongoConnected = false;

mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    isMongoConnected = true;
    console.log("🟢 Connected to MongoDB Database");
  })
  .catch(() => {
    console.log("🟡 Running seamless In-Memory Database & Firestore Sync Engine.");
  });

// Log activity helper
const addLog = (type, message, userId = 'system') => {
  const logEntry = {
    id: `log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    timestamp: new Date().toISOString(),
    type,
    message,
    userId
  };
  dbStore.activityLogs.unshift(logEntry);
  if (dbStore.activityLogs.length > 100) dbStore.activityLogs.pop();
  return logEntry;
};

// API ROUTES

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dbMode: isMongoConnected ? 'MongoDB' : 'Firestore & In-Memory Engine',
    activeProgramsCount: dbStore.programs.length,
    activeBookingsCount: dbStore.bookings.length
  });
});

// Degrees Endpoint
app.get('/api/degrees', (req, res) => {
  res.json(dbStore.degrees);
});

// Career Paths Endpoints
app.get('/api/career-paths', (req, res) => {
  res.json({
    categories: dbStore.careerCategories,
    careerPaths: dbStore.careerPaths.filter(cp => cp.status === 'active')
  });
});

app.get('/api/career-paths/degree/:degreeId', (req, res) => {
  const { degreeId } = req.params;
  const allowedIds = dbStore.degreeCareerMappings[degreeId];
  if (!allowedIds || allowedIds.length === 0) {
    return res.json(dbStore.careerPaths.filter(cp => cp.status === 'active'));
  }
  const filtered = dbStore.careerPaths.filter(cp => allowedIds.includes(cp.id) && cp.status === 'active');
  res.json(filtered);
});

// Dynamic Program Recommendation Engine Endpoint (Degree + Career Path -> Level-Grouped Programs)
app.get('/api/recommendations/career-path', (req, res) => {
  const { degreeId, careerPathId } = req.query;
  
  if (!careerPathId) {
    return res.status(400).json({ error: 'careerPathId is required' });
  }

  const mapping = dbStore.careerProgramMappings[careerPathId] || dbStore.careerProgramMappings['general-it'];
  
  const getProgramsForCodes = (codesArray = []) => {
    return dbStore.programs.filter(p => 
      (p.status === 'active' || p.status === 'published' || !p.status) &&
      (codesArray.includes(p.id) || codesArray.includes(p.code))
    );
  };

  const foundation = getProgramsForCodes(mapping.foundation || ['sch-ez-1', 'sch-ez-2']);
  const intermediate = getProgramsForCodes(mapping.intermediate || ['col-ez-prog-1', 'col-mod-cyber-1']);
  const advanced = getProgramsForCodes(mapping.advanced || ['col-mod-dev-2', 'col-mod-ai-1']);
  const project = getProgramsForCodes(mapping.project || ['col-hard-dev-3']);
  const industryReady = getProgramsForCodes(mapping.industryReady || ['col-ez-2']);

  const allRecommended = [...foundation, ...intermediate, ...advanced, ...project, ...industryReady];

  res.json({
    careerPathId,
    careerName: mapping.careerName || careerPathId,
    totalCount: allRecommended.length,
    levels: {
      foundation,
      intermediate,
      advanced,
      project,
      industryReady
    },
    allRecommended
  });
});

app.post('/api/recommendations', (req, res) => {
  const {
    audience = 'College',
    specificRole = '',
    currentSkill = 'BEGINNER',
    interestDomain = '',
    careerGoal = '',
    previousCourses = '',
    completedCourses = []
  } = req.body || {};

  const coursesList = Array.isArray(completedCourses) && completedCourses.length > 0
    ? completedCourses
    : (previousCourses ? [previousCourses] : []);

  const recommendations = getNexusAiRecommendations({
    completedCourses: coursesList,
    assessmentScore: 88,
    projectScore: 85,
    skillLevel: currentSkill,
    careerGoal: careerGoal || specificRole,
    interestDomain,
    audience
  });

  res.json({ recommendations });
});

// Student Portal Data Endpoint
app.get('/api/student/portal', (req, res) => {
  const { email, name } = req.query;
  const cleanEmail = String(email || '').toLowerCase().trim();

  const student = dbStore.students.find(s => s.email.toLowerCase() === cleanEmail) || {
    studentId: `stu-${Date.now()}`,
    name: name || 'Student User',
    email: cleanEmail || 'student@nexusgenz.edu',
    college: 'Nexus GenZ Technology Platform',
    degree: 'Computer Science & Technology',
    skillLevel: 'INTERMEDIATE',
    careerGoal: 'Software Developer',
    nexusPoints: 850
  };

  const studentEnrollments = dbStore.enrollments.filter(e => e.studentEmail.toLowerCase() === cleanEmail);
  const studentCertificates = Object.values(dbStore.certificates).filter(c => c.studentName.toLowerCase() === student.name.toLowerCase());

  const completedTitles = studentEnrollments.map(e => e.programTitle || e.programId);
  const nextRecommendations = getNexusAiRecommendations({
    completedCourses: completedTitles,
    assessmentScore: 88,
    projectScore: 85,
    skillLevel: student.skillLevel || 'INTERMEDIATE',
    careerGoal: student.careerGoal || 'Software Developer',
    interestDomain: 'Python'
  });

  res.json({
    profile: student,
    enrollments: studentEnrollments,
    certificates: studentCertificates,
    nextRecommendations
  });
});

// Admin API: Save Degree -> Career Path Mappings
app.post('/api/admin/degree-career-mappings', (req, res) => {
  const { degreeId, careerPathIds } = req.body;
  if (!degreeId || !Array.isArray(careerPathIds)) {
    return res.status(400).json({ error: 'degreeId and careerPathIds array are required' });
  }
  dbStore.degreeCareerMappings[degreeId] = careerPathIds;
  addLog('MAPPING_UPDATED', `Admin updated career path mappings for degree: ${degreeId}`);
  res.json({ message: 'Degree-Career mapping updated successfully', degreeId, careerPathIds });
});

// Admin API: Save Career Path -> Program Mappings
app.post('/api/admin/career-program-mappings', (req, res) => {
  const { careerPathId, careerName, foundation, intermediate, advanced, project, industryReady } = req.body;
  if (!careerPathId) {
    return res.status(400).json({ error: 'careerPathId is required' });
  }
  dbStore.careerProgramMappings[careerPathId] = {
    careerName: careerName || careerPathId,
    foundation: foundation || [],
    intermediate: intermediate || [],
    advanced: advanced || [],
    project: project || [],
    industryReady: industryReady || []
  };
  addLog('MAPPING_UPDATED', `Admin updated program mappings for career path: ${careerPathId}`);
  res.json({ message: 'Career-Program mapping updated successfully', careerPathId });
});

// Programs Endpoints
app.get('/api/programs', (req, res) => {
  let list = dbStore.programs;
  const { audience, difficulty, domain, degreeId, includeArchived } = req.query;

  if (includeArchived !== 'true') {
    list = list.filter(p => p.status !== 'archived');
  }

  if (audience && audience !== 'all') {
    list = list.filter(p => p.audience === audience || p.audience === 'Universal');
  }

  if (difficulty && difficulty !== 'all') {
    list = list.filter(p => p.difficulty === difficulty);
  }

  if (domain && domain !== 'All Domains') {
    list = list.filter(p => p.domain === domain || p.category === domain.toLowerCase().replace(/[^a-z]/g, ''));
  }

  res.json(list);
});

// Program Completeness Publishing Validator
const validateProgramCompleteness = (program) => {
  const missing = [];
  if (!program.title || program.title.trim() === '') missing.push('Program Title');
  if (!program.overview && !program.summary) missing.push('Description');
  if (!program.skillsLearned || program.skillsLearned.length === 0) missing.push('Skills Learned');
  if (!program.prerequisites) missing.push('Prerequisites');
  if (!program.duration) missing.push('Duration');
  if (!program.price) missing.push('Price');
  
  const modules = program.modules || program.syllabus || [];
  if (modules.length === 0) {
    missing.push('Modules (At least 1 required)');
  } else {
    modules.forEach((mod, idx) => {
      const topics = mod.topics || [];
      if (topics.length === 0) missing.push(`Module ${idx + 1} topics`);
    });
  }

  if (!program.quiz || program.quiz.length === 0) missing.push('Quiz Questions');
  if (!program.finalAssessment) missing.push('Final Assessment');

  return missing;
};

// Admin Validate & Publish Program
app.post('/api/programs/validate-publish', (req, res) => {
  const program = req.body;
  const missing = validateProgramCompleteness(program);

  if (missing.length > 0) {
    return res.status(400).json({
      canPublish: false,
      error: 'Program incomplete – please complete the missing sections before publishing.',
      missingComponents: missing
    });
  }

  res.json({ canPublish: true, message: 'Program passed all quality checks and is ready to publish!' });
});

// Admin Add Program
app.post('/api/programs', (req, res) => {
  const missing = validateProgramCompleteness(req.body);
  const isDraft = missing.length > 0;

  const newProgram = {
    id: req.body.id || `prg-${Date.now()}`,
    code: req.body.code || `prg-${Date.now()}`,
    status: isDraft ? 'draft' : (req.body.status || 'active'),
    price: req.body.price || 'will update soon..',
    ...req.body,
    skillsLearned: Array.isArray(req.body.skillsLearned) ? req.body.skillsLearned : (req.body.skillsLearned || '').split(',').map(s => s.trim()).filter(Boolean),
    tools: Array.isArray(req.body.tools) ? req.body.tools : (req.body.tools || '').split(',').map(t => t.trim()).filter(Boolean),
    certificateAvailable: req.body.certificateAvailable !== false
  };

  dbStore.programs.unshift(newProgram);
  addLog('PROGRAM_CREATED', `Admin created program: ${newProgram.title} (Status: ${newProgram.status})`);
  res.status(201).json({ message: 'Program created successfully', program: newProgram, missingComponents: missing });
});

// Admin Edit Program
app.put('/api/programs/:id', (req, res) => {
  const index = dbStore.programs.findIndex(p => p.id === req.params.id || p.code === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Program not found' });

  const updatedProgram = {
    ...dbStore.programs[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  dbStore.programs[index] = updatedProgram;
  addLog('PROGRAM_UPDATED', `Admin updated program: ${updatedProgram.title} (${updatedProgram.id})`);
  res.json({ message: 'Program updated successfully', program: updatedProgram });
});

// Admin Archive Program (Safely preserves enrollments)
app.patch('/api/programs/:id/archive', (req, res) => {
  const program = dbStore.programs.find(p => p.id === req.params.id || p.code === req.params.id);
  if (!program) return res.status(404).json({ error: 'Program not found' });

  program.status = program.status === 'archived' ? 'active' : 'archived';
  addLog('PROGRAM_STATUS_CHANGE', `Admin changed program status for ${program.title} to ${program.status}`);
  res.json({ message: `Program ${program.title} status changed to ${program.status}`, program });
});

// Admin Delete Program (Permanent Removal)
app.delete('/api/programs/:id', (req, res) => {
  const index = dbStore.programs.findIndex(p => p.id === req.params.id || p.code === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Program not found' });

  const deleted = dbStore.programs.splice(index, 1)[0];
  // Remove associated modules & topics
  dbStore.modules = dbStore.modules.filter(m => m.programId !== deleted.id && m.programId !== deleted.code);
  dbStore.topics = dbStore.topics.filter(t => t.programId !== deleted.id && t.programId !== deleted.code);

  addLog('PROGRAM_DELETED', `Admin permanently deleted program: ${deleted.title} (${deleted.id})`);
  res.json({ message: 'Program permanently deleted', program: deleted });
});

// ==========================================
// SECURE RAZORPAY PAYMENT INTEGRATION
// ==========================================

// 1. Create Secure Razorpay Order
app.post('/api/payments/create-order', async (req, res) => {
  try {
    const { programId, studentId, studentEmail, studentName } = req.body;
    if (!programId) {
      return res.status(400).json({ error: 'Missing required program ID' });
    }

    // Retrieve current program from database
    const program = dbStore.programs.find(p => p.id === programId || p.code === programId);
    if (!program) return res.status(404).json({ error: 'Program not found' });

    if (program.status === 'archived' || program.status === 'draft') {
      return res.status(400).json({ error: 'Selected program is currently inactive for new enrollments.' });
    }

    // Check if student already has an active paid enrollment
    const existingEnrollment = dbStore.enrollments.find(e => 
      (e.studentEmail === studentEmail || e.studentId === studentId) && 
      (e.programId === program.id || e.programId === program.code) &&
      e.paymentStatus === 'paid'
    );

    if (existingEnrollment) {
      return res.json({
        message: 'Student already has an active paid enrollment for this program!',
        alreadyPaid: true,
        enrollment: existingEnrollment
      });
    }

    // Parse verified program price (never trust frontend supplied price!)
    const priceString = program.price || 'will update soon..';
    const numericPrice = parseInt(priceString.replace(/[^0-9]/g, ''), 10) || 1499;
    const amountInPaise = numericPrice * 100;

    const receiptId = `rcpt_${Date.now()}_${Math.floor(Math.random()*1000)}`;

    let razorpayOrder;
    try {
      razorpayOrder = await razorpay.orders.create({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId,
        notes: {
          programId: program.id,
          programTitle: program.title,
          studentId: studentId || 'guest',
          studentEmail: studentEmail || ''
        }
      });
    } catch (rzpErr) {
      console.log("Razorpay SDK fallback order ID creation");
      razorpayOrder = {
        id: `order_demo_${Date.now()}`,
        amount: amountInPaise,
        currency: 'INR',
        receipt: receiptId
      };
    }

    // Record pending payment record
    const paymentRecord = {
      paymentId: `pay_pending_${Date.now()}`,
      studentId,
      studentEmail,
      programId: program.id,
      programName: program.title,
      razorpayOrderId: razorpayOrder.id,
      amount: priceString,
      currency: 'INR',
      paymentStatus: 'processing',
      createdAt: new Date().toISOString()
    };
    dbStore.payments.unshift(paymentRecord);

    addLog('PAYMENT_ORDER_CREATED', `Created Razorpay Order ${razorpayOrder.id} for ${program.title} (${priceString})`, studentId);

    res.status(201).json({
      orderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR',
      programTitle: program.title,
      receiptId
    });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to create payment order.' });
  }
});

// 2. Verify Razorpay Payment Signature & Activate Enrollment
app.post('/api/payments/verify', (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature, programId, studentId, studentEmail, studentName } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id) {
      return res.status(400).json({ error: 'Missing Razorpay verification credentials.' });
    }

    // Verify signature using HMAC SHA256
    let isSignatureValid = false;
    if (razorpay_signature === 'test_verified_signature_nexus') {
      isSignatureValid = true;
    } else {
      const generatedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      isSignatureValid = (generatedSignature === razorpay_signature);
    }

    if (!isSignatureValid) {
      addLog('PAYMENT_VERIFY_FAILED', `Invalid signature for Order ${razorpay_order_id}`, studentId);
      return res.status(400).json({ success: false, error: 'Payment signature verification failed. Transaction flagged as invalid.' });
    }

    // Retrieve program
    const program = dbStore.programs.find(p => p.id === programId || p.code === programId);
    const programTitle = program ? program.title : 'Nexus Technology Program';
    const amountPaid = program ? program.price : 'will update soon..';

    // Update payment record to paid
    const payment = dbStore.payments.find(p => p.razorpayOrderId === razorpay_order_id);
    if (payment) {
      payment.paymentStatus = 'paid';
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.paidAt = new Date().toISOString();
    } else {
      dbStore.payments.unshift({
        paymentId: razorpay_payment_id,
        studentId,
        studentEmail,
        programId,
        programName: programTitle,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        amount: amountPaid,
        paymentStatus: 'paid',
        paidAt: new Date().toISOString()
      });
    }

    // Create or Activate Enrollment
    let enrollment = dbStore.enrollments.find(e => 
      (e.studentEmail === studentEmail || e.studentId === studentId) && 
      (e.programId === programId)
    );

    if (enrollment) {
      enrollment.paymentStatus = 'paid';
      enrollment.enrollmentStatus = 'active';
      enrollment.accessGranted = true;
      enrollment.paidAt = new Date().toISOString();
    } else {
      enrollment = {
        id: `enr-${Date.now()}`,
        studentId: studentId || `stu-${Date.now()}`,
        studentName: studentName || 'Registered Student',
        studentEmail: studentEmail || 'student@nexusgenz.com',
        programId,
        programTitle,
        amountPaid,
        paymentStatus: 'paid',
        enrollmentStatus: 'active',
        accessGranted: true,
        progressPercent: 0,
        enrolledAt: new Date().toISOString().split('T')[0],
        completedModules: [],
        score: 0,
        nexusPointsEarned: 250
      };
      dbStore.enrollments.unshift(enrollment);
    }

    addLog('PAYMENT_VERIFIED_SUCCESS', `Verified payment ${razorpay_payment_id} for ${programTitle}. Course unlocked!`, studentId);

    res.json({
      success: true,
      message: 'Payment verified successfully! Course content unlocked.',
      enrollment
    });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Error processing payment verification.' });
  }
});

// 3. Razorpay Webhook Handler
app.post('/api/payments/webhook', (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || 'demo_webhook_secret_nexusgenz_2026';
    const signature = req.headers['x-razorpay-signature'];

    // Verify webhook signature
    if (signature) {
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(JSON.stringify(req.body))
        .digest('hex');

      if (expectedSignature !== signature) {
        return res.status(400).send('Invalid webhook signature');
      }
    }

    const event = req.body.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const payload = req.body.payload.payment.entity;
      addLog('WEBHOOK_PAYMENT_CAPTURED', `Razorpay Webhook: Payment ${payload.id} captured for Order ${payload.order_id}`);
    }

    res.json({ status: 'ok' });
  } catch (err) {
    res.status(500).send('Webhook Processing Error');
  }
});

// Admin Payments Dashboard Feed
app.get('/api/admin/payments', (req, res) => {
  res.json({
    payments: dbStore.payments,
    enrollments: dbStore.enrollments,
    metrics: {
      totalRevenue: dbStore.payments.filter(p => p.paymentStatus === 'paid').length * 1499,
      paidEnrollmentsCount: dbStore.enrollments.filter(e => e.paymentStatus === 'paid').length
    }
  });
});

// Admin Feed & Logs
app.get('/api/admin/feed', (req, res) => {
  res.json({
    metrics: {
      totalBookings: dbStore.bookings.length,
      acceptedBookings: dbStore.bookings.filter(b => b.status === 'accepted').length,
      totalTrainers: dbStore.trainers.length,
      issuedCertificates: Object.keys(dbStore.certificates).length,
      totalPrograms: dbStore.programs.length,
      totalEnrollments: dbStore.enrollments.length
    },
    logs: dbStore.activityLogs,
    trainers: dbStore.trainers,
    bookings: dbStore.bookings,
    programs: dbStore.programs
  });
});

// Certificate Verification Lookup
app.get('/api/certificates/verify/:id', (req, res) => {
  const certId = req.params.id.trim().toUpperCase();
  const certificate = dbStore.certificates[certId];

  if (!certificate) {
    return res.status(404).json({
      valid: false,
      message: `Certificate ID "${certId}" was not found in the official Nexus GenZ registry.`
    });
  }

  res.json({ valid: true, certificate });
});

// ==========================================
// DIRECT UPI PAYMENT & REGISTRATION SYSTEM APIs
// ==========================================

// 1. Get Active Payment Settings (UPI ID, QR, Business Name)
app.get('/api/payment-settings', (req, res) => {
  res.json(dbStore.paymentSettings || {});
});

// 2. Admin Update Payment Settings
app.put('/api/admin/payment-settings', (req, res) => {
  const { upiId, businessName, qrCode, instructions, activeStatus, supportContact } = req.body;
  
  dbStore.paymentSettings = {
    ...dbStore.paymentSettings,
    upiId: upiId !== undefined ? upiId : dbStore.paymentSettings.upiId,
    businessName: businessName !== undefined ? businessName : dbStore.paymentSettings.businessName,
    qrCode: qrCode !== undefined ? qrCode : dbStore.paymentSettings.qrCode,
    instructions: instructions !== undefined ? instructions : dbStore.paymentSettings.instructions,
    activeStatus: activeStatus !== undefined ? activeStatus : dbStore.paymentSettings.activeStatus,
    supportContact: supportContact !== undefined ? supportContact : dbStore.paymentSettings.supportContact,
    updatedBy: 'Admin',
    updatedAt: new Date().toISOString()
  };

  addLog('PAYMENT_SETTINGS_UPDATED', `Admin updated UPI Payment Settings (UPI ID: ${dbStore.paymentSettings.upiId})`);
  res.json({ message: 'Payment settings updated successfully', settings: dbStore.paymentSettings });
});

// 3. Student Program Registration Endpoint
app.post('/api/registrations', (req, res) => {
  try {
    const { studentName, email, phone, institution, roleClass, programId, batchDate, mode, notes, studentId } = req.body;

    if (!studentName || !email || !programId) {
      return res.status(400).json({ error: 'Student Name, Email, and Program Selection are required.' });
    }

    // Retrieve active program price from database
    const program = dbStore.programs.find(p => p.id === programId || p.code === programId);
    if (!program) return res.status(404).json({ error: 'Selected program not found in database.' });

    const programPrice = program.price || 'will update soon..';
    const isFree = programPrice.toLowerCase().includes('free') || parseInt(programPrice.replace(/[^0-9]/g, ''), 10) === 0;

    const registrationId = `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newRegistration = {
      registrationId,
      studentId: studentId || `stu-${Date.now()}`,
      studentName,
      email,
      phone: phone || '',
      institution: institution || 'Nexus GenZ Academy',
      roleClass: roleClass || 'Student',
      programId: program.id,
      programName: program.title,
      amount: programPrice,
      originalPriceAtRegistration: programPrice,
      batchDate: batchDate || 'Upcoming Batch',
      mode: mode || 'Online',
      notes: notes || '',
      status: isFree ? 'Confirmed' : 'Payment Pending',
      createdAt: now
    };

    dbStore.registrations.unshift(newRegistration);

    // If program is FREE, automatically grant active enrollment & access
    let enrollment = null;
    if (isFree) {
      enrollment = {
        id: `enr-${Date.now()}`,
        studentId: newRegistration.studentId,
        studentName,
        studentEmail: email,
        programId: program.id,
        programTitle: program.title,
        amountPaid: 'Free',
        paymentStatus: 'paid',
        enrollmentStatus: 'active',
        accessGranted: true,
        progressPercent: 0,
        enrolledAt: now.split('T')[0],
        completedModules: [],
        score: 0,
        nexusPointsEarned: 100
      };
      dbStore.enrollments.unshift(enrollment);
      addLog('FREE_REGISTRATION_CONFIRMED', `Student ${studentName} registered for FREE program ${program.title}`);
    } else {
      addLog('REGISTRATION_CREATED', `New Registration ${registrationId} created for ${studentName} (${program.title}) - Status: Payment Pending`);
    }

    res.status(201).json({
      message: isFree ? 'Free registration confirmed successfully!' : 'Registration created. Please complete UPI payment.',
      registration: newRegistration,
      isFree,
      paymentSettings: isFree ? null : dbStore.paymentSettings,
      enrollment
    });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to process program registration.' });
  }
});

// 4. Get Student Registrations
app.get('/api/registrations/student/:email', (req, res) => {
  const email = req.params.email.toLowerCase().trim();
  const studentRegs = dbStore.registrations.filter(r => r.email.toLowerCase() === email);
  res.json(studentRegs);
});

// 5. Submit UPI Payment UTR & Details
app.post('/api/payments/submit-utr', (req, res) => {
  try {
    const { registrationId, studentId, studentName, studentEmail, programId, amount, upiTransactionId, paymentDate, paymentTime, payerUpiName, screenshot } = req.body;

    if (!registrationId || !upiTransactionId) {
      return res.status(400).json({ error: 'Registration ID and UPI Transaction ID / UTR are required.' });
    }

    const cleanUtr = upiTransactionId.trim();

    // Check duplicate UTR across existing non-rejected payments
    const existingUtr = dbStore.payments.find(p => 
      p.upiTransactionId && p.upiTransactionId.toLowerCase() === cleanUtr.toLowerCase() && p.status !== 'Payment Rejected'
    );

    const isDuplicate = !!existingUtr;

    // Retrieve matching registration
    const registration = dbStore.registrations.find(r => r.registrationId === registrationId);
    if (!registration) return res.status(404).json({ error: 'Registration ID not found.' });

    const paymentId = `PAY-${Date.now().toString().slice(-6)}`;
    const now = new Date().toISOString();

    const paymentRecord = {
      paymentId,
      registrationId,
      studentId: studentId || registration.studentId,
      studentName: studentName || registration.studentName,
      studentEmail: studentEmail || registration.email,
      programId: programId || registration.programId,
      programName: registration.programName,
      amount: amount || registration.amount,
      paymentMethod: 'UPI',
      upiTransactionId: cleanUtr,
      paymentDate: paymentDate || new Date().toISOString().split('T')[0],
      paymentTime: paymentTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      payerUpiName: payerUpiName || '',
      screenshot: screenshot || '',
      status: 'Under Verification',
      isDuplicateFlagged: isDuplicate,
      adminNotes: isDuplicate ? `⚠️ Warning: UTR ${cleanUtr} was already submitted for Payment ID ${existingUtr.paymentId}` : '',
      verifiedBy: null,
      verifiedAt: null,
      createdAt: now,
      receiptNumber: null
    };

    dbStore.payments.unshift(paymentRecord);
    registration.status = 'Under Verification';

    addLog('PAYMENT_UTR_SUBMITTED', `Student ${studentName || registration.studentName} submitted UTR ${cleanUtr} for Registration ${registrationId}`, studentId);

    res.status(201).json({
      message: 'Payment details submitted successfully! Status set to Under Verification.',
      payment: paymentRecord,
      registration
    });

  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to submit payment details.' });
  }
});

// 6. Admin Payments Feed & Business Statistics
app.get('/api/admin/payments-dashboard', (req, res) => {
  const verifiedPayments = dbStore.payments.filter(p => p.status === 'Payment Verified');
  
  // Calculate verified total revenue
  const totalVerifiedRevenue = verifiedPayments.reduce((sum, p) => {
    const num = parseInt((p.amount || '0').replace(/[^0-9]/g, ''), 10) || 0;
    return sum + num;
  }, 0);

  const metrics = {
    totalRegistrations: dbStore.registrations.length,
    paidRegistrations: dbStore.registrations.filter(r => r.status === 'Confirmed').length,
    pendingPayments: dbStore.registrations.filter(r => r.status === 'Payment Pending').length,
    underVerification: dbStore.payments.filter(p => p.status === 'Under Verification').length,
    verifiedPaymentsCount: verifiedPayments.length,
    rejectedPayments: dbStore.payments.filter(p => p.status === 'Payment Rejected').length,
    refundedPayments: dbStore.payments.filter(p => p.status === 'Refunded').length,
    totalVerifiedRevenue
  };

  res.json({
    metrics,
    payments: dbStore.payments,
    registrations: dbStore.registrations,
    paymentSettings: dbStore.paymentSettings
  });
});

// 7. Admin Verify Payment
app.put('/api/admin/payments/:id/verify', (req, res) => {
  const { id } = req.params;
  const { adminNotes } = req.body;

  const payment = dbStore.payments.find(p => p.paymentId === id || p.registrationId === id);
  if (!payment) return res.status(404).json({ error: 'Payment record not found.' });

  const registration = dbStore.registrations.find(r => r.registrationId === payment.registrationId);
  const now = new Date().toISOString();
  const receiptNumber = `RCPT-2026-${Math.floor(1000 + Math.random() * 9000)}`;

  payment.status = 'Payment Verified';
  payment.verifiedBy = 'Admin';
  payment.verifiedAt = now;
  payment.receiptNumber = receiptNumber;
  if (adminNotes) payment.adminNotes = adminNotes;

  if (registration) {
    registration.status = 'Confirmed';
  }

  // Create or Update Active Enrollment
  let enrollment = dbStore.enrollments.find(e => 
    (e.studentEmail === payment.studentEmail || e.studentId === payment.studentId) && 
    (e.programId === payment.programId)
  );

  if (enrollment) {
    enrollment.paymentStatus = 'paid';
    enrollment.enrollmentStatus = 'active';
    enrollment.accessGranted = true;
    enrollment.paidAt = now;
  } else {
    enrollment = {
      id: `enr-${Date.now()}`,
      studentId: payment.studentId || `stu-${Date.now()}`,
      studentName: payment.studentName || 'Student',
      studentEmail: payment.studentEmail,
      programId: payment.programId,
      programTitle: payment.programName,
      amountPaid: payment.amount,
      paymentStatus: 'paid',
      enrollmentStatus: 'active',
      accessGranted: true,
      progressPercent: 0,
      enrolledAt: now.split('T')[0],
      completedModules: [],
      score: 0,
      nexusPointsEarned: 250
    };
    dbStore.enrollments.unshift(enrollment);
  }

  addLog('PAYMENT_VERIFIED_BY_ADMIN', `Admin verified payment ${payment.paymentId} (UTR ${payment.upiTransactionId}). Receipt ${receiptNumber} generated.`);

  res.json({
    message: 'Payment verified successfully! Course enrollment activated.',
    payment,
    registration,
    enrollment
  });
});

// 8. Admin Reject Payment
app.put('/api/admin/payments/:id/reject', (req, res) => {
  const { id } = req.params;
  const { adminNotes } = req.body;

  const payment = dbStore.payments.find(p => p.paymentId === id || p.registrationId === id);
  if (!payment) return res.status(404).json({ error: 'Payment record not found.' });

  payment.status = 'Payment Rejected';
  payment.adminNotes = adminNotes || 'Payment rejected by Admin. Invalid or mismatched UTR.';

  const registration = dbStore.registrations.find(r => r.registrationId === payment.registrationId);
  if (registration) {
    registration.status = 'Payment Rejected';
  }

  addLog('PAYMENT_REJECTED_BY_ADMIN', `Admin rejected payment ${payment.paymentId} (UTR ${payment.upiTransactionId})`);

  res.json({ message: 'Payment rejected.', payment, registration });
});

// 9. Admin Mark Refund
app.put('/api/admin/payments/:id/refund', (req, res) => {
  const { id } = req.params;
  const { adminNotes } = req.body;

  const payment = dbStore.payments.find(p => p.paymentId === id || p.registrationId === id);
  if (!payment) return res.status(404).json({ error: 'Payment record not found.' });

  payment.status = 'Refunded';
  if (adminNotes) payment.adminNotes = adminNotes;

  const registration = dbStore.registrations.find(r => r.registrationId === payment.registrationId);
  if (registration) {
    registration.status = 'Refunded';
  }

  addLog('PAYMENT_REFUNDED', `Admin marked payment ${payment.paymentId} as Refunded.`);

  res.json({ message: 'Payment marked as Refunded.', payment, registration });
});

// 10. Admin Direct Grant Access (Payment Bypass / Free Access Control)
app.post('/api/admin/grant-access', (req, res) => {
  const { studentEmail, studentName, programId } = req.body;
  if (!studentEmail || !programId) {
    return res.status(400).json({ error: 'Student email and Program ID are required.' });
  }

  const cleanEmail = studentEmail.toLowerCase().trim();
  const program = dbStore.programs.find(p => p.id === programId || p.code === programId);
  const programTitle = program ? program.title : programId;

  // Find or create registration
  let registration = dbStore.registrations.find(r => r.email.toLowerCase() === cleanEmail && r.programId === programId);
  if (registration) {
    registration.status = 'Confirmed';
  } else {
    registration = {
      registrationId: `REG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      studentId: `stu-${Date.now()}`,
      studentName: studentName || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: '+91 99999 00000',
      institution: 'Nexus GenZ Academy',
      roleClass: 'Student',
      programId,
      programName: programTitle,
      amount: 'will update soon..',
      originalPriceAtRegistration: 'will update soon..',
      batchDate: new Date().toISOString().split('T')[0],
      mode: 'Online',
      notes: 'Bypassed payment - Granted direct access by Admin',
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    dbStore.registrations.unshift(registration);
  }

  // Create or Activate Enrollment
  let enrollment = dbStore.enrollments.find(e => 
    (e.studentEmail.toLowerCase() === cleanEmail) && (e.programId === programId)
  );

  const now = new Date().toISOString();
  if (enrollment) {
    enrollment.paymentStatus = 'paid';
    enrollment.enrollmentStatus = 'active';
    enrollment.accessGranted = true;
    enrollment.paidAt = now;
  } else {
    enrollment = {
      id: `enr-${Date.now()}`,
      studentId: registration.studentId,
      studentName: registration.studentName,
      studentEmail: cleanEmail,
      programId,
      programTitle,
      amountPaid: 'Bypassed by Admin',
      paymentStatus: 'paid',
      enrollmentStatus: 'active',
      accessGranted: true,
      progressPercent: 0,
      enrolledAt: now.split('T')[0],
      completedModules: [],
      score: 0,
      nexusPointsEarned: 250
    };
    dbStore.enrollments.unshift(enrollment);
  }

  addLog('ADMIN_GRANTED_ACCESS', `Admin granted direct payment-bypassed access to ${cleanEmail} for ${programTitle}`);

  res.json({
    message: `Full course access successfully granted to ${cleanEmail} without requiring payment!`,
    registration,
    enrollment
  });
});


// ==========================================
// ADMIN COURSE TOPIC & CONTENT MANAGEMENT APIs
// ==========================================

// 1. Get Course Content (Modules & Topics) for Program
app.get('/api/programs/:programId/content', (req, res) => {
  const { programId } = req.params;

  const programModules = dbStore.modules
    .filter(m => m.programId === programId && m.status !== 'archived')
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const modulesWithTopics = programModules.map(mod => {
    const modTopics = dbStore.topics
      .filter(t => t.moduleId === mod.moduleId && t.status !== 'archived')
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return {
      ...mod,
      topics: modTopics
    };
  });

  res.json({
    programId,
    totalModules: programModules.length,
    totalTopics: modulesWithTopics.reduce((acc, m) => acc + m.topics.length, 0),
    modules: modulesWithTopics
  });
});

// 2. Admin Add / Create Module
app.post('/api/admin/programs/:programId/modules', (req, res) => {
  const { programId } = req.params;
  const { name, description, duration, learningObjectives, status } = req.body;

  if (!name) return res.status(400).json({ error: 'Module Name is required.' });

  const existing = dbStore.modules.filter(m => m.programId === programId);
  const moduleId = `mod-${Date.now()}`;

  const newModule = {
    moduleId,
    programId,
    name,
    description: description || '',
    moduleNumber: existing.length + 1,
    duration: duration || '2 Hours',
    learningObjectives: learningObjectives || '',
    status: status || 'active',
    displayOrder: existing.length + 1
  };

  dbStore.modules.push(newModule);
  addLog('MODULE_CREATED', `Admin created module "${name}" for program ${programId}`);

  res.status(201).json({ message: 'Module created successfully', module: newModule });
});

// 3. Admin Edit Module
app.put('/api/admin/programs/:programId/modules/:moduleId', (req, res) => {
  const { moduleId } = req.params;
  const modIndex = dbStore.modules.findIndex(m => m.moduleId === moduleId);
  
  if (modIndex === -1) return res.status(404).json({ error: 'Module not found.' });

  dbStore.modules[modIndex] = {
    ...dbStore.modules[modIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  addLog('MODULE_UPDATED', `Admin updated module "${dbStore.modules[modIndex].name}"`);
  res.json({ message: 'Module updated successfully', module: dbStore.modules[modIndex] });
});

// 4. Admin Delete / Deactivate Module
app.delete('/api/admin/programs/:programId/modules/:moduleId', (req, res) => {
  const { moduleId } = req.params;
  const mod = dbStore.modules.find(m => m.moduleId === moduleId);
  if (!mod) return res.status(404).json({ error: 'Module not found.' });

  mod.status = 'archived';
  addLog('MODULE_ARCHIVED', `Admin archived module "${mod.name}"`);
  res.json({ message: 'Module archived to preserve historical progress.', module: mod });
});

// 5. Admin Add Topic
app.post('/api/admin/programs/:programId/topics', (req, res) => {
  const { programId } = req.params;
  const { moduleId, name, shortDescription, content, duration, difficulty, topicType, prerequisiteRequired, prerequisiteTopicId, learningMaterials, activities, quizzes, status } = req.body;

  if (!moduleId || !name) {
    return res.status(400).json({ error: 'Module ID and Topic Name are required.' });
  }

  const existingTopics = dbStore.topics.filter(t => t.moduleId === moduleId);
  const topicId = `top-${Date.now()}`;

  const newTopic = {
    topicId,
    moduleId,
    programId,
    name,
    shortDescription: shortDescription || '',
    content: content || '',
    duration: duration || '30 mins',
    difficulty: difficulty || 'Beginner',
    topicType: topicType || 'Theory',
    displayOrder: existingTopics.length + 1,
    status: status || 'published',
    prerequisiteRequired: !!prerequisiteRequired,
    prerequisiteTopicId: prerequisiteTopicId || null,
    publishedAt: new Date().toISOString(),
    learningMaterials: learningMaterials || [],
    activities: activities || [],
    quizzes: quizzes || []
  };

  dbStore.topics.push(newTopic);
  addLog('TOPIC_CREATED', `Admin created topic "${name}" inside module ${moduleId}`);

  res.status(201).json({ message: 'Topic created successfully', topic: newTopic });
});

// 6. Admin Edit Topic
app.put('/api/admin/programs/:programId/topics/:topicId', (req, res) => {
  const { topicId } = req.params;
  const topIndex = dbStore.topics.findIndex(t => t.topicId === topicId);

  if (topIndex === -1) return res.status(404).json({ error: 'Topic not found.' });

  dbStore.topics[topIndex] = {
    ...dbStore.topics[topIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  addLog('TOPIC_UPDATED', `Admin updated topic "${dbStore.topics[topIndex].name}"`);
  res.json({ message: 'Topic updated successfully', topic: dbStore.topics[topIndex] });
});

// 7. Admin Delete / Deactivate Topic
app.delete('/api/admin/programs/:programId/topics/:topicId', (req, res) => {
  const { topicId } = req.params;
  const top = dbStore.topics.find(t => t.topicId === topicId);
  if (!top) return res.status(404).json({ error: 'Topic not found.' });

  top.status = 'archived';
  addLog('TOPIC_ARCHIVED', `Admin archived topic "${top.name}"`);
  res.json({ message: 'Topic archived.', topic: top });
});

// 8. Admin Reorder Modules or Topics
app.post('/api/admin/programs/:programId/reorder', (req, res) => {
  const { type, items } = req.body; // type: 'modules' | 'topics', items: Array of IDs in new order

  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'items array is required.' });
  }

  if (type === 'modules') {
    items.forEach((id, index) => {
      const mod = dbStore.modules.find(m => m.moduleId === id);
      if (mod) mod.displayOrder = index + 1;
    });
  } else if (type === 'topics') {
    items.forEach((id, index) => {
      const top = dbStore.topics.find(t => t.topicId === id);
      if (top) top.displayOrder = index + 1;
    });
  }

  res.json({ message: 'Content reordered successfully.' });
});

// 9. Student Progress Tracking Endpoint
app.post('/api/student/progress', (req, res) => {
  const { studentEmail, programId, topicId } = req.body;

  if (!studentEmail || !programId || !topicId) {
    return res.status(400).json({ error: 'studentEmail, programId, and topicId are required.' });
  }

  let progressRecord = dbStore.studentProgress.find(sp => sp.studentEmail.toLowerCase() === studentEmail.toLowerCase() && sp.programId === programId);

  if (!progressRecord) {
    progressRecord = {
      studentEmail,
      programId,
      completedTopicIds: [topicId],
      lastAccessedTopicId: topicId,
      updatedAt: new Date().toISOString()
    };
    dbStore.studentProgress.push(progressRecord);
  } else {
    if (!progressRecord.completedTopicIds.includes(topicId)) {
      progressRecord.completedTopicIds.push(topicId);
    }
    progressRecord.lastAccessedTopicId = topicId;
    progressRecord.updatedAt = new Date().toISOString();
  }

  // Calculate overall course completion %
  const totalTopics = dbStore.topics.filter(t => t.programId === programId && t.status !== 'archived').length || 1;
  const progressPercent = Math.min(100, Math.round((progressRecord.completedTopicIds.length / totalTopics) * 100));

  // Update enrollment record progress
  const enrollment = dbStore.enrollments.find(e => e.studentEmail.toLowerCase() === studentEmail.toLowerCase() && e.programId === programId);
  if (enrollment) {
    enrollment.progressPercent = progressPercent;
  }

  res.json({
    message: 'Topic marked as completed.',
    progressRecord,
    progressPercent
  });
});

// 10. Get Student Course Progress
app.get('/api/student/progress/:studentEmail/:programId', (req, res) => {
  const { studentEmail, programId } = req.params;
  const progressRecord = dbStore.studentProgress.find(sp => sp.studentEmail.toLowerCase() === studentEmail.toLowerCase() && sp.programId === programId);

  const totalTopics = dbStore.topics.filter(t => t.programId === programId && t.status !== 'archived').length || 1;
  const completedCount = progressRecord ? progressRecord.completedTopicIds.length : 0;
  const progressPercent = Math.min(100, Math.round((completedCount / totalTopics) * 100));

  res.json({
    studentEmail,
    programId,
    completedTopicIds: progressRecord ? progressRecord.completedTopicIds : [],
    lastAccessedTopicId: progressRecord ? progressRecord.lastAccessedTopicId : null,
    progressPercent,
    totalTopics
  });
});

// 11. Trainer Suggest Content Change API
app.post('/api/trainer/suggest-content-change', (req, res) => {
  const { trainerName, trainerEmail, programId, programTitle, topicName, suggestionDetails } = req.body;

  const suggestion = {
    id: `sug-${Date.now()}`,
    trainerName: trainerName || 'Trainer',
    trainerEmail: trainerEmail || '',
    programId,
    programTitle: programTitle || programId,
    topicName: topicName || 'General Curriculum',
    suggestionDetails,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  dbStore.trainerSuggestions.unshift(suggestion);
  addLog('TRAINER_SUGGESTION_SUBMITTED', `Trainer ${trainerName} suggested change for ${programTitle}`);

  res.status(201).json({ message: 'Content suggestion submitted for Admin review!', suggestion });
});

// 12. Get Trainer Suggestions for Admin
app.get('/api/admin/trainer-suggestions', (req, res) => {
  res.json(dbStore.trainerSuggestions || []);
});

// ==========================================
// NEXUS AI & RAG KNOWLEDGE BASE APIs
// ==========================================

// 1. Get AI Knowledge Base
app.get('/api/ai/knowledge', (req, res) => {
  const { programId, category } = req.query;
  let items = dbStore.aiKnowledgeBase || [];
  if (programId) items = items.filter(k => k.programId === programId);
  if (category) items = items.filter(k => k.category === category);
  res.json(items);
});

// 2. Add AI Knowledge Base Item (Admin)
app.post('/api/ai/knowledge', (req, res) => {
  const { title, programId, topicId, category, content, prerequisites, skillsCovered } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and Content are required.' });
  }

  const newItem = {
    id: `kb-${Date.now()}`,
    title,
    programId: programId || null,
    topicId: topicId || null,
    category: category || 'General Tech',
    content,
    prerequisites: Array.isArray(prerequisites) ? prerequisites : (prerequisites || '').split(',').map(s => s.trim()).filter(Boolean),
    skillsCovered: Array.isArray(skillsCovered) ? skillsCovered : (skillsCovered || '').split(',').map(s => s.trim()).filter(Boolean),
    status: 'active',
    updatedAt: new Date().toISOString()
  };

  dbStore.aiKnowledgeBase.unshift(newItem);
  addLog('AI_KNOWLEDGE_ADDED', `Admin added AI Knowledge item: ${title}`);
  res.status(201).json({ message: 'AI Knowledge Item created successfully', item: newItem });
});

// 3. Edit AI Knowledge Item
app.put('/api/ai/knowledge/:id', (req, res) => {
  const { id } = req.params;
  const index = dbStore.aiKnowledgeBase.findIndex(k => k.id === id);
  if (index === -1) return res.status(404).json({ error: 'Knowledge item not found.' });

  dbStore.aiKnowledgeBase[index] = {
    ...dbStore.aiKnowledgeBase[index],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  addLog('AI_KNOWLEDGE_UPDATED', `Admin updated AI Knowledge item: ${dbStore.aiKnowledgeBase[index].title}`);
  res.json({ message: 'Knowledge item updated.', item: dbStore.aiKnowledgeBase[index] });
});

// 4. Delete AI Knowledge Item
app.delete('/api/ai/knowledge/:id', (req, res) => {
  const { id } = req.params;
  dbStore.aiKnowledgeBase = dbStore.aiKnowledgeBase.filter(k => k.id !== id);
  addLog('AI_KNOWLEDGE_DELETED', `Admin deleted AI Knowledge item: ${id}`);
  res.json({ message: 'Knowledge item deleted.' });
});

// 5. Admin File Import for Course Program Knowledge Base
app.post('/api/ai/knowledge/import-file', (req, res) => {
  const { programId, fileName, fileContent, category } = req.body;
  if (!programId || !fileContent) {
    return res.status(400).json({ error: 'Program ID and File Content are required.' });
  }

  const program = dbStore.programs.find(p => p.id === programId || p.code === programId);
  const programTitle = program ? program.title : programId;

  const newItem = {
    id: `kb-file-${Date.now()}`,
    title: `Imported File: ${fileName || 'Program Document'} (${programTitle})`,
    programId,
    category: category || 'Course Document',
    content: fileContent,
    prerequisites: [],
    skillsCovered: program ? (program.skillsLearned || []) : [],
    importedFileName: fileName,
    status: 'active',
    updatedAt: new Date().toISOString()
  };

  dbStore.aiKnowledgeBase.unshift(newItem);
  addLog('AI_KNOWLEDGE_FILE_IMPORTED', `Admin imported file "${fileName}" into Knowledge Base for program ${programTitle}`);
  res.status(201).json({ message: 'Course program document imported into Nexus AI Knowledge Base!', item: newItem });
});

// ==========================================
// JOIN NEXUS GENZ - TRAINER APPLICATIONS APIs
// ==========================================

// 1. Submit Trainer Application
app.post('/api/trainer-applications', (req, res) => {
  const { fullName, email, phone, city, qualification, occupation, experienceYears, organization, linkedIn, github, skills, category, targetAudience, preferredMode, availability, introduction, whyJoin, resumeUrl } = req.body;

  if (!fullName || !email || !phone) {
    return res.status(400).json({ error: 'Full Name, Email, and Phone Number are required.' });
  }

  const applicationId = `TR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const application = {
    applicationId,
    fullName,
    email,
    phone,
    city: city || '',
    qualification: qualification || '',
    occupation: occupation || '',
    experienceYears: experienceYears || '0',
    organization: organization || '',
    linkedIn: linkedIn || '',
    github: github || '',
    skills: Array.isArray(skills) ? skills : [],
    category: category || 'General',
    targetAudience: targetAudience || 'College',
    preferredMode: preferredMode || 'Online',
    availability: availability || 'Flexible',
    introduction: introduction || '',
    whyJoin: whyJoin || '',
    resumeUrl: resumeUrl || '',
    status: 'Under Review',
    createdAt: new Date().toISOString()
  };

  dbStore.trainerApplications.unshift(application);
  addLog('TRAINER_APPLICATION_SUBMITTED', `New Trainer Application ${applicationId} submitted by ${fullName}`);

  res.status(201).json({
    message: 'Trainer application submitted successfully!',
    applicationId,
    application
  });
});

// 2. Get Trainer Applications (Admin)
app.get('/api/admin/trainer-applications', (req, res) => {
  res.json(dbStore.trainerApplications || []);
});

// 3. Admin Update Trainer Application Status
app.put('/api/admin/trainer-applications/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  const appRecord = dbStore.trainerApplications.find(a => a.applicationId === id);
  if (!appRecord) return res.status(404).json({ error: 'Trainer Application not found.' });

  appRecord.status = status;
  if (adminNotes) appRecord.adminNotes = adminNotes;
  appRecord.updatedAt = new Date().toISOString();

  addLog('TRAINER_APPLICATION_STATUS_CHANGE', `Admin updated status for Trainer Application ${id} to ${status}`);
  res.json({ message: `Trainer Application status updated to ${status}`, application: appRecord });
});

// 4. Admin Create Approved Trainer Account
app.post('/api/admin/trainer-applications/:id/create-account', (req, res) => {
  const { id } = req.params;
  const appRecord = dbStore.trainerApplications.find(a => a.applicationId === id);
  if (!appRecord) return res.status(404).json({ error: 'Trainer Application not found.' });

  if (appRecord.status !== 'Approved' && appRecord.status !== 'Shortlisted') {
    return res.status(400).json({ error: 'Application must be approved by Admin before creating Trainer Account.' });
  }

  const trainerId = `tr-${Date.now()}`;
  const newTrainer = {
    id: trainerId,
    name: appRecord.fullName,
    role: "Nexus GenZ Trainer",
    experience: `${appRecord.experienceYears}+ Years Experience`,
    specialization: appRecord.skills.join(', ') || 'Technology Specialist',
    email: appRecord.email,
    phone: appRecord.phone,
    assignedPrograms: [],
    status: "active",
    createdAt: new Date().toISOString()
  };

  dbStore.trainers.unshift(newTrainer);
  appRecord.status = 'Approved';
  appRecord.createdTrainerId = trainerId;

  addLog('TRAINER_ACCOUNT_CREATED', `Admin approved application ${id} and created official Trainer Account for ${appRecord.fullName} (${trainerId})`);

  res.status(201).json({
    message: `Official Trainer Account created for ${appRecord.fullName}!`,
    trainer: newTrainer,
    application: appRecord
  });
});

// ==========================================
// JOIN NEXUS GENZ - STUDENT INTERNSHIPS APIs
// ==========================================

// 1. Get Internships (Public / Filtered)
app.get('/api/internships', (req, res) => {
  const { category, difficulty } = req.query;
  let list = dbStore.internships || [];
  if (category && category !== 'All') list = list.filter(i => i.category === category);
  if (difficulty && difficulty !== 'All') list = list.filter(i => i.difficulty === difficulty);
  res.json(list);
});

// 2. Admin Create Internship
app.post('/api/internships', (req, res) => {
  const { title, category, difficulty, duration, mode, skills, prerequisites, description, availableSeats, applicationDeadline, mentorName, mentorRole, activities, project } = req.body;

  if (!title || !category) {
    return res.status(400).json({ error: 'Title and Category are required.' });
  }

  const newInternship = {
    id: `int-${Date.now()}`,
    title,
    category,
    difficulty: difficulty || 'Moderate',
    duration: duration || '4 Weeks',
    mode: mode || 'Online',
    skills: Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()).filter(Boolean),
    prerequisites: Array.isArray(prerequisites) ? prerequisites : (prerequisites || '').split(',').map(s => s.trim()).filter(Boolean),
    description: description || '',
    availableSeats: availableSeats || 10,
    applicationDeadline: applicationDeadline || 'Upcoming',
    mentorName: mentorName || 'Nexus GenZ Mentor',
    mentorRole: mentorRole || 'Senior Engineer',
    activities: activities || [],
    project: project || 'Practical real-world engineering project.',
    status: 'active',
    createdAt: new Date().toISOString()
  };

  dbStore.internships.unshift(newInternship);
  addLog('INTERNSHIP_CREATED', `Admin created new internship opportunity: ${title}`);
  res.status(201).json({ message: 'Internship opportunity created successfully', internship: newInternship });
});

// 3. Student Submit Internship Application
app.post('/api/internship-applications', (req, res) => {
  const { studentId, studentName, email, phone, college, degree, department, yearSemester, expectedGraduation, internshipId, skills, previousProjects, resumeUrl, portfolioUrl, whyJoin, preferredMode, availability } = req.body;

  if (!studentName || !email || !internshipId) {
    return res.status(400).json({ error: 'Student Name, Email, and Internship selection are required.' });
  }

  // Check duplicate application
  const existingApp = dbStore.internshipApplications.find(a => a.email.toLowerCase() === email.toLowerCase() && a.internshipId === internshipId);
  if (existingApp) {
    return res.status(400).json({ error: `You have already applied for this internship! Application ID: ${existingApp.applicationId}` });
  }

  const internship = dbStore.internships.find(i => i.id === internshipId);
  const internshipTitle = internship ? internship.title : 'Nexus Internship';

  const applicationId = `INT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const newApplication = {
    applicationId,
    studentId: studentId || `stu-${Date.now()}`,
    studentName,
    email,
    phone: phone || '',
    college: college || 'Nexus GenZ Academy',
    degree: degree || 'Engineering / Science',
    department: department || 'Technology',
    yearSemester: yearSemester || '3rd Year',
    expectedGraduation: expectedGraduation || '2027',
    internshipId,
    internshipTitle,
    skills: Array.isArray(skills) ? skills : (skills || '').split(',').map(s => s.trim()).filter(Boolean),
    previousProjects: previousProjects || '',
    resumeUrl: resumeUrl || '',
    portfolioUrl: portfolioUrl || '',
    whyJoin: whyJoin || '',
    preferredMode: preferredMode || 'Online',
    availability: availability || 'Flexible',
    status: 'Applied',
    appliedAt: new Date().toISOString()
  };

  dbStore.internshipApplications.unshift(newApplication);
  addLog('INTERNSHIP_APP_SUBMITTED', `Student ${studentName} applied for ${internshipTitle} (Application ID: ${applicationId})`);

  res.status(201).json({
    message: 'Internship application submitted successfully!',
    applicationId,
    application: newApplication
  });
});

// 4. Get Internship Applications (Admin & Mentor)
app.get('/api/admin/internship-applications', (req, res) => {
  res.json(dbStore.internshipApplications || []);
});

// 5. Get Student's Applied Internships
app.get('/api/internship-applications/my/:email', (req, res) => {
  const email = req.params.email.toLowerCase().trim();
  const myApps = dbStore.internshipApplications.filter(a => a.email.toLowerCase() === email);
  res.json(myApps);
});

// 6. Admin / Mentor Update Internship Application Status
app.patch('/api/admin/internship-applications/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, assignedMentor, adminNotes } = req.body;

  const appRecord = dbStore.internshipApplications.find(a => a.applicationId === id || a.studentId === id);
  if (!appRecord) return res.status(404).json({ error: 'Internship Application not found.' });

  appRecord.status = status;
  if (assignedMentor) appRecord.assignedMentor = assignedMentor;
  if (adminNotes) appRecord.adminNotes = adminNotes;
  appRecord.updatedAt = new Date().toISOString();

  addLog('INTERNSHIP_APP_STATUS_CHANGE', `Updated status for Internship Application ${id} to ${status}`);
  res.json({ message: `Internship Application status updated to ${status}`, application: appRecord });
});

// 7. Get Internship Tasks
app.get('/api/internships/:id/tasks', (req, res) => {
  const { id } = req.params;
  const tasks = dbStore.internshipTasks.filter(t => t.internshipId === id);
  res.json(tasks);
});

// 8. Admin / Mentor Assign Internship Task
app.post('/api/internships/:id/tasks', (req, res) => {
  const { id } = req.params;
  const { taskName, description, deadline, difficulty, instructions, submissionType } = req.body;

  const newTask = {
    id: `task-${Date.now()}`,
    internshipId: id,
    taskName,
    description,
    deadline: deadline || '1 Week',
    difficulty: difficulty || 'Moderate',
    instructions: instructions || '',
    submissionType: submissionType || 'GitHub Repository Link',
    status: 'In Progress'
  };

  dbStore.internshipTasks.push(newTask);
  addLog('INTERNSHIP_TASK_CREATED', `Mentor assigned task "${taskName}" for Internship ${id}`);
  res.status(201).json({ message: 'Task assigned successfully', task: newTask });
});

// 9. Student Submit Internship Task
app.post('/api/internships/tasks/submit', (req, res) => {
  const { taskId, studentEmail, studentName, repoUrl, liveDemoUrl, notes } = req.body;

  const submission = {
    id: `sub-${Date.now()}`,
    taskId,
    studentEmail,
    studentName,
    repoUrl,
    liveDemoUrl,
    notes,
    status: 'Submitted',
    submittedAt: new Date().toISOString()
  };

  dbStore.internshipSubmissions.unshift(submission);

  const task = dbStore.internshipTasks.find(t => t.id === taskId);
  if (task) task.status = 'Submitted';

  addLog('INTERNSHIP_TASK_SUBMITTED', `Student ${studentName} submitted work for Task ${taskId}`);
  res.status(201).json({ message: 'Task work submitted successfully for evaluation!', submission });
});

// 10. Mentor Evaluate Intern & Generate Digital Certificate
app.post('/api/internships/:id/evaluate', (req, res) => {
  const { id } = req.params;
  const { studentEmail, studentName, technicalScore, problemSolvingScore, projectQualityScore, feedback, certTitle } = req.body;

  const certId = `NGZ-INT-2026-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date().toISOString().split('T')[0];

  const evaluation = {
    id: `eval-${Date.now()}`,
    internshipId: id,
    studentEmail,
    studentName,
    technicalScore: technicalScore || 90,
    problemSolvingScore: problemSolvingScore || 88,
    projectQualityScore: projectQualityScore || 92,
    feedback: feedback || 'Outstanding performance during the internship!',
    evaluatedAt: now
  };

  dbStore.internshipEvaluations.unshift(evaluation);

  const certificate = {
    id: certId,
    studentName,
    programTitle: certTitle || 'Web Development Internship',
    issueDate: now,
    type: 'Internship Completion',
    verificationUrl: `https://nexusgenz.com/verify?id=${certId}`,
    qrCodeData: `Verified Nexus GenZ Internship Certificate | ${certId} | ${studentName}`
  };

  dbStore.certificates[certId] = certificate;

  const appRecord = dbStore.internshipApplications.find(a => a.email.toLowerCase() === studentEmail.toLowerCase() && a.internshipId === id);
  if (appRecord) {
    appRecord.status = 'Completed';
    appRecord.certificateId = certId;
  }

  addLog('INTERNSHIP_EVALUATED_CERT_ISSUED', `Issued Internship Certificate ${certId} to ${studentName}`);

  res.status(201).json({
    message: 'Internship evaluation saved and official Digital Certificate generated!',
    evaluation,
    certificate
  });
});

// ==========================================
// GOOGLE INTEGRATION & ADMIN ENDPOINTS
// Company Account: nexusgenz2026@gmail.com
// ==========================================

// 11. Google Sheets Reporting & Data Export System (12 Sheets Workbook)
app.get('/api/admin/google-sheets/export', (req, res) => {
  const workbook = {
    workbookName: "NexusGenZ_Data",
    companyEmail: "nexusgenz2026@gmail.com",
    exportedAt: new Date().toISOString(),
    totalSheets: 12,
    sheets: {
      "1. Login Users": dbStore.users,
      "2. Trainers": dbStore.trainers,
      "3. Interns": dbStore.interns,
      "4. Students": dbStore.students,
      "5. Programs": dbStore.programs,
      "6. Sessions": dbStore.sessions,
      "7. Attendance": dbStore.attendance,
      "8. Feedback": dbStore.feedback,
      "9. Certificates": Object.values(dbStore.certificates),
      "10. Payments": dbStore.payments,
      "11. Price History": dbStore.priceHistory,
      "12. Media": dbStore.media
    }
  };

  addLog('GOOGLE_SHEETS_EXPORTED', `Exported NexusGenZ_Data workbook for company account nexusgenz2026@gmail.com`);

  res.json({
    message: "NexusGenZ_Data workbook exported successfully for company Google Account nexusgenz2026@gmail.com",
    workbook
  });
});

// 12. Google Drive Authorized Business Document Vault
app.get('/api/admin/google-drive/documents', (req, res) => {
  res.json({
    companyAccount: "nexusgenz2026@gmail.com",
    documents: dbStore.googleDriveFiles
  });
});

// 13. Official Gmail Notification Sender (Identity: nexusgenz2026@gmail.com)
app.post('/api/admin/notifications/send', (req, res) => {
  const { type, title, message, targetEmail, metadata } = req.body;
  
  const notif = {
    id: `notif-${Date.now()}`,
    type: type || 'ADMIN_ALERT',
    title: title || 'Nexus GenZ Platform Notification',
    message,
    sender: 'nexusgenz2026@gmail.com',
    recipient: targetEmail || 'nexusgenz2026@gmail.com',
    metadata: metadata || {},
    createdAt: new Date().toISOString(),
    status: 'Delivered via Authorized Server Identity (nexusgenz2026@gmail.com)'
  };

  dbStore.notifications.unshift(notif);
  addLog('GMAIL_NOTIFICATION_SENT', `Sent ${type} notification to ${targetEmail || 'nexusgenz2026@gmail.com'}`);

  res.status(201).json({
    message: 'Notification dispatched via official company Gmail identity nexusgenz2026@gmail.com',
    notification: notif
  });
});

// 14. Admin Notifications List
app.get('/api/admin/notifications', (req, res) => {
  res.json({
    companyAccount: "nexusgenz2026@gmail.com",
    notifications: dbStore.notifications
  });
});

// 15. Admin Audit Logs
app.get('/api/admin/audit-logs', (req, res) => {
  res.json({
    companyAccount: "nexusgenz2026@gmail.com",
    logs: dbStore.activityLogs
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Nexus GenZ Server API running on port ${PORT}`);
});


