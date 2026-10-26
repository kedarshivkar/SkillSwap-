import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  User, SwapRequest, ChatMessage, Session, Review, Certificate, 
  AppNotification, SkillItem, AISuggestionResponse, AIMatchResponse, MeetingMode,
  SessionStatus, RequestStatus, cleanUserPhoto, ProblemReport, ProblemStatus, ProblemCategory, ProblemPriority,
  TargetRoleProfile, SkillGapAnalysisResult, LearningPath, SessionAgendaTemplate, RecommendedMentor,
  ImprovementSuggestion, PeerRatingFactor, TimeBankWallet, TimeBankTransaction, AIMatchRecommendation
} from '../types';
import { 
  INITIAL_USERS, INITIAL_SWAP_REQUESTS, INITIAL_CHAT_MESSAGES, 
  INITIAL_SESSIONS, INITIAL_REVIEWS, INITIAL_CERTIFICATES, 
  INITIAL_NOTIFICATIONS, INITIAL_PROBLEM_REPORTS, TARGET_ROLES,
  DEFAULT_LEARNING_PATHS, SAMPLE_SESSION_AGENDAS, DEFAULT_PEER_RATING_FACTORS,
  DEFAULT_IMPROVEMENT_SUGGESTIONS, INITIAL_TIMEBANK_TRANSACTIONS
} from '../data/mockData';
import confetti from 'canvas-confetti';
import { db, auth } from '../backend/firebase';
import { 
  collection, onSnapshot, doc, setDoc, deleteDoc, getDoc, getDocs, writeBatch, deleteField 
} from 'firebase/firestore';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

interface MatchResult {
  score: number;
  isPerfectMatch: boolean;
  matchingTeachSkill: string;
  matchingLearnSkill: string;
  reason: string;
  factorBreakdown?: {
    skillsMatch: number;
    interestMatch: number;
    experienceMatch: number;
    availabilityMatch: number;
    trustRatingMatch: number;
  };
}

interface SkillSwapContextType {
  currentUser: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  chatMessages: ChatMessage[];
  sessions: Session[];
  reviews: Review[];
  certificates: Certificate[];
  notifications: AppNotification[];
  problemReports: ProblemReport[];
  activeView: string;
  setActiveView: (view: string) => void;
  isFirebaseConnected: boolean;
  
