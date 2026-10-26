import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  ArrowRightLeft, Search, LayoutDashboard, MessageSquare, 
  Calendar, Trophy, ShieldCheck, User as UserIcon, LogOut, 
  Bell, ChevronDown, CheckCircle, Sparkles, HelpCircle,
  Menu, X, TrendingUp
} from 'lucide-react';

import { hasUserPhoto } from '../types';
import { SkillSwapLogo } from './SkillSwapLogo';

interface NavbarProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth }) => {
  const { 
    currentUser, users, activeView, setActiveView, 
    loginAsUser, logout, notifications, resetDataToDefault
  } = useSkillSwap();

  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => n.userId === currentUser?.id && !n.read);

  const navItems = [
    { id: 'howItWorks', label: 'Home', icon: HelpCircle },
    { id: 'search', label: 'Browse Skills', icon: Search },
    { id: 'aiAdvisor', label: 'AI Advisor', icon: Sparkles },
    { id: 'messages', label: 'Messages', icon: MessageSquare, requiresAuth: true },
    { id: 'schedule', label: 'Schedule', icon: Calendar, requiresAuth: true },
    { id: 'progress', label: 'Progress & Ratings', icon: TrendingUp, requiresAuth: true },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, requiresAuth: true },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: UserIcon, requiresAuth: true },
    { id: 'admin', label: 'Admin Portal', icon: ShieldCheck, requiresAdmin: true },
  ];

  const visibleNavItems = navItems.filter(item => {
    if (item.requiresAuth && !currentUser) return false;
    if (item.requiresAdmin && !currentUser?.isAdmin) return false;
    return true;
  });

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 text-slate-800 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo & Name matching reference screenshot */}
          <div 
            onClick={() => {
              setActiveView('howItWorks');
              setMobileMenuOpen(false);
            }}
            className="cursor-pointer group select-none shrink-0"
          >
            <SkillSwapLogo />
          </div>

          {/* Center Nav Links (Desktop) matching reference screenshot */}
          <nav className="hidden lg:flex items-center gap-6">
            {visibleNavItems.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`text-sm tracking-wide transition-colors cursor-pointer relative py-2 ${
                    isActive 
                      ? 'text-blue-600 font-bold' 
                      : 'text-slate-600 hover:text-blue-600 font-medium'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Notifications Bell */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className="relative p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200"
                >
                  <Bell className="w-4 h-4 text-slate-600" />
                  {unreadNotifs.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white animate-pulse" />
                  )}
                </button>

                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 text-xs">
                    <div className="font-bold text-slate-900 border-b border-slate-100 pb-2 mb-2 flex justify-between items-center">
                      <span>Notifications</span>
                      <span className="text-blue-600 font-semibold">{unreadNotifs.length} new</span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {notifications.filter(n => n.userId === currentUser.id).length === 0 ? (
                        <p className="text-slate-400 text-center py-4">No notifications yet.</p>
                      ) : (
                        notifications.filter(n => n.userId === currentUser.id).map(n => (
                          <div 
                            key={n.id}
                            onClick={() => {
                              if (n.linkTo) setActiveView(n.linkTo);
                              setShowNotifDropdown(false);
                            }}
                            className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-100 cursor-pointer transition-colors"
                          >
                            <div className="font-semibold text-blue-600 mb-0.5">{n.title}</div>
                            <div className="text-slate-700">{n.message}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{n.date}</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth Buttons */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveView('profile')}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                  title="View & Edit Profile"
                >
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold overflow-hidden shrink-0 shadow-xs">
                    {hasUserPhoto(currentUser.photo) ? (
                      <img src={currentUser.photo} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className="hidden sm:inline font-bold text-slate-800">{currentUser.name.split(' ')[0]}</span>
                </button>
                <button
                  onClick={logout}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Sign out"
                >
                  <LogOut className="w-3.5 h-3.5 text-slate-500" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-blue-600 hover:bg-blue-50 border border-blue-600 transition-colors cursor-pointer"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 lg:hidden transition-colors cursor-pointer ml-1"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Scrollable Bar */}
      <div className="lg:hidden border-t border-slate-200 bg-slate-50 px-3 py-2 overflow-x-auto flex items-center gap-2 scrollbar-none shadow-xs">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-xs font-extrabold' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 p-4 space-y-2 shadow-xl">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 px-2">
            Navigation Pages
          </div>
          <div className="grid grid-cols-1 gap-1">
            {visibleNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold w-full transition-all cursor-pointer min-h-[44px] ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-extrabold' 
                      : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

    </header>
  );
};
