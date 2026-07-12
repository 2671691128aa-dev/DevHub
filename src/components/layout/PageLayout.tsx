import { type ReactNode } from 'react';
import { Navbar } from './Navbar';

export interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
