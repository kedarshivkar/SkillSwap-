export type SkillLevel = 'Beginner' | 'Intermediate' | 'Expert';
export type SkillType = 'Teach' | 'Learn';
export type MeetingMode = 'Online';
export type RequestStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Completed' | 'Cancelled';
export type SessionStatus = 'Scheduled' | 'Completed' | 'Cancelled';

export interface SkillItem {
  id: string;
  skillName: string;
  level: SkillLevel;
  type: SkillType;
  category?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  socialLink?: string;
  walletBalance?: number;
  skillCredits?: number;
  totalHoursTaught?: number;
  totalHoursLearned?: number;
  savingsEstimateUsd?: number;
  targetRole?: string;
  interests?: string[];
  city: string;
  photo: string;
  rating: number;
  totalReviews: number;
  bio: string;
  languages: string[];
  availability: string;
  experienceLevel: SkillLevel;
  mode: MeetingMode;
  isVerified: boolean;
  isVerifiedMentor?: boolean;
  successfulTeachCount?: number;
  isAdmin: boolean;
  isReportedFake?: boolean;
  teachSkills: SkillItem[];
  learnSkills: SkillItem[];
  createdAt: string;
}

export const hasUserPhoto = (photo?: string): boolean => {
  if (!photo) return false;
  const p = photo.trim();
  if (!p) return false;
  if (p.includes('unsplash.com') || p.includes('placeholder.com') || p.includes('images.unsplash')) {
    return false;
  }
  return true;
};

export const cleanUserPhoto = (photo?: string): string => {
  return hasUserPhoto(photo) ? photo!.trim() : '';
};

export interface SwapRequest {
  id: string;
  senderId: string;
  receiverId: string;
  teachSkill: string;
  learnSkill: string;
  status: RequestStatus;
  createdAt: string;
  notes?: string;
  scheduledTime?: string;
  meetingLocation?: string;
  meetingType?: MeetingMode;
  zoomLink?: string;
  senderPaidDeposit?: boolean;
  receiverPaidDeposit?: boolean;
  isContactUnlocked?: boolean;
  isFirstFreeSwap?: boolean;
  isRefundProcessed?: boolean;
  depositAmount?: number;
  refundAmount?: number;
  platformFee?: number;
  completionRequestedBy?: string;
  completionRequestedAt?: string;
  completionConfirmedByTeacher?: boolean;
  refundNoticeSentToAdmin?: boolean;
  adminRefundNoticeStatus?: 'Pending' | 'Processed' | 'Acknowledged';
  adminRefundNoticeDate?: string;
}

export interface ChatAttachment {
  name: string;
  url: string;
  type: 'image' | 'file' | 'zoom' | 'qr';
}

export interface ChatMessage {
  id: string;
  swapRequestId: string;
  senderId: string;
  receiverId: string;
  message: string;
  time: string;
  attachments?: ChatAttachment[];
  isRead: boolean;
}

export interface Session {
  id: string;
  swapRequestId: string;
  teacherId: string;
  learnerId: string;
  skillName: string;
  date: string;
  time: string;
  meetingType: MeetingMode;
  locationOrLink: string;
  status: SessionStatus;
  teacherConfirmed: boolean;
  studentConfirmed: boolean;
  qrCodeData: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  receiverId: string;
  rating: number;
  comment: string;
  skillName: string;
  date: string;
}

export interface Certificate {
  id: string;
  userId: string;
  userName: string;
  teacherName: string;
  skillName: string;
  issueDate: string;
  certificateCode: string;
  qrCodeData: string;
  certificateUrl?: string;
  issuer?: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'request' | 'accepted' | 'chat' | 'reminder' | 'certificate' | 'admin' | 'completion';
  linkTo?: string;
}

export interface AISuggestionResponse {
  recommendedSkills: {
    skill: string;
    reason: string;
    difficulty: string;
  }[];
  exchangeProjectIdeas: string[];
  advisorNote: string;
}

export type ProblemCategory = 
  | 'No Show / Attendance Issue' 
  | 'Inappropriate Behavior / Harassment' 
  | 'Skill Mismatch / False Claims' 
  | 'Spam, Fraud or Scam' 
  | 'Audio / Video Technical Issue' 
  | 'Cancellation Dispute' 
  | 'Other Problem';

export type ProblemStatus = 'Pending' | 'Under Review' | 'Resolved' | 'Dismissed';
export type ProblemPriority = 'Normal' | 'Urgent' | 'Critical';

