import {
  Droplets,
  Wrench,
  Fan,
  Plug,
  Lightbulb,
  Lock,
  Sofa,
  Drill,
  Flame,
  ShowerHead,
  ShieldCheck,
  BadgeIndianRupee,
  Clock,
  MapPin,
  Smartphone,
  RotateCcw,
  type LucideIcon,
} from 'lucide-react';

export interface ServiceItem {
  name: string;
  price: number;
  group: 'Plumbing' | 'Electrical' | 'Carpentry';
  icon: LucideIcon;
}

// Shared content for all three design concepts. Prices match the current site.
export const SERVICES: ServiceItem[] = [
  { name: 'Leaking Tap', price: 199, group: 'Plumbing', icon: Droplets },
  { name: 'Blocked Drain', price: 199, group: 'Plumbing', icon: Wrench },
  { name: 'Bathroom Fittings', price: 199, group: 'Plumbing', icon: ShowerHead },
  { name: 'Geyser Repair', price: 199, group: 'Plumbing', icon: Flame },
  { name: 'Fan Repair', price: 199, group: 'Electrical', icon: Fan },
  { name: 'Switchboard', price: 199, group: 'Electrical', icon: Plug },
  { name: 'Light Fitting', price: 199, group: 'Electrical', icon: Lightbulb },
  { name: 'Door Lock', price: 249, group: 'Carpentry', icon: Lock },
  { name: 'Furniture Assembly', price: 249, group: 'Carpentry', icon: Sofa },
  { name: 'Drilling & Mounting', price: 249, group: 'Carpentry', icon: Drill },
];

export const STEPS = [
  { title: 'Pick your problem', text: 'Choose a repair and see the price upfront.' },
  { title: 'Pro arrives in 15 min', text: 'The nearest verified technician is on the way.' },
  { title: 'Pay after the job', text: 'UPI, card or cash — only once it’s fixed.' },
];

export const PROMISES: { title: string; text: string; icon: LucideIcon }[] = [
  { title: 'Police verified', text: 'ID and background checked', icon: ShieldCheck },
  { title: 'Upfront prices', text: 'No surge, no bargaining', icon: BadgeIndianRupee },
  { title: '15-minute dispatch', text: 'Nearest pro, auto-matched', icon: Clock },
  { title: '30-day warranty', text: 'Free re-visit if it recurs', icon: RotateCcw },
  { title: 'Live tracking', text: 'See your pro on the map', icon: MapPin },
  { title: 'Pay by UPI', text: 'Or card / cash after work', icon: Smartphone },
];

export const AREAS = ['Thane West', 'Thane East', 'Ghodbunder Road', 'Mulund', 'Powai', 'Navi Mumbai'];

export const CITIES = ['Thane', 'Mumbai', 'Navi Mumbai'];
