import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { User, SwapRequest, ProblemCategory, ProblemPriority } from '../types';
import { 
  AlertTriangle, ShieldAlert, X, CheckCircle2, 
  Lock, UserX, AlertOctagon, HelpCircle, FileText 
} from 'lucide-react';

interface ReportProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  partner: User | null;
  swapRequest: SwapRequest | null;
}

const CATEGORIES: { value: ProblemCategory; label: string; desc: string }[] = [
  { 
    value: 'No Show / Attendance Issue', 
    label: 'No Show / Attendance Issue', 
    desc: 'Partner missed scheduled session or did not show up' 
  },
  { 
    value: 'Inappropriate Behavior / Harassment', 
    label: 'Inappropriate Behavior / Harassment', 
    desc: 'Offensive language, harassment, or unprofessional conduct' 
  },
  { 
    value: 'Skill Mismatch / False Claims', 
    label: 'Skill Mismatch / False Claims', 
    desc: 'Skill level or subject does not match what was promised' 
  },
  { 
    value: 'Spam, Fraud or Scam', 
    label: 'Spam, Fraud or Scam', 
    desc: 'Suspicious links, asking for payments, or commercial solicitation' 
  },
  { 
    value: 'Audio / Video Technical Issue', 
    label: 'Audio / Video Technical Issue', 
    desc: 'Meeting link broken, poor audio/video connection issues' 
  },
  { 
    value: 'Cancellation Dispute', 
    label: 'Cancellation Dispute', 
    desc: 'Dispute over swap cancellations or rescheduling terms' 
  },
  { 
    value: 'Other Problem', 
    label: 'Other Problem', 
    desc: 'Any other platform issue or safety concern' 
  }
];

export const ReportProblemModal: React.FC<ReportProblemModalProps> = ({
  isOpen,
  onClose,
  partner,
  swapRequest
}) => {
  const { reportProblem, currentUser } = useSkillSwap();

  const [category, setCategory] = useState<ProblemCategory>('No Show / Attendance Issue');
  const [priority, setPriority] = useState<ProblemPriority>('Normal');
  const [description, setDescription] = useState('');
  const [evidenceNotes, setEvidenceNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  if (!isOpen || !partner) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setErrorMsg('Please enter a brief description of the problem.');
      return;
    }

    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const result = await reportProblem({
        reportedUserId: partner.id,
        reportedUserName: partner.name,
        reportedUserEmail: partner.email,
        swapRequestId: swapRequest?.id,
        teachSkill: swapRequest?.teachSkill,
        learnSkill: swapRequest?.learnSkill,
        category,
        priority,
        description: description.trim(),
        evidenceNotes: evidenceNotes.trim()
      });

      if (result.success) {
        setSubmittedSuccess(true);
      } else {
        setErrorMsg(result.error || 'Failed to submit report. Please try again.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setDescription('');
    setEvidenceNotes('');
    setCategory('No Show / Attendance Issue');
    setPriority('Normal');
    setErrorMsg('');
    setSubmittedSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h2 className="text-sm font-black tracking-tight text-white flex items-center gap-2">
                <span>Report Problem to Admin</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-rose-900/60 text-rose-200 border border-rose-700 font-bold uppercase">
                  Confidential
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Only platform administrators will see this report
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {submittedSuccess ? (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-black text-slate-900">
                  Report Successfully Sent to Admin Portal!
                </h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Thank you for keeping our peer-to-peer community safe. The system administrator will investigate your report confidentially.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-left text-xs space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Confidentiality Guarantee</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  {partner.name} will not see this report. Admin reviews are managed through the centralized Platform Control & Data Center.
                </p>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition-all shadow-md cursor-pointer"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Partner Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center shrink-0 border border-indigo-200">
                    {partner.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      Reporting: {partner.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {partner.email} • {swapRequest ? `Swap: ${swapRequest.teachSkill} ↔ ${swapRequest.learnSkill}` : 'Chat Partner'}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200 shrink-0">
                  ID: {partner.id}
                </span>
              </div>

              {/* Problem Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Select Problem Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProblemCategory)}
                  className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 outline-none transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  {CATEGORIES.find(c => c.value === category)?.desc}
                </p>
              </div>

              {/* Priority / Urgency */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Priority Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Normal', 'Urgent', 'Critical'] as ProblemPriority[]).map((p) => {
                    const isSelected = priority === p;
                    return (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPriority(p)}
                        className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          isSelected
                            ? p === 'Critical'
                              ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                              : p === 'Urgent'
                              ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                              : 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Problem Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Describe the Problem <span className="text-rose-500">*</span></span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {description.length} / 500
                  </span>
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  rows={3}
                  placeholder="Explain clearly what went wrong or what assistance you require from the admin..."
                  className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl p-3 text-xs text-slate-900 placeholder:text-slate-400 font-medium outline-none transition-all resize-none"
                />
              </div>

              {/* Extra Details / Evidence */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-800">
                  Additional Details or Meeting Link (Optional)
                </label>
                <input
                  type="text"
                  value={evidenceNotes}
                  onChange={(e) => setEvidenceNotes(e.target.value)}
                  placeholder="e.g., Session date/time, Zoom link issue, or relevant notes"
                  className="w-full bg-white border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 font-medium outline-none transition-all"
                />
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Privacy Notice Banner */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-start gap-2.5 text-[11px] text-slate-600">
                <Lock className="w-3.5 h-3.5 text-slate-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800">Privacy Notice:</strong> This report is securely stored and exclusively accessible to platform administrators in the Admin Data Center. {partner.name} will not be notified of this submission.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !description.trim()}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Submitting Report...</span>
                  ) : (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Submit Report</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
