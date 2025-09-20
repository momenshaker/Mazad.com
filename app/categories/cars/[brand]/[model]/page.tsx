import { notFound } from 'next/navigation';
import vehiclesJson from '@/data/vehicles/vehicles.json';
import filtersJson from '@/data/filters.json';
import type { VehiclesData, FiltersData } from '@/app/types';
import FilterPanel from '@/app/components/FilterPanel';

const vehiclesData = vehiclesJson as VehiclesData;
const filtersData = filtersJson as FiltersData;

const findModel = (brandSlug: string, modelSlug: string) => {
  const brand = vehiclesData.brands.find((entry) => entry.brand === brandSlug);
  if (!brand) {
    return undefined;
  }
  const model = brand.models.find((entry) => entry.model === modelSlug);
  if (!model) {
    return undefined;
  }
  return { brand, model };
};

export default function VehicleModelPage({ params }: { params: { brand: string; model: string } }) {
  const lookup = findModel(params.brand, params.model);

  if (!lookup) {
    notFound();
  }

  const { brand, model } = lookup;
  const vehicleFilters = filtersData.filters['vehicles'] ?? [];

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
      <section className="space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-wide text-slate-500">{brand.label}</p>
          <h1 className="text-3xl font-bold text-brand-primary">{model.label}</h1>
          <p className="text-slate-600">
            {model.bodyType} · {model.year_min} – {model.year_max}
          </p>
        </header>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-brand-primary">Available trims</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {model.trims.map((trim) => (
              <article key={trim.trim} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-brand-primary">{trim.label}</h3>
                <ul className="mt-2 space-y-1 text-sm text-slate-600">
                  {trim.engine && <li>Engine: {trim.engine}</li>}
                  {trim.drivetrain && <li>Drivetrain: {trim.drivetrain}</li>}
                  {trim.transmission && <li>Transmission: {trim.transmission}</li>}
                  {trim.fuel && <li>Fuel: {trim.fuel}</li>}
                  <li>Years: {trim.years.join(', ')}</li>
                </ul>
              </article>
            ))}
          </div>
        </div>
        <div className="space-y-2 rounded-lg border border-dashed border-brand-accent bg-orange-50 p-5 text-sm text-brand-primary">
          <h2 className="text-lg font-semibold">Used vehicle disclosure checklist</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {model.condition.usedOnlyAttributes.map((attribute) => (
              <li key={attribute.key}>{attribute.label}</li>
            ))}
          </ul>
        </div>
      </section>
      <FilterPanel title="Vehicle filters" filters={vehicleFilters} />
    </div>
  );
}
