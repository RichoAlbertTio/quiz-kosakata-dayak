"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

type Material = {
  id: number;
  title: string;
  slug: string;
  contentMd: string;
  categoryId: number | null;
  published: boolean;
};

type Props = {
  material: Material;
  cats: { id: number; name: string }[];
};

export default function EditForm({ material, cats }: Props) {
  const r = useRouter();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof FormZ>>({
    resolver: zodResolver(FormZ),
    defaultValues: {
      title: material.title,
      slug: material.slug,
      contentMd: material.contentMd,
      categoryId: material.categoryId ?? cats[0]?.id,
      published: material.published,
    },
  });

  // Track changes
  useEffect(() => {
    const subscription = form.watch((value) => {
      const changed = value.title !== material.title || value.slug !== material.slug || value.contentMd !== material.contentMd || value.categoryId !== material.categoryId || value.published !== material.published;
      setHasChanges(changed);
    });
    return () => subscription.unsubscribe();
  }, [form, material]);

  function handleTitle(e: React.ChangeEvent<HTMLInputElement>) {
    const t = e.target.value;
    form.setValue("title", t);
    form.setValue("slug", toSlug(t));
  }

  async function onSubmit(v: z.infer<typeof FormZ>) {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/materials/${material.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(v),
      });
      if (res.ok) {
        setHasChanges(false);
        r.push("/admin/materials");
      } else {
        alert(await res.text());
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleBack() {
    if (hasChanges) {
      if (confirm("Ada perubahan yang belum disimpan. Yakin ingin keluar?")) {
        r.push("/admin/materials");
      }
    } else {
      r.push("/admin/materials");
    }
  }

  return (
    <div className="min-h-screen  p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-emerald-400 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-green-400 rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 border-2 border-teal-400 rounded-full"></div>
        <div className="absolute bottom-40 right-1/4 w-28 h-28 border-2 border-emerald-300 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full shadow-lg mb-4">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Edit Materi</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Perbarui materi pembelajaran bahasa Dayak</p>
        </div>

        {/* Material Info Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-blue-200 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">{material.id}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Mengedit: {material.title}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                <span>ID: #{material.id}</span>
                <span>•</span>
                <span>Slug: /{material.slug}</span>
                <span>•</span>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${material.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{material.published ? "Published" : "Draft"}</div>
                {hasChanges && (
                  <>
                    <span>•</span>
                    <div className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></div>
                      Ada Perubahan
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-emerald-100 overflow-hidden">
          {/* Card Header */}
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Edit Materi</CardTitle>
                <p className="text-emerald-100 mt-1">Perbarui informasi materi pembelajaran</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {/* Title Field */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5,4V7H10.5V19H13.5V7H19V4H5Z" />
                </svg>
                Judul Materi
              </Label>
              <Input
                {...form.register("title")}
                onChange={handleTitle}
                placeholder="Perkenalan Kosakata Hewan"
                className="h-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-base"
              />
            </div>

            {/* Slug Field */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10.59,13.41C11,13.8 11,14.4 10.59,14.81C10.2,15.2 9.6,15.2 9.19,14.81L7.77,13.39L9.19,12L10.59,13.41M14.5,4L16.04,5.54L4.5,17.08L2.96,15.54L14.5,4M15.91,9.19C15.5,8.78 15.5,8.2 15.91,7.79C16.32,7.38 16.9,7.38 17.31,7.79L18.72,9.2L17.31,10.61L15.91,9.19Z" />
                </svg>
                URL Slug
                <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">Auto-generated</span>
              </Label>
              <Input
                {...form.register("slug")}
                placeholder="slug-otomatis"
                className="h-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-base bg-gray-50"
                readOnly
              />
            </div>

            {/* Category Field */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z" />
                </svg>
                Kategori
              </Label>
              <div className="relative">
                <select
                  className="w-full h-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-base bg-white px-4 pr-10 appearance-none"
                  {...form.register("categoryId", { valueAsNumber: true })}
                >
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-600 pointer-events-none" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7,10L12,15L17,10H7Z" />
                </svg>
              </div>
            </div>

            {/* Published Switch */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
                    </svg>
                  </div>
                  <div>
                    <Label className="text-base font-semibold text-gray-700">Status Publikasi</Label>
                    <p className="text-sm text-gray-600">Tentukan apakah materi akan dipublikasikan</p>
                  </div>
                </div>
                <Switch checked={form.watch("published")} onCheckedChange={(v: boolean) => form.setValue("published", v)} className="data-[state=checked]:bg-emerald-600" />
              </div>
            </div>

            {/* Content Field */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Konten Materi
                <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Markdown</span>
              </Label>
              <div className="relative">
                <Textarea
                  rows={12}
                  {...form.register("contentMd")}
                  placeholder="# Judul Materi

## Pengenalan
Tuliskan pengenalan materi di sini...

## Kosakata
- **Kata 1**: Arti kata
- **Kata 2**: Arti kata

## Contoh Penggunaan
Berikan contoh penggunaan dalam kalimat..."
                  className="border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-base font-mono leading-relaxed resize-none"
                />
                <div className="absolute top-3 right-3">
                  <div className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-xs font-medium">Markdown Supported</div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={form.handleSubmit(onSubmit)}
                  disabled={isSubmitting || !hasChanges}
                  className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Menyimpan...
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />
                      </svg>
                      {hasChanges ? "Simpan Perubahan" : "Perbarui Materi"}
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`/materials/${material.slug}`, "_blank")}
                  className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Preview
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all duration-200 disabled:opacity-50"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  {hasChanges ? "Batal" : "Kembali"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Helper Tips */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-emerald-200">
            <h3 className="font-semibold text-emerald-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
              </svg>
              Tips Edit Materi
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Pastikan konten sesuai dengan kategori</li>
              <li>• Periksa kembali ejaan dan tata bahasa</li>
              <li>• Update tanggal jika ada perubahan signifikan</li>
              <li>• Preview perubahan sebelum menyimpan</li>
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
            <h3 className="font-semibold text-green-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A3,3 0 0,1 15,5V11A3,3 0 0,1 12,14A3,3 0 0,1 9,11V5A3,3 0 0,1 12,2M19,11C19,14.53 16.39,17.44 13,17.93V21H11V17.93C7.61,17.44 5,14.53 5,11H7A5,5 0 0,0 12,16A5,5 0 0,0 17,11H19Z" />
              </svg>
              Kontrol Versi
            </h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Perubahan akan tersimpan otomatis</li>
              <li>• Slug akan diupdate jika judul berubah</li>
              <li>• Status publish dapat diubah kapan saja</li>
              <li>• Backup konten lama tersedia</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
