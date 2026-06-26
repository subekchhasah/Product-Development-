'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { 
  Users, CheckCircle2, MessageSquareCode, TrendingUp, Search, Filter, 
  Eye, RefreshCw, LogOut, ArrowLeft, Calendar, FileText, CheckCircle,
  Trash2, Edit3, Save, X, Bell, Key, Settings, EyeOff, Cpu, Bot
} from 'lucide-react';

// Rich Mock Inquiries for Local Offline Fallback
const BACKUP_INQUIRIES = [
  { id: '1', fullName: 'Alice Vance', email: 'alice@vance-corp.com', phone: '+1 (555) 012-3456', companyName: 'Vance Corp', country: 'United States', jobTitle: 'CTO', jobDetails: 'Need an AI Virtual Assistant chatbot that compiles logs from our Postgres clusters and generates standard reports for developers.', category: 'AI Virtual Assistant Request', trackingReference: 'AI-20260610-1012', status: 'New', createdAt: '2026-06-10T08:15:30.000Z' },
  { id: '2', fullName: 'Sanjay Patel', email: 'sanjay@finsecure.io', phone: '+91 98765 43210', companyName: 'FinSecure Tech', country: 'India', jobTitle: 'Engineering Manager', jobDetails: 'Seeking rapid AI-powered prototyping to convert 12 Figma dashboards into solid Next.js landing screens with API hooks.', category: 'Prototyping Request', trackingReference: 'AI-20260608-2041', status: 'In Progress', createdAt: '2026-06-08T11:24:15.000Z' },
  { id: '3', fullName: 'Claire Dubois', email: 'c.dubois@luxe-logistics.fr', phone: '+33 1 42 68 53 00', companyName: 'Luxe Logistics', country: 'France', jobTitle: 'Director of HR Operations', jobDetails: 'Looking to optimize our digital workplace solutions. We need automated portal search and internal chatbot routing.', category: 'Software Assistance', trackingReference: 'AI-20260605-4491', status: 'Processed', createdAt: '2026-06-05T14:40:00.000Z' },
  { id: '4', fullName: 'Kenji Tanaka', email: 'tanaka@robot-automations.jp', phone: '+81 3 5555 1234', companyName: 'Tanaka Automations', country: 'Japan', jobTitle: 'Lead Software Architect', jobDetails: 'General inquiry regarding custom licensing and server integrations of your business automation script packages.', category: 'General Inquiry', trackingReference: 'AI-20260602-0012', status: 'Closed', createdAt: '2026-06-02T09:05:00.000Z' }
];

const BACKUP_SUMMARY = { total: 4, new: 1, monthly: 4, completionRate: 75 };
const BACKUP_TRENDS = [
  { month: 'Jan 26', count: 1 },
  { month: 'Feb 26', count: 2 },
  { month: 'Mar 26', count: 3 },
  { month: 'Apr 26', count: 5 },
  { month: 'May 26', count: 8 },
  { month: 'Jun 26', count: 4 }
];
const BACKUP_DEMAND = [
  { name: 'AI Virtual Assistant Request', value: 1 },
  { name: 'Prototyping Request', value: 1 },
  { name: 'Software Assistance', value: 1 },
  { name: 'General Inquiry', value: 1 }
];

const COLORS = ['#6366f1', '#06b6d4', '#a855f7', '#94a3b8'];

const getApiUrl = (path: string) => {
  const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
  return `http://${host}:5001${path}`;
};

