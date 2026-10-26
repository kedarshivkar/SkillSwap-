import React, { useState } from 'react';
import { User } from '../types';
import { useSkillSwap } from '../context/SkillSwapContext';
import { X, Send, Sparkles, ArrowRightLeft } from 'lucide-react';

interface SwapRequestModalProps {
  receiver: User | null;
  onClose: () => void;
}

export const SwapRequestModal: React.FC<SwapRequestModalProps> = ({ receiver, onClose }) => {
  const { currentUser, sendSwapRequest, calculateMatch } = useSkillSwap();

  if (!receiver || !currentUser) return null;

  const matchInfo = calculateMatch(currentUser, receiver);

  const [teachSkill, setTeachSkill] = useState(
    currentUser.teachSkills[0]?.skillName || 'Python'
  );
  const [learnSkill, setLearnSkill] = useState(
    receiver.teachSkills[0]?.skillName || 'Guitar'
  );
  const [notes, setNotes] = useState(
    `Hi ${receiver.name.split(' ')[0]}! I would love to exchange knowledge with you. Let's swap my ${teachSkill} for your ${learnSkill}.`
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendSwapRequest(receiver.id, teachSkill, learnSkill, notes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden p-6 text-slate-900 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider">
            <ArrowRightLeft className="w-4 h-4" /> Propose Barter Exchange
          </div>
          <h2 className="text-xl font-bold text-slate-900">Send Swap Request to {receiver.name}</h2>
        </div>

        {/* Reciprocal match callout */}
        {matchInfo.isPerfectMatch && (
          <div className="p-3 bg-slate-100 border border-slate-300 rounded-xl flex items-center gap-3 text-xs text-slate-900">
            <Sparkles className="w-5 h-5 text-slate-900 shrink-0" />
            <div>
              <span className="font-bold">100% Perfect Match Detected!</span> {matchInfo.reason}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Skill You Will Teach */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Skill You Will Teach:
            </label>
            <select
              value={teachSkill}
              onChange={(e) => setTeachSkill(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black"
            >
              {currentUser.teachSkills.map(sk => (
                <option key={sk.id} value={sk.skillName}>
                  {sk.skillName} ({sk.level})
                </option>
              ))}
            </select>
          </div>

          {/* Skill You Want to Learn */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1">
              Skill You Want to Learn From {receiver.name.split(' ')[0]}:
            </label>
            <select
              value={learnSkill}
              onChange={(e) => setLearnSkill(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-black"
            >
              {receiver.teachSkills.map(sk => (
                <option key={sk.id} value={sk.skillName}>
                  {sk.skillName} ({sk.level})
                </option>
              ))}
            </select>
          </div>

          {/* Custom Message */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Proposal Note / Introduction:
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-900 focus:outline-none focus:border-black"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-black hover:bg-slate-800 text-white font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Send Request</span>
          </button>

        </form>

      </div>
    </div>
  );
};
