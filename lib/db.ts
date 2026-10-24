import fs from 'fs';
import path from 'path';

// Resolve writable database path: On Vercel serverless, process.cwd() is read-only.
function resolveDbPath(): string {
  const isVercel = process.env.VERCEL === '1';
  if (isVercel) {
    const tmpPath = path.join('/tmp', 'leads.json');
    if (!fs.existsSync(tmpPath)) {
      const bundledPath = path.join(process.cwd(), 'leads.json');
      try {
        if (fs.existsSync(bundledPath)) {
          fs.copyFileSync(bundledPath, tmpPath);
        } else {
          fs.writeFileSync(tmpPath, JSON.stringify({ investors: [], waitlist: [] }, null, 2), 'utf8');
        }
      } catch {
        try {
          fs.writeFileSync(tmpPath, JSON.stringify({ investors: [], waitlist: [] }, null, 2), 'utf8');
        } catch {}
      }
    }
    return tmpPath;
  }

  const localPath = path.join(process.cwd(), 'leads.json');
  try {
    if (!fs.existsSync(localPath)) {
      fs.writeFileSync(localPath, JSON.stringify({ investors: [], waitlist: [] }, null, 2), 'utf8');
    }
  } catch {
    // If local path is unexpectedly read-only, fallback to /tmp
    const tmpFallback = path.join('/tmp', 'leads.json');
    if (!fs.existsSync(tmpFallback)) {
      try {
        fs.writeFileSync(tmpFallback, JSON.stringify({ investors: [], waitlist: [] }, null, 2), 'utf8');
      } catch {}
    }
    return tmpFallback;
  }
  return localPath;
}

export interface InvestorLead {
  id?: string;
  email: string;
  timestamp: string;
}

export interface WaitlistLead {
  id?: string;
  phone: string;
  timestamp: string;
}

export interface DatabaseSchema {
  investors: InvestorLead[];
  waitlist: WaitlistLead[];
}

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

function atomicWriteFileSync(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  const tmpPath = path.join(dir, `.${path.basename(filePath)}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`);
  
  try {
    fs.writeFileSync(tmpPath, content, 'utf8');
    try {
      fs.renameSync(tmpPath, filePath);
    } catch (err: unknown) {
      const error = err as { code?: string };
      if (error.code === 'EEXIST' || error.code === 'EPERM') {
        fs.copyFileSync(tmpPath, filePath);
        try {
          fs.unlinkSync(tmpPath);
        } catch {}
      } else {
        try {
          fs.unlinkSync(tmpPath);
        } catch {}
        throw err;
      }
    }
  } catch (err) {
    // Direct overwrite fallback if atomic rename is restricted
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

function readDatabase(): DatabaseSchema {
  const dbPath = resolveDbPath();
  try {
    if (!fs.existsSync(dbPath)) {
      return { investors: [], waitlist: [] };
    }
    const data = fs.readFileSync(dbPath, 'utf8');
    const parsed = JSON.parse(data);
    return {
      investors: Array.isArray(parsed?.investors) ? parsed.investors : [],
      waitlist: Array.isArray(parsed?.waitlist) ? parsed.waitlist : [],
    };
  } catch {
    return { investors: [], waitlist: [] };
  }
}

function writeDatabase(data: DatabaseSchema): void {
  const dbPath = resolveDbPath();
  atomicWriteFileSync(dbPath, JSON.stringify(data, null, 2));
}

export function getAllLeadsUnified(): UnifiedLead[] {
  const data = readDatabase();
  const investorLeads: UnifiedLead[] = data.investors.map((inv, idx) => ({
    id: inv.id || `inv_${idx}_${new Date(inv.timestamp).getTime() || idx}`,
    type: 'investor',
    contact: inv.email,
    timestamp: inv.timestamp,
  }));

  const waitlistLeads: UnifiedLead[] = data.waitlist.map((wait, idx) => ({
    id: wait.id || `wait_${idx}_${new Date(wait.timestamp).getTime() || idx}`,
    type: 'waitlist',
    contact: wait.phone,
    timestamp: wait.timestamp,
  }));

  return [...investorLeads, ...waitlistLeads].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function getLeadMetrics(): LeadMetrics {
  const data = readDatabase();
  const investorCount = data.investors.length;
  const waitlistCount = data.waitlist.length;
  const totalLeads = investorCount + waitlistCount;

  const allTimestamps = [
    ...data.investors.map((i) => i.timestamp),
    ...data.waitlist.map((w) => w.timestamp),
  ].filter(Boolean);

  let latestLeadTimestamp: string | null = null;
  if (allTimestamps.length > 0) {
    allTimestamps.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    latestLeadTimestamp = allTimestamps[0];
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
  getLeads: (): DatabaseSchema => {
    return readDatabase();
  },
  addInvestor: (email: string): void => {
    const leads = readDatabase();
    const id = `inv_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    leads.investors.push({ id, email, timestamp: new Date().toISOString() });
    writeDatabase(leads);
  },
  addWaitlist: (phone: string): void => {
    const leads = readDatabase();
    const id = `wait_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    leads.waitlist.push({ id, phone, timestamp: new Date().toISOString() });
    writeDatabase(leads);
  },
  getAllLeadsUnified,
  getLeadMetrics,
};
