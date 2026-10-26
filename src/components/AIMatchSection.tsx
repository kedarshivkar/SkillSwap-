import React, { useState, useEffect } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  Sparkles, Star, MapPin, CheckCircle2, Send, User as UserIcon, 
  ArrowRightLeft, Shield, Clock, Globe, Award, RefreshCw, ChevronDown, ChevronUp, Check, Info
} from 'lucide-react';
import { User, AIMatchRecommendation, AIMatchResponse, hasUserPhoto } from '../types';

interface AIMatchSectionProps {
  onSelectUserForSwap: (user: User) => void;
  onOpenUserProfile: (user: User) => void;
  searchTerm?: string;
  autoSearchOnQuery?: boolean;
}

export const AIMatchSection: React.FC<AIMatchSectionProps> = ({
  onSelectUserForSwap,
  onOpenUserProfile,
  searchTerm = ''
}) => {
  const { users, currentUser, fetchAIMatchRecommendations } = useSkillSwap();

  const [aiResponse, setAiResponse] = useState<AIMatchResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [selectedDemoUser, setSelectedDemoUser] = useState<User | null>(null);

  // Active user to analyze (either logged in user or selected demo user)
  const activeUser = currentUser || selectedDemoUser || users.find(u => u.id === 'usr_rahul') || users[0];

  const handleGenerateMatches = async (userToAnalyze?: User, queryToUse?: string) => {
    const target = userToAnalyze || activeUser;
    if (!target) return;
    setLoading(true);
    try {
      const q = queryToUse !== undefined ? queryToUse : searchTerm;
      const res = await fetchAIMatchRecommendations(target, q);
      if (res) {
        setAiResponse(res);
        if (res.recommendations && res.recommendations.length > 0) {
          setExpandedUser(res.recommendations[0].userId);
        }
      }
    } catch (err) {
      console.error('Error in handleGenerateMatches:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!activeUser) return;
    const query = searchTerm.trim();
    if (!query) {
      setAiResponse(null);
      return;
    }

    let isCancelled = false;
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetchAIMatchRecommendations(activeUser, query);
        if (!isCancelled && res) {
          setAiResponse(res);
          if (res.recommendations && res.recommendations.length > 0) {
            setExpandedUser(res.recommendations[0].userId);
          }
        }
      } catch (err) {
        console.error('Error fetching recommendations for query:', err);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [searchTerm, activeUser?.id]);

  return (
    <div className="bg-white text-slate-900 rounded-3xl p-6 sm:p-8 shadow-xs border border-slate-200/80 space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <ArrowRightLeft className="w-3.5 h-3.5 text-blue-600" />
            Smart Matchmaker
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] flex flex-wrap items-center gap-2">
            <ArrowRightLeft className="w-7 h-7 text-blue-600 inline-block shrink-0" />
            <span className="text-slate-900 font-black">Smart Matchmaker</span> {searchTerm && <span className="text-blue-600 text-xl font-bold">for "{searchTerm}"</span>}
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-2xl">
            AI evaluates candidates specifically for <span className="text-blue-600 font-semibold">{searchTerm || 'your searched skill'}</span> across 5 key factors: skill synergy, level balance, ratings, schedule availability, and location & languages.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <button
            onClick={() => handleGenerateMatches(activeUser, searchTerm)}
            disabled={loading}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing Factors...' : `Refresh AI Matches`}</span>
          </button>
        </div>
      </div>

      {/* 5 AI Criteria Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-blue-600">
          5 AI Multi-Factor Scoring Criteria:
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-1.5 font-medium">
            1. Similar & Related Skills
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-1.5 font-medium">
            2. Skill Proficiency Levels
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-1.5 font-medium">
            3. User Ratings & Trust
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-1.5 font-medium">
            4. Schedule & Online Availability
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 flex items-center gap-1.5 font-medium">
            5. Location & Languages
          </span>
        </div>
      </div>

      {/* Target User Banner & Demo Switcher */}
      <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">
              Evaluating Matches For:
            </div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>{activeUser?.name}</span>
              <span className="text-xs text-slate-500 font-normal">({activeUser?.city})</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-600">
              <span>Can Teach: <strong className="text-blue-600">{activeUser?.teachSkills.map(s => s.skillName).join(', ') || 'Skills'}</strong></span>
              <span>•</span>
              <span>Wants to Learn: <strong className="text-sky-600">{activeUser?.learnSkills.map(s => s.skillName).join(', ') || 'Skills'}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick Demo Switcher */}
        <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 text-xs shrink-0 overflow-x-auto">
          <span className="text-slate-500 font-medium px-2 hidden sm:inline">Try Demo User:</span>
          {users.filter(u => !u.isAdmin).slice(0, 4).map(u => (
            <button
              key={u.id}
              onClick={() => {
                setSelectedDemoUser(u);
                handleGenerateMatches(u);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer ${
                activeUser?.id === u.id 
                  ? 'bg-blue-600 text-white font-bold shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {u.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" />
            <ArrowRightLeft className="w-6 h-6 text-blue-600 absolute animate-pulse" />
          </div>
          <span className="text-xs font-semibold text-slate-600 tracking-wide">Searching Skill Swap Matches...</span>
        </div>
      ) : !aiResponse ? (
        <div className="bg-slate-50 border border-slate-200 p-6 sm:p-8 rounded-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 border border-blue-200 text-blue-600 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-bold text-slate-900">AI Skill Match Suggestions</h3>
            <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              {searchTerm 
                ? `Click below to generate AI recommendations tailored for "${searchTerm}".`
                : 'Search any skill in the search bar above or click below to analyze AI match compatibility across all members.'
              }
            </p>
          </div>
          <button
            onClick={() => handleGenerateMatches(activeUser, searchTerm)}
            className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-extrabold shadow-xs transition-all inline-flex items-center gap-2 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>{searchTerm ? `Get AI Suggestions for "${searchTerm}"` : 'Suggest AI Skill Matches'}</span>
          </button>
        </div>
      ) : aiResponse?.recommendations && aiResponse.recommendations.length > 0 ? (
        <div className="space-y-4">
          
          {/* AI Rationale Summary */}
          {aiResponse.analysisSummary && (
            <div className="text-xs text-slate-700 bg-blue-50/60 border border-blue-200 p-3.5 rounded-xl flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <span>{aiResponse.analysisSummary}</span>
            </div>
          )}

          {/* Candidates List (Top 3 Recommendations Only) */}
          <div className="grid grid-cols-1 gap-4">
            {aiResponse.recommendations.slice(0, 3).map((rec) => {
              const matchedUser = users.find(u => u.id === rec.userId) || {
                id: rec.userId,
                name: rec.userName,
                city: 'Mumbai',
                rating: 4.9,
                totalReviews: 18,
                teachSkills: [],
                learnSkills: [],
                mode: 'Online',
                bio: ''
              } as unknown as User;

              const isExpanded = expandedUser === rec.userId;

              return (
                <div 
                  key={rec.userId}
                  className={`border transition-all rounded-2xl p-5 space-y-4 ${
                    rec.isBestChoice 
                      ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/30' 
                      : 'bg-white border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  {/* Top Bar with Best Choice Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {rec.isBestChoice ? (
                        <span className="bg-blue-600 text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1.5">
                          <Star className="w-3.5 h-3.5 fill-white text-white" />
                          <span>{rec.badgeLabel || 'Best Choice'}</span>
                        </span>
                      ) : (
                        <span className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                          AI Recommended Match
                        </span>
                      )}
                    </div>

                    {/* Match Score Badge */}
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200 flex items-center gap-2">
                        <span className="text-2xl font-black text-slate-900">{rec.matchPercentage}%</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {rec.matchPercentage === 100 ? 'Perfect Match' : 'Match Score'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* User Profile Overview */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 text-lg font-bold overflow-hidden">
                        {hasUserPhoto(matchedUser.photo) ? (
                          <img src={matchedUser.photo} alt={rec.userName} className="w-full h-full object-cover" />
                        ) : (
                          rec.userName.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 
                            onClick={() => onOpenUserProfile(matchedUser)}
                            className="font-bold text-slate-900 text-base hover:text-blue-600 hover:underline cursor-pointer"
                          >
                            {rec.userName}
                          </h3>
                          {matchedUser.isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" title="Verified Member" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          {matchedUser.city} • {matchedUser.mode} • Rating: <strong className="text-amber-500">{matchedUser.rating} ★</strong> ({matchedUser.totalReviews} reviews)
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onOpenUserProfile(matchedUser)}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                      >
                        Profile
                      </button>
                      <button
                        onClick={() => onSelectUserForSwap(matchedUser)}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span>Swap Request</span>
                      </button>
                    </div>
                  </div>

                  {/* AI Reason Summary */}
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-blue-700 font-bold">AI Match Analysis: </strong>
                      <span>{rec.reasonSummary}</span>
                    </div>
                  </div>

                  {/* Factor Breakdown Accordion Toggle */}
                  <div>
                    <button
                      onClick={() => setExpandedUser(isExpanded ? null : rec.userId)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors focus:outline-none cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide 5-Factor AI Analysis' : 'Show 5-Factor AI Breakdown'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-blue-600" /> : <ChevronDown className="w-3.5 h-3.5 text-blue-600" />}
                    </button>

                    {isExpanded && rec.factorBreakdown && (
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                          <div className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                            1. Skill Synergy
                          </div>
                          <div className="text-slate-600 leading-snug">{rec.factorBreakdown.skillSynergy}</div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                          <div className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                            2. Skill Level Balance
                          </div>
                          <div className="text-slate-600 leading-snug">{rec.factorBreakdown.levelCompatibility}</div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                          <div className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                            3. Ratings & Community Trust
                          </div>
                          <div className="text-slate-600 leading-snug">{rec.factorBreakdown.ratingAndTrust}</div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                          <div className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                            4. Schedule & Mode
                          </div>
                          <div className="text-slate-600 leading-snug">{rec.factorBreakdown.availabilityAndMode}</div>
                        </div>

                        <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                          <div className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                            5. Location & Languages
                          </div>
                          <div className="text-slate-600 leading-snug">{rec.factorBreakdown.locationAndLang}</div>
                        </div>

                        {rec.factorBreakdown.interestAlignment && (
                          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl space-y-1">
                            <div className="text-[11px] font-bold text-blue-700 flex items-center gap-1">
                              6. Shared Interests & Goals
                            </div>
                            <div className="text-slate-600 leading-snug">{rec.factorBreakdown.interestAlignment}</div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="text-center py-8 text-slate-500 text-xs space-y-3 bg-slate-50 rounded-2xl border border-slate-200 p-6">
          <p>No direct matches found for "{searchTerm}". You can try searching other popular skills like <strong className="text-blue-600">Python</strong>, <strong className="text-blue-600">Guitar</strong>, <strong className="text-blue-600">Photoshop</strong>, or <strong className="text-blue-600">French</strong>.</p>
          <button
            onClick={() => handleGenerateMatches(activeUser, '')}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Show Best Overall Matches</span>
          </button>
        </div>
      )}

    </div>
  );
};