export default function AdminDashboard() {
  const [authorized, setAuthorized] = useState(false);
  const [adminName, setAdminName] = useState('Admin');
  
  // Dashboard Analytics States
  const [summary, setSummary] = useState(BACKUP_SUMMARY);
  const [trends, setTrends] = useState(BACKUP_TRENDS);
  const [demand, setDemand] = useState(BACKUP_DEMAND);
  
  // Inquiries listing states
  const [inquiries, setInquiries] = useState(BACKUP_INQUIRIES);
  const [filteredInquiries, setFilteredInquiries] = useState(BACKUP_INQUIRIES);
  
  // Filter settings
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  
  // Inspector states
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editCountry, setEditCountry] = useState('');
  const [editJobTitle, setEditJobTitle] = useState('');
  const [editJobDetails, setEditJobDetails] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editUpdating, setEditUpdating] = useState(false);

  // Notification states
  const [readInquiryIds, setReadInquiryIds] = useState<string[]>([]);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const seenInquiryIdsRef = useRef<Set<string>>(new Set());

  // AI API settings states
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [openaiApiKey, setOpenaiApiKey] = useState('');
  const [showGeminiKey, setShowGeminiKey] = useState(false);
  const [showOpenaiKey, setShowOpenaiKey] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (selectedInquiry) {
      setEditName(selectedInquiry.fullName);
      setEditEmail(selectedInquiry.email);
      setEditPhone(selectedInquiry.phone);
      setEditCompany(selectedInquiry.companyName);
      setEditCountry(selectedInquiry.country);
      setEditJobTitle(selectedInquiry.jobTitle);
      setEditJobDetails(selectedInquiry.jobDetails);
      setEditCategory(selectedInquiry.category);
      setIsEditing(false);
    }
  }, [selectedInquiry]);

  // Load read notifications from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('readInquiryIds');
    if (stored) {
      try {
        setReadInquiryIds(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse readInquiryIds', e);
      }
    }
  }, []);

  // Validate authentication and load initial stats
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/admin/login');
      return;
    }

    setAuthorized(true);
    const adminUser = localStorage.getItem('adminUser');
    if (adminUser) {
      setAdminName(JSON.parse(adminUser).username);
    }

    loadDashboardData(true);
  }, []);

  // Periodic polling for real-time notifications
  useEffect(() => {
    if (!authorized) return;

    const interval = setInterval(() => {
      loadDashboardData(false);
    }, 15000); // Poll every 15 seconds

    return () => clearInterval(interval);
  }, [authorized]);

  const markAsRead = (id: string) => {
    if (!readInquiryIds.includes(id)) {
      const updated = [...readInquiryIds, id];
      setReadInquiryIds(updated);
      localStorage.setItem('readInquiryIds', JSON.stringify(updated));
    }
  };

  const markAllAsRead = () => {
    const unread = inquiries.filter(i => i.status === 'New' && !readInquiryIds.includes(i.id));
    const unreadIds = unread.map(i => i.id);
    const updated = [...readInquiryIds, ...unreadIds];
    setReadInquiryIds(updated);
    localStorage.setItem('readInquiryIds', JSON.stringify(updated));
  };

  // Unread notifications compute
  const unreadNotifications = inquiries.filter(
    i => i.status === 'New' && !readInquiryIds.includes(i.id)
  );

  // Filter inquiry records on input change
  useEffect(() => {
    let result = inquiries;

    // Search query matches
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      result = result.filter(i => 
        i.fullName.toLowerCase().includes(q) ||
        i.email.toLowerCase().includes(q) ||
        i.companyName.toLowerCase().includes(q) ||
        i.trackingReference.toLowerCase().includes(q) ||
        i.jobTitle.toLowerCase().includes(q)
      );
    }

    // Category matches
    if (categoryFilter !== 'All') {
      result = result.filter(i => i.category === categoryFilter);
    }

    // Status matches
    if (statusFilter !== 'All') {
      result = result.filter(i => i.status === statusFilter);
    }

    setFilteredInquiries(result);
  }, [searchTerm, categoryFilter, statusFilter, inquiries]);

  // Load backend statistics & listings
  const loadDashboardData = async (isInitial = false) => {
    setIsRefreshing(true);
    const token = localStorage.getItem('token');

    try {
      // 1. Fetch Analytics
      const aRes = await fetch(getApiUrl('/api/analytics'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (aRes.ok) {
        const aData = await aRes.json();
        setSummary(aData.summary);
        setTrends(aData.trends);
        setDemand(aData.demand);
      }

      // 2. Fetch Inquiries List
      const iRes = await fetch(getApiUrl('/api/inquiries'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (iRes.ok) {
        const iData = await iRes.json();
        const freshInquiries = iData.inquiries;

        if (isInitial) {
          const initialIds = new Set<string>(freshInquiries.map((i: any) => i.id));
          seenInquiryIdsRef.current = initialIds;
        } else {
          freshInquiries.forEach((inq: any) => {
            if (inq.status === 'New' && !seenInquiryIdsRef.current.has(inq.id)) {
              // Trigger a toast alert
              const toastId = `toast-${inq.id}-${Date.now()}`;
              setToasts(prev => [...prev, { id: toastId, inquiry: inq }]);
              
              // Automatically fade toast out after 6 seconds
              setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== toastId));
              }, 6000);
            }
          });

          // Add all new IDs to seen ref
          freshInquiries.forEach((i: any) => seenInquiryIdsRef.current.add(i.id));
        }

        setInquiries(freshInquiries);
      }

      // 3. Fetch Settings
      const sRes = await fetch(getApiUrl('/api/settings'), {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (sRes.ok) {
        const sData = await sRes.json();
        if (sData.GEMINI_API_KEY) setGeminiApiKey(sData.GEMINI_API_KEY);
        if (sData.OPENAI_API_KEY) setOpenaiApiKey(sData.OPENAI_API_KEY);
      }
    } catch (err) {
      console.warn('Dashboard api server connection refused. Serving sandbox datasets.');
    } finally {
      setIsRefreshing(false);
    }
  };

  // Change Inquiry Status
  const handleUpdateStatus = async (inquiryId: string, newStatus: string) => {
    setStatusUpdating(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(getApiUrl(`/api/inquiries/${inquiryId}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');

      const data = await response.json();
      
      // Update local state lists
      setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i));
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
      
      // Reload stats cards
      loadDashboardData();
    } catch (err) {
      console.warn('Backend offline. Updating local simulated inquiry status...');
      setInquiries(prev => prev.map(i => i.id === inquiryId ? { ...i, status: newStatus } : i));
      if (selectedInquiry && selectedInquiry.id === inquiryId) {
        setSelectedInquiry({ ...selectedInquiry, status: newStatus });
      }
      
      // Simulate summary metric change
      setSummary(prev => {
        const updatedNew = newStatus === 'New' ? prev.new + 1 : (selectedInquiry?.status === 'New' ? Math.max(0, prev.new - 1) : prev.new);
        return {
          ...prev,
          new: updatedNew,
          completionRate: prev.total > 0 ? Math.round(((prev.total - updatedNew) / prev.total) * 100) : 100
        };
      });
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleEditInquiry = async () => {
    if (!selectedInquiry) return;
    setEditUpdating(true);
    const token = localStorage.getItem('token');
    
    const updatedData = {
      fullName: editName,
      email: editEmail,
      phone: editPhone,
      companyName: editCompany,
      country: editCountry,
      jobTitle: editJobTitle,
      jobDetails: editJobDetails,
      category: editCategory
    };

    try {
      const response = await fetch(getApiUrl(`/api/inquiries/${selectedInquiry.id}`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData)
      });

      if (!response.ok) throw new Error('Failed to update inquiry');

      const data = await response.json();
      
      // Update local state lists
      setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, ...updatedData } : i));
      setSelectedInquiry(prev => prev ? { ...prev, ...updatedData } : null);
      setIsEditing(false);
      loadDashboardData();
    } catch (err) {
      console.warn('Backend offline. Updating local simulated inquiry details...');
      setInquiries(prev => prev.map(i => i.id === selectedInquiry.id ? { ...i, ...updatedData } : i));
      setSelectedInquiry(prev => prev ? { ...prev, ...updatedData } : null);
      setIsEditing(false);
    } finally {
      setEditUpdating(false);
    }
  };

  const handleDeleteInquiry = async (inquiryId: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
    setStatusUpdating(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(getApiUrl(`/api/inquiries/${inquiryId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to delete inquiry');

      setInquiries(prev => prev.filter(i => i.id !== inquiryId));
      setSelectedInquiry(null);
      loadDashboardData();
    } catch (err) {
      console.warn('Backend offline. Deleting local simulated inquiry...');
      setInquiries(prev => prev.filter(i => i.id !== inquiryId));
      setSelectedInquiry(null);
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setSettingsMessage(null);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(getApiUrl('/api/settings'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          GEMINI_API_KEY: geminiApiKey,
          OPENAI_API_KEY: openaiApiKey
        })
      });

      if (!response.ok) throw new Error('Failed to update API settings');

      setSettingsMessage({ text: 'API settings saved successfully!', type: 'success' });
      setTimeout(() => setSettingsMessage(null), 4000);
    } catch (err: any) {
      setSettingsMessage({ text: err.message || 'Failed to update settings', type: 'error' });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUser');
    router.push('/admin/login');
  };

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-4 border-brand-primary border-t-transparent animate-spin"></div>
          <span className="text-xs text-brand-muted font-mono">Verifying credentials...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      
      {/* Title & Info Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 pb-6 border-b border-brand-border/60">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-brand-secondary">Console Panel</span>
          <h1 className="text-3xl font-extrabold text-brand-charcoal mt-1">Systems Operations Dashboard</h1>
          <p className="text-xs text-brand-muted mt-1">Logged in as: <span className="text-brand-charcoal font-semibold">{adminName}</span></p>
        </div>
        
        <div className="flex items-center gap-3 relative">
          
          {/* Notification Bell */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-card hover:bg-brand-primary/10 border border-brand-border text-brand-charcoal transition-all relative"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-brand-primary" />
              {unreadNotifications.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[9px] font-extrabold text-white animate-pulse shadow-sm">
                  {unreadNotifications.length}
                </span>
              )}
            </button>

            {/* Notification Dropdown Panel */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-brand-border rounded-2xl shadow-xl z-50 overflow-hidden animate-float-in">
                <div className="p-3 bg-gradient-to-r from-brand-primary/10 via-brand-purple/10 to-brand-secondary/10 border-b border-brand-border/60 flex justify-between items-center text-xs font-bold text-brand-charcoal">
                  <span>🔔 Notifications ({unreadNotifications.length})</span>
                  {unreadNotifications.length > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[10px] text-brand-primary hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                
                <div className="max-h-64 overflow-y-auto divide-y divide-brand-border/40">
                  {unreadNotifications.length > 0 ? (
                    unreadNotifications.map(inq => (
                      <div
                        key={inq.id}
                        onClick={() => {
                          setSelectedInquiry(inq);
                          markAsRead(inq.id);
                          setShowNotificationsDropdown(false);
                        }}
                        className="p-3 hover:bg-brand-primary/5 transition-colors cursor-pointer text-left space-y-1"
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[11px] font-extrabold text-brand-charcoal truncate max-w-[170px]">
                            {inq.fullName}
                          </span>
                          <span className="text-[9px] text-brand-primary font-mono font-bold">
                            {inq.trackingReference}
                          </span>
                        </div>
                        <p className="text-[10px] text-brand-muted truncate font-medium">
                          {inq.companyName} &bull; {inq.jobTitle}
                        </p>
                        <p className="text-[9px] text-brand-secondary font-bold">
                          {inq.category}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-xs text-brand-muted font-medium">
                      No unread inquiry notifications.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => loadDashboardData(false)}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-card hover:bg-brand-primary/10 border border-brand-border text-brand-charcoal transition-colors disabled:opacity-50 h-10"
          >
            <RefreshCw className={`w-4 h-4 text-brand-secondary ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Syncing...' : 'Sync Data'}
          </button>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-red-950/40 hover:bg-red-900/40 border border-red-900/50 text-red-400 transition-colors h-10"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Inquiry Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <FileText className="w-5 h-5 text-brand-primary" />, title: 'Total Inquiries', value: summary.total },
          { icon: <RefreshCw className="w-5 h-5 text-brand-secondary" />, title: 'New Inquiries', value: summary.new },
          { icon: <Calendar className="w-5 h-5 text-brand-purple" />, title: 'Monthly Submissions', value: summary.monthly },
          { icon: <CheckCircle className="w-5 h-5 text-emerald-400" />, title: 'Resolution Rate', value: `${summary.completionRate}%` }
        ].map((card, idx) => (
          <div key={idx} className="glass-panel border border-brand-border p-5 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center shrink-0 border border-brand-border">
              {card.icon}
            </div>
            <div>
              <span className="text-[10px] text-brand-muted uppercase tracking-wider block">{card.title}</span>
              <span className="text-xl font-extrabold text-brand-charcoal mt-0.5 block">{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Analytics and Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Trend Area Chart */}
        <div className="lg:col-span-8 glass-panel border border-brand-border p-6 rounded-2xl">
          <h3 className="text-sm font-bold text-brand-charcoal mb-6">Inquiry Volume Trends</h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#23263b" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#141624', borderColor: '#23263b', color: '#fff' }} />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#colorCount)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Demand Bar Chart */}
        <div className="lg:col-span-4 glass-panel border border-brand-border p-6 rounded-2xl flex flex-col justify-between">
          <h3 className="text-sm font-bold text-brand-charcoal mb-4">Service Demand Profile</h3>
          
          <div className="h-48 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demand} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#23263b" vertical={false} />
                <XAxis dataKey="name" tick={false} stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#141624', borderColor: '#23263b', color: '#fff' }} />
                <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]}>
                  {demand.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Chart Legend */}
          <div className="space-y-1.5 mt-4 border-t border-brand-border/60 pt-4">
            {demand.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-[10px]">
                <div className="flex items-center gap-2 text-brand-muted">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                  <span className="truncate max-w-[160px]">{item.name}</span>
                </div>
                <span className="font-bold text-brand-charcoal">{item.value} inquiries</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Assistant API Keys Configuration */}
      <div className="glass-panel border border-brand-border p-6 rounded-2xl mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-brand-card flex items-center justify-center shrink-0 border border-brand-border">
            <Cpu className="w-5 h-5 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-brand-charcoal">AI Assistant API Credentials</h3>
            <p className="text-[11px] text-brand-muted mt-0.5">Configure global Gemini/OpenAI API keys used to power live responses in the chat widget.</p>
          </div>
        </div>

        <form onSubmit={handleSaveSettings} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gemini API Key */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block">Google Gemini API Key</label>
              <div className="relative">
                <input
                  type={showGeminiKey ? 'text' : 'password'}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter Gemini API Key..."
                  className="w-full bg-brand-dark border border-brand-border rounded-xl pl-4 pr-10 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowGeminiKey(!showGeminiKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-muted hover:text-brand-charcoal"
                >
                  {showGeminiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* OpenAI API Key */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block">OpenAI API Key</label>
              <div className="relative">
                <input
                  type={showOpenaiKey ? 'text' : 'password'}
                  value={openaiApiKey}
                  onChange={(e) => setOpenaiApiKey(e.target.value)}
                  placeholder="Enter OpenAI API Key..."
                  className="w-full bg-brand-dark border border-brand-border rounded-xl pl-4 pr-10 py-2.5 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowOpenaiKey(!showOpenaiKey)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-brand-muted hover:text-brand-charcoal"
                >
                  {showOpenaiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Feedback message */}
          {settingsMessage && (
            <div className={`p-3 rounded-xl border text-[11px] font-semibold ${
              settingsMessage.type === 'success' 
                ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-400 animate-fade-in' 
                : 'bg-red-950/20 border-red-900/50 text-red-400 animate-fade-in'
            }`}>
              {settingsMessage.text}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-5 py-2 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-purple hover:opacity-95 text-white text-xs font-bold shadow-md shadow-brand-primary/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSavingSettings ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving keys...
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  Save AI Configuration
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Inquiry Management Module */}
      <div className="glass-panel border border-brand-border rounded-2xl overflow-hidden">
        
        {/* Filters bar */}
        <div className="p-5 bg-brand-card/40 border-b border-brand-border grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          
          {/* Search box */}
          <div className="relative md:col-span-2">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-brand-muted">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, job title or ref..."
              className="w-full bg-brand-dark border border-brand-border rounded-xl pl-9 pr-4 py-2 text-xs text-brand-charcoal placeholder-slate-400 focus:outline-none focus:border-brand-primary transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:outline-none focus:border-brand-primary"
            >
              <option value="All">All Categories</option>
              <option value="AI Virtual Assistant Request">AI Virtual Assistants</option>
              <option value="Prototyping Request">UI Prototyping</option>
              <option value="Software Assistance">Software Engineering</option>
              <option value="General Inquiry">General Info</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-brand-dark border border-brand-border rounded-xl px-3 py-2 text-xs text-brand-charcoal focus:outline-none focus:border-brand-primary"
            >
              <option value="All">All Statuses</option>
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Processed">Processed</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

        </div>

        {/* Inquiries table list */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-brand-border text-[10px] uppercase font-bold text-brand-muted tracking-wider bg-brand-card/20">
                <th className="p-4">Reference</th>
                <th className="p-4">Contact Profile</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/40 text-xs">
              {filteredInquiries.length > 0 ? (
                filteredInquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-brand-card/10 transition-colors">
                    <td className="p-4 font-mono font-semibold text-brand-primary">{inq.trackingReference}</td>
                    <td className="p-4">
                      <div className="font-bold text-brand-charcoal">{inq.fullName}</div>
                      <div className="text-[10px] text-brand-muted">{inq.companyName} &bull; {inq.jobTitle}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[9px] font-medium text-brand-secondary">
                        {inq.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                        inq.status === 'New' ? 'bg-blue-950 text-blue-400 border border-blue-900/50' :
                        inq.status === 'In Progress' ? 'bg-amber-950 text-amber-400 border border-amber-900/50' :
                        inq.status === 'Processed' ? 'bg-purple-950 text-purple-400 border border-purple-900/50' :
                        'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}>
                        {inq.status}
                      </span>
                    </td>
                    <td className="p-4 text-right flex justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedInquiry(inq)}
                        className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-primary/10 border border-brand-border text-brand-muted hover:text-brand-primary transition-colors inline-flex items-center gap-1"
                        title="Inspect"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Inspect</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedInquiry(inq);
                          setIsEditing(true);
                        }}
                        className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-secondary/10 border border-brand-border text-brand-muted hover:text-brand-secondary transition-colors inline-flex items-center gap-1"
                        title="Edit Info"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteInquiry(inq.id)}
                        className="p-1.5 rounded-lg bg-red-950/20 hover:bg-red-900/20 border border-red-900/40 text-red-400 hover:text-red-300 transition-colors inline-flex items-center gap-1"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-brand-muted">
                    No matching inquiries found in registry logs.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Inquiry Detail Inspector Overlay / Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-brand-card border border-brand-border rounded-2xl shadow-2xl relative flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-brand-border flex justify-between items-center bg-brand-dark/20">
              <div>
                <span className="text-[10px] font-mono text-brand-primary uppercase font-bold">Inquiry Inspector</span>
                <h4 className="text-base font-bold text-brand-charcoal mt-1">Ref: {selectedInquiry.trackingReference}</h4>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-brand-muted hover:text-brand-primary text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Scrollable details */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              
              {isEditing ? (
                /* Edit Mode Form */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted uppercase font-bold">Contact Name</label>
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-brand-charcoal font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted uppercase font-bold">Job Title</label>
                      <input 
                        type="text" 
                        value={editJobTitle} 
                        onChange={(e) => setEditJobTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-brand-charcoal font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted uppercase font-bold">Company Name</label>
                      <input 
                        type="text" 
                        value={editCompany} 
                        onChange={(e) => setEditCompany(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-brand-charcoal font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted uppercase font-bold">Country</label>
                      <input 
                        type="text" 
                        value={editCountry} 
                        onChange={(e) => setEditCountry(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-brand-charcoal font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted uppercase font-bold">Email Address</label>
                      <input 
                        type="email" 
                        value={editEmail} 
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-brand-charcoal font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-brand-muted uppercase font-bold">Phone Number</label>
                      <input 
                        type="text" 
                        value={editPhone} 
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-brand-charcoal font-semibold outline-none focus:border-brand-primary"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-muted uppercase font-bold">Service Category</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-brand-charcoal font-semibold outline-none focus:border-brand-primary"
                    >
                      <option value="AI Virtual Assistant Request">AI Virtual Assistant Request</option>
                      <option value="Prototyping Request">Prototyping Request</option>
                      <option value="Software Assistance">Software Assistance</option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-brand-muted uppercase font-bold">Project Specifications</label>
                    <textarea 
                      value={editJobDetails} 
                      onChange={(e) => setEditJobDetails(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 bg-brand-dark border border-brand-border rounded-lg text-brand-charcoal font-sans outline-none focus:border-brand-primary leading-relaxed"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-4 border-t border-brand-border/40">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-brand-card hover:bg-brand-primary/10 border border-brand-border text-brand-muted hover:text-brand-primary rounded-xl font-bold transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                    <button
                      onClick={handleEditInquiry}
                      disabled={editUpdating}
                      className="flex items-center gap-1.5 px-5 py-2 bg-brand-primary text-white hover:bg-brand-primary/80 rounded-xl font-bold transition-all disabled:opacity-50"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {editUpdating ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              ) : (
                /* View Mode */
                <div className="space-y-6">
                  {/* Profile details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-brand-dark p-4 rounded-xl border border-brand-border">
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-brand-muted uppercase font-bold">Contact Person</div>
                      <div className="font-bold text-brand-charcoal text-sm">{selectedInquiry.fullName}</div>
                      <div className="text-brand-muted">{selectedInquiry.jobTitle}</div>
                      <div className="text-brand-muted">{selectedInquiry.companyName}</div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-[10px] text-brand-muted uppercase font-bold">Location & Contact</div>
                      <div>Email: <a href={`mailto:${selectedInquiry.email}`} className="text-brand-secondary hover:underline">{selectedInquiry.email}</a></div>
                      <div>Phone: <span className="text-brand-charcoal">{selectedInquiry.phone}</span></div>
                      <div>Country: <span className="text-brand-charcoal">{selectedInquiry.country}</span></div>
                    </div>
                  </div>

                  {/* Categorization Profile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <span className="text-[10px] text-brand-muted block uppercase font-bold">Classification</span>
                      <span className="text-xs font-bold text-brand-secondary mt-1 block">
                        {selectedInquiry.category}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-brand-muted block uppercase font-bold">Created Date</span>
                      <span className="text-xs font-semibold text-brand-charcoal mt-1 block">
                        {new Date(selectedInquiry.createdAt).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Details text area */}
                  <div>
                    <span className="text-[10px] text-brand-muted block uppercase font-bold mb-2">Project Specifications</span>
                    <div className="p-4 bg-brand-dark rounded-xl border border-brand-border text-brand-charcoal font-sans leading-relaxed whitespace-pre-wrap">
                      {selectedInquiry.jobDetails}
                    </div>
                  </div>

                  {/* Status Update & Actions Selectors */}
                  <div className="border-t border-brand-border/40 pt-4 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-[10px] text-brand-muted block uppercase font-bold mb-1.5">Update Status</span>
                        <div className="flex gap-2">
                          {['New', 'In Progress', 'Processed', 'Closed'].map((s) => (
                            <button
                              key={s}
                              onClick={() => handleUpdateStatus(selectedInquiry.id, s)}
                              disabled={statusUpdating || selectedInquiry.status === s}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                selectedInquiry.status === s
                                  ? 'bg-brand-primary text-white'
                                  : 'bg-brand-card hover:bg-brand-primary/10 border border-brand-border text-brand-muted hover:text-brand-primary'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center gap-1 px-4 py-2 bg-brand-card hover:bg-brand-secondary/10 border border-brand-border text-brand-muted hover:text-brand-secondary rounded-xl text-xs font-bold transition-all"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-brand-secondary" />
                          Edit Info
                        </button>
                        <button
                          onClick={() => handleDeleteInquiry(selectedInquiry.id)}
                          className="flex items-center gap-1 px-4 py-2 bg-red-950/20 hover:bg-red-900/20 border border-red-900/40 text-red-400 rounded-xl text-xs font-bold transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        onClick={() => setSelectedInquiry(null)}
                        className="px-5 py-2 rounded-xl bg-brand-card hover:bg-brand-primary/10 border border-brand-border text-brand-muted hover:text-brand-primary text-xs font-semibold transition-all"
                      >
                        Close Inspector
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

      {/* Real-time Toast Notifications */}
      <div className="fixed top-6 right-6 z-50 space-y-3 pointer-events-none max-w-sm w-full">
        {toasts.map(toast => (
          <div
            key={toast.id}
            onClick={() => {
              setSelectedInquiry(toast.inquiry);
              markAsRead(toast.inquiry.id);
              setToasts(prev => prev.filter(t => t.id !== toast.id));
            }}
            className="pointer-events-auto bg-white border border-brand-border rounded-2xl p-4 shadow-2xl flex gap-3 items-start cursor-pointer hover:border-brand-primary hover:scale-[1.02] transition-all duration-300 animate-float-in"
          >
            <div className="w-8 h-8 rounded-full bg-brand-primary/10 text-brand-primary flex items-center justify-center shrink-0 border border-brand-primary/25">
              <Bell className="w-4 h-4" />
            </div>
            <div className="flex-grow text-xs text-left">
              <h4 className="font-extrabold text-brand-charcoal">New Inquiry Submitted!</h4>
              <p className="text-[11px] text-brand-muted mt-0.5 leading-snug">
                <span className="font-bold text-brand-charcoal">{toast.inquiry.fullName}</span> from {toast.inquiry.companyName} submitted a request.
              </p>
              <span className="text-[9px] text-brand-secondary font-bold uppercase tracking-wider mt-1 block">
                {toast.inquiry.category}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setToasts(prev => prev.filter(t => t.id !== toast.id));
              }}
              className="text-brand-muted hover:text-brand-primary p-0.5"
              aria-label="Close alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}
