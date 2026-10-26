import { 
  User, SwapRequest, ChatMessage, Session, Review, Certificate, 
  AppNotification, ProblemReport, TargetRoleProfile, LearningPath, 
  ImprovementSuggestion, PeerRatingFactor, TimeBankTransaction, SessionAgendaTemplate 
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr_rahul',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 98201 54321',
    socialLink: 'linkedin.com/in/rahul-sharma-tech',
    city: 'Mumbai',
    photo: '',
    rating: 4.9,
    totalReviews: 14,
    bio: 'Software engineer passionate about Python, C++, and competitive coding. Looking to pick up acoustic guitar and acoustic music theory!',
    languages: ['English', 'Hindi', 'Marathi'],
    availability: 'Weekends & Weekday Evenings after 6 PM',
    experienceLevel: 'Expert',
    mode: 'Online',
    isVerified: true,
    isVerifiedMentor: true,
    successfulTeachCount: 14,
    isAdmin: false,
    skillCredits: 12,
    totalHoursTaught: 14,
    totalHoursLearned: 6,
    savingsEstimateUsd: 910,
    targetRole: 'Full Stack Software Architect',
    interests: ['Software Engineering', 'Open Source', 'Acoustic Music', 'System Architecture'],
    teachSkills: [
      { id: 'sk_1', skillName: 'Python', level: 'Expert', type: 'Teach', category: 'Technology' },
      { id: 'sk_2', skillName: 'C++', level: 'Intermediate', type: 'Teach', category: 'Technology' }
    ],
    learnSkills: [
      { id: 'sk_3', skillName: 'Guitar', level: 'Beginner', type: 'Learn', category: 'Music' },
      { id: 'sk_4', skillName: 'Digital Marketing', level: 'Beginner', type: 'Learn', category: 'Business' },
      { id: 'sk_r1', skillName: 'React', level: 'Intermediate', type: 'Learn', category: 'Technology' }
    ],
    createdAt: '2026-01-15'
  },
  {
    id: 'usr_priya',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91 99304 87654',
    socialLink: 'instagram.com/priya_guitar_notes',
    city: 'Mumbai',
    photo: '',
    rating: 4.8,
    totalReviews: 19,
    bio: 'Professional guitar instructor with 6 years experience teaching acoustic & electric. Eager to learn Python for automation & data projects.',
    languages: ['English', 'Gujarati', 'Hindi'],
    availability: 'Saturdays & Sunday afternoons',
    experienceLevel: 'Expert',
    mode: 'Online',
    isVerified: true,
    isVerifiedMentor: true,
    successfulTeachCount: 19,
    isAdmin: false,
    skillCredits: 16,
    totalHoursTaught: 19,
    totalHoursLearned: 8,
    savingsEstimateUsd: 1235,
    targetRole: 'Creative Technologist',
    interests: ['Acoustic Music', 'Music Production', 'Data Science', 'Automation'],
    teachSkills: [
      { id: 'sk_5', skillName: 'Guitar', level: 'Expert', type: 'Teach', category: 'Music' },
      { id: 'sk_6', skillName: 'Music Theory', level: 'Intermediate', type: 'Teach', category: 'Music' }
    ],
    learnSkills: [
      { id: 'sk_7', skillName: 'Python', level: 'Beginner', type: 'Learn', category: 'Technology' },
      { id: 'sk_8', skillName: 'Excel', level: 'Intermediate', type: 'Learn', category: 'Business' }
    ],
    createdAt: '2026-02-01'
  },
  {
    id: 'usr_ananya',
    name: 'Ananya Desai',
    email: 'ananya.desai@example.com',
    phone: '+91 98112 34567',
    socialLink: 'linkedin.com/in/ananya-desai-design',
    city: 'Bengaluru',
    photo: '',
    rating: 4.95,
    totalReviews: 22,
    bio: 'Lead UI/UX Designer & Design Systems architect. I teach Figma, wireframing, and interactive prototyping. Eager to learn modern React & Tailwind CSS!',
    languages: ['English', 'Hindi', 'Kannada'],
    availability: 'Weekday Evenings & Saturday Mornings',
    experienceLevel: 'Expert',
    mode: 'Online',
    isVerified: true,
    isVerifiedMentor: true,
    successfulTeachCount: 22,
    isAdmin: false,
    skillCredits: 18,
    totalHoursTaught: 22,
    totalHoursLearned: 9,
    savingsEstimateUsd: 1430,
    targetRole: 'Lead Product Designer',
    interests: ['Product Design', 'Visual Aesthetics', 'Web Development', 'Design Thinking'],
    teachSkills: [
      { id: 'sk_9', skillName: 'UI/UX Design', level: 'Expert', type: 'Teach', category: 'Design' },
      { id: 'sk_10', skillName: 'Figma', level: 'Expert', type: 'Teach', category: 'Design' },
      { id: 'sk_11', skillName: 'Design Systems', level: 'Intermediate', type: 'Teach', category: 'Design' }
    ],
    learnSkills: [
      { id: 'sk_12', skillName: 'React', level: 'Beginner', type: 'Learn', category: 'Technology' },
      { id: 'sk_13', skillName: 'Web Development', level: 'Intermediate', type: 'Learn', category: 'Technology' }
    ],
    createdAt: '2026-02-10'
  },
  {
    id: 'usr_vikram',
    name: 'Vikram Nair',
    email: 'vikram.nair@example.com',
    phone: '+91 97234 56789',
    socialLink: 'github.com/vikram-cloud',
    city: 'Pune',
    photo: '',
    rating: 4.88,
    totalReviews: 17,
    bio: 'DevOps & Cloud Engineer specializing in Docker, Kubernetes, AWS, and CI/CD pipelines. Looking to learn Python automation and system architecture.',
    languages: ['English', 'Malayalam', 'Hindi'],
    availability: 'Sunday Mornings & Weekday Evenings after 7 PM',
    experienceLevel: 'Expert',
    mode: 'Online',
    isVerified: true,
    isVerifiedMentor: true,
    successfulTeachCount: 17,
    isAdmin: false,
    skillCredits: 14,
    totalHoursTaught: 17,
    totalHoursLearned: 5,
    savingsEstimateUsd: 1105,
    targetRole: 'Cloud DevOps Architect',
    interests: ['Cloud Computing', 'DevOps', 'Distributed Systems', 'Open Source'],
    teachSkills: [
      { id: 'sk_14', skillName: 'Docker', level: 'Expert', type: 'Teach', category: 'Technology' },
      { id: 'sk_15', skillName: 'AWS Cloud', level: 'Expert', type: 'Teach', category: 'Technology' },
      { id: 'sk_16', skillName: 'DevOps', level: 'Expert', type: 'Teach', category: 'Technology' }
    ],
    learnSkills: [
      { id: 'sk_17', skillName: 'Python', level: 'Intermediate', type: 'Learn', category: 'Technology' },
      { id: 'sk_18', skillName: 'C++', level: 'Beginner', type: 'Learn', category: 'Technology' }
    ],
    createdAt: '2026-02-20'
  },
  {
    id: 'usr_sarah',
    name: 'Dr. Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    socialLink: 'linkedin.com/in/sarah-jenkins-ai',
    city: 'San Francisco',
    photo: '',
    rating: 4.92,
    totalReviews: 26,
    bio: 'AI researcher and Data Scientist. Teaching Machine Learning, PyTorch, SQL, and Data Analytics. Excited to learn UI/UX design & Figma to build clean frontend tools.',
    languages: ['English', 'Spanish'],
    availability: 'Weekends & Friday Afternoons',
    experienceLevel: 'Expert',
    mode: 'Online',
    isVerified: true,
    isVerifiedMentor: true,
    successfulTeachCount: 26,
    isAdmin: false,
    skillCredits: 21,
    totalHoursTaught: 26,
    totalHoursLearned: 11,
    savingsEstimateUsd: 1690,
    targetRole: 'AI & Data Science Specialist',
    interests: ['AI & Deep Learning', 'Data Visualization', 'Product Design', 'Fintech'],
    teachSkills: [
      { id: 'sk_19', skillName: 'Machine Learning', level: 'Expert', type: 'Teach', category: 'Technology' },
      { id: 'sk_20', skillName: 'Data Analytics', level: 'Expert', type: 'Teach', category: 'Technology' },
      { id: 'sk_21', skillName: 'SQL', level: 'Expert', type: 'Teach', category: 'Technology' }
    ],
    learnSkills: [
      { id: 'sk_22', skillName: 'Figma', level: 'Beginner', type: 'Learn', category: 'Design' },
      { id: 'sk_23', skillName: 'UI/UX Design', level: 'Beginner', type: 'Learn', category: 'Design' }
    ],
    createdAt: '2026-01-28'
  },
  {
    id: 'usr_carlos',
    name: 'Carlos Mendez',
    email: 'carlos.mendez@example.com',
    socialLink: 'instagram.com/carlos_growth',
    city: 'Austin',
    photo: '',
    rating: 4.75,
    totalReviews: 11,
    bio: 'Digital marketing strategist & fluent Spanish speaker. Teaching SEO, Social Media Growth, and Conversational Spanish. Want to learn Python for marketing automation.',
    languages: ['English', 'Spanish'],
    availability: 'Weekdays 4 PM - 8 PM',
    experienceLevel: 'Intermediate',
    mode: 'Online',
    isVerified: true,
    isVerifiedMentor: false,
    successfulTeachCount: 11,
    isAdmin: false,
    skillCredits: 9,
    totalHoursTaught: 11,
    totalHoursLearned: 4,
    savingsEstimateUsd: 715,
    targetRole: 'Growth Marketing Director',
    interests: ['Growth Marketing', 'Language Learning', 'Data Analytics', 'Entrepreneurship'],
    teachSkills: [
      { id: 'sk_24', skillName: 'Digital Marketing', level: 'Expert', type: 'Teach', category: 'Business' },
      { id: 'sk_25', skillName: 'Spanish Language', level: 'Expert', type: 'Teach', category: 'Languages' },
      { id: 'sk_26', skillName: 'SEO & Growth', level: 'Intermediate', type: 'Teach', category: 'Business' }
    ],
    learnSkills: [
      { id: 'sk_27', skillName: 'Python', level: 'Beginner', type: 'Learn', category: 'Technology' },
      { id: 'sk_28', skillName: 'Guitar', level: 'Beginner', type: 'Learn', category: 'Music' }
    ],
    createdAt: '2026-03-01'
  },
  {
    id: 'usr_admin',
    name: 'Kedar Shivkar (Admin)',
    email: 'kedarshivkar21@gmail.com',
    city: 'Mumbai',
    photo: '',
    rating: 5.0,
    totalReviews: 50,
    bio: 'SkillSwap Platform Administrator with full access to manage bookings, user accounts, and platform operations.',
    languages: ['English', 'Hindi', 'Marathi'],
    availability: '24/7 Platform Monitoring',
    experienceLevel: 'Expert',
    mode: 'Online',
    isVerified: true,
    isVerifiedMentor: true,
    successfulTeachCount: 50,
    isAdmin: true,
    skillCredits: 50,
    totalHoursTaught: 50,
    totalHoursLearned: 20,
    savingsEstimateUsd: 3250,
    interests: ['Platform Operations', 'Community Safety', 'Skill Exchange Ecosystem'],
    teachSkills: [],
    learnSkills: [],
    createdAt: '2026-01-01'
  }
];

