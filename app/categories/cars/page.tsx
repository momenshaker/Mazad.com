import Link from 'next/link';
import vehiclesJson from '@/data/vehicles/vehicles.json';
import type { VehiclesData } from '@/app/types';

const vehiclesData = vehiclesJson as VehiclesData;

export default function CarsCategoryPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-brand-primary">Cars marketplace</h1>
        <p className="text-slate-600">
          Drill into brand → model → trim flows powered by Mazad.com\'s vehicles taxonomy and condition schema.
        </p>
      </header>
      <div className="grid gap-6 md:grid-cols-3">
        {vehiclesData.brands.map((brand) => (
          <article key={brand.brand} className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-brand-primary">{brand.label}</h2>
              <p className="text-sm text-slate-600">Origin: {brand.origin}</p>
              {brand.popularInKsa && <span className="text-xs font-semibold uppercase text-brand-accent">Top in KSA</span>}
            </div>
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              {brand.models.slice(0, 3).map((model) => (
                <li key={model.model}>{model.label}</li>
              ))}
            </ul>
            <div className="mt-auto pt-4">
              <Link
                href={`/categories/cars/${brand.brand}`}
                className="inline-flex w-full justify-center rounded bg-brand-accent px-3 py-2 text-sm font-semibold text-white"
              >
                View models
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
