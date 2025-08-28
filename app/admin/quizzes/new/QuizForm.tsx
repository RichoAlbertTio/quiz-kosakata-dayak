"use client";

import { useForm, useFieldArray, SubmitHandler, type Control, type UseFormWatch, type UseFormRegister, type UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ChoiceZ = z.object({
  text: z.string().min(1, "Wajib"),
  isCorrect: z.boolean().default(false),
});
const QuestionZ = z.object({
  prompt: z.string().min(1, "Pertanyaan wajib"),
  explain: z.string().optional(),
  order: z.number().int().min(1),
  choices: z.array(ChoiceZ).min(2, "Minimal 2 opsi"),
});
const FormZ = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.number().int().positive(),
  published: z.boolean().default(true),
  questions: z.array(QuestionZ).min(1),
});

// Input (what form holds) vs Output (what resolver returns)
// With defaults, some fields become optional on input type.
export type FormInput = z.input<typeof FormZ>;
export type FormOutput = z.output<typeof FormZ>;

type Props = { cats: { id: number; name: string }[] };

export default function QuizForm({ cats }: Props) {
  const r = useRouter();

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(FormZ),
    defaultValues: {
      title: "",
      description: "",
      categoryId: cats[0]?.id,
      published: true,
      questions: [
        {
          prompt: "",
          explain: "",
          order: 1,
          choices: [
            { text: "", isCorrect: true },
            { text: "", isCorrect: false },
          ],
        },
      ],
    },
  });

  const {
    fields: qFields,
    append: addQ,
    remove: rmQ,
  } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  // pastikan selalu ada tepat 1 isCorrect per pertanyaan (UX kecil)
  useEffect(() => {
    const sub = form.watch(() => {});
    return () => sub.unsubscribe();
  }, [form]);

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    // Validasi client: 1 jawaban benar per soal
    for (const q of values.questions) {
      if (q.choices.filter((c) => c.isCorrect).length !== 1) {
        alert("Tiap pertanyaan harus punya tepat 1 jawaban benar.");
        return;
      }
    }
    const res = await fetch("/api/admin/quizzes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      await res.json();
      r.push(`/admin`); // atau ke detail kuis
    } else {
      alert(await res.text());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 -z-10">
        <div className="absolute top-20 left-20 w-32 h-32 border-2 border-emerald-400 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border-2 border-green-400 rounded-full"></div>
        <div className="absolute bottom-20 left-1/3 w-40 h-40 border-2 border-teal-400 rounded-full"></div>
        <div className="absolute bottom-40 right-1/4 w-28 h-28 border-2 border-emerald-300 rounded-full"></div>
      </div>

      <div className="max-w-4xl mx-auto relative space-y-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-r from-emerald-600 to-green-600 rounded-full shadow-lg mb-4">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Buat Kuis Baru</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-400 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4">Buat kuis interaktif untuk pembelajaran bahasa Dayak</p>
        </div>

        {/* Main Quiz Info Card */}
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-2 border-emerald-100 overflow-hidden">
          {/* Card Header */}
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,3C13.05,3 14,3.95 14,5C14,6.05 13.05,7 12,7C10.95,7 10,6.05 10,5C10,3.95 10.95,3 12,3M14,21V12H10V21H8V9H16V21H14Z" />
                </svg>
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Informasi Kuis</CardTitle>
                <p className="text-emerald-100 mt-1">Atur detail utama kuis</p>
              </div>
            </div>
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 bg-emerald-300 rounded-full"></div>
              <div className="w-2 h-2 bg-green-300 rounded-full"></div>
              <div className="w-2 h-2 bg-teal-300 rounded-full"></div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {/* Title Field */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5,4V7H10.5V19H13.5V7H19V4H5Z" />
                </svg>
                Judul Kuis
              </Label>
              <Input {...form.register("title")} placeholder="Kuis Hewan Dasar" className="h-12 border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-base" />
            </div>

            {/* Description Field */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
                Deskripsi
                <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Opsional</span>
              </Label>
              <Textarea
                {...form.register("description")}
                placeholder="Jelaskan tentang kuis ini..."
                className="border-2 border-emerald-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 text-base resize-none"
                rows={3}
              />
            </div>

            {/* Category and Published */}
            <div className="grid md:grid-cols-2 gap-6">
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
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />
                      </svg>
                    </div>
                    <div>
                      <Label className="text-base font-semibold text-gray-700">Status Publikasi</Label>
                      <p className="text-xs text-gray-600">Tentukan apakah kuis akan dipublikasikan</p>
                    </div>
                  </div>
                  <Switch checked={!!form.watch("published")} onCheckedChange={(v) => form.setValue("published", v)} className="data-[state=checked]:bg-emerald-600" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pertanyaan Kuis</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-teal-400 mx-auto rounded-full"></div>
          </div>

          {qFields.map((q, qi) => (
            <QuestionCard key={q.id} qi={qi} qCount={qFields.length} onRemove={() => rmQ(qi)} control={form.control} watch={form.watch} register={form.register} setValue={form.setValue} />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-emerald-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="button"
              onClick={() =>
                addQ({
                  prompt: "",
                  explain: "",
                  order: qFields.length + 1,
                  choices: [
                    { text: "", isCorrect: true },
                    { text: "", isCorrect: false },
                  ],
                })
              }
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              Tambah Soal
            </Button>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17,9H7V7H17M17,13H7V11H17M14,17H7V15H14M12,3A1,1 0 0,1 13,4A1,1 0 0,1 12,5A1,1 0 0,1 11,4A1,1 0 0,1 12,3M19,3H14.82C14.4,1.84 13.3,1 12,1C10.7,1 9.6,1.84 9.18,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />
              </svg>
              Simpan Kuis
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

type QProps = {
  qi: number;
  qCount: number;
  onRemove: () => void;
  control: Control<FormInput>;
  watch: UseFormWatch<FormInput>;
  register: UseFormRegister<FormInput>;
  setValue: UseFormSetValue<FormInput>;
};

function QuestionCard({ qi, qCount, onRemove, control, watch, register, setValue }: QProps) {
  const {
    fields: cFields,
    append: addC,
    remove: rmC,
  } = useFieldArray({
    control,
    name: `questions.${qi}.choices` as const,
  });

  function markCorrect(idx: number) {
    // set hanya idx yang true
    cFields.forEach((_, i) => setValue(`questions.${qi}.choices.${i}.isCorrect`, i === idx));
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-2 border-dashed border-emerald-300 hover:border-solid hover:border-emerald-400 transition-all duration-200">
      <CardHeader className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white relative overflow-hidden">
        {/* Decorative Pattern */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-5 translate-x-5"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-5 -translate-x-5"></div>

        <div className="flex items-center justify-between relative">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg">{qi + 1}</div>
            <div>
              <CardTitle className="text-xl">Soal #{qi + 1}</CardTitle>
              <p className="text-teal-100 text-sm">Buat pertanyaan dan pilihan jawaban</p>
            </div>
          </div>
          {qCount > 1 && (
            <Button type="button" onClick={onRemove} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-200">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
              </svg>
              Hapus
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Question and Order */}
        <div className="grid md:grid-cols-4 gap-4">
          <div className="md:col-span-3 space-y-2">
            <Label className="text-base font-semibold text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />
              </svg>
              Pertanyaan
            </Label>
            <Textarea
              {...register(`questions.${qi}.prompt`)}
              placeholder='Contoh: Apa arti "Usuk" dalam bahasa Dayak?'
              className="border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-base resize-none"
              rows={2}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-base font-semibold text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M2,17H22V19H2V17M1.15,12.95L4,10.47L6.85,12.95L8.26,11.53L4,7.26L-0.26,11.53L1.15,12.95M22,15H12V13H22V15M22,11H12V9H22V11M22,7H12V5H22V7M2,2H6V4H4V6H2V2Z" />
              </svg>
              Urutan
            </Label>
            <Input
              type="number"
              {...register(`questions.${qi}.order`, { valueAsNumber: true })}
              className="h-10 border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-base"
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <Label className="text-base font-semibold text-gray-700 flex items-center">
            <svg className="w-4 h-4 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11,9H13V7H11M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,17H13V11H11V17Z" />
            </svg>
            Penjelasan
            <span className="ml-2 text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">Opsional</span>
          </Label>
          <Textarea
            {...register(`questions.${qi}.explain`)}
            placeholder="Penjelasan yang ditampilkan setelah menjawab soal..."
            className="border-2 border-teal-200 rounded-xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-200 text-base resize-none"
            rows={2}
          />
        </div>

        {/* Answer Choices */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold text-gray-700 flex items-center">
              <svg className="w-4 h-4 mr-2 text-teal-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z" />
              </svg>
              Pilihan Jawaban
            </Label>
            <Button
              type="button"
              onClick={() => addC({ text: "", isCorrect: false })}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
              </svg>
              Tambah Opsi
            </Button>
          </div>

          <div className="space-y-3">
            {cFields.map((c, ci) => (
              <div key={c.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center justify-center">
                  <input
                    type="radio"
                    name={`correct-${qi}`}
                    checked={!!watch(`questions.${qi}.choices.${ci}.isCorrect`)}
                    onChange={() => markCorrect(ci)}
                    className="w-5 h-5 text-emerald-600 border-2 border-gray-300 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    {...register(`questions.${qi}.choices.${ci}.text`)}
                    placeholder={`Opsi ${ci + 1}`}
                    className="border-2 border-gray-200 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                  />
                </div>
                {cFields.length > 2 && (
                  <Button type="button" onClick={() => rmC(ci)} className="bg-red-100 hover:bg-red-200 text-red-600 px-3 py-2 rounded-lg transition-all duration-200">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />
                    </svg>
                  </Button>
                )}
                {!!watch(`questions.${qi}.choices.${ci}.isCorrect`) && <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-medium">✓ Benar</div>}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