export const INITIAL_SWAP_REQUESTS: SwapRequest[] = [
  {
    id: 'req_1',
    senderId: 'usr_rahul',
    receiverId: 'usr_priya',
    teachSkill: 'Python',
    learnSkill: 'Guitar',
    status: 'Accepted',
    createdAt: '2026-07-20 10:30',
    notes: 'Hi Priya! I can teach you Python basics & automation scripts in exchange for acoustic guitar chords.',
    scheduledTime: '2026-07-26 17:00',
    meetingLocation: 'Google Meet',
    meetingType: 'Online',
    zoomLink: 'https://meet.google.com/abc-skillswap-xyz',
    isFirstFreeSwap: false,
    isContactUnlocked: true,
    depositAmount: 31,
    refundAmount: 24,
    platformFee: 7
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg_1',
    swapRequestId: 'req_1',
    senderId: 'usr_rahul',
    receiverId: 'usr_priya',
    message: 'Hi Priya! Thanks for accepting the swap request. Exciting to exchange Python and Guitar skills!',
    time: '10:32 AM',
    isRead: true
  },
  {
    id: 'msg_2',
    swapRequestId: 'req_1',
    senderId: 'usr_priya',
    receiverId: 'usr_rahul',
    message: 'Hey Rahul! Perfect match indeed! Let us schedule our first session for this Saturday at 5 PM.',
    time: '10:35 AM',
    isRead: true
  },
  {
    id: 'msg_3',
    swapRequestId: 'req_1',
    senderId: 'usr_rahul',
    receiverId: 'usr_priya',
    message: 'Sounds great! I created the Google Meet video call link.',
    time: '10:38 AM',
    attachments: [
      { name: 'Google Meet Video Call', url: 'https://meet.google.com/abc-skillswap-xyz', type: 'zoom' }
    ],
    isRead: true
  }
];

