import { redirect } from 'next/navigation';

// Old partner sign-up URL: forward to the new one.
export default function OldPartnerPage() {
  redirect('/pro/join');
}
