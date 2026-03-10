import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle2, 
  MessageSquare, 
  ChevronDown, 
  MoreVertical, 
  Send, 
  Info, 
  AlertCircle, 
  Plus, 
  ArrowRight, 
  Bell, 
  Layout, 
  Search, 
  Play, 
  Share2, 
  Download, 
  LogIn, 
  User, 
  Settings, 
  HelpCircle, 
  X,
  Sparkles,
  ChevronUp,
  Video,
  Quote,
  RefreshCw,
  ExternalLink,
  Pencil
} from 'lucide-react';

// --- Constants & Mock Data ---
const RESEARCH_FACTS = [
  "Do you know that an average Product Manager spends 6 years of his lifetime on product research during his career?",
  "User research can improve product conversion rates by up to 400%.",
  "80% of usability issues can be identified by testing with just 5 users.",
  "Companies that invest in UX see a lower cost of customer acquisition.",
  "Analyzing 1 hour of interview footage typically takes a researcher 4-6 hours manually."
];

const INITIAL_THEMES = [
  { id: 1, title: 'Low Productivity', problems: ['Difficulty finding features', 'Too many manual steps', 'Slow page loads'] },
  { id: 2, title: 'Taking lot of time', problems: ['Onboarding takes 3 days', 'Manual data entry is tedious', 'Report generation is slow'] }
];

const MOCK_PROJECTS = [
  { 
    id: 1, 
    name: 'Mobile App Redesign', 
    goal: 'Identify top 3 friction points', 
    desc: 'Investigating core friction points in the workspace management dashboard.', 
    videos: 6,
    status: 'Ready'
  },
  { 
    id: 2, 
    name: 'Q3 Onboarding Audit', 
    goal: 'Reduce drop-off in step 2', 
    desc: 'Testing the new multi-factor authentication flow with new users.', 
    videos: 4,
    status: 'Ready'
  },
  { 
    id: 3, 
    name: 'Enterprise Search UX', 
    goal: 'Validate global search discoverability', 
    desc: 'Early stage prototyping for the new cross-platform search engine.', 
    videos: 12,
    status: 'Processing'
  }
];