export const INITIAL_SESSIONS: Session[] = [
  {
    id: 'ses_1',
    swapRequestId: 'req_1',
    teacherId: 'usr_priya',
    learnerId: 'usr_rahul',
    skillName: 'Guitar Fundamentals & Basic Chords',
    date: '2026-07-26',
    time: '17:00',
    meetingType: 'Online',
    locationOrLink: 'https://meet.google.com/abc-skillswap-xyz',
    status: 'Scheduled',
    teacherConfirmed: false,
    studentConfirmed: false,
    qrCodeData: 'SKILLSWAP-SESSION-PRIYA-RAHUL-GUITAR-2026'
  },
  {
    id: 'ses_comp_1',
    swapRequestId: 'req_comp_1',
    teacherId: 'usr_rahul',
    learnerId: 'usr_priya',
    skillName: 'Python Programming Essentials',
    date: '2026-07-16',
    time: '16:00',
    meetingType: 'Online',
    locationOrLink: 'https://meet.google.com/py-session-complete',
    status: 'Completed',
    teacherConfirmed: true,
    studentConfirmed: true,
    qrCodeData: 'SKILLSWAP-COMPLETED-PY-01'
  },
  {
    id: 'ses_comp_2',
    swapRequestId: 'req_comp_2',
    teacherId: 'usr_ananya',
    learnerId: 'usr_vikram',
    skillName: 'Figma Component Systems & Auto-Layout',
    date: '2026-07-18',
    time: '14:00',
    meetingType: 'Online',
    locationOrLink: 'https://meet.google.com/figma-design-ses',
    status: 'Completed',
    teacherConfirmed: true,
    studentConfirmed: true,
    qrCodeData: 'SKILLSWAP-COMPLETED-FIGMA-02'
  },
  {
    id: 'ses_comp_3',
    swapRequestId: 'req_comp_3',
    teacherId: 'usr_sarah',
    learnerId: 'usr_rahul',
    skillName: 'Machine Learning Neural Networks Primer',
    date: '2026-07-12',
    time: '18:30',
    meetingType: 'Online',
    locationOrLink: 'https://meet.google.com/ml-neural-net',
    status: 'Completed',
    teacherConfirmed: true,
    studentConfirmed: true,
    qrCodeData: 'SKILLSWAP-COMPLETED-ML-03'
  },
  {
    id: 'ses_comp_4',
    swapRequestId: 'req_comp_4',
    teacherId: 'usr_vikram',
    learnerId: 'usr_carlos',
    skillName: 'Docker Container Deployment on AWS',
    date: '2026-07-10',
    time: '11:00',
    meetingType: 'Online',
    locationOrLink: 'https://meet.google.com/docker-cloud-ses',
    status: 'Completed',
    teacherConfirmed: true,
    studentConfirmed: true,
    qrCodeData: 'SKILLSWAP-COMPLETED-DOCKER-04'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev_1',
    reviewerId: 'usr_priya',
    receiverId: 'usr_rahul',
    rating: 5,
    comment: 'Rahul explained Python data structures with incredible patience and real-world examples! Highly recommended teacher.',
    skillName: 'Python',
    date: '2026-07-16'
  },
  {
    id: 'rev_2',
    reviewerId: 'usr_rahul',
    receiverId: 'usr_priya',
    rating: 5,
    comment: 'Priya made acoustic chord transitions so natural. Her fingerpicking exercises helped me play my first song in one afternoon!',
    skillName: 'Guitar',
    date: '2026-07-17'
  },
  {
    id: 'rev_3',
    reviewerId: 'usr_vikram',
    receiverId: 'usr_ananya',
    rating: 5,
    comment: 'Ananya is a master of Figma auto-layout and design token architectures. My frontend mockups look 10x more polished now.',
    skillName: 'Figma',
    date: '2026-07-19'
  },
  {
    id: 'rev_4',
    reviewerId: 'usr_carlos',
    receiverId: 'usr_vikram',
    rating: 5,
    comment: 'Vikram simplified AWS ECS & Docker clustering effortlessly. Practical, hands-on, and extremely knowledgeable.',
    skillName: 'AWS Cloud',
    date: '2026-07-11'
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_1',
    userId: 'usr_priya',
    userName: 'Priya Patel',
    teacherName: 'Rahul Sharma',
    skillName: 'Python Programming Essentials',
    issueDate: '2026-07-16',
    certificateCode: 'SKILLSWAP-CERT-2026-PY8892',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-PY8892',
    issuer: 'SkillSwap Peer Verification Board & Python Guild'
  },
  {
    id: 'cert_priya_guitar',
    userId: 'usr_priya',
    userName: 'Priya Patel',
    teacherName: 'Trinity Acoustic Faculty & SkillSwap Board',
    skillName: 'Acoustic Guitar & Music Theory Mastery',
    issueDate: '2026-04-12',
    certificateCode: 'SKILLSWAP-CERT-2026-GTR-1044',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-GTR-1044',
    issuer: 'Trinity Guildhall Music Board & SkillSwap Certified Instructor'
  },
  {
    id: 'cert_rahul_py',
    userId: 'usr_rahul',
    userName: 'Rahul Sharma',
    teacherName: 'SkillSwap Senior Engineering Council',
    skillName: 'Python Backend & Algorithm Architecture',
    issueDate: '2026-05-18',
    certificateCode: 'SKILLSWAP-CERT-2026-PY-9921',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-PY-9921',
    issuer: 'Python Software Peer Foundation & SkillSwap Verified'
  },
  {
    id: 'cert_rahul_cpp',
    userId: 'usr_rahul',
    userName: 'Rahul Sharma',
    teacherName: 'ACM Competitive Systems Exchange',
    skillName: 'C++ High-Performance Systems & DSA',
    issueDate: '2026-03-24',
    certificateCode: 'SKILLSWAP-CERT-2026-CPP-4421',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-CPP-4421',
    issuer: 'ACM Systems Exchange & SkillSwap'
  },
  {
    id: 'cert_ananya_ux',
    userId: 'usr_ananya',
    userName: 'Ananya Desai',
    teacherName: 'Interaction Design Foundation & SkillSwap Council',
    skillName: 'UI/UX Design Systems & Design Thinking',
    issueDate: '2026-05-20',
    certificateCode: 'SKILLSWAP-CERT-2026-UX-3310',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-UX-3310',
    issuer: 'Design Systems Guild & SkillSwap Verified'
  },
  {
    id: 'cert_ananya_figma',
    userId: 'usr_ananya',
    userName: 'Ananya Desai',
    teacherName: 'Figma Community Guild & Peer Mentors',
    skillName: 'Figma Component Systems & Auto-Layout',
    issueDate: '2026-06-02',
    certificateCode: 'SKILLSWAP-CERT-2026-FGM-5519',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-FGM-5519',
    issuer: 'Figma Certified Peer Community'
  },
  {
    id: 'cert_vikram_aws',
    userId: 'usr_vikram',
    userName: 'Vikram Nair',
    teacherName: 'Cloud Solutions Mentor Guild',
    skillName: 'AWS Cloud Solutions Architecture',
    issueDate: '2026-06-08',
    certificateCode: 'SKILLSWAP-CERT-2026-AWS-6612',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-AWS-6612',
    issuer: 'AWS Cloud Architecture Peer Board'
  },
  {
    id: 'cert_vikram_docker',
    userId: 'usr_vikram',
    userName: 'Vikram Nair',
    teacherName: 'DevOps & Containerization Alliance',
    skillName: 'Docker Containerization & Kubernetes Pipelines',
    issueDate: '2026-04-19',
    certificateCode: 'SKILLSWAP-CERT-2026-DOC-1194',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-DOC-1194',
    issuer: 'DevOps Exchange Alliance & SkillSwap'
  },
  {
    id: 'cert_sarah_ml',
    userId: 'usr_sarah',
    userName: 'Dr. Sarah Jenkins',
    teacherName: 'AI Research Alliance & SkillSwap Board',
    skillName: 'Machine Learning & Deep Neural Networks',
    issueDate: '2026-05-14',
    certificateCode: 'SKILLSWAP-CERT-2026-ML-5520',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-ML-5520',
    issuer: 'AI Research Alliance & SkillSwap Verified Mentor'
  },
  {
    id: 'cert_sarah_sql',
    userId: 'usr_sarah',
    userName: 'Dr. Sarah Jenkins',
    teacherName: 'Data Science & Analytics Association',
    skillName: 'SQL Data Analytics & Query Optimization',
    issueDate: '2026-03-11',
    certificateCode: 'SKILLSWAP-CERT-2026-SQL-8831',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-SQL-8831',
    issuer: 'Data Analytics Association'
  },
  {
    id: 'cert_carlos_mkt',
    userId: 'usr_carlos',
    userName: 'Carlos Mendez',
    teacherName: 'Growth Marketing Institute & Peer Council',
    skillName: 'Digital Marketing & Growth Funnels',
    issueDate: '2026-06-15',
    certificateCode: 'SKILLSWAP-CERT-2026-MKT-2290',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-MKT-2290',
    issuer: 'Growth Marketing Institute & SkillSwap'
  },
  {
    id: 'cert_carlos_esp',
    userId: 'usr_carlos',
    userName: 'Carlos Mendez',
    teacherName: 'Language Exchange Guild & Native Mentors',
    skillName: 'Spanish Language & Conversational Fluency',
    issueDate: '2026-02-28',
    certificateCode: 'SKILLSWAP-CERT-2026-ESP-3341',
    qrCodeData: 'https://skillswap.org/verify/SKILLSWAP-CERT-2026-ESP-3341',
    issuer: 'Language Exchange Guild'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif_1',
    userId: 'usr_rahul',
    title: 'Swap Request Accepted! 🎉',
    message: 'Priya Patel accepted your request to swap Python for Guitar skills.',
    date: '2026-07-20 10:31',
    read: false,
    type: 'accepted',
    linkTo: 'messages'
  },
  {
    id: 'notif_2',
    userId: 'usr_priya',
    title: 'Upcoming Session Reminder 📅',
    message: 'Your Guitar lesson with Rahul Sharma is scheduled for Saturday at 5:00 PM.',
    date: '2026-07-22 09:00',
    read: true,
    type: 'reminder',
    linkTo: 'schedule'
  }
];

