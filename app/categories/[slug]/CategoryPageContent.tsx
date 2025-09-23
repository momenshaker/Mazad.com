'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import FilterPanel, { type FilterState } from '@/app/components/FilterPanel';
import ListingCard from '@/app/components/ListingCard';
import type { CategoryFilter, CategoryNode, FilterOption, ListingSummary } from '@/app/types';
import { trackEvent } from '@/app/lib/analytics';

type CategoryPageContentProps = {
  category: CategoryNode;
  filters: CategoryFilter[];
  subcategories: CategoryNode[];
  listings: ListingSummary[];
  focusSlug?: string;
  focusedSubcategory?: CategoryNode;
};

const parseNumber = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const areStatesEqual = (a: FilterState, b: FilterState) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const key of keys) {
    if (a[key] !== b[key]) {
      return false;
    }
  }
  return true;
};

const matchesListingFilters = (listing: ListingSummary, state: FilterState) => {
  if (state.condition && listing.condition !== state.condition) {
    return false;
  }

  if (state.brand && listing.brandSlug) {
    if (listing.brandSlug !== state.brand) {
      return false;
    }
  } else if (state.brand) {
    return false;
  }

  if (state.model && listing.modelSlug) {
    if (listing.modelSlug !== state.model) {
      return false;
    }
  } else if (state.model) {
    return false;
  }

  if (state.trim && listing.trim) {
    if (listing.trim !== state.trim) {
      return false;
    }
  } else if (state.trim) {
    return false;
  }

  if (state.city && listing.citySlug) {
    if (listing.citySlug !== state.city) {
      return false;
    }
  } else if (state.city) {
    return false;
  }

  if (state.accident_history) {
    if (!listing.accidentHistory || listing.accidentHistory !== state.accident_history) {
      return false;
    }
  }

  if (state.warranty_status) {
    if (!listing.warrantyStatus || listing.warrantyStatus !== state.warranty_status) {
      return false;
    }
  }

  const yearMin = parseNumber(state.year_min);
  if (yearMin !== undefined) {
    if (!listing.year || listing.year < yearMin) {
      return false;
    }
  }

  const yearMax = parseNumber(state.year_max);
  if (yearMax !== undefined) {
    if (!listing.year || listing.year > yearMax) {
      return false;
    }
  }

  const mileageMin = parseNumber(state.mileage_min);
  if (mileageMin !== undefined) {
    if (listing.mileageKm === undefined || listing.mileageKm < mileageMin) {
      return false;
    }
  }

  const mileageMax = parseNumber(state.mileage_max);
  if (mileageMax !== undefined) {
    if (listing.mileageKm === undefined || listing.mileageKm > mileageMax) {
      return false;
    }
  }

  const owners = parseNumber(state.owners);
  if (owners !== undefined) {
    if (listing.owners === undefined || listing.owners > owners) {
      return false;
    }
  }

  return true;
};

const normalizeOption = (option: FilterOption) =>
  typeof option === 'string' ? { value: option, label: option } : option;

const describeFilterValue = (
  key: string,
  value: string,
  filtersByKey: Map<string, CategoryFilter>
) => {
  const rangeMatch = key.match(/(.+)_(min|max)$/);
  const lookupKey = rangeMatch ? rangeMatch[1] : key;
  const filter = filtersByKey.get(lookupKey);
  const label = filter ? filter.key.replace(/_/g, ' ') : lookupKey.replace(/_/g, ' ');

  if (rangeMatch) {
    const suffix = rangeMatch[2] === 'min' ? '≥' : '≤';
    return `${label} ${suffix} ${value}`;
  }

  if (filter?.options) {
    const normalizedOptions = filter.options.map(normalizeOption);
    const match = normalizedOptions.find((option) => option.value === value);
    if (match) {
      return `${label}: ${match.label}`;
    }
  }

  return `${label}: ${value.replace(/_/g, ' ')}`;
};

