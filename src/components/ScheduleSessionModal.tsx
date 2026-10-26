import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  X, Calendar, Clock, Video, MapPin, CheckCircle2, 
  ExternalLink, Sparkles, AlertCircle, ArrowRight, QrCode
} from 'lucide-react';
import { MeetingMode } from '../types';

interface ScheduleSessionModalProps {
  swapRequestId: string | null;
  onClose: () => void;
  onOpenQRModal?: (swapRequestId: string) => void;
}

export const ScheduleSessionModal: React.FC<ScheduleSessionModalProps> = ({
  swapRequestId,
  onClose,
  onOpenQRModal
}) => {
  const { 
    currentUser, swapRequests, users, sessions, 
    scheduleSession, sendChatMessage 
  } = useSkillSwap();

  // Get tomorrow's date formatted as YYYY-MM-DD
  const getTomorrowDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  };

  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [date, setDate] = useState(getTomorrowDate());
  const [time, setTime] = useState('10:00 AM');
  const [customLink, setCustomLink] = useState('');
  const [agenda, setAgenda] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!swapRequestId || !currentUser) return null;

  const activeRequest = swapRequests.find(r => r.id === swapRequestId);
  if (!activeRequest) return null;

  const partnerId = activeRequest.senderId === currentUser.id 
    ? activeRequest.receiverId 
    : activeRequest.senderId;
  const partner = users.find(u => u.id === partnerId);

  // Existing sessions for this swap
  const existingSessions = sessions.filter(s => s.swapRequestId === swapRequestId);

  // Default Google Meet URL
  const defaultGoogleMeetUrl = activeRequest.zoomLink && activeRequest.zoomLink.includes('meet.google.com')
    ? activeRequest.zoomLink
    : `https://meet.google.com/skw-${swapRequestId.substring(0, 4)}-${Math.random().toString(36).substring(2, 6)}`;

  const activeMeetLink = customLink.trim() || defaultGoogleMeetUrl;

  const handleQuickPreset = (presetDate: string, presetTime: string) => {
    setDate(presetDate);
    setTime(presetTime);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) return;

    const locationOrLink = activeMeetLink;

    // Call scheduleSession from context with Online Google Meet link
    scheduleSession(
      swapRequestId,
      date,
      time,
      'Online',
      locationOrLink
    );

    // Send formatted Google Meet schedule card into chat
    if (partnerId) {
      sendChatMessage(
        swapRequestId,
        partnerId,
        `📅 Google Meet Session Confirmed!\nDate: ${date}\nTime: ${time}\nTopic: ${agenda || `${activeRequest.teachSkill} Skill Swap`}\n\nClick below to join the Google Meet session:`,
        [{
          name: 'Join Google Meet Session',
          url: locationOrLink,
          type: 'zoom'
        }]
      );
    }

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  const handleLaunchGoogleMeetNow = () => {
    window.open(activeMeetLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/90 bg-gradient-to-r from-blue-50/80 via-white to-emerald-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">
                Schedule Google Meet Session
              </h2>
              <p className="text-xs text-slate-500">
                Partner: <strong className="text-slate-800">{partner?.name || 'Swap Partner'}</strong> ({activeRequest.teachSkill} ↔ {activeRequest.learnSkill})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 text-slate-800 text-xs sm:text-sm">

          {/* Success Feedback Overlay */}
          {isSuccess ? (
            <div className="py-12 text-center space-y-3 animate-fade-in">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Google Meet Session Scheduled!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Session details and your Google Meet link have been added to your timetable and sent to {partner?.name}.
              </p>
            </div>
          ) : (
            <>
              {/* Quick Presets */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Quick Pick Presets
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(getTodayDate(), '05:00 PM')}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs border border-blue-200 transition-colors cursor-pointer"
                  >
                    ⚡ Today, 5:00 PM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(getTomorrowDate(), '10:00 AM')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                  >
                    🌅 Tomorrow, 10:00 AM
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPreset(getTomorrowDate(), '04:00 PM')}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
                  >
                    ☕ Tomorrow, 4:00 PM
                  </button>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Date and Time Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Date</span>
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={getTodayDate()}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-medium outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Time</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10:00 AM or 18:30"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-medium outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Google Meet Link Field */}
                <div className="space-y-2 bg-emerald-50/70 border border-emerald-200 p-3.5 rounded-xl">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Google Meet Video Link</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleLaunchGoogleMeetNow}
                      className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-1 cursor-pointer"
                      title="Test Google Meet link in new tab"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Test Google Meet</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="url"
                      value={customLink || defaultGoogleMeetUrl}
                      onChange={(e) => setCustomLink(e.target.value)}
                      placeholder="https://meet.google.com/..."
                      className="flex-1 bg-white border border-emerald-300 focus:border-emerald-600 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newCode = `https://meet.google.com/skw-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
                        setCustomLink(newCode);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-100 text-emerald-800 text-[11px] font-semibold border border-emerald-300 shrink-0 cursor-pointer"
                      title="Generate fresh Google Meet link"
                    >
                      New Link
                    </button>
                  </div>
                  <p className="text-[10px] text-emerald-800 leading-tight">
                    ✓ Google Meet room link will be saved to your timetable and sent to {partner?.name} with 1-click access.
                  </p>
                </div>

                {/* Agenda / Topic */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Topic / Session Goals (Optional)</label>
                  <input
                    type="text"
                    placeholder={`e.g. Practicing ${activeRequest.teachSkill} fundamentals & project review`}
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 focus:border-blue-600 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    <span>Schedule Google Meet</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </form>

              {/* Already Scheduled Sessions List */}
              {existingSessions.length > 0 && (
                <div className="pt-3 border-t border-slate-200 space-y-2">
                  <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center justify-between">
                    <span>Existing Scheduled Sessions ({existingSessions.length})</span>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {existingSessions.map(ses => (
                      <div 
                        key={ses.id}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2 text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-900 block">{ses.date} at {ses.time}</span>
                          <span className="text-[10px] text-slate-500 truncate block max-w-[200px]">{ses.locationOrLink}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {ses.locationOrLink.startsWith('http') && (
                            <a
                              href={ses.locationOrLink}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold flex items-center gap-1"
                            >
                              <Video className="w-3 h-3" />
                              <span>Join Meet</span>
                            </a>
                          )}
                          {onOpenQRModal && (
                            <button
                              type="button"
                              onClick={() => {
                                onClose();
                                onOpenQRModal(swapRequestId);
                              }}
                              className="px-2 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <QrCode className="w-3 h-3" />
                              <span>QR</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
};
