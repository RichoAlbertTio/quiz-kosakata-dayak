import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";
import { users, categories, quizzes, questions, choices, materials } from "@/lib/db/schema";
import bcrypt from "bcryptjs";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  const [admin] = await db
    .insert(users)
    .values({
      name: "Admin",
      email: "admin@lexi.local",
      passwordHash: hash,
      role: "ADMIN",
    })
    .onConflictDoNothing()
    .returning();

  const [hewan] = await db.insert(categories).values({ name: "Hewan", slug: "hewan" }).onConflictDoNothing().returning();
  const [dasar] = await db.insert(categories).values({ name: "Dasar", slug: "dasar" }).onConflictDoNothing().returning();

  // Get categories if they already exist
  const existingHewan = hewan || (await db.select().from(categories).where(eq(categories.slug, "hewan")).limit(1))[0];
  const existingDasar = dasar || (await db.select().from(categories).where(eq(categories.slug, "dasar")).limit(1))[0];

  if (!existingHewan || !existingDasar) {
    console.error("Failed to create or find categories");
    return;
  }

  // Seed materials
  await db
    .insert(materials)
    .values([
      {
        title: "Pengenalan Bahasa Dayak",
        slug: "pengenalan-bahasa-dayak",
        contentMd: `# Pengenalan Bahasa Dayak

## Sejarah Bahasa Dayak

Bahasa Dayak adalah kelompok bahasa yang digunakan oleh suku Dayak di Kalimantan. Bahasa ini memiliki berbagai dialek yang tersebar di seluruh pulau Kalimantan.

## Dialek Utama

### 1. Dayak Ngaju
Bahasa Dayak Ngaju adalah salah satu dialek yang paling banyak digunakan di Kalimantan Tengah.

### 2. Dayak Iban
Dialek ini banyak digunakan di Kalimantan Barat dan Sarawak.

### 3. Dayak Kenyah
Tersebar di Kalimantan Timur dan Kalimantan Utara.

## Karakteristik Bahasa

- **Tata Bahasa**: Menggunakan struktur subjek-predikat-objek
- **Kosakata**: Banyak berkaitan dengan alam dan aktivitas sehari-hari
- **Pelafalan**: Memiliki nada yang khas

## Contoh Kosakata Dasar

| Dayak Ngaju | Indonesia | 
|-------------|-----------|
| Aku | Saya |
| Ikau | Kamu |
| Dia | Dia |
| Balai | Rumah |
| Danum | Air |

## Pentingnya Melestarikan Bahasa

Bahasa Dayak merupakan warisan budaya yang sangat berharga. Melestarikan bahasa ini berarti melestarikan identitas dan kearifan lokal suku Dayak.`,
        published: true,
        categoryId: existingDasar.id,
        authorId: admin!.id,
      },
      {
        title: "Kosakata Hewan dalam Bahasa Dayak",
        slug: "kosakata-hewan-dayak",
        contentMd: `# Kosakata Hewan dalam Bahasa Dayak

## Hewan Darat

### Mamalia
- **Asu** = Anjing
- **Bawei** = Babi
- **Manuk** = Ayam
- **Luwing** = Sapi
- **Kambing** = Kambing

### Hewan Liar
- **Binatang hutan** sangat beragam di Kalimantan:
- **Huang** = Orangutan
- **Tikus** = Tikus
- **Lalat** = Lalat

## Hewan Air

### Ikan
- **Iwak** = Ikan
- **Balanak** = Ikan mujaer
- **Baung** = Ikan baung

## Hewan Udara

### Burung
- **Punai** = Burung punai
- **Elang** = Elang
- **Gagak** = Gagak

> **Tip**: Banyak nama hewan dalam bahasa Dayak yang masih digunakan dalam percakapan sehari-hari.`,
        published: true,
        categoryId: existingHewan.id,
        authorId: admin!.id,
      },
      {
        title: "Tata Bahasa Dayak Ngaju",
        slug: "tata-bahasa-dayak-ngaju",
        contentMd: `# Tata Bahasa Dayak Ngaju

## Struktur Kalimat Dasar

Bahasa Dayak Ngaju menggunakan struktur **Subjek - Predikat - Objek** (SPO).

### Contoh:
- **Aku mamaca buku** = Saya membaca buku
- **Ikau manduan iwak** = Kamu memasak ikan

## Kata Ganti Orang

| Bahasa Dayak | Indonesia |
|--------------|-----------|
| Aku | Saya |
| Ikau | Kamu |
| Dia | Dia |
| Kami | Kami |
| Ikam | Kalian |
| Akan | Mereka |

## Kata Kerja

### Awalan "Man-"
Awalan "man-" digunakan untuk membentuk kata kerja aktif:
- **Maca** → **Mamaca** (membaca)
- **Duan** → **Manduan** (memasak)
- **Bawi** → **Mambawi** (membawa)

### Contoh Kalimat:
1. **Aku mamaca surat** = Saya membaca surat
2. **Dia manduan nasi** = Dia memasak nasi
3. **Kami mambawi buah** = Kami membawa buah

## Kata Sifat

Kata sifat biasanya diletakkan setelah kata benda:
- **Balai basar** = Rumah besar
- **Iwak halus** = Ikan kecil
- **Buah masak** = Buah matang`,
        published: false, // Draft material
        categoryId: existingDasar.id,
        authorId: admin!.id,
      },
    ])
    .onConflictDoNothing();

  const [quiz] = await db
    .insert(quizzes)
    .values({
      title: "Kuis Hewan Dasar",
      description: "Kosakata hewan (Dayak Ngaju)",
      categoryId: existingHewan.id,
      authorId: admin!.id,
      published: true,
    })
    .returning();

  const [q1] = await db.insert(questions).values({ quizId: quiz.id, prompt: 'Apa arti "Asu"?', order: 1 }).returning();

  await db.insert(choices).values([
    { questionId: q1.id, text: "Anjing", isCorrect: true },
    { questionId: q1.id, text: "Ayam" },
    { questionId: q1.id, text: "Lebah" },
    { questionId: q1.id, text: "Buaya" },
  ]);

  console.log("Seed OK");
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
