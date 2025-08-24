// app/admin/quizzes/[id]/Form.tsx
"use client";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

const ChoiceZ = z.object({ text: z.string().min(1), isCorrect: z.boolean().default(false) });
const QuestionZ = z.object({
  prompt: z.string().min(1),
  explain: z.string().optional(),
  order: z.number().int().min(1),
  choices: z.array(ChoiceZ).min(2),
});
const FormZ = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.coerce.number().int().positive(),
  published: z.boolean().default(true),
  questions: z.array(QuestionZ).min(1),
});

type FormInput = z.input<typeof FormZ>;
type FormOutput = z.output<typeof FormZ>;

type Props = {
  cats: { id: number; name: string }[];
  initial: FormOutput;
  quizId?: number;
};

export default function Form({ cats, initial, quizId }: Props) {
  const form = useForm<FormInput, unknown, FormOutput>({ resolver: zodResolver(FormZ), defaultValues: initial });
  const { fields: qFields, append: addQ, remove: rmQ } = useFieldArray({ control: form.control, name: "questions" });

  const onSubmit: SubmitHandler<FormOutput> = async (values) => {
    for (const q of values.questions) {
      if (q.choices.filter((c) => c.isCorrect).length !== 1) {
        alert("Tiap pertanyaan harus punya tepat 1 jawaban benar.");
        return;
      }
    }
    const res = await fetch(`/api/admin/quizzes${quizId ? `/${quizId}` : ""}`, {
      method: quizId ? "PATCH" : "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) alert(await res.text());
    else alert("Tersimpan");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Kuis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Judul</Label>
            <Input {...form.register("title")} />
          </div>
          <div>
            <Label>Deskripsi</Label>
            <Textarea {...form.register("description")} />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-1/2">
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
              <Switch checked={!!form.watch("published")} onCheckedChange={(v) => form.setValue("published", v)} />
              <Label>Published</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {qFields.map((q, qi) => (
        <QuestionCard key={q.id} qi={qi} form={form} qCount={qFields.length} onRemove={() => rmQ(qi)} />
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
        <Button onClick={form.handleSubmit(onSubmit)}>Simpan Perubahan</Button>
      </div>
    </div>
  );
}

type QProps = { qi: number; qCount: number; onRemove: () => void; form: ReturnType<typeof useForm<FormInput, unknown, FormOutput>> };

function QuestionCard({ qi, qCount, onRemove, form }: QProps) {
  const {
    fields: cFields,
    append: addC,
    remove: rmC,
  } = useFieldArray({
    control: form.control,
    name: `questions.${qi}.choices` as const,
  });

  function markCorrect(idx: number) {
    cFields.forEach((_, i) => form.setValue(`questions.${qi}.choices.${i}.isCorrect`, i === idx));
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
            <Textarea {...form.register(`questions.${qi}.prompt`)} />
          </div>
          <div className="w-24">
            <Label>Order</Label>
            <Input type="number" {...form.register(`questions.${qi}.order`, { valueAsNumber: true })} />
          </div>
        </div>
        <div>
          <Label>Penjelasan (opsional)</Label>
          <Textarea {...form.register(`questions.${qi}.explain`)} />
        </div>
        <div className="space-y-2">
          <Label>Opsi Jawaban</Label>
          {cFields.map((c, ci) => (
            <div key={c.id} className="flex items-center gap-2">
              <input type="radio" name={`correct-${qi}`} checked={!!form.watch(`questions.${qi}.choices.${ci}.isCorrect`)} onChange={() => markCorrect(ci)} />
              <Input className="flex-1" {...form.register(`questions.${qi}.choices.${ci}.text`)} />
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
