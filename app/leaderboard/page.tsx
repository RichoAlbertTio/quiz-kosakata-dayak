// app/leaderboard/page.tsx
import { db } from "@/lib/db";
import { quizAttempts, users, quizzes } from "@/lib/db/schema";
import { asc, desc, eq } from "drizzle-orm";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";

export const dynamic = "force-dynamic"; // selalu fresh

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  const ss = s % 60;
  return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

function fmtDate(d: string | Date) {
  const dd = new Date(d);
  return dd.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function LeaderboardPage() {
  const rows = await db
    .select({
      id: quizAttempts.id,
      score: quizAttempts.score,
      total: quizAttempts.total,
      durationS: quizAttempts.durationS,
      createdAt: quizAttempts.createdAt,
      userName: users.name,
      userEmail: users.email,
      quizTitle: quizzes.title,
    })
    .from(quizAttempts)
    .innerJoin(users, eq(users.id, quizAttempts.userId))
    .innerJoin(quizzes, eq(quizzes.id, quizAttempts.quizId))
    .orderBy(
      desc(quizAttempts.score), // skor tertinggi dulu
      asc(quizAttempts.durationS), // waktu paling cepat
      desc(quizAttempts.createdAt) // terbaru
    )
    .limit(10);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Leaderboard</h1>

      <Table>
        <TableCaption>Top 10 skor terbaru di semua kuis.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Kuis</TableHead>
            <TableHead>Skor</TableHead>
            <TableHead>Durasi</TableHead>
            <TableHead>Tanggal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                Belum ada data. Ayo kerjakan kuis pertama kamu!
              </TableCell>
            </TableRow>
          ) : (
            rows.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{r.userName || r.userEmail}</TableCell>
                <TableCell>{r.quizTitle}</TableCell>
                <TableCell>
                  <span className="font-medium">{r.score}</span>/{r.total}
                </TableCell>
                <TableCell>{fmtDuration(r.durationS)}</TableCell>
                <TableCell>{fmtDate(r.createdAt as unknown as string)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
