"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
  slug: string;
  createdAt: Date;
}

interface CategoriesClientProps {
  initialCategories: Category[];
}

export default function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editName, setEditName] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setEditName(category.name);
    setIsEditDialogOpen(true);
  };

  const handleUpdateCategory = async () => {
    if (!editingCategory || !editName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/categories/${editingCategory.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: editName.trim() }),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        setCategories((prev) => prev.map((cat) => (cat.id === editingCategory.id ? updatedCategory : cat)));
        setIsEditDialogOpen(false);
        setEditingCategory(null);
        setEditName("");
        router.refresh();
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      alert("Terjadi kesalahan saat mengupdate kategori");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (categoryId: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
        router.refresh();
      } else {
        alert("Terjadi kesalahan saat menghapus kategori");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Terjadi kesalahan saat menghapus kategori");
    }
  };

  return (
    <>
      {/* Categories List Card */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
          <CardTitle className="text-white flex items-center justify-between text-xl">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Daftar Kategori
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">{categories.length} kategori</span>
          </CardTitle>
        </div>
        <CardContent className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Belum ada kategori</h3>
              <p className="text-gray-500">Mulai dengan membuat kategori pertama Anda di atas.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((c, index) => (
                <div key={c.id} className="group">
                  <div className="bg-white border-2 border-gray-100 rounded-xl p-5 hover:border-blue-200 hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-sm mr-4">{index + 1}</div>
                          <div>
                            <div className="font-semibold text-gray-800 text-lg">{c.name}</div>
                            <div className="text-sm text-gray-500 flex items-center mt-1">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                              </svg>
                              /{c.slug}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleEdit(c)} variant="outline" className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 border-blue-300 text-blue-600 hover:bg-blue-50">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(c.id)}
                          variant="destructive"
                          className="opacity-70 group-hover:opacity-100 transition-opacity duration-200 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        >
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Edit Kategori</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <label htmlFor="editName" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Kategori
              </label>
              <Input id="editName" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Masukkan nama kategori..." className="w-full" />
            </div>
            <div className="flex gap-3 pt-4">
              <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="flex-1" disabled={isLoading}>
                Batal
              </Button>
              <Button onClick={handleUpdateCategory} className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700" disabled={isLoading || !editName.trim()}>
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Card */}
      {categories.length > 0 && (
        <Card className="shadow-lg border-0 bg-gradient-to-r from-green-600 to-blue-600">
          <CardContent className="p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-lg font-semibold mb-1">Total Kategori</h3>
                <p className="text-purple-100">Kategori yang telah dibuat</p>
              </div>
              <div className="text-4xl font-bold">{categories.length}</div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
