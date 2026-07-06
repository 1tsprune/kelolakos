export type Locale = "id" | "en";

export const LOCALE_STORAGE_KEY = "kelolakos-locale";

export type LandingChapter = {
  id: string;
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
};

export type LandingCopy = {
  tagline: string;
  nav: { features: string; howItWorks: string; pricing: string; faq: string; login: string; tryFree: string };
  hero: {
    titleBefore: string;
    titleEmphasis: string;
    titleAfter: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    noCard: string;
    sampleData: string;
    demo: string;
  };
  stats: {
    rooms: { label: string; desc: string };
    faster: { label: string; desc: string };
    modules: { label: string; desc: string };
    from: string;
    perMonth: string;
  };
  comparison: {
    title: string;
    subtitle: string;
    featureCol: string;
    excelCol: string;
    manual: string;
    rows: { feature: string; excel: false | "manual"; app: true }[];
  };
  scrollStory: {
    title: string;
    subtitle: string;
    viewChapter: string;
    chapters: LandingChapter[];
    preview: Record<string, Record<string, string>>;
  };
  workflow: { title: string; subtitle: string; steps: { step: string; title: string; desc: string }[] };
  testimonials: { title: string; items: { name: string; role: string; text: string; avatar: string }[] };
  pricing: {
    title: string;
    subtitle: string;
    popular: string;
    perMonth: string;
    cta: string;
    plans: { name: string; desc: string; features: string[]; pop: boolean; price: number }[];
  };
  faq: { title: string; items: { q: string; a: string }[] };
  cta: { title: string; subtitle: string; button: string };
  footer: { login: string; register: string };
};

const comparisonRowsId = [
  { feature: "Tagihan bulanan kebentuk otomatis", excel: false as const, app: true as const },
  { feature: "Penyewa cek & bayar sendiri", excel: false as const, app: true as const },
  { feature: "Reminder WA ke banyak penyewa", excel: false as const, app: true as const },
  { feature: "Terima bayar QRIS", excel: false as const, app: true as const },
  { feature: "Kalender jatuh tempo & kontrak", excel: false as const, app: true as const },
  { feature: "Laporan buat catatan bulanan", excel: false as const, app: true as const },
  { feature: "Catat barang di kamar", excel: false as const, app: true as const },
  { feature: "Antrian calon penyewa", excel: false as const, app: true as const },
  { feature: "Tiket perbaikan & tagihan listrik", excel: false as const, app: true as const },
  { feature: "Kelola banyak kos sekaligus", excel: "manual" as const, app: true as const },
];

const comparisonRowsEn = [
  { feature: "Monthly invoices generated automatically", excel: false as const, app: true as const },
  { feature: "Tenants check & pay on their own", excel: false as const, app: true as const },
  { feature: "Bulk WhatsApp payment reminders", excel: false as const, app: true as const },
  { feature: "Accept QRIS payments", excel: false as const, app: true as const },
  { feature: "Due-date calendar & lease tracking", excel: false as const, app: true as const },
  { feature: "Monthly reports for bookkeeping", excel: false as const, app: true as const },
  { feature: "Room inventory tracking", excel: false as const, app: true as const },
  { feature: "Tenant waiting list", excel: false as const, app: true as const },
  { feature: "Maintenance tickets & utility bills", excel: false as const, app: true as const },
  { feature: "Manage multiple properties at once", excel: "manual" as const, app: true as const },
];