export const INITIAL_PROBLEM_REPORTS: ProblemReport[] = [
  {
    id: 'rep_101',
    reporterId: 'usr_rahul',
    reporterName: 'Rahul Sharma',
    reporterEmail: 'rahul.sharma@example.com',
    reportedUserId: 'usr_priya',
    reportedUserName: 'Priya Patel',
    reportedUserEmail: 'priya.patel@example.com',
    swapRequestId: 'req_1',
    teachSkill: 'Python',
    learnSkill: 'Guitar',
    category: 'Audio / Video Technical Issue',
    priority: 'Normal',
    description: 'We had slight audio feedback noise while tuning the guitar through the meet link. Requesting admin tip on best microphone settings.',
    createdAt: '2026-07-21 14:30',
    status: 'Resolved',
    adminNotes: 'Recommended enabling high-fidelity audio mode and noise cancellation.',
    adminActionTaken: 'Provided technical guidance on meeting setup.',
    resolvedAt: '2026-07-21 16:00',
    resolvedBy: 'Admin (Kedar Shivkar)'
  }
];

export const POPULAR_SKILL_TAGS = [
  'Python', 'Guitar', 'Photoshop', 'Excel', 'Graphic Design',
  'Cooking', 'Digital Marketing', 'Public Speaking', 'C++',
  'Web Development', 'Music Theory', 'French Language', 'Yoga',
  'Data Analytics', 'Financial Modeling', 'Figma', 'React', 'Docker',
  'AWS Cloud', 'Machine Learning', 'UI/UX Design', 'SQL'
];

