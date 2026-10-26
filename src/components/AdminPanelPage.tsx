import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { User, Session, SwapRequest, SessionStatus, RequestStatus, hasUserPhoto, ProblemReport, ProblemStatus } from '../types';
import { AdminReportsTab } from './AdminReportsTab';
import { 
  ShieldCheck, ShieldAlert, Users, Calendar, ArrowRightLeft, 
  Search, CheckCircle2, XCircle, Clock, Trash2, Edit3, Eye, EyeOff, 
  Lock, Mail, Key, UserCheck, AlertTriangle, Sparkles, Filter, 
  RefreshCw, ExternalLink, Plus, MapPin, Video, Award, Check, X,
  LogOut, LayoutDashboard, ChevronRight, CheckCircle, Shield, User as UserIcon,
  MessageSquareWarning
} from 'lucide-react';

export const AdminPanelPage: React.FC = () => {
  const { 
    currentUser, users, swapRequests, sessions, certificates, reviews,
    problemReports, reportProblem, adminUpdateProblemReport, adminDeleteProblemReport,
    loginWithEmailAndPassword, logout, verifyUserAccount, toggleVerifiedMentorBadge, deleteUserAccount, 
    toggleUserReportedStatus, adminUpdateSessionStatus, adminUpdateSessionDetails, 
    adminDeleteSession, adminUpdateSwapRequestStatus, adminDeleteSwapRequest, 
    adminUpdateUser, resetDataToDefault, adminAcknowledgeRefundNotice
  } = useSkillSwap();

  // Admin Auth Login Gate State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [showAdminPass, setShowAdminPass] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'bookings' | 'proposals' | 'users'>('overview');

  // Search & Filter States
  const [userSearch, setUserSearch] = useState('');
  const [userFilter, setUserFilter] = useState<'all' | 'verified' | 'flagged' | 'admin'>('all');

  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'all' | 'Scheduled' | 'Completed' | 'Cancelled'>('all');

  const [proposalSearch, setProposalSearch] = useState('');
  const [proposalStatusFilter, setProposalStatusFilter] = useState<'all' | 'Pending' | 'Accepted' | 'Rejected' | 'Completed'>('all');

  // Modal States
  const [selectedUserDetail, setSelectedUserDetail] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingSession, setEditingSession] = useState<Session | null>(null);

  // Direct Admin Login Handler
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const res = await loginWithEmailAndPassword(adminEmail, adminPass);
    setAuthLoading(false);

    if (!res.success) {
      setAuthError(res.error || 'Invalid admin credentials. Please enter authorized admin email and password.');
    }
  };

  // If user is NOT an admin, display the dedicated Admin Login Screen
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-2xl space-y-6 text-slate-900">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShieldCheck className="w-8 h-8 stroke-[2.2]" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Portal Access</h1>
            <p className="text-xs text-slate-600 font-medium max-w-xs mx-auto">
              Authorized Administrator login required to view user data and manage platform bookings.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input 
                  type="email"
                  placeholder="admin@domain.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 font-medium focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Admin Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 z-10" />
                <input 
                  type={showAdminPass ? 'text' : 'password'}
                  placeholder="Enter admin password"
                  value={adminPass}
                  onChange={(e) => setAdminPass(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-11 py-2 text-sm text-slate-900 font-semibold placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowAdminPass(!showAdminPass)}
                  className="absolute right-3 top-2 p-1 text-slate-500 hover:text-slate-900 transition-colors rounded-lg z-10 cursor-pointer"
                  title={showAdminPass ? 'Hide password' : 'Show password'}
                >
                  {showAdminPass ? (
                    <EyeOff className="w-4 h-4 text-slate-700" />
                  ) : (
                    <Eye className="w-4 h-4 text-slate-700" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{authLoading ? 'Authenticating Admin...' : 'Log In as Admin'}</span>
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Filtered Users Data
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.city.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.teachSkills.some(s => s.skillName.toLowerCase().includes(userSearch.toLowerCase())) ||
      u.learnSkills.some(s => s.skillName.toLowerCase().includes(userSearch.toLowerCase()));

    if (userFilter === 'verified') return matchesSearch && u.isVerified;
    if (userFilter === 'flagged') return matchesSearch && u.isReportedFake;
    if (userFilter === 'admin') return matchesSearch && u.isAdmin;
    return matchesSearch;
  });

  // Filtered Bookings Data
  const filteredSessions = sessions.filter(s => {
    const teacher = users.find(u => u.id === s.teacherId);
    const learner = users.find(u => u.id === s.learnerId);
    const query = bookingSearch.toLowerCase();
    
    const matchesSearch = 
      s.skillName.toLowerCase().includes(query) ||
      s.id.toLowerCase().includes(query) ||
      (teacher && teacher.name.toLowerCase().includes(query)) ||
      (learner && learner.name.toLowerCase().includes(query)) ||
      (s.locationOrLink && s.locationOrLink.toLowerCase().includes(query));

    if (bookingStatusFilter !== 'all') {
      return matchesSearch && s.status === bookingStatusFilter;
    }
    return matchesSearch;
  });

  // Filtered Proposals Data
  const filteredProposals = swapRequests.filter(r => {
    const sender = users.find(u => u.id === r.senderId);
    const receiver = users.find(u => u.id === r.receiverId);
    const query = proposalSearch.toLowerCase();

    const matchesSearch = 
      r.teachSkill.toLowerCase().includes(query) ||
      r.learnSkill.toLowerCase().includes(query) ||
      (sender && sender.name.toLowerCase().includes(query)) ||
      (receiver && receiver.name.toLowerCase().includes(query)) ||
      (r.notes && r.notes.toLowerCase().includes(query));

    if (proposalStatusFilter !== 'all') {
      return matchesSearch && r.status === proposalStatusFilter;
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Top Banner */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white text-slate-950 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> System Administrator
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Signed in as <strong className="text-white">{currentUser.email}</strong>
            </span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">Platform Control & Data Center</h1>
          <p className="text-xs text-slate-400">
            Full admin access to view user data, manage session bookings, audit barter requests, and maintain platform security.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => resetDataToDefault()}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset dataset to default seed state"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Data</span>
          </button>

          <button
            onClick={() => logout()}
            className="px-3 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Analytics Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('reports')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'reports'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-500" />
          <span>Reported Problems & Safety ({(problemReports || []).length})</span>
          {(problemReports || []).filter(r => r.status === 'Pending').length > 0 && (
            <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[9px] font-black">
              {(problemReports || []).filter(r => r.status === 'Pending').length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Manage All Bookings ({sessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('proposals')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'proposals'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Swap Proposals ({swapRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'users'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>View All Users Data ({users.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & ANALYTICS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Users</div>
              <div className="text-2xl md:text-3xl font-black text-slate-900">{users.length}</div>
              <div className="text-[10px] text-slate-500">{users.filter(u => u.isVerified).length} verified accounts</div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Bookings</div>
              <div className="text-2xl md:text-3xl font-black text-slate-900">{sessions.length}</div>
              <div className="text-[10px] text-slate-500">{sessions.filter(s => s.status === 'Completed').length} completed</div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Swap Proposals</div>
              <div className="text-2xl md:text-3xl font-black text-slate-900">{swapRequests.length}</div>
              <div className="text-[10px] text-slate-500">{swapRequests.filter(r => r.status === 'Accepted').length} accepted</div>
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-xs space-y-1">
              <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Certificates</div>
              <div className="text-2xl md:text-3xl font-black text-slate-900">{certificates.length}</div>
              <div className="text-[10px] text-slate-500">{reviews.length} user reviews</div>
            </div>

            <div 
              onClick={() => setActiveTab('reports')}
              className="bg-white p-4.5 rounded-2xl border border-rose-200 shadow-xs space-y-1 cursor-pointer hover:border-rose-400 transition-colors"
            >
              <div className="text-[11px] text-rose-600 font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Problems</span>
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <div className="text-2xl md:text-3xl font-black text-slate-900">{(problemReports || []).length}</div>
              <div className="text-[10px] font-bold text-rose-600">
                {(problemReports || []).filter(r => r.status === 'Pending').length} pending review
              </div>
            </div>
          </div>

          {/* Quick Actions & Platform Health */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Reported Problems & Safety Center</span>
                </h3>
                <button
                  onClick={() => setActiveTab('reports')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                >
                  View All ({(problemReports || []).length}) →
                </button>
              </div>
              <p className="text-xs text-slate-600">
                Audit confidential problem reports filed by users from chat conversations.
              </p>

              <div className="space-y-3">
                {(problemReports || []).length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 font-semibold">
                    No problem reports submitted currently.
                  </div>
                ) : (
                  (problemReports || []).slice(0, 3).map(rep => (
                    <div key={rep.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <div className="font-bold text-slate-900 flex items-center gap-2">
                          <span>{rep.category}</span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                            rep.status === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {rep.status}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[10px]">
                          By {rep.reporterName} • {rep.reportedUserName ? `Against ${rep.reportedUserName}` : 'Issue'}
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab('reports')}
                        className="px-2 py-1 rounded bg-slate-900 text-white font-bold text-[10px] cursor-pointer hover:bg-black"
                      >
                        Inspect
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-900" />
                <span>Recent Platform Activity Stream</span>
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {sessions.slice(0, 5).map(session => (
                  <div key={session.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">{session.skillName} Session</div>
                      <div className="text-slate-500 text-[10px]">
                        {session.date} at {session.time} • Status: <span className="font-bold text-slate-900">{session.status}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-[11px] font-bold text-black hover:underline"
                    >
                      Manage
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* TAB: REPORTED PROBLEMS & SAFETY */}
      {activeTab === 'reports' && (
        <AdminReportsTab
          reports={problemReports || []}
          users={users}
          swapRequests={swapRequests}
          onUpdateStatus={adminUpdateProblemReport}
          onDeleteReport={adminDeleteProblemReport}
          onToggleUserFlag={toggleUserReportedStatus}
          onDeleteUser={deleteUserAccount}
        />
      )}

      {/* TAB 2: MANAGE ALL BOOKINGS & SESSIONS */}
      {activeTab === 'bookings' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Manage All Platform Bookings & Sessions</h2>
              <p className="text-xs text-slate-500">View, update, reschedule, confirm attendance, or delete any user session booking.</p>
            </div>

            {/* Status Pills Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['all', 'Scheduled', 'Completed', 'Cancelled'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setBookingStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    bookingStatusFilter === st
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All Status' : st}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              placeholder="Search bookings by skill name, user name, booking ID, or meeting link..."
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-black font-medium"
            />
          </div>

          {/* Bookings List */}
          <div className="space-y-4">
            {filteredSessions.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-sm font-bold text-slate-700">No bookings match your current search/filter.</p>
              </div>
            ) : (
              filteredSessions.map(session => {
                const teacher = users.find(u => u.id === session.teacherId);
                const learner = users.find(u => u.id === session.learnerId);

                return (
                  <div key={session.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                    
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
                            #{session.id}
                          </span>
                          <span className="text-sm font-black text-slate-900">{session.skillName} Barter Session</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            session.status === 'Completed' ? 'bg-slate-900 text-white' :
                            session.status === 'Cancelled' ? 'bg-rose-100 text-rose-800' :
                            'bg-amber-100 text-amber-900'
                          }`}>
                            {session.status}
                          </span>
                        </div>
                        <div className="text-slate-500 text-[11px] mt-1 flex items-center gap-3">
                          <span>📅 {session.date} at {session.time}</span>
                          <span>📍 Mode: {session.meetingType}</span>
                        </div>
                      </div>

                      {/* Admin Quick Action Controls */}
                      <div className="flex items-center gap-2 shrink-0">
                        <select
                          value={session.status}
                          onChange={(e) => adminUpdateSessionStatus(session.id, e.target.value as SessionStatus)}
                          className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-900 focus:outline-none"
                        >
                          <option value="Scheduled">Scheduled</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => setEditingSession(session)}
                          className="p-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-black hover:bg-slate-100 font-bold"
                          title="Edit booking details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => adminDeleteSession(session.id)}
                          className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold"
                          title="Delete booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Participants info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Teacher / Expert</div>
                        <div className="font-bold text-slate-900">{teacher ? teacher.name : session.teacherId}</div>
                        <div className="text-slate-500 text-[10px]">{teacher?.email}</div>
                        <div className="text-[10px] mt-1">
                          Attendance: {session.teacherConfirmed ? <span className="font-bold text-black">✓ Confirmed</span> : <span className="text-slate-400">Pending</span>}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">Learner / Student</div>
                        <div className="font-bold text-slate-900">{learner ? learner.name : session.learnerId}</div>
                        <div className="text-slate-500 text-[10px]">{learner?.email}</div>
                        <div className="text-[10px] mt-1">
                          Attendance: {session.studentConfirmed ? <span className="font-bold text-black">✓ Confirmed</span> : <span className="text-slate-400">Pending</span>}
                        </div>
                      </div>
                    </div>

                    {/* Location / Meeting Link */}
                    <div className="flex items-center gap-2 text-slate-700 text-xs">
                      <span className="font-bold">Meeting Link / Address:</span>
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-900">
                        {session.locationOrLink}
                      </span>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* TAB 3: MANAGE SWAP PROPOSALS */}
      {activeTab === 'proposals' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Manage Swap Proposals & Barter Requests</h2>
              <p className="text-xs text-slate-500">Audit proposals sent between users, adjust statuses, or remove invalid proposals.</p>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['all', 'Pending', 'Accepted', 'Rejected', 'Completed'] as const).map(st => (
                <button
                  key={st}
                  onClick={() => setProposalStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    proposalStatusFilter === st
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {st === 'all' ? 'All Status' : st}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              placeholder="Search proposals by skill name, user name, or offer notes..."
              value={proposalSearch}
              onChange={(e) => setProposalSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-black font-medium"
            />
          </div>

          <div className="space-y-3">
            {filteredProposals.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500">
                No swap proposals found matching search query.
              </div>
            ) : (
              filteredProposals.map(req => {
                const sender = users.find(u => u.id === req.senderId);
                const receiver = users.find(u => u.id === req.receiverId);

                return (
                  <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="font-bold text-slate-900">
                        {sender ? sender.name : req.senderId} ➔ {receiver ? receiver.name : req.receiverId}
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={req.status}
                          onChange={(e) => adminUpdateSwapRequestStatus(req.id, e.target.value as RequestStatus)}
                          className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs font-bold text-slate-900"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>

                        <button
                          onClick={() => adminDeleteSwapRequest(req.id)}
                          className="p-1 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                      <div>
                        <span className="text-slate-400 font-bold">Skill Offered:</span>{' '}
                        <span className="font-extrabold text-black">{req.teachSkill}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold">Skill Requested:</span>{' '}
                        <span className="font-extrabold text-black">{req.learnSkill}</span>
                      </div>
                    </div>

                    {req.notes && (
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-700 italic">
                        "{req.notes}"
                      </div>
                    )}

                    {(req.refundNoticeSentToAdmin || req.status === 'Completed') && (
                      <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Skill Swap Completion Notice Received</span>
                          </div>
                          <p className="text-[11px] text-emerald-800 mt-0.5">
                            Teacher confirmed whole skill was taught. Verified completion certificate issued.
                          </p>
                        </div>
                        {req.adminRefundNoticeStatus === 'Pending' && (
                          <button
                            onClick={() => adminAcknowledgeRefundNotice(req.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] shrink-0"
                          >
                            Acknowledge Notice
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* TAB 4: VIEW ALL USERS DATA */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 animate-fade-in">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">All Registered Users Database</h2>
              <p className="text-xs text-slate-500">View complete user profiles, verify authentic members, flag fake accounts, or edit account details.</p>
            </div>

            {/* User Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {(['all', 'verified', 'flagged', 'admin'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setUserFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    userFilter === f
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {f === 'all' ? 'All Users' : f === 'verified' ? 'Verified Only' : f === 'flagged' ? 'Flagged Fake' : 'Admins'}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input 
              type="text"
              placeholder="Search users by name, email, city, or skills..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-black font-medium"
            />
          </div>

          {/* Users Table / Grid */}
          <div className="space-y-4">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-500">
                No users found matching search criteria.
              </div>
            ) : (
              filteredUsers.map(u => (
                <div 
                  key={u.id}
                  className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                >
                  
                  {/* Left: User Profile Brief */}
                  <div className="flex items-start gap-3.5">
                    {hasUserPhoto(u.photo) ? (
                      <img 
                        src={u.photo} 
                        alt={u.name} 
                        className="w-11 h-11 rounded-2xl object-cover border border-slate-300 shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-11 h-11 rounded-2xl bg-white border border-slate-300 flex items-center justify-center text-slate-700 shrink-0 shadow-xs font-bold text-sm">
                        <UserIcon className="w-5 h-5 text-slate-600" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-slate-900">{u.name}</span>
                        {u.isVerified && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-900 text-white font-bold text-[9px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Verified
                          </span>
                        )}
                        {u.isVerifiedMentor && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white font-extrabold text-[9px] flex items-center gap-1 shadow-xs">
                            <Award className="w-3 h-3 text-amber-100" /> Verified Mentor
                          </span>
                        )}
                        {u.isAdmin && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500 text-white font-black text-[9px] uppercase">
                            Admin
                          </span>
                        )}
                        {u.isReportedFake && (
                          <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 font-extrabold text-[9px]">
                            Flagged Fake
                          </span>
                        )}
                      </div>

                      <div className="text-slate-600 font-medium text-[11px] flex flex-wrap items-center gap-3">
                        <span>📧 {u.email}</span>
                        <span>🏙️ {u.city}</span>
                        <span>⭐ {u.rating} ({u.totalReviews} reviews)</span>
                        <span>⚙️ Mode: {u.mode}</span>
                      </div>

                      {/* Skills taught & learned */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Teaches:</span>
                        {u.teachSkills.map(sk => (
                          <span key={sk.id} className="bg-slate-200 text-slate-900 px-2 py-0.5 rounded text-[10px] font-bold">
                            {sk.skillName} ({sk.level})
                          </span>
                        ))}

                        <span className="text-[10px] font-bold text-slate-400 uppercase ml-2">Wants to Learn:</span>
                        {u.learnSkills.map(sk => (
                          <span key={sk.id} className="bg-white border border-slate-300 text-slate-900 px-2 py-0.5 rounded text-[10px] font-bold">
                            {sk.skillName}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 justify-end flex-wrap">
                    <button
                      onClick={() => setSelectedUserDetail(u)}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 flex items-center gap-1 shadow-2xs"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-600" />
                      <span>View Data</span>
                    </button>

                    <button
                      onClick={() => setEditingUser(u)}
                      className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-800 flex items-center gap-1 shadow-2xs"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-slate-600" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => verifyUserAccount(u.id)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold border transition-colors ${
                        u.isVerified ? 'bg-slate-200 text-slate-800 border-slate-300' : 'bg-black text-white border-black'
                      }`}
                    >
                      {u.isVerified ? 'Verified' : 'Verify'}
                    </button>

                    <button
                      onClick={() => toggleVerifiedMentorBadge(u.id)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold border transition-colors flex items-center gap-1 ${
                        u.isVerifiedMentor 
                          ? 'bg-amber-500 text-white border-amber-600 shadow-xs' 
                          : 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                      }`}
                      title="Only admins can award or revoke the Verified Mentor badge"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>{u.isVerifiedMentor ? 'Verified Mentor' : 'Give Mentor Badge'}</span>
                    </button>

                    <button
                      onClick={() => toggleUserReportedStatus(u.id)}
                      className={`px-2.5 py-1.5 rounded-xl font-bold border ${
                        u.isReportedFake 
                          ? 'bg-amber-100 text-amber-900 border-amber-300' 
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {u.isReportedFake ? 'Unflag' : 'Flag Fake'}
                    </button>

                    <button
                      onClick={() => deleteUserAccount(u.id)}
                      className="px-2.5 py-1.5 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

      {/* MODAL 1: VIEW USER DETAILED DATA */}
      {selectedUserDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-5 text-slate-900 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedUserDetail(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-black"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              {hasUserPhoto(selectedUserDetail.photo) ? (
                <img 
                  src={selectedUserDetail.photo} 
                  alt={selectedUserDetail.name} 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-900 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-900 flex items-center justify-center text-slate-800 shadow-md">
                  <UserIcon className="w-8 h-8 text-slate-600" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <span>{selectedUserDetail.name}</span>
                  {selectedUserDetail.isVerified && <CheckCircle2 className="w-4 h-4 text-slate-900" />}
                </h3>
                <p className="text-xs text-slate-500 font-medium">{selectedUserDetail.email}</p>
                <div className="text-[11px] font-bold text-slate-700 mt-0.5">
                  ID: <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{selectedUserDetail.id}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs border-t border-slate-200 pt-4">
              <div>
                <span className="font-bold text-slate-500 block mb-1">Biography</span>
                <p className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800">
                  {selectedUserDetail.bio || 'No bio provided.'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block">City & Mode</span>
                  <span className="font-extrabold text-slate-900">{selectedUserDetail.city} ({selectedUserDetail.mode})</span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <span className="text-slate-400 font-bold block">Availability</span>
                  <span className="font-extrabold text-slate-900">{selectedUserDetail.availability}</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
                <span className="text-slate-400 font-bold block">Languages Spoken</span>
                <div className="flex flex-wrap gap-1">
                  {selectedUserDetail.languages.map(lang => (
                    <span key={lang} className="bg-white border border-slate-200 px-2 py-0.5 rounded font-semibold text-slate-800">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Associated Bookings */}
              <div>
                <span className="font-bold text-slate-900 block mb-2">User's Associated Sessions ({
                  sessions.filter(s => s.teacherId === selectedUserDetail.id || s.learnerId === selectedUserDetail.id).length
                })</span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {sessions.filter(s => s.teacherId === selectedUserDetail.id || s.learnerId === selectedUserDetail.id).length === 0 ? (
                    <p className="text-slate-400 italic">No session bookings for this user.</p>
                  ) : (
                    sessions.filter(s => s.teacherId === selectedUserDetail.id || s.learnerId === selectedUserDetail.id).map(s => (
                      <div key={s.id} className="p-2 rounded-lg bg-slate-100 border border-slate-200 text-[11px] flex justify-between">
                        <span>{s.skillName} ({s.date})</span>
                        <span className="font-bold text-slate-900">{s.status}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: EDIT USER DATA */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900">
            <button
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900">Edit User Details</h3>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                adminUpdateUser(editingUser.id, editingUser);
                setEditingUser(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input 
                    type="text" 
                    value={editingUser.city}
                    onChange={(e) => setEditingUser({ ...editingUser, city: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role Permission</label>
                  <select
                    value={editingUser.isAdmin ? 'admin' : 'user'}
                    onChange={(e) => setEditingUser({ ...editingUser, isAdmin: e.target.value === 'admin' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900"
                  >
                    <option value="user">Regular User</option>
                    <option value="admin">Admin Privilege</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Verified Mentor Badge (Admin)</label>
                  <select
                    value={editingUser.isVerifiedMentor ? 'true' : 'false'}
                    onChange={(e) => setEditingUser({ ...editingUser, isVerifiedMentor: e.target.value === 'true' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900"
                  >
                    <option value="false">Standard Member (No Badge)</option>
                    <option value="true">Verified Mentor Badge Active</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Profile Photo URL (Leave empty for default avatar icon)</label>
                <input 
                  type="text" 
                  value={editingUser.photo || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, photo: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bio</label>
                <textarea 
                  rows={2}
                  value={editingUser.bio}
                  onChange={(e) => setEditingUser({ ...editingUser, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: EDIT BOOKING DETAILS */}
      {editingSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4 text-slate-900">
            <button
              onClick={() => setEditingSession(null)}
              className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-slate-900">Edit Booking Details</h3>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                adminUpdateSessionDetails(editingSession.id, editingSession);
                setEditingSession(null);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Skill Name</label>
                <input 
                  type="text" 
                  value={editingSession.skillName}
                  onChange={(e) => setEditingSession({ ...editingSession, skillName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Date</label>
                  <input 
                    type="date" 
                    value={editingSession.date}
                    onChange={(e) => setEditingSession({ ...editingSession, date: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Time</label>
                  <input 
                    type="time" 
                    value={editingSession.time}
                    onChange={(e) => setEditingSession({ ...editingSession, time: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meeting Link or Location</label>
                <input 
                  type="text" 
                  value={editingSession.locationOrLink}
                  onChange={(e) => setEditingSession({ ...editingSession, locationOrLink: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-medium text-slate-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <select
                  value={editingSession.status}
                  onChange={(e) => setEditingSession({ ...editingSession, status: e.target.value as SessionStatus })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-900"
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSession(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-black text-white font-bold"
                >
                  Save Booking Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