export const landingCopy: Record<Locale, LandingCopy> = {
  id: {
    tagline: "Manajemen kos, tanpa ribet",
    nav: {
      features: "Fitur",
      howItWorks: "Cara Pakai",
      pricing: "Harga",
      faq: "Tanya Jawab",
      login: "Masuk",
      tryFree: "Coba Gratis",
    },
    hero: {
      titleBefore: "Tagihan kos beres,",
      titleEmphasis: "tanpa",
      titleAfter: "buka Excel tiap akhir bulan",
      subtitle:
        "Catat penyewa, ingatkan lewat WA, terima bayar QRIS, lihat jatuh tempo di kalender — dari satu aplikasi.",
      ctaPrimary: "Coba Gratis 14 Hari",
      ctaSecondary: "Lihat Contoh Isinya",
      noCard: "Tanpa kartu kredit",
      sampleData: "Ada data contoh",
      demo: "Demo: budi@kosmelati.id",
    },
    stats: {
      rooms: { label: "Kamar dicatat", desc: "di berbagai kota" },
      faster: { label: "Bayar lebih cepat", desc: "setelah pakai reminder" },
      modules: { label: "Modul lengkap", desc: "dashboard sampai kalender" },
      from: "Mulai dari",
      perMonth: "per bulan",
    },
    comparison: {
      title: "Masih catat di Excel?",
      subtitle: "Spreadsheet memang bisa. Tapi begitu kamar nambah, yang sering kewalahan itu kamu sendiri.",
      featureCol: "Fitur",
      excelCol: "Excel",
      manual: "manual",
      rows: comparisonRowsId,
    },
    scrollStory: {
      title: "Scroll sedikit, lihat cara kerjanya",
      subtitle: "Dari kalender sampai laporan — semua modul yang kamu pakai sehari-hari.",
      viewChapter: "Lihat",
      chapters: [
        {
          id: "kalender",
          tag: "Kalender & Notifikasi",
          title: "Jatuh tempo kelihatan per tanggal",
          desc: "Nggak perlu inget manual tanggal 5 tiap bulan. Buka kalender, langsung lihat siapa harus bayar, kontrak siapa mau habis.",
          bullets: ["Kalender jatuh tempo sewa", "Notifikasi telat bayar", "Kontrak mau habis", "Pencarian cepat"],
        },
        {
          id: "pembayaran",
          tag: "Pembayaran",
          title: "Tagihan bulanan kebentuk sendiri",
          desc: "Generate tagihan tiap bulan, kirim link bayar, terima QRIS. Status lunas langsung masuk catatan.",
          bullets: ["Tagihan otomatis", "Link bayar & QRIS", "Denda keterlambatan", "Riwayat per penyewa"],
        },
        {
          id: "portal",
          tag: "Portal Penyewa",
          title: "Penyewa bayar sendiri, chat kamu berkurang",
          desc: "Tiap penyewa dapat link portal. Mereka cek tagihan, lihat riwayat, dan bayar QRIS tanpa nanya kamu tiap bulan.",
          bullets: ["Link unik per penyewa", "Riwayat pembayaran", "Lapor masalah", "Bayar lewat QRIS"],
        },
        {
          id: "wa",
          tag: "WhatsApp",
          title: "Ingatkan bayar sekaligus",
          desc: "Yang belum bayar bisa diingatkan satu klik. Mau umumkan aturan baru ke semua penyewa? Bisa lewat broadcast.",
          bullets: ["Reminder massal", "Broadcast pengumuman", "Integrasi Fonnte", "Mode manual wa.me"],
        },
        {
          id: "data",
          tag: "Data Kos",
          title: "Properti, kamar, penyewa — rapi",
          desc: "Punya banyak kos? Semua dicatat di satu tempat. Kamar kosong, daftar tunggu, inventaris barang — lengkap.",
          bullets: ["Multi properti", "Status kamar", "Data penyewa & deposit", "Daftar tunggu & inventaris"],
        },
        {
          id: "uang",
          tag: "Keuangan",
          title: "Uang masuk, keluar, tercatat",
          desc: "Tagihan listrik per kamar, pengeluaran operasional, laporan bulanan — buat tahu untung-rugi tiap kos.",
          bullets: ["Utilitas listrik & air", "Catat pengeluaran", "Laporan PDF & CSV", "Analitik per properti"],
        },
        {
          id: "ops",
          tag: "Operasional",
          title: "Perbaikan & dokumen",
          desc: "Atap bocor, keran rusak — catat jadi tiket. Kontrak sewa bisa digenerate dari data penyewa yang sudah ada.",
          bullets: ["Tiket perbaikan", "Prioritas & status", "Generate kontrak", "Log aktivitas"],
        },
      ],
      preview: {
        kalender: {
          dueLine: "5 Jul · 4 tagihan jatuh tempo",
          contractLine: "15 Jul · kontrak Andi habis",
        },
        pembayaran: {
          paid: "Lunas",
          unpaid: "Belum bayar",
          late: "Telat",
          reminder: "Reminder WA",
          generate: "Generate Juli",
        },
        portal: {
          billLabel: "Tagihan Juli",
          payNow: "Bayar sekarang",
        },
        wa: {
          sent: "Terkirim ke 12 penyewa",
          message: "Halo Rina, tagihan kos Melati kamar A2 Rp 850.000 jatuh tempo 5 Juli. Link bayar: kelolakos.id/bayar/...",
          delivered: "12 terkirim",
          failed: "0 gagal",
          pending: "3 belum bayar",
        },
        data: {
          occupied: "8/10 terisi",
          vacant: "Kosong",
          waitlist: "3 calon",
          inventory: "AC · baik",
        },
        uang: {
          reportTitle: "Laporan Juli 2026",
          income: "Masuk",
          expense: "Keluar",
          balance: "Sisa",
        },
        ops: {
          roof: "Atap bocor · Kamar 102",
          faucet: "Keran bocor · Kamar A1",
          contract: "Kontrak Andi · siap cetak",
          urgent: "Urgent",
          normal: "Biasa",
          document: "Dokumen",
        },
      },
    },
    workflow: {
      title: "Mulai dari sini",
      subtitle: "Tiga langkah, biasanya selesai dalam satu sore",
      steps: [
        { step: "01", title: "Daftar, masukin kos", desc: "Nama kos, alamat, kamar, harga sewa. Ada panduan kalau baru pertama kali pakai." },
        { step: "02", title: "Catat penyewa", desc: "Nomor HP, deposit, tanggal masuk. Link portal buat penyewa langsung jadi — tinggal dikirim." },
        { step: "03", title: "Sisanya berjalan sendiri", desc: "Tagihan tiap bulan, ingatkan lewat WA, terima bayar QRIS. Kamu fokus isi kamar yang kosong." },
      ],
    },
    testimonials: {
      title: "Yang sudah pakai",
      items: [
        { name: "Pak Budi", role: "2 kos · Bandung", text: "Dulu tiap tanggal 5 repot ingetin satu-satu lewat WA. Sekarang tinggal klik reminder. Koleksi naik, saya juga nggak capek.", avatar: "PB" },
        { name: "Bu Siti", role: "Kost putri · Depok", text: "Kalendernya membantu — saya langsung lihat kontrak siapa yang mau habis bulan depan. Kamar kosong juga cepat keisi dari antrian.", avatar: "BS" },
        { name: "Hendra", role: "12 kamar · Surabaya", text: "Punya 3 kos di beda lokasi. Cek pendapatan tiap kos tinggal buka HP, nggak buka 3 file Excel lagi.", avatar: "HE" },
      ],
    },
    pricing: {
      title: "Harga per bulan",
      subtitle: "Trial 14 hari gratis dulu",
      popular: "Paling Laris",
      perMonth: "/bulan",
      cta: "Coba Dulu Gratis",
      plans: [
        { name: "Starter", price: 99000, desc: "Buat 1 kos kecil", features: ["1 properti", "10 kamar", "Portal penyewa", "Reminder WA", "Laporan PDF"], pop: false },
        { name: "Pro", price: 199000, desc: "Yang paling sering dipilih", features: ["5 properti", "50 kamar", "QRIS/Midtrans", "Kalender & notifikasi", "Daftar tunggu", "Broadcast WA"], pop: true },
        { name: "Business", price: 399000, desc: "Buat pengelola banyak kos", features: ["Properti tanpa batas", "Kamar tanpa batas", "Akses staff", "API", "Prioritas support", "Domain sendiri"], pop: false },
      ],
    },
    faq: {
      title: "Sering ditanya",
      items: [
        { q: "Bisa kelola lebih dari satu kos?", a: "Bisa. Paket Pro sampai 5 properti, Business tanpa batas. Tiap kos punya kamar, penyewa, dan laporannya sendiri — tapi kamu buka cukup satu dashboard." },
        { q: "Penyewa bisa cek tagihan sendiri?", a: "Bisa. Tiap penyewa dapat link portal. Mereka lihat tagihan, riwayat bayar, dan bisa bayar lewat QRIS tanpa harus chat kamu." },
        { q: "Reminder WhatsApp gimana caranya?", a: "Hubungkan akun Fonnte kamu di Pengaturan. Abis itu, tinggal klik kirim reminder ke yang belum bayar. Mau coba dulu tanpa API key juga bisa (mode simulasi)." },
        { q: "Ada laporan buat pembukuan?", a: "Ada. Export PDF buat print, CSV buat Excel. Ada rincian pendapatan, pengeluaran, dan sisa piutang per bulan." },
        { q: "Datanya aman nggak?", a: "Data kos kamu cuma bisa diakses akun kamu. Kami nggak jual data penyewa. Login juga dilindungi supaya nggak bisa ditebak sembarangan." },
        { q: "Bisa coba dulu tanpa bayar?", a: "Bisa, 14 hari gratis tanpa kartu kredit. Ada data contoh supaya kamu langsung lihat tampilannya kayak gimana." },
      ],
    },
    cta: {
      title: "Kos kamu udah jalan — tinggal dirapikan",
      subtitle: "Daftar, masukin data kos kamu, langsung keliatan hasilnya. Gratis 14 hari.",
      button: "Mulai Sekarang",
    },
    footer: { login: "Masuk", register: "Daftar" },
  },
  en: {
    tagline: "Boarding house management, simplified",
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      pricing: "Pricing",
      faq: "FAQ",
      login: "Log in",
      tryFree: "Try Free",
    },
    hero: {
      titleBefore: "Rent collection sorted —",
      titleEmphasis: "without",
      titleAfter: "opening Excel every month-end",
      subtitle:
        "Track tenants, send WhatsApp reminders, accept QRIS payments, and see due dates on the calendar — all in one app.",
      ctaPrimary: "Start 14-Day Free Trial",
      ctaSecondary: "See Sample Dashboard",
      noCard: "No credit card required",
      sampleData: "Includes sample data",
      demo: "Demo: budi@kosmelati.id",
    },
    stats: {
      rooms: { label: "Rooms tracked", desc: "across Indonesian cities" },
      faster: { label: "Faster payments", desc: "after using reminders" },
      modules: { label: "Full modules", desc: "dashboard to calendar" },
      from: "Starting at",
      perMonth: "per month",
    },
    comparison: {
      title: "Still using spreadsheets?",
      subtitle: "Excel works — until you add more rooms. Then it's you who gets overwhelmed.",
      featureCol: "Feature",
      excelCol: "Excel",
      manual: "manual",
      rows: comparisonRowsEn,
    },
    scrollStory: {
      title: "Scroll a bit, see how it works",
      subtitle: "From calendar to reports — every module you use day to day.",
      viewChapter: "View",
      chapters: [
        {
          id: "kalender",
          tag: "Calendar & Alerts",
          title: "Due dates visible at a glance",
          desc: "No more memorizing the 5th of every month. Open the calendar and see who owes rent and whose lease is expiring.",
          bullets: ["Rent due-date calendar", "Late payment alerts", "Lease expiry notices", "Quick search"],
        },
        {
          id: "pembayaran",
          tag: "Payments",
          title: "Monthly invoices, auto-generated",
          desc: "Generate bills each month, send payment links, accept QRIS. Paid status updates your records instantly.",
          bullets: ["Auto invoices", "Payment links & QRIS", "Late fees", "Per-tenant history"],
        },
        {
          id: "portal",
          tag: "Tenant Portal",
          title: "Tenants pay themselves — fewer chats for you",
          desc: "Each tenant gets a portal link. They check bills, view history, and pay via QRIS without messaging you every month.",
          bullets: ["Unique link per tenant", "Payment history", "Report issues", "Pay via QRIS"],
        },
        {
          id: "wa",
          tag: "WhatsApp",
          title: "Remind everyone at once",
          desc: "One click to remind unpaid tenants. Need to announce new house rules? Use broadcast.",
          bullets: ["Bulk reminders", "Announcements", "Fonnte integration", "Manual wa.me mode"],
        },
        {
          id: "data",
          tag: "Property Data",
          title: "Properties, rooms, tenants — organized",
          desc: "Multiple boarding houses? All in one place. Vacant rooms, waitlists, room inventory — covered.",
          bullets: ["Multi-property", "Room status", "Tenant & deposit data", "Waitlist & inventory"],
        },
        {
          id: "uang",
          tag: "Finance",
          title: "Income, expenses, tracked",
          desc: "Per-room utility bills, operating costs, monthly reports — know profit & loss for each property.",
          bullets: ["Electricity & water", "Expense tracking", "PDF & CSV reports", "Per-property analytics"],
        },
        {
          id: "ops",
          tag: "Operations",
          title: "Maintenance & documents",
          desc: "Leaky roof, broken tap — log it as a ticket. Generate lease contracts from existing tenant data.",
          bullets: ["Maintenance tickets", "Priority & status", "Generate contracts", "Activity log"],
        },
      ],
      preview: {
        kalender: {
          dueLine: "Jul 5 · 4 bills due",
          contractLine: "Jul 15 · Andi's lease ends",
        },
        pembayaran: {
          paid: "Paid",
          unpaid: "Unpaid",
          late: "Late",
          reminder: "WA Reminder",
          generate: "Generate July",
        },
        portal: {
          billLabel: "July Bill",
          payNow: "Pay now",
        },
        wa: {
          sent: "Sent to 12 tenants",
          message: "Hi Rina, Kos Melati room A2 bill Rp 850,000 due Jul 5. Pay link: kelolakos.id/bayar/...",
          delivered: "12 sent",
          failed: "0 failed",
          pending: "3 unpaid",
        },
        data: {
          occupied: "8/10 occupied",
          vacant: "Vacant",
          waitlist: "3 waiting",
          inventory: "AC · good",
        },
        uang: {
          reportTitle: "July 2026 Report",
          income: "Income",
          expense: "Expense",
          balance: "Balance",
        },
        ops: {
          roof: "Leaky roof · Room 102",
          faucet: "Leaky tap · Room A1",
          contract: "Andi's contract · ready",
          urgent: "Urgent",
          normal: "Normal",
          document: "Document",
        },
      },
    },
    workflow: {
      title: "Start here",
      subtitle: "Three steps — usually done in one afternoon",
      steps: [
        { step: "01", title: "Sign up, add your property", desc: "Name, address, rooms, rent. Guided setup if it's your first time." },
        { step: "02", title: "Add tenants", desc: "Phone, deposit, move-in date. Tenant portal link is ready — just send it." },
        { step: "03", title: "The rest runs itself", desc: "Monthly bills, WhatsApp reminders, QRIS payments. You focus on filling vacant rooms." },
      ],
    },
    testimonials: {
      title: "What owners say",
      items: [
        { name: "Pak Budi", role: "2 properties · Bandung", text: "I used to chase everyone on WhatsApp on the 5th. Now one click. Collections up, I'm less exhausted.", avatar: "PB" },
        { name: "Bu Siti", role: "Women's boarding · Depok", text: "The calendar shows whose lease ends next month. Vacant rooms fill faster from the waitlist.", avatar: "BS" },
        { name: "Hendra", role: "12 rooms · Surabaya", text: "Three properties in different areas. I check revenue per property on my phone — no more juggling Excel files.", avatar: "HE" },
      ],
    },
    pricing: {
      title: "Monthly pricing",
      subtitle: "14-day free trial first",
      popular: "Most Popular",
      perMonth: "/month",
      cta: "Try Free First",
      plans: [
        { name: "Starter", price: 99000, desc: "For one small property", features: ["1 property", "10 rooms", "Tenant portal", "WA reminders", "PDF reports"], pop: false },
        { name: "Pro", price: 199000, desc: "Most chosen plan", features: ["5 properties", "50 rooms", "QRIS/Midtrans", "Calendar & alerts", "Waitlist", "WA broadcast"], pop: true },
        { name: "Business", price: 399000, desc: "For multi-property managers", features: ["Unlimited properties", "Unlimited rooms", "Staff access", "API", "Priority support", "Custom domain"], pop: false },
      ],
    },
    faq: {
      title: "Common questions",
      items: [
        { q: "Can I manage more than one property?", a: "Yes. Pro supports up to 5 properties, Business is unlimited. Each property has its own rooms, tenants, and reports — one dashboard." },
        { q: "Can tenants check their own bills?", a: "Yes. Each tenant gets a portal link to view bills, payment history, and pay via QRIS without messaging you." },
        { q: "How do WhatsApp reminders work?", a: "Connect your Fonnte account in Settings, then send reminders to unpaid tenants in one click. Simulation mode works without an API key too." },
        { q: "Are there reports for bookkeeping?", a: "Yes. Export PDF for printing, CSV for Excel. Monthly income, expenses, and outstanding balances included." },
        { q: "Is my data secure?", a: "Your property data is only accessible to your account. We don't sell tenant data. Login is rate-limited against brute force." },
        { q: "Can I try before paying?", a: "Yes — 14 days free, no credit card. Sample data included so you can explore the dashboard immediately." },
      ],
    },
    cta: {
      title: "Your boarding house is running — time to organize it",
      subtitle: "Sign up, add your property data, see results right away. Free for 14 days.",
      button: "Get Started",
    },
    footer: { login: "Log in", register: "Sign up" },
  },
};

export function getLandingCopy(locale: Locale): LandingCopy {
  return landingCopy[locale];
}