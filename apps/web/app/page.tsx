import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { Comparison } from "@/components/landing/Comparison";

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />
      <Hero />
      <Features />
      <Comparison />
      
      <footer className="py-12 bg-gray-50 border-t border-gray-200 text-center">
        <p className="text-gray-500 text-sm">© 2025 GrindLink. Built for the future of work.</p>
      </footer>
    </main>
  );
}