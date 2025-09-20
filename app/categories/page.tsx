import Link from 'next/link';
import categoriesJson from '@/data/categories.json';
import type { CategoriesData } from '@/app/types';

const categoriesData = categoriesJson as CategoriesData;

export default function CategoriesIndexPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-brand-primary">All categories</h1>
        <p className="text-slate-600">
          Navigate across Mazad.com\'s marketplace verticals. Each category inherits structured filters and localized taxonomy.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {categoriesData.categories.map((category) => (
          <article key={category.slug} className="flex h-full flex-col justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-brand-primary">{category.label}</h2>
              <p className="text-sm text-slate-600">{category.description}</p>
              {category.featuredFilters && category.featuredFilters.length > 0 && (
                <div className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">Key filters:</span> {category.featuredFilters.join(', ')}
                </div>
              )}
            </div>
            <div className="mt-6">
              <Link
                href={`/categories/${category.slug}`}
                className="inline-flex w-full justify-center rounded bg-brand-accent px-3 py-2 text-sm font-semibold text-white"
              >
                Explore {category.label}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