export const TARGET_ROLES: TargetRoleProfile[] = [
  {
    id: 'role_fullstack',
    title: 'Full Stack Web Developer',
    category: 'Software Engineering',
    description: 'Build end-to-end modern web applications spanning client interfaces, server APIs, databases, and deployment pipelines.',
    avgSalaryRange: '$95,000 - $145,000 / year',
    typicalBootcampCost: 14500,
    requiredSkills: [
      { skillName: 'React', level: 'Intermediate', importance: 'Critical', category: 'Technology' },
      { skillName: 'Python', level: 'Intermediate', importance: 'Critical', category: 'Technology' },
      { skillName: 'Web Development', level: 'Intermediate', importance: 'Critical', category: 'Technology' },
      { skillName: 'SQL', level: 'Intermediate', importance: 'Important', category: 'Technology' },
      { skillName: 'Docker', level: 'Beginner', importance: 'Bonus', category: 'Technology' },
      { skillName: 'UI/UX Design', level: 'Beginner', importance: 'Bonus', category: 'Design' }
    ]
  },
  {
    id: 'role_aiml',
    title: 'AI & Machine Learning Engineer',
    category: 'Artificial Intelligence',
    description: 'Architect, fine-tune, and deploy machine learning models, neural pipelines, and LLM-powered applications.',
    avgSalaryRange: '$120,000 - $185,000 / year',
    typicalBootcampCost: 16000,
    requiredSkills: [
      { skillName: 'Python', level: 'Expert', importance: 'Critical', category: 'Technology' },
      { skillName: 'Machine Learning', level: 'Intermediate', importance: 'Critical', category: 'Technology' },
      { skillName: 'Data Analytics', level: 'Intermediate', importance: 'Important', category: 'Technology' },
      { skillName: 'SQL', level: 'Intermediate', importance: 'Important', category: 'Technology' },
      { skillName: 'Docker', level: 'Beginner', importance: 'Bonus', category: 'Technology' }
    ]
  },
  {
    id: 'role_product_design',
    title: 'Lead Product / UI/UX Designer',
    category: 'Design & User Experience',
    description: 'Design intuitive interfaces, create scalable design systems, run user research, and craft delightful interactive flows.',
    avgSalaryRange: '$90,000 - $140,000 / year',
    typicalBootcampCost: 12000,
    requiredSkills: [
      { skillName: 'UI/UX Design', level: 'Expert', importance: 'Critical', category: 'Design' },
      { skillName: 'Figma', level: 'Expert', importance: 'Critical', category: 'Design' },
      { skillName: 'Design Systems', level: 'Intermediate', importance: 'Critical', category: 'Design' },
      { skillName: 'Web Development', level: 'Beginner', importance: 'Important', category: 'Technology' },
      { skillName: 'React', level: 'Beginner', importance: 'Bonus', category: 'Technology' }
    ]
  },
  {
    id: 'role_cloud_devops',
    title: 'Cloud & DevOps Architect',
    category: 'Infrastructure & Operations',
    description: 'Design resilient multi-cloud architectures, automate CI/CD release cycles, manage container clusters, and harden security.',
    avgSalaryRange: '$115,000 - $165,000 / year',
    typicalBootcampCost: 13500,
    requiredSkills: [
      { skillName: 'Docker', level: 'Expert', importance: 'Critical', category: 'Technology' },
      { skillName: 'AWS Cloud', level: 'Expert', importance: 'Critical', category: 'Technology' },
      { skillName: 'DevOps', level: 'Intermediate', importance: 'Critical', category: 'Technology' },
      { skillName: 'Python', level: 'Intermediate', importance: 'Important', category: 'Technology' },
      { skillName: 'C++', level: 'Beginner', importance: 'Bonus', category: 'Technology' }
    ]
  },
  {
    id: 'role_data_analyst',
    title: 'Data Analyst & BI Specialist',
    category: 'Data & Analytics',
    description: 'Transform complex enterprise datasets into actionable business intelligence dashboards, SQL models, and executive insights.',
    avgSalaryRange: '$80,000 - $125,000 / year',
    typicalBootcampCost: 9800,
    requiredSkills: [
      { skillName: 'SQL', level: 'Expert', importance: 'Critical', category: 'Technology' },
      { skillName: 'Data Analytics', level: 'Expert', importance: 'Critical', category: 'Technology' },
      { skillName: 'Python', level: 'Intermediate', importance: 'Important', category: 'Technology' },
      { skillName: 'Excel', level: 'Expert', importance: 'Critical', category: 'Business' }
    ]
  },
  {
    id: 'role_growth_marketer',
    title: 'Growth & Digital Marketing Strategist',
    category: 'Marketing & Business',
    description: 'Spearhead organic search rank, paid acquisition campaigns, viral loop experiments, and automated funnel conversion.',
    avgSalaryRange: '$75,000 - $115,000 / year',
    typicalBootcampCost: 8500,
    requiredSkills: [
      { skillName: 'Digital Marketing', level: 'Expert', importance: 'Critical', category: 'Business' },
      { skillName: 'SEO & Growth', level: 'Expert', importance: 'Critical', category: 'Business' },
      { skillName: 'Data Analytics', level: 'Intermediate', importance: 'Important', category: 'Technology' },
      { skillName: 'Python', level: 'Beginner', importance: 'Bonus', category: 'Technology' }
    ]
  }
];

