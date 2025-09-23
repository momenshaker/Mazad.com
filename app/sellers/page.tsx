'use client';

import { FormEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import vehiclesJson from '@/data/vehicles/vehicles.json';
import listingsJson from '@/data/listings.json';
import type { VehiclesData, ListingsData, VehicleBrand, VehicleModel } from '@/app/types';

const vehiclesData = vehiclesJson as VehiclesData;
const listingsData = listingsJson as ListingsData;

const registrationDefaults = {
  businessName: '',
  crNumber: '',
  city: '',
  email: '',
  phone: '',
  verificationMethod: 'upload' as 'upload' | 'code',
  verificationCode: '',
  licenseFileName: ''
};

type RegistrationState = typeof registrationDefaults;

type ListingFormState = {
  brandSlug: string;
  modelSlug: string;
  year: string;
  trim: string;
  condition: 'new' | 'used';
  mileage: string;
  priceSar: string;
  inspectionReady: boolean;
  photoCount: number;
  inspectionDocument: boolean;
};

type ListingStatus = 'Active' | 'Paused' | 'Sold' | 'Pending Review';

type ManagedListing = {
  id: string;
  title: string;
  status: ListingStatus;
  watchers: number;
  lastUpdated: string;
};

type AuditEntry = {
  id: string;
  title: string;
  status: ListingStatus;
  note: string;
  timestamp: string;
};

const formatDateTime = (iso: string) => new Date(iso).toLocaleString('en-SA');

const SellerPage = () => {
  const [registration, setRegistration] = useState<RegistrationState>(registrationDefaults);
  const [registrationStatus, setRegistrationStatus] = useState<'draft' | 'submitted'>('draft');
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);

  const [listingForm, setListingForm] = useState<ListingFormState>({
    brandSlug: '',
    modelSlug: '',
    year: '',
    trim: '',
    condition: 'used',
    mileage: '',
    priceSar: '',
    inspectionReady: true,
    photoCount: 6,
    inspectionDocument: true
  });
  const [listingSubmissionSummary, setListingSubmissionSummary] = useState<ListingFormState | null>(null);

  const eliteListings = useMemo(
    () =>
      listingsData.listings
        .filter((listing) => listing.seller.name === 'Elite Motors KSA')
        .slice(0, 3)
        .map<ManagedListing>((listing, index) => ({
          id: listing.id,
          title: listing.title,
          status: 'Active',
          watchers: 42 - index * 7,
          lastUpdated: new Date().toISOString()
        })),
    []
  );

  const [managedListings, setManagedListings] = useState<ManagedListing[]>(eliteListings);
  const [auditTrail, setAuditTrail] = useState<AuditEntry[]>([]);

  const handleRegistrationChange = (field: keyof RegistrationState, value: string) => {
    setRegistration((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegistrationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRegistrationStatus('submitted');
    setRegistrationMessage(
      'Verification workflow triggered. Expect email confirmation within 1 business day while dashboard shows Pending Verification.'
    );
  };

  const selectedBrand: VehicleBrand | undefined = useMemo(
    () => vehiclesData.brands.find((brand) => brand.brand === listingForm.brandSlug),
    [listingForm.brandSlug]
  );

  const modelsForBrand: VehicleModel[] = useMemo(
    () => selectedBrand?.models ?? [],
    [selectedBrand]
  );

  const selectedModel: VehicleModel | undefined = useMemo(
    () => modelsForBrand.find((model) => model.model === listingForm.modelSlug),
    [listingForm.modelSlug, modelsForBrand]
  );

  const trimsForModel = selectedModel?.trims ?? [];
  const yearsForModel = selectedModel
    ? Array.from({ length: selectedModel.year_max - selectedModel.year_min + 1 }, (_, index) => (
        selectedModel.year_min + index
      )).reverse()
    : [];

  const handleListingChange = (field: keyof ListingFormState, value: string | number | boolean) => {
    setListingForm((prev) => {
      const next = { ...prev };
      if (field === 'brandSlug') {
        next.brandSlug = value as string;
        next.modelSlug = '';
        next.trim = '';
        next.year = '';
      } else if (field === 'modelSlug') {
        next.modelSlug = value as string;
        next.trim = '';
        next.year = '';
      } else if (field === 'trim') {
        next.trim = value as string;
      } else if (field === 'condition') {
        next.condition = value as 'new' | 'used';
        if (next.condition === 'new') {
          next.mileage = '0';
        }
      } else if (field === 'inspectionReady') {
        next.inspectionReady = value as boolean;
      } else if (field === 'inspectionDocument') {
        next.inspectionDocument = value as boolean;
      } else if (field === 'photoCount') {
        next.photoCount = Number(value);
      } else if (field === 'mileage') {
        next.mileage = value as string;
      } else if (field === 'priceSar') {
        next.priceSar = value as string;
      } else if (field === 'year') {
        next.year = value as string;
      }
      return next;
    });
  };

  const handleListingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setListingSubmissionSummary(listingForm);
    const listingTitle = `${selectedBrand?.label ?? 'Vehicle'} ${selectedModel?.label ?? ''} ${listingForm.year}`.trim();
    const draftId = `draft-${Date.now()}`;
    setManagedListings((prev) => [
      {
        id: draftId,
        title: listingTitle,
        status: 'Pending Review',
        watchers: 0,
        lastUpdated: new Date().toISOString()
      },
      ...prev
    ]);
    setAuditTrail((prev) => [
      {
        id: draftId,
        title: listingTitle,
        status: 'Pending Review',
        note: 'Listing entered moderation queue with 24h SLA.',
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const handleStatusChange = (id: string, status: ListingStatus) => {
    const note =
      status === 'Paused'
        ? 'Followers will be notified that the listing is paused.'
        : status === 'Sold'
        ? 'Followers notified of sale and listing archived.'
        : status === 'Active'
        ? 'Listing reactivated and sent for moderation review.'
        : 'Listing awaiting moderation.';

    let listingTitle = 'Listing';
    setManagedListings((prev) =>
      prev.map((entry) => {
        if (entry.id === id) {
          listingTitle = entry.title;
          return {
            ...entry,
            status,
            lastUpdated: new Date().toISOString()
          };
        }
        return entry;
      })
    );
    setAuditTrail((prev) => [
      {
        id,
        title: listingTitle,
        status,
        note,
        timestamp: new Date().toISOString()
      },
      ...prev
    ]);
  };

  return (
    <div className="space-y-8">
      <header className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Seller workspace</p>
            <h1 className="text-3xl font-bold text-brand-primary">Mazad.com seller onboarding</h1>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              registrationStatus === 'submitted'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {registrationStatus === 'submitted' ? 'Pending Verification' : 'Complete your profile'}
          </span>
        </div>
        <p className="text-sm text-slate-600">
          Register your business, publish high-quality vehicle listings, and manage inventory updates with moderation-friendly workflows.
        </p>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span>• Business verification within 1 business day</span>
          <span>• Vehicles taxonomy integrated into listing flow</span>
          <span>• Status changes notify followers automatically</span>
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[3fr,2fr]">
        <form onSubmit={handleRegistrationSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-brand-primary">1. Register as a seller</h2>
              <p className="text-sm text-slate-600">Capture business credentials to activate your seller dashboard.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Phase: MVP1</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Business name</span>
              <input
                required
                value={registration.businessName}
                onChange={(event) => handleRegistrationChange('businessName', event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="Elite Motors KSA"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Commercial registration #</span>
              <input
                required
                value={registration.crNumber}
                onChange={(event) => handleRegistrationChange('crNumber', event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="1010XXXXXX"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">City</span>
              <input
                required
                value={registration.city}
                onChange={(event) => handleRegistrationChange('city', event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="Riyadh"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Primary contact email</span>
              <input
                required
                type="email"
                value={registration.email}
                onChange={(event) => handleRegistrationChange('email', event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="sales@elitemotors.sa"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Phone</span>
              <input
                required
                value={registration.phone}
                onChange={(event) => handleRegistrationChange('phone', event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="+9665XXXXXXX"
              />
            </label>
            <label className="text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Verification method</span>
              <select
                value={registration.verificationMethod}
                onChange={(event) => handleRegistrationChange('verificationMethod', event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              >
                <option value="upload">Upload trade license</option>
                <option value="code">Enter verification code</option>
              </select>
            </label>
          </div>
          {registration.verificationMethod === 'upload' ? (
            <label className="text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Trade license</span>
              <input
                type="file"
                onChange={(event) =>
                  handleRegistrationChange('licenseFileName', event.target.files?.[0]?.name ?? '')
                }
                className="mt-1 w-full text-sm"
              />
              {registration.licenseFileName && (
                <span className="mt-1 block text-xs text-slate-500">Uploaded: {registration.licenseFileName}</span>
              )}
            </label>
          ) : (
            <label className="text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Verification code</span>
              <input
                required
                value={registration.verificationCode}
                onChange={(event) => handleRegistrationChange('verificationCode', event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="Enter code"
              />
            </label>
          )}
          <button type="submit" className="w-full rounded bg-brand-accent px-4 py-2 text-sm font-semibold text-white">
            Submit registration
          </button>
          {registrationMessage && (
            <p className="rounded border border-dashed border-brand-accent bg-orange-50 p-3 text-xs text-brand-primary">
              {registrationMessage}
            </p>
          )}
        </form>
        <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-brand-primary">Verification checklist</h3>
          <ul className="list-disc space-y-2 pl-5 text-sm text-slate-600">
            <li>Upload trade license or enter Mazad verification code.</li>
            <li>Confirm business contact information for compliance outreach.</li>
            <li>Approval emails sent within 24 hours – dashboard reflects Pending Verification until completed.</li>
          </ul>
          <div className="rounded border border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
            Once approved, your seller dashboard unlocks listing analytics, certification requests, and payout settings.
          </div>
        </div>
      </section>

      <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-brand-primary">2. Create a vehicle listing</h2>
            <p className="text-sm text-slate-600">Use Mazad.com taxonomy to ensure consistent brand → model → trim flows.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Phase: MVP1</span>
        </div>
        <form onSubmit={handleListingSubmit} className="grid gap-4 md:grid-cols-2">
          <label className="text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Brand</span>
            <select
              required
              value={listingForm.brandSlug}
              onChange={(event) => handleListingChange('brandSlug', event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            >
              <option value="">Select brand</option>
              {vehiclesData.brands.map((brand) => (
                <option key={brand.brand} value={brand.brand}>
                  {brand.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Model</span>
            <select
              required
              value={listingForm.modelSlug}
              onChange={(event) => handleListingChange('modelSlug', event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              disabled={!listingForm.brandSlug}
            >
              <option value="">Select model</option>
              {modelsForBrand.map((model) => (
                <option key={model.model} value={model.model}>
                  {model.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Model year</span>
            <select
              required
              value={listingForm.year}
              onChange={(event) => handleListingChange('year', event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              disabled={!listingForm.modelSlug}
            >
              <option value="">Select year</option>
              {yearsForModel.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Trim</span>
            <select
              required
              value={listingForm.trim}
              onChange={(event) => handleListingChange('trim', event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              disabled={!listingForm.modelSlug}
            >
              <option value="">Select trim</option>
              {trimsForModel.map((trim) => (
                <option key={trim.trim} value={trim.trim}>
                  {trim.label}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Condition</span>
            <div className="mt-2 flex gap-3">
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="radio"
                  name="condition"
                  value="new"
                  checked={listingForm.condition === 'new'}
                  onChange={(event) => handleListingChange('condition', event.target.value)}
                />
                New
              </label>
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="radio"
                  name="condition"
                  value="used"
                  checked={listingForm.condition === 'used'}
                  onChange={(event) => handleListingChange('condition', event.target.value)}
                />
                Used
              </label>
            </div>
          </label>
          {listingForm.condition === 'used' && (
            <label className="text-sm">
              <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Mileage (km)</span>
              <input
                required
                value={listingForm.mileage}
                onChange={(event) => handleListingChange('mileage', event.target.value)}
                className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                placeholder="25000"
              />
            </label>
          )}
          <label className="text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Price expectation (SAR)</span>
            <input
              required
              value={listingForm.priceSar}
              onChange={(event) => handleListingChange('priceSar', event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              placeholder="250000"
            />
          </label>
          <label className="text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Photos ready</span>
            <input
              type="number"
              min={6}
              value={listingForm.photoCount}
              onChange={(event) => handleListingChange('photoCount', event.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
            />
            <span className="mt-1 block text-xs text-slate-500">Upload at least 6 high-resolution photos.</span>
          </label>
          <label className="text-sm">
            <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">Inspection ready?</span>
            <div className="mt-1 flex gap-3 text-xs">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={listingForm.inspectionReady}
                  onChange={(event) => handleListingChange('inspectionReady', event.target.checked)}
                />
                Inspection slot confirmed
              </label>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={listingForm.inspectionDocument}
                  onChange={(event) => handleListingChange('inspectionDocument', event.target.checked)}
                />
                Inspection PDF ready
              </label>
            </div>
          </label>
          <div className="md:col-span-2">
            <button type="submit" className="rounded bg-brand-accent px-4 py-2 text-sm font-semibold text-white">
              Submit listing for moderation
            </button>
          </div>
        </form>
        {listingSubmissionSummary && (
          <div className="rounded border border-dashed border-brand-accent bg-orange-50 p-4 text-sm text-brand-primary">
            <h3 className="text-base font-semibold">Submission queued</h3>
            <p className="mt-1 text-brand-primary/80">
              Brand: {selectedBrand?.label ?? listingSubmissionSummary.brandSlug} · Model: {selectedModel?.label ?? listingSubmissionSummary.modelSlug} · Year: {listingSubmissionSummary.year}
            </p>
            <p className="text-xs">
              Moderation SLA: 24 hours. Critical edits will re-open the review workflow automatically.
            </p>
          </div>
        )}
      </section>

      <section className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-brand-primary">3. Manage listings</h2>
            <p className="text-sm text-slate-600">Update availability, pause sold inventory, and keep buyers informed.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Phase: MVP1</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2">Listing</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Watchers</th>
                <th className="px-3 py-2">Last updated</th>
                <th className="px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-600">
              {managedListings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-3 py-2 font-medium text-brand-primary">{listing.title}</td>
                  <td className="px-3 py-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        listing.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : listing.status === 'Sold'
                          ? 'bg-slate-900 text-white'
                          : listing.status === 'Paused'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">{listing.watchers}</td>
                  <td className="px-3 py-2 text-xs">{formatDateTime(listing.lastUpdated)}</td>
                  <td className="px-3 py-2">
                    <select
                      value={listing.status}
                      onChange={(event) => handleStatusChange(listing.id, event.target.value as ListingStatus)}
                      className="rounded border border-slate-300 px-2 py-1 text-xs"
                    >
                      <option value="Active">Active</option>
                      <option value="Paused">Paused</option>
                      <option value="Sold">Sold</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Audit trail</h3>
            {auditTrail.length === 0 ? (
              <p>No activity logged yet.</p>
            ) : (
              <ul className="space-y-2">
                {auditTrail.slice(0, 6).map((entry) => (
                  <li key={`${entry.id}-${entry.timestamp}`}>
                    <span className="font-semibold text-brand-primary">{entry.title}</span> → {entry.status}{' '}
                    <span className="text-slate-500">({formatDateTime(entry.timestamp)})</span>
                    <div>{entry.note}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-3 rounded border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Operational notes</h3>
            <ul className="space-y-2">
              <li>• Pausing or selling a listing automatically notifies followers via email/SMS.</li>
              <li>• Critical detail edits (price, mileage) re-queue the listing for moderation review.</li>
              <li>
                • Access <Link href="/docs/31-user-stories-seller.md" className="text-brand-accent underline">seller stories</Link> for acceptance criteria references.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellerPage;
