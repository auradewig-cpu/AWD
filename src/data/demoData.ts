export const DEMO_DATA_VERSION = 2

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
  blaze: [
    {
      id: 1,
      tier: 'blaze',
      name: 'Lumina Hotel',
      category: 'Kuliner & Hospitality',
      description: 'Demo website boutique hotel premium dengan scroll-scrubbing cinematic dan panel manajemen reservasi.',
      url: 'https://demo-lumina-hotel.vercel.app',
      adminUrl: 'https://demo-lumina-hotel.vercel.app/admin/login',
      adminUser: 'admin@lumina.id',
      adminPass: 'lumina123',
      thumbnail: '',
      status: 'active',
      order: 0,
    },
    {
      id: 2,
      tier: 'blaze',
      name: 'Demo Forma',
      category: 'Properti & Interior',
      description: 'Demo website firma arsitektur premium dengan scroll-scrubbing cinematic dan panel manajemen proyek.',
      url: 'https://demo-forma-studio.vercel.app',
      adminUrl: 'https://demo-forma-studio.vercel.app/admin/login',
      adminUser: 'admin@formastudio.id',
      adminPass: 'forma123',
      thumbnail: '',
      status: 'active',
      order: 1,
    },
    {
      id: 3,
      tier: 'blaze',
      name: 'Demo Lume',
      category: 'Klinik & Estetika',
      description: 'Demo website klinik estetika premium dengan sistem manajemen pasien dan booking treatment.',
      url: 'https://demo-lume-klinik.vercel.app',
      adminUrl: 'https://demo-lume-klinik.vercel.app/admin/login',
      adminUser: 'admin@lume.id',
      adminPass: 'lume123',
      thumbnail: '',
      status: 'active',
      order: 2,
    },
  ],
  spark: [],
  ignite: [],
  'blazeplus': [],
  apex: [],
}
