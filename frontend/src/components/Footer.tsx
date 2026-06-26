import Link from 'next/link';
import { Cpu, Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  const quickLinks = [
    { name: 'Home', href: '/#hero' },
    { name: 'Solutions', href: '/#solutions' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Articles', href: '/#articles' },
    { name: 'Events', href: '/#events' },
  ];

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: 'https://twitter.com', name: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: 'https://www.linkedin.com/in/subekchha-sah/', name: 'LinkedIn' },
    { icon: <Github className="w-5 h-5" />, href: 'https://github.com/subekchhasah', name: 'GitHub' },
  ];

  return (
    <footer className="bg-[#07080e] border-t border-brand-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center">
                <Cpu className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">AI-Solutions</span>
            </div>
            <p className="text-sm text-brand-muted mb-6 max-w-sm">
              Pioneering next-generation Computer Systems Engineering. Redefining enterprise operations through AI virtual assistants, custom UI prototyping, and workflow business automation.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-brand-card border border-brand-border text-brand-muted hover:text-white hover:border-brand-primary transition-colors"
                  aria-label={s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-brand-muted hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-brand-muted">
                <MapPin className="w-5 h-5 text-brand-secondary shrink-0" />
                <span>London, United Kingdom</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-brand-muted">
                <Mail className="w-5 h-5 text-brand-secondary shrink-0" />
                <a href="mailto:subekchhasah@gmail.com" className="hover:text-white transition-colors">
                  subekchhasah@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-brand-muted">
                <Phone className="w-5 h-5 text-brand-secondary shrink-0" />
                <a href="tel:9820365426" className="hover:text-white transition-colors">
                  9820365426
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-brand-border/40 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-brand-muted">
            &copy; {new Date().getFullYear()} AI-Solutions (Computer Systems Engineering) Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-brand-muted hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-brand-muted hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
