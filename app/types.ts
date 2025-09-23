export type CategoryNode = {
  slug: string;
  label: string;
  description?: string;
  icon?: string;
  featuredFilters?: string[];
  children?: CategoryNode[];
};

export type CategoriesData = {
  version: string;
  categories: CategoryNode[];
};

export type FilterOption = string | { value: string; label: string };

export type CategoryFilter = {
  key: string;
  type: 'select' | 'range' | 'segmented' | 'number' | 'date' | 'text';
  options?: FilterOption[];
  source?: string;
  dependsOn?: string;
  min?: number;
  max?: number;
  unit?: string;
  default?: string | number;
  visibleWhen?: Record<string, string | number | boolean>;
};

export type FiltersData = {
  version: string;
  filters: Record<string, CategoryFilter[]>;
};

export type VehicleTrim = {
  trim: string;
  label: string;
  engine?: string;
  drivetrain?: string;
  transmission?: string;
  fuel?: string;
  years: number[];
};

export type VehicleCondition = {
  options: string[];
  usedOnlyAttributes: { key: string; label: string }[];
};

export type VehicleModel = {
  model: string;
  label: string;
  bodyType: string;
  year_min: number;
  year_max: number;
  trims: VehicleTrim[];
  condition: VehicleCondition;
};

export type VehicleBrand = {
  brand: string;
  label: string;
  origin: string;
  popularInKsa: boolean;
  models: VehicleModel[];
};

export type VehiclesData = {
  version: string;
  generatedAt: string;
  brands: VehicleBrand[];
};

export type ListingSummary = {
  id: string;
  title: string;
  priceSar: number;
  city: string;
  citySlug?: string;
  condition: 'new' | 'used';
  mileageKm?: number;
  certified?: boolean;
  imageUrl?: string;
  categorySlug?: string;
  subcategorySlug?: string;
  brandSlug?: string;
  brandLabel?: string;
  modelSlug?: string;
  modelLabel?: string;
  year?: number;
  trim?: string;
  trimLabel?: string;
  owners?: number;
  accidentHistory?: string;
  warrantyStatus?: string;
};

export type ListingMedia = {
  id: string;
  caption: string;
  url?: string;
};

export type ListingInspectionChecklistItem = {
  item: string;
  status: 'pass' | 'attention' | 'fail';
  notes?: string;
};

export type ListingInspection = {
  certified: boolean;
  inspectionDate?: string;
  inspector?: string;
  summary: string;
  checklist: ListingInspectionChecklistItem[];
};

export type ListingSeller = {
  name: string;
  rating: number;
  totalSales: number;
  responseTime: string;
  verified: boolean;
};

export type ListingDetail = ListingSummary & {
  description: string;
  bodyType?: string;
  transmission?: string;
  drivetrain?: string;
  fuelType?: string;
  exteriorColor?: string;
  interiorColor?: string;
  features: string[];
  photos: ListingMedia[];
  inspection?: ListingInspection;
  seller: ListingSeller;
  relatedListingIds: string[];
};

export type ListingsData = {
  version: string;
  listings: ListingDetail[];
};
