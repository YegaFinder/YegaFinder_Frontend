export interface Category {
  id: string;
  name: string;
}

/** Item shape returned by GET /businesses (list/discovery feed) */
export interface BusinessListItem {
  id: string;
  name: string;
  category: string; // plain category NAME here — differs from detail's Category object
  logoUrl: string | null;
  bannerUrl: string | null;
  rating: number;
  address: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  website: string | null;
  address: string;
}

// businessHours item shape isn't documented yet — ask backend for the exact fields
export type BusinessHourEntry = unknown;

/** Full shape returned by GET /businesses/:id */
export interface BusinessDetail {
  id: string;
  name: string;
  description: string;
  category: Category;
  subcategories: Category[];
  contactInfo: ContactInfo;
  businessHours: BusinessHourEntry[];
  gallery: string[];
  rating: number;
}
