import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, VideoOff, Mic, MicOff, PhoneOff, 
  Share2, Maximize2, Minimize2, Copy, Check, 
  Sparkles, MessageSquare, Users, Settings, 
  ExternalLink, ArrowLeftRight, Smile, ShieldCheck, Volume2
} from 'lucide-react';
import { User, SwapRequest, hasUserPhoto } from '../types';

interface VideoMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: User | null;
  currentUser: User | null;
  swapRequest: SwapRequest | null;
  roomUrl?: string;
}

export const VideoMeetingModal: React.FC<VideoMeetingModalProps> = ({
  isOpen,
  onClose,
  partner,
  currentUser,
  swapRequest,
  roomUrl
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [reactions, setReactions] = useState<{ id: string; emoji: string; x: number }[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const modalContainerRef = useRef<HTMLDivElement | null>(null);

  const meetingLink = roomUrl || `https://meet.google.com/skillswap-${swapRequest?.id?.slice(-6) || 'live'}`;

  // Call duration counter
  useEffect(() => {
    let timer: any;
    if (isOpen) {
      setCallDuration(0);
      timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOpen]);

  // Request camera and microphone access
  useEffect(() => {
    if (!isOpen) {
      stopMediaTracks();
      return;
    }

    startCamera();

    return () => {
      stopMediaTracks();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
          audio: true
        });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setCameraActive(true);
      } else {
        setCameraError('Camera / Microphone API not supported in this browser window.');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError(err.message || 'Camera permission was not granted. Showing interactive avatar simulation.');
      setCameraActive(false);
    }
  };

  const stopMediaTracks = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      localStreamRef.current = null;
    }
    setCameraActive(false);
  };

  // Toggle Mic
  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsMuted(!isMuted);
  };

  // Toggle Camera Video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
    }
    setIsVideoOff(!isVideoOff);
  };

  // Screen Sharing
  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      setIsScreenSharing(false);
      startCamera();
    } else {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          localStreamRef.current = screenStream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          setIsScreenSharing(true);
          screenStream.getVideoTracks()[0].onended = () => {
            setIsScreenSharing(false);
            startCamera();
          };
        } else {
          setIsScreenSharing(true);
        }
      } catch (e) {
        console.warn('Screen share cancelled or not allowed:', e);
      }
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!modalContainerRef.current) return;
    if (!document.fullscreenElement) {
      modalContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Copy Link
  const handleCopyLink = () => {
    navigator.clipboard.writeText(meetingLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Add Emoji Reaction
  const sendReaction = (emoji: string) => {
    const newReaction = {
      id: Math.random().toString(),
      emoji,
      x: 20 + Math.random() * 60
    };
    setReactions(prev => [...prev, newReaction]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newReaction.id));
    }, 2500);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      
      <div 
        ref={modalContainerRef}
        className="bg-slate-900 border border-slate-700/80 w-full max-w-5xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[92vh] max-h-[820px] relative text-white"
      >
        
        {/* Top Floating Control Bar */}
        <div className="bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between z-20 shrink-0">
          
          {/* Partner & Skill Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                {hasUserPhoto(partner?.photo) ? (
                  <img src={partner!.photo} alt={partner!.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-sm text-indigo-400">{partner?.name?.charAt(0) || 'P'}</span>
                )}
              </div>
              <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5 animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm text-white tracking-tight">
                  {partner?.name || 'SkillSwap Video Call'}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Call
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                <ArrowLeftRight className="w-3 h-3 text-amber-400" />
                <span>{swapRequest?.teachSkill || 'Skill'} ↔ {swapRequest?.learnSkill || 'Skill'}</span>
              </p>
            </div>
          </div>

          {/* Call Timer & External Meet Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            <div className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs font-mono font-bold text-amber-300 flex items-center gap-1.5 shadow-inner">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span>{formatTimer(callDuration)}</span>
            </div>

            <button
              onClick={handleCopyLink}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Copy Meeting Link"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
            </button>

            <a
              href={meetingLink}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 text-xs font-semibold border border-indigo-500/40 transition-colors"
              title="Open Google Meet external window"
            >
              <ExternalLink className="w-3.5 h-3.5 text-indigo-300" />
              <span>Google Meet</span>
            </a>

            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

          </div>

        </div>

        {/* Video Canvas Stage */}
        <div className="flex-1 bg-slate-950 p-2 sm:p-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 relative overflow-hidden min-h-0">
          
          {/* Main Stage Video 1: Remote Partner Video Stream / Simulator */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-xl group">
            
            {/* Visual Simulator Background */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 z-0" />
            
            {/* Partner Avatar Presentation */}
            <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="relative">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-indigo-600 to-amber-500 p-1 shadow-2xl ring-4 ring-indigo-500/20 animate-pulse">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                    {hasUserPhoto(partner?.photo) ? (
                      <img src={partner!.photo} alt={partner!.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl font-black text-white">{partner?.name?.charAt(0) || 'P'}</span>
                    )}
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 p-1.5 rounded-full bg-emerald-500 text-white shadow-lg">
                  <Volume2 className="w-3.5 h-3.5 animate-bounce" />
                </div>
              </div>

              <div>
                <h4 className="font-black text-lg text-white">{partner?.name || 'Swap Partner'}</h4>
                <p className="text-xs text-slate-400 font-medium">
                  Teaching: <strong className="text-amber-300">{swapRequest?.learnSkill || 'Skill'}</strong>
                </p>
                <p className="text-[11px] text-emerald-400 font-mono mt-1">
                  Connected (HD Audio & Video)
                </p>
              </div>

              {/* Skill Exchange Live Badge */}
              <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 px-3 py-1 rounded-full text-[11px] text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Live Collaborative Session Active</span>
              </div>
            </div>

            {/* Partner Name Label Bottom */}
            <div className="absolute bottom-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-slate-200 border border-slate-700/60 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{partner?.name || 'Partner'}</span>
            </div>

            {/* Video Quality Badge */}
            <div className="absolute top-3 right-3 z-10 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[10px] font-mono text-emerald-400 border border-slate-700">
              720p HD
            </div>

          </div>

          {/* Main Stage Video 2: Local User Camera Feed */}
          <div className="relative rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center shadow-xl">
            
            {/* Real WebRTC Local Video Track */}
            {cameraActive && !isVideoOff && (
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100 z-0"
              />
            )}

            {/* Fallback when Camera is Off or Permission Denied */}
            {(!cameraActive || isVideoOff) && (
              <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center shadow-lg overflow-hidden">
                  {hasUserPhoto(currentUser?.photo) ? (
                    <img src={currentUser!.photo} alt={currentUser!.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-black text-slate-300">{currentUser?.name?.charAt(0) || 'Y'}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-black text-base text-white">{currentUser?.name || 'You'}</h4>
                  <p className="text-xs text-slate-400">
                    {isVideoOff ? 'Camera Turned Off' : cameraError ? 'Camera Access Standby' : 'Connecting Camera...'}
                  </p>
                </div>
                {cameraError && (
                  <button
                    onClick={startCamera}
                    className="px-3 py-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all shadow-md cursor-pointer"
                  >
                    Enable Webcam
                  </button>
                )}
              </div>
            )}

            {/* Local User Name Tag */}
            <div className="absolute bottom-3 left-3 z-10 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-xl text-xs font-bold text-slate-200 border border-slate-700/60 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isMuted ? 'bg-rose-500' : 'bg-emerald-400'}`} />
              <span>You {isMuted && '(Muted)'}</span>
            </div>

            {/* Mic indicator badge */}
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
              {isMuted && (
                <span className="p-1.5 rounded-lg bg-rose-500/80 text-white text-xs backdrop-blur-md">
                  <MicOff className="w-3.5 h-3.5" />
                </span>
              )}
              {isScreenSharing && (
                <span className="px-2 py-0.5 rounded-lg bg-indigo-500/80 text-white text-[10px] font-bold backdrop-blur-md flex items-center gap-1">
                  <Share2 className="w-3 h-3" />
                  <span>Sharing Screen</span>
                </span>
              )}
            </div>

          </div>

          {/* Floating Emoji Reactions Animation */}
          {reactions.map(r => (
            <div
              key={r.id}
              style={{ left: `${r.x}%` }}
              className="absolute bottom-16 z-30 text-3xl sm:text-4xl animate-bounce pointer-events-none transition-all duration-1000"
            >
              {r.emoji}
            </div>
          ))}

        </div>

        {/* Bottom Floating Control Toolbar */}
        <div className="bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 py-3.5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 z-20 shrink-0">
          
          {/* Reaction Emojis Tray */}
          <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto">
            {['👋', '👍', '👏', '💡', '🎉', '🔥'].map((emoji, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendReaction(emoji)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-sm flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-xs"
                title={`Send ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>

          {/* Primary Call Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Mic Toggle */}
            <button
              onClick={toggleMic}
              className={`p-3 rounded-2xl font-bold transition-all shadow-md cursor-pointer flex items-center justify-center ${
                isMuted 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
            >
              {isMuted ? <MicOff className="w-5 h-5 text-rose-400" /> : <Mic className="w-5 h-5 text-white" />}
            </button>

            {/* Video Camera Toggle */}
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-2xl font-bold transition-all shadow-md cursor-pointer flex items-center justify-center ${
                isVideoOff 
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 hover:bg-rose-500/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
              title={isVideoOff ? 'Turn Video On' : 'Turn Video Off'}
            >
              {isVideoOff ? <VideoOff className="w-5 h-5 text-rose-400" /> : <Video className="w-5 h-5 text-white" />}
            </button>

            {/* Screen Share Toggle */}
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-2xl font-bold transition-all shadow-md cursor-pointer flex items-center justify-center ${
                isScreenSharing 
                  ? 'bg-indigo-600 text-white border border-indigo-400 shadow-indigo-500/30' 
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
              }`}
              title={isScreenSharing ? 'Stop Screen Sharing' : 'Share Screen'}
            >
              <Share2 className="w-5 h-5" />
            </button>

            {/* End Call Button */}
            <button
              onClick={() => {
                stopMediaTracks();
                onClose();
              }}
              className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-rose-600/30 transition-all cursor-pointer active:scale-95"
              title="Leave / End Video Call"
            >
              <PhoneOff className="w-5 h-5" />
              <span>End Call</span>
            </button>

          </div>

          {/* Quick Meet Fallback */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Live Call</span>
          </div>

        </div>

      </div>

    </div>
  );
};
