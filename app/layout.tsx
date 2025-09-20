import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import categoriesJson from '@/data/categories.json';
import type { CategoriesData } from './types';

const categoriesData = categoriesJson as CategoriesData;

export const metadata: Metadata = {
  title: 'Mazad.com Marketplace',
  description: 'Saudi Arabia\'s trusted marketplace for vehicles and premium goods.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const primaryCategories = categoriesData.categories.slice(0, 4);

  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <div className="main-shell flex items-center justify-between gap-6 py-4">
            <Link href="/" className="text-xl font-bold text-brand-primary">
              Mazad.com
            </Link>
            <nav aria-label="Primary navigation" className="hidden items-center gap-4 md:flex">
              {primaryCategories.map((category) => (
                <Link key={category.slug} href={`/categories/${category.slug}`} className="text-sm text-slate-600 hover:text-brand-primary">
                  {category.label}
                </Link>
              ))}
              <Link href="/categories" className="rounded border border-brand-accent px-3 py-1 text-sm font-medium text-brand-accent">
                All categories
              </Link>
            </nav>
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Link href="#">Sell</Link>
              <Link href="#">Sign In</Link>
            </div>
          </div>
        </header>
        <main className="main-shell">{children}</main>
        <footer className="border-t border-slate-200 bg-white">
          <div className="main-shell flex flex-col gap-2 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <span>© {new Date().getFullYear()} Mazad.com. All rights reserved.</span>
            <div className="flex gap-4">
              <Link href="#">Privacy</Link>
              <Link href="#">Terms</Link>
              <Link href="#">Support</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