export interface ProblemReport {
  id: string;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reportedUserId?: string;
  reportedUserName?: string;
  reportedUserEmail?: string;
  swapRequestId?: string;
  teachSkill?: string;
  learnSkill?: string;
  category: ProblemCategory;
  priority: ProblemPriority;
  description: string;
  evidenceNotes?: string;
  createdAt: string;
  status: ProblemStatus;
  adminNotes?: string;
  adminActionTaken?: string;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface AIMatchFactorBreakdown {
  skillSynergy: string;
  levelCompatibility: string;
  ratingAndTrust: string;
  availabilityAndMode: string;
  locationAndLang: string;
  swapHistory?: string;
  interestAlignment?: string;
}

export interface AIMatchRecommendation {
  userId: string;
  userName: string;
  matchPercentage: number;
  isBestChoice: boolean;
  badgeLabel: string;
  reasonSummary: string;
  factorBreakdown: AIMatchFactorBreakdown;
  user?: User;
  skillsOfferedMatch?: string[];
  skillsNeededMatch?: string[];
  sharedInterests?: string[];
  experienceCompatibility?: string;
  availabilityMatch?: string;
}

export interface AIMatchResponse {
  recommendations: AIMatchRecommendation[];
  analysisSummary: string;
}

// Target Roles & Skill Gap Analysis
export interface TargetRoleProfile {
  id: string;
  title: string;
  category: string;
  description: string;
  requiredSkills: {
    skillName: string;
    level: SkillLevel;
    importance: 'Critical' | 'Important' | 'Bonus';
    category: string;
  }[];
  avgSalaryRange: string;
  typicalBootcampCost: number;
}

export interface SkillGapItem {
  skillName: string;
  status: 'Mastered' | 'In Progress' | 'Missing';
  currentLevel?: SkillLevel;
  requiredLevel: SkillLevel;
  importance: 'Critical' | 'Important' | 'Bonus';
  category: string;
  suggestedAction: string;
}

export interface SkillGapAnalysisResult {
  targetRole: TargetRoleProfile;
  matchScore: number; // 0 - 100%
  masteredSkills: SkillGapItem[];
  missingSkills: SkillGapItem[];
  inProgressSkills: SkillGapItem[];
  readinessLevel: 'Beginner' | 'Ready with Guidance' | 'Job Ready';
  estimatedHoursToBridge: number;
  recommendedBootcampSaving: number;
}

// Learning Paths & Milestones
export interface LearningResource {
  id: string;
  title: string;
  type: 'Article' | 'Documentation' | 'Video Course' | 'Interactive Sandbox' | 'Practice Drill';
  url: string;
  isFree: boolean;
  estimatedMinutes: number;
}

export interface LearningProject {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  deliverables: string[];
  estimatedHours: number;
}

export interface LearningMilestone {
  id: string;
  weekNumber: number;
  title: string;
  summary: string;
  keySkills: string[];
  resources: LearningResource[];
  project: LearningProject;
  completed: boolean;
  checkpoints: string[];
}

export interface LearningPath {
  id: string;
  targetRole: string;
  goalSummary: string;
  totalWeeks: number;
  completedMilestones: number;
  milestones: LearningMilestone[];
  createdAt: string;
}

// Mentor & Peer Recommendations with Discussion Topics & Activities
export interface SessionAgendaTemplate {
  topic: string;
  duration: string;
  suggestedActivity: string;
  icebreakerQuestions: string[];
  learningExercises: string[];
  deliverableOutcomes: string[];
}

export interface RecommendedMentor {
  user: User;
  matchScore: number;
  matchedGapSkills: string[];
  synergyReason: string;
  suggestedAgendas: SessionAgendaTemplate[];
}

// Progress, Peer Ratings & Improvement Suggestions
export interface PeerRatingFactor {
  name: string;
  score: number; // 0 to 5
  description: string;
}

export interface ImprovementSuggestion {
  id: string;
  category: 'Teaching Style' | 'Session Punctuality' | 'Curriculum Depth' | 'Market Demand' | 'Profile Visibility';
  urgency: 'High' | 'Medium' | 'Insight';
  title: string;
  explanation: string;
  actionableStep: string;
  impactPotential: string;
}

export interface LearningProgressSummary {
  hoursLearned: number;
  hoursTaught: number;
  completedSwaps: number;
  activeCertificates: number;
  ratingAverage: number;
  ratingBreakdown: PeerRatingFactor[];
  skillMasteryLevels: {
    skillName: string;
    percentage: number;
    level: SkillLevel;
    verifiedSessions: number;
  }[];
  improvementSuggestions: ImprovementSuggestion[];
}

// Monetary & TimeBank Economy
export interface TimeBankTransaction {
  id: string;
  type: 'Earned' | 'Spent' | 'Escrow_Hold' | 'Escrow_Refund' | 'Gratuity_Tip';
  amountCredits: number;
  monetaryEquivalentUsd: number;
  description: string;
  timestamp: string;
  relatedSessionOrSwapId?: string;
  peerName?: string;
}

export interface TimeBankWallet {
  creditsBalance: number; // 1 credit = 1 hour taught
  escrowLockedCredits: number;
  cumulativeUsdSaved: number; // vs private tutor rates ($65/hr)
  bootcampCostAvoidedUsd: number; // vs $5,000 bootcamps
  transactions: TimeBankTransaction[];
}

