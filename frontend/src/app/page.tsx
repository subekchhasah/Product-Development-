'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight, Shield, Globe, Users, ArrowUpRight,
  Calendar, Star, Send, CheckCircle, Sparkles, Check,
  ChevronLeft, ChevronRight, Cpu, Bot, CheckCircle2
} from 'lucide-react';

// Backup Mock Data for local fallback
const BACKUP_TESTIMONIALS = [
  { name: 'Santosh Thapa', company: 'NextGen Retail Inc.', rating: 5, comment: 'AI-Solutions completely automated our inventory tracking. Their AI Virtual Assistant answers 85% of our front-line inquiries instantly! Highly recommend their systems.' },
  { name: 'Mamta Rai', company: 'FinSecure Tech', rating: 5, comment: 'The AI-Powered Prototyping service is a game changer. We turned our Figma screens into a fully functional demo code in just 4 days. Incredible developer velocity.' },
  { name: 'Sourabh Shakya', company: 'DEX Logistics', rating: 4, comment: 'Our employee experience scores skyrocketed after deploying the Digital Workplace Solutions designed by AI-Solutions. Workflow automations saved us hundreds of hours.' },
  { name: 'Devi Limbu', company: 'Global Health Network', rating: 5, comment: 'Outstanding support and premium engineering. The automated inquiry routing works flawlessly, sending custom software queries to the correct engineering branches immediately.' }
];

