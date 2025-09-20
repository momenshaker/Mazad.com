import Link from 'next/link';
import type { CategoryNode } from '../types';

type CategoryMenuProps = {
  categories: CategoryNode[];
};

const buildHref = (slug: string, parentSlug?: string) => {
  if (slug === 'cars') {
    return '/categories/cars';
  }
  if (parentSlug) {
    return `/categories/${parentSlug}?focus=${slug}`;
  }
  return `/categories/${slug}`;
};

const CategoryMenu = ({ categories }: CategoryMenuProps) => (
  <nav aria-label="Category menu" className="rounded-lg bg-white p-4 shadow-sm">
    <ul className="grid gap-4 md:grid-cols-3">
      {categories.map((category) => (
        <li key={category.slug} className="rounded border border-slate-200 p-4">
          <h3 className="text-lg font-semibold text-brand-primary">{category.label}</h3>
          {category.description && (
            <p className="mt-2 text-sm text-slate-600">{category.description}</p>
          )}
          <Link
            href={buildHref(category.slug)}
            className="mt-4 inline-block rounded bg-brand-accent px-3 py-1 text-sm font-medium text-white"
          >
            Browse
          </Link>
          {category.children && category.children.length > 0 && (
            <details className="mt-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700">
                Subcategories
              </summary>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                {category.children.map((child) => (
                  <li key={child.slug}>
                    <Link href={buildHref(child.slug, category.slug)} className="hover:underline">
                      {child.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </li>
      ))}
    </ul>
  </nav>
);

export default CategoryMenu;