const CategoryPageContent = ({
  category,
  filters,
  subcategories,
  listings,
  focusSlug,
  focusedSubcategory
}: CategoryPageContentProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filterKeys = useMemo(() => {
    const keys = new Set<string>();
    filters.forEach((filter) => {
      keys.add(filter.key);
      if (filter.type === 'range') {
        keys.add(`${filter.key}_min`);
        keys.add(`${filter.key}_max`);
      }
    });
    return keys;
  }, [filters]);

  const filterDefaults = useMemo(() => {
    const defaults: FilterState = {};
    filters.forEach((filter) => {
      if (filter.default !== undefined && filter.default !== null) {
        defaults[filter.key] = String(filter.default);
      }
    });
    return defaults;
  }, [filters]);

  const initialFromParams = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    const state: FilterState = {};
    filterKeys.forEach((key) => {
      const value = params.get(key);
      if (value) {
        state[key] = value;
      }
    });
    return state;
  }, [filterKeys, searchParams]);

  const initialFilterState = useMemo(
    () => ({ ...filterDefaults, ...initialFromParams }),
    [filterDefaults, initialFromParams]
  );

  const [filterState, setFilterState] = useState<FilterState>(initialFilterState);

  useEffect(() => {
    setFilterState((prev) => (areStatesEqual(prev, initialFilterState) ? prev : initialFilterState));
  }, [initialFilterState]);

  const filtersByKey = useMemo(() => {
    const map = new Map<string, CategoryFilter>();
    filters.forEach((filter) => {
      map.set(filter.key, filter);
    });
    return map;
  }, [filters]);

  const handleFilterStateChange = useCallback(
    (next: FilterState) => {
      setFilterState(next);
      const params = new URLSearchParams(searchParams.toString());
      filterKeys.forEach((key) => {
        params.delete(key);
      });
      Object.entries(next).forEach(([key, value]) => {
        if (value) {
          params.set(key, value);
        }
      });
      const queryString = params.toString();
      const target = queryString ? `${pathname}?${queryString}` : pathname;
      router.replace(target, { scroll: false });
    },
    [filterKeys, pathname, router, searchParams]
  );

  const filteredListings = useMemo(
    () => listings.filter((listing) => matchesListingFilters(listing, filterState)),
    [listings, filterState]
  );

  const activeFilters = useMemo(
    () => Object.entries(filterState).filter(([, value]) => value && value.length > 0),
    [filterState]
  );

  const breadcrumbItems = useMemo(() => {
    const items = [
      { label: 'Home', href: '/' },
      { label: 'Categories', href: '/categories' },
      { label: category.label, href: `/categories/${category.slug}` }
    ];
    if (focusedSubcategory) {
      items.push({
        label: focusedSubcategory.label,
        href: `/categories/${category.slug}?focus=${focusedSubcategory.slug}`
      });
    }
    return items;
  }, [category.label, category.slug, focusedSubcategory]);

  const activeFocus = searchParams.get('focus') ?? focusSlug ?? undefined;

  useEffect(() => {
    trackEvent('category_view', {
      categorySlug: category.slug,
      focusSlug: activeFocus ?? null
    });
  }, [activeFocus, category.slug]);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
        <ol className="flex flex-wrap items-center gap-2">
          {breadcrumbItems.map((item, index) => (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && <span className="text-slate-400">/</span>}
              <Link href={item.href} className="hover:text-brand-primary">
                {item.label}
              </Link>
            </li>
          ))}
        </ol>
      </nav>
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
                      child.slug === activeFocus
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
          <div className="space-y-3">
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-semibold text-brand-primary">Listings</h2>
              <p className="text-sm text-slate-500">
                Showing {filteredListings.length} of {listings.length} results
              </p>
            </div>
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 text-xs">
                {activeFilters.map(([key, value]) => (
                  <span
                    key={`${key}-${value}`}
                    className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-600"
                  >
                    {describeFilterValue(key, value, filtersByKey)}
                  </span>
                ))}
              </div>
            )}
            {filteredListings.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
                No mock listings match the selected filters yet. Adjust your filters to explore other results.
              </div>
            )}
          </div>
        </section>
        <FilterPanel title="Filter" filters={filters} initialState={filterState} onStateChange={handleFilterStateChange} />
      </div>
    </div>
  );
};

export default CategoryPageContent;
