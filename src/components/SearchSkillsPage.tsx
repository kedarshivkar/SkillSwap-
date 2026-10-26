import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  Search, Filter, Sparkles, Star, MapPin, CheckCircle2, 
  Send, User, ArrowRightLeft, HeartHandshake, Shield, Info, Award
} from 'lucide-react';
import { User as UserType, hasUserPhoto } from '../types';
import { AIMatchSection } from './AIMatchSection';

interface SearchSkillsPageProps {
  onSelectUserForSwap: (user: UserType) => void;
  onOpenUserProfile: (user: UserType) => void;
}

export const SearchSkillsPage: React.FC<SearchSkillsPageProps> = ({ 
  onSelectUserForSwap, onOpenUserProfile 
}) => {
  const { users, currentUser, calculateMatch } = useSkillSwap();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'perfect' | 'teach' | 'learn'>('all');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<string>('All');

  const otherUsers = users.filter(u => u.id !== currentUser?.id && !u.isAdmin);

  const filteredUsers = otherUsers.filter(user => {
    // Search query match
    const searchLower = searchTerm.toLowerCase();
    const matchesQuery = !searchTerm || 
      user.name.toLowerCase().includes(searchLower) ||
      user.city.toLowerCase().includes(searchLower) ||
      user.teachSkills.some(s => s.skillName.toLowerCase().includes(searchLower)) ||
      user.learnSkills.some(s => s.skillName.toLowerCase().includes(searchLower));

    // City filter
    const matchesCity = selectedCity === 'All' || user.city === selectedCity;

    // Mode filter
    const matchesMode = selectedMode === 'All' || user.mode === selectedMode;

    // Filter type (e.g. Perfect match)
    if (filterType === 'perfect' && currentUser) {
      const m = calculateMatch(currentUser, user);
      if (!m.isPerfectMatch) return false;
    }

    return matchesQuery && matchesCity && matchesMode;
  });

  const cities = ['All', ...Array.from(new Set(otherUsers.map(u => u.city)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 rounded-2xl shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" /> Matchmaker Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif]">Search Skills & Find Swap Partners</h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Browse members teaching what you want to learn or learning what you can teach.
          </p>
        </div>

        {currentUser && (
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center gap-3 text-xs">
            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-slate-400 text-[11px]">Your Goal Matcher:</div>
              <div className="font-bold text-slate-800">
                Teach {currentUser.teachSkills[0]?.skillName || 'Skills'} ↔ Learn {currentUser.learnSkills[0]?.skillName || 'Skills'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200/80 p-4 sm:p-5 rounded-2xl space-y-4 shadow-xs">
        
        {/* Search Input */}
        <div className="space-y-2">
          <div className="relative flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
              <input
                type="text"
                placeholder="Type any skill (e.g. Python, Guitar, Photoshop, Excel, Cooking, French)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-28 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 transition-all font-medium"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-3 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200/70 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Quick Skill Shortcuts */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
            <span className="font-semibold text-slate-700 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" /> Popular Skills:
            </span>
            {['Python', 'Guitar', 'Photoshop', 'French', 'Excel', 'Cooking', 'React'].map((skill) => (
              <button
                key={skill}
                onClick={() => setSearchTerm(skill)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  searchTerm.toLowerCase() === skill.toLowerCase()
                    ? 'bg-blue-600 text-white shadow-xs font-bold'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-100 text-xs">
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                filterType === 'all' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
              }`}
            >
              All Members ({otherUsers.length})
            </button>

            {currentUser && (
              <button
                onClick={() => setFilterType('perfect')}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                  filterType === 'perfect' 
                    ? 'bg-emerald-600 text-white shadow-xs font-bold' 
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>100% Perfect Matches Only</span>
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-slate-600">
            {/* City Dropdown */}
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-800 focus:outline-none focus:border-blue-600"
              >
                {cities.map(c => <option key={c} value={c} className="bg-white text-slate-800">{c}</option>)}
              </select>
            </div>

            {/* Mode Indicator */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg text-blue-700 font-semibold border border-blue-200">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span>100% Online Exchange</span>
            </div>
          </div>

        </div>

      </div>

      {/* AI Skill Match Recommendation Section - Only shown when user enters/searches a skill */}
      {searchTerm.trim().length > 0 && (
        <AIMatchSection 
          onSelectUserForSwap={onSelectUserForSwap}
          onOpenUserProfile={onOpenUserProfile}
          searchTerm={searchTerm}
        />
      )}

      {/* Results Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 space-y-3 shadow-xs">
          <Info className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Matching Members Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search keywords or switching filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const matchInfo = currentUser ? calculateMatch(currentUser, user) : null;
            const isPerfect = matchInfo?.isPerfectMatch;

            return (
              <div 
                key={user.id}
                className={`bg-white border ${
                  isPerfect ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-md' : 'border-slate-200/80 hover:border-slate-300 shadow-xs'
                } rounded-2xl p-5 space-y-4 flex flex-col justify-between relative transition-all group`}
              >
                {/* Perfect Match Badge Header */}
                {isPerfect && (
                  <div className="absolute -top-3 left-4 bg-blue-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-white" /> 100% Perfect Match
                  </div>
                )}

                <div className="space-y-3">
                  
                  {/* Top Info */}
                  <div className="flex items-start justify-between gap-3 pt-1">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                        {hasUserPhoto(user.photo) ? (
                          <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 
                            onClick={() => onOpenUserProfile(user)}
                            className="font-bold text-slate-900 text-base hover:text-blue-600 hover:underline cursor-pointer transition-colors"
                          >
                            {user.name}
                          </h3>
                          {user.isVerified && (
                            <CheckCircle2 className="w-4 h-4 text-blue-600" title="Verified Member" />
                          )}
                          {user.isVerifiedMentor && (
                            <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-2xs">
                              <Award className="w-3 h-3 text-amber-100" /> Mentor
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                          <span>{user.city}</span>
                          <span>•</span>
                          <span className="text-blue-600 font-bold">{user.mode}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg text-amber-700 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{user.rating}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({user.totalReviews})</span>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {user.bio}
                  </p>

                  {/* Match Explanation */}
                  {matchInfo && matchInfo.score > 0 && (
                    <div className={`p-2.5 rounded-xl text-xs font-medium border ${
                      isPerfect 
                        ? 'bg-blue-50/60 border-blue-200 text-slate-700' 
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}>
                      {matchInfo.reason}
                    </div>
                  )}

                  {/* Can Teach Section */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Can Teach:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {user.teachSkills.map(sk => (
                        <span 
                          key={sk.id}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200"
                        >
                          {sk.skillName} ({sk.level})
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Wants to Learn Section */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Wants to Learn:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {user.learnSkills.map(sk => (
                        <span 
                          key={sk.id}
                          className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200"
                        >
                          {sk.skillName} ({sk.level})
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onOpenUserProfile(user)}
                    className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => onSelectUserForSwap(user)}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Swap Request</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
