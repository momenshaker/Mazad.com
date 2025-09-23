import { notFound } from 'next/navigation';
import Link from 'next/link';
import categoriesJson from '@/data/categories.json';
import listingsJson from '@/data/listings.json';
import type { CategoriesData, ListingsData, ListingDetail } from '@/app/types';
import ListingCard from '@/app/components/ListingCard';
import ListingAnalytics from '@/app/listings/ListingAnalytics';

const categoriesData = categoriesJson as CategoriesData;
const listingsData = listingsJson as ListingsData;

const findListing = (id: string) => listingsData.listings.find((listing) => listing.id === id);

const formatSar = (value: number) => new Intl.NumberFormat('en-SA').format(value);

const formatAccidentHistory = (value?: string) => {
  if (!value) {
    return 'Unknown';
  }
  switch (value) {
    case 'no-accidents':
      return 'No accidents reported';
    case 'minor':
      return 'Minor incidents disclosed';
    case 'major':
      return 'Major incidents disclosed';
    default:
      return value.replace(/-/g, ' ');
  }
};

const formatWarranty = (value?: string) => {
  if (!value) {
    return 'Not specified';
  }
  switch (value) {
    case 'manufacturer':
      return 'Manufacturer warranty';
    case 'extended':
      return 'Extended warranty';
    case 'none':
      return 'No warranty';
    default:
      return value.replace(/-/g, ' ');
  }
};

const getCategoryLabel = (slug?: string) => {
  if (!slug) {
    return undefined;
  }
  return categoriesData.categories.find((category) => category.slug === slug)?.label;
};

const conditionBadgeStyles = (condition: string) =>
  condition === 'new'
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : 'bg-sky-100 text-sky-700 border-sky-200';

const conditionIcon = (condition: string) => (condition === 'new' ? '✨' : '🛠️');

