import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  Send, Video, Calendar, QrCode, 
  CheckCheck, User, Phone, Mail,
  XCircle, GraduationCap, CheckCircle2,
  ArrowLeftRight, AlertTriangle, ShieldAlert,
  PhoneCall, Copy, Check, ExternalLink, Sparkles,
  Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { ReportProblemModal } from './ReportProblemModal';
import { VideoMeetingModal } from './VideoMeetingModal';
import { hasUserPhoto } from '../types';

interface ChatPageProps {
  onOpenScheduleModal: (swapRequestId: string) => void;
  onOpenQRModal: (swapRequestId: string) => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ 
  onOpenScheduleModal, onOpenQRModal 
}) => {
  const { 
    currentUser, swapRequests, chatMessages, sendChatMessage, users,
    cancelSwapRequest, requestDoneLearning, confirmDoneLearning
  } = useSkillSwap();

  if (!currentUser) return null;

  // Filter active swap requests (Pending, Accepted or Completed)
  const activeChatRequests = swapRequests.filter(r => 
    (r.senderId === currentUser.id || r.receiverId === currentUser.id) &&
    r.status !== 'Rejected'
  );

  const [activeRequestId, setActiveRequestId] = useState<string>(
    activeChatRequests[0]?.id || ''
  );
  const [inputMessage, setInputMessage] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | undefined>(undefined);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [showPartnerDetails, setShowPartnerDetails] = useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-select first request when data loads or if current activeRequestId is invalid
  React.useEffect(() => {
    if (activeChatRequests.length > 0) {
      const exists = activeChatRequests.some(r => r.id === activeRequestId);
      if (!exists || !activeRequestId) {
        setActiveRequestId(activeChatRequests[0].id);
      }
    } else if (activeRequestId !== '') {
      setActiveRequestId('');
    }
  }, [activeChatRequests, activeRequestId]);

  React.useEffect(() => {
    scrollToBottom();
  }, [chatMessages, activeRequestId]);

  const activeRequest = swapRequests.find(r => r.id === activeRequestId);
  const partnerId = activeRequest 
    ? (activeRequest.senderId === currentUser.id ? activeRequest.receiverId : activeRequest.senderId)
    : null;
  const partner = users.find(u => u.id === partnerId);

  const activeMessages = chatMessages.filter(m => m.swapRequestId === activeRequestId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeRequestId || !partnerId) return;

    sendChatMessage(activeRequestId, partnerId, inputMessage.trim());
    setInputMessage('');
  };

  const handleStartLiveVideoCall = (customUrl?: string) => {
    if (!activeRequestId || !partnerId) return;
    const roomCode = Math.random().toString(36).substring(2, 8);
    const zoomUrl = customUrl || `https://meet.google.com/skillswap-${roomCode}`;
    
    setActiveVideoUrl(zoomUrl);
    setIsVideoModalOpen(true);

    sendChatMessage(
      activeRequestId, 
      partnerId, 
      `📹 I started a SkillSwap Live Video Call! Click below to join the session:`, 
      [{ name: 'Join Live Video Call Room', url: zoomUrl, type: 'zoom' }]
    );
  };

  const handleJoinGoogleMeet = () => {
    if (!activeRequestId || !partnerId) return;
    const meetUrl = activeRequest?.zoomLink && activeRequest.zoomLink.includes('meet.google.com')
      ? activeRequest.zoomLink
      : `https://meet.google.com/skw-${activeRequestId.substring(0, 4)}-${Math.random().toString(36).substring(2, 6)}`;

    // 1-Click Launch Google Meet directly in new window
    window.open(meetUrl, '_blank', 'noopener,noreferrer');

    // Post to chat so partner also has instant 1-click join card
    sendChatMessage(
      activeRequestId,
      partnerId,
      `🟢 I opened a Google Meet session! Click below to join the room in 1-click:`,
      [{ name: 'Join Google Meet Room (1-Click)', url: meetUrl, type: 'zoom' }]
    );
  };

  const handleGenerateZoomLink = () => {
    handleStartLiveVideoCall();
  };

  const handleCancelSwap = () => {
    if (!activeRequestId) return;
    if (confirm('Are you sure you want to cancel this swap request?')) {
      cancelSwapRequest(activeRequestId);
    }
  };

  return (
    <div className="w-full max-w-full h-full max-h-full flex-1 min-h-0 px-1 sm:px-3 lg:px-4 py-1 sm:py-2 flex flex-col overflow-hidden">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12 flex-1 h-full max-h-full min-h-0">
        
        {/* Left Sidebar: Active Swap Partner Conversations */}
        <div className={`md:col-span-4 lg:col-span-3 border-r border-slate-200/90 p-3 sm:p-3.5 space-y-3 bg-slate-50 overflow-y-auto h-full min-h-0 ${mobileShowChat ? 'hidden md:block' : 'block'}`}>
          <div className="font-bold text-slate-900 text-xs sm:text-sm border-b border-slate-200 pb-2.5 flex justify-between items-center">
            <div className="flex items-center gap-2.5 truncate">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-sm shrink-0 border border-amber-300 ring-2 ring-amber-400/20">
                <ArrowLeftRight className="w-4.5 h-4.5 stroke-[2.5] drop-shadow-xs" />
              </div>
              <span className="truncate font-serif text-sm font-bold tracking-tight text-slate-900">
                Skill<span className="text-amber-600 font-sans font-extrabold">Swap</span> Messages
              </span>
            </div>
            <span className="text-[10px] text-amber-900 font-bold bg-amber-100 border border-amber-300/80 px-2 py-0.5 rounded-full shrink-0">{activeChatRequests.length} Active</span>
          </div>

          {activeChatRequests.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-10">
              No active swaps yet. Send or accept a proposal in your dashboard to start chatting!
            </p>
          ) : (
            <div className="space-y-2">
              {activeChatRequests.map(req => {
                const otherId = req.senderId === currentUser.id ? req.receiverId : req.senderId;
                const otherUser = users.find(u => u.id === otherId);
                const isSelected = req.id === activeRequestId;

                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      setActiveRequestId(req.id);
                      setMobileShowChat(true);
                    }}
                    className={`p-2.5 rounded-xl cursor-pointer transition-all flex items-center gap-2.5 border ${
                      isSelected 
                        ? 'bg-slate-200/90 border-slate-400 text-slate-900 font-bold shadow-xs' 
                        : 'bg-white hover:bg-slate-100/80 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-xs overflow-hidden">
                      {hasUserPhoto(otherUser?.photo) ? (
                        <img src={otherUser!.photo} alt={otherUser!.name} className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-4 h-4 text-slate-600" />
                      )}
                    </div>
                    <div className="flex-1 truncate">
                      <div className="font-bold text-xs truncate flex items-center justify-between gap-1">
                        <span className="truncate">{otherUser?.name || 'Swap Partner'}</span>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {req.status === 'Completed' && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-100 text-indigo-800 font-bold">Done</span>
                          )}
                          {req.status === 'Pending' && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-bold">Wait</span>
                          )}
                          {req.status === 'Accepted' && (
                            <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 font-bold">Active</span>
                          )}
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {req.teachSkill} ↔ {req.learnSkill}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Messenger Area */}
        <div className={`md:col-span-8 lg:col-span-9 flex flex-col h-full min-h-0 bg-white overflow-hidden ${!mobileShowChat ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Top Header Controls (Compact) */}
          {partner && activeRequest ? (
            <div className="shrink-0 border-b border-slate-200/90 bg-white shadow-2xs">
              {/* Mobile Back Button Bar */}
              <div className="md:hidden bg-slate-100 border-b border-slate-200 px-3 py-1 flex items-center justify-between">
                <button
                  onClick={() => setMobileShowChat(false)}
                  className="text-[11px] font-bold text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  ← Back to Conversations
                </button>
              </div>

              <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1.5 bg-slate-50">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white border border-slate-200 text-slate-800 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden">
                    {hasUserPhoto(partner.photo) ? (
                      <img src={partner.photo} alt={partner.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1 truncate">
                      <span className="truncate">{partner.name}</span>
                      <span className="text-[8px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 shrink-0">
                        {activeRequest.status === 'Completed' ? 'Completed' : 'Active Partner'}
                      </span>
                    </h3>
                    <div className="text-[10px] text-slate-500 font-medium truncate leading-none">
                      {activeRequest.teachSkill} ↔ {activeRequest.learnSkill}
                    </div>
                  </div>
                </div>

                {/* Action Toolbar */}
                <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  {/* Schedule Session Button */}
                  <button
                    onClick={() => onOpenScheduleModal(activeRequestId)}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold border border-blue-200 flex items-center gap-1 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                    title="Schedule date & time for session"
                  >
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Schedule</span>
                  </button>

                  {/* QR Attendance Verification Button */}
                  <button
                    onClick={() => onOpenQRModal(activeRequestId)}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 flex items-center gap-1 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                    title="Open QR Attendance pass & camera verification"
                  >
                    <QrCode className="w-3.5 h-3.5 text-amber-700" />
                    <span>QR</span>
                  </button>

                  {/* Video Call */}
                  <button
                    onClick={() => handleStartLiveVideoCall()}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
                    title="Start Live Video Call with Partner"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <Video className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Video Call</span>
                  </button>

                  {/* Done Learning Button (when active & not yet requested) */}
                  {activeRequest.status === 'Accepted' && !activeRequest.completionRequestedBy && (
                    <button
                      onClick={() => requestDoneLearning(activeRequestId)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 flex items-center gap-1 transition-colors cursor-pointer active:scale-95 shadow-2xs"
                      title="Finished learning? Request completion certificate"
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="hidden md:inline">Done Learning</span>
                    </button>
                  )}

                  {/* Toggle Details Dropdown */}
                  <button
                    onClick={() => setShowPartnerDetails(!showPartnerDetails)}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border flex items-center gap-1 transition-colors cursor-pointer shadow-2xs ${
                      showPartnerDetails 
                        ? 'bg-slate-200 text-slate-800 border-slate-300' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border-slate-200'
                    }`}
                    title={showPartnerDetails ? 'Hide details' : 'Show partner contact & course info'}
                  >
                    <Info className="w-3 h-3 text-slate-500" />
                    <span className="hidden sm:inline">Details</span>
                    {showPartnerDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {/* Report Problem */}
                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="p-1 sm:px-2 sm:py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold border border-rose-200 flex items-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    title="Report a problem to admin"
                  >
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                  </button>
                </div>
              </div>

              {/* State 3: Teacher receiving completion request - High Priority Bar */}
              {activeRequest.completionRequestedBy && activeRequest.completionRequestedBy !== currentUser.id && activeRequest.status !== 'Completed' && (
                <div className="bg-amber-50 border-t border-amber-300 px-3 py-1.5 text-[11px] flex items-center justify-between gap-2">
                  <span className="font-bold text-amber-900 flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-amber-600" />
                    {partner.name} requested completion confirmation
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => confirmDoneLearning(activeRequestId, true)}
                      className="px-2.5 py-0.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Confirm Completion</span>
                    </button>
                    <button
                      onClick={() => confirmDoneLearning(activeRequestId, false)}
                      className="px-2 py-0.5 rounded bg-white text-slate-700 font-semibold text-[10px] border border-slate-300 cursor-pointer"
                    >
                      Needs Practice
                    </button>
                  </div>
                </div>
              )}

              {/* Collapsible Partner Contact Info & Detailed Status */}
              {showPartnerDetails && (
                <div className="bg-slate-50 border-t border-slate-200 p-2 text-xs space-y-1.5 animate-in fade-in duration-150">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                    <div className="flex flex-wrap items-center gap-2 text-slate-900 font-mono text-[10px] font-semibold">
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <Phone className="w-3 h-3 text-indigo-600" />
                        <span>{partner.phone || '+91 98201 54321'}</span>
                      </div>
                      <div className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        <Mail className="w-3 h-3 text-indigo-600" />
                        <span>{partner.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={handleCancelSwap}
                      className="px-2 py-0.5 rounded bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-[10px] border border-rose-200 flex items-center gap-1 transition-colors cursor-pointer"
                      title="Cancel Request"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Cancel Swap</span>
                    </button>
                  </div>

                  {activeRequest.status === 'Completed' && (
                    <div className="bg-emerald-50 border border-emerald-200 p-1.5 rounded-lg text-[10px] flex items-center gap-1.5 text-emerald-900 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>🎉 <strong>Skill Swap Completed!</strong> Both members have successfully exchanged skills.</span>
                    </div>
                  )}

                  {activeRequest.completionRequestedBy === currentUser.id && activeRequest.status !== 'Completed' && (
                    <div className="bg-indigo-50/90 border border-indigo-200 p-1.5 rounded-lg text-[10px] flex items-center gap-1.5 text-indigo-950 font-medium">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                      <span><strong>Done Learning Requested:</strong> Awaiting {partner.name} to confirm the whole skill was taught.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center gap-2 text-slate-500 border-b border-slate-200 bg-slate-50/50">
              <div className="text-xl font-black tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                Skill<span className="text-blue-600">Swap</span>
              </div>
              <span className="font-semibold text-slate-600 text-xs">Select a conversation to start chatting</span>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-2.5 bg-slate-50/40 flex flex-col justify-start">
            {activeMessages.length === 0 ? (
              <div className="text-center py-8 sm:py-12 text-slate-500 text-xs space-y-2.5 flex flex-col items-center justify-center">
                <div className="text-2xl font-black tracking-tight text-slate-900 font-['Outfit',sans-serif] my-1">
                  Skill<span className="text-blue-600">Swap</span>
                </div>
                <p className="font-bold text-slate-800 text-xs sm:text-sm">Start your SkillSwap exchange!</p>
                <p className="text-slate-500 text-[11px] max-w-xs">Discuss timing, Google Meet links, and session topics with your partner.</p>
              </div>
            ) : (
              activeMessages.map(m => {
                const isMe = m.senderId === currentUser.id;
                return (
                  <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[82%] sm:max-w-[72%] rounded-2xl p-2.5 sm:p-3 text-xs sm:text-sm space-y-1 shadow-2xs ${
                      isMe 
                        ? 'bg-blue-600 text-white font-medium rounded-tr-none border border-blue-500/40' 
                        : 'bg-white text-slate-900 rounded-tl-none border border-slate-200/90'
                    }`}>
                      {/* Sender Header Label */}
                      <div className={`text-[11px] sm:text-xs font-bold border-b pb-0.5 mb-1 flex items-center justify-between ${
                        isMe ? 'text-blue-100 border-blue-400/30' : 'text-blue-700 border-slate-100'
                      }`}>
                        <span>{isMe ? 'You (Sent)' : (partner?.name || 'Partner')}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-blue-200" />}
                      </div>

                      <p className="leading-relaxed whitespace-pre-wrap text-xs sm:text-sm font-normal">{m.message}</p>

                      {/* Attachments & Interactive Video Call Card */}
                      {m.attachments && m.attachments.length > 0 && (
                        <div className="space-y-2 pt-1.5">
                          {m.attachments.map((att, i) => {
                            const isVideoCall = att.type === 'zoom' || att.type === 'video' || att.url.includes('meet.google.com') || att.name.toLowerCase().includes('video') || att.name.toLowerCase().includes('meet');
                            const isCopied = copiedMsgId === `${m.id}_${i}`;

                            if (isVideoCall) {
                              return (
                                <div
                                  key={i}
                                  className={`p-3 rounded-xl border space-y-2.5 transition-all shadow-xs ${
                                    isMe 
                                      ? 'bg-indigo-700/90 text-white border-indigo-400/50 shadow-indigo-900/30' 
                                      : 'bg-gradient-to-br from-indigo-50/90 via-white to-emerald-50/40 text-slate-900 border-indigo-200'
                                  }`}
                                >
                                  {/* Call Card Header */}
                                  <div className="flex items-center justify-between gap-2 border-b border-white/20 pb-1.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                                        <Video className="w-3.5 h-3.5" />
                                      </div>
                                      <div>
                                        <span className="font-bold text-xs block leading-tight">SkillSwap Live Video Call</span>
                                        <span className={`text-[10px] font-medium ${isMe ? 'text-indigo-200' : 'text-slate-500'}`}>
                                          Session: {activeRequest?.teachSkill} ↔ {activeRequest?.learnSkill}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-extrabold flex items-center gap-1 shadow-2xs">
                                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                      Live Room
                                    </span>
                                  </div>

                                  {/* Action Buttons inside Message */}
                                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setActiveVideoUrl(att.url);
                                        setIsVideoModalOpen(true);
                                      }}
                                      className={`px-3 py-1.5 rounded-lg font-black text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer active:scale-95 ${
                                        isMe 
                                          ? 'bg-white text-indigo-700 hover:bg-indigo-50' 
                                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                      }`}
                                    >
                                      <Video className="w-3.5 h-3.5" />
                                      <span>Join Video Call (In-App)</span>
                                    </button>

                                    <a
                                      href={att.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-colors shadow-2xs ${
                                        isMe 
                                          ? 'bg-emerald-500 hover:bg-emerald-400 text-white border-emerald-400' 
                                          : 'bg-[#00796B] hover:bg-[#00695C] text-white border-[#00695C]'
                                      }`}
                                      title="1-Click Open Google Meet in new tab"
                                    >
                                      <ExternalLink className="w-3.5 h-3.5" />
                                      <span>Join Google Meet (1-Click)</span>
                                    </a>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        navigator.clipboard.writeText(att.url);
                                        setCopiedMsgId(`${m.id}_${i}`);
                                        setTimeout(() => setCopiedMsgId(null), 2000);
                                      }}
                                      className={`p-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                                        isMe 
                                          ? 'bg-indigo-800/80 hover:bg-indigo-800 text-indigo-200 border-indigo-400/40' 
                                          : 'bg-white hover:bg-slate-100 text-slate-600 border-slate-300'
                                      }`}
                                      title="Copy link"
                                    >
                                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <a
                                key={i}
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex items-center gap-2 p-1.5 sm:p-2 rounded-lg font-bold text-xs border underline transition-colors ${
                                  isMe 
                                    ? 'bg-indigo-700 text-white border-indigo-500 hover:bg-indigo-800' 
                                    : 'bg-slate-50 text-slate-900 border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <Video className="w-3.5 h-3.5" />
                                <span>{att.name}</span>
                              </a>
                            );
                          })}
                        </div>
                      )}

                      <div className={`text-[10px] text-right flex items-center justify-end gap-1 pt-0.5 ${
                        isMe ? 'text-indigo-200' : 'text-slate-400'
                      }`}>
                        <span>{m.time}</span>
                        {isMe && <CheckCheck className="w-3.5 h-3.5 text-indigo-200 inline" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box Section */}
          {partner && (
            <div className="shrink-0 border-t border-slate-200 bg-white p-2 sm:p-2.5 space-y-1.5 shadow-lg relative">
              {/* Quick Suggestion Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                {[
                  "📅 Let's schedule a swap session!",
                  "📱 Show Attendance QR Code",
                  "👋 Hi! Excited to learn together!",
                  "👍 Sounds good to me!"
                ].map((quickText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (quickText.includes('schedule a swap')) {
                        onOpenScheduleModal(activeRequestId);
                      } else if (quickText.includes('Attendance QR')) {
                        onOpenQRModal(activeRequestId);
                      } else {
                        setInputMessage(quickText);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-colors shadow-2xs cursor-pointer shrink-0 border ${
                      quickText.includes('schedule')
                        ? 'bg-blue-50 hover:bg-blue-100 text-blue-900 border-blue-200 font-semibold'
                        : quickText.includes('QR')
                        ? 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-200 font-semibold'
                        : 'bg-slate-100 hover:bg-indigo-50 border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-900'
                    }`}
                  >
                    {quickText}
                  </button>
                ))}
              </div>

              {/* Send Form */}
              <form onSubmit={handleSend} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={`Type your message to ${partner.name}...`}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  className="flex-1 bg-white border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 rounded-xl px-3.5 py-2 text-xs md:text-sm text-slate-900 placeholder:text-slate-400 font-medium shadow-xs transition-all outline-none"
                />

                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  className="px-4 sm:px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:hover:bg-blue-600 disabled:cursor-not-allowed text-white font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition-all shrink-0 cursor-pointer active:scale-98"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* Live Video Meeting Room Modal */}
      <VideoMeetingModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        partner={partner || null}
        currentUser={currentUser}
        swapRequest={activeRequest || null}
        roomUrl={activeVideoUrl}
      />

      {/* Report Problem Modal */}
      <ReportProblemModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        partner={partner || null}
        swapRequest={activeRequest || null}
      />

    </div>
  );
};

