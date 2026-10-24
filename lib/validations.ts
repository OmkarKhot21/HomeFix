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
    .refine(
      (val) => {
        if (!val) return true;
        // Anti-Open-Redirect: must start with /admin, no protocol-relative slashes (//) or backslashes
        return val.startsWith('/admin') && !val.startsWith('//') && !val.includes('\\');
      },
      { message: 'Invalid redirect destination.' }
    ),
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
