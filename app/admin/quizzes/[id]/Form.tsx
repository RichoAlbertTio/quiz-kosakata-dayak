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
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">✨ Editor Kuis</h1>
          <p className="text-green-600">Buat dan edit kuis dengan mudah</p>
        </div>

        <Card className="border-2 border-green-200 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
            <CardTitle className="text-xl flex items-center gap-2">
              📝 Informasi Kuis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-2">
              <Label className="text-green-700 font-semibold flex items-center gap-2">
                🏷️ Judul
              </Label>
              <Input 
                {...form.register("title")} 
                className="border-green-300 focus:border-green-500 focus:ring-green-200 rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-green-700 font-semibold flex items-center gap-2">
                📄 Deskripsi
              </Label>
              <Textarea 
                {...form.register("description")} 
                className="border-green-300 focus:border-green-500 focus:ring-green-200 rounded-lg min-h-[100px]"
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="flex-1 space-y-2">
                <Label className="text-green-700 font-semibold flex items-center gap-2">
                  📂 Kategori
                </Label>
                <select 
                  className="border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg p-3 w-full bg-white transition-all duration-200" 
                  {...form.register("categoryId", { valueAsNumber: true })}
                >
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg border border-green-200">
                <Switch 
                  checked={!!form.watch("published")} 
                  onCheckedChange={(v) => form.setValue("published", v)}
                  className="data-[state=checked]:bg-green-600"
                />
                <Label className="text-green-700 font-semibold flex items-center gap-2">
                  🌟 Published
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {qFields.map((q, qi) => (
          <QuestionCard key={q.id} qi={qi} form={form} qCount={qFields.length} onRemove={() => rmQ(qi)} />
        ))}

        <div className="flex gap-4 justify-center pt-6">
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
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            ➕ Tambah Soal
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            💾 Simpan Perubahan
          </Button>
        </div>
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
    <Card className="border-2 border-dashed border-green-300 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:border-green-400">
      <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-t-lg">
        <CardTitle className="text-lg flex items-center gap-2">
          ❓ Soal #{qi + 1}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <Label className="text-green-700 font-semibold flex items-center gap-2">
              💭 Pertanyaan
            </Label>
            <Textarea 
              {...form.register(`questions.${qi}.prompt`)} 
              className="border-green-300 focus:border-green-500 focus:ring-green-200 rounded-lg min-h-[100px]"
            />
          </div>
          <div className="w-24 space-y-2">
            <Label className="text-green-700 font-semibold flex items-center gap-1">
              🔢 Order
            </Label>
            <Input 
              type="number" 
              {...form.register(`questions.${qi}.order`, { valueAsNumber: true })} 
              className="border-green-300 focus:border-green-500 focus:ring-green-200 rounded-lg text-center"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-green-700 font-semibold flex items-center gap-2">
            💡 Penjelasan (opsional)
          </Label>
          <Textarea 
            {...form.register(`questions.${qi}.explain`)} 
            className="border-green-300 focus:border-green-500 focus:ring-green-200 rounded-lg"
          />
        </div>
        
        <div className="space-y-4">
          <Label className="text-green-700 font-semibold flex items-center gap-2">
            ✅ Opsi Jawaban
          </Label>
          <div className="space-y-3">
            {cFields.map((c, ci) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200 hover:bg-green-100 transition-all duration-200">
                <input 
                  type="radio" 
                  name={`correct-${qi}`} 
                  checked={!!form.watch(`questions.${qi}.choices.${ci}.isCorrect`)} 
                  onChange={() => markCorrect(ci)}
                  className="w-4 h-4 text-green-600 focus:ring-green-500 border-green-300"
                />
                <Input 
                  className="flex-1 border-green-300 focus:border-green-500 focus:ring-green-200 rounded-lg" 
                  {...form.register(`questions.${qi}.choices.${ci}.text`)} 
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => rmC(ci)} 
                  disabled={cFields.length <= 2}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg px-3 py-2"
                >
                  🗑️ Hapus
                </Button>
              </div>
            ))}
          </div>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => addC({ text: "", isCorrect: false })}
            className="w-full bg-green-100 hover:bg-green-200 text-green-700 border-green-300 rounded-lg py-2 font-semibold transition-all duration-200"
          >
            ➕ Tambah Opsi
          </Button>
        </div>
        
        <div className="flex justify-between pt-4 border-t border-green-200">
          <Button 
            type="button" 
            variant="destructive" 
            onClick={onRemove} 
            disabled={qCount <= 1}
            className="bg-red-500 hover:bg-red-600 text-white rounded-lg px-4 py-2 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          >
            🗑️ Hapus Soal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}