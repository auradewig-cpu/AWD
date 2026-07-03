export const DEMO_DATA_VERSION = 6

export const DEMO_DATA: Record<string, {
  id: number
  tier: string
  name: string
  category: string
  description: string
  url: string
  adminUrl: string
  adminUser: string
  adminPass: string
  thumbnail: string
  status: string
  order?: number
}[]> = {
  starter: [
    {
      id: 1,
      tier: 'starter',
      name: 'Demo Kira',
      category: 'Kuliner & Hospitality',
      description: 'Demo website bisnis kuliner dan hospitality premium dengan desain modern dan elegan.',
      url: 'https://demo-kira.vercel.app/',
      adminUrl: '',
      adminUser: '',
      adminPass: '',
      thumbnail: 'https://res.cloudinary.com/dr0xe0tgr/image/upload/v1782560735/Screenshot_2026-06-27_100237_fjooqc.webp',
      status: 'active',
      order: 0,
    },
    {
      id: 2,
      tier: 'starter',
      name: 'Demo Fortis',
      category: 'Hukum & Konsultan',
      description: 'Demo website firma hukum dan konsultan profesional dengan tampilan yang berwibawa dan terpercaya.',
      url: 'https://fortis-law.vercel.app/',
      adminUrl: '',
      adminUser: '',
      adminPass: '',
      thumbnail: 'https://res.cloudinary.com/dr0xe0tgr/image/upload/v1782560735/Screenshot_2026-06-27_092030_rblxhl.webp',
      status: 'active',
      order: 1,
    },
  ],
  business: [
    {
      id: 3,
      tier: 'business',
      name: 'Demo Graha V1',
      category: 'Properti & Interior',
      description: 'Demo website firma arsitektur premium dengan scroll-scrubbing cinematic proses konstruksi bangunan.',
      url: 'https://demo-graha.vercel.app/',
      adminUrl: '',
      adminUser: '',
      adminPass: '',
      thumbnail: 'https://res.cloudinary.com/dr0xe0tgr/image/upload/v1782599656/v1_etln1t.webp',
      status: 'active',
      order: 0,
    },
    {
      id: 4,
      tier: 'business',
      name: 'Demo Graha V2',
      category: 'Properti & Interior',
      description: 'Demo website arsitektur premium dengan scroll-scrubbing hero dan Pioneer-style section animations.',
      url: 'https://demo-graha-v2.vercel.app/',
      adminUrl: '',
      adminUser: '',
      adminPass: '',
      thumbnail: 'https://res.cloudinary.com/dr0xe0tgr/image/upload/v1782599656/v2_o5f0ft.webp',
      status: 'active',
      order: 1,
    },
    {
      id: 5,
      tier: 'business',
      name: 'Demo Graha V3',
      category: 'Properti & Interior',
      description: 'Demo website arsitektur premium dengan full-page scroll-scrubbing cinematic dan GSAP animations.',
      url: 'https://graha-v3.vercel.app/',
      adminUrl: '',
      adminUser: '',
      adminPass: '',
      thumbnail: 'https://res.cloudinary.com/dr0xe0tgr/image/upload/v1782599656/v3_iy7xym.webp',
      status: 'active',
      order: 2,
    },
  ],
  store: [
    {
      id: 1,
      tier: 'store',
      name: 'Lumina Hotel',
      category: 'Kuliner & Hospitality',
      description: 'Demo website boutique hotel premium dengan scroll-scrubbing cinematic dan panel manajemen reservasi.',
      url: 'https://demo-lumina-hotel.vercel.app',
      adminUrl: 'https://demo-lumina-hotel.vercel.app/admin/login',
      adminUser: 'admin@lumina.id',
      adminPass: 'lumina123',
      thumbnail: 'https://res.cloudinary.com/dr0xe0tgr/image/upload/v1782188487/lumina_zt0log.webp',
      status: 'active',
      order: 0,
    },
    {
      id: 2,
      tier: 'store',
      name: 'Demo Forma',
      category: 'Properti & Interior',
      description: 'Demo website firma arsitektur premium dengan scroll-scrubbing cinematic dan panel manajemen proyek.',
      url: 'https://demo-forma-studio.vercel.app',
      adminUrl: 'https://demo-forma-studio.vercel.app/admin/login',
      adminUser: 'admin@formastudio.id',
      adminPass: 'forma123',
      thumbnail: 'https://res.cloudinary.com/dr0xe0tgr/image/upload/v1782188487/forma_u5wclp.webp',
      status: 'active',
      order: 1,
    },
    {
      id: 3,
      tier: 'store',
      name: 'Demo Lume',
      category: 'Klinik & Estetika',
      description: 'Demo website klinik estetika premium dengan sistem manajemen pasien dan booking treatment.',
      url: 'https://demo-lume-klinik.vercel.app',
      adminUrl: 'https://demo-lume-klinik.vercel.app/admin/login',
      adminUser: 'admin@lume.id',
      adminPass: 'lume123',
      thumbnail: 'https://res.cloudinary.com/dr0xe0tgr/image/upload/v1782284790/Screenshot_2026-06-24_140550_euhkf0.webp',
      status: 'active',
      order: 2,
    },
  ],
  pro: [
    {
      id: 2,
      tier: 'pro',
      name: 'GRAHA Studio v2',
      category: 'Properti & Interior',
      description: 'Demo website arsitektur premium dengan scroll-scrubbing + Pioneer-style section animations. Paket PRO.',
      url: 'https://demo-graha-v2.vercel.app',
      adminUrl: '',
      adminUser: 'admin@graha.id',
      adminPass: 'graha123',
      thumbnail: '',
      status: 'active',
      order: 0,
    },
  ],
}