const buildBreadcrumbs = (listing: ListingDetail) => {
  const items: { label: string; href?: string }[] = [
    { label: 'Home', href: '/' }
  ];

  const categoryLabel = getCategoryLabel(listing.categorySlug) ?? 'Marketplace';
  if (listing.categorySlug) {
    items.push({ label: categoryLabel, href: `/categories/${listing.categorySlug}` });
  }

  if (listing.brandSlug && listing.brandLabel) {
    items.push({ label: listing.brandLabel, href: `/categories/cars/${listing.brandSlug}` });
  }

  if (listing.brandSlug && listing.modelSlug && listing.modelLabel) {
    items.push({ label: listing.modelLabel, href: `/categories/cars/${listing.brandSlug}/${listing.modelSlug}` });
  }

  items.push({ label: listing.title });

  return items;
};

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = findListing(params.id);

  if (!listing) {
    notFound();
  }

  const relatedListings = listing.relatedListingIds
    .map((relatedId) => listingsData.listings.find((candidate) => candidate.id === relatedId))
    .filter((candidate): candidate is ListingDetail => Boolean(candidate) && candidate.id !== listing.id)
    .slice(0, 4);

  const inspection = listing.inspection;
  const isCertified = Boolean(listing.certified || inspection?.certified);

  const breadcrumbs = buildBreadcrumbs(listing);

  const specs = [
    { label: 'Body type', value: listing.bodyType },
    { label: 'Transmission', value: listing.transmission },
    { label: 'Drivetrain', value: listing.drivetrain },
    { label: 'Fuel type', value: listing.fuelType },
    { label: 'Exterior color', value: listing.exteriorColor },
    { label: 'Interior color', value: listing.interiorColor }
  ].filter((entry) => Boolean(entry.value));

  const conditionDetails = [
    { label: 'Mileage', value: listing.mileageKm ? `${formatSar(listing.mileageKm)} km` : undefined },
    { label: 'Previous owners', value: typeof listing.owners === 'number' ? `${listing.owners}` : undefined },
    { label: 'Accident history', value: formatAccidentHistory(listing.accidentHistory) },
    { label: 'Warranty', value: formatWarranty(listing.warrantyStatus) }
  ].filter((entry) => Boolean(entry.value));

  return (
    <div className="space-y-8">
      <ListingAnalytics
        event="listing_view"
        payload={{
          listingId: listing.id,
          certified: isCertified,
          brand: listing.brandSlug,
          model: listing.modelSlug
        }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbs.map((item, index) => (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-400">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-brand-primary">
                  {item.label}
                </Link>
              ) : (
                <span className="text-slate-600">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-6">
          <header className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-wide text-slate-500">
                  {listing.brandLabel} · {listing.modelLabel} · {listing.year}
                </p>
                <h1 className="text-3xl font-bold text-brand-primary">{listing.title}</h1>
              </div>
              <div className="text-right">
                <div className="text-sm text-slate-500">Starting bid</div>
                <div className="text-2xl font-semibold text-brand-primary">SAR {formatSar(listing.priceSar)}</div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 font-semibold ${conditionBadgeStyles(listing.condition)}`}>
                <span aria-hidden>{conditionIcon(listing.condition)}</span>
                <span className="uppercase">{listing.condition}</span>
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">{listing.city}</span>
              {listing.trimLabel && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">Trim: {listing.trimLabel}</span>
              )}
              {isCertified && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">Mazad Certified</span>
              )}
            </div>
          </header>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-primary">Photo gallery</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {listing.photos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex h-48 flex-col justify-between rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600"
                >
                  <span className="font-medium text-slate-700">{photo.caption}</span>
                  <span className="text-xs uppercase tracking-wide text-slate-400">Image placeholder</span>
                </div>
              ))}
            </div>
          </section>
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-brand-primary">Vehicle overview</h2>
            <p className="text-sm text-slate-600">{listing.description}</p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Key specifications</h3>
                <dl className="space-y-2 text-sm text-slate-600">
                  {specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between gap-4">
                      <dt className="font-medium">{spec.label}</dt>
                      <dd>{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Condition & history</h3>
                <dl className="space-y-2 text-sm text-slate-600">
                  {conditionDetails.map((detail) => (
                    <div key={detail.label} className="flex justify-between gap-4">
                      <dt className="font-medium">{detail.label}</dt>
                      <dd className="text-right">{detail.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
            {listing.features.length > 0 && (
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Highlights</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {listing.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </section>
          {inspection && (
            <section className="space-y-4 rounded-lg border border-brand-accent bg-orange-50 p-6 text-sm text-brand-primary">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">Inspection & certification</h2>
                {inspection.certified ? (
                  <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-brand-primary">
                    Certified on {inspection.inspectionDate}
                  </span>
                ) : (
                  <span className="rounded-full bg-white px-3 py-1 text-sm text-brand-primary">
                    Eligible for Mazad Certified program
                  </span>
                )}
              </div>
              <p className="text-brand-primary/80">{inspection.summary}</p>
              {inspection.inspector && (
                <div className="text-xs uppercase tracking-wide text-brand-primary/70">
                  Inspector: {inspection.inspector}
                </div>
              )}
              {inspection.checklist.length > 0 && (
                <ul className="mt-3 grid gap-2 md:grid-cols-2">
                  {inspection.checklist.map((item) => (
                    <li key={item.item} className="rounded bg-white px-3 py-2 text-brand-primary">
                      <span className="font-semibold">{item.item}</span>
                      <span className="ml-2 text-xs uppercase">{item.status}</span>
                      {item.notes && <span className="block text-xs text-brand-primary/70">{item.notes}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
          {relatedListings.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-brand-primary">Related listings</h2>
                <Link href={`/categories/cars/${listing.brandSlug ?? 'cars'}`} className="text-sm text-brand-accent">
                  View more {listing.brandLabel} vehicles
                </Link>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedListings.map((related) => (
                  <ListingCard key={related.id} listing={related} />
                ))}
              </div>
            </section>
          )}
        </section>
        <aside className="space-y-6">
          <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div>
              <h2 className="text-lg font-semibold text-brand-primary">Bid summary</h2>
              <p className="text-sm text-slate-500">Transparent pricing powered by Mazad.com auction rules.</p>
            </div>
            <dl className="space-y-2 text-sm text-slate-600">
              <div className="flex justify-between">
                <dt>Current ask</dt>
                <dd className="font-semibold text-brand-primary">SAR {formatSar(listing.priceSar)}</dd>
              </div>
              {listing.mileageKm && (
                <div className="flex justify-between">
                  <dt>Mileage</dt>
                  <dd>{formatSar(listing.mileageKm)} km</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt>Location</dt>
                <dd>{listing.city}</dd>
              </div>
            </dl>
            <div className="space-y-2 text-sm">
              <button
                type="button"
                className="w-full rounded bg-brand-accent px-4 py-2 font-semibold text-white shadow-sm"
              >
                Place a bid (prototype)
              </button>
              <button
                type="button"
                className="w-full rounded border border-brand-accent px-4 py-2 font-semibold text-brand-accent"
              >
                Follow listing
              </button>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-primary">Seller information</h2>
            <div className="rounded border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-brand-primary">{listing.seller.name}</span>
                {listing.seller.verified && (
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Verified</span>
                )}
              </div>
              <ul className="mt-3 space-y-2">
                <li>Rating: {listing.seller.rating.toFixed(1)} / 5</li>
                <li>Total sales: {listing.seller.totalSales}</li>
                <li>Response time: {listing.seller.responseTime}</li>
              </ul>
            </div>
          </div>
          <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-brand-primary">Next steps</h2>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>• Schedule a viewing or remote video inspection.</li>
              <li>• Request detailed inspection PDF from seller.</li>
              <li>• Explore financing & insurance options (coming soon).</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