export const DEFAULT_LEARNING_PATHS: Record<string, LearningPath> = {
  role_fullstack: {
    id: 'path_fullstack',
    targetRole: 'Full Stack Web Developer',
    goalSummary: 'Bridge frontend and backend engineering through interactive milestones, pair programming exchanges, and production deployment.',
    totalWeeks: 8,
    completedMilestones: 2,
    milestones: [
      {
        id: 'ms_fs_1',
        weekNumber: 1,
        title: 'Modern Frontend Architecture & State Flow',
        summary: 'Deep dive into component lifecycle, hooks, and responsive Tailwind UI styling.',
        keySkills: ['React', 'Web Development'],
        completed: true,
        checkpoints: [
          'Master React hooks (useState, useEffect, useMemo, custom hooks)',
          'Construct accessible component library with Tailwind CSS utilities',
          'Deploy first interactive dashboard on Vercel or Cloud Run'
        ],
        resources: [
          { id: 'res_1', title: 'React Official Documentation (Beta v19)', type: 'Documentation', url: 'https://react.dev', isFree: true, estimatedMinutes: 90 },
          { id: 'res_2', title: 'Tailwind CSS Grid & Flex Masterclass', type: 'Video Course', url: 'https://tailwindcss.com/docs', isFree: true, estimatedMinutes: 45 }
        ],
        project: {
          id: 'proj_1',
          title: 'Interactive Real-Time Kanban Board',
          description: 'Build a drag-and-drop task workflow dashboard with local state persistence and keyboard accessibility.',
          difficulty: 'Intermediate',
          deliverables: ['Responsive UI layout', 'Drag-and-drop card movement', 'Local storage sync'],
          estimatedHours: 6
        }
      },
      {
        id: 'ms_fs_2',
        weekNumber: 3,
        title: 'Backend API Engineering & Asynchronous Services',
        summary: 'Design RESTful endpoints, request validation, authentication tokens, and async job queues in Python.',
        keySkills: ['Python', 'SQL'],
        completed: true,
        checkpoints: [
          'Design OpenAPI spec with schema validations',
          'Implement JWT bearer token authentication and middleware',
          'Optimize database queries with indexes and joins'
        ],
        resources: [
          { id: 'res_3', title: 'FastAPI High-Performance Async Patterns', type: 'Documentation', url: 'https://fastapi.tiangolo.com', isFree: true, estimatedMinutes: 75 },
          { id: 'res_4', title: 'Relational Database Indexing & Query Tuning', type: 'Article', url: 'https://use-the-index-luke.com', isFree: true, estimatedMinutes: 60 }
        ],
        project: {
          id: 'proj_2',
          title: 'Secure Peer-to-Peer Booking Microservice',
          description: 'Develop an authenticated REST API supporting session slot reservations with collision prevention.',
          difficulty: 'Intermediate',
          deliverables: ['Auth routes & hashing', 'Transaction safe slot lock', 'Swagger docs test suite'],
          estimatedHours: 8
        }
      },
      {
        id: 'ms_fs_3',
        weekNumber: 5,
        title: 'Database Schema Normalization & Realtime Sync',
        summary: 'Build robust data models, transactions, and live websocket / push event sync.',
        keySkills: ['SQL', 'Web Development'],
        completed: false,
        checkpoints: [
          'Design 3rd normal form relational schema with foreign key constraints',
          'Implement connection pooling and prepared statements',
          'Handle real-time notification broadcast via WebSockets'
        ],
        resources: [
          { id: 'res_5', title: 'PostgreSQL Architecture and Connection Pooling', type: 'Documentation', url: 'https://postgresql.org/docs', isFree: true, estimatedMinutes: 80 }
        ],
        project: {
          id: 'proj_3',
          title: 'Live Multiplayer Whiteboard & Chat Engine',
          description: 'Synchronize cursor positions and collaborative notes across multiple browser tabs.',
          difficulty: 'Advanced',
          deliverables: ['Bidirectional socket stream', 'Conflict resolution logic', 'Latency monitoring'],
          estimatedHours: 10
        }
      },
      {
        id: 'ms_fs_4',
        weekNumber: 7,
        title: 'Docker Containerization & CI/CD Cloud Pipeline',
        summary: 'Containerize multi-stage builds, setup automated GitHub actions, and deploy to production.',
        keySkills: ['Docker', 'AWS Cloud'],
        completed: false,
        checkpoints: [
          'Write optimized multi-stage Dockerfile minimizing image footprint',
          'Setup automated unit & integration test pipeline in GitHub Actions',
          'Configure zero-downtime rolling deployment'
        ],
        resources: [
          { id: 'res_6', title: 'Production Ready Dockerfiles Best Practices', type: 'Article', url: 'https://docs.docker.com', isFree: true, estimatedMinutes: 50 }
        ],
        project: {
          id: 'proj_4',
          title: 'Full-Stack Capstone: Automated Skill Marketplace',
          description: 'Package client, backend, and database into docker-compose and deploy to cloud with SSL and health checks.',
          difficulty: 'Advanced',
          deliverables: ['Production Dockerfile', 'GitHub Actions workflow', 'Live HTTPS URL deployment'],
          estimatedHours: 14
        }
      }
    ],
    createdAt: '2026-03-01'
  },
  role_aiml: {
    id: 'path_aiml',
    targetRole: 'AI & Machine Learning Engineer',
    goalSummary: 'Master modern machine learning workflows from dataset curation and feature engineering to LLM fine-tuning and inference serving.',
    totalWeeks: 8,
    completedMilestones: 1,
    milestones: [
      {
        id: 'ms_ai_1',
        weekNumber: 1,
        title: 'Data Wrangling, Vector Math & NumPy Pipelines',
        summary: 'Matrix operations, vectorized computation, Pandas transformations, and exploratory data visualization.',
        keySkills: ['Python', 'Data Analytics'],
        completed: true,
        checkpoints: [
          'Perform vector broadcasting and linear algebra transforms in NumPy',
          'Clean noisy datasets with Pandas imputation and outlier handling',
          'Generate distribution plots and correlation heatmaps'
        ],
        resources: [
          { id: 'res_ai1', title: 'NumPy Vectorization & Memory Layout', type: 'Documentation', url: 'https://numpy.org/doc', isFree: true, estimatedMinutes: 60 }
        ],
        project: {
          id: 'proj_ai1',
          title: 'Automated Financial Trend & Anomaly Detector',
          description: 'Analyze time-series price signals and calculate moving Bollinger bands and anomaly z-scores.',
          difficulty: 'Intermediate',
          deliverables: ['Cleaned feature matrix', 'Rolling metric pipeline', 'Visual anomaly graph'],
          estimatedHours: 6
        }
      },
      {
        id: 'ms_ai_2',
        weekNumber: 3,
        title: 'Supervised Learning & Model Evaluation Metrics',
        summary: 'Train gradient boosted trees and regression models with cross-validation and hyperparameter search.',
        keySkills: ['Machine Learning', 'Python'],
        completed: false,
        checkpoints: [
          'Implement stratified K-fold cross validation',
          'Evaluate Precision, Recall, ROC-AUC, and F1 tradeoffs',
          'Tune hyperparameters with Bayesian optimization'
        ],
        resources: [
          { id: 'res_ai2', title: 'Scikit-Learn Model Selection & Evaluation', type: 'Documentation', url: 'https://scikit-learn.org', isFree: true, estimatedMinutes: 80 }
        ],
        project: {
          id: 'proj_ai2',
          title: 'User Churn & Skill Match Probability Predictor',
          description: 'Train an ensemble model to forecast high-affinity skill exchange pairings with 88%+ accuracy.',
          difficulty: 'Intermediate',
          deliverables: ['Feature importance plot', 'Confusion matrix report', 'Trained model artifact'],
          estimatedHours: 8
        }
      },
      {
        id: 'ms_ai_3',
        weekNumber: 6,
        title: 'Deep Learning & Neural Architectures',
        summary: 'Build feedforward and transformer architectures in PyTorch with backpropagation and loss convergence.',
        keySkills: ['Machine Learning', 'Python'],
        completed: false,
        checkpoints: [
          'Build custom PyTorch Dataset & DataLoader modules',
          'Implement attention mechanism and embedding projections',
          'Prevent overfitting with dropout, weight decay, and learning rate warmups'
        ],
        resources: [
          { id: 'res_ai3', title: 'PyTorch Neural Network Training Pipeline', type: 'Interactive Sandbox', url: 'https://pytorch.org/tutorials', isFree: true, estimatedMinutes: 100 }
        ],
        project: {
          id: 'proj_ai3',
          title: 'Semantic Skill Taxonomy Embedding Engine',
          description: 'Generate dense vector embeddings for 500+ skills to find semantic equivalents (e.g. "Golang" matches "Backend Systems").',
          difficulty: 'Advanced',
          deliverables: ['Vector index (HNSW / FAISS)', 'Cosine similarity benchmark', 'Fast lookup API'],
          estimatedHours: 12
        }
      }
    ],
    createdAt: '2026-03-01'
  }
};

