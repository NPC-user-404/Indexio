import Link from 'next/link';
import { ArrowRight, Bookmark, LayoutGrid, Star, Zap, Shield, Download } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-theme-bg overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-theme-bg/80 backdrop-blur-md border-b border-theme-border">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-theme-box rounded-lg flex items-center justify-center shadow-sm">
              <Bookmark className="w-4 h-4 text-theme-text" />
            </div>
            <span className="text-xl font-bold text-theme-text tracking-tight">Indexio</span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 bg-theme-text text-theme-bg px-5 py-2 rounded-full font-semibold text-sm hover:opacity-90 transition-all shadow-md hover:shadow-lg hover:scale-105 active:scale-100"
          >
            Open App <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative container mx-auto px-6 pt-24 pb-20 text-center">
        {/* Decorative blob */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, #9ECAD6 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative">
          <span className="inline-flex items-center gap-2 bg-theme-box/60 border border-theme-border text-theme-text text-xs font-semibold px-4 py-1.5 rounded-full mb-8 shadow-sm">
            <Zap className="w-3.5 h-3.5" />
            No sign-up required &mdash; works instantly
          </span>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-theme-text tracking-tight mb-6 leading-[1.1] max-w-4xl mx-auto">
            Save &amp; Organize<br />
            <span
              style={{
                background: 'linear-gradient(135deg, #748DAE 0%, #9ECAD6 50%, #748DAE 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Your Links Beautifully
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-theme-text/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            The smart, minimal bookmark manager that lives on your device. No accounts, no cloud sync, no clutter &mdash; just your links, organized your way.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/dashboard"
              id="hero-cta"
              className="flex items-center gap-2 bg-theme-text text-theme-bg px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100"
            >
              Open App Free <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-theme-text/50 flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Private &amp; local-first
            </p>
          </div>
        </div>

        {/* App Preview Card */}
        <div className="relative mt-20 max-w-4xl mx-auto">
          <div className="bg-theme-box rounded-3xl border border-theme-border shadow-2xl overflow-hidden">
            {/* Fake Navbar */}
            <div className="bg-theme-box/80 border-b border-theme-border px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bookmark className="w-5 h-5 text-theme-text" />
                <span className="font-bold text-theme-text text-sm">Indexio</span>
              </div>
              <div className="h-8 w-32 bg-theme-bg/60 rounded-xl border border-theme-border" />
              <div className="h-8 w-24 bg-theme-text/20 rounded-full" />
            </div>
            {/* Fake Content */}
            <div className="flex gap-0">
              <div className="w-48 bg-theme-bg/30 border-r border-theme-border p-4 hidden sm:block">
                {['All Links', 'Pinned', 'Trash'].map(item => (
                  <div key={item} className="h-8 rounded-lg bg-theme-bg/50 mb-2 flex items-center px-3">
                    <div className="w-16 h-2 bg-theme-text/30 rounded-full" />
                  </div>
                ))}
                <div className="mt-4 mb-2 h-2 w-12 bg-theme-text/20 rounded-full mx-3" />
                {['Design', 'Work', 'Dev'].map(f => (
                  <div key={f} className="h-7 rounded-lg bg-theme-bg/30 mb-1.5 mx-1 flex items-center px-3">
                    <div className="w-10 h-1.5 bg-theme-text/20 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="flex-1 p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { title: 'GitHub', desc: 'Code repository', pinned: true },
                  { title: 'Figma Design', desc: 'UI Mockups' },
                  { title: 'MDN Docs', desc: 'Web APIs reference' },
                  { title: 'Vercel', desc: 'Deployment dashboard' },
                  { title: 'Linear', desc: 'Project tracking' },
                  { title: 'Notion', desc: 'Team workspace' },
                ].map(card => (
                  <div key={card.title} className={`bg-theme-bg/60 rounded-2xl p-4 border ${card.pinned ? 'border-theme-text/30' : 'border-theme-border'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="h-3 w-20 bg-theme-text/40 rounded-full mb-1.5" />
                        <div className="h-2 w-14 bg-theme-text/20 rounded-full" />
                      </div>
                      {card.pinned && <div className="w-4 h-4 bg-amber-400/60 rounded-full" />}
                    </div>
                    <div className="h-2 w-full bg-theme-text/10 rounded-full mt-3" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Glow under card */}
          <div
            aria-hidden="true"
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 opacity-40 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse, #9ECAD6, transparent 70%)', filter: 'blur(20px)' }}
          />
        </div>
      </section>

      {/* ── Feature Cards ──────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-text mb-4">Everything you need, nothing you don&apos;t</h2>
          <p className="text-theme-text/60 max-w-xl mx-auto">A focused set of features that help you stay organized without getting in your way.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: <Bookmark className="w-6 h-6" />,
              title: 'Quick Save',
              desc: 'Save any URL instantly with a title, description, and folder assignment. No friction, no fuss.',
            },
            {
              icon: <LayoutGrid className="w-6 h-6" />,
              title: 'Smart Folders',
              desc: 'Organize links into custom folders or let Smart Context auto-categorize by domain.',
            },
            {
              icon: <Star className="w-6 h-6" />,
              title: 'Pin Favorites',
              desc: 'Keep your most-used links pinned at the top of your workspace for instant access.',
            },
            {
              icon: <Zap className="w-6 h-6" />,
              title: 'Instant Search',
              desc: 'Search across titles, URLs, and folders with filter toggles. Find anything in milliseconds.',
            },
            {
              icon: <Shield className="w-6 h-6" />,
              title: 'Private by Default',
              desc: 'No accounts, no tracking, no servers. Your data lives only on your device.',
            },
            {
              icon: <Download className="w-6 h-6" />,
              title: 'Export to PDF',
              desc: 'Export your entire workspace or individual folders to a clean PDF at any time.',
            },
          ].map(feature => (
            <div
              key={feature.title}
              className="group bg-theme-box/60 hover:bg-theme-box border border-theme-border hover:border-theme-text/30 p-7 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="w-11 h-11 bg-theme-bg rounded-xl flex items-center justify-center text-theme-text mb-5 shadow-sm group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-lg font-bold text-theme-text mb-2">{feature.title}</h3>
              <p className="text-sm text-theme-text/70 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="bg-theme-box/30 border-y border-theme-border py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-theme-text mb-4">How it works</h2>
            <p className="text-theme-text/60 max-w-xl mx-auto">Three simple steps. No setup required.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {[
              { step: '01', title: 'Open the App', desc: 'Click "Open App" — no account needed. You\'re in immediately.' },
              { step: '02', title: 'Save Links', desc: 'Hit "Add Link", paste a URL, give it a title. Done in seconds.' },
              { step: '03', title: 'Stay Organized', desc: 'Use folders, pins, search and export to manage your collection your way.' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-theme-text text-theme-bg flex items-center justify-center text-lg font-extrabold mx-auto mb-5 shadow-lg">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-theme-text mb-2">{item.title}</h3>
                <p className="text-sm text-theme-text/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ──────────────────────────────────────────── */}
      <section className="container mx-auto px-6 py-24 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-theme-text mb-5 leading-tight">
            Your bookmarks.<br />Your device. Your rules.
          </h2>
          <p className="text-theme-text/60 mb-10 text-lg">
            Start organizing in seconds &mdash; completely free, forever.
          </p>
          <Link
            href="/dashboard"
            id="bottom-cta"
            className="inline-flex items-center gap-2 bg-theme-text text-theme-bg px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-xl hover:shadow-2xl hover:scale-105 active:scale-100"
          >
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-5 text-xs text-theme-text/40">No sign-up &bull; No cloud &bull; No tracking</p>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-theme-border bg-theme-box/20">
        <div className="container mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-theme-box rounded-lg flex items-center justify-center">
              <Bookmark className="w-3.5 h-3.5 text-theme-text" />
            </div>
            <span className="font-bold text-theme-text text-sm">Indexio</span>
          </div>
          <p className="text-xs text-theme-text/40 text-center">
            Built for humans who value their time. Data stays local on your device.
          </p>
          <Link href="/dashboard" className="text-xs font-semibold text-theme-text/60 hover:text-theme-text transition-colors">
            Open App →
          </Link>
        </div>
      </footer>
    </div>
  );
}
