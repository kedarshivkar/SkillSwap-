import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  X, QrCode, CheckCircle2, Sparkles, Camera, 
  User, Check, Smartphone, ShieldCheck, ArrowRight 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface QRAttendanceModalProps {
  swapRequestId: string | null;
  onClose: () => void;
  onOpenSchedule?: (swapRequestId: string) => void;
}

export const QRAttendanceModal: React.FC<QRAttendanceModalProps> = ({ 
  swapRequestId, 
  onClose,
  onOpenSchedule 
}) => {
  const { 
    sessions, currentUser, swapRequests, users, 
    confirmSessionAttendance, scheduleSession, sendChatMessage 
  } = useSkillSwap();
  const [scannedSuccess, setScannedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'show' | 'scan'>('show');
  const [isScanning, setIsScanning] = useState(false);

  if (!swapRequestId || !currentUser) return null;

  const targetSwap = swapRequests.find(r => r.id === swapRequestId);
  const ses = sessions.find(s => s.swapRequestId === swapRequestId);

  const partnerId = targetSwap 
    ? (targetSwap.senderId === currentUser.id ? targetSwap.receiverId : targetSwap.senderId)
    : (ses ? (ses.teacherId === currentUser.id ? ses.learnerId : ses.teacherId) : null);
  const partner = users.find(u => u.id === partnerId);

  // If session exists, determine teacher role; otherwise default to teaching if user matches teach skill or sender
  const isTeacher = ses 
    ? ses.teacherId === currentUser.id 
    : (targetSwap ? targetSwap.senderId === currentUser.id : true);

  const qrData = ses?.qrCodeData || `SKILLSWAP-VERIFY-${swapRequestId}-${currentUser.id}-${Date.now()}`;

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      if (ses) {
        confirmSessionAttendance(ses.id, isTeacher);
      } else if (targetSwap && partnerId) {
        // Create instant session and record attendance
        const today = new Date().toISOString().split('T')[0];
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        scheduleSession(swapRequestId, today, time, 'Online', 'QR Verified Session');
        sendChatMessage(
          swapRequestId,
          partnerId,
          `✅ QR Attendance Verified! ${currentUser.name} verified skill exchange session for ${targetSwap.teachSkill} ↔ ${targetSwap.learnSkill}.`
        );
      }

      setScannedSuccess(true);
      confetti({ particleCount: 60, spread: 70 });
      setTimeout(() => {
        setScannedSuccess(false);
        onClose();
      }, 1900);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-slate-900 space-y-4 text-center">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold uppercase tracking-wider">
            <QrCode className="w-3.5 h-3.5 text-amber-600" />
            <span>QR Attendance Verification</span>
          </div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 font-['Outfit',sans-serif]">
            {activeTab === 'show' ? 'SkillSwap QR Pass' : 'Scan Partner QR'}
          </h2>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            {partner ? `Exchange with ${partner.name}` : 'Skill Exchange Verification'}
            {targetSwap && <span className="block text-[11px] text-slate-500 font-medium">({targetSwap.teachSkill} ↔ {targetSwap.learnSkill})</span>}
          </p>
        </div>

        {/* Tab Toggle: Show QR vs Scan QR */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('show')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'show' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Display QR Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('scan')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'scan' 
                ? 'bg-white text-slate-900 shadow-xs' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Scan Camera Mode</span>
          </button>
        </div>

        {/* Display QR Mode */}
        {activeTab === 'show' ? (
          <div className="space-y-4">
            <div className="bg-slate-50 p-5 rounded-2xl w-56 h-56 mx-auto flex flex-col items-center justify-center shadow-xs border-2 border-slate-200 relative group">
              <svg className="w-40 h-40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0H35V35H0V0ZM10 10V25H25V10H10Z" fill="#0f172a"/>
                <path d="M15 15H20V20H15V15Z" fill="#0f172a"/>
                <path d="M65 0H100V35H65V0ZM75 10V25H90V10H75Z" fill="#0f172a"/>
                <path d="M80 15H85V20H80V15Z" fill="#0f172a"/>
                <path d="M0 65H35V100H0V65ZM10 75V90H25V75H10Z" fill="#0f172a"/>
                <path d="M15 80H20V85H15V80Z" fill="#0f172a"/>
                <path d="M45 10H55V20H45V10Z" fill="#0f172a"/>
                <path d="M40 30H60V40H40V30Z" fill="#0f172a"/>
                <path d="M70 45H90V55H70V45Z" fill="#0f172a"/>
                <path d="M50 60H80V70H50V60Z" fill="#0f172a"/>
                <path d="M40 80H60V100H40V80Z" fill="#0f172a"/>
                <path d="M70 85H95V95H70V85Z" fill="#0f172a"/>
              </svg>
              <div className="text-[9px] font-mono text-slate-500 mt-2 font-bold truncate max-w-full">
                {qrData.substring(0, 26)}...
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Present this QR to your swap partner during or after your meeting to verify session completion.
            </p>
          </div>
        ) : (
          /* Scan Mode with Viewfinder Simulation */
          <div className="space-y-4">
            <div className="bg-slate-900 rounded-2xl w-56 h-56 mx-auto relative flex items-center justify-center overflow-hidden border-2 border-slate-700 shadow-inner">
              {/* Camera Scanner Viewfinder */}
              <div className="absolute inset-4 border-2 border-dashed border-emerald-400/70 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                <div className="flex justify-between">
                  <div className="w-3 h-3 border-t-2 border-l-2 border-emerald-400" />
                  <div className="w-3 h-3 border-t-2 border-r-2 border-emerald-400" />
                </div>
                {isScanning && (
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_#10b981] animate-pulse my-auto" />
                )}
                <div className="flex justify-between">
                  <div className="w-3 h-3 border-b-2 border-l-2 border-emerald-400" />
                  <div className="w-3 h-3 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>

              <div className="text-center space-y-1 text-slate-300 z-10 px-4">
                <Camera className="w-8 h-8 text-emerald-400 mx-auto animate-pulse" />
                <span className="text-[11px] font-semibold block text-slate-200">
                  {isScanning ? 'Scanning QR Code...' : 'Point camera at partner QR'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Click the button below to scan and automatically record your attendance.
            </p>
          </div>
        )}

        {/* Status Indicator or Action Button */}
        {scannedSuccess ? (
          <div className="p-3.5 bg-emerald-50 text-emerald-900 rounded-xl border border-emerald-300 text-xs font-bold flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Attendance Verified & Recorded!</span>
          </div>
        ) : (
          <div className="space-y-2 pt-1">
            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              {isScanning ? (
                <span>Verifying QR Code...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>{activeTab === 'show' ? 'Mark Attendance Confirmed' : 'Scan & Confirm Attendance'}</span>
                </>
              )}
            </button>

            {!ses && onOpenSchedule && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSchedule(swapRequestId);
                }}
                className="w-full py-1.5 text-[11px] font-bold text-blue-600 hover:underline flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Want to set a future calendar time instead? Schedule Session</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
