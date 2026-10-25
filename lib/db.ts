import { neon } from '@neondatabase/serverless';

export interface UnifiedLead {
  id: string;
  type: 'investor' | 'waitlist';
  contact: string;
  timestamp: string;
}

export interface LeadMetrics {
  totalLeads: number;
  investorCount: number;
  waitlistCount: number;
  latestLeadTimestamp: string | null;
  latestLeadRelative: string;
}

interface RawLeadRow {
  id: string | number;
  type: string;
  contact: string;
  created_at: string | Date;
}

export function getSql() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is missing.');
  }
  return neon(databaseUrl);
}

export async function addLead(type: 'investor' | 'waitlist', contact: string): Promise<void> {
  const sql = getSql();
  await sql`insert into leads (type, contact) values (${type}, ${contact}) on conflict (type, contact) do nothing`;
}

export async function addInvestor(email: string): Promise<void> {
  await addLead('investor', email);
}

export async function addWaitlist(phone: string): Promise<void> {
  await addLead('waitlist', phone);
}

export async function getAllLeadsUnified(): Promise<UnifiedLead[]> {
  const sql = getSql();
  const rows = (await sql`select id, type, contact, created_at from leads order by created_at desc`) as RawLeadRow[];

  return rows.map((row) => ({
    id: `${row.type}_${row.id}`,
    type: row.type as 'investor' | 'waitlist',
    contact: row.contact,
    timestamp: new Date(row.created_at).toISOString(),
  }));
}

export async function getLeadMetrics(): Promise<LeadMetrics> {
  const leads = await getAllLeadsUnified();
  const investorCount = leads.filter((lead) => lead.type === 'investor').length;
  const waitlistCount = leads.filter((lead) => lead.type === 'waitlist').length;
  const totalLeads = leads.length;

  let latestLeadTimestamp: string | null = null;
  if (leads.length > 0) {
    latestLeadTimestamp = leads[0].timestamp;
  }

  let latestLeadRelative = 'No activity yet';
  if (latestLeadTimestamp) {
    try {
      const diffMs = Date.now() - new Date(latestLeadTimestamp).getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) latestLeadRelative = 'Just now';
      else if (diffMins < 60) latestLeadRelative = `${diffMins}m ago`;
      else if (diffHours < 24) latestLeadRelative = `${diffHours}h ago`;
      else latestLeadRelative = `${diffDays}d ago`;
    } catch {
      latestLeadRelative = 'Recently';
    }
  }

  return {
    totalLeads,
    investorCount,
    waitlistCount,
    latestLeadTimestamp,
    latestLeadRelative,
  };
}

export const db = {
  addInvestor,
  addWaitlist,
  getAllLeadsUnified,
  getLeadMetrics,
};

// ===== App flow: customers, bookings, partners, callbacks (db/migrations/002_app_flow.sql) =====

export interface CallbackRow {
  id: string;
  phone: string;
  created_at: string;
}

export async function upsertUser(user: {
  uid: string;
  name: string | null;
  email: string | null;
  phone: string | null;
}): Promise<void> {
  const sql = getSql();
  await sql`
    insert into users (uid, name, email, phone)
    values (${user.uid}, ${user.name}, ${user.email}, ${user.phone})
    on conflict (uid) do update set
      name = coalesce(excluded.name, users.name),
      email = coalesce(excluded.email, users.email),
      phone = coalesce(excluded.phone, users.phone),
      last_login_at = now()`;
}

export async function addCallbackRequest(phone: string): Promise<void> {
  const sql = getSql();
  await sql`insert into callback_requests (phone) values (${phone})`;
}

export async function getRecentCallbacks(limit = 50): Promise<CallbackRow[]> {
  const sql = getSql();
  const rows = (await sql`
    select id, phone, created_at from callback_requests order by created_at desc limit ${limit}`) as CallbackRow[];
  return rows.map((r) => ({ ...r, id: String(r.id), created_at: new Date(r.created_at).toISOString() }));
}

// ===== Investor messages (db/migrations/004_investor_messages.sql) =====

export interface InvestorMessageRow {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export async function addInvestorMessage(m: { name: string; email: string; message: string }): Promise<void> {
  const sql = getSql();
  await sql`insert into investor_messages (name, email, message) values (${m.name}, ${m.email}, ${m.message})`;
}

export async function getRecentInvestorMessages(limit = 50): Promise<InvestorMessageRow[]> {
  const sql = getSql();
  const rows = (await sql`
    select id, name, email, message, created_at from investor_messages order by created_at desc limit ${limit}`) as InvestorMessageRow[];
  return rows.map((r) => ({ ...r, id: String(r.id), created_at: new Date(r.created_at).toISOString() }));
}
