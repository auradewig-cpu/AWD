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
      name: 'Forma Studio',
      category: 'Properti & Interior',
      description: 'Demo website firma arsitektur premium dengan sistem database properti dan galeri proyek.',
      url: 'https://demo-forma-studio.vercel.app',
      adminUrl: 'https://demo-forma-studio.vercel.app/admin',
      adminUser: 'admin@formastudio.id',
      adminPass: 'forma123',
      thumbnail: '',
      status: 'active',
      order: 0,
    },
    {
      id: 2,
      tier: 'blaze',
      name: 'Klinik Sehat',
      category: 'Klinik & Estetika',
      description: 'Demo sistem manajemen klinik dengan database pasien, jadwal dokter, dan rekam medis.',
      url: 'https://demo-klinik-sehat.vercel.app',
      adminUrl: 'https://demo-klinik-sehat.vercel.app/admin',
      adminUser: 'admin@kliniksehat.id',
      adminPass: 'klinik123',
      thumbnail: '',
      status: 'active',
      order: 1,
    },
  ],
  spark: [],
  ignite: [],
  'blazeplus': [],
  apex: [],
}