const App = () => {
  // Navigation & Flow State
  const [step, setStep] = useState('upload'); 
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [activeNav, setActiveNav] = useState('Official vs. Actual Workflow');
  const [activeTab, setActiveTab] = useState('Summary'); // 'Summary' | 'Projects'
  
  // Refs
  const fileInputRef = useRef(null);

  // Editing state for project detail fields
  const [editingField, setEditingField] = useState(null);

  // Project Metadata
  const [metadata, setMetadata] = useState({
    title: 'Mobile App Redesign',
    description: 'Investigating core friction points in the workspace management dashboard.',
    goal: 'Identify top 3 productivity blockers.'
  });

  // Report State
  const [themes, setThemes] = useState(INITIAL_THEMES);
  const [reportType, setReportType] = useState('aggregate');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Drawer State (video evidence)
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerEvidence, setDrawerEvidence] = useState(null);

  // Q&A Chat State
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: 'Hi! Ask me anything about your research findings.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const openDrawer = (evidence) => { setDrawerEvidence(evidence); setDrawerOpen(true); };
  const closeDrawer = () => setDrawerOpen(false);

  const sendChat = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: 'user', text: chatInput };
    setChatMessages(prev => [...prev, userMsg, { role: 'assistant', text: 'Great question! Based on the interviews, users consistently struggled with this area. The evidence suggests a pattern across 3+ sessions.' }]);
    setChatInput('');
  };
  
  // --- Logic ---
  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    if (uploadedFiles.length === 0) return;
    const totalSize = uploadedFiles.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024);
    if (totalSize > 300) { 
        console.warn("Total upload size exceeds 300MB limit."); 
        return; 
    }
    setFiles(uploadedFiles);
    setStep('analyzing');
    startSimulation();
  };

  const startSimulation = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(prev => {
        if (prev >= 100) {
            clearInterval(interval);
            return 100;
        }
        return prev + 5;
      });
    }, 200);

    const factInterval = setInterval(() => { 
        setCurrentFact(prev => (prev + 1) % RESEARCH_FACTS.length); 
    }, 4000);

    return () => { 
        clearInterval(interval); 
        clearInterval(factInterval); 
    };
  };

  const isSingleVideo = files.length === 1;

  const getSelectedLabel = () => {
    if (reportType === 'aggregate') return 'Aggregate Report';
    const index = parseInt(reportType);
    return `Interview: ${files[index]?.name || 'Interview ' + (index + 1)}`;
  };

  // --- Layout Components ---

  const Header = () => (
    <nav className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-4 z-50 sticky top-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold italic">A</div>
          <span className="font-bold text-sm tracking-tight">UserAha</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="hover:text-gray-600 cursor-pointer" onClick={() => setActiveTab('Projects')}>Projects</span>
          <span>›</span>
          <span className="text-gray-700 font-medium">Mobile App Redesign</span>
          <div className="ml-2 bg-gray-100 px-2 py-0.5 rounded-full text-[10px] text-gray-600 font-medium">Admin | Enterprise</div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase">Pattern Confidence: Medium</span>
            <span className="text-[10px] text-gray-400">60%</span>
          </div>
          <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="bg-orange-400 h-full w-[60%]"></div>
          </div>
        </div>
        <div className="flex items-center gap-2 border-l pl-6 border-gray-100">
          <button className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <Share2 className="w-3.5 h-3.5" /> Share
          </button>
          <button className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            Export <ChevronDown className="w-3.5 h-3.5" />
          </button>
          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200">
            <User className="w-4 h-4 text-orange-600" />
          </div>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1A1F2B] font-sans selection:bg-orange-100 flex flex-col">
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #CBD5E1; }
      `}</style>

      {step !== 'report' && (
        <div className="fixed inset-0 pointer-events-none opacity-[0.03] z-0 overflow-hidden">
          <svg width="100%" height="100%">
            <pattern id="p" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1.5" fill="#FF7A00" />
              <line x1="10" y1="10" x2="60" y2="40" stroke="#FF7A00" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#p)" />
          </svg>
        </div>
      )}

      {/* UPLOAD SCREEN */}
      {step === 'upload' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            Stop re-watching User research calls. <br />
            Get the <span className="text-[#FF7A00]">Shadow Workflow</span> in seconds.
          </h1>
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-2xl mt-12 p-12 bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-orange-300 transition-all cursor-pointer shadow-sm group active:scale-[0.98]"
          >
            <input type="file" multiple ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Upload className="text-[#FF7A00] w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Upload up to 10 interview videos</h3>
              <p className="text-sm text-gray-400 italic">MP4, MOV, AVI, MP3 (Max 300MB)</p>
            </div>
          </div>
        </div>
      )}

      {/* ANALYZING SCREEN */}
      {step === 'analyzing' && (() => {
        const JOURNEY_STEPS = [
          'Identifying interview type',
          'Extracting problems',
          'Generating problem themes',
          'Generating problem theme report',
        ];
        const getStepState = (index) => {
          const threshold = (index + 1) * 25;
          const activeThreshold = index * 25;
          if (uploadProgress >= threshold) return 'done';
          if (uploadProgress >= activeThreshold) return 'active';
          return 'pending';
        };
        const allDone = uploadProgress >= 100;

        return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
            <div className="max-w-3xl w-full flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 italic">Analyzing your interviews...</h2>

                {/* Sign-up CTA */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-400 rounded-2xl p-5 mb-6 text-left flex items-center justify-between gap-4 shadow-lg shadow-orange-100">
                  <div>
                    <p className="text-white font-bold text-base mb-0.5">Your report will be ready soon!</p>
                    <p className="text-orange-100 text-sm">Sign up now to save your report, access it anytime, and run future analyses in seconds.</p>
                  </div>
                  <button className="flex-shrink-0 bg-white text-orange-600 font-bold text-sm px-5 py-2.5 rounded-xl hover:bg-orange-50 transition-all shadow-sm whitespace-nowrap flex items-center gap-2">
                    <User className="w-4 h-4" /> Sign Up Free
                  </button>
                </div>

                {/* Journey Steps - Horizontal */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    {JOURNEY_STEPS.map((label, index) => {
                      const state = getStepState(index);
                      const isLast = index === JOURNEY_STEPS.length - 1;
                      return (
                        <div key={index} className="flex items-center flex-1">
                          {/* Step */}
                          <div className="flex flex-col items-center flex-shrink-0 w-24">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                              state === 'done' ? 'bg-orange-500 text-white' :
                              state === 'active' ? 'bg-orange-50 border-2 border-orange-400' :
                              'bg-gray-100 border-2 border-gray-200'
                            }`}>
                              {state === 'done' ? (
                                <CheckCircle2 className="w-5 h-5" />
                              ) : state === 'active' ? (
                                <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
                              ) : (
                                <div className="w-3 h-3 rounded-full bg-gray-300" />
                              )}
                            </div>
                            <p className={`text-[11px] font-semibold text-center mt-2 leading-tight transition-all duration-300 ${
                              state === 'done' ? 'text-gray-700' :
                              state === 'active' ? 'text-orange-600' :
                              'text-gray-400'
                            }`}>
                              {label}
                            </p>
                            {state === 'active' && (
                              <p className="text-[10px] text-orange-400 mt-0.5 animate-pulse">In progress...</p>
                            )}
                            {state === 'done' && (
                              <p className="text-[10px] text-green-500 mt-0.5">Complete</p>
                            )}
                          </div>
                          {/* Connector line */}
                          {!isLast && (
                            <div className={`flex-1 h-0.5 mx-2 mb-6 transition-all duration-500 ${state === 'done' ? 'bg-orange-400' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className="bg-orange-500 h-full transition-all duration-300 ease-out"
                    style={{width: `${uploadProgress}%`}}
                  ></div>
                </div>
                <p className="text-xs text-gray-400">{uploadProgress}% complete</p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xl w-full">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-bold mb-1">Define Project Details</h2>
                  <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-orange-100 animate-pulse">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">AI Generated</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {/* Project Title */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Project Title</label>
                      <button
                        onClick={() => setEditingField(editingField === 'title' ? null : 'title')}
                        className={`p-1.5 rounded-lg transition-all ${editingField === 'title' ? 'bg-orange-100 text-orange-600' : 'text-gray-300 hover:text-orange-500 hover:bg-orange-50'}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {editingField === 'title' ? (
                      <input
                        autoFocus
                        value={metadata.title}
                        onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                        onBlur={() => setEditingField(null)}
                        className="w-full text-base font-medium p-3 bg-gray-50 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    ) : (
                      <p className="w-full text-base font-medium p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-800">{metadata.title}</p>
                    )}
                  </div>

                  {/* Project Goal */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Project Goal</label>
                      <button
                        onClick={() => setEditingField(editingField === 'goal' ? null : 'goal')}
                        className={`p-1.5 rounded-lg transition-all ${editingField === 'goal' ? 'bg-orange-100 text-orange-600' : 'text-gray-300 hover:text-orange-500 hover:bg-orange-50'}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {editingField === 'goal' ? (
                      <input
                        autoFocus
                        value={metadata.goal}
                        onChange={(e) => setMetadata({...metadata, goal: e.target.value})}
                        onBlur={() => setEditingField(null)}
                        className="w-full text-base font-medium p-3 bg-gray-50 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      />
                    ) : (
                      <p className="w-full text-base font-medium p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-800">{metadata.goal}</p>
                    )}
                  </div>

                  {/* Project Description */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[10px] font-bold uppercase text-gray-400">Project Description</label>
                      <button
                        onClick={() => setEditingField(editingField === 'description' ? null : 'description')}
                        className={`p-1.5 rounded-lg transition-all ${editingField === 'description' ? 'bg-orange-100 text-orange-600' : 'text-gray-300 hover:text-orange-500 hover:bg-orange-50'}`}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {editingField === 'description' ? (
                      <textarea
                        autoFocus
                        value={metadata.description}
                        onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                        onBlur={() => setEditingField(null)}
                        rows={4}
                        className="w-full text-base font-medium p-3 bg-gray-50 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all resize-none"
                      />
                    ) : (
                      <p className="w-full text-base font-medium p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-800 min-h-[100px] whitespace-pre-wrap">{metadata.description || <span className="text-gray-400 italic">No description yet</span>}</p>
                    )}
                  </div>
                </div>
                {allDone && (
                  <button
                    onClick={() => { setStep('report'); setActiveTab('Summary'); }}
                    className="w-full mt-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100 animate-bounce"
                  >
                    Open Report <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* DASHBOARD / REPORT SCREEN */}
      {step === 'report' && (
        <>
          <Header />
          <div className="flex flex-1 overflow-hidden">
            
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
              <div className="flex-1 overflow-y-auto p-4">
                <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 mb-4">
                  <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block mb-2">Active Project</span>
                  <h4 className="text-xs font-bold text-gray-800 truncate">{metadata.title}</h4>
                </div>
                <nav className="space-y-1">
                  {['Official vs. Actual Workflow', 'Top Problems', 'Quick Wins', 'Context'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveNav(item)}
                      className={`w-full text-left px-3 py-2 text-xs font-medium rounded-lg transition-colors ${activeNav === item ? 'text-orange-600 bg-orange-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-orange-600 w-full transition-colors">
                  <MessageSquare className="w-4 h-4" /> Q&A Bot <ChevronDown className="w-3.5 h-3.5 ml-auto" />
                </button>
              </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 overflow-y-auto flex flex-col bg-[#F8FAFC]">
              
              {activeTab === 'Projects' ? (
                /* PROJECTS DASHBOARD TABULAR VIEW */
                <div className="p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">Projects Dashboard</h1>
                      <p className="text-sm text-gray-500 mt-1">Manage all your research initiatives and report generations.</p>
                    </div>
                    <button 
                      onClick={() => setStep('upload')} 
                      className="bg-[#1A1F2B] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-black transition-all"
                    >
                      <Plus className="w-4 h-4" /> New Project
                    </button>
                  </div>

                  <div className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Name</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Goal</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Videos</th>
                          <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {MOCK_PROJECTS.map((proj) => (
                          <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600"><Video className="w-4 h-4" /></div>
                                <span
                                  className={`font-bold text-sm ${proj.name === 'Mobile App Redesign' ? 'text-orange-600 hover:underline cursor-pointer' : 'text-gray-700'}`}
                                  onClick={() => proj.name === 'Mobile App Redesign' && setActiveTab('Summary')}
                                >{proj.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-xs text-gray-600 italic">"{proj.goal}"</td>
                            <td className="px-6 py-4 text-xs text-gray-500 max-w-xs truncate">{proj.desc}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-[10px] font-bold">{proj.videos} files</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  onClick={() => setStep('upload')} 
                                  title="Upload More Videos"
                                  className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                                >
                                  <Upload className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => { setUploadProgress(0); setStep('analyzing'); startSimulation(); }}
                                  title="Regenerate Report"
                                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={() => { setActiveTab('Summary'); }} 
                                  title="View Report"
                                  className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                /* REPORT VIEW */
                <div className="flex flex-col animate-in fade-in duration-500">
                  <div className="bg-white border-b border-gray-200 px-8 py-4 sticky top-0 z-20 flex items-center justify-between shadow-sm">
                    <div className="relative">
                      <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                        className="flex items-center gap-3 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-700 hover:border-orange-500 transition-all min-w-[260px] shadow-sm"
                      >
                        <FileText className="w-4 h-4 text-orange-500" />
                        <span>{getSelectedLabel()}</span>
                        <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isDropdownOpen && (
                        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <button 
                            onClick={() => { setReportType('aggregate'); setIsDropdownOpen(false); }} 
                            className={`w-full text-left px-4 py-3 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center gap-3 ${reportType === 'aggregate' ? 'text-orange-600 bg-orange-50/50' : 'text-gray-500'}`}
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Aggregate Report
                          </button>
                          <div className="border-t border-gray-100"></div>
                          <div className="px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono">Individual Interviews</div>
                          {files.length > 0 ? files.map((file, idx) => (
                            <button 
                              key={idx} 
                              onClick={() => { setReportType(idx.toString()); setIsDropdownOpen(false); }} 
                              className={`w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 flex items-center gap-3 ${reportType === idx.toString() ? 'text-orange-600 bg-orange-50/50' : 'text-gray-700'}`}
                            >
                              <span className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-[10px] font-bold">{idx + 1}</span>
                              <span className="truncate">{file.name}</span>
                            </button>
                          )) : (
                            <div className="px-4 py-3 text-xs italic text-gray-400">No individual files uploaded</div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-8 flex flex-col gap-8">
                    <div className="flex flex-col gap-2">
                      {isSingleVideo && (
                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl text-xs font-medium text-amber-900 flex items-start gap-3 shadow-sm animate-in fade-in slide-in-from-top-2 duration-700">
                          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                          <span>
                            Since 1 video has been uploaded, consider these problem themes as emerging. 
                            Upload at least 5 videos to develop a comprehensive set of problem themes. 
                            <button onClick={() => setStep('upload')} className="underline ml-1 cursor-pointer font-bold hover:text-amber-700">Click here to upload more videos</button>
                          </span>
                        </div>
                      )}
                      <h1 className="text-2xl font-bold text-gray-900 mt-2">Problem Themes</h1>
                    </div>

                    {/* Poor Navigation Focus Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                      <div className="flex items-start gap-4 mb-8">
                        <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 flex-shrink-0">
                          <AlertCircle className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">Poor Navigation</h3>
                          <div className="flex gap-2 mt-2">
                            <span className="px-2.5 py-0.5 bg-blue-600 text-[10px] text-white font-bold rounded uppercase tracking-wider">Primary: PROBLEM</span>
                            <span className="px-2.5 py-0.5 bg-orange-400 text-[10px] text-white font-bold rounded uppercase tracking-wider">Confidence: MEDIUM</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {[
                          {
                            title: 'No breadcrumbs',
                            desc: "Users frequently express confusion about their location within deep nested menus. Without a visible path back, they rely on multiple 'Back' clicks which increases friction.",
                            time: '02:14',
                            file: 'Recording_01.mp4',
                            quote: '"...I don\'t know how I got here. I just want to go back to the previous screen but I\'m lost."',
                            coaching: [{ type: 'warn', time: '02:14', msg: 'User expressed frustration — probe deeper' }, { type: 'good', time: '03:01', msg: 'Good open-ended follow-up' }]
                          },
                          {
                            title: 'Lots of pages',
                            desc: "The current task flow is fragmented across too many distinct pages. Users feel overwhelmed by the number of transitions required to complete simple actions.",
                            time: '08:45',
                            file: 'Recording_02.mp4',
                            quote: '"It feels like I\'m clicking through a never-ending wizard. Is there a way to see this on one page?"',
                            coaching: [{ type: 'warn', time: '08:45', msg: 'Multiple interruptions detected' }, { type: 'good', time: '10:12', msg: 'Insightful follow-up question' }]
                          }
                        ].map((prob, i) => (
                          <div key={i} className="flex flex-col lg:flex-row gap-6 bg-gray-50 border border-gray-100 rounded-2xl p-6 hover:bg-white hover:shadow-md transition-all group">
                            <div className="flex-1">
                              <h4 className="font-bold text-gray-800 flex items-center gap-2 text-base">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                {prob.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{prob.desc}</p>
                            </div>
                            <div className="lg:w-[400px] flex gap-4">
                              <div
                                onClick={() => openDrawer(prob)}
                                className="w-36 h-24 bg-slate-900 rounded-xl relative flex items-center justify-center overflow-hidden border border-slate-700 flex-shrink-0 cursor-pointer group/video shadow-sm hover:border-orange-400 hover:scale-105 transition-all"
                              >
                                <div className="absolute inset-0 bg-slate-800 animate-pulse opacity-20"></div>
                                <Play className="w-8 h-8 text-white/40 group-hover/video:text-white group-hover/video:scale-110 transition-all z-10" />
                                <div className="absolute bottom-2 right-2 bg-black/60 text-[10px] text-white px-2 py-0.5 rounded font-mono z-10">{prob.time}</div>
                                <div className="absolute top-2 left-2 bg-orange-500/80 text-[9px] text-white px-1.5 py-0.5 rounded font-bold z-10 opacity-0 group-hover/video:opacity-100 transition-opacity">Click to inspect</div>
                              </div>
                              <div className="flex-1 bg-white border border-gray-200 rounded-xl p-4 relative shadow-sm">
                                <Quote className="w-4 h-4 text-orange-400 absolute top-3 right-3 opacity-50" />
                                <p className="text-xs italic text-gray-600 leading-relaxed pr-6">{prob.quote}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Secondary Problem Themes */}
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        Other Problem Themes
                        <div className="flex-1 h-px bg-gray-200"></div>
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {themes.map(theme => (
                          <div
                            key={theme.id}
                            className="bg-white border border-gray-200 p-5 rounded-2xl flex items-center justify-between hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-2.5 h-2.5 rounded-full bg-orange-500 group-hover:scale-125 transition-transform"></div>
                              <span className="font-bold text-gray-700">{theme.title}</span>
                              <span className="text-[10px] px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full font-bold uppercase tracking-wider">{theme.problems.length} Evidence</span>
                            </div>
                            <ChevronDown className="w-5 h-5 text-gray-300 group-hover:text-orange-500 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>

            {/* VIDEO EVIDENCE DRAWER */}
            {drawerOpen && drawerEvidence && (
              <>
                <div className="fixed inset-0 bg-black/30 z-40" onClick={closeDrawer} />
                <aside className="fixed right-0 top-0 h-full w-[480px] bg-white border-l border-gray-200 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <h2 className="text-sm font-bold text-gray-800">Evidence Inspector</h2>
                      <p className="text-[10px] text-gray-400 mt-0.5">{drawerEvidence.file}</p>
                    </div>
                    <button onClick={closeDrawer} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
                    {/* Large video */}
                    <div className="aspect-video bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center shadow-lg group cursor-pointer">
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md text-[10px] text-white rounded font-bold border border-white/10 z-10">{drawerEvidence.file}</div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-orange-500 text-[10px] text-white rounded font-bold z-10">{drawerEvidence.time}</div>
                      <Play className="w-16 h-16 text-white/50 group-hover:text-white transition-all drop-shadow-2xl" fill="currentColor" />
                    </div>

                    {/* Quote */}
                    <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 relative">
                      <Quote className="w-4 h-4 text-orange-400 absolute top-3 right-3 opacity-50" />
                      <p className="text-sm italic text-orange-900 leading-relaxed pr-6">{drawerEvidence.quote}</p>
                    </div>

                    {/* Scorecard */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-3">Scorecard</h4>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                          <span>Researcher Talking</span>
                          <span>70%</span>
                        </div>
                        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="bg-orange-500 h-full w-[70%]" />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-3 italic">💡 Try asking more open-ended questions to avoid leading the witness.</p>
                      </div>
                    </div>

                    {/* Coaching Moments */}
                    <div>
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest border-b pb-2 mb-3">Coaching Moments</h4>
                      <div className="space-y-2">
                        {drawerEvidence.coaching.map((moment, i) => (
                          <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 p-3 rounded-xl hover:border-orange-200 transition-all cursor-pointer">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${moment.type === 'warn' ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                              {moment.type === 'warn' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-gray-800 block">{moment.time}</span>
                              <span className="text-[10px] text-gray-500">{moment.msg}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-100">
                      Generate Discussion Guide
                    </button>
                  </div>
                </aside>
              </>
            )}

            {/* Q&A CHAT OVERLAY */}
            {chatOpen && (
              <div className="fixed bottom-24 right-6 w-[360px] bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300" style={{height: '420px'}}>
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#1A1F2B]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" />
                    <span className="text-sm font-bold text-white">Ask UserAha</span>
                  </div>
                  <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <X className="w-4 h-4 text-white/70" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendChat()}
                    placeholder="Ask about your findings..."
                    className="flex-1 text-xs p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  <button onClick={sendChat} className="p-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Q&A FAB */}
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#1A1F2B] hover:bg-black text-white font-bold px-5 py-3.5 rounded-2xl shadow-2xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <MessageSquare className="w-5 h-5 text-orange-400" />
              Ask UserAha
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
