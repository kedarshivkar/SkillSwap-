import React, { useState } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import heroIllustration from '../assets/images/skill_swap_hero_1788706632414.jpg';
import { 
  UserPlus, Sparkles, Search, Send, MessageSquare, 
  Calendar, QrCode, Star, Award, ArrowRight, CheckCircle2,
  Zap, Users, ShieldCheck, HeartHandshake, Code, Music, Palette, BookOpen, User,
  Lock, Unlock, Phone, Mail, IndianRupee, RotateCcw, XCircle, ArrowRightLeft,
  UserCheck, TrendingUp, Quote, Play, GraduationCap
} from 'lucide-react';

interface HowItWorksPageProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ onOpenAuth }) => {
  const { setActiveView, users, calculateMatch } = useSkillSwap();
  // Find Rahul and Priya
  const rahul = users.find(u => u.id === 'usr_rahul') || users[0];
  const priya = users.find(u => u.id === 'usr_priya') || users[1];

  const steps = [
    {
      step: '01',
      title: 'Register & Create Profile',
      icon: UserPlus,
      desc: 'Register with your name, city, availability, and spoken languages. Add skills you can teach and skills you want to learn.',
      actionText: 'Register / Create Profile',
      action: () => onOpenAuth('register')
    },
    {
      step: '02',
      title: 'Find a Match',
      icon: Search,
      desc: 'Our intelligent system automatically suggests compatible users with 100% reciprocal skills or complementary matches.',
      actionText: 'Find Matches',
      action: () => setActiveView('search')
    },
    {
      step: '03',
      title: 'Send Swap Request',
      icon: Send,
      desc: 'Send a 1-click swap proposal selecting the skill you want to teach and learn in exchange.',
      actionText: 'Send Request',
      action: () => setActiveView('search')
    },
    {
      step: '04',
      title: 'Chat & Discuss',
      icon: MessageSquare,
      desc: 'Once accepted, chat inside the app for free. Discuss skills, experience level, availability, and session expectations.',
      actionText: 'Open Free Chat',
      action: () => setActiveView('messages')
    },
    {
      step: '05',
      title: 'Decide & Coordinate',
      icon: CheckCircle2,
      desc: 'If either user is not comfortable after chatting, cancel the request at any time with zero hassle.',
      actionText: 'Coordinate in Chat',
      action: () => setActiveView('messages')
    },
    {
      step: '06',
      title: 'Schedule the Session',
      icon: Calendar,
      desc: 'Pick your preferred date, time, and generate an instant Google Meet video call link directly in the schedule manager.',
      actionText: 'Schedule Session',
      action: () => setActiveView('schedule')
    },
    {
      step: '07',
      title: 'Attend Live Session',
      icon: Users,
      desc: 'Both users join the scheduled video call or in-person meetup, exchange knowledge, and practice skills together.',
      actionText: 'Attend Session',
      action: () => setActiveView('schedule')
    },
    {
      step: '08',
      title: 'Mark Done Learning',
      icon: Award,
      desc: 'When you have learned the target skill, mark "Done Learning" inside the chat room for mutual verification.',
      actionText: 'Verify Session',
      action: () => setActiveView('messages')
    },
    {
      step: '09',
      title: 'Partner Verification',
      icon: ShieldCheck,
      desc: 'The partner confirms the skill was successfully taught with 1 click to complete the swap officially.',
      actionText: 'Complete Swap',
      action: () => setActiveView('messages')
    },
    {
      step: '10',
      title: 'Earn Verified Certificate',
      icon: Award,
      desc: 'Download your official SkillSwap completion certificate with a verifiable QR code to showcase on your profile.',
      actionText: 'View Certificates',
      action: () => setActiveView('profile')
    },
    {
      step: '11',
      title: 'Rate and Review',
      icon: Star,
      desc: 'Rate each other with 5-star feedback to build platform trust, boost reputation, and earn mentor badges.',
      actionText: 'Rate & Review',
      action: () => setActiveView('schedule')
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* Main Hero Section matching user reference screenshot */}
      <section className="relative overflow-hidden pt-6 pb-10 lg:pt-10 lg:pb-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-5 space-y-6 text-left z-10">
              
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold">
                <span>Peer-to-Peer Skill Exchange</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold text-slate-900 tracking-tight leading-[1.12] font-['Outfit',sans-serif]">
                Exchange Skills.<br />
                Expand Knowledge.<br />
                <span className="text-blue-600">Build Connections.</span>
              </h1>

              {/* Subheading - Balanced medium-semibold reading weight */}
              <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-semibold max-w-lg">
                SkillSwap is a platform where you can teach what you know and learn what you love, without money.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all hover:translate-y-[-1px] cursor-pointer"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.2]" />
                </button>

                <button
                  onClick={() => setActiveView('search')}
                  className="px-6 py-3.5 rounded-xl bg-white hover:bg-blue-50/50 text-blue-600 font-bold text-sm flex items-center gap-2 border border-blue-600 hover:border-blue-700 transition-all cursor-pointer shadow-xs"
                >
                  <span>Explore Skills</span>
                </button>
              </div>

            </div>

            {/* Right Illustration Column matching screenshot */}
            <div className="lg:col-span-7 flex items-center justify-center lg:justify-end relative">
              <div className="w-full max-w-xl lg:max-w-2xl">
                <img 
                  src={heroIllustration} 
                  alt="Students collaborating and exchanging skills" 
                  className="w-full h-auto object-contain select-none"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4-Feature Highlight Strip matching screenshot */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 text-slate-800">
          
          {/* Feature 1 */}
          <div className="flex items-center gap-4 pt-2 sm:pt-0 sm:px-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="16" cy="11" r="3.5" stroke="#2563EB" strokeWidth="2" />
                <path d="M10 23C10 19.5 12.5 17.5 16 17.5C19.5 17.5 22 19.5 22 23" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
                <circle cx="8" cy="13" r="2.8" stroke="#2563EB" strokeWidth="1.8" />
                <path d="M4 22C4 19.5 6 18 8.5 18" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
                <circle cx="24" cy="13" r="2.8" stroke="#2563EB" strokeWidth="1.8" />
                <path d="M23.5 18C26 18 28 19.5 28 22" stroke="#2563EB" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-slate-900 text-sm">Peer-to-Peer Learning</h4>
              <p className="text-xs text-slate-700 font-medium leading-snug">Teach and learn directly from real people.</p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-slate-900 text-sm">Skill Exchange</h4>
              <p className="text-xs text-slate-700 font-medium leading-snug">Exchange skills that benefit both sides.</p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-slate-900 text-sm">Learn Anything</h4>
              <p className="text-xs text-slate-700 font-medium leading-snug">Explore a wide range of skills taught by experts.</p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-center gap-4 pt-4 sm:pt-0 sm:px-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-slate-900 text-sm">Trusted Community</h4>
              <p className="text-xs text-slate-700 font-medium leading-snug">Safe, respectful and verified learning environment.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Step-by-Step 11-Step Process Guide */}
      <section id="step-by-step-workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-4">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200/80 text-xs font-bold uppercase tracking-wider shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>How It Works</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-['Outfit',sans-serif] leading-tight">
            How It Works: <span className="text-blue-600">Step-by-Step Skill Swap</span>
          </h2>
          <p className="text-slate-700 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Follow these 11 simple steps to register, discover perfect matches, chat, schedule live video sessions, and exchange skills with complete transparency!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-extrabold text-blue-600">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center font-bold shadow-xs">
                      <Icon className="w-5 h-5 stroke-[2]" />
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-lg mb-2 font-['Outfit',sans-serif] tracking-tight">{item.title}</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={item.action}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-blue-600 hover:text-white text-slate-800 border border-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <span>{item.actionText}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[2.2]" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety & Mutual Learning Guarantee Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 text-slate-900">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-600 text-xs font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Safe & Verified Learning System
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight">How Skill Verification & Sessions Work</h2>
              <p className="text-sm text-slate-600 font-medium">
                SkillSwap is 100% free and peer-to-peer. Members exchange real skills through interactive video sessions and mutual verification.
              </p>
            </div>