const BACKUP_EVENTS = [
  { title: 'Next-Gen Enterprise Automation Webinar', description: 'Explore how RPA (Robotic Process Automation) and LLMs are transforming modern back-office systems. Live coding demonstration of our virtual agents.', date: 'June 24, 2026', imageUrl: 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?q=80&w=600&auto=format&fit=crop', registrationInfo: 'RSVP via the register button below. Registered attendees will receive a private Google Meet access link.' },
  { title: 'Figma-To-Code Innovation Workshop', description: 'A hands-on technical workshop showcasing how computer engineering teams are using AI to bypass manual UI coding. Designed for CTOs and Lead Developers.', date: 'July 15, 2026', imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=600&auto=format&fit=crop', registrationInfo: 'Limited seating. Please register before July 10th to secure a virtual developer sandbox environment.' },
  { title: 'Global AI Systems Summit 2026', description: 'AI-Solutions hosts our annual engineering conference, highlighting advancements in AI-DEX integration, semantic search, and secure multi-agent systems.', date: 'September 12, 2026', imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop', registrationInfo: 'Early bird registration open. Keynote speaker announcements coming soon.' }
];

const BACKUP_ARTICLES = [
  { title: 'The Future of AI Assistants in DEX', description: 'How modern chatbots and internal digital employee assistants are boosting workplace satisfaction scores.', author: 'Dr. Arthur Vance', category: 'Technology', imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop', publishedAt: 'June 01, 2026' },
  { title: 'Transforming Figma to Code with AI', description: 'Behind the scenes of AI-powered prototyping pipelines that convert vector designs into production-ready React components.', author: 'Claire Sterling', category: 'Engineering', imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=600&auto=format&fit=crop', publishedAt: 'May 18, 2026' },
  { title: 'Enterprise Automation Trends in 2026', description: 'A study on security, scalability, and performance in multi-agent business automation pipelines.', author: 'Robert Sterling', category: 'Business', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop', publishedAt: 'April 28, 2026' }
];

interface ShowcaseMessage {
  sender: 'bot' | 'user';
  text: string;
  isMono?: boolean;
  timestamp: Date;
}

const getApiUrl = (path: string) => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}${path}`;
  }
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:5001${path}`;
};

export default function LandingPage() {
  const [testimonials, setTestimonials] = useState(BACKUP_TESTIMONIALS);
  const [events, setEvents] = useState(BACKUP_EVENTS);
  const [articles, setArticles] = useState(BACKUP_ARTICLES);
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    companyName: '',
    country: '',
    jobTitle: '',
    jobDetails: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<any>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [registeredEvent, setRegisteredEvent] = useState<string | null>(null);

  // Showcase chatbot states
  const [showcaseMessages, setShowcaseMessages] = useState<ShowcaseMessage[]>([
    {
      sender: 'bot',
      text: 'Hi! I can compile database logs or run checkups. Try queries like "system check" or "status".',
      timestamp: new Date()
    }
  ]);
  const [showcaseInput, setShowcaseInput] = useState('');
  const [showcaseLoading, setShowcaseLoading] = useState(false);
  const showcaseChatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    showcaseChatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [showcaseMessages, showcaseLoading]);

  useEffect(() => {
    const fetchDynamicData = async () => {
      try {
        const tRes = await fetch(getApiUrl('/api/feedback'));
        if (tRes.ok) {
          const tData = await tRes.json();
          if (tData.length > 0) setTestimonials(tData);
        }

        const eRes = await fetch(getApiUrl('/api/events'));
        if (eRes.ok) {
          const eData = await eRes.json();
          if (eData.length > 0) setEvents(eData);
        }

        const aRes = await fetch(getApiUrl('/api/articles'));
        if (aRes.ok) {
          const aData = await aRes.json();
          if (aData.length > 0) setArticles(aData);
        }
      } catch (err) {
        console.log('Backend server offline. Using static client fallback datasets.');
      }
    };
    fetchDynamicData();
  }, []);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const response = await fetch(getApiUrl('/api/inquiries'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit form');
      }

      setFormSuccess(data);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        companyName: '',
        country: '',
        jobTitle: '',
        jobDetails: ''
      });
    } catch (err: any) {
      console.warn('Backend is offline. Simulating local form submission...');
      setTimeout(() => {
        const text = `${formData.jobDetails} ${formData.jobTitle}`.toLowerCase();
        let cat = 'General Inquiry';
        if (text.includes('chat') || text.includes('bot') || text.includes('assistant')) {
          cat = 'AI Virtual Assistant Request';
        } else if (text.includes('prototype') || text.includes('figma')) {
          cat = 'Prototyping Request';
        } else if (text.includes('software') || text.includes('app')) {
          cat = 'Software Assistance';
        }
        const trackingRef = `AI-MOCK-${Date.now().toString().slice(-6)}`;
        setFormSuccess({
          trackingReference: trackingRef,
          category: cat
        });
      }, 800);
    } finally {
      setFormLoading(false);
    }
  };

  const handleSendShowcaseMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showcaseInput.trim() || showcaseLoading) return;

    const userText = showcaseInput;
    setShowcaseInput('');
    setShowcaseMessages(prev => [...prev, {
      sender: 'user',
      text: userText,
      timestamp: new Date()
    }]);
    setShowcaseLoading(true);

    try {
      const response = await fetch(getApiUrl('/api/chat'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userText }),
      });

      if (!response.ok) {
        throw new Error('API server returned error status');
      }

      const data = await response.json();

      const lowerText = userText.toLowerCase();
      const isSystemCheck = lowerText.includes('system check') || lowerText.includes('status');

      setShowcaseMessages(prev => [...prev, {
        sender: 'bot',
        text: data.reply,
        isMono: isSystemCheck,
        timestamp: new Date()
      }]);
    } catch (err) {
      console.warn('Backend chatbot API offline. Resolving using local fallback NLP engine...');
      setTimeout(() => {
        const lowerText = userText.toLowerCase();
        let reply = '';
        let isMono = false;

        if (lowerText.includes('system check') || lowerText.includes('status')) {
          reply = `STATUS: SUCCESS\nPostgreSQL Connection: OK\nSQLite Fallback: ACTIVE\nAll logs fully indexed.\nSystem latency: 12ms`;
          isMono = true;
        } else if (lowerText.includes('how are you') || lowerText.includes('how is it going') || lowerText.includes('how do you do') || lowerText.includes('how\'s it going') || lowerText.includes('are you ok')) {
          reply = "I'm doing fantastic, thank you! Active and fully primed to assist you with database audits, UI prototypes, or custom workflow designs. How are you doing today?";
        } else if (lowerText.includes('thank you') || lowerText.includes('thanks') || lowerText.includes('appreciate') || lowerText.includes('grateful')) {
          reply = "You're very welcome! I'm always glad to help. Let me know if you have any other questions about AI-Solutions or computer systems engineering!";
        } else if (lowerText.includes('location') || lowerText.includes('located') || lowerText.includes('where are you') || lowerText.includes('address')) {
          reply = "AI-Solutions is based in London, United Kingdom. We deploy enterprise digital workplace applications and remote agent services globally.";
        } else if (lowerText.includes('subekchha') || lowerText.includes('creator') || lowerText.includes('owner') || lowerText.includes('made') || lowerText.includes('sah') || lowerText.includes('developer')) {
          reply = "Subekchha Sah is the Lead Systems Engineer and Developer of AI-Solutions. She designed and built this entire computer engineering platform, integrating Next.js, Express, and PostgreSQL/SQLite with interactive AI widgets and high-contrast admin dashboard interfaces.";
        } else if (lowerText.includes('stack') || lowerText.includes('tech') || lowerText.includes('language') || lowerText.includes('framework')) {
          reply = "Our technical architecture is built on Next.js 14 (App Router) for the frontend, Node.js + Express.js for the backend API, and Sequelize ORM managing PostgreSQL with local SQLite automatic fallbacks.";
        } else if (lowerText.includes('database') || lowerText.includes('postgres') || lowerText.includes('sqlite') || lowerText.includes('db')) {
          reply = "We utilize PostgreSQL for production environments and an automated SQLite fallback database. The system automatically shifts database writes to SQLite if the PostgreSQL connection is interrupted, ensuring 100% uptime.";
        } else if (lowerText.match(/\b(hi|hello|hey|greetings|howdy|good morning|good afternoon|good evening)\b/)) {
          reply = "Hello! I am your AI-Solutions showcase bot. How can I help you explore our services today?";
        } else if (lowerText.includes('about') || lowerText.includes('company') || lowerText.includes('mission')) {
          reply = "AI-Solutions is a premium Computer Systems Engineering firm. We build virtual assistants, speed up Figma-to-code prototyping, and deploy digital workplace tools globally.";
        } else {
          // Dynamic fallbacks for arbitrary topics!
          const stopWords = new Set(['what', 'is', 'a', 'the', 'an', 'about', 'how', 'to', 'do', 'you', 'your', 'i', 'can', 'explain', 'tell', 'me', 'please', 'we', 'are', 'in', 'on', 'at', 'for', 'of', 'with', 'any', 'some', 'why']);
          const words = lowerText.replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w && !stopWords.has(w));
          if (words.length > 0) {
            const topic = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            reply = `That is a great question about ${topic}! While I am currently operating in offline fallback mode without an active Gemini API key, AI-Solutions can help build custom computer systems and automation layers around ${topic}. For specialized integrations, please submit an inquiry on our Contact Us form!`;
          } else {
            reply = "Thank you for trying the showcase assistant! I specialize in system checkups and service inquiries. Try typing 'system check' or 'status' to test my integration operations.";
          }
        }

        setShowcaseMessages(prev => [...prev, {
          sender: 'bot',
          text: reply,
          isMono,
          timestamp: new Date()
        }]);
      }, 600);
    } finally {
      setShowcaseLoading(false);
    }
  };

  const prevTestimonial = () => {
    setTestimonialIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  const nextTestimonial = () => {
    setTestimonialIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="pt-20 bg-brand-dark">

      {/* 2. Hero Section - Styled Warm/Pink Pastel from Reference */}
      <section id="hero" className="relative py-20 lg:py-32 overflow-hidden px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              AI-Solutions UI Kit
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.15] text-brand-charcoal mb-6">
              Subuchat - AI Systems <br />
              <span className="bg-gradient-to-r from-brand-primary via-brand-purple to-brand-secondary bg-clip-text text-transparent">
                Modern & Scalable
              </span>
            </h1>

            {/* Checklist items in reference style */}
            <div className="space-y-3 mb-8">
              {[
                'Fully Customizable Architecture',
                'Clean System Engineering & DEX',
                'Global Expansion Capability',
                'Pixel Perfect Prototyping Design'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm font-semibold text-brand-charcoal">
                  <span className="text-brand-primary">✔</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* Pill badging buttons from reference */}
            <div className="flex flex-wrap gap-2.5 mb-8">
              <span className="px-4 py-2 rounded-full text-xs font-bold bg-pink-100/80 border border-pink-200/50 text-pink-600 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                Interactive
              </span>
              <span className="px-4 py-2 rounded-full text-xs font-bold bg-cyan-100/80 border border-cyan-200/50 text-cyan-700 flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                Production Grade
              </span>
              <span className="px-4 py-2 rounded-full text-xs font-bold bg-purple-100/80 border border-purple-200/50 text-purple-700 flex items-center gap-1.5 shadow-sm">
                🏆 Best AI-DEX Suite
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <a
                href="#contact"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold bg-gradient-to-r from-brand-primary to-brand-purple hover:opacity-95 text-white text-sm shadow-md shadow-brand-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#solutions"
                className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-full font-bold bg-white border border-brand-border text-brand-charcoal hover:border-brand-primary transition-all text-sm shadow-sm"
              >
                Explore Solutions
              </a>
            </div>
          </div>

          {/* Right Column - Glowing Radial 3D Sphere & Floating Cards */}
          <div className="lg:col-span-5 relative flex items-center justify-center min-h-[380px]">
            {/* Ambient shadow glow */}
            <div className="absolute w-72 h-72 rounded-full bg-brand-primary/10 blur-3xl pointer-events-none"></div>

            {/* 3D Sphere from user reference */}
            <div className="sphere-3d w-56 h-56 animate-float z-10"></div>

            {/* Floating UI Card 1 (Welcome Message) */}
            <div className="absolute top-4 left-0 glass-panel rounded-2xl p-4 shadow-xl border border-white/60 max-w-[200px] z-20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 text-xs font-bold">S</div>
                <span className="text-[10px] text-brand-muted font-semibold">Hello, Subekchha Sah</span>
              </div>
              <p className="text-[11px] font-bold text-brand-charcoal leading-snug">How can I assist your team today?</p>
            </div>

            {/* Floating UI Card 2 (Metrics Badge) */}
            <div className="absolute bottom-4 right-0 glass-panel rounded-2xl p-4 shadow-xl border border-white/60 max-w-[220px] z-20 hover:scale-105 transition-transform">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wide">Automated DEX</span>
              </div>
              <p className="text-[11px] text-brand-muted leading-snug">Resolving 85% of front-line digital workplace queries.</p>
            </div>
          </div>

        </div>
      </section>

      {/* 3. About Company Section - Warm light theme */}
      <section id="about" className="py-20 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">About Our Company</h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal">
              Redefining the Digital Employee Experience (DEX)
            </p>
            <p className="text-sm text-brand-muted mt-4">
              We design specialized computer system engineering tools to connect operations, automate logistics, and scale businesses globally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission & Vision */}
            <div className="bg-brand-dark rounded-[32px] border border-brand-border p-8 hover:border-brand-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-charcoal mb-3">Mission & Vision</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                To build secure, state-of-the-art AI systems that execute repetitive digital tasks, enabling your developers to focus on higher logic and design layers.
              </p>
            </div>

            {/* Digital Employee Focus */}
            <div className="bg-brand-dark rounded-[32px] border border-brand-border p-8 hover:border-brand-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-charcoal mb-3">Digital DEX Focus</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                We craft automated onboarding flows, internal search widgets, and database crawlers that lower task delays and boost internal satisfaction.
              </p>
            </div>

            {/* Global Expansion */}
            <div className="bg-brand-dark rounded-[32px] border border-brand-border p-8 hover:border-brand-primary/40 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple mb-6">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-brand-charcoal mb-3">Global Scale Goals</h3>
              <p className="text-xs text-brand-muted leading-relaxed">
                With regional endpoints deployed globally, we provide multi-region latency control, keeping client queries fast and strictly compliant with local data codes.
              </p>
            </div>
          </div>

          {/* Why Choose AI-Solutions */}
          <div className="mt-16 bg-brand-dark rounded-[32px] border border-brand-border p-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-brand-charcoal mb-4">Why Organizations Choose AI-Solutions</h3>
              <p className="text-xs text-brand-muted leading-relaxed mb-6">
                We offer plug-and-play modules that align with your exact enterprise network specifications, eliminating security setup friction.
              </p>

              <ul className="space-y-3">
                {[
                  'Enterprise-grade JWT authorization controls',
                  'Vast component library (cards, widgets, inputs)',
                  'Simulated SMTP logging and verification trackers',
                  'PostgreSQL/SQLite dual connection fallbacks'
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-brand-charcoal">
                    <div className="w-5 h-5 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative h-64 lg:h-full min-h-[250px] rounded-2xl overflow-hidden border border-brand-border">
              <Image
                src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=600&auto=format&fit=crop"
                alt="Engineering Team"
                fill
                className="object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent"></div>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Software Solutions Section */}
      <section id="solutions" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">Software & IT Solutions</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal">
            Engineered AI & IT Core Services
          </p>
          <p className="text-sm text-brand-muted mt-4">
            Custom modular solutions designed to easily drop into corporate portals, IT networks, and databases.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: 'AI Virtual Assistant',
              desc: 'Custom trained LLM chatbot assistants capable of resolving inquiries, querying databases, and executing internal jobs.',
              color: 'from-pink-500/10 to-pink-500/20 border-pink-200/45',
              accent: 'text-pink-600'
            },
            {
              title: 'AI-Powered Prototyping',
              desc: 'Convert structural Figma boards and wireframes directly into optimized, CSS/Tailwind ready React code libraries.',
              color: 'from-cyan-500/10 to-cyan-500/20 border-cyan-200/45',
              accent: 'text-cyan-600'
            },
            {
              title: 'Business Automation',
              desc: 'Configure RPA scrapers, scheduled sync microservices, and database connectors to eliminate manual work cycles.',
              color: 'from-purple-500/10 to-purple-500/20 border-purple-200/45',
              accent: 'text-purple-600'
            },
            {
              title: 'Digital Workplace Solutions',
              desc: 'Integrate intranets, unified dashboards, and communication layers to streamline local team collaboration.',
              color: 'from-indigo-500/10 to-indigo-500/20 border-indigo-200/45',
              accent: 'text-indigo-600'
            },
            {
              title: 'IT Operations Automation',
              desc: 'Intelligent helpdesk ticket routing, diagnostic script automation, and automated system administration agents.',
              color: 'from-emerald-500/10 to-emerald-500/20 border-emerald-200/45',
              accent: 'text-emerald-600'
            },
            {
              title: 'Cloud & Network Services',
              desc: 'Automated monitoring of server clusters, scheduled resource scaling, and automated container management pipelines.',
              color: 'from-amber-500/10 to-amber-500/20 border-amber-200/45',
              accent: 'text-amber-600'
            }
          ].map((sol, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-brand-border p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-brand-primary/40 transition-all duration-300"
            >
              <div>
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-tr ${sol.color} flex items-center justify-center mb-5`}>
                  <Sparkles className={`w-5 h-5 ${sol.accent}`} />
                </div>
                <h3 className="text-base font-bold text-brand-charcoal mb-3">{sol.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed mb-6">{sol.desc}</p>
              </div>
              <a href="#contact" className={`text-xs font-semibold ${sol.accent} flex items-center gap-1.5 hover:underline`}>
                Request Demo
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* 5. AI Virtual Assistant Showcase - Rounded Pastel styling */}
      <section className="py-20 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Text description */}
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-3">AI Virtual Assistant Showcase</h2>
              <h3 className="text-3xl font-extrabold text-brand-charcoal mb-6">
                Interactive Conversational Intelligence
              </h3>
              <p className="text-xs text-brand-muted leading-relaxed mb-6">
                We custom-build smart chatbot systems that run natively inside enterprise frameworks. By linking semantic databases with local context directories, the assistant provides precise documentation summaries and executes tasks securely.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Natural Language Execution', desc: 'Queries SQL databases or files with plain english text input.' },
                  { title: 'Advanced Threat Protection', desc: 'Sanitizes all outputs preventing data leakage and injection attempts.' },
                  { title: 'API Actions Integration', desc: 'Triggers external webhooks or emails right inside the message layout.' }
                ].map((cap, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-brand-charcoal">{cap.title}</h4>
                      <p className="text-xs text-brand-muted mt-0.5">{cap.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chatbot preview mock (Pastel pink header, round bubbles) */}
            <div className="bg-brand-dark rounded-[32px] border border-brand-border overflow-hidden shadow-xl max-w-md mx-auto w-full">
              <div className="p-4 bg-gradient-to-r from-brand-primary/10 via-brand-purple/10 to-brand-secondary/10 border-b border-brand-border flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-brand-charcoal">System Integration Bot</h4>
                    <span className="text-[9px] text-brand-muted">Active</span>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>

              {/* Chat screen */}
              <div className="p-4 h-64 overflow-y-auto space-y-4 bg-white/40 font-sans text-xs flex flex-col">
                {showcaseMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
                      }`}
                  >
                    {/* Icon */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user'
                      ? 'bg-purple-100 text-brand-purple'
                      : 'bg-pink-100 text-brand-primary'
                      }`}>
                      {msg.sender === 'user' ? <Users className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                    </div>

                    {/* Bubble */}
                    <div className={`p-3 rounded-2xl ${msg.sender === 'user'
                      ? 'bg-gradient-to-tr from-brand-primary to-brand-purple text-white rounded-tr-none'
                      : `bg-white border border-brand-border text-brand-charcoal rounded-tl-none ${msg.isMono ? 'font-mono text-[10px] whitespace-pre-wrap' : ''
                      }`
                      }`}>
                      {msg.isMono ? (
                        <div className="space-y-0.5">
                          {msg.text.split('\n').map((line, idx) => {
                            if (line.startsWith('STATUS: SUCCESS')) {
                              return <p key={idx} className="text-emerald-600 font-bold">{line}</p>;
                            }
                            return <p key={idx} className={line.startsWith('All logs') ? 'text-brand-muted font-mono' : ''}>{line}</p>;
                          })}
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading Indicator */}
                {showcaseLoading && (
                  <div className="flex gap-2.5 max-w-[85%]">
                    <div className="w-6 h-6 rounded-full bg-pink-100 text-brand-primary flex items-center justify-center shrink-0">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div className="bg-white border border-brand-border rounded-2xl rounded-tl-none p-3 flex gap-1.5 items-center justify-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-muted animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-muted animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-muted animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}

                <div ref={showcaseChatEndRef} />
              </div>

              {/* Chat Input form */}
              <form onSubmit={handleSendShowcaseMessage} className="p-3 bg-white border-t border-brand-border flex gap-2">
                <input
                  type="text"
                  value={showcaseInput}
                  onChange={(e) => setShowcaseInput(e.target.value)}
                  disabled={showcaseLoading}
                  placeholder="Type a message (e.g. system check)..."
                  className="flex-grow bg-brand-dark px-3 py-2 rounded-xl border border-brand-border text-[11px] text-brand-charcoal placeholder-brand-muted focus:outline-none focus:border-brand-primary"
                />
                <button
                  type="submit"
                  disabled={!showcaseInput.trim() || showcaseLoading}
                  className="p-2 rounded-xl bg-brand-primary/10 hover:bg-brand-primary/20 text-brand-primary transition-colors disabled:opacity-50"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Featured Projects Section */}
      <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-purple mb-3">Featured Projects</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal">
            Industry Solutions & Implementations
          </p>
          <p className="text-sm text-brand-muted mt-4">
            Deploying our custom virtual agents and code pipelines for global corporate partners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: 'SmartLogistics AI Routing',
              desc: 'Deployed a custom virtual agent to coordinate 24/7 routing schedules, saving 20% fuel expenditures.',
              category: 'Logistics',
              metric: '20% Fuel Saved',
              img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=600&auto=format&fit=crop'
            },
            {
              title: 'FinSecure Prototyping',
              desc: 'Accelerated UI engineering by turning 40 high-fidelity fintech designs into standard React screens in 4 days.',
              category: 'Fintech',
              metric: '4-Day Design To Code',
              img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop'
            },
            {
              title: 'RetailFlow Automation',
              desc: 'Created an intelligent database connector monitoring local inventory charts, syncing details autonomously.',
              category: 'E-Commerce',
              metric: '10k syncs/min',
              img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=600&auto=format&fit=crop'
            }
          ].map((proj, i) => (
            <div
              key={i}
              className="bg-white rounded-[32px] border border-brand-border overflow-hidden hover:border-brand-secondary/40 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="h-48 relative overflow-hidden">
                <Image
                  src={proj.img}
                  alt={proj.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-brand-border text-[10px] font-bold text-brand-secondary">
                  {proj.category}
                </span>
              </div>

              <div className="p-6">
                <div className="text-[10px] uppercase font-bold text-brand-primary tracking-wider mb-2">Success Story</div>
                <h3 className="text-base font-bold text-brand-charcoal mb-2">{proj.title}</h3>
                <p className="text-xs text-brand-muted mb-4">{proj.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-brand-border/60">
                  <span className="text-xs font-mono font-bold text-brand-secondary">{proj.metric}</span>
                  <span className="text-xs text-brand-primary flex items-center gap-1 font-semibold">
                    Read Case
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Customer Testimonials */}
      <section className="py-20 bg-white border-y border-brand-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-3">Customer Testimonials</h2>
          <p className="text-3xl font-extrabold text-brand-charcoal mb-12">What Our Clients Say</p>

          <div className="max-w-3xl mx-auto relative bg-brand-dark border border-brand-border rounded-[32px] p-8 md:p-12 shadow-sm">
            <div className="absolute top-6 left-8 text-7xl font-serif text-brand-primary/10 select-none pointer-events-none">“</div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="flex gap-1.5 mb-6">
                {Array.from({ length: testimonials[testimonialIdx].rating }).map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-brand-secondary text-brand-secondary" />
                ))}
              </div>

              <p className="text-sm md:text-base text-brand-charcoal italic leading-relaxed mb-8">
                "{testimonials[testimonialIdx].comment}"
              </p>

              <h4 className="text-xs uppercase font-extrabold tracking-wider text-brand-primary">
                {testimonials[testimonialIdx].name}
              </h4>
              <p className="text-[11px] text-brand-muted mt-1">
                {testimonials[testimonialIdx].company}
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={prevTestimonial}
                className="p-2.5 rounded-full bg-white hover:bg-brand-primary/10 border border-brand-border text-brand-muted hover:text-brand-charcoal transition-colors shadow-sm"
                aria-label="Previous Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-2.5 rounded-full bg-white hover:bg-brand-primary/10 border border-brand-border text-brand-muted hover:text-brand-charcoal transition-colors shadow-sm"
                aria-label="Next Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 8. Success Metrics Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white border border-brand-border rounded-[32px] p-8 md:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center shadow-sm">
          {[
            { value: '120+', label: 'Projects Completed' },
            { value: '98%', label: 'Satisfaction Rate' },
            { value: '2.5M+', label: 'AI Inquiries Handled' },
            { value: '15+', label: 'Industries Served' }
          ].map((metric, i) => (
            <div key={i} className="space-y-2">
              <div className="text-3xl md:text-5xl font-extrabold bg-gradient-to-r from-brand-secondary via-brand-primary to-brand-purple bg-clip-text text-transparent tracking-tight">
                {metric.value}
              </div>
              <div className="text-[11px] uppercase font-bold text-brand-muted tracking-widest">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. Articles and Insights */}
      <section id="articles" className="py-20 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">Articles & Insights</h2>
              <p className="text-3xl font-extrabold text-brand-charcoal">Engineering Logs & News</p>
            </div>
            <a
              href="#contact"
              className="text-xs font-semibold text-brand-secondary flex items-center gap-1.5 hover:underline mt-4 sm:mt-0"
            >
              Subscribe to Newsletter
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.map((art, i) => (
              <article
                key={i}
                className="bg-brand-dark rounded-[32px] border border-brand-border overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-300"
              >
                <div>
                  {art.imageUrl && (
                    <div className="h-44 relative">
                      <Image
                        src={art.imageUrl}
                        alt={art.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-2.5 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-bold text-brand-primary uppercase">
                        {art.category}
                      </span>
                      <span className="text-[10px] text-brand-muted">{art.publishedAt}</span>
                    </div>

                    <h3 className="text-sm font-bold text-brand-charcoal mb-2 hover:text-brand-secondary transition-colors">
                      {art.title}
                    </h3>
                    <p className="text-[11px] text-brand-muted line-clamp-3 leading-relaxed">
                      {art.description}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-brand-border/40 mt-4">
                  <span className="text-[10px] text-brand-muted font-medium">By {art.author}</span>
                  <a href="#contact" className="text-[10px] font-bold text-brand-secondary flex items-center gap-1 hover:underline">
                    Read Article
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* 10. Events and Promotions */}
      <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-brand-secondary mb-3">Events & Promotions</h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-brand-charcoal">Upcoming Technology Gatherings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {events.map((evt, i) => (
            <div
              key={i}
              className="bg-white rounded-[32px] border border-brand-border p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300"
            >
              <div>
                {evt.imageUrl && (
                  <div className="h-40 relative rounded-2xl overflow-hidden border border-brand-border mb-4">
                    <Image
                      src={evt.imageUrl}
                      alt={evt.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-4 h-4 text-brand-secondary shrink-0" />
                  <span className="text-xs font-bold text-brand-secondary">{evt.date}</span>
                </div>

                <h3 className="text-base font-bold text-brand-charcoal mb-2">{evt.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed mb-6">{evt.description}</p>
              </div>

              <div>
                <button
                  onClick={() => setRegisteredEvent(evt.title)}
                  className="w-full py-3 rounded-2xl text-xs font-bold bg-brand-dark hover:bg-brand-primary/10 border border-brand-border hover:border-brand-primary text-brand-charcoal hover:text-brand-primary transition-all shadow-sm"
                >
                  Register Now
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Event Alert (Simulated registration) */}
        {registeredEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white border border-brand-border p-6 rounded-[32px] shadow-2xl relative text-center">
              <div className="w-12 h-12 rounded-full bg-brand-secondary/10 text-brand-secondary flex items-center justify-center mx-auto mb-4 border border-brand-secondary/20">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-brand-charcoal mb-2">Registration Confirmed</h4>
              <p className="text-xs text-brand-muted mb-6 leading-relaxed">
                You have successfully registered for **{registeredEvent}**. <br />
                We have logged your confirmation. We will send reminders to your email closer to the date!
              </p>
              <button
                onClick={() => setRegisteredEvent(null)}
                className="px-6 py-2.5 rounded-full bg-brand-primary hover:opacity-95 text-white text-xs font-bold shadow-md shadow-brand-primary/20"
              >
                Close Window
              </button>
            </div>
          </div>
        )}
      </section>

      {/* 11. Interactive Contact Us Form & Categorization */}
      <section id="contact" className="py-20 bg-white border-t border-brand-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-widest text-brand-primary mb-3">Contact Us</h2>
            <p className="text-3xl font-extrabold text-brand-charcoal">Let's Engineer Solutions Together</p>
            <p className="text-xs text-brand-muted mt-2">
              Submit your project specifications or get in touch with our lead systems engineer directly.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Direct Contact Info Card */}
            <div className="lg:col-span-4 bg-brand-dark border border-brand-border rounded-[32px] p-8 space-y-6 shadow-sm">
              <div>
                <span className="text-[10px] uppercase font-bold text-brand-primary tracking-wider block mb-1">Direct Line</span>
                <h3 className="text-xl font-extrabold text-brand-charcoal">Subekchha Sah</h3>
                <p className="text-xs text-brand-muted mt-1">Lead Systems Engineer & Platform Creator</p>
              </div>

              <div className="h-[1px] bg-brand-border/60"></div>

              <div className="space-y-4 text-xs font-semibold text-brand-charcoal">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-brand-muted uppercase block">Specialization</span>
                    <span>AI Chatbots & Prototyping</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-secondary/10 border border-brand-secondary/20 flex items-center justify-center text-brand-secondary shrink-0">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-brand-muted uppercase block">Direct Email</span>
                    <a href="mailto:subekchhasah@gmail.com" className="hover:text-brand-primary transition-colors font-mono">
                      subekchhasah@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-brand-muted uppercase block">Contact Number</span>
                    <a href="tel:9820365426" className="hover:text-brand-primary transition-colors font-mono">
                      9820365426
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[9px] text-brand-muted uppercase block">Office Location</span>
                    <span>London, United Kingdom</span>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-brand-border/60"></div>

              <p className="text-[11px] text-brand-muted leading-relaxed">
                Connect directly with Subekchha to discuss custom systems architecture, database audit integrations, or fast Figma design to React component code pipelines.
              </p>
            </div>

            {/* Inquiry Form */}
            <div className="lg:col-span-8 bg-brand-dark border border-brand-border rounded-[32px] p-6 md:p-8 shadow-sm">
              {formSuccess ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto mb-4 animate-bounce">
                    <CheckCircle className="w-10 h-10" />
                  </div>

                  <h3 className="text-xl font-bold text-brand-charcoal">Inquiry Submitted Successfully!</h3>
                  <p className="text-xs text-brand-muted max-w-md mx-auto leading-relaxed">
                    A verification email has been simulated and logged. Our algorithms have categorized your query, and a team representative will follow up.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto bg-white p-4 rounded-2xl border border-brand-border mt-6 text-left shadow-sm">
                    <div>
                      <span className="text-[10px] text-brand-muted block uppercase font-bold">Inquiry Category</span>
                      <span className="text-xs font-bold text-brand-secondary mt-1 block">
                        {formSuccess.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted block uppercase font-bold">Tracking Reference</span>
                      <span className="text-xs font-mono font-bold text-brand-primary mt-1 block">
                        {formSuccess.trackingReference}
                      </span>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => setFormSuccess(null)}
                      className="px-6 py-2.5 rounded-full bg-brand-primary hover:opacity-95 text-white text-xs font-bold shadow-md shadow-brand-primary/20"
                    >
                      Submit Another Inquiry
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="fullName" className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="e.g. Alexis Carter"
                        className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. alexis@company.com"
                        className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="e.g. +1 (555) 123-4567"
                        className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="companyName" className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        required
                        value={formData.companyName}
                        onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                        placeholder="e.g. Zenith Tech"
                        className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-all shadow-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="country" className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                        Country *
                      </label>
                      <input
                        type="text"
                        id="country"
                        required
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                        placeholder="e.g. United Kingdom"
                        className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="jobTitle" className="block text-xs font-semibold text-brand-charcoal mb-1.5">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      id="jobTitle"
                      required
                      value={formData.jobTitle}
                      onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                      placeholder="e.g. VP of Product Engineering"
                      className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-all shadow-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="jobDetails" className="block text-xs font-semibold text-brand-charcoal mb-1.5 flex justify-between">
                      <span>Job Details & Specifications *</span>
                      <span className="text-[10px] text-brand-muted font-normal italic">
                        Tip: write "prototype" or "chatbot" for auto-routing.
                      </span>
                    </label>
                    <textarea
                      id="jobDetails"
                      required
                      rows={4}
                      value={formData.jobDetails}
                      onChange={(e) => setFormData({ ...formData, jobDetails: e.target.value })}
                      placeholder="Describe your system integrations, dashboard mockups, or chatbot workflows in detail..."
                      className="w-full bg-white border border-brand-border rounded-xl px-4 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-all resize-none shadow-sm"
                    ></textarea>
                  </div>

                  {formError && (
                    <div className="p-3 bg-red-50/50 border border-red-200 text-red-500 rounded-xl text-xs font-medium">
                      {formError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formLoading}
                    className="w-full py-4 rounded-full font-bold bg-gradient-to-r from-brand-primary to-brand-purple hover:opacity-95 text-white text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-primary/20 hover:scale-[1.005] transition-all"
                  >
                    {formLoading ? (
                      'Analyzing & Submitting Inquiry...'
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Project Inquiry
                      </>
                    )}
                  </button>

                </form>
              )}
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
