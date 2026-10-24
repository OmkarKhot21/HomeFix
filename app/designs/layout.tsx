import type { Metadata } from 'next';

// Design concept previews. Kept out of search results until one is chosen.
export const metadata: Metadata = {
  title: 'Design Concepts | HomeFix',
  robots: { index: false, follow: false },
};

export default function DesignsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
