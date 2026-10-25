import { NextResponse } from 'next/server';
import { getAllLeadsUnified } from '@/lib/db';
import { verifyAdminApi } from '@/lib/auth';

function sanitizeCsvField(value: string | number | null | undefined): string {
  if (value === null || value === undefined) {
    return '""';
  }
  let str = String(value);

  // Remove dangerous control characters (preserve standard printable characters)
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  const trimmed = str.trimStart();

  // Formula Injection Defense (CWE-1236): Neutralize Excel/Sheets command characters
  // Do not prefix values that fully match valid phone numbers /^\+?\d{10,14}$/
  const isPhoneNumber = /^\+?\d{10,14}$/.test(trimmed);
  if (!isPhoneNumber && /^[=+\-@\t\r|%]/.test(trimmed)) {
    str = `'${str}`;
  }

  // RFC 4180 escape: wrap in quotes and double internal quotes
  return `"${str.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  // Only allow downloads started from our own site (or typed into the address bar), not from other sites.
  if (req.headers.get('sec-fetch-site') === 'cross-site') {
    return new NextResponse('Forbidden', { status: 403, headers: { 'Content-Type': 'text/plain' } });
  }

  // Enforce session check on admin API route
  const auth = await verifyAdminApi();
  if (!auth.authorized) {
    return new NextResponse('Unauthorized: Valid admin session token required.', {
      status: 401,
      headers: {
        'Content-Type': 'text/plain',
        'WWW-Authenticate': 'Bearer error="invalid_token"',
      },
    });
  }

  const leads = await getAllLeadsUnified();

  const headers = ['Lead ID', 'Type', 'Contact Details', 'ISO Timestamp', 'Formatted Date'];
  const rows = leads.map((lead) => {
    let formattedDate = lead.timestamp;
    try {
      formattedDate = new Date(lead.timestamp).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        dateStyle: 'medium',
        timeStyle: 'medium',
      });
    } catch {
      // Keep fallback
    }

    return [
      sanitizeCsvField(lead.id),
      sanitizeCsvField(lead.type.toUpperCase()),
      sanitizeCsvField(lead.contact),
      sanitizeCsvField(lead.timestamp),
      sanitizeCsvField(formattedDate),
    ].join(',');
  });

  const csvContent = [headers.map(sanitizeCsvField).join(','), ...rows].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `homefix-leads-${dateStr}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
