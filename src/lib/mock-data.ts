// Mock data for the sales tracking app

export type ActivityType = "Canvassing" | "Sosialisasi" | "Open Booth" | "Event" | "Market ke instansi" | "Other";

export type LeadStatus = "Hot" | "Warm" | "Cold" | "Closing";

export type ActivityStatus = "planned" | "checked_in" | "completed";

export type ActivityMode = "online" | "lapangan";

export interface Activity {
  id: string;
  type: ActivityType;
  mode: ActivityMode;
  ptm: "Dalam PTM" | "Luar PTM";
  locationName: string;
  address: string;
  date: string; // ISO
  timeRange: string; // e.g. "09:00 - 10:00"
  status: ActivityStatus;
  checkInTime?: string;
  checkOutTime?: string;
  leadsCount: number;
  closingCount: number;
  photoUrl?: string;
  shareCode?: string;
  linkViews?: number;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  status: LeadStatus;
  source: ActivityType;
  lastContact: string;
  hasGold: boolean;
  interested: boolean;
  note?: string;
}

export interface Program {
  id: string;
  name: string;
  date: string;
  endDate: string;
  location: string;
  targetLeads: number;
  targetClosing: number;
  currentLeads: number;
  currentClosing: number;
  status: "Berlangsung" | "Segera" | "Berakhir";
}

export interface SalesProfile {
  name: string;
  nip: string;
  branch: string;
  avatarUrl: string;
  grade: "Trainee" | "Silver" | "Gold" | "Platinum";
  gradeProgress: number; // 0-100
  quadrant: "I" | "II" | "III" | "IV";
  booking: number;
  bookingEstimate: number;
  estimasiInsentif: number;
}

export const profile: SalesProfile = {
  name: "Rizky Pratama",
  nip: "PG-098231",
  branch: "Cabang Denpasar",
  avatarUrl: "",
  grade: "Gold",
  gradeProgress: 72,
  quadrant: "IV",
  booking: 14250000,
  bookingEstimate: 22000000,
  estimasiInsentif: 1840000,
};

export const targets = {
  leads: { today: { current: 6, target: 12 }, week: { current: 38, target: 80 }, month: { current: 132, target: 200 } },
  closingLeads: { today: { current: 2, target: 5 }, week: { current: 18, target: 35 }, month: { current: 76, target: 140 } },
};

export const activities: Activity[] = [
  {
    id: "a1",
    type: "Canvassing",
    mode: "lapangan",
    ptm: "Luar PTM",
    locationName: "Pasar Badung",
    address: "Jl. Gajah Mada, Denpasar",
    date: new Date().toISOString(),
    timeRange: "08:00 - 10:00",
    status: "checked_in",
    checkInTime: "08:12",
    leadsCount: 4,
    closingCount: 1,
  },
  {
    id: "a2",
    type: "Open Booth",
    mode: "lapangan",
    ptm: "Dalam PTM",
    locationName: "Mall Bali Galeria",
    address: "Jl. Bypass Ngurah Rai, Kuta",
    date: new Date().toISOString(),
    timeRange: "11:00 - 14:00",
    status: "planned",
    leadsCount: 0,
    closingCount: 0,
  },
  {
    id: "a3",
    type: "Event",
    mode: "online",
    ptm: "Dalam PTM",
    locationName: "Live IG: Edukasi Gadai Emas",
    address: "Online — link dibagikan ke nasabah",
    date: new Date().toISOString(),
    timeRange: "15:00 - 18:00",
    status: "planned",
    leadsCount: 0,
    closingCount: 0,
    shareCode: "EVT-A3-8K2P",
    linkViews: 0,
  },
  {
    id: "a4",
    type: "Sosialisasi",
    mode: "lapangan",
    ptm: "Dalam PTM",
    locationName: "Kantor Kecamatan Denpasar Barat",
    address: "Jl. Gunung Agung, Denpasar",
    date: new Date(Date.now() - 86400000).toISOString(),
    timeRange: "09:00 - 11:00",
    status: "completed",
    checkInTime: "09:05",
    checkOutTime: "11:24",
    leadsCount: 7,
    closingCount: 3,
  },
  {
    id: "a5",
    type: "Market ke instansi",
    mode: "lapangan",
    ptm: "Luar PTM",
    locationName: "RS Sanglah",
    address: "Jl. Diponegoro, Denpasar",
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
    timeRange: "13:00 - 15:00",
    status: "completed",
    checkInTime: "13:01",
    checkOutTime: "15:10",
    leadsCount: 5,
    closingCount: 2,
  },
];

