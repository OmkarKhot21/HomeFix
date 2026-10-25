'use client';

import { useState, useMemo } from 'react';
import { UnifiedLead, LeadMetrics } from '@/lib/db';
import { logoutAction } from '@/app/actions/authActions';
import {
  Download,
  LogOut,
  Search,
  Users,
  Briefcase,
  Smartphone,
  Clock,
  Copy,
  Check,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

interface AdminDashboardClientProps {
  initialLeads: UnifiedLead[];
  initialMetrics: LeadMetrics;
  adminUser: string;
}

export default function AdminDashboardClient({
  initialLeads,
  initialMetrics,
  adminUser,
}: AdminDashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'investor' | 'waitlist'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Filter leads based on type and search query
  const filteredLeads = useMemo(() => {
    return initialLeads.filter((lead) => {
      const matchesType = typeFilter === 'all' || lead.type === typeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        lead.contact.toLowerCase().includes(q) ||
        lead.id.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [initialLeads, typeFilter, searchQuery]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleExportCsv = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/admin/export');
      if (!response.ok) throw new Error('Export failed');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `homefix-leads-${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Failed to download CSV export. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const formatTimestamp = (iso: string) => {
    try {
      const date = new Date(iso);
      return new Intl.DateTimeFormat('en-IN', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return iso;
    }
  };


  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Top Navbar */}
      <header className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-zinc-300 transition-colors">
                HOMEFIX
              </span>
              <span className="bg-zinc-800 text-[10px] uppercase tracking-widest px-2 py-0.5 rounded text-zinc-300 font-mono font-semibold">
                OPS
              </span>
            </Link>
            <div className="hidden sm:flex items-center gap-2 border-l border-zinc-800 pl-4 text-xs text-zinc-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse"></span>
              Thane &bull; Mumbai &bull; Navi Mumbai
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Operator info */}
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-200" />
              <span>{adminUser}</span>
            </div>

            {/* View Live Site */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all"
            >
              <span>Landing Page</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            {/* CSV Export */}
            <button
              onClick={handleExportCsv}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-black font-semibold text-xs tracking-wide transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
            >
              <Download className={`w-3.5 h-3.5 ${isExporting ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">Export CSV</span>
              <span className="sm:hidden">CSV</span>
            </button>

            {/* Logout form */}
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-red-400 bg-zinc-900 border border-zinc-800 hover:border-red-900/50 transition-all cursor-pointer"
                title="Sign out of console"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Exit</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* KPI Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Leads */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-mono text-zinc-400">Total Inquiries</span>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white tracking-tight">
                {initialMetrics.totalLeads}
              </span>
              <span className="text-xs text-zinc-500 font-mono">records captured</span>
            </div>
          </div>

          {/* Card 2: Investors */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-mono text-zinc-400">Investor Decks</span>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white tracking-tight">
                {initialMetrics.investorCount}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {initialMetrics.totalLeads > 0
                  ? `(${Math.round((initialMetrics.investorCount / initialMetrics.totalLeads) * 100)}%)`
                  : '(0%)'}
              </span>
            </div>
          </div>

          {/* Card 3: Waitlist Pre-orders */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-mono text-zinc-400">Waitlist Users</span>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Smartphone className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-white tracking-tight">
                {initialMetrics.waitlistCount}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {initialMetrics.totalLeads > 0
                  ? `(${Math.round((initialMetrics.waitlistCount / initialMetrics.totalLeads) * 100)}%)`
                  : '(0%)'}
              </span>
            </div>
          </div>

          {/* Card 4: Last Activity */}
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 shadow-sm hover:border-zinc-700 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-mono text-zinc-400">Latest Pulse</span>
              <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-lg font-display font-bold text-white tracking-tight truncate">
                {initialMetrics.latestLeadRelative}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-mono mt-1 truncate">
              {initialMetrics.latestLeadTimestamp
                ? formatTimestamp(initialMetrics.latestLeadTimestamp)
                : 'Awaiting submissions'}
            </p>
          </div>
        </section>

        {/* Lead Table Section */}
        <section className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
          {/* Header Controls */}
          <div className="p-4 sm:p-6 border-b border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-display font-bold text-white tracking-tight">
                Unified Inbound Pipeline
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Real-time capture feed from landing page modals & waitlist
              </p>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Filter Pills */}
              <div className="inline-flex rounded-lg bg-zinc-900 p-1 border border-zinc-800">
                <button
                  onClick={() => setTypeFilter('all')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    typeFilter === 'all'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  All ({initialLeads.length})
                </button>
                <button
                  onClick={() => setTypeFilter('investor')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    typeFilter === 'investor'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Investors ({initialMetrics.investorCount})
                </button>
                <button
                  onClick={() => setTypeFilter('waitlist')}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                    typeFilter === 'waitlist'
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Waitlist ({initialMetrics.waitlistCount})
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative min-w-[220px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                  <Search className="w-3.5 h-3.5" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search contact or ID..."
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-all font-mono"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 text-zinc-400 uppercase font-mono tracking-wider border-b border-zinc-800">
                <tr>
                  <th scope="col" className="px-6 py-3.5">
                    Stream
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Contact Details
                  </th>
                  <th scope="col" className="px-6 py-3.5">
                    Registered At
                  </th>
                  <th scope="col" className="px-6 py-3.5 text-right">
                    Quick Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 font-sans">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => {
                    const isInvestor = lead.type === 'investor';
                    const isCopied = copiedId === lead.id;

                    return (
                      <tr
                        key={lead.id}
                        className="hover:bg-zinc-900/40 transition-colors group"
                      >
                        {/* Type Badge */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isInvestor ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-800 text-zinc-200 border border-zinc-700">
                              <Briefcase className="w-3 h-3 text-zinc-300" />
                              Investor Deck
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-zinc-900 text-zinc-300 border border-zinc-800">
                              <Smartphone className="w-3 h-3 text-zinc-400" />
                              Waitlist Phone
                            </span>
                          )}
                        </td>

                        {/* Contact details */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-mono text-white text-sm font-medium tracking-tight">
                            {lead.contact}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="px-6 py-4 whitespace-nowrap text-zinc-400 font-mono text-[11px]">
                          {formatTimestamp(lead.timestamp)}
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <button
                            onClick={() => handleCopy(lead.id, lead.contact)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
                            title="Copy contact to clipboard"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-brand" />
                                <span className="text-brand font-medium">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-zinc-500 font-mono">
                      <div className="max-w-xs mx-auto flex flex-col items-center">
                        <Users className="w-8 h-8 text-zinc-700 mb-2" />
                        <p className="text-sm text-zinc-400 font-sans font-medium">No leads match query</p>
                        <p className="text-xs text-zinc-600 mt-1">
                          {searchQuery
                            ? `Try clearing your search term "${searchQuery}"`
                            : 'No inquiries have been recorded yet.'}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer Summary */}
          <div className="px-6 py-3.5 bg-zinc-900/40 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500 font-mono">
            <span>
              Showing {filteredLeads.length} of {initialLeads.length} total inquiries
            </span>
            <span>Live Sync Active</span>
          </div>
        </section>
      </main>
    </div>
  );
}
