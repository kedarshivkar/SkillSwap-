import React from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  Calendar, Clock, Video, MapPin, QrCode, CheckCircle2, 
  Award, Sparkles, User, ExternalLink, TrendingUp 
} from 'lucide-react';

interface CalendarSchedulePageProps {
  onOpenQRModal: (swapRequestId: string) => void;
  onOpenRatingModal: (sessionId: string) => void;
}

export const CalendarSchedulePage: React.FC<CalendarSchedulePageProps> = ({ 
  onOpenQRModal, onOpenRatingModal 
}) => {
  const { sessions, currentUser, users, confirmSessionAttendance, setActiveView } = useSkillSwap();

  if (!currentUser) return null;

  const mySessions = sessions.filter(s => s.teacherId === currentUser.id || s.learnerId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="bg-white border border-slate-200/90 p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-slate-900" /> Schedule & Timetable
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Your Skill Exchange Sessions</h1>
          <p className="text-xs text-slate-600">View upcoming scheduled swap meetings, generate QR attendance codes, and confirm completed sessions.</p>
        </div>

        <button
          onClick={() => setActiveView('progress')}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
        >
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <span>View Progress & Ratings</span>
        </button>
      </div>

      {/* Sessions List */}
      {mySessions.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/90 rounded-2xl p-8 space-y-3 shadow-sm">
          <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Sessions Scheduled Yet</h3>
          <p className="text-xs text-slate-500">Go to Messages to pick a date and schedule your first skill swap session!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {mySessions.map(ses => {
            const isTeacher = ses.teacherId === currentUser.id;
            const otherUserId = isTeacher ? ses.learnerId : ses.teacherId;
            const partner = users.find(u => u.id === otherUserId);

            return (
              <div 
                key={ses.id}
                className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  
                  {/* Status & Date */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                      <Clock className="w-4 h-4 text-slate-700" />
                      <span>{ses.date} at {ses.time}</span>
                    </div>

                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      ses.status === 'Completed' 
                        ? 'bg-slate-900 text-white border-slate-900' 
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                    }`}>
                      {ses.status}
                    </span>
                  </div>

                  {/* Partner Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-xs">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{partner?.name}</h3>
                      <p className="text-xs text-slate-500">
                        Role: {isTeacher ? 'You are Teaching' : 'You are Learning'}
                      </p>
                    </div>
                  </div>

                  {/* Skill Name */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Topic:</div>
                    <div className="font-bold text-slate-900 text-sm">{ses.skillName}</div>
                  </div>

                  {/* Location or Video Link */}
                  <div className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2 truncate">
                      <Video className="w-4 h-4 text-slate-800 shrink-0" />
                      <span className="truncate">{ses.locationOrLink}</span>
                    </div>
                    {ses.locationOrLink.startsWith('http') && (
                      <a 
                        href={ses.locationOrLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-slate-900 font-bold hover:underline flex items-center gap-1 shrink-0 ml-2"
                      >
                        <span>Join</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                </div>

                {/* Session Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                  
                  {/* QR Code trigger */}
                  <button
                    onClick={() => onOpenQRModal(ses.swapRequestId)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 text-xs font-semibold border border-slate-300 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <QrCode className="w-4 h-4 text-slate-800" />
                    <span>QR Attendance</span>
                  </button>

                  {/* Complete & Rate */}
                  {ses.status !== 'Completed' ? (
                    <button
                      onClick={() => onOpenRatingModal(ses.id)}
                      className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete & Rate</span>
                    </button>
                  ) : (
                    <div className="flex-1 py-2 text-center text-xs font-bold text-slate-900 bg-slate-100 rounded-xl border border-slate-300">
                      ✓ Certificate Issued
                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