export const SAMPLE_SESSION_AGENDAS: Record<string, SessionAgendaTemplate[]> = {
  Python: [
    {
      topic: 'Clean Architecture & Asynchronous Programming in Python',
      duration: '45 mins',
      suggestedActivity: 'Pair Programming: Live refactoring of a synchronous script into an async asyncio pipeline',
      icebreakerQuestions: [
        'What was your biggest surprise when first writing async/await in Python?',
        'How do you currently handle error catching and logging in your scripts?'
      ],
      learningExercises: [
        'Identify blocking I/O bottlenecks in 3 code snippets',
        'Convert requests.get loops to high-concurrency aiohttp tasks',
        'Write custom context managers using @contextlib.asynccontextmanager'
      ],
      deliverableOutcomes: [
        'A working script demonstrating 10x throughput boost on API calls',
        'Shared cheat sheet on GIL vs multiprocessing vs asyncio'
      ]
    },
    {
      topic: 'Data Structures, Dictionaries & Memory Optimization',
      duration: '45 mins',
      suggestedActivity: 'Code Review: Profile memory usage and algorithmic complexity of custom data pipelines',
      icebreakerQuestions: [
        'Have you ever encountered a MemoryError or 100% CPU lockup in Python?',
        'What is your go-to method for inspecting dictionary keys and nested lists?'
      ],
      learningExercises: [
        'Benchmark list comprehensions vs generator expressions on 1M items',
        'Implement collections.defaultdict and Counter for rapid grouping',
        'Use sys.getsizeof to observe memory footprint across data types'
      ],
      deliverableOutcomes: [
        'Refactored code with 60% lower RAM footprint',
        'Deep understanding of O(1) hashing versus O(N) search'
      ]
    }
  ],
  React: [
    {
      topic: 'Modern React State Flow & Custom Hooks Architecture',
      duration: '50 mins',
      suggestedActivity: 'Interactive Sandbox: Extract duplicate state logic into a reusable custom hook with clean types',
      icebreakerQuestions: [
        'What has been your most frustrating re-render or stale closure bug in React?',
        'How do you decide between local component state and global context?'
      ],
      learningExercises: [
        'Debug an unnecessary re-render loop using React DevTools profiler',
        'Write a custom useDebounce hook with proper cleanup in useEffect',
        'Combine useReducer with Context API for predictable action dispatch'
      ],
      deliverableOutcomes: [
        'Clean, tested custom hook module with TypeScript interfaces',
        'Zero unnecessary re-renders verified via devtools'
      ]
    }
  ],
  Figma: [
    {
      topic: 'Scalable Design Systems: Auto-Layout 5.0 & Variables',
      duration: '45 mins',
      suggestedActivity: 'Hands-on Canvas Session: Co-designing an adaptive modal dialog that responds to mobile & desktop viewports',
      icebreakerQuestions: [
        'What takes you the most time when converting wireframes into high-fidelity mockups?',
        'How do you manage color schemes and spacing tokens in your Figma files?'
      ],
      learningExercises: [
        'Configure nested Auto-Layout frames with "Fill container" and "Hug contents"',
        'Create component variants with Boolean, Text, and Instance swap properties',
        'Define color & typography modes (Light / Dark theme switching)'
      ],
      deliverableOutcomes: [
        'A production-ready UI component set ready for developer handoff',
        'Design token specifications mapping directly to Tailwind CSS classes'
      ]
    }
  ],
  Docker: [
    {
      topic: 'Containerization Fundamentals & Multi-Stage Builds',
      duration: '45 mins',
      suggestedActivity: 'Terminal Screen Share: Shrinking a 1.2 GB container image down to under 80 MB with alpine multi-stage',
      icebreakerQuestions: [
        'Have you run into the "it works on my machine but breaks in production" problem?',
        'What questions do you have about container networking and port mapping?'
      ],
      learningExercises: [
        'Write a Dockerfile utilizing build stages (builder -> runner)',
        'Configure non-root user permissions for secure runtime execution',
        'Inspect image layers using docker history to eliminate cached bloat'
      ],
      deliverableOutcomes: [
        'Production Dockerfile with 90%+ image size reduction',
        'Working docker-compose.yml with health checks and restart policies'
      ]
    }
  ],
  Guitar: [
    {
      topic: 'Smooth Chord Transitions & Rhythm Fingerpicking',
      duration: '45 mins',
      suggestedActivity: 'Live Video Call Jam: 1-on-1 metronome drill moving effortlessly between G, Cadd9, Em7, and Dsus4',
      icebreakerQuestions: [
        'Which song made you pick up the guitar in the first place?',
        'Where do you feel finger fatigue or fret buzz during chord switches?'
      ],
      learningExercises: [
        'Anchor finger technique for lightning-fast chord changes',
        'Syncopated down-up strumming pattern in 4/4 time',
        'Palm muting technique for dynamic acoustic control'
      ],
      deliverableOutcomes: [
        'Mastery of 4 essential chords covering 100+ popular songs',
        'Smooth rhythm playing at 75 BPM without hesitations'
      ]
    }
  ]
};

