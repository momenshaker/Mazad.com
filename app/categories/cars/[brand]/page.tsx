import { notFound } from 'next/navigation';
import Link from 'next/link';
import vehiclesJson from '@/data/vehicles/vehicles.json';
import type { VehiclesData } from '@/app/types';

const vehiclesData = vehiclesJson as VehiclesData;

const findBrand = (brandSlug: string) =>
  vehiclesData.brands.find((brand) => brand.brand === brandSlug);

export default function BrandPage({ params }: { params: { brand: string } }) {
  const brand = findBrand(params.brand);

  if (!brand) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-brand-primary">{brand.label} models</h1>
        <p className="text-slate-600">Origin: {brand.origin} · Popular in KSA: {brand.popularInKsa ? 'Yes' : 'No'}</p>
      </header>
      <div className="grid gap-6 md:grid-cols-2">
        {brand.models.map((model) => (
          <article key={model.model} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-brand-primary">{model.label}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {model.bodyType} · {model.year_min} – {model.year_max}
            </p>
            <div className="mt-3 text-xs text-slate-500">
              Condition options: {model.condition.options.join(', ')}
            </div>
            <ul className="mt-4 space-y-1 text-sm text-slate-600">
              {model.trims.slice(0, 3).map((trim) => (
                <li key={trim.trim}>{trim.label}</li>
              ))}
            </ul>
            <Link
              href={`/categories/cars/${brand.brand}/${model.model}`}
              className="mt-4 inline-flex w-full justify-center rounded bg-brand-accent px-3 py-2 text-sm font-semibold text-white"
            >
              View trims
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
