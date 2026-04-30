import Link from 'next/link';
import { ArrowRight, Bookmark, LayoutGrid, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-theme-bg">
      <nav className="container mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark className="w-8 h-8 text-theme-text" />
          <span className="text-xl font-bold text-theme-text">Indexio</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth" className="text-theme-text/80 hover:text-theme-text font-medium transition-colors">
            Log In
          </Link>
          <Link
            href="/auth?mode=signup"
            className="bg-theme-text hover:opacity-90 text-theme-bg px-5 py-2.5 rounded-full font-medium transition-all shadow-sm"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-24 pb-16 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-theme-text tracking-tight mb-6 max-w-4xl mx-auto leading-tight">
          Save and Organize Your Links <span className="opacity-80">Beautifully</span>
        </h1>
        <p className="text-xl text-theme-text/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          The smart, minimal, and beautiful way to manage your bookmarks. Say goodbye to cluttered browser tabs and lost resources.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
          <Link
            href="/auth?mode=signup"
            className="flex items-center gap-2 bg-theme-text hover:opacity-90 text-theme-bg px-8 py-4 rounded-full font-semibold text-lg transition-all shadow-xl hover:scale-105"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          <div className="bg-theme-box p-8 rounded-2xl shadow-sm border border-theme-border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-theme-bg text-theme-text rounded-xl flex items-center justify-center mb-6">
              <Bookmark className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-theme-text mb-3">Quick Save</h3>
            <p className="text-theme-text/80">Save any URL instantly with automatic title fetching and custom descriptions.</p>
          </div>
          <div className="bg-theme-box p-8 rounded-2xl shadow-sm border border-theme-border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-theme-bg text-theme-text rounded-xl flex items-center justify-center mb-6">
              <LayoutGrid className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-theme-text mb-3">Smart Folders</h3>
            <p className="text-theme-text/80">Organize your links into custom folders for work, personal projects, or inspiration.</p>
          </div>
          <div className="bg-theme-box p-8 rounded-2xl shadow-sm border border-theme-border hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-theme-bg text-theme-text rounded-xl flex items-center justify-center mb-6">
              <Star className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-theme-text mb-3">Pin Favorites</h3>
            <p className="text-theme-text/80">Keep your most frequently accessed links pinned right at the top of your dashboard.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
