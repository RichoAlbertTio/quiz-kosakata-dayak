import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Users, Star, Play, Target, Leaf, Mountain, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-emerald-200/50 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Dayak Quiz</span>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-emerald-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                  <div className="w-1 h-1 bg-teal-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#materi" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
                Materi
              </a>
              <a href="#kuis" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
                Kuis
              </a>
              <a href="#leaderboard" className="text-gray-600 hover:text-emerald-600 transition-colors font-medium">
                Leaderboard
              </a>
             
            </div>
            <a href="/login">
              <Button className="hidden md:inline-flex bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                <Leaf className="mr-2 h-4 w-4" />
                Login
              </Button>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-40 h-40 border-2 border-emerald-400 rounded-full"></div>
          <div className="absolute top-40 right-32 w-32 h-32 border-2 border-green-400 rounded-full"></div>
          <div className="absolute bottom-20 left-1/3 w-48 h-48 border-2 border-teal-400 rounded-full"></div>
          <div className="absolute bottom-40 right-1/4 w-24 h-24 border-2 border-emerald-300 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Decorative Elements */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex space-x-2">
                  <Mountain className="h-6 w-6 text-emerald-300" />
                  <Leaf className="h-6 w-6 text-green-300" />
                  <Shield className="h-6 w-6 text-teal-300" />
                </div>
                <div className="h-px bg-gradient-to-r from-emerald-400 to-transparent flex-1"></div>
              </div>

              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Pelajari{" "}
                  <span className="relative">
                    <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text text-transparent">
                      Kosakata Dayak
                    </span>
                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                  </span>{" "}
                  dengan Mudah
                </h1>
                <p className="text-xl text-emerald-100 max-w-lg leading-relaxed">
                  Platform pembelajaran interaktif untuk menguasai bahasa tradisional Kalimantan. 
                  Jelajahi kekayaan budaya Dayak melalui kuis yang menyenangkan dan materi lengkap.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/login">
                  <Button className="group bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                    <Play className="mr-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    Mulai Kuis Sekarang
                  </Button>
                </Link>
               
              </div>
              
              <div className="flex items-center space-x-12 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-300">500+</div>
                  <div className="text-sm text-emerald-200">Kosakata</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-300">1000+</div>
                  <div className="text-sm text-green-200">Pengguna</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-teal-300">4.9</div>
                  <div className="text-sm text-teal-200 flex items-center justify-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    Rating
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 rounded-3xl rotate-6"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-2xl">
                <Image src="/img/bg-home.png" alt="Background" width={500} height={500} className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-emerald-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-block px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium mb-4">
              ✨ Fitur Unggulan
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800">
              Fitur Lengkap untuk{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Pembelajaran Optimal
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Jelajahi berbagai fitur yang dirancang khusus untuk membantu Anda menguasai 
              bahasa Dayak dengan efektif dan menyenangkan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8" id="materi">
            {/* Materi */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 bg-white border-2 border-emerald-100 hover:border-emerald-300 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500"></div>
              <CardHeader className="space-y-4 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">Materi Pembelajaran</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-gray-600 mb-6">
                  Akses koleksi lengkap kosakata bahasa Dayak dengan penjelasan makna, 
                  contoh penggunaan, dan audio pronunciation yang akurat dari penutur asli.
                </CardDescription>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span>Kosakata dan frasa</span>
                  </div>
                 
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-teal-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span>Contoh kalimat</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kuis */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 bg-white border-2 border-green-100 hover:border-green-300 overflow-hidden relative" id="kuis">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500"></div>
              <CardHeader className="space-y-4 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">Kuis Interaktif</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-gray-600 mb-6">
                  Uji kemampuan Anda dengan berbagai jenis kuis yang menantang. 
                  Dari pilihan ganda hingga terjemahan langsung, semuanya dirancang untuk mempercepat pembelajaran.
                </CardDescription>
                <div className="space-y-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span>Pilihan ganda</span>
                  </div>
                 
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-4 bg-white border-2 border-teal-100 hover:border-teal-300 overflow-hidden relative" id="leaderboard">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-green-500"></div>
              <CardHeader className="space-y-4 pb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">Papan Peringkat</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed text-gray-600 mb-6">
                  Kompetisi sehat dengan sesama pembelajar. Lihat progress Anda, 
                  raih achievement, dan jadilah yang terdepan dalam menguasai bahasa Dayak.
                </CardDescription>
                <div className="space-y-3">
         
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 flex-shrink-0"></div>
                    <span>Badges & achievements</span>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 lg:py-24 bg-gradient-to-br from-emerald-800 via-green-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border border-emerald-300 rounded-full"></div>
          <div className="absolute top-20 right-20 w-24 h-24 border border-green-300 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 border border-teal-300 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-block px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full font-medium mb-4">
              🌟 Dipercaya Ribuan Pengguna
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Bergabunglah dengan Komunitas Pembelajar
            </h2>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto">
              Ribuan orang telah mempercayai platform kami untuk mempelajari bahasa Dayak
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold mb-2 text-emerald-300">500+</div>
              <div className="text-emerald-100">Kosakata Tersedia</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Users className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold mb-2 text-green-300">1,000+</div>
              <div className="text-green-100">Pengguna Aktif</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Target className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold mb-2 text-teal-300">50+</div>
              <div className="text-teal-100">Kuis Tersedia</div>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Star className="h-10 w-10 text-white" />
              </div>
              <div className="text-4xl lg:text-5xl font-bold mb-2 text-yellow-300">95%</div>
              <div className="text-yellow-100">Tingkat Kepuasan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-emerald-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <div className="inline-block px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                🚀 Mulai Sekarang
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight">
                Siap Memulai Perjalanan{" "}
                <span className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  Belajar Bahasa Dayak
                </span>?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Bergabunglah dengan ribuan pembelajar lainnya dan mulai eksplorasi 
                kekayaan budaya Kalimantan melalui bahasa Dayak.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button className="group bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                  <Users className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Daftar Gratis Sekarang
                </Button>
              </Link>
             
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900 text-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Dayak Quiz</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-green-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-teal-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              <p className="text-emerald-200 text-sm leading-relaxed">
                Platform pembelajaran bahasa Dayak terdepan untuk melestarikan budaya Kalimantan.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-emerald-300">Pembelajaran</h3>
              <ul className="space-y-3 text-sm text-emerald-200">
                <li><a href="#" className="hover:text-white transition-colors">Materi Dasar</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kuis Interaktif</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-green-300">Komunitas</h3>
              <ul className="space-y-3 text-sm text-green-200">
                <li><a href="#" className="hover:text-white transition-colors">Leaderboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Forum Diskusi</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Achievement</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-6 text-teal-300">Bantuan</h3>
              <ul className="space-y-3 text-sm text-teal-200">
                <li><a href="#" className="hover:text-white transition-colors">Panduan</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Kontak</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/20 pt-8 text-center">
            <div className="flex justify-center space-x-6 mb-6">
              <div className="w-12 h-1 bg-emerald-400 rounded-full"></div>
              <div className="w-8 h-1 bg-green-400 rounded-full"></div>
              <div className="w-16 h-1 bg-teal-400 rounded-full"></div>
            </div>
            <p className="text-sm text-emerald-200">
              &copy; 2025 Dayak Quiz. Seluruh hak cipta dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}