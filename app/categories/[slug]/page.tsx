import { notFound } from 'next/navigation';
import Link from 'next/link';
import categoriesJson from '@/data/categories.json';
import filtersJson from '@/data/filters.json';
import type { CategoriesData, FiltersData, ListingSummary } from '@/app/types';
import FilterPanel from '@/app/components/FilterPanel';
import ListingCard from '@/app/components/ListingCard';

const categoriesData = categoriesJson as CategoriesData;
const filtersData = filtersJson as FiltersData;

const sampleListings: ListingSummary[] = [
  {
    id: 'listing-sample-1',
    title: '2022 Nissan Patrol SE Titanium',
    priceSar: 305000,
    city: 'Riyadh',
    condition: 'used',
    mileageKm: 24000,
    certified: true
  },
  {
    id: 'listing-sample-2',
    title: 'Premium Smart Home Package',
    priceSar: 18000,
    city: 'Jeddah',
    condition: 'new'
  }
];

const findCategory = (slug: string) => categoriesData.categories.find((category) => category.slug === slug);

export default function CategoryPage({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { focus?: string };
}) {
  const category = findCategory(params.slug);

  if (!category) {
    notFound();
  }

  const categoryFilters = filtersData.filters[category.slug] ?? [];
  const subcategories = category.children ?? [];
  const focusSlug = searchParams?.focus;
  const focusedSubcategory = subcategories.find((child) => child.slug === focusSlug);

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <section className="space-y-6">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-brand-primary">{category.label}</h1>
          {category.description && <p className="text-slate-600">{category.description}</p>}
          {focusedSubcategory && (
            <div className="rounded border border-brand-accent bg-orange-50 px-4 py-3 text-sm text-brand-primary">
              Highlighted focus: {focusedSubcategory.label}
            </div>
          )}
        </header>
        {subcategories.length > 0 && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-brand-primary">Subcategories</h2>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((child) => (
                <Link
                  key={child.slug}
                  href={`/categories/${category.slug}?focus=${child.slug}`}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    child.slug === focusSlug
                      ? 'border-brand-accent bg-brand-accent/10 text-brand-primary'
                      : 'border-slate-200 text-slate-600 hover:border-brand-accent hover:text-brand-primary'
                  }`}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          </div>
        )}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-brand-primary">Sample listings</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {sampleListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
      <FilterPanel title="Filter" filters={categoryFilters} />
    </div>
  );
}