export const DEFAULT_PEER_RATING_FACTORS: PeerRatingFactor[] = [
  { name: 'Subject Mastery & Accuracy', score: 4.9, description: 'Deep conceptual understanding, clear technical explanations, and accurate guidance.' },
  { name: 'Patience & Empathy', score: 4.95, description: 'Encouraging atmosphere, welcoming questions, and pacing to match learner needs.' },
  { name: 'Punctuality & Reliability', score: 4.85, description: 'Joined on time, maintained scheduled slot, and provided adequate notice if rescheduling.' },
  { name: 'Hands-on Activity & Interaction', score: 4.8, description: 'Engaged the learner with live practice, pair work, or code walkthroughs instead of lecturing.' },
  { name: 'Preparation & Resources', score: 4.75, description: 'Arrived prepared with relevant code links, references, exercises, or visual examples.' }
];

export const DEFAULT_IMPROVEMENT_SUGGESTIONS: ImprovementSuggestion[] = [
  {
    id: 'sug_1',
    category: 'Teaching Style',
    urgency: 'High',
    title: 'Incorporate 10 Minutes of Hands-On Practice',
    explanation: 'Learner feedback indicates sessions with interactive coding or live practice achieve 28% higher 5-star ratings compared to lecture-heavy sessions.',
    actionableStep: 'Open a shared sandbox or screen share during minute 20 and ask your peer to drive the keyboard while you guide.',
    impactPotential: '+0.2 Average Rating & Top Mentor Badge qualification'
  },
  {
    id: 'sug_2',
    category: 'Market Demand',
    urgency: 'Medium',
    title: 'Add React & Full-Stack Projects to Your Profile',
    explanation: 'There are currently 14 learners searching for React and Frontend guidance in Mumbai who are willing to exchange advanced Cloud or Design skills.',
    actionableStep: 'Add "React" to your Learn or Teach skills to unlock 4 immediate reciprocal matches.',
    impactPotential: 'Match with 4 highly active peers this week'
  },
  {
    id: 'sug_3',
    category: 'Session Punctuality',
    urgency: 'Insight',
    title: 'Share Meeting Link 15 Minutes Prior',
    explanation: 'Sending the Google Meet link 15 minutes before the scheduled time reduces no-shows and rescheduling by 35%.',
    actionableStep: 'Use the "Schedule Session" modal to automatically generate and attach meeting links in chat.',
    impactPotential: 'Zero-friction session starts'
  },
  {
    id: 'sug_4',
    category: 'Curriculum Depth',
    urgency: 'Medium',
    title: 'Define Pre-Session Goal Checkpoints',
    explanation: 'Sessions where both peers agree on 2-3 specific learning checkpoints in chat before meeting report 94% satisfaction.',
    actionableStep: 'Use the AI Advisor Session Agenda templates to set your discussion topics before calling.',
    impactPotential: 'Higher retention and follow-up exchanges'
  }
];

export const INITIAL_TIMEBANK_TRANSACTIONS: TimeBankTransaction[] = [
  {
    id: 'tx_1',
    type: 'Earned',
    amountCredits: 2.0,
    monetaryEquivalentUsd: 130,
    description: 'Taught 2.0 hrs Python Programming to Priya Patel (Session #ses_1)',
    timestamp: '2026-07-16 18:00',
    relatedSessionOrSwapId: 'ses_1',
    peerName: 'Priya Patel'
  },
  {
    id: 'tx_2',
    type: 'Spent',
    amountCredits: 1.0,
    monetaryEquivalentUsd: 65,
    description: 'Learned 1.0 hr Acoustic Guitar Basics from Priya Patel',
    timestamp: '2026-07-26 18:00',
    relatedSessionOrSwapId: 'ses_1',
    peerName: 'Priya Patel'
  },
  {
    id: 'tx_3',
    type: 'Escrow_Refund',
    amountCredits: 0,
    monetaryEquivalentUsd: 24,
    description: 'Refunded $24.00 commitment deposit after verified session completion',
    timestamp: '2026-07-26 18:05',
    relatedSessionOrSwapId: 'req_1',
    peerName: 'Platform Escrow'
  },
  {
    id: 'tx_4',
    type: 'Gratuity_Tip',
    amountCredits: 1.0,
    monetaryEquivalentUsd: 65,
    description: 'Awarded 1.0 SkillCredit peer appreciation bonus for exceptional Python teaching',
    timestamp: '2026-07-27 10:15',
    relatedSessionOrSwapId: 'req_1',
    peerName: 'Priya Patel'
  }
];

