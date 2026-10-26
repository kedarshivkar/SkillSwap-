import React, { useState } from 'react';
import { User as UserType, Review, Certificate, hasUserPhoto } from '../types';
import { useSkillSwap } from '../context/SkillSwapContext';
import { ReportProblemModal } from './ReportProblemModal';
import { 
  X, CheckCircle2, Star, MapPin, Send, Award, Shield, 
  BookOpen, MessageSquare, User as UserIcon, ExternalLink, 
  Copy, Check, Share2, ThumbsUp, AlertTriangle, GraduationCap, 
  Sparkles, FileBadge, Eye, QrCode
} from 'lucide-react';

interface UserProfileModalProps {
  user: UserType | null;
  onClose: () => void;
  onRequestSwap: (user: UserType) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ 
  user, onClose, onRequestSwap 
}) => {
  const { reviews, currentUser, certificates, sessions, swapRequests, setActiveView } = useSkillSwap();
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedProfileLink, setCopiedProfileLink] = useState(false);
  const [vouched, setVouched] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);

  if (!user) return null;

  const isSelf = currentUser?.id === user.id;
  const userReviews = reviews.filter(r => r.receiverId === user.id);
  const userCerts = certificates.filter(c => c.userId === user.id);

  // Completed sessions for skills taught & learned stats
  const completedTaughtSessions = sessions.filter(s => s.teacherId === user.id && s.status === 'Completed');
  const completedLearnedSessions = sessions.filter(s => s.learnerId === user.id && s.status === 'Completed');

  const skillsTaughtCount = Math.max(
    completedTaughtSessions.length,
    user.successfulTeachCount ?? (user.totalHoursTaught ?? user.teachSkills.length)
  );

  const skillsLearnedCount = Math.max(
    completedLearnedSessions.length,
    user.totalHoursLearned ?? Math.max(user.learnSkills.length, 1)
  );

  const distinctTaughtSkillsCount = Math.max(
    new Set(completedTaughtSessions.map(s => s.skillName)).size,
    user.teachSkills.length
  );

  const distinctLearnedSkillsCount = Math.max(
    new Set(completedLearnedSessions.map(s => s.skillName)).size,
    user.learnSkills.length
  );

  // Check if a skill has matching certificate proof
  const getCertForSkill = (skillName: string) => {
    return userCerts.find(c => 
      c.skillName.toLowerCase().includes(skillName.toLowerCase()) || 
      skillName.toLowerCase().includes(c.skillName.toLowerCase())
    );
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleCopyProfileLink = () => {
    const url = `${window.location.origin}/#profile/${user.id}`;
    navigator.clipboard.writeText(url);
    setCopiedProfileLink(true);
    setTimeout(() => setCopiedProfileLink(false), 2500);
  };

  const handleStartChat = () => {
    onClose();
    setActiveView('messages');
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-7 text-slate-900 space-y-6 max-h-[92vh] overflow-y-auto">
          
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 border-2 border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-sm overflow-hidden">
              {hasUserPhoto(user.photo) ? (
                <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-10 h-10 text-slate-500" />
              )}
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-900 truncate">{user.name}</h2>
                {user.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-900 text-white shadow-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Verified Member
                  </span>
                )}
                {user.isVerifiedMentor && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-xs">
                    <Award className="w-3 h-3 text-amber-100" /> Verified Mentor
                  </span>
                )}
                {userCerts.length > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    <Shield className="w-3 h-3 text-emerald-600" /> {userCerts.length} Certified Proof{userCerts.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {user.city}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-700 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {user.rating} ({user.totalReviews} reviews)
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-800">{user.mode} Sessions</span>
              </div>

              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <span className="font-semibold text-slate-700">Availability:</span>
                <span>{user.availability}</span>
              </div>
            </div>
          </div>

          {/* Quick Stat Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center transition-all hover:bg-slate-100/60">
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                <GraduationCap className="w-3.5 h-3.5 text-slate-700" />
                <span>Skills Taught</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-slate-900">
                {skillsTaughtCount}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {distinctTaughtSkillsCount} topics taught on platform
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center transition-all hover:bg-slate-100/60">
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Skills Learned</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-indigo-700">
                {skillsLearnedCount}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {distinctLearnedSkillsCount} topics studied from peers
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center transition-all hover:bg-slate-100/60">
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                <FileBadge className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Proofs</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-700">
                {userCerts.length}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                certificates & credentials
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center transition-all hover:bg-slate-100/60">
              <div className="flex items-center justify-center gap-1.5 text-slate-500 text-xs font-semibold mb-1">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Community Rating</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-700">
                {user.rating} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                {userReviews.length || user.totalReviews} peer endorsements
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">About & Bio</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {user.bio}
            </p>
          </div>

          {/* Skills Comparison Box with Proof Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Can Teach with Verified Proof Badge */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Skills {user.name.split(' ')[0]} Can Teach:
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  {user.teachSkills.length} skills offered
                </span>
              </div>

              <div className="space-y-2">
                {user.teachSkills.map(sk => {
                  const certProof = getCertForSkill(sk.skillName);
                  return (
                    <div 
                      key={sk.id} 
                      className="bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{sk.skillName}</span>
                        <span className="text-[10px] bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-semibold">
                          {sk.level}
                        </span>
                      </div>

                      {/* Verified Proof Flag */}
                      {certProof ? (
                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Verified Skill Proof Attached</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedCert(certProof)}
                            className="text-[10px] text-slate-600 hover:text-slate-900 font-bold underline flex items-center gap-0.5"
                          >
                            <Eye className="w-2.5 h-2.5" /> View Proof
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">
                          Peer exchange validated via live sessions
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Wants to Learn */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Skills {user.name.split(' ')[0]} Wants to Learn:
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  {user.learnSkills.length} topics desired
                </span>
              </div>

              <div className="space-y-2">
                {user.learnSkills.map(sk => (
                  <div key={sk.id} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-lg border border-slate-200 shadow-xs">
                    <span className="font-semibold text-slate-900">{sk.skillName}</span>
                    <span className="text-[10px] bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                      {sk.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Verified Certificates & Credential Proofs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>Verified Certificates & Skill Proof ({userCerts.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500">
                  Official peer-verified certificates proving verified competency on SkillSwap
                </p>
              </div>
            </div>

            {userCerts.length === 0 ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 text-center space-y-1">
                <Shield className="w-6 h-6 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-600 font-medium">No certificates registered yet.</p>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  Certificates are automatically generated and cryptographically verifiable when completing skill swaps on SkillSwap.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userCerts.map(cert => (
                  <div 
                    key={cert.id}
                    className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-2 hover:border-slate-300 transition-all"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Verified Proof
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1 truncate">
                          {cert.skillName}
                        </h4>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <div className="text-[11px]">
                        <span className="text-slate-400">Issuer / Mentor: </span>
                        <span className="font-semibold text-slate-800">{cert.issuer || cert.teacherName || 'SkillSwap Peer Academic Board'}</span>
                      </div>
                      <div className="text-[11px]">
                        <span className="text-slate-400">Date Issued: </span>
                        <span className="font-medium text-slate-700">{cert.issueDate}</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded flex items-center justify-between">
                        <span className="truncate">{cert.certificateCode}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyCode(cert.certificateCode)}
                          className="text-slate-500 hover:text-slate-900 ml-1.5 shrink-0"
                          title="Copy certificate verification code"
                        >
                          {copiedCode === cert.certificateCode ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedCert(cert)}
                        className="w-full py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <Eye className="w-3 h-3" />
                        <span>Inspect Official Proof</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ratings & Feedback */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Ratings & Feedback ({userReviews.length})
            </h3>
            {userReviews.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                No reviews yet. Be the first to complete a swap session with {user.name.split(' ')[0]}!
              </p>
            ) : (
              <div className="space-y-2 max-h-36 overflow-y-auto">
                {userReviews.map(r => (
                  <div key={r.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{r.skillName} Session</span>
                      <div className="flex items-center gap-1 text-amber-700 font-bold">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>{r.rating}.0</span>
                      </div>
                    </div>
                    <p className="text-slate-600 italic">"{r.comment}"</p>
                    <div className="text-[10px] text-slate-400">{r.date}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons Section */}
          <div className="pt-3 border-t border-slate-200 space-y-2.5">
            {/* Primary Action Button */}
            {!isSelf && currentUser && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestSwap(user);
                }}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 hover:shadow-md"
              >
                <Send className="w-4 h-4 text-emerald-400" />
                <span>Request Skill Swap With {user.name.split(' ')[0]}</span>
              </button>
            )}

            {/* Supplementary Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {!isSelf && (
                <button
                  type="button"
                  onClick={handleStartChat}
                  className="flex-1 min-w-[130px] py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-slate-600" />
                  <span>Start Chat</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCopyProfileLink}
                className="flex-1 min-w-[130px] py-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                {copiedProfileLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-600" />
                    <span>Share Profile</span>
                  </>
                )}
              </button>

              {!isSelf && (
                <button
                  type="button"
                  onClick={() => setVouched(prev => !prev)}
                  className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl border font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs ${
                    vouched 
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800' 
                      : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <ThumbsUp className={`w-3.5 h-3.5 ${vouched ? 'text-emerald-600 fill-emerald-600' : 'text-slate-600'}`} />
                  <span>{vouched ? 'Vouched & Endorsed' : 'Vouch for Skill'}</span>
                </button>
              )}

              {!isSelf && (
                <button
                  type="button"
                  onClick={() => setReportModalOpen(true)}
                  className="py-2 px-3 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-500 hover:text-rose-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                  title="Report Profile or false skill claims"
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Report</span>
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Official Certificate Credential Modal (Proof Inspector) */}
      {selectedCert && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-amber-50/40 border-8 border-slate-900 rounded-3xl shadow-2xl p-6 sm:p-8 text-slate-900 space-y-6 overflow-hidden">
            
            {/* Ornate Inner Frame */}
            <div className="absolute inset-2 border-2 border-dashed border-amber-600/30 rounded-2xl pointer-events-none" />

            {/* Close Button */}
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/50 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Header */}
            <div className="text-center space-y-2 relative z-10">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Award className="w-7 h-7" />
              </div>
              <div className="text-[11px] font-extrabold tracking-widest uppercase text-amber-800">
                Official Credential of Competency
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-serif">
                Certificate of Skill Mastery
              </h3>
              <p className="text-xs text-slate-500">
                SkillSwap Peer-to-Peer Academic Verification Registry
              </p>
            </div>

            {/* Certificate Body */}
            <div className="text-center space-y-3 relative z-10 bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-amber-200/60 shadow-xs">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                This authentic credential certifies that
              </p>
              <div className="text-xl sm:text-2xl font-bold text-slate-900 border-b-2 border-slate-900 pb-1 inline-block px-4">
                {user.name}
              </div>
              <p className="text-xs text-slate-600 pt-1">
                has proven demonstrated proficiency and active instructional mastery in
              </p>
              <div className="text-lg font-black text-indigo-950 bg-indigo-50 border border-indigo-200/70 py-2 px-4 rounded-xl inline-block">
                {selectedCert.skillName}
              </div>
            </div>

            {/* Verification & Issuer Details */}
            <div className="grid grid-cols-2 gap-3 text-xs text-slate-700 relative z-10">
              <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Verified By</div>
                <div className="font-bold text-slate-900 text-xs truncate">
                  {selectedCert.issuer || selectedCert.teacherName || 'Peer Examination Board'}
                </div>
                <div className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Verified on SkillSwap
                </div>
              </div>

              <div className="bg-white/80 p-3 rounded-xl border border-amber-200/60 space-y-1">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Date of Issuance</div>
                <div className="font-bold text-slate-900 text-xs">
                  {selectedCert.issueDate}
                </div>
                <div className="text-[10px] text-slate-500 font-mono truncate">
                  {selectedCert.certificateCode}
                </div>
              </div>
            </div>

            {/* Actions inside Certificate */}
            <div className="flex flex-col sm:flex-row items-center gap-2 relative z-10 pt-2">
              <button
                type="button"
                onClick={() => handleCopyCode(selectedCert.certificateCode)}
                className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedCode === selectedCert.certificateCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Verification Code!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Verification ID</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="w-full sm:w-1/2 py-2 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-colors"
              >
                Close Proof Viewer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Safety / Report Profile Modal */}
      <ReportProblemModal 
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        partner={user}
        swapRequest={null}
      />
    </>
  );
};
