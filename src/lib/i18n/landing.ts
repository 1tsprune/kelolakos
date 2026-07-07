export type Locale = "id" | "en";

export const LOCALE_STORAGE_KEY = "koskit-locale";

export type LandingChapter = {
  id: string;
  tag: string;
  title: string;
  desc: string;
  bullets: string[];
};

export type LandingCopy = {
  tagline: string;
  nav: { features: string; howItWorks: string; pricing: string; faq: string; support: string; login: string; tryFree: string };
  hero: {
    badge: string;
    titleBefore: string;
    titleEmphasis: string;
    titleAfter: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    noCard: string;
    sampleData: string;
    demo: string;
    scrollHint: string;
    pills: { label: string; value: string }[];
    mockup: {
      month: string;
      greeting: string;
      targetBadge: string;
      targetLine: string;
      sidebar: string[];
      sidebarActive: string;
      stats: { l: string; v: string; c: string }[];
      tenants: { n: string; s: string; ok: boolean }[];
      floatPayment: { title: string; detail: string };
      floatOccupancy: { title: string; value: string };
      floatReminder: { title: string; value: string };
    };
  };
  featureGrid: {
    title: string;
    subtitle: string;
    items: { id: string; title: string; desc: string }[];
    demos: Record<
      string,
      | { avatars: string[] }
      | { rows: { room: string; status: string; ok: boolean }[] }
      | { cells: { label: string; filled: boolean }[] }
      | { title: string; lines: { label: string; value: string }[] }
    >;
  };
  midCta: { title: string; subtitle: string; button: string };
  problems: { title: string; subtitle: string; items: { title: string; desc: string }[] };
  support: {
    title: string;
    subtitle: string;
    waCta: string;
    waNote: string;
    emailLabel: string;
    responseNote: string;
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
  workflow: {
    title: string;
    subtitle: string;
    steps: { step: string; title: string; desc: string; visual: "verify" | "rooms" | "manage" }[];
    visuals: {
      verify: { email: string; verified: string };
      rooms: { rooms: string[]; caption: string };
      manage: { days: string[]; payments: { name: string; status: string; ok: boolean }[] };
    };
  };
  testimonials: {
    title: string;
    items: { name: string; role: string; text: string; avatar: string; stars?: number }[];
  };
  pricing: {
    title: string;
    subtitle: string;
    popular: string;
    perMonth: string;
    cta: string;
    freeForever: string;
    ctaFree: string;
    plans: {
      name: string;
      desc: string;
      features: string[];
      pop: boolean;
      price: number;
      badge?: string;
      priceNote?: string;
      accent?: boolean;
    }[];
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
    tagline: "Toolkit manajemen kos & kontrakan",
    nav: {
      features: "Fitur",
      howItWorks: "Cara Pakai",
      pricing: "Harga",
      faq: "Tanya Jawab",
      support: "Bantuan",
      login: "Masuk",
      tryFree: "Coba Gratis",
    },
    hero: {
      badge: "Early Access — 50 pendaftar pertama dapat onboarding prioritas",
      titleBefore: "Kelola kos",
      titleEmphasis: "tanpa ribet",
      titleAfter: " — tagihan, WA, QRIS satu dashboard",
      subtitle:
        "Buat pemilik kos yang capek ngejar tagihan lewat chat. Catat penyewa, ingatkan bayar, terima QRIS — semua dari satu tempat.",
      ctaPrimary: "Coba Gratis",
      ctaSecondary: "Lihat Fitur",
      noCard: "Tanpa kartu kredit",
      sampleData: "Gratis 1 properti · 3 kamar",
      demo: "Demo: budi@kosmelati.id",
      scrollHint: "Scroll",
      pills: [
        { label: "Penghuni", value: "Multi-kos" },
        { label: "Pembayaran", value: "Otomatis + QRIS" },
        { label: "Laporan", value: "PDF real-time" },
      ],
      mockup: {
        month: "Juli 2026",
        greeting: "Selamat pagi, Pak Budi",
        targetBadge: "33% target",
        targetLine: "Target pendapatan Rp 10jt/bulan",
        sidebar: ["Dashboard", "Pembayaran", "Penyewa", "Portal", "Laporan"],
        sidebarActive: "Dashboard",
        stats: [
          { l: "Terkumpul", v: "Rp 850rb", c: "text-emerald-400" },
          { l: "Tunggakan", v: "Rp 2,1jt", c: "text-amber-300" },
          { l: "Hunian", v: "80%", c: "text-white" },
        ],
        tenants: [
          { n: "Andi Pratama", s: "Lunas", ok: true },
          { n: "Rina Wulandari", s: "Belum", ok: false },
          { n: "Dewi Lestari", s: "Terlambat", ok: false },
        ],
        floatPayment: { title: "Pembayaran diterima", detail: "Kamar 12 · Rp 1.500.000" },
        floatOccupancy: { title: "Penghuni baru", value: "8 / 10 kamar" },
        floatReminder: { title: "Reminder terkirim", value: "12 penyewa ✓" },
      },
    },
    featureGrid: {
      title: "Yang biasa bikin pusing, di sini ada",
      subtitle: "Penghuni, tagihan, kamar kosong, laporan — nggak perlu bolak-balik Excel",
      items: [
        { id: "tenants", title: "Data Penyewa", desc: "Kontrak, deposit, riwayat tinggal — tinggal buka, nggak perlu buka-buka buku catatan lagi." },
        { id: "payments", title: "Tagihan & Bayar", desc: "Status lunas atau belum kelihatan jelas. Reminder WA tinggal klik, bayar bisa lewat QRIS." },
        { id: "rooms", title: "Kamar Kosong", desc: "Langsung tahu kamar mana yang kosong, di kos mana — praktis kalau punya lebih dari satu properti." },
        { id: "reports", title: "Laporan Bulanan", desc: "Masuk berapa, keluar berapa, piutang siapa — export PDF atau CSV kalau perlu." },
      ],
      demos: {
        tenants: { avatars: ["A", "B", "C", "D", "E"] },
        payments: {
          rows: [
            { room: "Kamar 12", status: "Lunas", ok: true },
            { room: "Kamar 8", status: "Pending", ok: false },
            { room: "Kamar 3", status: "Telat", ok: false },
          ],
        },
        rooms: {
          cells: [
            { label: "01", filled: true },
            { label: "02", filled: true },
            { label: "03", filled: false },
            { label: "04", filled: true },
            { label: "05", filled: true },
            { label: "06", filled: false },
            { label: "07", filled: true },
            { label: "08", filled: true },
          ],
        },
        reports: {
          title: "Laporan Juli 2026",
          lines: [
            { label: "Masuk", value: "Rp 8,5jt" },
            { label: "Keluar", value: "Rp 1,2jt" },
            { label: "Laba", value: "Rp 7,3jt" },
          ],
        },
      },
    },
    midCta: {
      title: "Mau coba dulu?",
      subtitle: "Daftar gratis, verifikasi email, langsung masuk dashboard.",
      button: "Mulai Gratis",
    },
    problems: {
      title: "Kayaknya familiar?",
      subtitle: "Kebanyakan pemilik kos pernah ngalamin ini",
      items: [
        {
          title: "Catatan berantakan",
          desc: "Data penyewa masih di buku atau Excel. Begitu kamar nambah, susah cari riwayatnya.",
        },
        {
          title: "Lupa ingetin bayar",
          desc: "Tiap tanggal 5 harus chat satu-satu. Capek, dan sering ada yang kelewat.",
        },
        {
          title: "Banyak kos, bingung",
          desc: "Punya dua-tiga kos di beda lokasi? Susah pantau kamar kosong dan uang masuknya.",
        },
      ],
    },
    support: {
      title: "Bingung mulai dari mana? Chat aja",
      subtitle: "Admin KosKit bantu setup — dari masukin data kos sampai sambungin Xendit & WhatsApp.",
      waCta: "Chat via WhatsApp",
      waNote: "Respon cepat · Bahasa Indonesia · Tanpa biaya konsultasi",
      emailLabel: "Atau email",
      responseNote: "Biasanya membalas dalam beberapa jam kerja",
    },
    stats: {
      rooms: { label: "Kamar dicatat", desc: "di berbagai kota" },
      faster: { label: "Bayar lebih cepat", desc: "setelah pakai reminder" },
      modules: { label: "Modul lengkap", desc: "dashboard sampai kalender" },
      from: "Mulai dari",
      perMonth: "per bulan",
    },
    comparison: {
      title: "Masih pakai Excel?",
      subtitle: "Awalnya oke. Tapi begitu kamar nambah, spreadsheet mulai bikin pusing sendiri.",
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
          message: "Halo Rina, tagihan kos Melati kamar A2 Rp 850.000 jatuh tempo 5 Juli. Link bayar: koskit.id/bayar/...",
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
      title: "Mulai dalam 3 langkah",
      subtitle: "Biasanya selesai dalam satu sore — nggak perlu skill teknis khusus",
      steps: [
        { step: "01", title: "Daftar & verifikasi email", desc: "Buat akun dalam hitungan detik. Verifikasi email, lalu langsung masuk dashboard.", visual: "verify" },
        { step: "02", title: "Tambahkan kos & kamar", desc: "Masukkan properti, daftar kamar, dan harga sewa lewat form yang simpel.", visual: "rooms" },
        { step: "03", title: "Kelola dari mana saja", desc: "Pantau pembayaran, ketersediaan kamar, dan laporan kapan pun lewat HP atau laptop.", visual: "manage" },
      ],
      visuals: {
        verify: { email: "juragan@kosanda.id", verified: "Terverifikasi" },
        rooms: { rooms: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], caption: "9 kamar · 7 terisi" },
        manage: {
          days: ["Sen", "Sel", "Rab", "Kam"],
          payments: [
            { name: "Kamar A1", status: "Lunas", ok: true },
            { name: "Kamar B2", status: "Pending", ok: false },
          ],
        },
      },
    },
    testimonials: {
      title: "Dipercaya pemilik kos",
      items: [
        {
          name: "Pak Budi",
          role: "Pemilik 2 kos, Bandung",
          text: "Dulu tagihan selalu telat karena lupa WA manual. Sekarang generate + reminder otomatis, koleksi naik 30%.",
          avatar: "PB",
          stars: 5,
        },
        {
          name: "Bu Siti",
          role: "Kost putri, Depok",
          text: "Portal penyewa game changer. Mereka bayar sendiri lewat QRIS, saya tinggal cek dashboard.",
          avatar: "BS",
          stars: 5,
        },
        {
          name: "Hendra",
          role: "12 kamar, Surabaya",
          text: "Laporan PDF-nya langsung saya kasih ke istri buat pembukuan. Jauh lebih rapi dari Excel.",
          avatar: "HE",
          stars: 5,
        },
      ],
    },
    pricing: {
      title: "Harga transparan",
      subtitle: "Mulai gratis, upgrade kapan saja. Tanpa kartu kredit.",
      popular: "Paling Dipilih",
      perMonth: "/bulan",
      freeForever: "selamanya",
      cta: "Coba Gratis",
      ctaFree: "Mulai Gratis",
      plans: [
        {
          name: "Early Adopter",
          badge: "50 Slot Pertama",
          desc: "Pendaftar pertama",
          price: 0,
          priceNote: "bonus onboarding",
          accent: true,
          features: ["Trial 30 hari full Pro", "Diskon 20% upgrade selamanya", "Onboarding prioritas via WA", "Akses fitur baru lebih dulu"],
          pop: false,
        },
        {
          name: "Gratis",
          desc: "Mulai tanpa bayar",
          price: 0,
          features: ["1 properti · 3 kamar", "Manajemen penyewa", "Pelacakan pembayaran", "Reminder WA manual", "Laporan dasar"],
          pop: false,
        },
        {
          name: "Pro",
          desc: "Untuk juragan serius",
          price: 199000,
          features: ["5 properti · 50 kamar", "Portal penyewa + QRIS", "Kalender & notifikasi", "Broadcast WA", "Laporan PDF & CSV"],
          pop: true,
        },
        {
          name: "Business",
          desc: "Multi-kos skala besar",
          price: 399000,
          features: ["Properti & kamar tanpa batas", "Semua fitur Pro", "Prioritas support", "Domain sendiri", "Onboarding call 30 menit"],
          pop: false,
        },
      ],
    },
    faq: {
      title: "Pertanyaan yang sering diajukan",
      items: [
        { q: "Apa itu KosKit?", a: "KosKit adalah aplikasi manajemen kos & kontrakan untuk pemilik kos di Indonesia. Lewat satu dashboard, kamu kelola penyewa, tagihan, reminder WhatsApp, portal penyewa, dan laporan keuangan." },
        { q: "Apakah KosKit gratis?", a: "Ada paket Gratis selamanya (1 properti, 3 kamar). 50 pendaftar pertama dapat bonus Early Adopter: 30 hari akses penuh seperti Pro, plus diskon upgrade. Paket berbayar mulai Rp 199rb/bulan." },
        { q: "Apa bedanya dengan catat di Excel?", a: "Excel mudah berantakan begitu kamar nambah. KosKit menyatukan penyewa, pembayaran, dan ketersediaan kamar — plus reminder otomatis, portal penyewa, dan laporan tanpa hitung manual." },
        { q: "Bisa kelola lebih dari satu kos?", a: "Bisa. Paket Pro sampai 5 properti, Business tanpa batas. Tiap kos punya kamar, penyewa, dan laporannya sendiri — satu dashboard." },
        { q: "Penyewa bisa cek tagihan sendiri?", a: "Bisa. Tiap penyewa dapat link portal unik untuk lihat tagihan, riwayat bayar, dan bayar QRIS sendiri." },
        { q: "Cocok untuk yang belum paham teknologi?", a: "Cocok. KosKit dibuat simpel: daftar, verifikasi email, tambah kos lewat form, langsung kelola. Ada panduan setup dan admin siap bantu lewat WhatsApp." },
        { q: "Reminder WhatsApp gimana?", a: "Hubungkan Fonnte di Pengaturan, lalu kirim reminder massal ke yang belum bayar. Mode simulasi tersedia tanpa API key." },
        { q: "Di mana bisa dipakai?", a: "KosKit berjalan di browser HP atau laptop — tidak perlu instalasi rumit. Cukup buka koskit.id setelah daftar." },
        { q: "Datanya aman?", a: "Data kos hanya bisa diakses akun kamu. Kami tidak menjual data penyewa. Login dilindungi rate limit dan verifikasi email." },
      ],
    },
    cta: {
      title: "Kos kamu udah jalan — tinggal dirapikan",
      subtitle: "Daftar gratis, masukin data kos, langsung keliatan hasilnya.",
      button: "Mulai Sekarang",
    },
    footer: { login: "Masuk", register: "Daftar" },
  },
  en: {
    tagline: "Kos management toolkit",
    nav: {
      features: "Features",
      howItWorks: "How It Works",
      pricing: "Pricing",
      faq: "FAQ",
      support: "Support",
      login: "Log in",
      tryFree: "Try Free",
    },
    hero: {
      badge: "Early Access — first 50 signups get priority onboarding",
      titleBefore: "Manage boarding houses",
      titleEmphasis: "without the hassle",
      titleAfter: " — bills, WA, QRIS in one dashboard",
      subtitle:
        "For owners tired of chasing rent over chat. Track tenants, send reminders, accept QRIS — all from one place.",
      ctaPrimary: "Try Free",
      ctaSecondary: "See Features",
      noCard: "No credit card required",
      sampleData: "Free: 1 property · 3 rooms",
      demo: "Demo: budi@kosmelati.id",
      scrollHint: "Scroll",
      pills: [
        { label: "Tenants", value: "Multi-property" },
        { label: "Payments", value: "Auto + QRIS" },
        { label: "Reports", value: "Real-time PDF" },
      ],
      mockup: {
        month: "July 2026",
        greeting: "Good morning, Pak Budi",
        targetBadge: "33% target",
        targetLine: "Revenue target Rp 10M/month",
        sidebar: ["Dashboard", "Payments", "Tenants", "Portal", "Reports"],
        sidebarActive: "Dashboard",
        stats: [
          { l: "Collected", v: "Rp 850K", c: "text-emerald-400" },
          { l: "Outstanding", v: "Rp 2.1M", c: "text-amber-300" },
          { l: "Occupancy", v: "80%", c: "text-white" },
        ],
        tenants: [
          { n: "Andi Pratama", s: "Paid", ok: true },
          { n: "Rina Wulandari", s: "Unpaid", ok: false },
          { n: "Dewi Lestari", s: "Late", ok: false },
        ],
        floatPayment: { title: "Payment received", detail: "Room 12 · Rp 1,500,000" },
        floatOccupancy: { title: "New tenant", value: "8 / 10 rooms" },
        floatReminder: { title: "Reminders sent", value: "12 tenants ✓" },
      },
    },
    featureGrid: {
      title: "Everything you need",
      subtitle: "One toolkit for tenants, payments, rooms, and financial reports",
      items: [
        { id: "tenants", title: "Tenant Management", desc: "Identity, contracts, deposits, and stay history — organized in one dashboard." },
        { id: "payments", title: "Payment Tracking", desc: "Monitor monthly bills, send reminders, and accept QRIS payments." },
        { id: "rooms", title: "Room Availability", desc: "See vacant and occupied rooms in real time across all properties." },
        { id: "reports", title: "Financial Reports", desc: "Income, expenses, and receivables — PDF & CSV export every month." },
      ],
      demos: {
        tenants: { avatars: ["A", "B", "C", "D", "E"] },
        payments: {
          rows: [
            { room: "Room 12", status: "Paid", ok: true },
            { room: "Room 8", status: "Pending", ok: false },
            { room: "Room 3", status: "Late", ok: false },
          ],
        },
        rooms: {
          cells: [
            { label: "01", filled: true },
            { label: "02", filled: true },
            { label: "03", filled: false },
            { label: "04", filled: true },
            { label: "05", filled: true },
            { label: "06", filled: false },
            { label: "07", filled: true },
            { label: "08", filled: true },
          ],
        },
        reports: {
          title: "July 2026 Report",
          lines: [
            { label: "Income", value: "Rp 8.5M" },
            { label: "Expense", value: "Rp 1.2M" },
            { label: "Profit", value: "Rp 7.3M" },
          ],
        },
      },
    },
    midCta: {
      title: "Ready to organize your boarding house?",
      subtitle: "Sign up free, verify your email, and manage from the dashboard right away.",
      button: "Start Free Now",
    },
    problems: {
      title: "Still managing the old way?",
      subtitle: "Most boarding house owners hit the same walls every month",
      items: [
        {
          title: "Messy records",
          desc: "Tenant and payment data in notebooks or Excel — hard to track as you add rooms.",
        },
        {
          title: "Forgotten invoices",
          desc: "Without automated reminders, late payments pile up and chase-down gets exhausting.",
        },
        {
          title: "Multiple properties, one brain",
          desc: "Hard to see vacant rooms and revenue when you run more than one property.",
        },
      ],
    },
    support: {
      title: "Questions? Chat our team",
      subtitle: "KosKit support helps you get started — from setup to Xendit & WhatsApp integration.",
      waCta: "Chat on WhatsApp",
      waNote: "Fast response · English & Indonesian · Free consultation",
      emailLabel: "Or email",
      responseNote: "We usually reply within business hours",
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
          message: "Hi Rina, Kos Melati room A2 bill Rp 850,000 due Jul 5. Pay link: koskit.id/bayar/...",
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
      title: "Get started in 3 easy steps",
      subtitle: "From sign-up to automated reports — usually done in one afternoon",
      steps: [
        { step: "01", title: "Sign up & verify email", desc: "Create an account in seconds. Verify your email, then open the dashboard.", visual: "verify" },
        { step: "02", title: "Add property & rooms", desc: "Enter your boarding house, room list, and rent prices through simple forms.", visual: "rooms" },
        { step: "03", title: "Manage from anywhere", desc: "Track payments, room availability, and reports on phone or laptop.", visual: "manage" },
      ],
      visuals: {
        verify: { email: "owner@kosanda.id", verified: "Verified" },
        rooms: { rooms: ["01", "02", "03", "04", "05", "06", "07", "08", "09"], caption: "9 rooms · 7 occupied" },
        manage: {
          days: ["Mon", "Tue", "Wed", "Thu"],
          payments: [
            { name: "Room A1", status: "Paid", ok: true },
            { name: "Room B2", status: "Pending", ok: false },
          ],
        },
      },
    },
    testimonials: {
      title: "Trusted by property owners",
      items: [
        {
          name: "Pak Budi",
          role: "2 properties, Bandung",
          text: "Bills used to be late because I forgot manual WhatsApp reminders. Now auto-generate + reminders — collections up 30%.",
          avatar: "PB",
          stars: 5,
        },
        {
          name: "Bu Siti",
          role: "Women's boarding house, Depok",
          text: "The tenant portal changed everything. They pay via QRIS themselves — I just check the dashboard.",
          avatar: "BS",
          stars: 5,
        },
        {
          name: "Hendra",
          role: "12 rooms, Surabaya",
          text: "I hand the PDF report straight to my wife for bookkeeping. Much cleaner than Excel.",
          avatar: "HE",
          stars: 5,
        },
      ],
    },
    pricing: {
      title: "Transparent pricing",
      subtitle: "Start free, upgrade anytime. No credit card required.",
      popular: "Most Popular",
      perMonth: "/month",
      freeForever: "forever",
      cta: "Try Free",
      ctaFree: "Start Free",
      plans: [
        {
          name: "Early Adopter",
          badge: "First 50 Slots",
          desc: "Founding users",
          price: 0,
          priceNote: "onboarding bonus",
          accent: true,
          features: ["30-day full Pro trial", "20% off upgrades forever", "Priority WA onboarding", "Early access to new features"],
          pop: false,
        },
        {
          name: "Free",
          desc: "Start at zero",
          price: 0,
          features: ["1 property · 3 rooms", "Tenant management", "Payment tracking", "Manual WA reminders", "Basic reports"],
          pop: false,
        },
        {
          name: "Pro",
          desc: "For serious owners",
          price: 199000,
          features: ["5 properties · 50 rooms", "Tenant portal + QRIS", "Calendar & alerts", "WA broadcast", "PDF & CSV reports"],
          pop: true,
        },
        {
          name: "Business",
          desc: "Scale operators",
          price: 399000,
          features: ["Unlimited properties & rooms", "All Pro features", "Priority support", "Custom domain", "30-min onboarding call"],
          pop: false,
        },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        { q: "What is KosKit?", a: "KosKit is boarding house management software for Indonesian property owners. One dashboard for tenants, bills, WhatsApp reminders, tenant portal, and financial reports." },
        { q: "Is KosKit free?", a: "There's a forever-free plan (1 property, 3 rooms). The first 50 signups get Early Adopter bonus: 30 days of full Pro access plus an upgrade discount. Paid plans from Rp 199K/month." },
        { q: "How is it different from Excel?", a: "Spreadsheets break down as you add rooms. KosKit unifies tenants, payments, and room status — plus automated reminders, tenant portal, and reports without manual math." },
        { q: "Can I manage multiple properties?", a: "Yes. Pro supports 5 properties, Business is unlimited. Each property has its own rooms, tenants, and reports — one dashboard." },
        { q: "Can tenants check their own bills?", a: "Yes. Each tenant gets a unique portal link to view bills, payment history, and pay via QRIS." },
        { q: "Is it beginner-friendly?", a: "Yes. Sign up, verify email, add your property through simple forms, and manage from one dashboard. Setup guide and WhatsApp support included." },
        { q: "How do WhatsApp reminders work?", a: "Connect Fonnte in Settings, then send bulk reminders to unpaid tenants. Simulation mode works without an API key." },
        { q: "Where can I use it?", a: "KosKit runs in your phone or laptop browser — no complicated install. Just open koskit.id after signing up." },
        { q: "Is my data secure?", a: "Your data is only accessible to your account. We don't sell tenant data. Login is protected with rate limits and email verification." },
      ],
    },
    cta: {
      title: "Your boarding house is running — time to organize it",
      subtitle: "Sign up free, add your property data, see results right away.",
      button: "Get Started",
    },
    footer: { login: "Log in", register: "Sign up" },
  },
};

export function getLandingCopy(locale: Locale): LandingCopy {
  return landingCopy[locale];
}