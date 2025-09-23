import CategoryMenu from './components/CategoryMenu';
import ListingCard from './components/ListingCard';
import categoriesJson from '@/data/categories.json';
import listingsJson from '@/data/listings.json';
import type { CategoriesData, ListingsData } from './types';

const categoriesData = categoriesJson as CategoriesData;
const listingsData = listingsJson as ListingsData;
const featuredListings = listingsData.listings.filter((listing) => listing.categorySlug === 'vehicles').slice(0, 3);

export default function HomePage() {
  return (
    <div className="space-y-12">
      <section className="grid gap-6 rounded-xl bg-white p-8 shadow-sm md:grid-cols-[3fr,2fr]">
        <div className="space-y-4">
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs uppercase tracking-wide text-slate-600">
            Marketplace MVP
          </span>
          <h1 className="text-3xl font-bold text-brand-primary">
            Trusted auctions for vehicles and premium assets in Saudi Arabia
          </h1>
          <p className="text-base text-slate-600">
            Explore curated listings backed by inspection-ready data and localized taxonomies. Buyers and sellers gain confidence
            with Mazad Certified workflows and transparent filters.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/categories/cars"
              className="rounded bg-brand-accent px-4 py-2 text-sm font-semibold text-white shadow"
            >
              Browse vehicles
            </a>
            <a href="/sellers" className="rounded border border-brand-accent px-4 py-2 text-sm font-semibold text-brand-accent">
              Become a seller
            </a>
          </div>
        </div>
        <div className="rounded-lg border border-dashed border-brand-accent bg-orange-50 p-6 text-sm text-brand-primary">
          <h2 className="text-lg font-semibold">Phase 1 Highlights</h2>
          <ul className="mt-4 space-y-2 list-disc pl-4">
            <li>Vehicles taxonomy with brand → model → trim flows.</li>
            <li>Buyer & seller journeys documented with clear acceptance criteria.</li>
            <li>Reusable filters schema powering conditional logic for used vehicles.</li>
          </ul>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-brand-primary">Browse by category</h2>
          <a href="/docs/10-category-tree.md" className="text-sm text-slate-600 hover:text-brand-primary">
            View taxonomy doc
          </a>
        </div>
        <CategoryMenu categories={categoriesData.categories} />
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-brand-primary">Featured vehicle listings</h2>
          <a href="/categories/cars" className="text-sm text-slate-600 hover:text-brand-primary">
            View all cars
          </a>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {featuredListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </section>
    </div>
  );
}
