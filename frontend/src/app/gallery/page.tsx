'use client';

import { useState } from 'react';
import Image from 'next/image';
import { 
  Sparkles, Eye, Code, Award, ExternalLink, ArrowRight, 
  Database, Cpu, Layers, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

interface ProjectItem {
  title: string;
  desc: string;
  longDesc: string;
  category: string;
  tech: string[];
  metric: string;
  role: string;
  img: string;
}

const PROJECTS: ProjectItem[] = [
  {
    title: 'SmartLogistics AI Routing',
    desc: 'Coordinated real-time logistics routing schedules and predictive warehouse logs.',
    longDesc: 'Designed a high-throughput AI agent coordinating schedules across multiple vehicle hubs. By pulling traffic conditions, delivery limits, and real-time database logs, it generated optimal paths, significantly reducing fuel and idle time.',
    category: 'AI Virtual Assistants',
    tech: ['FastAPI', 'PGVector', 'PostgreSQL', 'Python'],
    metric: '20% Fuel Saved',
    role: 'Autonomous Routing Integration',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'FinSecure Prototyping',
    desc: 'Turned Figma designs into interactive Next.js dashboard modules with live API hooks.',
    longDesc: 'Accelerated interface engineering for a fintech enterprise by converting 40 high-fidelity dashboard mockups into clean, typed React screens. Integrated standard Tailwind layouts, responsive graphs, and JWT secure login simulators.',
    category: 'Figma-to-Code Prototyping',
    tech: ['Next.js 14', 'TailwindCSS', 'TypeScript', 'Recharts'],
    metric: '4-Day Design To Code',
    role: 'Front-End UI Architecture',
    img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'RetailFlow Automation',
    desc: 'Created automatic inventory syncing bridges monitoring transaction databases.',
    longDesc: 'Developed a low-latency database sync service that captures retail transactional changes and synchronizes stock levels across multiple locations. Includes automated invoicing and automated report generation.',
    category: 'Workflow Automation',
    tech: ['Node.js', 'Sequelize', 'SQLite', 'BullMQ'],
    metric: '10k syncs/min',
    role: 'Data Sync Orchestration',
    img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'DEX Workspace Hub',
    desc: 'Built internal portal featuring unified directory indices and document search.',
    longDesc: 'Uplifted Digital Employee Experience (DEX) with a unified search portal. Indexes document tables, directory listings, and onboarding documents, serving immediate results to team members on standard web viewports.',
    category: 'Digital Workplace',
    tech: ['React', 'Express', 'Redis', 'Elasticsearch'],
    metric: '50% Faster Access',
    role: 'DEX Systems Engineering',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'AutoSupport Chatbot',
    desc: 'Deployed smart customer support bot trained on system APIs and documentation.',
    longDesc: 'Engineered an intelligent conversational widget trained on internal knowledgebases. Resolves common support inquiries instantly, automatically escalating complex requests to the systems engineering ticketing system.',
    category: 'AI Virtual Assistants',
    tech: ['Gemini API', 'Express.js', 'PostgreSQL', 'JWT'],
    metric: '85% Auto-Resolved',
    role: 'Conversational LLM Design',
    img: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'LedgerFlow RPA automations',
    desc: 'Automated ledger entries, parsing transaction ledgers autonomously.',
    longDesc: 'Optimized financial operational overhead with robotic process automation. Programmatically verifies receipts, reconciles balances, highlights ledger discrepancies, and triggers Slack alerting workflows.',
    category: 'Workflow Automation',
    tech: ['Python', 'AWS S3', 'Slack API', 'SQLite'],
    metric: '98% Fewer Errors',
    role: 'RPA Automation Architecture',
    img: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'HR Onboarding Portal',
    desc: 'Streamlined employee credentials and system setup dashboard workflows.',
    longDesc: 'Designed a unified internal workspace portal for automated onboarding. Newly hired employees can log in, complete background profiles, submit legal forms, and receive automatically provisioned email boxes and systems permissions.',
    category: 'Digital Workplace',
    tech: ['Next.js', 'Tailwind', 'MongoDB', 'Node.js'],
    metric: '75% Less Admin Work',
    role: 'Full-Stack Developer',
    img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'EduLearn Wireframe Prototype',
    desc: 'Created responsive frontend layout modules matching school dashboard specs.',
    longDesc: 'Turned Figma designs of a custom university classroom interface into highly interactive modular code blocks. Designed pixel-perfect navigation panels, responsive course tracking charts, and customized calendar widgets.',
    category: 'Figma-to-Code Prototyping',
    tech: ['React', 'TypeScript', 'CSS Modules'],
    metric: '100% Component Match',
    role: 'UI Developer',
    img: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'SalesCRM Data Bridge',
    desc: 'Linked offline transaction ledgers directly with cloud CRM pipelines.',
    longDesc: 'Developed a high-availability server-side synchronization bridge that watches internal order ledgers and streams transaction updates directly into cloud CRM systems. Includes automated recovery and retry routines for offline drops.',
    category: 'Workflow Automation',
    tech: ['Python', 'Docker', 'MySQL', 'Celery'],
    metric: 'Instant Sync (<2s)',
    role: 'Data Engineer',
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'SmartHealth AI Diagnostics',
    desc: 'Integrated custom LLM agents to cross-reference clinic logs with medical libraries.',
    longDesc: 'Developed a prototype diagnostic aid virtual assistant that allows practitioners to search medical books and clinic logs with natural language. Extracts symptom charts and flags potential matches for professional validation.',
    category: 'AI Virtual Assistants',
    tech: ['Python', 'FastAPI', 'PyTorch', 'MongoDB'],
    metric: '94% Diagnostic Match',
    role: 'Machine Learning Lead',
    img: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'ProcureSecure Automation',
    desc: 'Engineered automatic inventory replenishment brokers watching threshold records.',
    longDesc: 'Built an RPA automation wrapper that scans product database stock levels, highlights items falling below safe operational guidelines, drafts automated purchase requests, and routes them to managers for approval.',
    category: 'Workflow Automation',
    tech: ['Node.js', 'Express', 'Sequelize', 'PostgreSQL'],
    metric: '3x Order Processing',
    role: 'Backend Architect',
    img: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'DEX Analytics Dashboard',
    desc: 'Created sleek charts detailing company-wide server status and system response speeds.',
    longDesc: 'Built a high-fidelity front-end system performance dashboard for system administrators. Maps request load timings, active websocket connections, database connection pools, and query timing metrics in real-time graphs.',
    category: 'Digital Workplace',
    tech: ['Next.js 14', 'Recharts', 'Tailwind', 'TypeScript'],
    metric: '100% Real-Time Data',
    role: 'Front-End Lead',
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'SecureDoc Search Engine',
    desc: 'Deployed enterprise document search index leveraging semantic vector matching.',
    longDesc: 'Uplifted information retrieval speeds for secure internal archives by designing a custom search pipeline. Employs token indexing and search caching layers to serve document references within milliseconds.',
    category: 'Digital Workplace',
    tech: ['Express', 'Elasticsearch', 'Redis', 'Node.js'],
    metric: '<50ms Query Speed',
    role: 'Search Engineer',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    title: 'WealthBuilder Prototyping',
    desc: 'Converted custom financial planner Figma templates into styled Next.js pages.',
    longDesc: 'Engineered high-fidelity responsive frontend structures for a global wealth planning agency. Translated complex client assets layouts, retirement timeline graphs, and multi-tier profile input forms into neat Tailwind blocks.',
    category: 'Figma-to-Code Prototyping',
    tech: ['Next.js', 'TailwindCSS', 'Recharts'],
    metric: '5-Day UI Production',
    role: 'Interface Specialist',
    img: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop'
  }
];

const CATEGORIES = ['All', 'AI Virtual Assistants', 'Figma-to-Code Prototyping', 'Workflow Automation', 'Digital Workplace'];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const filteredProjects = activeCategory === 'All' 
    ? PROJECTS 
    : PROJECTS.filter(p => p.category === activeCategory);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Back button */}
      <div className="mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary">Project Showcase</span>
        <h1 className="text-4xl font-extrabold text-brand-charcoal mt-2 tracking-tight">
          Image Gallery & Success Stories
        </h1>
        <p className="text-xs text-brand-muted mt-3 max-w-xl mx-auto leading-relaxed">
          Explore our completed systems, Figma prototypes, and workplace automations. See the actual metrics and engineering stack behind each success story.
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedProject(null);
            }}
            className={`px-4 py-2 rounded-full text-[11px] font-bold border transition-all ${
              activeCategory === cat
                ? 'bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20'
                : 'bg-brand-card border-brand-border text-brand-charcoal hover:border-brand-primary hover:text-brand-primary'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProjects.map((proj, idx) => (
          <div 
            key={idx}
            className="bg-brand-card rounded-[32px] border border-brand-border overflow-hidden hover:shadow-xl hover:border-brand-secondary/40 transition-all duration-300 flex flex-col group"
          >
            {/* Image banner */}
            <div className="h-52 relative overflow-hidden bg-slate-900 shrink-0">
              <Image 
                src={proj.img} 
                alt={proj.title} 
                fill
                priority={idx < 3}
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-brand-card/95 backdrop-blur-sm border border-brand-border text-[9px] font-bold text-brand-secondary">
                {proj.category}
              </span>
              <span className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-brand-charcoal/90 text-white text-[9px] font-bold">
                {proj.metric}
              </span>
            </div>

            {/* Content info */}
            <div className="p-6 flex-grow flex flex-col justify-between">
              <div>
                <span className="text-[9px] uppercase font-bold text-brand-primary tracking-wider block mb-1">Success Story</span>
                <h3 className="text-base font-extrabold text-brand-charcoal group-hover:text-brand-primary transition-colors line-clamp-1">{proj.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed mt-2.5 line-clamp-3">{proj.desc}</p>
                
                {/* Tech badges */}
                <div className="flex flex-wrap gap-1.5 mt-5">
                  {proj.tech.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-brand-dark border border-brand-border/60 text-[9px] text-brand-muted font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-brand-border/50 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProject(proj)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-secondary hover:text-brand-primary transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Read Story
                </button>
                <a 
                  href="#contact" 
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-charcoal hover:translate-x-0.5 transition-transform"
                >
                  Get Demo
                  <ArrowRight className="w-3.5 h-3.5 text-brand-primary" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Dialog/Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-charcoal/45 backdrop-blur-sm animate-fade-in">
          <div className="bg-brand-card rounded-[32px] border border-brand-border shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal header image */}
            <div className="h-64 relative bg-slate-900 shrink-0">
              <Image 
                src={selectedProject.img} 
                alt={selectedProject.title} 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal to-transparent opacity-60"></div>
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-brand-charcoal/80 text-white hover:bg-brand-primary transition-colors"
                aria-label="Close details"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="absolute bottom-6 left-6 text-white">
                <span className="px-2.5 py-0.5 rounded-full bg-brand-primary text-[9px] font-bold uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h2 className="text-xl font-bold mt-2">{selectedProject.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 md:p-8 overflow-y-auto space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-brand-dark p-4 rounded-2xl border border-brand-border shrink-0">
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">Achieved Outcome</span>
                  <span className="text-xs font-extrabold text-brand-secondary block mt-0.5">{selectedProject.metric}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">System Role</span>
                  <span className="text-xs font-extrabold text-brand-charcoal block mt-0.5">{selectedProject.role}</span>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-brand-muted block">Integration Layer</span>
                  <div className="flex gap-1 mt-0.5">
                    {selectedProject.tech.slice(0, 2).map((t) => (
                      <span key={t} className="px-1.5 py-0.5 rounded bg-brand-dark border border-brand-border text-[9px] font-mono text-brand-muted block">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-brand-primary tracking-widest mb-2">Technical Implementation</h4>
                <p className="text-xs text-brand-muted leading-relaxed font-sans">{selectedProject.longDesc}</p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase text-brand-secondary tracking-widest mb-2">Technologies Utilized</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tech.map((t) => (
                    <span key={t} className="px-3 py-1 rounded bg-brand-dark border border-brand-border text-[10px] text-brand-charcoal font-mono">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-brand-border/40 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl border border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-primary transition-all text-xs font-bold"
                >
                  Close Story
                </button>
                <Link
                  href="/#contact"
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-purple text-white hover:shadow-lg hover:shadow-brand-primary/20 hover:scale-[1.01] transition-all text-xs font-bold flex items-center gap-1.5"
                >
                  Request Integration
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Bottom CTA Card */}
      <div className="mt-16 bg-gradient-to-r from-brand-primary/10 via-brand-purple/10 to-brand-secondary/10 border border-brand-border p-8 md:p-12 rounded-[32px] text-center max-w-4xl mx-auto">
        <Sparkles className="w-8 h-8 text-brand-primary mx-auto mb-4 animate-pulse" />
        <h2 className="text-2xl font-bold text-brand-charcoal tracking-tight">Need a customized integration layer?</h2>
        <p className="text-xs text-brand-muted mt-2 max-w-lg mx-auto leading-relaxed">
          AI-Solutions collaborates directly with enterprise computer systems engineering divisions to build and deploy virtual support agents, database sync triggers, and responsive Figma prototypes.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            href="/#contact"
            className="px-6 py-3 rounded-xl bg-brand-primary hover:bg-brand-primary/90 text-white text-xs font-bold hover:shadow-lg transition-all"
          >
            Submit System Inquiry
          </Link>
        </div>
      </div>

    </div>
  );
}
