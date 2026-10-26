import React, { useState } from 'react';
import { SkillSwapProvider, useSkillSwap } from './context/SkillSwapContext';
import { Navbar } from './components/Navbar';
import { HowItWorksPage } from './components/HowItWorksPage';
import { SearchSkillsPage } from './components/SearchSkillsPage';
import { DashboardPage } from './components/DashboardPage';
import { ChatPage } from './components/ChatPage';
import { CalendarSchedulePage } from './components/CalendarSchedulePage';
import { LeaderboardPage } from './components/LeaderboardPage';
import { ProfilePage } from './components/ProfilePage';
import { AdminPanelPage } from './components/AdminPanelPage';
import { AIAdvisorPage } from './components/AIAdvisorPage';

import { AuthModal } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { SwapRequestModal } from './components/SwapRequestModal';
import { QRAttendanceModal } from './components/QRAttendanceModal';
import { ScheduleSessionModal } from './components/ScheduleSessionModal';
import { RatingCertificateModal } from './components/RatingCertificateModal';
import { SkillSwapLogo } from './components/SkillSwapLogo';
import { User as UserType } from './types';

const MainContent: React.FC = () => {
  const { activeView, currentUser } = useSkillSwap();

  // Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const [selectedProfileUser, setSelectedProfileUser] = useState<UserType | null>(null);
  const [selectedSwapUser, setSelectedSwapUser] = useState<UserType | null>(null);

  const [activeScheduleSwapRequestId, setActiveScheduleSwapRequestId] = useState<string | null>(null);
  const [activeQRSwapRequestId, setActiveQRSwapRequestId] = useState<string | null>(null);
  const [activeRatingSessionId, setActiveRatingSessionId] = useState<string | null>(null);

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleSelectUserForSwap = (user: UserType) => {
    if (!currentUser) {
      handleOpenAuth('login');
      return;
    }
    setSelectedSwapUser(user);
  };

  return (
    <div 
      className={`min-h-screen bg-[#F8FAFC] text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white flex flex-col ${
        activeView === 'messages' ? 'h-screen max-h-screen overflow-hidden' : 'justify-between'
      } relative`}
    >
      
      <div className={activeView === 'messages' ? 'h-full flex flex-col flex-1 overflow-hidden min-h-0' : ''}>
        {/* Navigation Bar */}
        <Navbar onOpenAuth={handleOpenAuth} />

        {/* View Router */}
        <main className={activeView === 'messages' ? 'flex-1 min-h-0 overflow-hidden flex flex-col' : 'pb-12'}>
          {activeView === 'howItWorks' && (
            <HowItWorksPage onOpenAuth={handleOpenAuth} />
          )}

          {activeView === 'search' && (
            <SearchSkillsPage 
              onSelectUserForSwap={handleSelectUserForSwap}
              onOpenUserProfile={(u) => setSelectedProfileUser(u)}
            />
          )}

          {(activeView === 'dashboard' || activeView === 'progress') && (
            <DashboardPage 
              initialTab={activeView === 'progress' ? 'progress' : undefined}
              onSelectUserForSwap={handleSelectUserForSwap}
              onOpenUserProfile={(u) => setSelectedProfileUser(u)}
            />
          )}

          {activeView === 'messages' && (
            <ChatPage 
              onOpenScheduleModal={(reqId) => setActiveScheduleSwapRequestId(reqId)}
              onOpenQRModal={(reqId) => setActiveQRSwapRequestId(reqId)}
            />
          )}

          {activeView === 'aiAdvisor' && (
            <AIAdvisorPage 
              onSelectUserForSwap={handleSelectUserForSwap}
              onOpenUserProfile={(u) => setSelectedProfileUser(u)}
            />
          )}

          {activeView === 'schedule' && (
            <CalendarSchedulePage 
              onOpenQRModal={(reqId) => setActiveQRSwapRequestId(reqId)}
              onOpenRatingModal={(sesId) => setActiveRatingSessionId(sesId)}
            />
          )}

          {activeView === 'leaderboard' && <LeaderboardPage />}

          {activeView === 'profile' && (
            <ProfilePage onOpenAuth={handleOpenAuth} />
          )}

          {activeView === 'admin' && <AdminPanelPage />}
        </main>
      </div>

      {/* Footer (hidden in messages view for full-screen chat layout) */}
      {activeView !== 'messages' && (
        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 shrink-0">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center space-y-2">
            <SkillSwapLogo className="justify-center" />
            <p className="text-slate-500 max-w-md text-center pt-1 font-medium">
              Gain valuable skills without expensive course fees. Connect, chat, and learn through skill exchange.
            </p>
          </div>
        </footer>
      )}

      {/* Global Modals */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      <UserProfileModal 
        user={selectedProfileUser}
        onClose={() => setSelectedProfileUser(null)}
        onRequestSwap={(u) => {
          setSelectedProfileUser(null);
          handleSelectUserForSwap(u);
        }}
      />

      <SwapRequestModal 
        receiver={selectedSwapUser}
        onClose={() => setSelectedSwapUser(null)}
      />

      <ScheduleSessionModal
        swapRequestId={activeScheduleSwapRequestId}
        onClose={() => setActiveScheduleSwapRequestId(null)}
        onOpenQRModal={(reqId) => setActiveQRSwapRequestId(reqId)}
      />

      <QRAttendanceModal 
        swapRequestId={activeQRSwapRequestId}
        onClose={() => setActiveQRSwapRequestId(null)}
        onOpenSchedule={(reqId) => setActiveScheduleSwapRequestId(reqId)}
      />

      <RatingCertificateModal 
        sessionId={activeRatingSessionId}
        onClose={() => setActiveRatingSessionId(null)}
      />

    </div>
  );
};

export default function App() {
  return (
    <SkillSwapProvider>
      <MainContent />
    </SkillSwapProvider>
  );
}
