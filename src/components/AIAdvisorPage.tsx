import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  Sparkles, BrainCircuit, CheckCircle2, AlertCircle, Clock, 
  Lightbulb, RefreshCw, Target, Zap, ArrowRight, BookOpen, 
  Compass, ExternalLink, Calendar, Send, Star, Award, 
  ChevronRight, TrendingUp, ShieldCheck, Check,
  User as UserIcon
} from 'lucide-react';
import { User, SkillGapItem, hasUserPhoto } from '../types';

interface AIAdvisorPageProps {
  onSelectUserForSwap?: (user: User) => void;
  onOpenUserProfile?: (user: User) => void;
}

export const AIAdvisorPage: React.FC<AIAdvisorPageProps> = ({
  onSelectUserForSwap,
  onOpenUserProfile
}) => {
  const { 
    currentUser, 
    targetRoles, 
    selectedRoleId, 
    setSelectedRoleId, 
    skillGapAnalysis,
    activeLearningPath,
    toggleMilestoneCompleted,
    getRecommendedMentorsForRole,
    peerRatingFactors,
    improvementSuggestions,
    addSkill,
    setActiveView
  } = useSkillSwap();

  const [activeTab, setActiveTab] = useState<'gap' | 'path' | 'mentors' | 'improvement'>('gap');
  const [addedSkillsMap, setAddedSkillsMap] = useState<Record<string, boolean>>({});
  const [selectedMentorAgendaSkill, setSelectedMentorAgendaSkill] = useState<string>('Python');

  const mentors = getRecommendedMentorsForRole(selectedRoleId);

  const handleAddMissingSkill = (skill: SkillGapItem) => {
    addSkill(skill.skillName, skill.requiredLevel, 'Learn', skill.category);
    setAddedSkillsMap(prev => ({ ...prev, [skill.skillName]: true }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* Hero Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl border border-indigo-800/50 shadow-xl">
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Career & Learning Path Engine</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-serif tracking-tight text-white">
            Career Gap & Learning Roadmap Hub
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Compare your abilities with target industry roles, uncover missing skill gaps, follow step-by-step milestone roadmaps, and connect with peers teaching those exact competencies.
          </p>
        </div>
      </div>

      {/* Target Role Selector Bar */}
      <div className="bg-white border border-slate-200/90 p-5 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 block">
              Active Target Role:
            </span>
            <h2 className="text-lg font-black text-slate-900">
              {skillGapAnalysis.targetRole.title}
            </h2>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-500 font-medium">Switch Target:</span>
            <select
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {targetRoles.map(role => (
                <option key={role.id} value={role.id}>
                  {role.title} ({role.category})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Metrics Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 block text-[11px]">Role Readiness Score</span>
            <div className="text-base font-black text-indigo-600 flex items-center gap-1.5 mt-0.5">
              <span>{skillGapAnalysis.matchScore}%</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                {skillGapAnalysis.readinessLevel}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 block text-[11px]">Missing Skill Gaps</span>
            <div className="text-base font-black text-rose-600 mt-0.5">
              {skillGapAnalysis.missingSkills.length} Critical
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
            <span className="text-slate-500 block text-[11px]">Time to Bridge Gap</span>
            <div className="text-base font-black text-slate-900 mt-0.5">
              ~{skillGapAnalysis.estimatedHoursToBridge} Peer Hours
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-2 sm:gap-6 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('gap')}
          className={`pb-3 px-1 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'gap' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Target className="w-4 h-4" />
          <span>1. Skill Gap & Role Analysis</span>
          <span className="bg-rose-100 text-rose-800 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            {skillGapAnalysis.missingSkills.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('path')}
          className={`pb-3 px-1 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'path' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>2. Step-by-Step Learning Roadmaps</span>
          <span className="bg-indigo-100 text-indigo-800 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            {activeLearningPath.milestones.length} Milestones
          </span>
        </button>

        <button
          onClick={() => setActiveTab('mentors')}
          className={`pb-3 px-1 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'mentors' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>3. Recommended Mentors & Agendas</span>
          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.2 rounded-full font-black">
            {mentors.length} Available
          </span>
        </button>

        <button
          onClick={() => setActiveTab('improvement')}
          className={`pb-3 px-1 transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer ${
            activeTab === 'improvement' ? 'text-indigo-600 border-b-2 border-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>4. Progress & Improvement Suggestions</span>
        </button>
      </div>

      {/* TAB 1: Skill Gap & Role Analysis */}
      {activeTab === 'gap' && (
        <div className="space-y-6 animate-fade-in">
          {/* Overview Card */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Target className="w-6 h-6 text-indigo-600" />
                  <span>Skill Competency Breakdown for {skillGapAnalysis.targetRole.title}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  {skillGapAnalysis.targetRole.description}
                </p>
              </div>

              {/* Progress Bar Gauge */}
              <div className="w-full md:w-64 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span className="text-slate-600">Competency Match</span>
                  <span className="text-indigo-600">{skillGapAnalysis.matchScore}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${skillGapAnalysis.matchScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Missing Skills Alert Section */}
            {skillGapAnalysis.missingSkills.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    <span>Missing Critical Skills to Acquire ({skillGapAnalysis.missingSkills.length})</span>
                  </div>
                  <span className="text-xs text-slate-500">1-click add to your Learn List to trigger peer matches</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillGapAnalysis.missingSkills.map((gap, idx) => {
                    const isAdded = addedSkillsMap[gap.skillName];
                    return (
                      <div key={idx} className="bg-rose-50/60 border border-rose-200/80 p-4 rounded-2xl space-y-3 relative overflow-hidden flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-slate-900 text-sm">{gap.skillName}</span>
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                              {gap.importance}
                            </span>
                          </div>
                          <div className="text-xs text-slate-600">
                            Required: <strong className="text-slate-800">{gap.requiredLevel}</strong> • {gap.category}
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">
                            {gap.suggestedAction}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-rose-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => handleAddMissingSkill(gap)}
                            disabled={isAdded}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                              isAdded 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-xs'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added to Learn List</span>
                              </>
                            ) : (
                              <>
                                <BookOpen className="w-3.5 h-3.5" />
                                <span>Add to Learn List</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => {
                              setSelectedMentorAgendaSkill(gap.skillName);
                              setActiveTab('mentors');
                            }}
                            className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 cursor-pointer"
                          >
                            <span>Find Mentor</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* In-Progress Skills */}
            {skillGapAnalysis.inProgressSkills.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Skills In-Progress ({skillGapAnalysis.inProgressSkills.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillGapAnalysis.inProgressSkills.map((prog, idx) => (
                    <div key={idx} className="bg-amber-50/60 border border-amber-200/80 p-4 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">{prog.skillName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                          Current: {prog.currentLevel} → Goal: {prog.requiredLevel}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {prog.suggestedAction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mastered Skills */}
            {skillGapAnalysis.masteredSkills.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Mastered Skills Ready to Teach ({skillGapAnalysis.masteredSkills.length})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {skillGapAnalysis.masteredSkills.map((mast, idx) => (
                    <div key={idx} className="bg-emerald-50/50 border border-emerald-200/80 p-4 rounded-2xl space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-sm">{mast.skillName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {mast.currentLevel} Tier
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {mast.suggestedAction}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Step-by-Step Learning Roadmaps */}
      {activeTab === 'path' && (
        <div className="space-y-6 animate-fade-in">
          {/* Custom Roadmap Generator Input */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-indigo-600" />
                  <span>Interactive Learning Milestone Roadmap</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Goal: <strong className="text-slate-800">{activeLearningPath.targetRole}</strong> • {activeLearningPath.completedMilestones} of {activeLearningPath.milestones.length} Milestones Completed
                </p>
              </div>

              {/* Completion Progress Pill */}
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3.5 py-1.5 rounded-2xl text-xs font-bold text-indigo-900 shrink-0">
                <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                <span>
                  {Math.round((activeLearningPath.completedMilestones / (activeLearningPath.milestones.length || 1)) * 100)}% Milestone Progress
                </span>
              </div>
            </div>
          </div>

          {/* Milestone Step-by-Step Cards */}
          <div className="space-y-6">
            {activeLearningPath.milestones.map((ms, idx) => (
              <div 
                key={ms.id} 
                className={`bg-white border rounded-3xl p-6 sm:p-8 shadow-xs transition-all ${
                  ms.completed ? 'border-emerald-300/80 bg-emerald-50/20' : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                        Week {ms.weekNumber} Milestone
                      </span>
                      {ms.completed && (
                        <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Completed
                        </span>
                      )}
                    </div>
                    <h4 className="text-xl font-black text-slate-900 mt-1">
                      {ms.title}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {ms.summary}
                    </p>
                  </div>

                  <button
                    onClick={() => toggleMilestoneCompleted(ms.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer ${
                      ms.completed
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{ms.completed ? 'Mark as In-Progress' : 'Mark Milestone Complete'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6">
                  
                  {/* Left Column: Checkpoints */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                      <span>Actionable Checkpoints:</span>
                    </h5>
                    <div className="space-y-2">
                      {ms.checkpoints.map((cp, cIdx) => (
                        <div key={cIdx} className="flex items-start gap-2.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/70 text-xs text-slate-700 font-medium">
                          <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{cp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Middle Column: Curated Resources */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-indigo-600" />
                      <span>Curated Resources:</span>
                    </h5>
                    <div className="space-y-2">
                      {ms.resources.map(res => (
                        <a
                          key={res.id}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between bg-slate-50 hover:bg-indigo-50/50 p-3 rounded-xl border border-slate-200/80 transition-colors text-xs group"
                        >
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-indigo-600 block">
                              {res.title}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {res.type} • {res.estimatedMinutes} mins • {res.isFree ? 'Free' : 'Pro'}
                            </span>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 shrink-0 ml-2" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Hands-on Portfolio Project */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" />
                      <span>Hands-on Project Deliverable:</span>
                    </h5>
                    <div className="bg-gradient-to-br from-indigo-50/50 to-slate-50 p-4 rounded-2xl border border-indigo-200/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-slate-900 text-xs">{ms.project.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                          {ms.project.difficulty} • ~{ms.project.estimatedHours} hrs
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {ms.project.description}
                      </p>
                      <div className="pt-2 border-t border-indigo-100/80">
                        <span className="text-[10px] font-extrabold uppercase text-slate-500 block mb-1">
                          Key Deliverables:
                        </span>
                        <ul className="text-[11px] text-slate-700 space-y-1 list-disc list-inside">
                          {ms.project.deliverables.map((d, dIdx) => (
                            <li key={dIdx}>{d}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Recommended Mentors & Agendas */}
      {activeTab === 'mentors' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <BrainCircuit className="w-6 h-6 text-indigo-600" />
                <span>Recommended Peers & Mentors for {skillGapAnalysis.targetRole.title}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Peers with verified teaching records in your missing skills, complete with suggested discussion topics and pair-learning activities.
              </p>
            </div>

            {mentors.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <BrainCircuit className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No immediate mentors found for this specific filter</p>
                <p className="text-xs text-slate-500 mt-1">Try selecting another target role or browsing the Browse Skills directory.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {mentors.map((m, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 space-y-5">
                    {/* Mentor Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-900 flex items-center justify-center shrink-0 overflow-hidden font-black text-sm">
                          {hasUserPhoto(m.user.photo) ? (
                            <img src={m.user.photo} alt={m.user.name} className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-6 h-6 text-indigo-700" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-base">{m.user.name}</span>
                            {m.user.isVerifiedMentor && (
                              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-500 text-white flex items-center gap-1 shadow-xs">
                                <Award className="w-3 h-3 text-amber-100" /> Verified Mentor
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500">
                            {m.user.city} • {m.user.experienceLevel} Tier • <Star className="w-3 h-3 text-amber-500 inline fill-amber-500" /> {m.user.rating} ({m.user.totalReviews} reviews)
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                          <span className="text-xs font-black text-indigo-600 block">{m.matchScore}% Match</span>
                          <span className="text-[10px] text-slate-500 font-medium">Synergy Score</span>
                        </div>
                        <button
                          onClick={() => onSelectUserForSwap ? onSelectUserForSwap(m.user) : null}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Request Swap</span>
                        </button>
                      </div>
                    </div>

                    {/* Matched Gap Skills */}
                    <div className="flex items-center gap-2 flex-wrap text-xs">
                      <span className="font-extrabold text-slate-700">Teaches Gap Skills:</span>
                      {m.matchedGapSkills.map((sk, sIdx) => (
                        <span key={sIdx} className="bg-indigo-100 text-indigo-800 font-black px-2.5 py-0.5 rounded-full border border-indigo-200">
                          {sk}
                        </span>
                      ))}
                      <span className="text-slate-500 ml-auto text-[11px] font-medium">
                        Availability: <strong>{m.user.availability}</strong>
                      </span>
                    </div>

                    {/* Suggested Discussion Topics & Hands-on Activities */}
                    <div className="space-y-3 pt-2 border-t border-slate-200/80">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                        <Lightbulb className="w-4 h-4 text-indigo-600" />
                        <span>Tailored 1-on-1 Session Agendas & Discussion Topics:</span>
                      </span>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {m.suggestedAgendas.map((agenda, aIdx) => (
                          <div key={aIdx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2.5">
                            <div className="flex items-center justify-between">
                              <span className="font-extrabold text-slate-900 text-xs">{agenda.topic}</span>
                              <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                {agenda.duration}
                              </span>
                            </div>

                            <div className="text-xs text-indigo-900 bg-indigo-50/60 p-2 rounded-lg border border-indigo-100">
                              <span className="font-extrabold block text-[11px] text-indigo-800">Suggested Activity:</span>
                              {agenda.suggestedActivity}
                            </div>

                            <div className="space-y-1">
                              <span className="text-[10px] font-extrabold uppercase text-slate-500 block">
                                Recommended Icebreaker Questions:
                              </span>
                              <ul className="text-[11px] text-slate-600 space-y-0.5 list-disc list-inside">
                                {agenda.icebreakerQuestions.map((q, qIdx) => (
                                  <li key={qIdx}>{q}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Progress & Improvement Suggestions */}
      {activeTab === 'improvement' && (
        <div className="space-y-6 animate-fade-in">
          {/* Peer Rating Scorecard */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                  <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  <span>Peer Feedback & 5-Dimension Rating Breakdown</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Aggregated from all verified teaching exchanges and post-session peer ratings.
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex items-center gap-2 shrink-0">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <span className="text-xl font-black text-amber-900">{currentUser?.rating || 4.9}</span>
                <span className="text-xs text-amber-700 font-bold">Overall Rating</span>
              </div>
            </div>

            {/* 5-Factor Score Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {peerRatingFactors.map((factor, idx) => (
                <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800">{factor.name}</span>
                    <span className="text-indigo-600 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {factor.score} / 5.0
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber-500 rounded-full"
                      style={{ width: `${(factor.score / 5.0) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {factor.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable Personalized Improvement Suggestions */}
          <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                <span>Personalized Improvement Suggestions</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Targeted actions derived from your peer session metrics, teaching frequency, and market skill demands.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvementSuggestions.map((sug) => (
                <div key={sug.id} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                      {sug.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                      Urgency: {sug.urgency}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {sug.title}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sug.explanation}
                  </p>

                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-black uppercase text-indigo-600 block">
                      Recommended Action:
                    </span>
                    <p className="text-xs text-slate-800 font-medium leading-relaxed">
                      {sug.actionableStep}
                    </p>
                  </div>

                  <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Expected Impact: {sug.impactPotential}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
