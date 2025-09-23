import { notFound } from 'next/navigation';
import categoriesJson from '@/data/categories.json';
import filtersJson from '@/data/filters.json';
import listingsJson from '@/data/listings.json';
import type { CategoriesData, FiltersData, ListingsData } from '@/app/types';
import CategoryPageContent from './CategoryPageContent';

const categoriesData = categoriesJson as CategoriesData;
const filtersData = filtersJson as FiltersData;
const listingsData = listingsJson as ListingsData;

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
  const categoryListings = listingsData.listings.filter((listing) => listing.categorySlug === category.slug);

  return (
    <CategoryPageContent
      category={category}
      filters={categoryFilters}
      subcategories={subcategories}
      listings={categoryListings}
      focusSlug={focusSlug}
      focusedSubcategory={focusedSubcategory}
    />
  );
}
