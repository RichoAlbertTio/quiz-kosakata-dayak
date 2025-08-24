// app/admin/materials/new/Form.tsx
"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toSlug } from "@/lib/slug";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const FormZ = z.object({
  title: z.string().min(2).max(100),
  slug: z.string().min(2).max(100),
  contentMd: z.string().min(2).max(10000),
  categoryId: z.number().min(1),
  published: z.boolean(),
});

type Props = { cats: { id: number; name: string }[] };
export default function Form({ cats }: Props) {
  const r = useRouter();
  const form = useForm<z.infer<typeof FormZ>>({
    resolver: zodResolver(FormZ),
    defaultValues: { title: "", slug: "", contentMd: "", categoryId: cats[0]?.id, published: true },
  });

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const t = e.target.value;
    form.setValue("title", t);
    form.setValue("slug", toSlug(t));
  }

  async function onSubmit(v: z.infer<typeof FormZ>) {
    const res = await fetch("/api/admin/materials", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(v),
    });
    if (res.ok) {
      r.push("/admin/materials");
    } else {
      alert(await res.text());
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Buat Materi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Judul</Label>
            <Input {...form.register("title")} onChange={handleTitle} placeholder="Perkenalan Kosakata Hewan" />
          </div>
          <div>
            <Label>Slug</Label>
            <Input {...form.register("slug")} placeholder="slug-otomatis" />
          </div>
          <div>
            <Label>Kategori</Label>
            <select className="border rounded p-2 w-full" {...form.register("categoryId", { valueAsNumber: true })}>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={form.watch("published")} onCheckedChange={(v: boolean) => form.setValue("published", v)} />
            <Label>Published</Label>
          </div>
          <div>
            <Label>Konten (Markdown)</Label>
            <Textarea rows={10} {...form.register("contentMd")} placeholder={"# Judul\n\nIsi materi…"} />
          </div>
          <Button onClick={form.handleSubmit(onSubmit)}>Simpan</Button>
        </CardContent>
      </Card>
    </div>
  );
}
