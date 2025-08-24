// app/admin/quizzes/new/page.tsx
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

export default function QuizNewPage() {
  const r = useRouter();

  const form = useForm<FormInput, unknown, FormOutput>({
    resolver: zodResolver(FormZ),
    defaultValues: {
      title: "",
      description: "",
      categoryId: 1,
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
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Buat Kuis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Judul</Label>
            <Input {...form.register("title")} placeholder="Kuis Hewan Dasar" />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <Textarea {...form.register("description")} placeholder="Opsional" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1/2">
              <Label>Category ID</Label>
              <Input type="number" {...form.register("categoryId", { valueAsNumber: true })} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={!!form.watch("published")} onCheckedChange={(v) => form.setValue("published", v)} />
              <Label>Published</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {qFields.map((q, qi) => (
        <QuestionCard key={q.id} qi={qi} qCount={qFields.length} onRemove={() => rmQ(qi)} control={form.control} watch={form.watch} register={form.register} setValue={form.setValue} />
      ))}

      <div className="flex gap-2">
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
        >
          + Tambah Soal
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)}>Simpan Kuis</Button>
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
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>Soal #{qi + 1}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label>Pertanyaan</Label>
            <Textarea {...register(`questions.${qi}.prompt`)} placeholder='Contoh: Apa arti "Usuk" ?' />
          </div>
          <div className="w-24">
            <Label>Order</Label>
            <Input type="number" {...register(`questions.${qi}.order`, { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <Label>Penjelasan (opsional)</Label>
          <Textarea {...register(`questions.${qi}.explain`)} placeholder="Ditampilkan setelah submit" />
        </div>

        <div className="space-y-2">
          <Label>Opsi Jawaban</Label>
          {cFields.map((c, ci) => (
            <div key={c.id} className="flex items-center gap-2">
              <input type="radio" name={`correct-${qi}`} checked={!!watch(`questions.${qi}.choices.${ci}.isCorrect`)} onChange={() => markCorrect(ci)} />
              <Input className="flex-1" {...register(`questions.${qi}.choices.${ci}.text`)} placeholder={`Opsi ${ci + 1}`} />
              <Button type="button" variant="ghost" onClick={() => rmC(ci)} disabled={cFields.length <= 2}>
                Hapus
              </Button>
            </div>
          ))}
          <Button type="button" variant="secondary" onClick={() => addC({ text: "", isCorrect: false })}>
            + Tambah Opsi
          </Button>
        </div>

        <div className="flex justify-between pt-2">
          <Button type="button" variant="destructive" onClick={onRemove} disabled={qCount <= 1}>
            Hapus Soal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
