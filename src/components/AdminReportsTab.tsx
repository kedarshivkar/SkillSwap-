import React, { useState } from 'react';
import { ProblemReport, ProblemStatus, ProblemCategory, ProblemPriority, User, SwapRequest } from '../types';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, Clock, 
  Search, Filter, Trash2, Edit3, UserX, UserCheck, 
  ExternalLink, MessageSquare, AlertOctagon, Check, 
  FileText, Shield, ArrowRightLeft, User as UserIcon, Eye, X
} from 'lucide-react';

interface AdminReportsTabProps {
  reports: ProblemReport[];
  users: User[];
  swapRequests: SwapRequest[];
  onUpdateStatus: (reportId: string, status: ProblemStatus, adminNotes?: string, adminActionTaken?: string) => Promise<void>;
  onDeleteReport: (reportId: string) => Promise<void>;
  onToggleUserFlag: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const AdminReportsTab: React.FC<AdminReportsTabProps> = ({
  reports,
  users,
  swapRequests,
  onUpdateStatus,
  onDeleteReport,
  onToggleUserFlag,
  onDeleteUser
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ProblemStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  // Selected report for investigation modal
  const [activeReportForModal, setActiveReportForModal] = useState<ProblemReport | null>(null);
  const [modalStatus, setModalStatus] = useState<ProblemStatus>('Pending');
  const [modalNotes, setModalNotes] = useState('');
  const [modalActionTaken, setModalActionTaken] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const pendingCount = reports.filter(r => r.status === 'Pending').length;
  const underReviewCount = reports.filter(r => r.status === 'Under Review').length;
  const resolvedCount = reports.filter(r => r.status === 'Resolved').length;

  const filteredReports = reports.filter(r => {
    const query = searchTerm.toLowerCase();
    const matchesSearch = 
      r.description.toLowerCase().includes(query) ||
      r.category.toLowerCase().includes(query) ||
      r.reporterName.toLowerCase().includes(query) ||
      r.reporterEmail.toLowerCase().includes(query) ||
      (r.reportedUserName && r.reportedUserName.toLowerCase().includes(query)) ||
      (r.reportedUserEmail && r.reportedUserEmail.toLowerCase().includes(query)) ||
      (r.teachSkill && r.teachSkill.toLowerCase().includes(query)) ||
      (r.learnSkill && r.learnSkill.toLowerCase().includes(query)) ||
      (r.adminNotes && r.adminNotes.toLowerCase().includes(query)) ||
      r.id.toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
    const matchesPriority = priorityFilter === 'all' || r.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  const openInvestigationModal = (report: ProblemReport) => {
    setActiveReportForModal(report);
    setModalStatus(report.status);
    setModalNotes(report.adminNotes || '');
    setModalActionTaken(report.adminActionTaken || '');
  };

  const handleSaveInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReportForModal) return;

    setIsSaving(true);
    try {
      await onUpdateStatus(
        activeReportForModal.id,
        modalStatus,
        modalNotes.trim(),
        modalActionTaken.trim()
      );
      setActiveReportForModal(null);
    } catch (err) {
      console.error('Failed to update problem report:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              <span>Reported Problems & Platform Safety</span>
            </h2>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-extrabold border border-rose-200 animate-pulse">
                {pendingCount} Pending
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit and resolve confidential problem reports submitted by users from chat conversations.
          </p>
        </div>

        {/* Stats Summary Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-bold text-slate-700 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            <span>Total: {reports.length}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl font-bold text-amber-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>Pending: {pendingCount}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl font-bold text-blue-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Under Review: {underReviewCount}</span>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl font-bold text-emerald-800 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Resolved: {resolvedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search reports by user, email, skill, category, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 placeholder:text-slate-400 font-medium focus:outline-none focus:border-slate-800 shadow-2xs"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none shadow-2xs"
          >
            <option value="all">All Statuses ({reports.length})</option>
            <option value="Pending">Pending ({pendingCount})</option>
            <option value="Under Review">Under Review ({underReviewCount})</option>
            <option value="Resolved">Resolved ({resolvedCount})</option>
            <option value="Dismissed">Dismissed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none shadow-2xs"
          >
            <option value="all">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="Urgent">Urgent</option>
            <option value="Normal">Normal</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none shadow-2xs"
          >
            <option value="all">All Categories</option>
            <option value="No Show / Attendance Issue">No Show / Attendance</option>
            <option value="Inappropriate Behavior / Harassment">Inappropriate Behavior</option>
            <option value="Skill Mismatch / False Claims">Skill Mismatch</option>
            <option value="Spam, Fraud or Scam">Spam / Scam</option>
            <option value="Audio / Video Technical Issue">Technical Issue</option>
            <option value="Cancellation Dispute">Cancellation Dispute</option>
            <option value="Other Problem">Other Problem</option>
          </select>

          {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || priorityFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
                setPriorityFilter('all');
              }}
              className="px-2.5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
          <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-700">No Problem Reports Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {reports.length === 0 
              ? 'No users have submitted problem reports yet. Reports filed via chat will appear here for admin review.'
              : 'No reports matched your current filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => {
            const reportedUser = users.find(u => u.id === report.reportedUserId);
            
            return (
              <div 
                key={report.id}
                className={`bg-white border rounded-2xl p-4.5 space-y-3.5 transition-all shadow-2xs ${
                  report.status === 'Pending' 
                    ? 'border-amber-300 bg-amber-50/10' 
                    : report.status === 'Under Review'
                    ? 'border-blue-300 bg-blue-50/10'
                    : report.status === 'Resolved'
                    ? 'border-emerald-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Header row */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                      {report.id}
                    </span>

                    {/* Priority Badge */}
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                      report.priority === 'Critical'
                        ? 'bg-rose-100 text-rose-800 border-rose-300'
                        : report.priority === 'Urgent'
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                    }`}>
                      {report.priority} Priority
                    </span>

                    {/* Category */}
                    <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {report.category}
                    </span>
                  </div>

                  {/* Status Badge & Timestamp */}
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      report.status === 'Pending'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : report.status === 'Under Review'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : report.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {report.status === 'Pending' && <Clock className="w-3 h-3" />}
                      {report.status === 'Under Review' && <Eye className="w-3 h-3" />}
                      {report.status === 'Resolved' && <CheckCircle2 className="w-3 h-3" />}
                      <span>{report.status}</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {report.createdAt}
                    </span>
                  </div>
                </div>

                {/* Parties Involved & Skill Swap Context */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  
                  {/* Reporter */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <UserIcon className="w-3 h-3 text-indigo-600" />
                      <span>Reported By (Reporter)</span>
                    </div>
                    <div className="font-bold text-slate-900">{report.reporterName}</div>
                    <div className="text-slate-500 text-[11px]">{report.reporterEmail} • ID: <code className="font-mono text-[10px]">{report.reporterId}</code></div>
                  </div>

                  {/* Reported Partner */}
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
                      <span className="flex items-center gap-1 text-rose-700">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        <span>Reported User</span>
                      </span>
                      {reportedUser && (
                        <button
                          type="button"
                          onClick={() => onToggleUserFlag(reportedUser.id)}
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded cursor-pointer ${
                            reportedUser.isReportedFake
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-white text-slate-700 border border-slate-300 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          {reportedUser.isReportedFake ? '⚠️ Flagged Fake' : 'Flag Profile'}
                        </button>
                      )}
                    </div>
                    <div className="font-bold text-slate-900">{report.reportedUserName || 'Not specified'}</div>
                    <div className="text-slate-500 text-[11px]">
                      {report.reportedUserEmail || ''} 
                      {report.reportedUserId && ` • ID: `}
                      {report.reportedUserId && <code className="font-mono text-[10px]">{report.reportedUserId}</code>}
                    </div>
                  </div>

                  {/* Swap Context */}
                  {(report.teachSkill || report.learnSkill || report.swapRequestId) && (
                    <div className="md:col-span-2 pt-1 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-600">
                      <div className="flex items-center gap-1.5 font-medium">
                        <ArrowRightLeft className="w-3 h-3 text-slate-500" />
                        <span>Swap Skills: <strong>{report.teachSkill || 'Skill'} ↔ {report.learnSkill || 'Skill'}</strong></span>
                      </div>
                      {report.swapRequestId && (
                        <div className="font-mono text-[10px] text-slate-400">
                          Swap ID: {report.swapRequestId}
                        </div>
                      )}
                    </div>
                  )}

                </div>

                {/* Problem Description Box */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-700">User's Problem Statement:</div>
                  <div className="p-3 rounded-xl bg-slate-900 text-slate-100 text-xs font-medium leading-relaxed">
                    "{report.description}"
                  </div>
                </div>

                {/* Extra Evidence / Notes */}
                {report.evidenceNotes && (
                  <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-0.5">
                    <div className="font-bold text-amber-900 text-[11px]">Additional Evidence / Details:</div>
                    <div className="text-amber-800 text-[11px]">{report.evidenceNotes}</div>
                  </div>
                )}

                {/* Admin Investigation Resolution Summary */}
                {(report.adminNotes || report.adminActionTaken || report.resolvedAt) && (
                  <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3.5 h-3.5 text-indigo-700" />
                        <span>Admin Investigation Log</span>
                      </span>
                      {report.resolvedAt && (
                        <span className="text-[10px] font-normal text-slate-500 font-mono">
                          Resolved {report.resolvedAt} by {report.resolvedBy || 'Admin'}
                        </span>
                      )}
                    </div>
                    {report.adminNotes && (
                      <p className="text-slate-700 text-[11px]">
                        <strong>Notes:</strong> {report.adminNotes}
                      </p>
                    )}
                    {report.adminActionTaken && (
                      <p className="text-slate-700 text-[11px]">
                        <strong>Action Taken:</strong> {report.adminActionTaken}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                  
                  {/* Quick Status Buttons */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {report.status !== 'Under Review' && (
                      <button
                        onClick={() => onUpdateStatus(report.id, 'Under Review')}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-bold border border-blue-200 transition-colors cursor-pointer"
                      >
                        Mark Under Review
                      </button>
                    )}

                    {report.status !== 'Resolved' && (
                      <button
                        onClick={() => onUpdateStatus(report.id, 'Resolved', 'Resolved by admin investigation.')}
                        className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        <span>Mark Resolved</span>
                      </button>
                    )}

                    {report.status !== 'Dismissed' && (
                      <button
                        onClick={() => onUpdateStatus(report.id, 'Dismissed', 'Dismissed after review.')}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold border border-slate-300 transition-colors cursor-pointer"
                      >
                        Dismiss
                      </button>
                    )}
                  </div>

                  {/* Deep Investigation & Delete Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openInvestigationModal(report)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-black text-white text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Investigate & Log Notes</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this problem report permanently?')) {
                          onDeleteReport(report.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Admin Investigation & Resolution Modal */}
      {activeReportForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-400" />
                <div>
                  <h3 className="text-sm font-black text-white">Admin Problem Investigation</h3>
                  <p className="text-[11px] text-slate-400">Report ID: {activeReportForModal.id}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveReportForModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInvestigation} className="p-5 overflow-y-auto space-y-4 text-xs">
              
              {/* Problem summary */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-1">
                <div className="font-bold text-slate-900">
                  {activeReportForModal.category} • Priority: {activeReportForModal.priority}
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong>Reporter:</strong> {activeReportForModal.reporterName} ({activeReportForModal.reporterEmail})
                </div>
                {activeReportForModal.reportedUserName && (
                  <div className="text-slate-600 text-[11px]">
                    <strong>Reported User:</strong> {activeReportForModal.reportedUserName} ({activeReportForModal.reportedUserEmail})
                  </div>
                )}
                <div className="text-slate-800 bg-white p-2 rounded border border-slate-200 mt-2 italic text-[11px]">
                  "{activeReportForModal.description}"
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Update Resolution Status</label>
                <select
                  value={modalStatus}
                  onChange={(e) => setModalStatus(e.target.value as ProblemStatus)}
                  className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="Pending">Pending Investigation</option>
                  <option value="Under Review">Under Review (In Progress)</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Dismissed">Dismissed</option>
                </select>
              </div>

              {/* Action Taken */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Action Taken / Administrative Intervention</label>
                <input
                  type="text"
                  value={modalActionTaken}
                  onChange={(e) => setModalActionTaken(e.target.value)}
                  placeholder="e.g., Contacted both parties, warned user, verified skill, or provided technical help"
                  className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl px-3 py-2 text-xs text-slate-900 outline-none"
                />
              </div>

              {/* Admin Internal Investigation Notes */}
              <div className="space-y-1">
                <label className="block font-bold text-slate-800">Admin Internal Investigation Notes</label>
                <textarea
                  value={modalNotes}
                  onChange={(e) => setModalNotes(e.target.value)}
                  rows={3}
                  placeholder="Record confidential notes, audit findings, and follow-up details..."
                  className="w-full bg-white border border-slate-300 focus:border-slate-900 rounded-xl p-3 text-xs text-slate-900 outline-none resize-none"
                />
              </div>

              {/* Buttons */}
              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveReportForModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition-all shadow-md"
                >
                  {isSaving ? 'Saving...' : 'Save Resolution & Update'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
