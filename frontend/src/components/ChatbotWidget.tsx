'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, ClipboardCheck, FileText, AlertCircle, CheckCircle2, Settings, Eye, EyeOff } from 'lucide-react';

interface Message {
  sender: 'bot' | 'user';
  text: string;
  timestamp: Date;
  isCustomCard?: boolean;
  cardType?: 'success' | 'confirm' | 'status';
  cardData?: any;
}

const getApiUrl = (path: string) => {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:5001${path}`;
};

const callGeminiClientSide = async (apiKey: string, prompt: string) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    })
  });
  if (!response.ok) {
    throw new Error('Gemini API returned error');
  }
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
};

// Local storage/memory for offline mock inquiries created in chatbot session
const SESSION_MOCK_INQUIRIES: Record<string, any> = {};

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: 'Hi there! I am the AI-Solutions Virtual Assistant. I can answer questions about our services or guide you through submitting and tracking project inquiries directly in this chat!',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Local Settings UI State
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userGeminiKey, setUserGeminiKey] = useState('');
  const [showUserKey, setShowUserKey] = useState(false);

  // Load key from localStorage on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('user_gemini_key');
    if (storedKey) {
      setUserGeminiKey(storedKey);
    }
  }, []);

  // Guided Inquiry Form Flow State
  const [formStep, setFormStep] = useState<
    null | 'AWAITING_NAME' | 'AWAITING_EMAIL' | 'AWAITING_PHONE' | 'AWAITING_COMPANY' | 'AWAITING_COUNTRY' | 'AWAITING_JOB_TITLE' | 'AWAITING_JOB_DETAILS' | 'AWAITING_CONFIRM' | 'AWAITING_LOOKUP'
  >(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    country: '',
    jobTitle: '',
    jobDetails: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, formStep]);

  const starterQuestions = [
    '📝 Submit Inquiry',
    '🔍 Track Inquiry',
    'What is AI Prototyping?',
    'Tell me about the company',
  ];

  // Local fallback response engine in case server is not running
  const getLocalResponse = (queryText: string): string => {
    const query = queryText.toLowerCase().trim();
    
    // Check if the query is a tracking reference (or contains one)
    const refRegex = /(AI-\d{8}-\d{4}|AI-MOCK-\d+)/i;
    const match = query.match(refRegex);
    if (match) {
      const trackingReference = match[0].toUpperCase();
      if (SESSION_MOCK_INQUIRIES[trackingReference]) {
        const inq = SESSION_MOCK_INQUIRIES[trackingReference];
        return `I found simulated inquiry reference ${trackingReference} in local session memory:\n` +
          `- **Client Name**: ${inq.fullName}\n` +
          `- **Company**: ${inq.companyName}\n` +
          `- **Service Category**: ${inq.category}\n` +
          `- **Submitted On**: ${new Date().toLocaleDateString()}\n` +
          `- **Current Status**: **${inq.status}**\n\n` +
          `Status Note: This mock entry exists in local session data since the backend API server is offline.`;
      }
      return `I could not locate tracking reference **${trackingReference}** in session memory. Since the API server is currently offline, I can only search inquiries submitted during this chat session.`;
    }

    if (query.includes('how are you') || query.includes('how is it going') || query.includes('how do you do') || query.includes('are you ok')) {
      return "I'm doing fantastic, thank you! Ready to help you with database audits, UI prototypes, or custom workflow designs. How are you doing today?";
    }
    if (query.includes('thank you') || query.includes('thanks') || query.includes('appreciate')) {
      return "You're very welcome! I'm always glad to help. Let me know if you have any other questions about AI-Solutions or computer systems engineering!";
    }
    if (query.includes('location') || query.includes('located') || query.includes('where are you') || query.includes('address')) {
      return "AI-Solutions is based in London, United Kingdom. We deploy enterprise digital workplace applications and remote agent services globally.";
    }
    if (query.includes('subekchha') || query.includes('creator') || query.includes('owner') || query.includes('made') || query.includes('sah') || query.includes('developer')) {
      return "Subekchha Sah is the Lead Systems Engineer and Developer of AI-Solutions. She designed and built this entire computer engineering platform, integrating Next.js, Express, and PostgreSQL/SQLite with interactive AI widgets and high-contrast admin dashboard interfaces.";
    }
    if (query.includes('stack') || query.includes('tech') || query.includes('language') || query.includes('framework')) {
      return "Our technical architecture is built on Next.js 14 (App Router) for the frontend, Node.js + Express.js for the backend API, and Sequelize ORM managing PostgreSQL with local SQLite automatic fallbacks.";
    }
    if (query.includes('database') || query.includes('postgres') || query.includes('sqlite') || query.includes('db')) {
      return "We utilize PostgreSQL for production environments and an automated SQLite fallback database. The system automatically shifts database writes to SQLite if the PostgreSQL connection is interrupted, ensuring 100% uptime.";
    }
    if (query.match(/\b(hi|hello|hey|greetings|howdy)\b/)) {
      return "Hello! I am your AI-Solutions virtual assistant. How can I help you explore our services today?";
    }
    if (query.includes('about') || query.includes('company') || query.includes('mission')) {
      return "AI-Solutions is a premium Computer Systems Engineering firm. We build virtual assistants, speed up Figma-to-code prototyping, and deploy digital workplace tools globally.";
    }
    if (query.includes('prototype') || query.includes('prototyping') || query.includes('figma') || query.includes('mvp')) {
      return "Our 'AI-Powered Prototyping' service converts Figma UI layouts into fully working Next.js components, saving design-to-code development time by up to 70%.";
    }
    if (query.includes('assistant') || query.includes('chatbot') || query.includes('agent')) {
      return "We design custom AI Virtual Assistants like me! They connect to your custom database APIs, train on your files, and handle support requests in real-time. Click '📝 Submit Inquiry' to get a quote!";
    }
    if (query.includes('automation') || query.includes('workflow') || query.includes('rpa')) {
      return "Through 'Business Automation', we build robotic software processes to automate invoicing, scheduling, database updates, and email campaigns.";
    }
    if (query.includes('event') || query.includes('webinar') || query.includes('hackathon')) {
      return "Our next event is the 'Next-Gen Enterprise Automation Webinar' on June 24, 2026. You can register for free directly in the Events section on the main page!";
    }

    const stopWords = new Set(['what', 'is', 'a', 'the', 'an', 'about', 'how', 'to', 'do', 'you', 'your', 'i', 'can', 'explain', 'tell', 'me', 'please', 'we', 'are', 'in', 'on', 'at', 'for', 'of', 'with', 'any', 'some', 'why']);
    const words = query.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w && !stopWords.has(w));
    
    if (words.length > 0) {
      const topic = words[0].charAt(0).toUpperCase() + words[0].slice(1);
      return `That is a great question about ${topic}! While I am currently operating in offline fallback mode without an active Gemini API key, AI-Solutions can help build custom computer systems and automation layers around ${topic}. Click '📝 Submit Inquiry' to request custom setup!`;
    }

    return "Thank you for asking! AI-Solutions specializes in Chatbots, Figma-to-Code Prototyping, and Workflow Automation. Click '📝 Submit Inquiry' to submit your project details and get started!";
  };

  // Starts the step-by-step inquiry submission form
  const startInquiryFlow = () => {
    setFormStep('AWAITING_NAME');
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      companyName: '',
      country: '',
      jobTitle: '',
      jobDetails: ''
    });
    setMessages(prev => [...prev, {
      sender: 'bot',
      text: "Sure, let's gather your project details to submit an inquiry. First, what is your full name?",
      timestamp: new Date()
    }]);
  };

  // Starts the tracking flow
  const startTrackingFlow = () => {
    setFormStep('AWAITING_LOOKUP');
    setMessages(prev => [...prev, {
      sender: 'bot',
      text: "Please enter your tracking reference (e.g., AI-20260610-1012 or AI-MOCK-XXXXXX) to query the database:",
      timestamp: new Date()
    }]);
  };

  const handleCancelForm = () => {
    setFormStep(null);
    setMessages(prev => [...prev, {
      sender: 'bot',
      text: 'Guided flow cancelled. How else can I assist you today?',
      timestamp: new Date()
    }]);
  };

  const submitInquiryForm = async (finalData: typeof formData) => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/inquiries'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) throw new Error('API server returned error');

      const data = await response.json();
      
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `Inquiry submitted successfully!`,
        isCustomCard: true,
        cardType: 'success',
        cardData: {
          trackingReference: data.trackingReference,
          category: data.category,
          fullName: finalData.fullName,
          companyName: finalData.companyName
        },
        timestamp: new Date()
      }]);
    } catch (err) {
      console.warn('Backend offline. Simulating local form submission in chatbot memory...');
      // Simulate form category auto-categorization
      const text = `${finalData.jobDetails} ${finalData.jobTitle}`.toLowerCase();
      let category = 'General Inquiry';
      if (text.includes('chat') || text.includes('bot') || text.includes('assistant')) {
        category = 'AI Virtual Assistant Request';
      } else if (text.includes('prototype') || text.includes('figma')) {
        category = 'Prototyping Request';
      } else if (text.includes('software') || text.includes('app')) {
        category = 'Software Assistance';
      }

      const mockRef = `AI-MOCK-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // Store in session mock db for tracking
      SESSION_MOCK_INQUIRIES[mockRef] = {
        fullName: finalData.fullName,
        companyName: finalData.companyName,
        category,
        status: 'New',
        createdAt: new Date().toISOString()
      };

      setTimeout(() => {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: `Inquiry submitted successfully (Simulated Offline)!`,
          isCustomCard: true,
          cardType: 'success',
          cardData: {
            trackingReference: mockRef,
            category,
            fullName: finalData.fullName,
            companyName: finalData.companyName,
            isOffline: true
          },
          timestamp: new Date()
        }]);
      }, 500);
    } finally {
      setIsLoading(false);
      setFormStep(null);
    }
  };

  const handleTrackInquiry = async (reference: string) => {
    setIsLoading(true);
    const trackingRef = reference.toUpperCase().trim();
    
    // Add user's reference search message
    setMessages(prev => [...prev, {
      sender: 'user',
      text: trackingRef,
      timestamp: new Date()
    }]);

    try {
      const response = await fetch(getApiUrl(`/api/inquiries/track/${trackingRef}`));
      if (!response.ok) throw new Error('Reference lookup failed');
      const data = await response.json();

      setMessages(prev => [...prev, {
        sender: 'bot',
        text: `Inquiry status found!`,
        isCustomCard: true,
        cardType: 'status',
        cardData: {
          trackingReference: trackingRef,
          fullName: data.fullName,
          companyName: data.companyName,
          category: data.category,
          status: data.status,
          createdAt: data.createdAt
        },
        timestamp: new Date()
      }]);
    } catch (err) {
      // Local fallback lookup
      setTimeout(() => {
        if (SESSION_MOCK_INQUIRIES[trackingRef]) {
          const inq = SESSION_MOCK_INQUIRIES[trackingRef];
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: `Inquiry status found (Local Sandbox)!`,
            isCustomCard: true,
            cardType: 'status',
            cardData: {
              trackingReference: trackingRef,
              fullName: inq.fullName,
              companyName: inq.companyName,
              category: inq.category,
              status: inq.status,
              createdAt: inq.createdAt,
              isOffline: true
            },
            timestamp: new Date()
          }]);
        } else {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: `Could not locate inquiry reference ${trackingRef}. Please verify the tracking number (e.g. AI-YYYYMMDD-XXXX).`,
            timestamp: new Date()
          }]);
        }
      }, 500);
    } finally {
      setIsLoading(false);
      setFormStep(null);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    // Check if user is triggering structured starter paths
    if (text.trim() === '📝 Submit Inquiry') {
      startInquiryFlow();
      return;
    }
    if (text.trim() === '🔍 Track Inquiry') {
      startTrackingFlow();
      return;
    }

    // A. Handle Active Form Steps
    if (formStep) {
      const userInput = text.trim();
      
      // Add user response bubble
      setMessages(prev => [...prev, {
        sender: 'user',
        text: userInput,
        timestamp: new Date()
      }]);
      setInputText('');

      if (formStep === 'AWAITING_NAME') {
        setFormData(prev => ({ ...prev, fullName: userInput }));
        setFormStep('AWAITING_EMAIL');
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: `Thanks, ${userInput}. What is your email address?`,
            timestamp: new Date()
          }]);
        }, 300);
      }
      else if (formStep === 'AWAITING_EMAIL') {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInput);
        if (!isEmailValid) {
          setTimeout(() => {
            setMessages(prev => [...prev, {
              sender: 'bot',
              text: "Hmm, that email doesn't look quite right. Please provide a valid email (e.g. name@company.com):",
              timestamp: new Date()
            }]);
          }, 300);
          return;
        }
        setFormData(prev => ({ ...prev, email: userInput }));
        setFormStep('AWAITING_PHONE');
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'Perfect. What is your contact phone number?',
            timestamp: new Date()
          }]);
        }, 300);
      }
      else if (formStep === 'AWAITING_PHONE') {
        setFormData(prev => ({ ...prev, phone: userInput }));
        setFormStep('AWAITING_COMPANY');
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'Got it. What company are you representing?',
            timestamp: new Date()
          }]);
        }, 300);
      }
      else if (formStep === 'AWAITING_COMPANY') {
        setFormData(prev => ({ ...prev, companyName: userInput }));
        setFormStep('AWAITING_COUNTRY');
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'Which country are you located in?',
            timestamp: new Date()
          }]);
        }, 300);
      }
      else if (formStep === 'AWAITING_COUNTRY') {
        setFormData(prev => ({ ...prev, country: userInput }));
        setFormStep('AWAITING_JOB_TITLE');
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'What is your job title?',
            timestamp: new Date()
          }]);
        }, 300);
      }
      else if (formStep === 'AWAITING_JOB_TITLE') {
        setFormData(prev => ({ ...prev, jobTitle: userInput }));
        setFormStep('AWAITING_JOB_DETAILS');
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'Finally, please describe your project specifications or system requirements in detail:',
            timestamp: new Date()
          }]);
        }, 300);
      }
      else if (formStep === 'AWAITING_JOB_DETAILS') {
        const updatedData = { ...formData, jobDetails: userInput };
        setFormData(updatedData);
        setFormStep('AWAITING_CONFIRM');
        setTimeout(() => {
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'Please review and confirm your details before we submit:',
            isCustomCard: true,
            cardType: 'confirm',
            cardData: updatedData,
            timestamp: new Date()
          }]);
        }, 300);
      }
      else if (formStep === 'AWAITING_LOOKUP') {
        handleTrackInquiry(userInput);
      }
      return;
    }

    // B. Handle General Chat Queries
    const userMsg: Message = {
      sender: 'user',
      text,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      const storedKey = localStorage.getItem('user_gemini_key');
      if (storedKey) {
        headers['x-gemini-key'] = storedKey;
      }

      const response = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers,
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();
      
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: data.reply,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.warn('Backend offline or failed. Checking for client-side Gemini fallback...');
      
      const storedKey = localStorage.getItem('user_gemini_key');
      if (storedKey) {
        try {
          const localPrompt = `You are a virtual assistant for "AI-Solutions", a premium Computer Systems Engineering firm.
Company details:
- Creator/Lead Systems Engineer: Subekchha Sah (built Next.js 14 App Router frontend, Express backend, Sequelize ORM, SQLite/PostgreSQL fallback database).
- Services: AI Virtual Assistants (chatbots, custom API integrations), AI-Powered Prototyping (Figma wireframes to Next.js components), Business Automation (RPA processes, invoicing, scheduling), Digital Workplace Solutions (employee portal, internal search, onboarding).
- Based in: London, United Kingdom.
- Tech stack: Next.js 14, Node.js, Express, Sequelize, SQLite / PostgreSQL.
- Events: Next-Gen Enterprise Automation Webinar (June 24, 2026).
- Articles: "The Future of AI Assistants in DEX", "Transforming Figma to Code with AI", "Enterprise Automation Trends in 2026".

Please answer the user's question professionally, concisely, and cleanly formatted in Markdown.
If they ask for specific pricing or customized quotes, direct them to click "📝 Submit Inquiry" or fill the contact form.

User question: "${text}"
Assistant:`;

          const reply = await callGeminiClientSide(storedKey, localPrompt);
          setMessages(prev => [...prev, {
            sender: 'bot',
            text: reply,
            timestamp: new Date()
          }]);
          return;
        } catch (clientGeminiErr) {
          console.error('Client-side Gemini API call failed:', clientGeminiErr);
        }
      }

      // Local fallback keywords engine
      setTimeout(() => {
        const localReply = getLocalResponse(text);
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: localReply,
          timestamp: new Date()
        }]);
      }, 500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end w-full sm:w-auto h-full sm:h-auto pointer-events-none">
      
      {/* Expanded Chat Box */}
      {isOpen && (
        <div className="w-full h-[100dvh] sm:w-[410px] sm:h-[600px] sm:rounded-[32px] rounded-none border-0 sm:border border-brand-border bg-gradient-to-b from-white/95 to-slate-50/95 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden animate-float-in transition-all pointer-events-auto sm:mb-4">
          
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-primary/10 via-brand-purple/10 to-brand-secondary/10 border-b border-brand-border/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-purple flex items-center justify-center shadow-sm">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-brand-charcoal leading-tight">Virtual Assistant</h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">Online & Verified</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`p-1.5 rounded-xl transition-all border border-brand-border ${
                  isSettingsOpen 
                    ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30 shadow-inner' 
                    : 'bg-brand-dark hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary'
                }`}
                title="Configure Local API Key"
                aria-label="Configure Local API Key"
              >
                <Settings className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  setIsSettingsOpen(false);
                }}
                className="p-1.5 rounded-xl bg-brand-dark hover:bg-brand-primary/10 text-brand-muted hover:text-brand-primary transition-all border border-brand-border"
                aria-label="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* API Key settings panel or standard Chat Interface */}
          {isSettingsOpen ? (
            <div className="flex-grow flex flex-col p-5 bg-gradient-to-b from-white to-slate-50/80 space-y-4 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="flex items-center gap-2 text-brand-charcoal font-bold text-xs">
                <Settings className="w-4 h-4 text-brand-primary animate-spin" style={{ animationDuration: '4s' }} />
                <span>Configure Chatbot AI</span>
              </div>
              <p className="text-[10px] text-brand-muted leading-relaxed">
                By default, this chatbot uses the credentials configured in the Admin Dashboard.
                To test live AI responses using your own key, enter your personal Google Gemini API Key below. It is saved securely in your local browser storage.
              </p>
              
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-wider font-extrabold text-brand-muted block">Gemini API Key</label>
                <div className="relative">
                  <input
                    type={showUserKey ? 'text' : 'password'}
                    value={userGeminiKey}
                    onChange={(e) => setUserGeminiKey(e.target.value)}
                    placeholder="AIzaSy..."
                    className="w-full bg-brand-dark border border-brand-border rounded-xl pl-4 pr-10 py-2 text-[11px] text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUserKey(!showUserKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-muted hover:text-brand-charcoal"
                  >
                    {showUserKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                <span className="text-[8px] text-brand-muted block">
                  Get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-brand-primary hover:underline font-bold">Google AI Studio</a>.
                </span>
              </div>

              <div className="flex gap-2 pt-2 mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    localStorage.setItem('user_gemini_key', userGeminiKey);
                    setIsSettingsOpen(false);
                    setMessages(prev => [...prev, {
                      sender: 'bot',
                      text: userGeminiKey 
                        ? '🔑 Gemini API Key configured locally! I am now running in live AI mode. Ask me anything!' 
                        : '🔑 Local Gemini API Key cleared. I am now falling back to server credentials.',
                      timestamp: new Date()
                    }]);
                  }}
                  className="flex-grow py-2 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-purple hover:opacity-95 text-white text-[10px] font-bold transition-all text-center shadow-md shadow-brand-primary/15"
                >
                  Save Local Credentials
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setUserGeminiKey('');
                    localStorage.removeItem('user_gemini_key');
                    setIsSettingsOpen(false);
                    setMessages(prev => [...prev, {
                      sender: 'bot',
                      text: '🔑 Local credentials cleared.',
                      timestamp: new Date()
                    }]);
                  }}
                  className="px-3 py-2 rounded-xl bg-brand-dark hover:bg-brand-primary/10 border border-brand-border text-brand-muted hover:text-brand-primary text-[10px] font-bold transition-all"
                >
                  Clear Key
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Feed */}
              <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/30 via-white/80 to-slate-100/10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 max-w-[88%] ${
                      msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    {/* Profile Icon */}
                    <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border shadow-sm ${
                      msg.sender === 'user'
                        ? 'bg-brand-purple/10 text-brand-purple border-brand-purple/20'
                        : 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                    }`}>
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    {/* Bubble & Cards */}
                    <div className="space-y-1">
                      
                      {msg.isCustomCard ? (
                        // Render Custom Premium Cards
                        <div className="bg-white border border-brand-border/80 rounded-2xl p-4 shadow-sm text-xs leading-relaxed space-y-3">
                          
                          {msg.cardType === 'success' && (
                            <>
                              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Inquiry Filed Successfully!</span>
                              </div>
                              
                              <div className="bg-brand-dark p-3 rounded-xl border border-brand-border space-y-1 text-[11px] font-semibold text-brand-muted">
                                <p>Ref: <span className="font-mono text-brand-primary font-bold">{msg.cardData.trackingReference}</span></p>
                                <p>Client: <span className="text-brand-charcoal">{msg.cardData.fullName}</span></p>
                                <p>Company: <span className="text-brand-charcoal">{msg.cardData.companyName}</span></p>
                                <p>Auto-Category: <span className="text-brand-secondary font-bold">{msg.cardData.category}</span></p>
                                {msg.cardData.isOffline && <p className="text-[10px] text-amber-600 italic">Saved in chat session database</p>}
                              </div>
                              <p className="text-[10px] text-brand-muted">
                                You can track your inquiry directly in this chat by typing the reference number.
                              </p>
                            </>
                          )}

                          {msg.cardType === 'confirm' && (
                            <>
                              <div className="flex items-center gap-2 text-brand-purple font-bold">
                                <ClipboardCheck className="w-4 h-4" />
                                <span>Inquiry Details Summary</span>
                              </div>
                              
                              <div className="bg-brand-dark p-3 rounded-xl border border-brand-border space-y-2 text-[11px] font-semibold text-brand-muted max-h-48 overflow-y-auto">
                                <div><span className="text-[9px] uppercase tracking-wider block text-brand-muted/70">Full Name</span><span className="text-brand-charcoal">{msg.cardData.fullName}</span></div>
                                <div><span className="text-[9px] uppercase tracking-wider block text-brand-muted/70">Email</span><span className="text-brand-charcoal">{msg.cardData.email}</span></div>
                                <div><span className="text-[9px] uppercase tracking-wider block text-brand-muted/70">Phone</span><span className="text-brand-charcoal">{msg.cardData.phone}</span></div>
                                <div><span className="text-[9px] uppercase tracking-wider block text-brand-muted/70">Company</span><span className="text-brand-charcoal">{msg.cardData.companyName}</span></div>
                                <div><span className="text-[9px] uppercase tracking-wider block text-brand-muted/70">Country</span><span className="text-brand-charcoal">{msg.cardData.country}</span></div>
                                <div><span className="text-[9px] uppercase tracking-wider block text-brand-muted/70">Job Title</span><span className="text-brand-charcoal">{msg.cardData.jobTitle}</span></div>
                                <div><span className="text-[9px] uppercase tracking-wider block text-brand-muted/70">Specifications</span><span className="text-brand-charcoal font-sans font-normal leading-relaxed">{msg.cardData.jobDetails}</span></div>
                              </div>

                              <div className="flex gap-2">
                                <button
                                  type="button"
                                  onClick={() => submitInquiryForm(msg.cardData)}
                                  className="flex-grow py-2 rounded-xl bg-brand-primary hover:bg-pink-600 text-white text-[10px] font-bold shadow-md shadow-brand-primary/15 transition-all"
                                >
                                  Confirm & Submit
                                </button>
                                <button
                                  type="button"
                                  onClick={handleCancelForm}
                                  className="px-3 py-2 rounded-xl bg-brand-dark hover:bg-brand-primary/10 border border-brand-border text-brand-muted hover:text-brand-primary text-[10px] font-bold transition-all"
                                >
                                  Cancel
                                </button>
                              </div>
                            </>
                          )}

                          {msg.cardType === 'status' && (
                            <>
                              <div className="flex items-center gap-2 text-brand-secondary font-bold">
                                <FileText className="w-4 h-4" />
                                <span>Inquiry Registry Lookup</span>
                              </div>
                              
                              <div className="bg-brand-dark p-3 rounded-xl border border-brand-border space-y-1.5 text-[11px] font-semibold text-brand-muted">
                                <p>Ref: <span className="font-mono text-brand-primary font-bold">{msg.cardData.trackingReference}</span></p>
                                <p>Name: <span className="text-brand-charcoal">{msg.cardData.fullName}</span></p>
                                <p>Company: <span className="text-brand-charcoal">{msg.cardData.companyName}</span></p>
                                <p>Classification: <span className="text-brand-charcoal">{msg.cardData.category}</span></p>
                                <p>Submitted: <span className="text-brand-charcoal">{new Date(msg.cardData.createdAt).toLocaleDateString()}</span></p>
                                <p>Status: <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                  msg.cardData.status === 'New' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' :
                                  msg.cardData.status === 'In Progress' ? 'bg-amber-950 text-amber-400 border border-amber-900/50' :
                                  msg.cardData.status === 'Processed' ? 'bg-purple-950 text-purple-400 border border-purple-900/50' :
                                  'bg-slate-900 text-slate-400 border border-slate-800'
                                }`}>{msg.cardData.status}</span></p>
                              </div>
                              <p className="text-[10px] text-brand-muted">
                                {msg.cardData.status === 'New' 
                                  ? 'Our team has categorized this request and a systems representative will contact you shortly.'
                                  : msg.cardData.status === 'In Progress' 
                                  ? 'An engineer is currently reviewing the specifications and draft layouts.'
                                  : 'Your inquiry has been processed. Please check your inbox for details.'}
                              </p>
                            </>
                          )}

                        </div>
                      ) : (
                        // Standard text bubbles with premium styling
                        <div className={`rounded-2xl p-3 text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-gradient-to-tr from-brand-primary to-brand-purple text-white rounded-tr-none shadow-sm'
                            : 'bg-white border border-brand-border text-brand-charcoal rounded-tl-none shadow-sm'
                        }`}>
                          {msg.text.split('\n').map((line, idx) => (
                            <p key={idx} className={line.startsWith('- ') ? 'pl-2 text-[11px]' : ''}>
                              {line}
                            </p>
                          ))}
                        </div>
                      )}

                      <span className="text-[9px] text-brand-muted px-1 block">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="w-7 h-7 rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20 flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white border border-brand-border rounded-2xl rounded-tl-none p-3 flex gap-1.5 items-center justify-center shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Guided flow cancellation help desk */}
              {formStep && formStep !== 'AWAITING_CONFIRM' && (
                <div className="px-4 py-2 border-t border-brand-border/50 bg-brand-dark flex justify-between items-center text-[10px] text-brand-muted">
                  <span>Guided flow active. Enter details below.</span>
                  <button
                    type="button"
                    onClick={handleCancelForm}
                    className="font-bold text-brand-primary hover:underline"
                  >
                    Cancel Flow
                  </button>
                </div>
              )}

              {/* Starter Prompts */}
              {!formStep && messages.length === 1 && (
                <div className="px-4 pb-3 flex flex-wrap gap-2">
                  {starterQuestions.map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => handleSendMessage(q)}
                      className="text-[10px] font-bold px-3 py-1.5 rounded-full bg-white hover:bg-brand-primary/10 border border-brand-border hover:border-brand-primary text-brand-muted hover:text-brand-primary transition-all duration-200 shadow-sm"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Chat Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage(inputText);
                }}
                className="p-3 border-t border-brand-border/60 bg-brand-dark/50 flex gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    formStep === 'AWAITING_NAME' ? "Enter your full name..." :
                    formStep === 'AWAITING_EMAIL' ? "Enter your email..." :
                    formStep === 'AWAITING_PHONE' ? "Enter phone number..." :
                    formStep === 'AWAITING_COMPANY' ? "Enter company name..." :
                    formStep === 'AWAITING_COUNTRY' ? "Enter country..." :
                    formStep === 'AWAITING_JOB_TITLE' ? "Enter job title..." :
                    formStep === 'AWAITING_JOB_DETAILS' ? "Describe your project requirements..." :
                    formStep === 'AWAITING_LOOKUP' ? "Enter tracking reference..." :
                    "Ask a question or request form..."
                  }
                  className="flex-grow bg-white border border-brand-border rounded-xl px-4 py-2 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors shadow-sm"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isLoading || formStep === 'AWAITING_CONFIRM'}
                  className="p-2 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-purple hover:opacity-95 disabled:bg-white disabled:border disabled:border-brand-border disabled:text-brand-muted text-white transition-all shadow-sm"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}

      {/* Floating Circular Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`${
          isOpen ? 'hidden sm:flex' : 'flex'
        } w-14 h-14 rounded-full bg-gradient-to-tr from-brand-primary to-brand-purple hover:opacity-95 text-white items-center justify-center shadow-lg shadow-brand-primary/25 transition-transform active:scale-95 duration-200 relative group animate-float pointer-events-auto mr-6 mb-6 sm:mr-0 sm:mb-0`}
        aria-label="Toggle AI Assistant Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        
        {/* Glow Ring */}
        <span className="absolute -inset-1.5 rounded-full border border-brand-primary/20 animate-ping pointer-events-none"></span>
      </button>

    </div>
  );
}
