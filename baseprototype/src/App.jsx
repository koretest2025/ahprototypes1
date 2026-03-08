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
  ExternalLink
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
          <span>{metadata.title}</span>
          <span>/</span>
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
      {step === 'analyzing' && (
        <div className="flex-1 flex flex-col items-center justify-center p-6 z-10">
          <div className="max-w-3xl w-full flex flex-col gap-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4 italic">Analyzing your interviews...</h2>
              <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100 mb-6 min-h-[120px] flex items-center justify-center">
                <p className="text-lg text-orange-900 font-medium italic animate-pulse">
                  "{RESEARCH_FACTS[currentFact]}"
                </p>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div 
                  className="bg-orange-500 h-full transition-all duration-300 ease-out" 
                  style={{width: `${uploadProgress}%`}}
                ></div>
              </div>
              <p className="text-xs text-gray-400">Extracting insights... {uploadProgress}%</p>
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
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Project Title</label>
                  <input 
                    value={metadata.title} 
                    onChange={(e)=>setMetadata({...metadata, title: e.target.value})} 
                    className="w-full text-base font-medium p-3 bg-gray-50 border border-gray-100 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400">Project Goal</label>
                  <input 
                    value={metadata.goal} 
                    onChange={(e)=>setMetadata({...metadata, goal: e.target.value})} 
                    className="w-full text-base font-medium p-3 bg-gray-50 border border-gray-100 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none transition-all" 
                  />
                </div>
              </div>
              {uploadProgress >= 100 && (
                 <button 
                  onClick={() => { setStep('report'); setActiveTab('Summary'); }} 
                  className="w-full mt-8 py-3 bg-[#1A1F2B] text-white font-bold rounded-xl hover:bg-black transition-all flex items-center justify-center gap-2 shadow-lg animate-bounce"
                >
                  View Report <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DASHBOARD / REPORT SCREEN */}
      {step === 'report' && (
        <>
          <Header />
          <div className="flex flex-1 overflow-hidden">
            
            {/* SIDEBAR */}
            <aside className="w-64 border-r border-gray-200 bg-white flex flex-col flex-shrink-0">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-sm font-bold text-gray-800 mb-4">Navigation</h2>
                <div className="flex gap-1 p-1 bg-gray-50 rounded-lg border border-gray-200">
                  <button 
                    onClick={() => setActiveTab('Summary')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${activeTab === 'Summary' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
                  >
                    Summary
                  </button>
                  <button 
                    onClick={() => setActiveTab('Projects')}
                    className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${activeTab === 'Projects' ? 'bg-white shadow-sm text-orange-600' : 'text-gray-400'}`}
                  >
                    Projects
                  </button>
                </div>
              </div>

              {activeTab === 'Summary' && (
                <div className="flex-1 overflow-y-auto p-2">
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
              )}

              <div className="p-4 border-t border-gray-100 mt-auto">
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
                                <span className="font-bold text-sm text-gray-700">{proj.name}</span>
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
                            quote: '"...I don\'t know how I got here. I just want to go back to the previous screen but I\'m lost."' 
                          },
                          { 
                            title: 'Lots of pages', 
                            desc: "The current task flow is fragmented across too many distinct pages. Users feel overwhelmed by the number of transitions required to complete simple actions.", 
                            time: '08:45', 
                            quote: '"It feels like I\'m clicking through a never-ending wizard. Is there a way to see this on one page?"' 
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
                              <div className="w-36 h-24 bg-slate-900 rounded-xl relative flex items-center justify-center overflow-hidden border border-slate-700 flex-shrink-0 cursor-pointer group/video shadow-sm">
                                <div className="absolute inset-0 bg-slate-800 animate-pulse opacity-20"></div>
                                <Play className="w-8 h-8 text-white/40 group-hover/video:text-white group-hover/video:scale-110 transition-all z-10" />
                                <div className="absolute bottom-2 right-2 bg-black/60 text-[10px] text-white px-2 py-0.5 rounded font-mono z-10">{prob.time}</div>
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
                      <div className="grid gap-4">
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

            {/* EVIDENCE SIDEBAR - ONLY SHOW IN SUMMARY */}
            {activeTab === 'Summary' && (
              <aside className="hidden xl:flex w-[400px] border-l border-gray-200 bg-white flex-col flex-shrink-0 overflow-hidden animate-in slide-in-from-right-4 duration-500">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-gray-800">Evidence & Coach</h2>
                  <Sparkles className="w-4 h-4 text-orange-400" />
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  <div className="p-4">
                    <div className="aspect-video bg-slate-900 rounded-2xl relative overflow-hidden group flex items-center justify-center shadow-lg">
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md text-[10px] text-white rounded font-bold border border-white/10 z-10">
                        Recording_01.mp4
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-orange-500 text-[10px] text-white rounded font-bold shadow-lg z-10">
                        02:14
                      </div>
                      <Play className="w-16 h-16 text-white/50 group-hover:text-white transition-all cursor-pointer drop-shadow-2xl" fill="currentColor" />
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-8">
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono border-b pb-2">Scorecard</h4>
                      <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-3 uppercase tracking-wider">
                          <span>Researcher Talking</span>
                          <span>70%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-200 rounded-full flex overflow-hidden">
                          <div className="bg-orange-500 h-full transition-all duration-1000" style={{width: '70%'}}></div>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-4 leading-relaxed italic">
                          💡 Analysis suggests you might be leading the witness. Try asking more open-ended questions.
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-mono border-b pb-2">Coaching Moments</h4>
                      <div className="space-y-3">
                        {[
                          { time: '14:02', msg: 'Multiple interruptions detected' },
                          { time: '22:15', msg: 'Insightful follow-up question' }
                        ].map((moment, i) => (
                          <div 
                            key={i} 
                            className="flex items-center gap-4 bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:border-orange-200 transition-all cursor-pointer group"
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}>
                              {i === 0 ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-gray-800">Timestamp {moment.time}</span>
                              <span className="text-[10px] text-gray-500">{moment.msg}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <button className="w-full py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-xl shadow-orange-100 transition-all flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0">
                    Generate Discussion Guide
                  </button>
                </div>
              </aside>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
