import React, { useState, useRef } from 'react';
import { useSkillSwap } from '../context/SkillSwapContext';
import { 
  User as UserIcon, Camera, Upload, Trash2, Plus, CheckCircle, 
  Award, ShieldCheck, Star, MapPin, Calendar, BookOpen, 
  Code, Globe, Clock, Sparkles, FileText, ExternalLink,
  Eye, Download, RefreshCw, X, AlertCircle, Image as ImageIcon
} from 'lucide-react';
import { SkillLevel, MeetingMode, Certificate, hasUserPhoto } from '../types';

interface ProfilePageProps {
  onOpenAuth?: (mode: 'login' | 'register') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenAuth }) => {
  const { 
    currentUser, updateProfile, addSkill, removeSkill, 
    certificates, addCustomCertificate, deleteCertificate 
  } = useSkillSwap();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const certFileInputRef = useRef<HTMLInputElement>(null);

  // Profile Edit State
  const [name, setName] = useState(currentUser?.name || '');
  const [city, setCity] = useState(currentUser?.city || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [experienceLevel, setExperienceLevel] = useState<SkillLevel>(currentUser?.experienceLevel || 'Intermediate');
  const [mode, setMode] = useState<MeetingMode>(currentUser?.mode || 'Online');
  const [availability, setAvailability] = useState(currentUser?.availability || '');
  const [languagesText, setLanguagesText] = useState((currentUser?.languages || ['English']).join(', '));
  const [photoPreview, setPhotoPreview] = useState(currentUser?.photo || '');

  // Notifications / UI state
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // New Skill inline states
  const [showAddTeachModal, setShowAddTeachModal] = useState(false);
  const [showAddLearnModal, setShowAddLearnModal] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel>('Intermediate');
  const [newSkillCategory, setNewSkillCategory] = useState('Technology');

  // Certificate Upload State
  const [certSkillName, setCertSkillName] = useState('');
  const [certIssuer, setCertIssuer] = useState('');
  const [certIssueDate, setCertIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [certCode, setCertCode] = useState('');
  const [certFilePreview, setCertFilePreview] = useState<string | null>(null);
  const [certUploading, setCertUploading] = useState(false);
  const [certSuccessMsg, setCertSuccessMsg] = useState('');

  // Lightbox / Certificate viewer modal
  const [viewingCert, setViewingCert] = useState<Certificate | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-slate-200 rounded-2xl p-10 max-w-lg mx-auto space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
            <UserIcon className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Sign In to Access Profile</h2>
          <p className="text-sm text-slate-500">
            Please log in or create an account to edit your profile, manage skills, and upload your learned skill certificates.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button 
              onClick={() => onOpenAuth && onOpenAuth('login')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button 
              onClick={() => onOpenAuth && onOpenAuth('register')}
              className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-colors cursor-pointer"
            >
              Create Free Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  const myCertificates = certificates.filter(c => c.userId === currentUser.id);

  // Handle Profile Photo Upload
  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be under 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPhotoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccessMsg('');

    const langs = languagesText.split(',').map(l => l.trim()).filter(Boolean);

    await updateProfile({
      name,
      city,
      bio,
      experienceLevel,
      mode,
      availability,
      languages: langs.length > 0 ? langs : ['English'],
      photo: photoPreview
    });

    setIsSaving(false);
    setSaveSuccessMsg('Profile information & avatar updated successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  // Add Skill Handler
  const handleAddSkillSubmit = (type: 'Teach' | 'Learn') => {
    if (!newSkillName.trim()) return;
    addSkill(newSkillName.trim(), newSkillLevel, type, newSkillCategory);
    setNewSkillName('');
    if (type === 'Teach') setShowAddTeachModal(false);
    else setShowAddLearnModal(false);
  };

  // Handle Certificate Document Upload File
  const handleCertFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert("Certificate file size should be under 8MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setCertFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload Certificate Submit Handler
  const handleUploadCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certSkillName.trim()) {
      alert("Please enter the skill name for this certificate.");
      return;
    }

    setCertUploading(true);
    setCertSuccessMsg('');

    await addCustomCertificate({
      skillName: certSkillName.trim(),
      issuer: certIssuer.trim() || 'Verified Institution / Mentor',
      issueDate: certIssueDate,
      certificateCode: certCode.trim() || undefined,
      certificateUrl: certFilePreview || undefined
    });

    setCertUploading(false);
    setCertSuccessMsg('Skill certificate uploaded successfully!');
    setCertSkillName('');
    setCertIssuer('');
    setCertCode('');
    setCertFilePreview(null);
    if (certFileInputRef.current) certFileInputRef.current.value = '';

    setTimeout(() => setCertSuccessMsg(''), 5000);
  };



  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 relative overflow-hidden shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-3.5 py-1 rounded-full">
              <UserIcon className="w-3.5 h-3.5" /> My Member Profile
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              {currentUser.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Manage your personal info, avatar picture, teach/learn skills, and upload verified learned skill certificates.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-xl font-bold text-amber-600">{currentUser.rating.toFixed(1)} ★</div>
              <div className="text-[10px] text-slate-500 font-medium">Community Rating</div>
            </div>
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-xl font-bold text-blue-600">{currentUser.teachSkills?.length || 0}</div>
              <div className="text-[10px] text-slate-500 font-medium">Teaching Skills</div>
            </div>
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-xl font-bold text-slate-900">{currentUser.learnSkills?.length || 0}</div>
              <div className="text-[10px] text-slate-500 font-medium">Learning Skills</div>
            </div>
            <div className="text-center px-3">
              <div className="text-xl font-bold text-slate-900">{myCertificates.length}</div>
              <div className="text-[10px] text-slate-500 font-medium">Certificates</div>
            </div>
          </div>
        </div>
      </div>

      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Avatar & Basic Information Form */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Card 1: Avatar Upload & Personal Details */}
          <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Profile Picture & Details</h2>
              </div>
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-full">Verified Member</span>
            </div>

            {/* Avatar Upload System */}
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Profile Photo Upload
              </label>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                
                {/* Avatar Display Circle */}
                <div className="relative group shrink-0">
                  <div className="w-24 h-24 rounded-full bg-white border-2 border-blue-600 shadow-xs overflow-hidden flex items-center justify-center text-slate-800 font-bold text-2xl">
                    {hasUserPhoto(photoPreview) ? (
                      <img src={photoPreview} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <UserIcon className="w-10 h-10 text-slate-400" />
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    title="Upload New Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                {/* File Upload Controls */}
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <p className="text-xs text-slate-600 font-medium">
                    Upload a high quality portrait picture (JPEG, PNG or WEBP up to 5MB).
                  </p>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload Picture
                    </button>
                    {hasUserPhoto(photoPreview) && (
                      <button
                        type="button"
                        onClick={() => setPhotoPreview('')}
                        className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={handlePhotoFileChange}
                    className="hidden"
                  />
                </div>
              </div>

            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Full Name <span className="text-blue-600">*</span>
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your Name"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  City / Location
                </label>
                <input 
                  type="text" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Mumbai, India or Remote"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                About & Bio
              </label>
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Share your expertise, projects you work on, and skills you want to learn..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Proficiency Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value as SkillLevel)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Meeting Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as MeetingMode)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                >
                  <option value="Online">Online Only (Google Meet / Zoom)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Availability
                </label>
                <input 
                  type="text" 
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g. Weekends, Evenings"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Languages Spoken (comma separated)
              </label>
              <input 
                type="text" 
                value={languagesText}
                onChange={(e) => setLanguagesText(e.target.value)}
                placeholder="e.g. English, Hindi, Marathi, Spanish"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>

          </form>

          {/* Card 2: Skills Management */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">My Skills Inventory</h2>
              </div>
              <span className="text-xs text-slate-500 font-medium">Teach & Learn Barter</span>
            </div>

            {/* Skills I Can Teach */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-600" /> Skills You Can Teach ({currentUser.teachSkills?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddTeachModal(!showAddTeachModal)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>

              {showAddTeachModal && (
                <div className="p-4 rounded-xl bg-slate-50 border border-blue-200 space-y-3 animate-fadeIn">
                  <div className="text-xs font-bold text-slate-900">Add New Teaching Skill</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      placeholder="Skill name (e.g. Python, UI Design)"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 outline-none"
                    />
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <select
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 outline-none"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Design">Design</option>
                      <option value="Music">Music</option>
                      <option value="Business">Business</option>
                      <option value="Languages">Languages</option>
                      <option value="Arts">Arts & Crafts</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddTeachModal(false)}
                      className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleAddSkillSubmit('Teach')}
                      className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 cursor-pointer"
                    >
                      Save Skill
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {currentUser.teachSkills?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No teaching skills listed yet.</p>
                ) : (
                  currentUser.teachSkills.map(sk => (
                    <div 
                      key={sk.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-800"
                    >
                      <span>{sk.skillName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">{sk.level}</span>
                      <button 
                        onClick={() => removeSkill(sk.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove Skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Skills I Want to Learn */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" /> Skills You Want to Learn ({currentUser.learnSkills?.length || 0})
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddLearnModal(!showAddLearnModal)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Skill
                </button>
              </div>

              {showAddLearnModal && (
                <div className="p-4 rounded-xl bg-slate-50 border border-blue-200 space-y-3 animate-fadeIn">
                  <div className="text-xs font-bold text-slate-900">Add New Desired Learning Skill</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input 
                      type="text" 
                      placeholder="Skill name (e.g. Guitar, French)"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 outline-none"
                    />
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <select
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-100 outline-none"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Design">Design</option>
                      <option value="Music">Music</option>
                      <option value="Business">Business</option>
                      <option value="Languages">Languages</option>
                      <option value="Arts">Arts & Crafts</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      type="button" 
                      onClick={() => setShowAddLearnModal(false)}
                      className="px-3 py-1 text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleAddSkillSubmit('Learn')}
                      className="px-3 py-1 bg-blue-600 text-white font-bold rounded-lg text-xs hover:bg-blue-700 cursor-pointer"
                    >
                      Save Skill
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {currentUser.learnSkills?.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No learning skills listed yet.</p>
                ) : (
                  currentUser.learnSkills.map(sk => (
                    <div 
                      key={sk.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-semibold text-slate-800"
                    >
                      <span>{sk.skillName}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-bold">{sk.level}</span>
                      <button 
                        onClick={() => removeSkill(sk.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        title="Remove Skill"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        {/* Right Column: Skill Certifications Upload & Verification System */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Upload Certification Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-xs relative overflow-hidden">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
              <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Award className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Upload Skill Certification</h2>
                <p className="text-[11px] text-slate-500">
                  Add proof of certifications for skills you have learned or mastered.
                </p>
              </div>
            </div>

            {certSuccessMsg && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{certSuccessMsg}</span>
              </div>
            )}

            <form onSubmit={handleUploadCertSubmit} className="space-y-4">
              
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <span>Skill Learned</span> <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={certSkillName}
                  onChange={(e) => setCertSkillName(e.target.value)}
                  required
                  placeholder="e.g. Full Stack Development, Python, Graphic Design"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Issuing Institution / Mentor Name
                </label>
                <input 
                  type="text" 
                  value={certIssuer}
                  onChange={(e) => setCertIssuer(e.target.value)}
                  placeholder="e.g. Coursera, Udemy, Google, SkillSwap Mentor"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Date Issued
                  </label>
                  <input 
                    type="date" 
                    value={certIssueDate}
                    onChange={(e) => setCertIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Credential Code / ID
                  </label>
                  <input 
                    type="text" 
                    value={certCode}
                    onChange={(e) => setCertCode(e.target.value)}
                    placeholder="Optional Code"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 focus:outline-none"
                  />
                </div>
              </div>

              {/* Certificate Document File Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Certificate Document / Photo Proof
                </label>

                <div 
                  onClick={() => certFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50 rounded-2xl p-4 text-center cursor-pointer transition-all space-y-2 group"
                >
                  {certFilePreview ? (
                    <div className="space-y-2">
                      <div className="w-full h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                        <img src={certFilePreview} alt="Certificate preview" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCertFilePreview(null);
                          }}
                          className="absolute top-2 right-2 p-1 rounded-full bg-red-600 text-white shadow-xs hover:bg-red-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-emerald-600 font-semibold flex items-center justify-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Image attached successfully
                      </p>
                    </div>
                  ) : (
                    <div className="py-3 space-y-1">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-900">Click or Drag Certificate File Here</p>
                      <p className="text-[10px] text-slate-500">Supports PNG, JPG, WEBP certificate images up to 8MB</p>
                    </div>
                  )}
                  <input 
                    ref={certFileInputRef}
                    type="file" 
                    accept="image/*"
                    onChange={handleCertFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={certUploading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>{certUploading ? 'Uploading Certificate...' : 'Upload & Verify Certificate'}</span>
              </button>

            </form>

          </div>

          {/* Certificate Gallery Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">My Certificates ({myCertificates.length})</h2>
              </div>
            </div>

            {myCertificates.length === 0 ? (
              <div className="text-center py-8 px-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <Award className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No certificates uploaded yet.</p>
                <p className="text-[11px] text-slate-500">
                  Upload certificates above or complete skill swap sessions to earn verified credentials!
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {myCertificates.map(cert => (
                  <div 
                    key={cert.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span>{cert.skillName}</span>
                        </div>
                        <div className="text-[11px] text-slate-600 font-medium">
                          Issuer: {cert.teacherName || cert.issuer || 'SkillSwap'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Issued: {cert.issueDate} • Code: {cert.certificateCode}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => setViewingCert(cert)}
                          className="p-1.5 rounded-lg bg-white text-blue-600 border border-slate-200 hover:bg-blue-50 transition-colors cursor-pointer"
                          title="View Certificate"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {cert.id.startsWith('cert_custom') && (
                          <button
                            onClick={() => deleteCertificate(cert.id)}
                            className="p-1.5 rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer"
                            title="Delete Certificate"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {cert.certificateUrl && (
                      <div 
                        onClick={() => setViewingCert(cert)}
                        className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer group relative"
                      >
                        <img src={cert.certificateUrl} alt={cert.skillName} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-bold text-white gap-1">
                          <Eye className="w-4 h-4" /> Expand Preview
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Certificate Preview Modal / Lightbox */}
      {viewingCert && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative text-slate-800 shadow-2xl">
            <button
              onClick={() => setViewingCert(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2 border-b border-slate-100 pb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">
                Certificate of Skill Learning
              </h3>
              <p className="text-xs text-slate-500">
                Verified Credential Record • SkillSwap Platform
              </p>
            </div>

            {viewingCert.certificateUrl ? (
              <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-200 max-h-80 flex items-center justify-center p-2">
                <img src={viewingCert.certificateUrl} alt={viewingCert.skillName} className="max-h-72 object-contain rounded-xl" />
              </div>
            ) : (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-4">
                <div className="text-xl font-bold text-slate-900">
                  {viewingCert.userName}
                </div>
                <p className="text-xs text-slate-500">
                  has successfully learned and demonstrated mastery in
                </p>
                <div className="text-2xl font-bold text-blue-600">
                  {viewingCert.skillName}
                </div>
                <p className="text-xs text-slate-600">
                  Under instruction by <span className="font-bold text-slate-900">{viewingCert.teacherName || viewingCert.issuer}</span>
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 font-mono border-t border-slate-100 pt-4">
              <div>Issue Date: <span className="text-slate-900 font-bold">{viewingCert.issueDate}</span></div>
              <div>Credential ID: <span className="text-slate-900 font-bold">{viewingCert.certificateCode}</span></div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setViewingCert(null)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
