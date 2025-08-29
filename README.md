# Final Project Next JS Sanbercode Batch 69 : Dayak Quiz

Aplikasi quiz interaktif berbasis web yang menampilkan kosakata dan budaya Dayak menggunakan Next.js 15, TypeScript, dan modern web technologies.

## 👨‍💻 Author

**Richo Albert Tio**  
📍 Asal: Palangkaraya  
🎓 Sanbercode Bootcamp Batch 69 - Next.js

## 📝 Tentang Proyek

**Dayak Quiz** adalah aplikasi web pembelajaran interaktif yang dirancang untuk memperkenalkan dan melestarikan kosakata serta budaya Dayak melalui sistem quiz yang menarik dan edukatif.

### ✨ Fitur Utama

- 🎯 **Quiz Interaktif** - Sistem quiz dengan berbagai tingkat kesulitan
- 📚 **Manajemen Materi** - CRUD lengkap untuk materi pembelajaran
- 🏷️ **Kategori Dinamis** - Organisasi konten berdasarkan kategori
- 👑 **Leaderboard** - Sistem peringkat dan skor pemain
- 🔐 **Autentikasi** - Login/register dengan NextAuth.js
- 👨‍💼 **Panel Admin** - Dashboard lengkap untuk manajemen konten
- 📱 **Responsive Design** - Optimized untuk semua device

### 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL dengan Drizzle ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + Shadcn UI
- **Icons**: Lucide React
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/yarn/pnpm

### Installation

1. Clone repository

```bash
git clone <repository-url>
cd quiz-kosata-dayak
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

```bash
cp .env.example .env.local
# Edit .env.local dengan konfigurasi database dan auth
```

4. Setup database

```bash
npm run db:push
npm run db:seed
```

5. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) untuk melihat aplikasi.

## 📁 Struktur Proyek

```
├── app/                    # App Router (Next.js 15)
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   └── quiz/              # Quiz gameplay
├── components/            # Reusable components
├── lib/                   # Utilities & configurations
└── public/               # Static assets
```

## 🎥 Demo Video

### Konten Video Presentasi:

- **Perkenalan**: Richo Albert Tio dari Palangkaraya
- **Judul Proyek**: Dayak Quiz - Aplikasi pembelajaran kosakata Dayak
- **Penjelasan Fitur**:
  - Sistem autentikasi dan role management
  - CRUD kategori dan materi pembelajaran
  - Quiz interaktif dengan scoring system
  - Leaderboard dan tracking progress
  - Responsive design untuk mobile dan desktop
- **Demo Fitur-fitur**:
  - Login/register user
  - Browse materi pembelajaran
  - Main quiz dan lihat skor
  - Admin panel untuk manajemen konten
  - Lihat leaderboard dan ranking

**Tags**: #NextJS #BootcampDigitalSkill #SanbercodeBatch69

## 🤝 Contributing

Contributions, issues, dan feature requests sangat welcome!

## 📄 License

This project is licensed under the MIT License.

## 📞 Contact

Richo Albert Tio - Final Project Sanbercode Batch 69

---

_Dibuat dengan ❤️ untuk melestarikan budaya Dayak melalui teknologi modern_
