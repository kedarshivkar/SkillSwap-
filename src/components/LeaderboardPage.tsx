import React from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  Trophy, Medal, Star, Flame, Award, CheckCircle2, Shield, User 
} from 'lucide-react';
import { hasUserPhoto } from '../types';

export const LeaderboardPage: React.FC = () => {
  const { users } = useSkillSwap();

  // Sort users by rating & total reviews
  const topTeachers = [...users]
    .filter(u => !u.isAdmin)
    .sort((a, b) => (b.rating * b.totalReviews) - (a.rating * a.totalReviews));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-xs space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
          <Trophy className="w-4 h-4 text-blue-600" /> Community Leaderboard
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Top Skill Mentors & Knowledge Swappers</h1>
        <p className="text-xs text-slate-600">Recognizing members with the highest community trust ratings and completed sessions.</p>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {topTeachers.slice(0, 3).map((user, idx) => {
          const rankColors = [
            'bg-amber-50/80 border-amber-300 text-amber-900',
            'bg-slate-50 border-slate-300 text-slate-800',
            'bg-orange-50/80 border-orange-200 text-orange-900'
          ];

          return (
            <div 
              key={user.id}
              className={`${rankColors[idx]} border p-6 rounded-2xl shadow-sm flex flex-col items-center text-center space-y-3 relative`}
            >
              <div className="absolute top-4 left-4 w-7 h-7 rounded-full bg-white font-black text-xs flex items-center justify-center border border-slate-200 shadow-xs text-slate-800">
                #{idx + 1}
              </div>

              <div className="w-14 h-14 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-xs overflow-hidden shrink-0">
                {hasUserPhoto(user.photo) ? (
                  <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-7 h-7" />
                )}
              </div>
              
              <div>
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-base">{user.name}</h3>
                  {user.isVerified && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  {user.isVerifiedMentor && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[9px] flex items-center gap-1 shadow-2xs">
                      <Award className="w-3 h-3 text-amber-100" /> Mentor
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500">{user.city}</p>
              </div>

              <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-bold text-amber-800 border border-slate-200 shadow-xs">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <span>{user.rating} ({user.totalReviews} reviews)</span>
              </div>

              <div className="text-[11px] text-slate-600 font-medium">
                Top Skill: <span className="text-slate-900 font-bold">{user.teachSkills[0]?.skillName || 'General'}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Rankings Table */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Monthly Member Rankings</h2>

        <div className="space-y-2">
          {topTeachers.map((user, idx) => (
            <div 
              key={user.id} 
              className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-400 w-6 text-center">#{idx + 1}</span>
                <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 overflow-hidden">
                  {hasUserPhoto(user.photo) ? (
                    <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <div className="font-bold text-slate-900 flex items-center gap-1">
                    <span>{user.name}</span>
                    {user.isVerified && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                    {user.isVerifiedMentor && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[9px] flex items-center gap-0.5">
                        <Award className="w-3 h-3 text-amber-100" /> Mentor
                      </span>
                    )}
                  </div>
                  <div className="text-slate-500 text-[10px]">{user.city}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <div className="text-slate-900 font-bold">{user.teachSkills[0]?.skillName || 'Mentor'}</div>
                  <div className="text-slate-400 text-[10px]">Primary Skill</div>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg text-amber-800 font-bold border border-amber-200">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{user.rating}</span>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