  // Auth
  loginWithEmailAndPassword: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerWithEmailAndPassword: (email: string, pass: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  loginAsUser: (userId: string) => void;
  logout: () => Promise<void>;
  registerUser: (userData: Partial<User>) => void;
  updateProfile: (updatedData: Partial<User>) => void;

  // Skill Management
  addSkill: (skillName: string, level: any, type: 'Teach' | 'Learn', category?: string) => void;
  removeSkill: (skillId: string) => void;

  // Matchmaking
  calculateMatch: (userA: User, userB: User) => MatchResult;
  calculateComprehensiveMatch: (userA: User, userB: User) => AIMatchRecommendation;

  // Target Roles & Skill Gap Analysis
  targetRoles: TargetRoleProfile[];
  selectedRoleId: string;
  setSelectedRoleId: (roleId: string) => void;
  skillGapAnalysis: SkillGapAnalysisResult;

  // Step-by-Step Learning Paths
  activeLearningPath: LearningPath;
  toggleMilestoneCheckpoint: (milestoneId: string, checkpointIndex: number) => void;
  toggleMilestoneCompleted: (milestoneId: string) => void;
  generateCustomLearningPath: (goalSummary: string) => void;

  // Mentors & Discussion Topics / Learning Activities
  getRecommendedMentorsForRole: (roleId?: string) => RecommendedMentor[];
  getAgendasForSkill: (skillName: string) => SessionAgendaTemplate[];

  // Progress & Improvement Suggestions
  peerRatingFactors: PeerRatingFactor[];
  improvementSuggestions: ImprovementSuggestion[];

  // Monetary & TimeBank Wallet Economy
  timeBankWallet: TimeBankWallet;
  transferSkillCreditTip: (receiverId: string, amountCredits: number, note: string) => Promise<boolean>;
  redeemSkillCreditsForSession: (sessionId: string, amountCredits: number) => Promise<boolean>;

  // Swap Requests
  sendSwapRequest: (receiverId: string, teachSkill: string, learnSkill: string, notes: string) => void;
  respondToSwapRequest: (requestId: string, status: 'Accepted' | 'Rejected') => void;
  payCommitmentDeposit: (requestId: string) => Promise<void>;
  cancelSwapRequest: (requestId: string) => Promise<void>;

  // Chat
  sendChatMessage: (swapRequestId: string, receiverId: string, text: string, attachments?: any[]) => void;

  // Problem Reporting
  reportProblem: (reportData: {
    reportedUserId?: string;
    reportedUserName?: string;
    reportedUserEmail?: string;
    swapRequestId?: string;
    teachSkill?: string;
    learnSkill?: string;
    category: ProblemCategory;
    priority?: ProblemPriority;
    description: string;
    evidenceNotes?: string;
  }) => Promise<{ success: boolean; reportId?: string; error?: string }>;

  // Scheduling & Session
  scheduleSession: (swapRequestId: string, date: string, time: string, meetingType: MeetingMode, locationOrLink: string) => void;
  confirmSessionAttendance: (sessionId: string, isTeacher: boolean) => void;

  // Review & Certificate
  submitReviewAndCompleteSession: (sessionId: string, rating: number, comment: string) => void;
  addCustomCertificate: (certData: { skillName: string; issuer?: string; issueDate?: string; certificateUrl?: string; certificateCode?: string }) => void;
  deleteCertificate: (certId: string) => void;

  // Done Learning & Refund Notice Workflow
  requestDoneLearning: (swapRequestId: string) => Promise<void>;
  confirmDoneLearning: (swapRequestId: string, accept: boolean) => Promise<void>;
  adminAcknowledgeRefundNotice: (swapRequestId: string) => Promise<void>;

  // AI Skill Advisor & Matchmaker
  fetchAISuggestions: () => Promise<AISuggestionResponse | null>;
  fetchAIMatchRecommendations: (overrideUser?: User, searchQuery?: string) => Promise<AIMatchResponse | null>;
  aiLoading: boolean;

  // Admin
  toggleUserReportedStatus: (userId: string) => void;
  verifyUserAccount: (userId: string) => void;
  toggleVerifiedMentorBadge: (userId: string) => void;
  deleteUserAccount: (userId: string) => void;
  adminUpdateSessionStatus: (sessionId: string, status: SessionStatus) => void;
  adminUpdateSessionDetails: (sessionId: string, details: Partial<Session>) => void;
  adminDeleteSession: (sessionId: string) => void;
  adminUpdateSwapRequestStatus: (requestId: string, status: RequestStatus) => void;
  adminDeleteSwapRequest: (requestId: string) => void;
  adminUpdateUser: (userId: string, updatedData: Partial<User>) => void;
  adminUpdateProblemReport: (reportId: string, status: ProblemStatus, adminNotes?: string, adminActionTaken?: string) => Promise<void>;
  adminDeleteProblemReport: (reportId: string) => Promise<void>;

  // Reset
  resetDataToDefault: () => void;
}

const SkillSwapContext = createContext<SkillSwapContextType | undefined>(undefined);

export const SkillSwapProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USERS[0]);
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>(INITIAL_SWAP_REQUESTS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [sessions, setSessions] = useState<Session[]>(INITIAL_SESSIONS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [certificates, setCertificates] = useState<Certificate[]>(INITIAL_CERTIFICATES);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [problemReports, setProblemReports] = useState<ProblemReport[]>(INITIAL_PROBLEM_REPORTS);
  const [activeView, setActiveView] = useState<string>('howItWorks');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [isFirebaseConnected] = useState<boolean>(true);
  const [targetRoles] = useState<TargetRoleProfile[]>(TARGET_ROLES);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('role_fullstack');
  const [activeLearningPath, setActiveLearningPath] = useState<LearningPath>(
    DEFAULT_LEARNING_PATHS['role_fullstack']
  );
  const [timeBankTransactions, setTimeBankTransactions] = useState<TimeBankTransaction[]>(INITIAL_TIMEBANK_TRANSACTIONS);

  // Firestore Seed Helper
  const seedCollectionIfEmpty = async <T extends { id: string }>(
    colName: string, 
    initialItems: T[]
  ) => {
    try {
      const colRef = collection(db, colName);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty) {
        const batch = writeBatch(db);
        initialItems.forEach(item => {
          const docRef = doc(db, colName, item.id);
          batch.set(docRef, item);
        });
        await batch.commit();
      }
    } catch (err) {
      console.warn(`Firestore seed error for ${colName}:`, err);
    }
  };

  // Seed initial data to Firestore
  useEffect(() => {
    const initSeed = async () => {
      await seedCollectionIfEmpty('users', INITIAL_USERS);
      await seedCollectionIfEmpty('swapRequests', INITIAL_SWAP_REQUESTS);
      await seedCollectionIfEmpty('chatMessages', INITIAL_CHAT_MESSAGES);
      await seedCollectionIfEmpty('sessions', INITIAL_SESSIONS);
      await seedCollectionIfEmpty('reviews', INITIAL_REVIEWS);
      await seedCollectionIfEmpty('certificates', INITIAL_CERTIFICATES);
      await seedCollectionIfEmpty('notifications', INITIAL_NOTIFICATIONS);
      await seedCollectionIfEmpty('problemReports', INITIAL_PROBLEM_REPORTS);
    };
    initSeed();
  }, []);

  // Realtime Firestore listeners
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'users'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => {
          const u = doc.data() as User;
          return {
            ...u,
            photo: cleanUserPhoto(u.photo)
          };
        });
        setUsers(list);
      }
    }, err => console.warn('Users listener error:', err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'swapRequests'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => doc.data() as SwapRequest);
        setSwapRequests(list);
      }
    }, err => console.warn('SwapRequests listener error:', err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'chatMessages'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => doc.data() as ChatMessage);
        setChatMessages(list);
      }
    }, err => console.warn('ChatMessages listener error:', err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'sessions'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => doc.data() as Session);
        setSessions(list);
      }
    }, err => console.warn('Sessions listener error:', err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'reviews'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => doc.data() as Review);
        setReviews(list);
      }
    }, err => console.warn('Reviews listener error:', err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'certificates'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => doc.data() as Certificate);
        setCertificates(list);
      }
    }, err => console.warn('Certificates listener error:', err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'notifications'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => doc.data() as AppNotification);
        setNotifications(list);
      }
    }, err => console.warn('Notifications listener error:', err));
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'problemReports'), snapshot => {
      if (!snapshot.empty) {
        const list = snapshot.docs.map(doc => doc.data() as ProblemReport);
        setProblemReports(list);
      }
    }, err => console.warn('ProblemReports listener error:', err));
    return () => unsub();
  }, []);

  // Firebase Auth Observer
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const uData = userSnap.data() as User;
            setCurrentUser({
              ...uData,
              photo: cleanUserPhoto(uData.photo)
            });
          } else {
            // Create initial user doc if missing
            const initialUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Member',
              email: firebaseUser.email || '',
              city: 'Mumbai',
              photo: firebaseUser.photoURL || '',
              rating: 5.0,
              totalReviews: 0,
              bio: 'Excited to exchange skills on SkillSwap!',
              languages: ['English'],
              availability: 'Flexible',
              experienceLevel: 'Intermediate',
              mode: 'Online',
              isVerified: true,
              isAdmin: false,
              teachSkills: [],
              learnSkills: [],
              createdAt: new Date().toISOString().split('T')[0]
            };
            await setDoc(userDocRef, initialUser);
            setCurrentUser(initialUser);
          }
        } catch (e) {
          console.error("Error fetching user profile from Firestore:", e);
        }
      } else {
        // Fallback to demo storage or null
        const savedUserId = localStorage.getItem('skillswap_current_user_id');
        if (savedUserId && users.length > 0) {
          const found = users.find(u => u.id === savedUserId);
          if (found) setCurrentUser(found);
        } else {
          setCurrentUser(null);
        }
      }
    });
    return () => unsub();
  }, [users]);

  // Auth Functions
  const loginWithEmailAndPassword = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();

    // Check for explicit admin credentials requested
    if (cleanEmail === 'kedarshivkar21@gmail.com' && pass === 'KTSxLEGIT') {
      try {
        const userCred = await signInWithEmailAndPassword(auth, email, pass);
        const uid = userCred.user.uid;
        const userDocRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userDocRef);
        let adminUser: User;
        if (userSnap.exists()) {
          adminUser = { ...(userSnap.data() as User), isAdmin: true, email: cleanEmail };
        } else {
          adminUser = {
            id: uid,
            name: 'Kedar Shivkar (Admin)',
            email: cleanEmail,
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
            isAdmin: true,
            teachSkills: [],
            learnSkills: [],
            createdAt: new Date().toISOString().split('T')[0]
          };
        }
        await setDoc(userDocRef, adminUser, { merge: true });
        setCurrentUser(adminUser);
        setActiveView('admin');
        return { success: true };
      } catch (err) {
        // Fallback or auto-register in Firebase / direct admin signin
        try {
          const userCred = await createUserWithEmailAndPassword(auth, email, pass);
          const uid = userCred.user.uid;
          const adminUser: User = {
            id: uid,
            name: 'Kedar Shivkar (Admin)',
            email: cleanEmail,
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
            isAdmin: true,
            teachSkills: [],
            learnSkills: [],
            createdAt: new Date().toISOString().split('T')[0]
          };
          await setDoc(doc(db, 'users', uid), adminUser);
          setCurrentUser(adminUser);
          setActiveView('admin');
          return { success: true };
        } catch (createErr) {
          // Direct admin session fallback
          const existingAdmin = users.find(u => u.email.toLowerCase() === cleanEmail) || INITIAL_USERS.find(u => u.isAdmin);
          const adminUser: User = existingAdmin ? { ...existingAdmin, isAdmin: true } : {
            id: 'usr_admin',
            name: 'Kedar Shivkar (Admin)',
            email: cleanEmail,
            city: 'Mumbai',
            photo: '',
            rating: 5.0,
            totalReviews: 50,
            bio: 'SkillSwap Platform Administrator with full access to manage bookings, user accounts, and platform operations.',
            languages: ['English', 'Hindi', 'Marathi'],
            availability: '24/7 Platform Monitoring',
            experienceLevel: 'Expert',
            mode: 'Hybrid',
            isVerified: true,
            isAdmin: true,
            teachSkills: [],
            learnSkills: [],
            createdAt: '2026-01-01'
          };
          setCurrentUser(adminUser);
          localStorage.setItem('skillswap_current_user_id', adminUser.id);
          setActiveView('admin');
          return { success: true };
        }
      }
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, pass);
      const uid = userCred.user.uid;
      const userDocRef = doc(db, 'users', uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        const uData = userSnap.data() as User;
        setCurrentUser(uData);
        localStorage.setItem('skillswap_current_user_id', uData.id);
        if (uData.isAdmin) {
          setActiveView('admin');
        } else {
          setActiveView('search');
        }
      } else {
        localStorage.setItem('skillswap_current_user_id', uid);
        setActiveView('search');
      }
      return { success: true };
    } catch (err: any) {
      console.warn("Firebase Login Notice (Checking local demo session):", err);
      
      // Graceful local development fallback: check if user matches existing local database users
      const matchedLocalUser = users.find(u => u.email.toLowerCase() === cleanEmail) || 
                               INITIAL_USERS.find(u => u.email.toLowerCase() === cleanEmail);
      if (matchedLocalUser) {
        setCurrentUser(matchedLocalUser);
        localStorage.setItem('skillswap_current_user_id', matchedLocalUser.id);
        if (matchedLocalUser.isAdmin) {
          setActiveView('admin');
        } else {
          setActiveView('search');
        }
        return { success: true };
      }

      let msg = "Login failed. Please check your credentials.";
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = "Invalid email or password.";
      } else if (err.code === 'auth/invalid-email') {
        msg = "Invalid email format.";
      } else if (err.code === 'auth/too-many-requests') {
        msg = "Too many failed attempts. Please try again later.";
      }
      return { success: false, error: msg };
    }
  };

  const registerWithEmailAndPassword = async (email: string, pass: string, userData: Partial<User>) => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, pass);
      const uid = userCred.user.uid;
      const newUser: User = {
        id: uid,
        name: userData.name || 'New Member',
        email: email,
        city: userData.city || 'Mumbai',
        photo: userData.photo || '',
        rating: 5.0,
        totalReviews: 0,
        bio: userData.bio || 'Excited to teach and learn new skills on SkillSwap!',
        languages: userData.languages || ['English'],
        availability: userData.availability || 'Flexible',
        experienceLevel: userData.experienceLevel || 'Intermediate',
        mode: 'Online',
        isVerified: true,
        isAdmin: false,
        teachSkills: userData.teachSkills || [],
        learnSkills: userData.learnSkills || [],
        createdAt: new Date().toISOString().split('T')[0]
      };

      await setDoc(doc(db, 'users', uid), newUser);
      setUsers(prev => [newUser, ...prev]);
      setCurrentUser(newUser);
      localStorage.setItem('skillswap_current_user_id', uid);
      setActiveView('search');

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
      return { success: true };
    } catch (err: any) {
      console.warn("Firebase Registration Notice (Creating local user):", err);
      
      // If error is duplicate email or weak password from valid Firebase, show error
      if (err.code === 'auth/email-already-in-use') {
        return { success: false, error: "This email address is already registered." };
      } else if (err.code === 'auth/weak-password') {
        return { success: false, error: "Password should be at least 6 characters long." };
      } else if (err.code === 'auth/invalid-email') {
        return { success: false, error: "Please enter a valid email address." };
      }

      // Local fallback registration when Firebase auth network/config is offline
      const localId = `usr_${Date.now()}`;
      const localUser: User = {
        id: localId,
        name: userData.name || 'New Member',
        email: email,
        city: userData.city || 'Mumbai',
        photo: userData.photo || '',
        rating: 5.0,
        totalReviews: 0,
        bio: userData.bio || 'Excited to teach and learn new skills on SkillSwap!',
        languages: userData.languages || ['English'],
        availability: userData.availability || 'Flexible',
        experienceLevel: userData.experienceLevel || 'Intermediate',
        mode: 'Online',
        isVerified: true,
        isAdmin: false,
        teachSkills: userData.teachSkills || [],
        learnSkills: userData.learnSkills || [],
        createdAt: new Date().toISOString().split('T')[0]
      };

      setUsers(prev => [localUser, ...prev]);
      setCurrentUser(localUser);
      localStorage.setItem('skillswap_current_user_id', localId);
      setActiveView('search');

      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
      return { success: true };
    }
  };

  const loginAsUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      localStorage.setItem('skillswap_current_user_id', userId);
      if (target.isAdmin) {
        setActiveView('admin');
      } else {
        setActiveView('search');
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn("Sign out error:", e);
    }
    setCurrentUser(null);
    localStorage.removeItem('skillswap_current_user_id');
    setActiveView('howItWorks');
  };

  const registerUser = async (userData: Partial<User>) => {
    const newId = `usr_${Date.now()}`;
    const newUser: User = {
      id: newId,
      name: userData.name || 'New Member',
      email: userData.email || 'user@example.com',
      city: userData.city || 'Mumbai',
      photo: userData.photo || '',
      rating: 5.0,
      totalReviews: 0,
      bio: userData.bio || 'Excited to teach and learn new skills on SkillSwap!',
      languages: userData.languages || ['English'],
      availability: userData.availability || 'Flexible Weekends',
      experienceLevel: userData.experienceLevel || 'Intermediate',
      mode: userData.mode || 'Online',
      isVerified: false,
      isAdmin: false,
      teachSkills: userData.teachSkills || [],
      learnSkills: userData.learnSkills || [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('skillswap_current_user_id', newId);
    setActiveView('dashboard');

    try {
      await setDoc(doc(db, 'users', newId), newUser);
    } catch (e) {
      console.error('Error adding user to Firestore:', e);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const updateProfile = async (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));

    try {
      await setDoc(doc(db, 'users', currentUser.id), updated, { merge: true });
    } catch (e) {
      console.error('Error updating user profile in Firestore:', e);
    }
  };

  const addSkill = async (skillName: string, level: any, type: 'Teach' | 'Learn', category: string = 'General') => {
    if (!currentUser) return;
    const newSkill: SkillItem = {
      id: `sk_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      skillName,
      level,
      type,
      category
    };

    const updatedUser = { ...currentUser };
    if (type === 'Teach') {
      updatedUser.teachSkills = [...updatedUser.teachSkills, newSkill];
    } else {
      updatedUser.learnSkills = [...updatedUser.learnSkills, newSkill];
    }

    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    try {
      await setDoc(doc(db, 'users', currentUser.id), updatedUser);
    } catch (e) {
      console.error('Error updating skill in Firestore:', e);
    }
  };

  const removeSkill = async (skillId: string) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      teachSkills: currentUser.teachSkills.filter(s => s.id !== skillId),
      learnSkills: currentUser.learnSkills.filter(s => s.id !== skillId)
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    try {
      await setDoc(doc(db, 'users', currentUser.id), updatedUser);
    } catch (e) {
      console.error('Error removing skill in Firestore:', e);
    }
  };

  // Matchmaking engine calculation
  // Multi-Factor Matchmaking Engine: evaluates skills offered, skills needed, interests, experience, and availability
  const calculateComprehensiveMatch = (userA: User, userB: User): AIMatchRecommendation => {
    if (userA.id === userB.id) {
      return {
        userId: userB.id,
        userName: userB.name,
        matchPercentage: 0,
        isBestChoice: false,
        badgeLabel: 'Self',
        reasonSummary: 'Same user',
        factorBreakdown: {
          skillSynergy: 'N/A',
          levelCompatibility: 'N/A',
          ratingAndTrust: 'N/A',
          availabilityAndMode: 'N/A',
          locationAndLang: 'N/A'
        }
      };
    }

    // 1. Skill Offered & Needed Synergy
    const aTeachesWhatBWants = userA.teachSkills.filter(at => 
      userB.learnSkills.some(bl => bl.skillName.toLowerCase() === at.skillName.toLowerCase())
    ).map(s => s.skillName);

    const bTeachesWhatAWants = userB.teachSkills.filter(bt => 
      userA.learnSkills.some(al => al.skillName.toLowerCase() === bt.skillName.toLowerCase())
    ).map(s => s.skillName);

    let skillScore = 45;
    if (aTeachesWhatBWants.length > 0 && bTeachesWhatAWants.length > 0) {
      skillScore = 98;
    } else if (bTeachesWhatAWants.length > 0) {
      skillScore = 86;
    } else if (aTeachesWhatBWants.length > 0) {
      skillScore = 78;
    } else {
      const catOverlap = userA.teachSkills.some(at => 
        userB.teachSkills.some(bt => bt.category && bt.category === at.category)
      );
      skillScore = catOverlap ? 62 : 48;
    }

    // 2. Shared Interests
    const bInterests = (userB.interests || []).map(i => i.toLowerCase());
    const sharedInterests = (userA.interests || []).filter(i => 
      bInterests.some(bi => bi.includes(i.toLowerCase()) || i.toLowerCase().includes(bi))
    );
    const interestScore = sharedInterests.length >= 2 ? 96 : (sharedInterests.length === 1 ? 84 : 68);

    // 3. Experience Level Alignment
    let expScore = 78;
    if (userB.experienceLevel === 'Expert') expScore = 96;
    else if (userA.experienceLevel === userB.experienceLevel) expScore = 88;

    // 4. Availability & Schedule Overlap
    const aAvail = (userA.availability || '').toLowerCase();
    const bAvail = (userB.availability || '').toLowerCase();
    let availScore = 72;
    if (
      (aAvail.includes('weekend') && bAvail.includes('weekend')) ||
      (aAvail.includes('evening') && bAvail.includes('evening'))
    ) {
      availScore = 94;
    }

    // 5. Ratings & Community Trust
    let trustScore = 78;
    if (userB.rating >= 4.9 && userB.isVerifiedMentor) trustScore = 99;
    else if (userB.rating >= 4.8) trustScore = 92;
    else if (userB.isVerified) trustScore = 86;

    const weightedScore = Math.min(99, Math.round(
      skillScore * 0.40 + 
      interestScore * 0.15 + 
      expScore * 0.15 + 
      availScore * 0.15 + 
      trustScore * 0.15
    ));

    const isBest = weightedScore >= 88;
    const badgeLabel = weightedScore >= 95 ? '⚡ 100% Reciprocal Match' : (weightedScore >= 88 ? '⭐⭐⭐⭐⭐ High Synergy' : `${weightedScore}% Compatible`);

    let reasonSummary = '';
    if (aTeachesWhatBWants.length > 0 && bTeachesWhatAWants.length > 0) {
      reasonSummary = `Direct barter match! You teach ${aTeachesWhatBWants.join(', ')} and ${userB.name} teaches ${bTeachesWhatAWants.join(', ')}.`;
    } else if (bTeachesWhatAWants.length > 0) {
      reasonSummary = `${userB.name} teaches ${bTeachesWhatAWants.join(', ')} which bridges your target role gap. You can redeem SkillCredits or trade.`;
    } else {
      reasonSummary = `High interest & domain alignment in ${sharedInterests.join(', ') || 'Technology'}. Great cross-pollination partner!`;
    }

    return {
      userId: userB.id,
      userName: userB.name,
      matchPercentage: weightedScore,
      isBestChoice: isBest,
      badgeLabel,
      reasonSummary,
      skillsOfferedMatch: aTeachesWhatBWants,
      skillsNeededMatch: bTeachesWhatAWants,
      sharedInterests,
      experienceCompatibility: `${userB.experienceLevel} Tier Mentor`,
      availabilityMatch: userB.availability,
      user: userB,
      factorBreakdown: {
        skillSynergy: `${skillScore}% • Offered: ${userB.teachSkills.map(s => s.skillName).join(', ') || 'None'}`,
        levelCompatibility: `${expScore}% • ${userB.experienceLevel} level alignment`,
        ratingAndTrust: `${trustScore}% • ${userB.rating}★ (${userB.totalReviews} reviews) ${userB.isVerifiedMentor ? '• Verified Mentor' : ''}`,
        availabilityAndMode: `${availScore}% • ${userB.availability}`,
        locationAndLang: `Based in ${userB.city} • Languages: ${userB.languages.join(', ')}`,
        swapHistory: `${userB.successfulTeachCount || userB.totalReviews || 12} successful exchanges`,
        interestAlignment: sharedInterests.length > 0 ? `Shared: ${sharedInterests.join(', ')}` : 'Tech & Skill Growth'
      }
    };
  };

  const calculateMatch = (userA: User, userB: User): MatchResult => {
    const comp = calculateComprehensiveMatch(userA, userB);
    const isPerfect = (comp.skillsOfferedMatch?.length || 0) > 0 && (comp.skillsNeededMatch?.length || 0) > 0;
    return {
      score: comp.matchPercentage,
      isPerfectMatch: isPerfect,
      matchingTeachSkill: comp.skillsOfferedMatch?.[0] || userA.teachSkills[0]?.skillName || '',
      matchingLearnSkill: comp.skillsNeededMatch?.[0] || userB.teachSkills[0]?.skillName || '',
      reason: comp.reasonSummary,
      factorBreakdown: {
        skillsMatch: parseInt(comp.factorBreakdown.skillSynergy) || 75,
        interestMatch: parseInt(comp.factorBreakdown.interestAlignment || '70') || 70,
        experienceMatch: parseInt(comp.factorBreakdown.levelCompatibility) || 75,
        availabilityMatch: parseInt(comp.factorBreakdown.availabilityAndMode) || 75,
        trustRatingMatch: parseInt(comp.factorBreakdown.ratingAndTrust) || 80
      }
    };
  };

  // Skill Gap Analysis Engine: compares abilities to selected target role
  const skillGapAnalysis = useMemo<SkillGapAnalysisResult>(() => {
    const role = targetRoles.find(r => r.id === selectedRoleId) || targetRoles[0];
    const user = currentUser || users[0];

    const masteredSkills: SkillGapAnalysisResult['masteredSkills'] = [];
    const inProgressSkills: SkillGapAnalysisResult['inProgressSkills'] = [];
    const missingSkills: SkillGapAnalysisResult['missingSkills'] = [];

    role.requiredSkills.forEach(req => {
      const taught = user.teachSkills.find(s => s.skillName.toLowerCase() === req.skillName.toLowerCase());
      const learning = user.learnSkills.find(s => s.skillName.toLowerCase() === req.skillName.toLowerCase());

      if (taught && (taught.level === 'Expert' || taught.level === req.level)) {
        masteredSkills.push({
          skillName: req.skillName,
          status: 'Mastered',
          currentLevel: taught.level,
          requiredLevel: req.level,
          importance: req.importance,
          category: req.category,
          suggestedAction: 'Skill verified through peer teaching sessions. Ready to mentor others!'
        });
      } else if (taught || learning) {
        inProgressSkills.push({
          skillName: req.skillName,
          status: 'In Progress',
          currentLevel: taught ? taught.level : (learning ? learning.level : 'Beginner'),
          requiredLevel: req.level,
          importance: req.importance,
          category: req.category,
          suggestedAction: `Currently practicing. Exchange with an Expert peer to reach ${req.level} tier.`
        });
      } else {
        missingSkills.push({
          skillName: req.skillName,
          status: 'Missing',
          requiredLevel: req.level,
          importance: req.importance,
          category: req.category,
          suggestedAction: `Critical gap for ${role.title}. Add to Learn List and schedule 1-on-1 peer exchange.`
        });
      }
    });

    const totalWeight = role.requiredSkills.length;
    const matchScore = Math.min(100, Math.round(
      ((masteredSkills.length * 1.0 + inProgressSkills.length * 0.5) / (totalWeight || 1)) * 100
    ));

    const readinessLevel = matchScore >= 75 ? 'Job Ready' : (matchScore >= 45 ? 'Ready with Guidance' : 'Beginner');
    const estimatedHoursToBridge = missingSkills.length * 16 + inProgressSkills.length * 8;
    const recommendedBootcampSaving = role.typicalBootcampCost;

    return {
      targetRole: role,
      matchScore,
      masteredSkills,
      inProgressSkills,
      missingSkills,
      readinessLevel,
      estimatedHoursToBridge,
      recommendedBootcampSaving
    };
  }, [selectedRoleId, currentUser, users, targetRoles]);

  // Sync active learning path when role changes
  useEffect(() => {
    if (DEFAULT_LEARNING_PATHS[selectedRoleId]) {
      setActiveLearningPath(DEFAULT_LEARNING_PATHS[selectedRoleId]);
    } else {
      const role = targetRoles.find(r => r.id === selectedRoleId);
      if (role) {
        setActiveLearningPath({
          id: `path_${role.id}`,
          targetRole: role.title,
          goalSummary: role.description,
          totalWeeks: 6,
          completedMilestones: 0,
          milestones: [
            {
              id: `ms_${role.id}_1`,
              weekNumber: 1,
              title: `Foundations of ${role.requiredSkills[0]?.skillName || 'Core Skills'}`,
              summary: `Master fundamental syntax, mental models, and primary workflows.`,
              keySkills: [role.requiredSkills[0]?.skillName || 'Fundamentals'],
              completed: false,
              checkpoints: [
                'Set up local environment and tools',
                'Complete 3 guided practice exercises with peer feedback',
                'Publish first working demonstration repo'
              ],
              resources: [
                { id: `res_${role.id}_1`, title: 'Official Documentation & Guides', type: 'Documentation', url: 'https://developer.mozilla.org', isFree: true, estimatedMinutes: 60 }
              ],
              project: {
                id: `proj_${role.id}_1`,
                title: `${role.title} Starter Implementation`,
                description: `Create an end-to-end prototype validating core architectural patterns.`,
                difficulty: 'Intermediate',
                deliverables: ['Working codebase', 'Setup instructions', 'Peer code review verification'],
                estimatedHours: 8
              }
            }
          ],
          createdAt: new Date().toISOString().split('T')[0]
        });
      }
    }
  }, [selectedRoleId, targetRoles]);

  // Learning Path Milestone toggles
  const toggleMilestoneCheckpoint = (milestoneId: string, checkpointIndex: number) => {
    // Keep active
  };

  const toggleMilestoneCompleted = (milestoneId: string) => {
    setActiveLearningPath(prev => {
      const updated = prev.milestones.map(m => m.id === milestoneId ? { ...m, completed: !m.completed } : m);
      const completedCount = updated.filter(m => m.completed).length;
      return { ...prev, milestones: updated, completedMilestones: completedCount };
    });
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
  };

  const generateCustomLearningPath = (goalSummary: string) => {
    const role = targetRoles.find(r => r.id === selectedRoleId) || targetRoles[0];
    const newPath: LearningPath = {
      id: `custom_${Date.now()}`,
      targetRole: goalSummary || role.title,
      goalSummary: `Tailored pathway generated for: ${goalSummary || role.description}`,
      totalWeeks: 8,
      completedMilestones: 0,
      milestones: [
        {
          id: `ms_c_1`,
          weekNumber: 1,
          title: `Diagnostic & Foundations Sprint`,
          summary: `Establish core vocabulary and build initial prototype.`,
          keySkills: [role.requiredSkills[0]?.skillName || 'Primary Skill'],
          completed: false,
          checkpoints: ['Set up development sandbox', 'Complete 1-on-1 discovery session with mentor', 'Outline portfolio project'],
          resources: [
            { id: 'res_c_1', title: 'Community Curated Guides', type: 'Documentation', url: 'https://github.com', isFree: true, estimatedMinutes: 45 }
          ],
          project: {
            id: 'proj_c_1',
            title: 'Initial Proof of Concept',
            description: 'Implement a minimal functional demonstration of core logic.',
            difficulty: 'Beginner',
            deliverables: ['Working prototype', 'Peer feedback notes'],
            estimatedHours: 5
          }
        },
        {
          id: `ms_c_2`,
          weekNumber: 3,
          title: `Applied Architecture & Pair Programming`,
          summary: `Bridge intermediate gap with real-time peer code review.`,
          keySkills: [role.requiredSkills[1]?.skillName || 'Secondary Skill'],
          completed: false,
          checkpoints: ['Conduct pair coding exchange', 'Benchmark performance and security', 'Refactor architecture'],
          resources: [
            { id: 'res_c_2', title: 'Architecture Patterns Deep Dive', type: 'Article', url: 'https://martinfowler.com', isFree: true, estimatedMinutes: 60 }
          ],
          project: {
            id: 'proj_c_2',
            title: 'Full Feature Module',
            description: 'Deliver an integrated feature with unit tests and clean interfaces.',
            difficulty: 'Intermediate',
            deliverables: ['Tested module', 'API documentation'],
            estimatedHours: 8
          }
        }
      ],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setActiveLearningPath(newPath);
    confetti({ particleCount: 75, spread: 70, origin: { y: 0.5 } });
  };

  // Monetary & TimeBank Wallet Engine
  const timeBankWallet = useMemo<TimeBankWallet>(() => {
    const credits = currentUser?.skillCredits !== undefined ? currentUser.skillCredits : 14;
    const totalTaught = currentUser?.totalHoursTaught || 14;
    const totalLearned = currentUser?.totalHoursLearned || 6;
    const cumulativeUsdSaved = (totalTaught + totalLearned) * 65;
    const bootcampCostAvoidedUsd = skillGapAnalysis.recommendedBootcampSaving || 14500;

    return {
      creditsBalance: credits,
      escrowLockedCredits: 0,
      cumulativeUsdSaved,
      bootcampCostAvoidedUsd,
      transactions: timeBankTransactions
    };
  }, [currentUser, timeBankTransactions, skillGapAnalysis]);

  const transferSkillCreditTip = async (receiverId: string, amountCredits: number, note: string): Promise<boolean> => {
    if (!currentUser) return false;
    const receiver = users.find(u => u.id === receiverId);
    if (!receiver) return false;

    const senderCredits = Math.max(0, (currentUser.skillCredits || 14) - amountCredits);
    const receiverCredits = (receiver.skillCredits || 10) + amountCredits;

    const newTx: TimeBankTransaction = {
      id: `tx_${Date.now()}`,
      type: 'Gratuity_Tip',
      amountCredits,
      monetaryEquivalentUsd: amountCredits * 65,
      description: `Sent ${amountCredits} SkillCredit tip to ${receiver.name}: "${note || 'Thanks for teaching!'}"`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      peerName: receiver.name
    };

    setTimeBankTransactions(prev => [newTx, ...prev]);

    const updatedCurrent = { ...currentUser, skillCredits: senderCredits };
    const updatedReceiver = { ...receiver, skillCredits: receiverCredits };

    setCurrentUser(updatedCurrent);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedCurrent : (u.id === receiver.id ? updatedReceiver : u)));

    const tipNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: receiver.id,
      title: 'SkillCredit Tip Received! ⭐',
      message: `${currentUser.name} awarded you a ${amountCredits} SkillCredit gratuity ($${amountCredits * 65} tutoring equivalent): "${note || 'Great session!'}"`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      type: 'certificate',
      linkTo: 'dashboard'
    };
    setNotifications(prev => [tipNotif, ...prev]);

    confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
    return true;
  };

  const redeemSkillCreditsForSession = async (sessionId: string, amountCredits: number): Promise<boolean> => {
    if (!currentUser) return false;
    const senderCredits = Math.max(0, (currentUser.skillCredits || 14) - amountCredits);

    const newTx: TimeBankTransaction = {
      id: `tx_${Date.now()}`,
      type: 'Spent',
      amountCredits,
      monetaryEquivalentUsd: amountCredits * 65,
      description: `Redeemed ${amountCredits} SkillCredit for 1-on-1 session (#${sessionId})`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      relatedSessionOrSwapId: sessionId
    };

    setTimeBankTransactions(prev => [newTx, ...prev]);
    const updatedCurrent = { ...currentUser, skillCredits: senderCredits };
    setCurrentUser(updatedCurrent);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedCurrent : u));

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
    return true;
  };

  // Mentors & Discussion Topics / Agendas
  const getRecommendedMentorsForRole = (roleId?: string): RecommendedMentor[] => {
    const role = targetRoles.find(r => r.id === (roleId || selectedRoleId)) || targetRoles[0];
    const targetSkills = role.requiredSkills.map(s => s.skillName.toLowerCase());

    const mentors: RecommendedMentor[] = [];
    const active = currentUser || users[0];

    users.filter(u => u.id !== active.id && !u.isAdmin).forEach(user => {
      const matchedSkills = user.teachSkills
        .filter(t => targetSkills.includes(t.skillName.toLowerCase()))
        .map(t => t.skillName);

      if (matchedSkills.length > 0) {
        const agendas: SessionAgendaTemplate[] = [];
        matchedSkills.forEach(sk => {
          if (SAMPLE_SESSION_AGENDAS[sk]) {
            agendas.push(...SAMPLE_SESSION_AGENDAS[sk]);
          }
        });

        if (agendas.length === 0) {
          agendas.push({
            topic: `Core Foundations in ${matchedSkills.join(' & ')}`,
            duration: '45 mins',
            suggestedActivity: `Pair Work: Hands-on walkthrough of essential workflows and live Q&A in ${matchedSkills[0]}`,
            icebreakerQuestions: [
              `What is your current objective when working with ${matchedSkills[0]}?`,
              `Which concepts feel most challenging right now?`
            ],
            learningExercises: [
              `Interactive whiteboard breakdown of real-world use cases`,
              `Step-by-step code or design demo with immediate feedback`
            ],
            deliverableOutcomes: [
              `Clear roadmap for mastering ${matchedSkills[0]}`,
              `Curated list of practice exercises`
            ]
          });
        }

        const matchScore = Math.min(99, 70 + matchedSkills.length * 12 + (user.rating >= 4.9 ? 10 : 5));

        mentors.push({
          user,
          matchScore,
          matchedGapSkills: matchedSkills,
          synergyReason: `${user.name} has taught ${user.successfulTeachCount || 15}+ sessions in ${matchedSkills.join(', ')} with a ${user.rating}★ rating.`,
          suggestedAgendas: agendas
        });
      }
    });

    return mentors.sort((a, b) => b.matchScore - a.matchScore);
  };

  const getAgendasForSkill = (skillName: string): SessionAgendaTemplate[] => {
    return SAMPLE_SESSION_AGENDAS[skillName] || [
      {
        topic: `1-on-1 Practice & Mentorship in ${skillName}`,
        duration: '45 mins',
        suggestedActivity: `Live Practice & Pair Problem Solving in ${skillName}`,
        icebreakerQuestions: [
          `What sparked your interest in learning ${skillName}?`,
          `What practical project would you love to build with it?`
        ],
        learningExercises: [
          `Hands-on drill: Build 1 feature live together`,
          `Troubleshooting & best practice review`
        ],
        deliverableOutcomes: [
          `Working milestone artifact`,
          `Feedback & next step checklist`
        ]
      }
    ];
  };

  const peerRatingFactors = DEFAULT_PEER_RATING_FACTORS;
  const improvementSuggestions = DEFAULT_IMPROVEMENT_SUGGESTIONS;


  const sendSwapRequest = async (receiverId: string, teachSkill: string, learnSkill: string, notes: string) => {
    if (!currentUser) return;

    const newRequest: SwapRequest = {
      id: `req_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      teachSkill,
      learnSkill,
      status: 'Pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      notes,
      isFirstFreeSwap: false,
      isContactUnlocked: false,
      depositAmount: 31,
      refundAmount: 24,
      platformFee: 7,
    };

    setSwapRequests(prev => [newRequest, ...prev]);

    const newNotif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: receiverId,
      title: 'New Skill Swap Request! 🤝',
      message: `${currentUser.name} wants to exchange ${teachSkill} for your ${learnSkill} skills.`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      type: 'request',
      linkTo: 'dashboard'
    };

    setNotifications(prev => [newNotif, ...prev]);

    try {
      await setDoc(doc(db, 'swapRequests', newRequest.id), newRequest);
      await setDoc(doc(db, 'notifications', newNotif.id), newNotif);
    } catch (e) {
      console.error('Error writing swap request to Firestore:', e);
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const respondToSwapRequest = async (requestId: string, status: 'Accepted' | 'Rejected') => {
    if (!currentUser) return;

    const req = swapRequests.find(r => r.id === requestId);
    if (!req) return;

    const updatedReq: SwapRequest = { 
      ...req, 
      status,
      isFirstFreeSwap: false,
      isContactUnlocked: req.isContactUnlocked || false
    };
    setSwapRequests(prev => prev.map(r => r.id === requestId ? updatedReq : r));

    try {
      await setDoc(doc(db, 'swapRequests', requestId), updatedReq);
    } catch (e) {
      console.error('Error updating swap request in Firestore:', e);
    }

    if (status === 'Accepted') {
      const acceptMsgText = `Hello! I accepted your request to swap ${req.learnSkill} for ${req.teachSkill}. 💳 Please pay the ₹31 commitment deposit to unlock direct contact details. You will receive a ₹24 refund after completing the course session!`;

      const sysMsg: ChatMessage = {
        id: `msg_${Date.now()}`,
        swapRequestId: requestId,
        senderId: currentUser.id,
        receiverId: req.senderId,
        message: acceptMsgText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false
      };
      setChatMessages(prev => [...prev, sysMsg]);
      try {
        await setDoc(doc(db, 'chatMessages', sysMsg.id), sysMsg);
      } catch (e) {
        console.error('Error writing chat message to Firestore:', e);
      }

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });
    }

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: req.senderId,
      title: status === 'Accepted' ? 'Request Accepted! 🎉' : 'Request Status Updated',
      message: `${currentUser.name} ${status.toLowerCase()} your skill swap request.`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      type: 'accepted',
      linkTo: status === 'Accepted' ? 'messages' : 'dashboard'
    };
    setNotifications(prev => [notif, ...prev]);
    try {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (e) {
      console.error('Error writing notification to Firestore:', e);
    }
  };

  const payCommitmentDeposit = async (requestId: string) => {
    if (!currentUser) return;
    const req = swapRequests.find(r => r.id === requestId);
    if (!req) return;

    const isSender = req.senderId === currentUser.id;
    const senderPaid = isSender ? true : !!req.senderPaidDeposit;
    const receiverPaid = !isSender ? true : !!req.receiverPaidDeposit;
    const bothPaid = senderPaid && receiverPaid;

    const updatedReq: SwapRequest = {
      ...req,
      senderPaidDeposit: senderPaid,
      receiverPaidDeposit: receiverPaid,
      isContactUnlocked: bothPaid,
      depositAmount: 31,
      refundAmount: 24,
      platformFee: 7,
    };

    setSwapRequests(prev => prev.map(r => r.id === requestId ? updatedReq : r));

    try {
      await setDoc(doc(db, 'swapRequests', requestId), updatedReq, { merge: true });
    } catch (e) {
      console.error('Error updating deposit status in Firestore:', e);
    }

    const otherId = isSender ? req.receiverId : req.senderId;
    const sysText = bothPaid 
      ? `💳 BOTH USERS PAID ₹31 COMMITMENT DEPOSIT! 🎉 Contact details (Phone & Email) are now unlocked! You will receive a ₹24 refund upon session completion (Net platform fee: ₹7).`
      : `💳 ${currentUser.name} paid ₹31 commitment deposit. Awaiting partner deposit to unlock contact details.`;

    sendChatMessage(requestId, otherId, sysText);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const cancelSwapRequest = async (requestId: string) => {
    if (!currentUser) return;
    const req = swapRequests.find(r => r.id === requestId);
    if (!req) return;

    const updatedReq: SwapRequest = {
      ...req,
      status: 'Cancelled'
    };

    setSwapRequests(prev => prev.map(r => r.id === requestId ? updatedReq : r));

    try {
      await setDoc(doc(db, 'swapRequests', requestId), updatedReq, { merge: true });
    } catch (e) {
      console.error('Error cancelling swap request in Firestore:', e);
    }

    const otherId = req.senderId === currentUser.id ? req.receiverId : req.senderId;
    sendChatMessage(requestId, otherId, `❌ ${currentUser.name} cancelled the swap request. No payment or cancellation fee was charged.`);
  };

  const sendChatMessage = async (swapRequestId: string, receiverId: string, text: string, attachments?: any[]) => {
    if (!currentUser) return;

    const newMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      swapRequestId,
      senderId: currentUser.id,
      receiverId,
      message: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachments,
      isRead: false
    };

    setChatMessages(prev => [...prev, newMsg]);
    try {
      await setDoc(doc(db, 'chatMessages', newMsg.id), newMsg);
    } catch (e) {
      console.error('Error writing message to Firestore:', e);
    }
  };

  const reportProblem = async (reportData: {
    reportedUserId?: string;
    reportedUserName?: string;
    reportedUserEmail?: string;
    swapRequestId?: string;
    teachSkill?: string;
    learnSkill?: string;
    category: ProblemCategory;
    priority?: ProblemPriority;
    description: string;
    evidenceNotes?: string;
  }): Promise<{ success: boolean; reportId?: string; error?: string }> => {
    if (!currentUser) return { success: false, error: 'User must be signed in to report a problem.' };
    if (!reportData.description?.trim()) return { success: false, error: 'Please describe the problem.' };

    const newReport: ProblemReport = {
      id: `rep_${Date.now()}`,
      reporterId: currentUser.id,
      reporterName: currentUser.name,
      reporterEmail: currentUser.email,
      reportedUserId: reportData.reportedUserId,
      reportedUserName: reportData.reportedUserName,
      reportedUserEmail: reportData.reportedUserEmail,
      swapRequestId: reportData.swapRequestId,
      teachSkill: reportData.teachSkill,
      learnSkill: reportData.learnSkill,
      category: reportData.category,
      priority: reportData.priority || 'Normal',
      description: reportData.description.trim(),
      evidenceNotes: reportData.evidenceNotes?.trim() || '',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Pending'
    };

    setProblemReports(prev => [newReport, ...prev]);

    try {
      await setDoc(doc(db, 'problemReports', newReport.id), newReport);
    } catch (e) {
      console.error('Error saving problem report in Firestore:', e);
    }

    return { success: true, reportId: newReport.id };
  };

  const scheduleSession = async (swapRequestId: string, date: string, time: string, meetingType: MeetingMode, locationOrLink: string) => {
    if (!currentUser) return;
    const req = swapRequests.find(r => r.id === swapRequestId);
    if (!req) return;

    const otherUserId = req.senderId === currentUser.id ? req.receiverId : req.senderId;

    const newSession: Session = {
      id: `ses_${Date.now()}`,
      swapRequestId,
      teacherId: currentUser.id,
      learnerId: otherUserId,
      skillName: `${req.teachSkill} Exchange Session`,
      date,
      time,
      meetingType,
      locationOrLink,
      status: 'Scheduled',
      teacherConfirmed: false,
      studentConfirmed: false,
      qrCodeData: `SKILLSWAP-SESSION-${currentUser.id}-${otherUserId}-${Date.now()}`
    };

    setSessions(prev => [newSession, ...prev]);

    const updatedReq: SwapRequest = {
      ...req,
      scheduledTime: `${date} ${time}`,
      meetingLocation: locationOrLink,
      meetingType,
      zoomLink: locationOrLink
    };

    setSwapRequests(prev => prev.map(r => r.id === swapRequestId ? updatedReq : r));

    try {
      await setDoc(doc(db, 'sessions', newSession.id), newSession);
      await setDoc(doc(db, 'swapRequests', swapRequestId), updatedReq);
    } catch (e) {
      console.error('Error writing session schedule to Firestore:', e);
    }

    sendChatMessage(
      swapRequestId, 
      otherUserId, 
      `📅 Scheduled session for ${req.teachSkill} on ${date} at ${time}. Link/Location: ${locationOrLink}`
    );

    const notif: AppNotification = {
      id: `notif_${Date.now()}`,
      userId: otherUserId,
      title: 'New Session Scheduled 📅',
      message: `${currentUser.name} scheduled a swap session for ${date} at ${time}.`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      type: 'reminder',
      linkTo: 'schedule'
    };
    setNotifications(prev => [notif, ...prev]);
    try {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (e) {
      console.error('Error writing notification to Firestore:', e);
    }

    confetti({ particleCount: 50, spread: 50 });
  };

  const confirmSessionAttendance = async (sessionId: string, isTeacher: boolean) => {
    const targetSession = sessions.find(s => s.id === sessionId);
    if (!targetSession) return;

    const updated: Session = {
      ...targetSession,
      teacherConfirmed: isTeacher ? true : targetSession.teacherConfirmed,
      studentConfirmed: !isTeacher ? true : targetSession.studentConfirmed,
    };
    if (updated.teacherConfirmed && updated.studentConfirmed) {
      updated.status = 'Completed';
    }

    setSessions(prev => prev.map(s => s.id === sessionId ? updated : s));

    try {
      await setDoc(doc(db, 'sessions', sessionId), updated);
    } catch (e) {
      console.error('Error updating session attendance in Firestore:', e);
    }
  };

  const submitReviewAndCompleteSession = async (sessionId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const ses = sessions.find(s => s.id === sessionId);
    if (!ses) return;

    const receiverId = ses.teacherId === currentUser.id ? ses.learnerId : ses.teacherId;
    const receiverUser = users.find(u => u.id === receiverId);

    const newReview: Review = {
      id: `rev_${Date.now()}`,
      reviewerId: currentUser.id,
      receiverId,
      rating,
      comment,
      skillName: ses.skillName,
      date: new Date().toISOString().split('T')[0]
    };
    setReviews(prev => [newReview, ...prev]);

    if (receiverUser) {
      const userReviews = [...reviews.filter(r => r.receiverId === receiverId), newReview];
      const avg = userReviews.reduce((sum, r) => sum + r.rating, 0) / userReviews.length;
      const updatedUser = {
        ...receiverUser,
        rating: Number(avg.toFixed(1)),
        totalReviews: userReviews.length
      };
      setUsers(prev => prev.map(u => u.id === receiverId ? updatedUser : u));
      try {
        await setDoc(doc(db, 'users', receiverId), updatedUser);
      } catch (e) {
        console.error('Error updating receiver rating in Firestore:', e);
      }
    }

    const updatedSession: Session = { ...ses, status: 'Completed' };
    setSessions(prev => prev.map(s => s.id === sessionId ? updatedSession : s));

    const teacherUser = users.find(u => u.id === ses.teacherId);

    if (teacherUser) {
      const completedTeacherSessions = sessions.filter(s => s.teacherId === teacherUser.id && (s.status === 'Completed' || s.id === sessionId)).length;
      const totalTaughtCount = Math.max(completedTeacherSessions, (teacherUser.successfulTeachCount || 0) + 1);

      const updatedTeacher = {
        ...teacherUser,
        successfulTeachCount: totalTaughtCount
      };

      setUsers(prev => prev.map(u => u.id === teacherUser.id ? updatedTeacher : u));
      if (currentUser && currentUser.id === teacherUser.id) {
        setCurrentUser(prev => prev ? { ...prev, ...updatedTeacher } : null);
      }

      try {
        await setDoc(doc(db, 'users', teacherUser.id), updatedTeacher, { merge: true });
      } catch (e) {
        console.error('Error updating teacher count:', e);
      }
    }

    const certCode = `SKILLSWAP-CERT-${Date.now().toString().slice(-6)}`;
    const newCert: Certificate = {
      id: `cert_${Date.now()}`,
      userId: ses.learnerId,
      userName: users.find(u => u.id === ses.learnerId)?.name || 'Learner',
      teacherName: teacherUser?.name || 'Mentor',
      skillName: ses.skillName,
      issueDate: new Date().toISOString().split('T')[0],
      certificateCode: certCode,
      qrCodeData: `https://skillswap.org/verify/${certCode}`
    };
    setCertificates(prev => [newCert, ...prev]);

    // Refund handling upon completing course/session:
    const req = swapRequests.find(r => r.id === ses.swapRequestId);
    if (req && (req.depositAmount === 31 || req.senderPaidDeposit || req.receiverPaidDeposit) && !req.isRefundProcessed) {
      const updatedReq: SwapRequest = {
        ...req,
        isRefundProcessed: true
      };
      setSwapRequests(prev => prev.map(r => r.id === req.id ? updatedReq : r));
      try {
        await setDoc(doc(db, 'swapRequests', req.id), updatedReq, { merge: true });
      } catch (e) {
        console.error('Error marking refund processed in Firestore:', e);
      }

      // Credit ₹24 refund to wallet for both users
      setUsers(prev => prev.map(u => {
        if (u.id === req.senderId || u.id === req.receiverId) {
          const newBal = (u.walletBalance || 0) + 24;
          const updatedU = { ...u, walletBalance: newBal };
          setDoc(doc(db, 'users', u.id), { walletBalance: newBal }, { merge: true }).catch(() => {});
          return updatedU;
        }
        return u;
      }));

      sendChatMessage(
        req.id,
        receiverId,
        `🎓 COURSE LEARNED & SESSION COMPLETED! 🎉 Verified skill completion certificate issued. Thank you for learning together!`
      );
    }

    try {
      await setDoc(doc(db, 'reviews', newReview.id), newReview);
      await setDoc(doc(db, 'sessions', sessionId), updatedSession);
      await setDoc(doc(db, 'certificates', newCert.id), newCert);
    } catch (e) {
      console.error('Error submitting review to Firestore:', e);
    }

    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.4 }
    });
  };

  const addCustomCertificate = async (certData: {
    skillName: string;
    issuer?: string;
    issueDate?: string;
    certificateUrl?: string;
    certificateCode?: string;
  }) => {
    if (!currentUser) return;
    const certCode = certData.certificateCode || `SKILLSWAP-CERT-${Date.now().toString().slice(-6)}`;
    const newCert: Certificate = {
      id: `cert_custom_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      teacherName: certData.issuer || 'Certified Institute',
      skillName: certData.skillName,
      issueDate: certData.issueDate || new Date().toISOString().split('T')[0],
      certificateCode: certCode,
      qrCodeData: `https://skillswap.org/verify/${certCode}`,
      certificateUrl: certData.certificateUrl,
      issuer: certData.issuer || 'External Certification'
    };

    setCertificates(prev => [newCert, ...prev]);

    try {
      await setDoc(doc(db, 'certificates', newCert.id), newCert);
    } catch (e) {
      console.error('Error adding custom certificate to Firestore:', e);
    }

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.5 }
    });
  };

  const deleteCertificate = async (certId: string) => {
    setCertificates(prev => prev.filter(c => c.id !== certId));
    try {
      await deleteDoc(doc(db, 'certificates', certId));
    } catch (e) {
      console.error('Error deleting certificate from Firestore:', e);
    }
  };

  const requestDoneLearning = async (swapRequestId: string) => {
    if (!currentUser) return;
    const req = swapRequests.find(r => r.id === swapRequestId);
    if (!req) return;

    const isSender = req.senderId === currentUser.id;
    const partnerId = isSender ? req.receiverId : req.senderId;
    const learnedSkill = isSender ? req.learnSkill : req.teachSkill;

    const updatedReq: SwapRequest = {
      ...req,
      completionRequestedBy: currentUser.id,
      completionRequestedAt: new Date().toISOString()
    };

    setSwapRequests(prev => prev.map(r => r.id === swapRequestId ? updatedReq : r));

    try {
      await setDoc(doc(db, 'swapRequests', swapRequestId), updatedReq, { merge: true });
    } catch (e) {
      console.error('Error setting completion request in Firestore:', e);
    }

    sendChatMessage(
      swapRequestId,
      partnerId,
      `🎓 DONE LEARNING REQUEST: I finished learning ${learnedSkill}! I clicked "Done Learning". Please confirm if you taught me the whole skill so our swap can be marked Completed and deposit refund processed.`
    );

    const notif: AppNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2,5)}`,
      userId: partnerId,
      title: 'Done Learning Confirmation Needed 🎓',
      message: `${currentUser.name} marked "Done Learning" for ${learnedSkill}. Please accept to confirm you taught the whole skill!`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false,
      type: 'completion',
      linkTo: 'chat'
    };
    setNotifications(prev => [notif, ...prev]);
    try {
      await setDoc(doc(db, 'notifications', notif.id), notif);
    } catch (e) {
      console.error('Error sending notification to Firestore:', e);
    }

    confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
  };

  const confirmDoneLearning = async (swapRequestId: string, accept: boolean) => {
    if (!currentUser) return;
    const req = swapRequests.find(r => r.id === swapRequestId);
    if (!req) return;

    const isSender = req.senderId === currentUser.id;
    const partnerId = isSender ? req.receiverId : req.senderId;
    const learnerId = req.completionRequestedBy || partnerId;
    const learnerUser = users.find(u => u.id === learnerId);
    const learnerName = learnerUser ? learnerUser.name : 'Learner';

    if (accept) {
      const updatedReq: SwapRequest = {
        ...req,
        status: 'Completed',
        completionConfirmedByTeacher: true,
        isRefundProcessed: true,
        refundNoticeSentToAdmin: true,
        adminRefundNoticeStatus: 'Pending',
        adminRefundNoticeDate: new Date().toISOString()
      };

      setSwapRequests(prev => prev.map(r => r.id === swapRequestId ? updatedReq : r));

      try {
        await setDoc(doc(db, 'swapRequests', swapRequestId), updatedReq, { merge: true });
      } catch (e) {
        console.error('Error updating swap request completion in Firestore:', e);
      }

      // Mark associated sessions as Completed
      const matchSessions = sessions.filter(s => s.swapRequestId === swapRequestId);
      for (const ses of matchSessions) {
        const updatedSes: Session = { ...ses, status: 'Completed', teacherConfirmed: true, studentConfirmed: true };
        setSessions(prev => prev.map(s => s.id === ses.id ? updatedSes : s));
        setDoc(doc(db, 'sessions', ses.id), updatedSes, { merge: true }).catch(() => {});
      }

      // Credit ₹24 deposit refund to both users' wallet balances
      setUsers(prev => prev.map(u => {
        if (u.id === req.senderId || u.id === req.receiverId) {
          const newBal = (u.walletBalance || 0) + 24;
          const updatedU = { ...u, walletBalance: newBal };
          setDoc(doc(db, 'users', u.id), { walletBalance: newBal }, { merge: true }).catch(() => {});
          return updatedU;
        }
        return u;
      }));

      // Issue certificate to learner
      const taughtSkillName = isSender ? req.teachSkill : req.learnSkill;
      const certCode = `SKILLSWAP-CERT-${Date.now().toString().slice(-6)}`;
      const newCert: Certificate = {
        id: `cert_${Date.now()}`,
        userId: learnerId,
        userName: learnerName,
        teacherName: currentUser.name,
        skillName: taughtSkillName,
        issueDate: new Date().toISOString().split('T')[0],
        certificateCode: certCode,
        qrCodeData: `https://skillswap.org/verify/${certCode}`
      };
      setCertificates(prev => [newCert, ...prev]);
      setDoc(doc(db, 'certificates', newCert.id), newCert).catch(() => {});

      // Chat announcement
      sendChatMessage(
        swapRequestId,
        partnerId,
        `🎉 SKILL SWAP COMPLETED & CONFIRMED! ${currentUser.name} accepted the request and confirmed that the whole skill was taught! Deposit refund of ₹24 has been credited to your wallet & notice sent to the Admin Portal.`
      );

      // Notification to learner
      const learnerNotif: AppNotification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substring(2,5)}`,
        userId: learnerId,
        title: 'Skill Swap Completed! 🎓🎉',
        message: `${currentUser.name} confirmed they taught you the whole skill! Your swap is marked Completed and ₹24 deposit refund processed.`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false,
        type: 'completion',
        linkTo: 'chat'
      };
      setNotifications(prev => [learnerNotif, ...prev]);
      setDoc(doc(db, 'notifications', learnerNotif.id), learnerNotif).catch(() => {});

      // Admin portal notice
      const adminNotif: AppNotification = {
        id: `notif_admin_${Date.now()}_${Math.random().toString(36).substring(2,5)}`,
        userId: 'usr_admin',
        title: 'Deposit Refund & Completion Notice 💰',
        message: `Skill Swap #${swapRequestId} completed. ${currentUser.name} (Teacher) confirmed teaching ${learnerName} (Learner). Deposit refund ₹24 credited. Platform fee retained: ₹7.`,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false,
        type: 'admin',
        linkTo: 'admin'
      };
      setNotifications(prev => [adminNotif, ...prev]);
      setDoc(doc(db, 'notifications', adminNotif.id), adminNotif).catch(() => {});

      confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 } });
    } else {
      const updatedReq: SwapRequest = {
        ...req,
        completionRequestedBy: undefined,
        completionRequestedAt: undefined
      };

      setSwapRequests(prev => prev.map(r => r.id === swapRequestId ? updatedReq : r));

      try {
        await setDoc(doc(db, 'swapRequests', swapRequestId), {
          completionRequestedBy: deleteField(),
          completionRequestedAt: deleteField()
        }, { merge: true });
      } catch (e) {
        console.error('Error clearing completion request in Firestore:', e);
      }

      sendChatMessage(
        swapRequestId,
        partnerId,
        `ℹ️ ${currentUser.name} indicated that a few more learning sessions are needed before marking the skill swap as completely learned.`
      );
    }
  };

  const adminAcknowledgeRefundNotice = async (swapRequestId: string) => {
    const req = swapRequests.find(r => r.id === swapRequestId);
    if (!req) return;

    const updatedReq: SwapRequest = {
      ...req,
      adminRefundNoticeStatus: 'Acknowledged'
    };

    setSwapRequests(prev => prev.map(r => r.id === swapRequestId ? updatedReq : r));

    try {
      await setDoc(doc(db, 'swapRequests', swapRequestId), { adminRefundNoticeStatus: 'Acknowledged' }, { merge: true });
    } catch (e) {
      console.error('Error acknowledging refund notice in Firestore:', e);
    }
  };

  const fetchAISuggestions = async (): Promise<AISuggestionResponse | null> => {
    if (!currentUser) return null;
    setAiLoading(true);
    try {
      const res = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teachSkills: currentUser.teachSkills.map(s => s.skillName),
          learnSkills: currentUser.learnSkills.map(s => s.skillName),
          bio: currentUser.bio,
          targetGoal: 'Enhance my skill set and exchange capabilities'
        })
      });
      const json = await res.json();
      setAiLoading(false);
      return json.data || json;
    } catch (err) {
      console.error('Error fetching AI suggestions:', err);
      setAiLoading(false);
      return {
        recommendedSkills: [
          { skill: "Data Analytics", reason: "Complements technical & business workflows.", difficulty: "Intermediate" },
          { skill: "UI/UX Design", reason: "Great pairing for web development and product design.", difficulty: "Beginner" },
          { skill: "Public Speaking", reason: "Boosts teaching effectiveness and presentation confidence.", difficulty: "Beginner" }
        ],
        exchangeProjectIdeas: [
          "Create an interactive portfolio project with your swap partner",
          "Conduct a live 1-on-1 workshop session"
        ],
        advisorNote: "Continuous skill swapping accelerates career growth without financial barriers!"
      };
    }
  };

  const computeClientFallback = (currentUser: User, candidates: User[], searchQuery?: string): AIMatchResponse => {
    const q = searchQuery?.toLowerCase().trim();
    const scored = candidates.map(cand => {
      let score = 50;
      let matchedTeach = false;
      let matchedLearn = false;

      if (q) {
        matchedTeach = cand.teachSkills.some(t => t.skillName.toLowerCase().includes(q));
        matchedLearn = cand.learnSkills.some(l => l.skillName.toLowerCase().includes(q));
        if (matchedTeach && matchedLearn) score += 45;
        else if (matchedTeach) score += 40;
        else if (matchedLearn) score += 25;
      }

      const cTeachA = cand.teachSkills.some(t =>
        currentUser.learnSkills.some(l => l.skillName.toLowerCase() === t.skillName.toLowerCase())
      );
      const aTeachC = currentUser.teachSkills.some(t =>
        cand.learnSkills.some(l => l.skillName.toLowerCase() === t.skillName.toLowerCase())
      );

      if (cTeachA && aTeachC) score += 35;
      else if (cTeachA || aTeachC) score += 20;

      if (cand.rating >= 4.8) score += 8;
      else if (cand.rating >= 4.5) score += 5;

      const matchPercentage = Math.min(98, Math.max(65, Math.round(score)));
      const teachNames = cand.teachSkills.map(s => s.skillName).join(', ') || 'Skills';
      const learnNames = cand.learnSkills.map(s => s.skillName).join(', ') || 'Skills';

      let reasonSummary = `${cand.name} can teach ${teachNames} and is looking to learn ${learnNames}. Balanced skill level and compatible ${cand.mode || 'Online'} mode.`;
      if (q && matchedTeach) {
        reasonSummary = `Direct match for "${searchQuery}": ${cand.name} teaches ${teachNames} with a ${cand.rating}★ rating.`;
      } else if (q && matchedLearn) {
        reasonSummary = `Skill reciprocity match: ${cand.name} is looking to learn "${searchQuery}" and offers ${teachNames} in exchange.`;
      }

      return {
        userId: cand.id,
        userName: cand.name,
        matchPercentage,
        isBestChoice: false,
        badgeLabel: `${matchPercentage}% Match`,
        reasonSummary,
        factorBreakdown: {
          skillSynergy: matchedTeach ? `Directly teaches "${searchQuery}" (${teachNames})` : `Teaches: ${teachNames} | Wants: ${learnNames}`,
          levelCompatibility: `Matches ${cand.experienceLevel || 'Intermediate'} skill exchange level`,
          ratingAndTrust: `${cand.rating || 5.0} ★ (${cand.totalReviews || 12} community reviews) • Verified`,
          availabilityAndMode: `${cand.availability || 'Flexible'} schedule in ${cand.mode || 'Online'} mode`,
          locationAndLang: `Based in ${cand.city || 'Mumbai'} • Languages: ${(cand.languages || ['English']).join(', ')}`,
          swapHistory: `${cand.successfulTeachCount || cand.totalReviews || 10} verified swap sessions completed`
        }
      };
    });

    scored.sort((a, b) => b.matchPercentage - a.matchPercentage);
    const top3 = scored.slice(0, 3);
    if (top3.length > 0) {
      top3[0].isBestChoice = true;
      top3[0].badgeLabel = "⭐⭐⭐⭐⭐ Best Choice";
    }

    return {
      analysisSummary: searchQuery 
        ? `AI evaluated top candidates specifically matching the skill query "${searchQuery}" across 5 key factors: skill synergy, level balance, ratings, schedule, and location.`
        : "AI evaluated top candidate recommendations using 5 key factors: skill synergy, level balance, ratings & trust, schedule availability, and location & languages.",
      recommendations: top3
    };
  };

  const fetchAIMatchRecommendations = async (overrideUser?: User, searchQuery?: string): Promise<AIMatchResponse | null> => {
    const targetUser = overrideUser || currentUser;
    if (!targetUser) return null;
    setAiLoading(true);
    const candidates = users.filter(u => u.id !== targetUser.id && !u.isAdmin);
    try {
      const res = await fetch('/api/ai-match-recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentUser: targetUser,
          candidates,
          searchQuery
        })
      });
      const json = await res.json();
      setAiLoading(false);
      const data = json.data || json;
      if (data?.recommendations && Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        return data;
      }
      return computeClientFallback(targetUser, candidates, searchQuery);
    } catch (err) {
      console.error('Error fetching AI match recommendations:', err);
      setAiLoading(false);
      return computeClientFallback(targetUser, candidates, searchQuery);
    }
  };

  const toggleUserReportedStatus = async (userId: string) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    const updated = { ...u, isReportedFake: !u.isReportedFake };
    setUsers(prev => prev.map(x => x.id === userId ? updated : x));
    try {
      await setDoc(doc(db, 'users', userId), updated);
    } catch (e) {
      console.error('Error updating reported status in Firestore:', e);
    }
  };

  const verifyUserAccount = async (userId: string) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    const updated = { ...u, isVerified: true };
    setUsers(prev => prev.map(x => x.id === userId ? updated : x));
    try {
      await setDoc(doc(db, 'users', userId), updated);
    } catch (e) {
      console.error('Error verifying user in Firestore:', e);
    }
  };

  const toggleVerifiedMentorBadge = async (userId: string) => {
    const u = users.find(x => x.id === userId);
    if (!u) return;
    const updated = { ...u, isVerifiedMentor: !u.isVerifiedMentor };
    setUsers(prev => prev.map(x => x.id === userId ? updated : x));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, isVerifiedMentor: updated.isVerifiedMentor } : null);
    }
    try {
      await setDoc(doc(db, 'users', userId), updated, { merge: true });
    } catch (e) {
      console.error('Error toggling mentor badge in Firestore:', e);
    }
  };

  const deleteUserAccount = async (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    try {
      await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
      console.error('Error deleting user from Firestore:', e);
    }
  };

  const adminUpdateSessionStatus = async (sessionId: string, status: SessionStatus) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, status } : s));
    try {
      const docRef = doc(db, 'sessions', sessionId);
      await setDoc(docRef, { status }, { merge: true });
    } catch (e) {
      console.error('Error updating session status as admin:', e);
    }
  };

  const adminUpdateSessionDetails = async (sessionId: string, details: Partial<Session>) => {
    setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, ...details } : s));
    try {
      const docRef = doc(db, 'sessions', sessionId);
      await setDoc(docRef, details, { merge: true });
    } catch (e) {
      console.error('Error updating session details as admin:', e);
    }
  };

  const adminDeleteSession = async (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    try {
      await deleteDoc(doc(db, 'sessions', sessionId));
    } catch (e) {
      console.error('Error deleting session as admin:', e);
    }
  };

  const adminUpdateSwapRequestStatus = async (requestId: string, status: RequestStatus) => {
    setSwapRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
    try {
      const docRef = doc(db, 'swapRequests', requestId);
      await setDoc(docRef, { status }, { merge: true });
    } catch (e) {
      console.error('Error updating swap request as admin:', e);
    }
  };

  const adminDeleteSwapRequest = async (requestId: string) => {
    setSwapRequests(prev => prev.filter(r => r.id !== requestId));
    try {
      await deleteDoc(doc(db, 'swapRequests', requestId));
    } catch (e) {
      console.error('Error deleting swap request as admin:', e);
    }
  };

  const adminUpdateUser = async (userId: string, updatedData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updatedData } : null);
    }
    try {
      await setDoc(doc(db, 'users', userId), updatedData, { merge: true });
    } catch (e) {
      console.error('Error updating user data as admin:', e);
    }
  };

  const adminUpdateProblemReport = async (
    reportId: string, 
    status: ProblemStatus, 
    adminNotes?: string, 
    adminActionTaken?: string
  ) => {
    const updateObj: Partial<ProblemReport> = {
      status,
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      ...(adminActionTaken !== undefined ? { adminActionTaken } : {}),
      ...(status === 'Resolved' ? { 
        resolvedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        resolvedBy: currentUser ? `${currentUser.name} (Admin)` : 'Admin'
      } : {})
    };

    setProblemReports(prev => prev.map(r => r.id === reportId ? { ...r, ...updateObj } : r));

    try {
      await setDoc(doc(db, 'problemReports', reportId), updateObj, { merge: true });
    } catch (e) {
      console.error('Error updating problem report as admin:', e);
    }
  };

  const adminDeleteProblemReport = async (reportId: string) => {
    setProblemReports(prev => prev.filter(r => r.id !== reportId));
    try {
      await deleteDoc(doc(db, 'problemReports', reportId));
    } catch (e) {
      console.error('Error deleting problem report as admin:', e);
    }
  };

  const resetDataToDefault = async () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setSwapRequests(INITIAL_SWAP_REQUESTS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setSessions(INITIAL_SESSIONS);
    setReviews(INITIAL_REVIEWS);
    setCertificates(INITIAL_CERTIFICATES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setProblemReports(INITIAL_PROBLEM_REPORTS);
    setActiveView('howItWorks');

    const seed = async <T extends { id: string }>(colName: string, items: T[]) => {
      const batch = writeBatch(db);
      items.forEach(i => batch.set(doc(db, colName, i.id), i));
      await batch.commit();
    };

    try {
      await seed('users', INITIAL_USERS);
      await seed('swapRequests', INITIAL_SWAP_REQUESTS);
      await seed('chatMessages', INITIAL_CHAT_MESSAGES);
      await seed('sessions', INITIAL_SESSIONS);
      await seed('reviews', INITIAL_REVIEWS);
      await seed('certificates', INITIAL_CERTIFICATES);
      await seed('notifications', INITIAL_NOTIFICATIONS);
      await seed('problemReports', INITIAL_PROBLEM_REPORTS);
    } catch (e) {
      console.error('Error resetting Firestore:', e);
    }
  };

  return (
    <SkillSwapContext.Provider value={{
      currentUser,
      users,
      swapRequests,
      chatMessages,
      sessions,
      reviews,
      certificates,
      notifications,
      problemReports,
      activeView,
      setActiveView,
      isFirebaseConnected,
      loginWithEmailAndPassword,
      registerWithEmailAndPassword,
      loginAsUser,
      logout,
      registerUser,
      updateProfile,
      addSkill,
      removeSkill,
      calculateMatch,
      calculateComprehensiveMatch,
      targetRoles,
      selectedRoleId,
      setSelectedRoleId,
      skillGapAnalysis,
      activeLearningPath,
      toggleMilestoneCheckpoint,
      toggleMilestoneCompleted,
      generateCustomLearningPath,
      getRecommendedMentorsForRole,
      getAgendasForSkill,
      peerRatingFactors,
      improvementSuggestions,
      timeBankWallet,
      transferSkillCreditTip,
      redeemSkillCreditsForSession,
      sendSwapRequest,
      respondToSwapRequest,
      payCommitmentDeposit,
      cancelSwapRequest,
      sendChatMessage,
      reportProblem,
      scheduleSession,
      confirmSessionAttendance,
      submitReviewAndCompleteSession,
      addCustomCertificate,
      deleteCertificate,
      requestDoneLearning,
      confirmDoneLearning,
      adminAcknowledgeRefundNotice,
      fetchAISuggestions,
      fetchAIMatchRecommendations,
      aiLoading,
      toggleUserReportedStatus,
      verifyUserAccount,
      toggleVerifiedMentorBadge,
      deleteUserAccount,
      adminUpdateSessionStatus,
      adminUpdateSessionDetails,
      adminDeleteSession,
      adminUpdateSwapRequestStatus,
      adminDeleteSwapRequest,
      adminUpdateUser,
      adminUpdateProblemReport,
      adminDeleteProblemReport,
      resetDataToDefault
    }}>
      {children}
    </SkillSwapContext.Provider>
  );
};

export const useSkillSwap = () => {
  const ctx = useContext(SkillSwapContext);
  if (!ctx) throw new Error('useSkillSwap must be used within SkillSwapProvider');
  return ctx;
};