export const contacts: Contact[] = [
  { id: "c1", name: "Siti Sarah", phone: "+6281234567890", status: "Hot", source: "Canvassing", lastContact: "Hari ini", hasGold: true, interested: true, note: "Tertarik gadai 10gr, follow up besok" },
  { id: "c2", name: "Made Wirawan", phone: "+6281298765432", status: "Warm", source: "Open Booth", lastContact: "2 hari lalu", hasGold: true, interested: false },
  { id: "c3", name: "Putu Ayu Lestari", phone: "+6285712340987", status: "Closing", source: "Event", lastContact: "Kemarin", hasGold: true, interested: true, note: "Sudah closing 5gr" },
  { id: "c4", name: "Bagus Santoso", phone: "+6282111223344", status: "Cold", source: "Canvassing", lastContact: "1 minggu lalu", hasGold: false, interested: false },
  { id: "c5", name: "Ni Luh Diah", phone: "+6287722334411", status: "Warm", source: "Sosialisasi", lastContact: "3 hari lalu", hasGold: true, interested: true, note: "Minta dijelaskan ulang skema bunga" },
  { id: "c6", name: "Komang Arta", phone: "+6281355667788", status: "Hot", source: "Market ke instansi", lastContact: "Hari ini", hasGold: true, interested: true },
];

export const programs: Program[] = [
  {
    id: "p1",
    name: "Gebyar Emas Akhir Bulan",
    date: "2026-06-20",
    endDate: "2026-06-30",
    location: "Denpasar",
    targetLeads: 100,
    targetClosing: 50,
    currentLeads: 62,
    currentClosing: 21,
    status: "Berlangsung",
  },
  {
    id: "p2",
    name: "Open Booth Mall Galeria",
    date: "2026-07-05",
    endDate: "2026-07-07",
    location: "Mall Bali Galeria",
    targetLeads: 60,
    targetClosing: 25,
    currentLeads: 0,
    currentClosing: 0,
    status: "Segera",
  },
  {
    id: "p3",
    name: "Sosialisasi RT/RW Renon",
    date: "2026-05-12",
    endDate: "2026-05-20",
    location: "Renon",
    targetLeads: 40,
    targetClosing: 15,
    currentLeads: 44,
    currentClosing: 18,
    status: "Berakhir",
  },
];

export const leadsByStatus = [
  { label: "Canvassing Hot", value: 232, color: "oklch(0.6 0.22 25)" },
  { label: "Follow up Warm", value: 125, color: "oklch(0.65 0.16 220)" },
  { label: "Grebek Pasar Warm", value: 53, color: "oklch(0.55 0.18 305)" },
  { label: "Follow up Hot", value: 52, color: "oklch(0.7 0.14 165)" },
  { label: "Event Hot", value: 29, color: "oklch(0.6 0.18 45)" },
  { label: "Canvassing Warm", value: 15, color: "oklch(0.55 0.14 250)" },
  { label: "Lainnya", value: 28, color: "oklch(0.7 0.04 260)" },
];

export const formatRupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);

export const getShareCode = (a: Pick<Activity, "id" | "shareCode">) =>
  a.shareCode ?? `CT-${a.id.toUpperCase()}-2026`;

export const getShareLink = (a: Pick<Activity, "id" | "shareCode">) =>
  typeof window !== "undefined"
    ? `${window.location.origin}/isi/${a.id}?k=${getShareCode(a)}`
    : `/isi/${a.id}?k=${getShareCode(a)}`;

export const MODE_META = {
  online: {
    label: "Online",
    badge: "🌐 Online",
    desc: "Tanpa ke lokasi — bagikan link, nasabah isi sendiri",
  },
  lapangan: {
    label: "Lapangan",
    badge: "📍 Lapangan",
    desc: "Kunjungan langsung — wajib check-in GPS di lokasi",
  },
} as const;
