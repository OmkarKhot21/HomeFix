import { z } from 'zod';

export const adminLoginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, 'Username is required.')
    .max(128, 'Username cannot exceed 128 characters.'),
  password: z
    .string()
    .min(1, 'Password is required.')
    .max(256, 'Password cannot exceed 256 characters.'),
  next: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return '/admin';
      const clean = val.trim();
      // Anti-Open-Redirect: must start with /admin, no protocol-relative slashes (//) or backslashes
      if (clean.startsWith('/admin') && !clean.startsWith('//') && !clean.includes('\\')) {
        return clean;
      }
      return '/admin';
    }),
});

export const investorLeadSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, 'Email is required.')
    .max(120, 'Email cannot exceed 120 characters.')
    .email('Please provide a valid email address.')
    .refine((val) => !/[<>'"&]/.test(val), {
      message: 'Email contains invalid characters.',
    }),
});

export const waitlistLeadSchema = z.object({
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s\-()]/g, ''))
    .refine((val) => /^\+?[0-9]{10,14}$/.test(val), {
      message: 'Please enter a valid 10 to 14 digit mobile number.',
    }),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type InvestorLeadInput = z.infer<typeof investorLeadSchema>;
export type WaitlistLeadInput = z.infer<typeof waitlistLeadSchema>;

// ===== App flow =====

// Indian mobile number: accepts "98765 43210", "+91 98765-43210", "09876543210"; stores 10 digits.
const indianMobile = z
  .string()
  .trim()
  .transform((val) => val.replace(/[\s\-()]/g, '').replace(/^(\+91|91|0)(?=\d{10}$)/, ''))
  .refine((val) => /^[6-9]\d{9}$/.test(val), { message: 'Please enter a valid 10-digit mobile number.' });

export const callbackSchema = z.object({ phone: indianMobile });

export const BOOKING_SLOTS = [
  'As soon as possible',
  'Morning (8 AM – 12 PM)',
  'Afternoon (12 – 4 PM)',
  'Evening (4 – 8 PM)',
] as const;

export const bookingSchema = z.object({
  service: z.string().trim().min(1, 'Please choose a service.').max(60),
  phone: indianMobile,
  address: z
    .string()
    .trim()
    .min(10, 'Please enter your full address (flat, building, area).')
    .max(400, 'Address is too long.'),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Please choose a date.')
    .refine((val) => {
      const d = new Date(`${val}T00:00:00+05:30`);
      if (Number.isNaN(d.getTime())) return false;
      const today = new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' }) + 'T00:00:00+05:30');
      const max = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);
      return d >= today && d <= max;
    }, 'Please choose a date between today and the next 60 days.'),
  preferredSlot: z.enum(BOOKING_SLOTS, { message: 'Please choose a time slot.' }),
  notes: z
    .string()
    .trim()
    .max(500, 'Notes are too long.')
    .optional()
    .transform((v) => (v ? v : null)),
});

export const PARTNER_TRADES = ['plumber', 'electrician', 'carpenter'] as const;

export const partnerSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name.').max(80),
  phone: indianMobile,
  trade: z.enum(PARTNER_TRADES, { message: 'Please choose your trade.' }),
  area: z.string().trim().min(2, 'Please enter the area you work in.').max(80),
  experienceYears: z.coerce
    .number({ message: 'Please enter your years of experience.' })
    .int('Use whole years.')
    .min(0, 'Experience cannot be negative.')
    .max(60, 'Please check your years of experience.'),
});
