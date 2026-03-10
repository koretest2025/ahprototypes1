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
  Pencil,
  ChevronLeft,
  ChevronRight
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
  const [selectedInterview, setSelectedInterview] = useState(null);

  const INTERVIEWS = [
    { id: 1, name: 'Sarah K.', role: 'Product Manager' },
    { id: 2, name: 'James T.', role: 'Engineer' },
    { id: 3, name: 'Priya M.', role: 'Designer' },
  ];

  // Agentic Chat State
  const [botOpen, setBotOpen] = useState(true);
  const [botThinking, setBotThinking] = useState(false);
  const [botMessages, setBotMessages] = useState([
    { role: 'agent', text: 'I\'ve analysed your 3 interviews. I found 3 problem themes and flagged 3 coaching issues in your technique. What would you like to explore?' },
  ]);
  const [botInput, setBotInput] = useState('');

  const AGENT_ACTIONS = [
    { label: 'Summarise key findings', icon: '📋' },
    { label: 'Which theme needs most attention?', icon: '🎯' },
    { label: 'Draft a recommendation', icon: '✍️' },
    { label: 'Compare interviews', icon: '🔍' },
  ];

  const TOOL_SEQUENCES = {
    default: ['Searching transcripts…', 'Cross-referencing themes…', 'Generating response…'],
    summarise: ['Reading all 3 interviews…', 'Extracting key quotes…', 'Building summary…'],
    recommendation: ['Analysing top problems…', 'Checking confidence scores…', 'Drafting recommendation…'],
    compare: ['Loading interview data…', 'Aligning by theme…', 'Comparing patterns…'],
  };

  const sendBotMessage = (text) => {
    if (!text.trim()) return;
    setBotMessages(prev => [...prev, { role: 'user', text }]);
    setBotInput('');
    setBotThinking(true);
    const lower = text.toLowerCase();
    const seq = lower.includes('summar') ? TOOL_SEQUENCES.summarise
      : lower.includes('recommend') ? TOOL_SEQUENCES.recommendation
      : lower.includes('compar') ? TOOL_SEQUENCES.compare
      : TOOL_SEQUENCES.default;
    let i = 0;
    const addTool = () => {
      if (i < seq.length) {
        setBotMessages(prev => [...prev, { role: 'tool', text: seq[i] }]);
        i++;
        setTimeout(addTool, 900);
      } else {
        setBotThinking(false);
        const replies = {
          summarise: 'Across your 3 interviews, users consistently struggle with navigation (all 3 mentioned losing context), onboarding friction (avg. 3 days to productivity), and feature discoverability. Navigation is the highest-confidence theme.',
          recommendation: 'Top recommendation: Add persistent breadcrumbs to all deep-nav screens. This directly addresses the #1 problem reported by 100% of participants and is a low-effort, high-impact fix.',
          compare: 'Sarah K. and Priya M. both flagged navigation and onboarding. James T. focused primarily on productivity and feature discoverability. The navigation theme is the only one shared across all three.',
          default: `Based on your interviews, "${text.slice(0, 50)}" maps to recurring friction around navigation and onboarding. Users mentioned needing clearer wayfinding and in-app guidance across all sessions.`,
        };
        const replyKey = lower.includes('summar') ? 'summarise'
          : lower.includes('recommend') ? 'recommendation'
          : lower.includes('compar') ? 'compare'
          : 'default';
        setBotMessages(prev => [...prev, { role: 'agent', text: replies[replyKey] }]);
      }
    };
    setTimeout(addTool, 600);
  };

  // Focus Mode State
  const [focusEvidence, setFocusEvidence] = useState(null);
  const [selectedLine, setSelectedLine] = useState(null);
  const [focusMessages, setFocusMessages] = useState([]);
  const [focusInput, setFocusInput] = useState('');

  const sendFocusMessage = (text) => {
    if (!text.trim()) return;
    const reply = { role: 'assistant', text: `This is a classic sign of disorientation in complex UIs. When users say "${text.slice(0, 60)}...", it typically indicates a missing wayfinding system. Consider adding persistent breadcrumbs or a visible navigation trail.` };
    setFocusMessages(prev => [...prev, { role: 'user', text }, reply]);
    setFocusInput('');
    setSelectedLine(null);
  };

  const INSIGHT_CARDS = [
    {
      id: 1, title: 'Poor Navigation', badge: 'Primary Problem', confidence: 'Medium', color: 'orange',
      summary: 'Users lose context in deep menu hierarchies and struggle to retrace their steps.',
      problems: ['No breadcrumbs', 'Too many pages', 'Confusing back navigation'],
      evidence: [
        {
          file: 'Recording_01.mp4', time: '02:14', problem: 'No breadcrumbs',
          transcript: [
            { time: '02:00', speaker: 'User', text: "Okay so I'm trying to get back to the dashboard from here..." },
            { time: '02:08', speaker: 'User', text: "I don't know how I got here. I just want to go back to the previous screen but I'm lost." },
            { time: '02:22', speaker: 'Researcher', text: "What would help you find your way back?" },
            { time: '02:30', speaker: 'User', text: "Like some kind of trail that shows where I've been? A breadcrumb or something?" },
            { time: '02:45', speaker: 'Researcher', text: "How often does this happen to you during a session?" },
            { time: '02:52', speaker: 'User', text: "Every single session honestly. It's really frustrating." }
          ],
          coaching: [{ type: 'warn', time: '02:08', msg: 'High frustration — probe root cause' }, { type: 'good', time: '02:22', msg: 'Good open-ended follow-up' }]
        },
        {
          file: 'Recording_02.mp4', time: '08:45', problem: 'Lots of pages',
          transcript: [
            { time: '08:30', speaker: 'User', text: "So now I need to go to the next step..." },
            { time: '08:38', speaker: 'User', text: "It feels like I'm clicking through a never-ending wizard. Is there a way to see this all on one page?" },
            { time: '08:55', speaker: 'Researcher', text: "What would an ideal flow look like for you?" },
            { time: '09:02', speaker: 'User', text: "Something where I don't have to keep clicking next, next, next just to fill out a form." },
            { time: '09:15', speaker: 'Researcher', text: "How many steps would feel reasonable?" },
            { time: '09:20', speaker: 'User', text: "Two, maybe three at most. Definitely not eight." }
          ],
          coaching: [{ type: 'warn', time: '08:38', msg: 'Task frustration detected' }, { type: 'good', time: '08:55', msg: 'Effective follow-up question' }]
        }
      ]
    },
    {
      id: 2, title: 'Low Productivity', badge: null, confidence: 'High', color: 'blue',
      summary: 'Repetitive manual steps and poor feature discoverability slow users down significantly.',
      problems: ['Difficulty finding features', 'Too many manual steps', 'Slow page loads'],
      evidence: [
        {
          file: 'Recording_03.mp4', time: '05:30', problem: 'Difficulty finding features',
          transcript: [
            { time: '05:15', speaker: 'User', text: "I need to export this report, where is that option?" },
            { time: '05:22', speaker: 'User', text: "Where is the export button? I've been looking for 5 minutes." },
            { time: '05:35', speaker: 'Researcher', text: "What were you expecting to find it?" },
            { time: '05:40', speaker: 'User', text: "Under the file menu or at the top of the table, like every other tool." },
            { time: '05:55', speaker: 'Researcher', text: "Did you try the action menu on the right?" },
            { time: '06:00', speaker: 'User', text: "No — why would export be hidden in an 'actions' menu?" }
          ],
          coaching: [{ type: 'warn', time: '05:22', msg: 'Feature discoverability failure' }, { type: 'good', time: '05:35', msg: 'Good mental model probe' }]
        }
      ]
    },
    {
      id: 3, title: 'Onboarding Friction', badge: null, confidence: 'Medium', color: 'purple',
      summary: 'New users require too much hand-holding and take multiple days to become productive.',
      problems: ['Onboarding takes 3 days', 'No in-app guidance', 'Steep learning curve'],
      evidence: [
        {
          file: 'Recording_06.mp4', time: '03:20', problem: 'Onboarding takes 3 days',
          transcript: [
            { time: '03:05', speaker: 'Researcher', text: "How long did it take before you felt comfortable?" },
            { time: '03:10', speaker: 'User', text: "It took me 3 days before I felt comfortable using this." },
            { time: '03:25', speaker: 'Researcher', text: "What was the hardest part to learn?" },
            { time: '03:32', speaker: 'User', text: "Understanding how projects relate to reports. There's no explanation anywhere." },
            { time: '03:48', speaker: 'Researcher', text: "Did you use any documentation or help center?" },
            { time: '03:55', speaker: 'User', text: "I tried, but the docs are outdated and the UI looks different now." }
          ],
          coaching: [{ type: 'good', time: '03:05', msg: 'Strong opening question' }, { type: 'warn', time: '03:32', msg: 'Note: docs gap identified' }]
        }
      ]
    }
  ];
  
  const COACH_ISSUES = [
    {
      id: 1,
      issue: 'Asking Leading Questions',
      severity: 'High',
      description: 'You suggested the answer before the user had a chance to respond, which may have biased their feedback.',
      evidence: { file: 'Recording_03.mp4', time: '05:55', quote: 'Researcher: "Did you try the action menu on the right?"', context: 'User was searching for the export button and the researcher revealed the answer instead of letting them explore.' },
      howToImprove: [
        'Wait at least 8–10 seconds of silence before intervening.',
        'Ask "What would you try next?" instead of pointing to the answer.',
        'Redirect with "What made you look there?" to understand mental models.',
      ],
    },
    {
      id: 2,
      issue: 'Dominating Talk Time',
      severity: 'High',
      description: 'In Recording_01 you spoke 70% of the session time. Users had limited space to elaborate on their pain points.',
      evidence: { file: 'Recording_01.mp4', time: '02:14', quote: 'Researcher talk time: 70% of session', context: 'The ratio should ideally be flipped — users should be talking at least 70% of the time.' },
      howToImprove: [
        'After asking a question, stay silent. Let the user fill the gap.',
        'Keep your questions under 15 words — the shorter, the better.',
        'Aim for a 20/80 interviewer-to-user talk ratio.',
      ],
    },
    {
      id: 3,
      issue: 'Jumping to Solutions',
      severity: 'Medium',
      description: 'When users mentioned problems, you moved to "what would help?" before fully exploring the root cause.',
      evidence: { file: 'Recording_01.mp4', time: '02:22', quote: 'Researcher: "What would help you find your way back?"', context: 'Asked for solutions before understanding why navigation felt disorienting in the first place.' },
      howToImprove: [
        'Ask "Can you tell me more about that?" at least once before moving forward.',
        'Use the 5 Whys technique to dig into the root cause.',
        'Separate problem exploration from solution ideation — don\'t mix them.',
      ],
    },
  ];

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
        <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-0.5 relative">
          <button
            onClick={() => { setReportType('aggregate'); setSelectedInterview(null); setIsDropdownOpen(false); }}
            className={`text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all ${reportType === 'aggregate' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Aggregate
          </button>
          <button
            onClick={() => setIsDropdownOpen(prev => !prev)}
            className={`flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-md transition-all ${reportType === 'individual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {reportType === 'individual' && selectedInterview ? selectedInterview.name : 'Individual Interviews'}
            <ChevronDown className="w-3 h-3" />
          </button>
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-lg z-50 min-w-[180px] py-1 overflow-hidden">
              {INTERVIEWS.map(iv => (
                <button
                  key={iv.id}
                  onClick={() => { setReportType('individual'); setSelectedInterview(iv); setIsDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 transition-colors ${selectedInterview?.id === iv.id ? 'text-orange-600 font-semibold bg-orange-50' : 'text-gray-700'}`}
                >
                  <div className="font-medium">{iv.name}</div>
                  <div className="text-[10px] text-gray-400">{iv.role}</div>
                </button>
              ))}
            </div>
          )}
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
                  {['Official vs. Actual Workflow', 'Top Problems', 'Quick Wins', 'Context', 'Coach'].map((item) => (
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
                /* REPORT VIEW - APPROACH 3: FOCUS MODE */
                <div className="flex flex-col animate-in fade-in duration-500">
                  {activeNav === 'Coach' ? (
                    /* COACH VIEW */
                    <div className="p-8 animate-in fade-in duration-300">
                      <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">Interview Coach</h1>
                        <p className="text-sm text-gray-500">Issues detected in your interviews that may affect the quality of your findings.</p>
                      </div>
                      <div className="space-y-5">
                        {COACH_ISSUES.map((item) => (
                          <div key={item.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            {/* Header */}
                            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.severity === 'High' ? 'bg-red-400' : 'bg-amber-400'}`} />
                              <h3 className="font-bold text-sm text-gray-900 flex-1">{item.issue}</h3>
                              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${item.severity === 'High' ? 'bg-red-50 text-red-500 border border-red-200' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                                {item.severity} severity
                              </span>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                              {/* What's the issue */}
                              <div className="px-6 py-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">What's the issue</p>
                                <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                              </div>
                              {/* Evidence */}
                              <div className="px-6 py-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Evidence</p>
                                <div className="bg-gray-900 rounded-xl p-3 flex items-center gap-3 mb-2 cursor-pointer group hover:bg-gray-800 transition-colors">
                                  <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                                    <Play className="w-3.5 h-3.5 text-white/70 group-hover:text-orange-400" fill="currentColor" />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-semibold text-white">{item.evidence.file}</p>
                                    <p className="text-[10px] text-white/40 font-mono">{item.evidence.time}</p>
                                  </div>
                                </div>
                                <p className="text-[11px] text-gray-500 italic leading-relaxed">"{item.evidence.quote}"</p>
                                <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">{item.evidence.context}</p>
                              </div>
                              {/* How to improve */}
                              <div className="px-6 py-4">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">How to improve</p>
                                <ul className="space-y-2">
                                  {item.howToImprove.map((tip, ti) => (
                                    <li key={ti} className="flex items-start gap-2 text-xs text-gray-600">
                                      <div className="w-4 h-4 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 mt-0.5 text-[9px] font-bold">{ti + 1}</div>
                                      {tip}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                  <div className="p-8">
                    {/* PATTERN CONFIDENCE BANNER */}
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Pattern Confidence: Low</span>
                          <span className="text-xs font-semibold text-amber-600">25%</span>
                        </div>
                        <div className="w-full h-1.5 bg-amber-100 rounded-full overflow-hidden mb-2">
                          <div className="bg-amber-400 h-full w-[25%] rounded-full"></div>
                        </div>
                        <p className="text-xs text-amber-700">Upload <span className="font-bold">4 more interviews</span> to increase confidence and surface stronger patterns.</p>
                      </div>
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 px-4 py-2 rounded-lg whitespace-nowrap transition-colors">
                        <Upload className="w-3.5 h-3.5" /> Upload here
                      </button>
                    </div>

                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Problem Themes</h1>
                    <p className="text-sm text-gray-500 mb-8">Click any evidence clip to enter Focus Mode for deep analysis.</p>

                    {/* INSIGHT CARDS GRID */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {INSIGHT_CARDS.map((card) => {
                        const colorMap = {
                          orange: { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-100 text-orange-600', badge: 'bg-orange-500' },
                          blue: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600', badge: 'bg-blue-500' },
                          purple: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600', badge: 'bg-purple-500' },
                        };
                        const c = colorMap[card.color];
                        return (
                          <div key={card.id} className={`bg-white border ${c.border} rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all`}>
                            <div className={`${c.bg} px-5 pt-5 pb-4 border-b ${c.border}`}>
                              <div className="flex items-start gap-3 mb-3">
                                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
                                  <AlertCircle className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-base text-gray-800">{card.title}</h3>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {card.badge && <span className={`px-2 py-0.5 ${c.badge} text-[10px] text-white font-bold rounded uppercase tracking-wider`}>{card.badge}</span>}
                                    <span className="px-2 py-0.5 bg-white border border-gray-200 text-[10px] text-gray-500 font-bold rounded uppercase tracking-wider">Confidence: {card.confidence}</span>
                                  </div>
                                </div>
                              </div>
                              <p className="text-xs text-gray-600 leading-relaxed">{card.summary}</p>
                            </div>
                            <div className="px-5 py-4 border-b border-gray-100">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Identified Problems</p>
                              <ul className="space-y-1.5">
                                {card.problems.map((p, pi) => (
                                  <li key={pi} className="flex items-center gap-2 text-xs text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                                    {p}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="px-5 py-4">
                              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Evidence Clips</p>
                              <div className="space-y-2">
                                {card.evidence.map((ev, ei) => (
                                  <button
                                    key={ei}
                                    onClick={() => { setFocusEvidence(ev); setFocusMessages([]); setSelectedLine(null); }}
                                    className="w-full flex items-center gap-3 bg-slate-900 rounded-xl p-3 hover:ring-2 hover:ring-orange-400 transition-all group/ev text-left"
                                  >
                                    <div className="w-10 h-8 bg-slate-800 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Play className="w-4 h-4 text-white/50 group-hover/ev:text-white transition-colors" fill="currentColor" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[11px] font-semibold text-white/80 truncate">{ev.problem}</p>
                                      <p className="text-[10px] text-white/40 font-mono">{ev.file} · {ev.time}</p>
                                    </div>
                                    <span className="text-[10px] text-orange-400 font-bold opacity-0 group-hover/ev:opacity-100 transition-opacity whitespace-nowrap">Focus →</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  )}
                </div>
              )}
            </main>

            {/* AGENTIC CHAT PANEL */}
            <div className={`flex-shrink-0 flex border-l border-gray-200 bg-white transition-all duration-300 ${botOpen ? 'w-80' : 'w-10'} relative`}>
              {/* Collapse toggle tab */}
              <button
                onClick={() => setBotOpen(prev => !prev)}
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-white border border-gray-200 rounded-l-lg flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
              >
                {botOpen ? <ChevronRight className="w-3.5 h-3.5 text-gray-400" /> : <ChevronLeft className="w-3.5 h-3.5 text-gray-400" />}
              </button>

              {botOpen ? (
                <div className="flex flex-col w-full overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 flex-shrink-0">
                    <div className="w-7 h-7 bg-[#1A1F2B] rounded-lg flex items-center justify-center">
                      <Sparkles className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900">Research Agent</p>
                      <p className="text-[10px] text-gray-400">{botThinking ? 'Working…' : '3 interviews analysed'}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${botThinking ? 'bg-orange-400 animate-pulse' : 'bg-green-400'}`} />
                  </div>

                  {/* Suggested actions */}
                  {botMessages.length <= 1 && (
                    <div className="px-3 pt-3 pb-1 flex flex-wrap gap-1.5 flex-shrink-0">
                      {AGENT_ACTIONS.map((a, i) => (
                        <button
                          key={i}
                          onClick={() => sendBotMessage(a.label)}
                          className="flex items-center gap-1 text-[10px] font-medium bg-gray-50 hover:bg-orange-50 hover:text-orange-700 border border-gray-200 hover:border-orange-200 text-gray-600 px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          <span>{a.icon}</span> {a.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-2.5">
                    {botMessages.map((msg, i) => (
                      msg.role === 'tool' ? (
                        <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-pulse flex-shrink-0" />
                          <span className="text-[10px] text-gray-400 font-mono">{msg.text}</span>
                        </div>
                      ) : (
                        <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                          {msg.role === 'agent' && (
                            <div className="flex items-center gap-1 px-1">
                              <Sparkles className="w-3 h-3 text-orange-400" />
                              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Agent</span>
                            </div>
                          )}
                          <div className={`max-w-[90%] px-3 py-2 rounded-xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-[#1A1F2B] text-white' : 'bg-orange-50 border border-orange-100 text-gray-700'}`}>
                            {msg.text}
                          </div>
                        </div>
                      )
                    ))}
                    {botThinking && botMessages[botMessages.length - 1]?.role !== 'tool' && (
                      <div className="flex gap-1 px-3 py-2">
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
                        <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <div className="px-3 py-3 border-t border-gray-100 flex-shrink-0">
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-300"
                        placeholder="Ask the agent…"
                        value={botInput}
                        onChange={e => setBotInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && !botThinking && sendBotMessage(botInput)}
                        disabled={botThinking}
                      />
                      <button
                        onClick={() => !botThinking && sendBotMessage(botInput)}
                        disabled={botThinking}
                        className="w-8 h-8 bg-[#1A1F2B] hover:bg-black disabled:opacity-40 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Collapsed state — vertical label */
                <div className="flex flex-col items-center justify-center w-full gap-2 py-4">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest" style={{writingMode:'vertical-rl', transform:'rotate(180deg)'}}>Agent</span>
                </div>
              )}
            </div>

            {/* FULL-SCREEN FOCUS MODE */}
            {focusEvidence && (
              <div className="fixed inset-0 z-50 flex items-stretch animate-in fade-in duration-200">
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setFocusEvidence(null)} />
                <div className="relative z-10 m-6 flex-1 flex bg-[#0F1117] rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
                  {/* LEFT: Video */}
                  <div className="flex-1 flex flex-col p-6 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-white font-bold text-lg">{focusEvidence.problem}</h2>
                        <p className="text-white/40 text-xs font-mono mt-0.5">{focusEvidence.file} · {focusEvidence.time}</p>
                      </div>
                      <button onClick={() => setFocusEvidence(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                        <X className="w-5 h-5 text-white/60" />
                      </button>
                    </div>
                    <div className="flex-1 bg-slate-900 rounded-2xl relative flex items-center justify-center group cursor-pointer border border-white/10 min-h-0">
                      <Play className="w-20 h-20 text-white/30 group-hover:text-white group-hover:scale-110 transition-all drop-shadow-2xl" fill="currentColor" />
                      <div className="absolute bottom-4 right-4 bg-orange-500 text-[11px] text-white px-2.5 py-1 rounded-lg font-bold">{focusEvidence.time}</div>
                      <div className="absolute bottom-4 left-4 flex gap-2">
                        {focusEvidence.coaching.map((c, ci) => (
                          <div key={ci} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold ${c.type === 'warn' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                            {c.type === 'warn' ? <AlertCircle className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                            {c.time}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between text-[10px] font-bold text-white/40 mb-2 uppercase tracking-wider">
                        <span>Researcher Talking Time</span><span>70%</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full w-[70%]" />
                      </div>
                      <p className="text-[10px] text-white/30 mt-2 italic">💡 You may be leading the witness. Try more open-ended questions.</p>
                    </div>
                  </div>

                  {/* RIGHT: Transcript + Bot */}
                  <div className="w-[440px] border-l border-white/10 flex flex-col">

                    {/* TRANSCRIPT SECTION (top 55%) */}
                    <div className="flex flex-col border-b border-white/10" style={{height: '55%'}}>
                      <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2 flex-shrink-0">
                        <FileText className="w-4 h-4 text-white/40" />
                        <span className="text-white/70 font-semibold text-sm">Transcript</span>
                        <span className="ml-auto text-[10px] text-white/25 italic">Click a line → ask the bot</span>
                      </div>
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-0.5">
                        {focusEvidence.transcript.map((line, li) => {
                          const isSelected = selectedLine === li;
                          const isUser = line.speaker === 'User';
                          return (
                            <div key={li}>
                              <div
                                onClick={() => setSelectedLine(isSelected ? null : li)}
                                className={`group flex gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-orange-500/20 border border-orange-500/40' : 'hover:bg-white/5 border border-transparent'}`}
                              >
                                <span className="text-[10px] font-mono text-white/25 mt-0.5 flex-shrink-0 w-8">{line.time}</span>
                                <div className="flex-1 min-w-0">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider block mb-0.5 ${isUser ? 'text-orange-400' : 'text-blue-400'}`}>{line.speaker}</span>
                                  <p className="text-xs text-white/70 leading-relaxed">{line.text}</p>
                                </div>
                              </div>
                              {isSelected && (
                                <div className="mx-2 mb-2">
                                  <button
                                    onClick={() => sendFocusMessage(`Explain this behavior: "${line.text}"`)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-orange-500/20"
                                  >
                                    <Sparkles className="w-3.5 h-3.5" /> Explain this behavior
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Q&A BOT SECTION (bottom 45%) */}
                    <div className="flex flex-col flex-1 bg-gradient-to-b from-[#1a1024] to-[#0F1117]">
                      {/* Bot header */}
                      <div className="px-4 py-3 flex items-center gap-3 border-b border-orange-500/20 bg-orange-500/10 flex-shrink-0">
                        <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm leading-none">Ask UserAha</p>
                          <p className="text-orange-300/60 text-[10px] mt-0.5">AI analysis on this evidence</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-[10px] text-green-400 font-medium">Online</span>
                        </div>
                      </div>

                      {/* Messages or suggested prompts */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {focusMessages.length === 0 ? (
                          <div className="space-y-2 pt-1">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold px-1">Suggested questions</p>
                            {[
                              'What pattern does this reveal?',
                              'How severe is this friction?',
                              'What design fix would address this?'
                            ].map((q, qi) => (
                              <button
                                key={qi}
                                onClick={() => sendFocusMessage(q)}
                                className="w-full text-left px-3 py-2.5 bg-white/5 hover:bg-orange-500/15 border border-white/10 hover:border-orange-500/40 rounded-xl text-xs text-white/60 hover:text-white transition-all"
                              >
                                {q}
                              </button>
                            ))}
                          </div>
                        ) : (
                          focusMessages.map((m, mi) => (
                            <div key={mi} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              {m.role === 'assistant' && (
                                <div className="w-5 h-5 bg-orange-500 rounded-md flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                                  <Sparkles className="w-3 h-3 text-white" />
                                </div>
                              )}
                              <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-orange-500/25 text-orange-200 border border-orange-500/30' : 'bg-white/8 text-white/80 border border-white/10'}`}>{m.text}</div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Prominent input bar */}
                      <div className="p-3 border-t border-orange-500/20">
                        <div className="flex gap-2 bg-white/5 border border-orange-500/30 rounded-xl p-1 focus-within:border-orange-500 transition-colors">
                          <input
                            value={focusInput}
                            onChange={(e) => setFocusInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendFocusMessage(focusInput)}
                            placeholder="Ask about this evidence..."
                            className="flex-1 text-xs px-3 py-2 bg-transparent text-white placeholder-white/30 outline-none"
                          />
                          <button
                            onClick={() => sendFocusMessage(focusInput)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-bold text-xs flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" /> Ask
                          </button>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default App;
