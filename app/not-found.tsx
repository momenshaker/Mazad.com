import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <h1 className="text-3xl font-bold text-brand-primary">Page not found</h1>
      <p className="text-slate-600">
        We couldn\'t find the taxonomy node you were looking for. Review the category tree or return home to continue browsing.
      </p>
      <div className="flex justify-center gap-3">
        <Link href="/" className="rounded bg-brand-accent px-4 py-2 text-sm font-semibold text-white">
          Back to home
        </Link>
        <Link href="/categories" className="rounded border border-brand-accent px-4 py-2 text-sm font-semibold text-brand-accent">
          View categories
        </Link>
      </div>
    </div>
  );
}