            <button
              onClick={() => setActiveView('messages')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold tracking-wider flex items-center gap-2 shadow-sm shadow-blue-600/20 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-white" />
              <span>Open Chat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Safe Video & Real-time Scheduling */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span>INTEGRATED VIDEO & CALENDAR SCHEDULING</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed font-medium">
                <li>Pick suitable dates and times with our real-time interactive calendar.</li>
                <li>Generate instant Google Meet call links directly in the chat room.</li>
                <li>Coordinate session agendas and exchange preparation materials with ease.</li>
              </ul>
            </div>

            {/* Verification & Official Certificates */}
            <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <Award className="w-4 h-4 text-blue-600" />
                <span>MUTUAL VERIFICATION & CERTIFICATES</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed font-medium">
                <li>Attend your scheduled peer learning session and exchange knowledge.</li>
                <li>Mark "Done Learning" to prompt peer confirmation.</li>
                <li><strong className="text-blue-600 font-bold">Earn a verifiable Skill Certificate</strong> with unique QR codes to showcase on your profile.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Interactive 100% Perfect Match Demonstration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6 text-slate-900">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
                <HeartHandshake className="w-4 h-4" /> Live Matchmaker Example
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight">How The Matchmaking Engine Works</h2>
              <p className="text-sm text-slate-500 font-medium">See how two people with complementary skills get matched automatically at 100%.</p>
            </div>

            <div className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200/80">
              Rahul ↔ Priya (Python / Guitar)
            </div>
          </div>

          {/* Demo Card Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Person A */}
            <div className="md:col-span-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs font-extrabold text-lg">
                  R
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{rahul?.name || 'Rahul Sharma'}</h3>
                  <p className="text-xs text-slate-500">{rahul?.city || 'Mumbai'} • {rahul?.experienceLevel || 'Expert'} Level</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-medium">
                <div>
                  <span className="text-slate-500 block mb-1 uppercase text-[10px] font-bold">Can Teach:</span>
                  <span className="px-3 py-1 rounded-lg bg-blue-100/70 text-blue-700 border border-blue-200 font-bold inline-block shadow-2xs">
                    Python Programming
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1 uppercase text-[10px] font-bold">Wants to Learn:</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 inline-block">
                    Acoustic Guitar
                  </span>
                </div>
              </div>
            </div>

            {/* Match Badge Center */}
            <div className="md:col-span-2 text-center space-y-2">
              <div className="inline-flex flex-col items-center justify-center p-4 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
                <span className="text-3xl font-extrabold">100%</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-100 mt-1">Perfect Match</span>
              </div>
              <div className="text-[11px] text-slate-500 font-bold">Reciprocal Exchange</div>
            </div>

            {/* Person B */}
            <div className="md:col-span-5 bg-slate-50/80 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs font-extrabold text-lg">
                  P
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{priya?.name || 'Priya Patel'}</h3>
                  <p className="text-xs text-slate-500">{priya?.city || 'Mumbai'} • {priya?.experienceLevel || 'Expert'} Level</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-medium">
                <div>
                  <span className="text-slate-500 block mb-1 uppercase text-[10px] font-bold">Can Teach:</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold inline-block shadow-2xs">
                    Acoustic Guitar
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1 uppercase text-[10px] font-bold">Wants to Learn:</span>
                  <span className="px-3 py-1 rounded-lg bg-blue-100/70 text-blue-700 font-bold border border-blue-200 inline-block">
                    Python Programming
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Verified Mentor Badge Feature Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/50 to-blue-50/70 rounded-3xl p-8 border border-blue-100/80 shadow-sm text-slate-900 space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200">
                <Award className="w-4 h-4 text-blue-600" />
                Verified Mentor Badge Program
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-['Outfit',sans-serif]">
                Earn the Official <span className="text-blue-600">Verified Mentor Badge</span>
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed font-normal">
                SkillSwap rewards active, trustworthy mentors who share their expertise properly with members.
              </p>
            </div>

            {/* Visual Badge Preview */}
            <div className="bg-white border border-blue-200/80 p-5 rounded-2xl text-center space-y-2 shrink-0 w-full sm:w-auto shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center mx-auto shadow-md font-bold">
                <Award className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs border border-blue-200">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <span>Verified Mentor</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm text-slate-900">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Built for Safety & Quality
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit',sans-serif] tracking-tight">Safe, Verified & Community-Driven</h3>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Profiles feature verified badges, rating histories, QR attendance confirmation, and official skill certificates.
            </p>
          </div>

          <button
            onClick={() => onOpenAuth('register')}
            className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-md shadow-blue-600/20 transition-all shrink-0 cursor-pointer"
          >
            Register / Create Profile
          </button>
        </div>
      </section>

    </div>
  );
};

