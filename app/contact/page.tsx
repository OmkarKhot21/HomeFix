import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact us | HomeFix',
  description: 'Request a callback from the HomeFix team for help, complaints, warranty claims or privacy requests.',
};

export default function ContactPage() {
  return <ContactClient />;
}
