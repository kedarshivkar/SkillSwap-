import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  X, Star, Award, CheckCircle2, Download, Printer, 
  Sparkles, QrCode, ShieldCheck 
} from 'lucide-react';

interface RatingCertificateModalProps {
  sessionId: string | null;
  onClose: () => void;
}

export const RatingCertificateModal: React.FC<RatingCertificateModalProps> = ({ sessionId, onClose }) => {
  const { sessions, currentUser, users, submitReviewAndCompleteSession } = useSkillSwap();

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  if (!sessionId || !currentUser) return null;

  const ses = sessions.find(s => s.id === sessionId);
  if (!ses) return null;

  const isTeacher = ses.teacherId === currentUser.id;
  const partnerId = isTeacher ? ses.learnerId : ses.teacherId;
  const partner = users.find(u => u.id === partnerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReviewAndCompleteSession(sessionId, rating, comment || 'Great skill swap session!');
    setIsCompleted(true);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 text-slate-900 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!isCompleted ? (
          /* Step 1: Rating & Feedback Form */
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider">
                <Star className="w-4 h-4 text-slate-900 fill-slate-900" /> Complete Session & Rate Partner
              </div>
              <h2 className="text-xl font-bold text-slate-900">How was your swap with {partner?.name}?</h2>
              <p className="text-xs text-slate-500">Ratings help build trust across the SkillSwap community.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Star Rating Controls */}
              <div className="flex items-center justify-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star className={`w-8 h-8 ${star <= rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200 fill-slate-100'}`} />
                  </button>
                ))}
              </div>

              {/* Feedback Text */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Written Feedback / Testimonial:
                </label>
                <textarea
                  rows={3}
                  placeholder={`Write a review about ${partner?.name}'s teaching or learning...`}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-black"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Review & Issue Certificate</span>
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Downloadable / Printable Certificate Rendering */
          <div className="space-y-6">
            
            {/* Visual Certificate Card */}
            <div className="border-4 border-slate-900 bg-slate-50 p-6 rounded-2xl text-center space-y-4 shadow-sm relative overflow-hidden">

              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 text-xs font-black text-slate-900 tracking-wider uppercase">
                  <ShieldCheck className="w-4 h-4 text-slate-900" /> SkillSwap Verified Barter
                </div>
                <div className="text-[10px] text-slate-500">{new Date().toISOString().split('T')[0]}</div>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Certificate of Completion</div>
                <h3 className="text-2xl font-black text-slate-900">{currentUser.name}</h3>
                <p className="text-xs text-slate-600">has successfully completed the peer-to-peer exchange session in:</p>
                <div className="text-lg font-bold text-slate-900 pt-1">{ses.skillName}</div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-xs">
                <div className="text-left">
                  <div className="text-[10px] text-slate-500">Mentored By:</div>
                  <div className="font-bold text-slate-800">{partner?.name}</div>
                </div>

                <div className="w-12 h-12 bg-white p-1 rounded-lg border border-slate-200 shadow-xs">
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none">
                    <rect width="100" height="100" fill="#0f172a"/>
                    <rect x="10" y="10" width="30" height="30" fill="#ffffff"/>
                    <rect x="60" y="10" width="30" height="30" fill="#ffffff"/>
                    <rect x="10" y="60" width="30" height="30" fill="#ffffff"/>
                  </svg>
                </div>
              </div>

            </div>

            {/* Print & Close */}
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrint}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Certificate</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl bg-black hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Done
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
