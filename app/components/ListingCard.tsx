import Image from 'next/image';
import Link from 'next/link';
import type { ListingSummary } from '../types';

type ListingCardProps = {
  listing: ListingSummary;
};

const formatPrice = (value: number) => new Intl.NumberFormat('en-SA').format(value);

const ListingCard = ({ listing }: ListingCardProps) => (
  <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div className="relative aspect-video w-full bg-slate-100">
      {listing.imageUrl ? (
        <Image src={listing.imageUrl} alt={listing.title} fill className="object-cover" />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-slate-400">Image coming soon</div>
      )}
    </div>
    <div className="flex flex-1 flex-col gap-3 p-4">
      <header className="space-y-1">
        <h3 className="text-base font-semibold text-brand-primary">{listing.title}</h3>
        {(listing.brandLabel || listing.modelLabel || listing.year) && (
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {[listing.brandLabel, listing.modelLabel, listing.year].filter(Boolean).join(' · ')}
          </p>
        )}
        <p className="text-sm text-slate-500">
          SAR {formatPrice(listing.priceSar)} · {listing.city}
        </p>
      </header>
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="rounded bg-slate-100 px-2 py-1 font-medium uppercase text-slate-600">
          {listing.condition}
        </span>
        {listing.mileageKm && (
          <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">
            {formatPrice(listing.mileageKm)} km
          </span>
        )}
        {listing.certified && (
          <span className="rounded bg-green-100 px-2 py-1 font-semibold text-green-700">Mazad Certified</span>
        )}
        {listing.warrantyStatus && (
          <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">
            Warranty: {listing.warrantyStatus}
          </span>
        )}
        {typeof listing.owners === 'number' && listing.condition === 'used' && (
          <span className="rounded bg-slate-100 px-2 py-1 text-slate-600">{listing.owners} owner(s)</span>
        )}
      </div>
      <div className="mt-auto">
        <Link
          href={`/listings/${listing.id}`}
          className="inline-flex w-full justify-center rounded bg-brand-accent px-3 py-2 text-sm font-semibold text-white"
        >
          View details
        </Link>
      </div>
    </div>
  </article>
);

export default ListingCard;
