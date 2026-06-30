// SINGLE SOURCE OF TRUTH for all localStorage keys + schema used app-wide.
// Every content type and storage key lives here so swapping localStorage for a
// real backend API later only requires touching this one file.

import { DEMO_DATA, DEMO_DATA_VERSION } from '@/data/demoData';

export const STORAGE_KEYS = {
  ADMIN_AUTH: 'awd_admin_auth',
  HERO: 'awd_content_hero',
  PRICING: 'awd_content_pricing',
  PROCESS: 'awd_content_process',
  FAQ: 'awd_content_faq',
  CONTACT: 'awd_content_contact',
  TRUST: 'awd_content_trust',
  WHY: 'awd_content_why',
  DEMO: 'awd_demo_data',
} as const;

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item) as T;
  } catch {
    console.warn('[storage] Failed to load:', key);
    return defaultValue;
  }
}

export function saveToStorage<T>(key: string, value: T): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    console.warn('[storage] Failed to save:', key);
    return false;
  }
}

export function resetStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    console.warn('[storage] Failed to reset:', key);
  }
}

export async function loadFromServer<T>(key: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`/api/content?key=${key}`);
    const data = await res.json();
    if (data.value !== null && data.value !== undefined) {
      saveToStorage(key, data.value as T);
      return data.value as T;
    }
    return loadFromStorage(key, fallback);
  } catch {
    return loadFromStorage(key, fallback);
  }
}

export async function saveToServer<T>(key: string, value: T, password: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/content?key=${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value, password }),
    });
    const data = await res.json();
    if (data.success) {
      saveToStorage(key, value);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// ─── Content type interfaces ──────────────────────────────────────────────────

export interface HeroContent {
  eyebrow: string;
  headlineLine1: string;
  headlineHighlight: string;
  headlineHighlightColor: string;
  headlineLine2: string;
  subheadline: string;
  ctaPrimaryText: string;
  ctaPrimaryWaNumber: string;
  ctaSecondaryText: string;
  showMockup: boolean;
  badge1Text: string;
  badge2Text: string;
}

export interface PricingTier {
  id: string; // 'spark' | 'ignite' | 'blaze' | 'blazeplus' | 'apex'
  name: string;
  subtitle: string;
  priceNoAdmin: number;
  priceNoAdminOriginal: number;
  priceWithAdmin: number | null;
  priceWithAdminOriginal: number | null;
  showAdminOption: boolean;
  recommended: boolean;
  features: string[];
  ctaText: string;
  waNumber: string;
  waMessageTemplate: string;
  showDemoButton: boolean;
}

export interface PricingContent {
  labelNoAdmin: string;
  labelWithAdmin: string;
  tiers: PricingTier[];
}

export interface ProcessStep {
  id: string;
  order: number;
  icon: string; // lucide-react icon name, e.g. 'MessageCircle', 'Palette', 'Code2', 'Rocket', 'CheckCircle'
  title: string;
  badgeLabel: string;
  description: string;
  active: boolean;
}

export interface ProcessContent {
  steps: ProcessStep[];
}

export interface FaqItem {
  id: string;
  order: number;
  question: string;
  answer: string;
  active: boolean;
}

export interface FaqContent {
  items: FaqItem[];
}

export interface ContactContent {
  headline: string;
  subheadline: string;
  fieldLabels: { name: string; business: string; budget: string; message: string };
  budgetRanges: string[];
  waNumber: string;
  submitButtonText: string;
}

export interface TrustContent {
  text: string;
  visible: boolean;
}

export interface WhyRow {
  id: string;
  order: number;
  label: string;
  awd: boolean;
  wordpress: boolean;
}

export interface WhyContent {
  col1Header: string;
  col2Header: string;
  col3Header: string;
  rows: WhyRow[];
  guaranteeTitle: string;
  guaranteeDescription: string;
  guaranteeVisible: boolean;
}

export type DemoTier = 'spark' | 'ignite' | 'blaze' | 'blazeplus' | 'apex';
export type DemoCategory =
  | 'Klinik & Estetika'
  | 'Properti & Interior'
  | 'Hukum & Konsultan'
  | 'Kuliner & Hospitality'
  | 'Pendidikan & Pelatihan'
  | 'Bisnis & Korporat';

export const DEMO_CATEGORIES: DemoCategory[] = [
  'Klinik & Estetika',
  'Properti & Interior',
  'Hukum & Konsultan',
  'Kuliner & Hospitality',
  'Pendidikan & Pelatihan',
  'Bisnis & Korporat',
];

export interface DemoEntry {
  id: string;
  tier: DemoTier;
  name: string;
  category: DemoCategory;
  thumbnailUrl: string;
  demoUrl: string;
  hasAdmin: boolean;
  adminUrl: string;
  adminUsername: string;
  adminPassword: string;
  description: string;
  status: 'active' | 'draft';
  order: number;
}

export interface DemoData {
  entries: DemoEntry[];
}

// Maps retired category labels to their closest replacement in DEMO_CATEGORIES.
// Existing entries saved under the old labels are migrated automatically on load.
const LEGACY_CATEGORY_MAP: Record<string, DemoCategory> = {
  'Jasa Kepercayaan': 'Hukum & Konsultan',
  'Kesehatan & Estetika': 'Klinik & Estetika',
  'Properti & Ruang': 'Properti & Interior',
  'Acara & Lifestyle': 'Kuliner & Hospitality',
  'B2B & Korporat': 'Bisnis & Korporat',
};

export function loadDemoData(): DemoData {
  const data = loadFromStorage<DemoData>(STORAGE_KEYS.DEMO, { entries: [] });
  let migrated = false;
  const entries = data.entries.map((entry) => {
    const replacement = LEGACY_CATEGORY_MAP[entry.category as string];
    if (replacement) {
      migrated = true;
      return { ...entry, category: replacement };
    }
    return entry;
  });
  if (migrated) saveToStorage(STORAGE_KEYS.DEMO, { entries });

  if (entries.length === 0) {
    const seeded: DemoEntry[] = Object.values(DEMO_DATA).flat().map((d) => ({
      id: String(d.id),
      tier: d.tier as DemoTier,
      name: d.name,
      category: d.category as DemoCategory,
      thumbnailUrl: d.thumbnail,
      demoUrl: d.url,
      hasAdmin: !!d.adminUrl,
      adminUrl: d.adminUrl,
      adminUsername: d.adminUser,
      adminPassword: d.adminPass,
      description: d.description,
      status: d.status as 'active' | 'draft',
      order: d.order ?? 0,
    }));
    if (seeded.length > 0) {
      saveToStorage(STORAGE_KEYS.DEMO, { entries: seeded });
      try { localStorage.setItem('awd_demo_version', String(DEMO_DATA_VERSION)); } catch {}
      return { entries: seeded };
    }
  }

  return { entries };
}
