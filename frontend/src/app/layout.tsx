import type { Metadata } from 'next';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';

export const metadata: Metadata = {
  title: 'AI-Solutions | Premium Enterprise Systems Engineering',
  description: 'AI-Solutions provides AI Virtual Assistants, AI-Powered UI Prototyping, Business Automation, and Digital Workplace integrations. Streamlining the Digital Employee Experience (DEX).',
  keywords: ['AI Chatbots', 'Figma to Code', 'Business Automation', 'Enterprise Engineering', 'Digital Employee Experience'],
  openGraph: {
    title: 'AI-Solutions | Premium Enterprise Systems Engineering',
    description: 'Transforming corporate workflow productivity through AI chatbots, automated systems, and high-fidelity wireframe tools.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-brand-dark text-foreground">
        {/* Ambient Decorative Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-primary opacity-[0.05] rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-brand-secondary opacity-[0.05] rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-10 left-10 w-[600px] h-[600px] bg-brand-purple opacity-[0.03] rounded-full blur-[150px] pointer-events-none animate-pulse-slow"></div>

        <Navbar />
        
        <main className="flex-grow pt-24">
          {children}
        </main>
        
        <Footer />
        <ChatbotWidget />
      </body>
    </html>
  );
}
