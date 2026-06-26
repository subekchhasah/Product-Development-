'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Cpu, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Handle scroll shadow/opacity
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    // Check auth status
    const token = localStorage.getItem('token');
    setIsAdminLoggedIn(!!token);

    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    setIsAdminLoggedIn(false);
    window.location.href = '/';
  };

  const navLinks = [
    { name: 'Home', href: '/#hero' },
    { name: 'Solutions', href: '/#solutions' },
    { name: 'Projects', href: '/#projects' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Articles', href: '/#articles' },
    { name: 'Events', href: '/#events' },
    { name: 'Contact Us', href: '/#contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-brand-dark/80 backdrop-blur-md border-b border-brand-border py-4 shadow-lg shadow-black/20'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-secondary flex items-center justify-center shadow-lg shadow-brand-primary/20 group-hover:rotate-6 transition-transform">
              <Cpu className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-charcoal via-brand-purple to-brand-secondary bg-clip-text text-transparent tracking-tight">
              AI-Solutions
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-brand-muted hover:text-brand-primary transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-brand-secondary hover:after:w-full after:transition-all"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Admin Buttons (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {isAdminLoggedIn ? (
              <>
                <Link
                  href="/admin/dashboard"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-card border border-brand-border text-brand-charcoal hover:border-brand-primary transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-primary" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/40 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-brand-card border border-brand-border text-brand-muted hover:text-brand-primary hover:border-brand-border/80 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Link>
                <Link
                  href="/admin/signup"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-brand-primary to-brand-purple text-white hover:shadow-lg hover:shadow-brand-primary/20 transition-all duration-300"
                >
                  <UserPlus className="w-4 h-4" />
                  Admin Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-brand-card border border-brand-border text-brand-muted hover:text-brand-primary"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-brand-dark/95 border-b border-brand-border p-6 shadow-2xl backdrop-blur-lg">
          <nav className="flex flex-col gap-4 mb-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-brand-muted hover:text-brand-primary transition-colors py-2 border-b border-white/5"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            {isAdminLoggedIn ? (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-brand-card border border-brand-border text-brand-charcoal"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Admin Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-red-950/40 border border-red-900/50 text-red-400"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/admin/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-brand-card border border-brand-border text-brand-muted hover:text-brand-primary"
                >
                  <LogIn className="w-4 h-4" />
                  Admin Login
                </Link>
                <Link
                  href="/admin/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-brand-primary to-brand-purple text-white"
                >
                  <UserPlus className="w-4 h-4" />
                  Admin Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
