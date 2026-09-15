import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import {
  School,
  GraduationCap,
  ClipboardCheck,
  FileText,
  Award,
  ArrowRight,
  ShieldCheck,
  LogIn,
  Users,
} from 'lucide-react';

// ─── Static product preview data (display only, no functionality) ───────────
const PREVIEW_STUDENTS = [
  { name: 'Rahul Patil',    roll: '01', status: 'present' },
  { name: 'Anjali Sharma',  roll: '02', status: 'absent'  },
  { name: 'Dev Rao',        roll: '03', status: 'present' },
  { name: 'Priya Nair',     roll: '04', status: 'present' },
];

const PREVIEW_STATS = [
  { label: 'Students',     value: '32',  color: 'text-blue-500'   },
  { label: 'Present',      value: '28',  color: 'text-emerald-500' },
  { label: 'Exams',        value: '4',   color: 'text-amber-500'  },
  { label: 'Avg Score',    value: '78%', color: 'text-[#6C47FF]'  },
];

// ─── Section data ─────────────────────────────────────────────────────────────
const HOW_STEPS = [
  {
    num: '01',
    title: 'Create Account',
    desc: 'Sign up with your name, email, and phone number.',
  },
  {
    num: '02',
    title: 'Sign In',
    desc: 'Access your personal user dashboard securely.',
  },
  {
    num: '03',
    title: 'Request Teacher Access',
    desc: 'Submit your class division and capacity for admin review.',
  },
  {
    num: '04',
    title: 'Manage Your Class',
    desc: 'Unlock the full teacher workspace upon approval.',
    accent: true,
  },
];

const FEATURES = [
  {
    icon: <Users       className="h-4 w-4" />,
    title: 'Student Roster',
    desc: 'Keep track of student roll numbers, birth dates, and parent contacts in a clean digital format.',
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    icon: <ClipboardCheck className="h-4 w-4" />,
    title: 'Daily Attendance',
    desc: 'Log daily attendance with Present / Absent toggles and inspect individual student records.',
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  {
    icon: <FileText    className="h-4 w-4" />,
    title: 'Examinations',
    desc: 'Schedule unit tests and semester exams linked directly to your assigned class.',
    color: 'text-amber-500 bg-amber-500/10',
  },
  {
    icon: <Award       className="h-4 w-4" />,
    title: 'Marks Register',
    desc: 'Record subject scores — Math, Science, English and more — into a digital mark sheet.',
    color: 'text-purple-500 bg-purple-500/10',
  },
  {
    icon: <GraduationCap className="h-4 w-4" />,
    title: 'Class Management',
    desc: 'Manage your assigned class division, student capacity, and groupings from one place.',
    color: 'text-pink-500 bg-pink-500/10',
  },
  {
    icon: <ShieldCheck className="h-4 w-4" />,
    title: 'Role-Based Access',
    desc: 'Admin, Teacher, and User roles with appropriate permissions scoped to each level.',
    color: 'text-sky-500 bg-sky-500/10',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-200">

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur-md transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-md bg-[#6C47FF] flex items-center justify-center shrink-0">
              <School className="h-4 w-4 text-white" />
            </div>
            <div className="leading-none">
              <span className="text-sm font-bold tracking-tight text-foreground">SchlorX</span>
              <span className="hidden sm:block text-[10px] text-muted-foreground leading-none mt-0.5">School Management System</span>
            </div>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />
            <Link to="/login">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-3 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button
                size="sm"
                className="h-8 px-3 sm:px-4 text-xs sm:text-sm font-semibold rounded-md"
              >
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ──────────────────────────────────────────────────────────── */}
        <section className="lp-hero relative overflow-hidden py-12 sm:py-16">
          {/* Ambient purple radial glow — sits behind all content */}
          <div className="lp-hero-glow" aria-hidden="true" />

          {/* Hero text */}
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-16 text-center">

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[60px] font-bold tracking-[-0.04em] leading-[1.06] text-foreground max-w-3xl mx-auto">
              Manage your class without&nbsp;the paperwork.
            </h1>

            {/* Supporting copy */}
            <p className="mt-5 sm:mt-6 text-base sm:text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed font-normal">
              SchlorX makes student rosters, daily attendance, exam schedules, and marks tracking fast and organized.
            </p>

            {/* CTAs */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup">
                <Button size="lg" className="h-11 px-5 sm:px-6 font-semibold text-sm rounded-lg">
                  Create Account <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-5 sm:px-6 font-medium text-sm rounded-lg text-muted-foreground"
                >
                  <LogIn className="mr-2 h-4 w-4" aria-hidden="true" />
                  Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Product preview frame */}
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
            <div className="lp-preview-frame rounded-xl overflow-hidden">
              {/* Title bar */}
              <div className="lp-preview-titlebar flex items-center gap-1.5 px-3 py-2 border-b border-border/30">
                <span className="h-2 w-2 rounded-full bg-border/50" aria-hidden="true" />
                <span className="h-2 w-2 rounded-full bg-border/50" aria-hidden="true" />
                <span className="h-2 w-2 rounded-full bg-border/50" aria-hidden="true" />
                <span className="ml-2 text-[10px] text-muted-foreground/50 font-mono select-none">
                  SchlorX · Dashboard
                </span>
              </div>

              {/* Stats row */}
              <div className="p-3 sm:p-4 grid grid-cols-4 gap-2">
                {PREVIEW_STATS.map(({ label, value, color }) => (
                  <div
                    key={label}
                    className="rounded-lg border border-border/30 px-2 py-2.5 sm:p-3 space-y-1 bg-background/30"
                  >
                    <div className={`text-base sm:text-lg font-bold ${color}`}>{value}</div>
                    <div className="text-[9px] sm:text-[10px] text-muted-foreground">{label}</div>
                  </div>
                ))}
              </div>

              {/* Student list */}
              <div className="px-3 sm:px-4 pb-3 sm:pb-4 space-y-0">
                <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/50 py-1.5 px-1 border-b border-border/20">
                  <span>Student</span>
                  <span>Attendance</span>
                </div>
                {PREVIEW_STUDENTS.map(({ name, roll, status }) => (
                  <div
                    key={roll}
                    className="flex items-center justify-between py-2 border-b border-border/15 last:border-0 px-1"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-muted-foreground/40 font-mono w-4">{roll}</span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">{name}</span>
                    </div>
                    <span
                      className={`text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        status === 'present'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                    >
                      {status === 'present' ? 'Present' : 'Absent'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── How SchlorX Works ─────────────────────────────────────────────── */}
        <section className="lp-how-it-works py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">

            {/* Section header */}
            <div className="mb-12 sm:mb-16">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                How it works
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-foreground max-w-lg">
                From sign up to managing your class in minutes.
              </h2>
            </div>

            {/* Steps — gap-px grid creates 1px separators between cells */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px lp-steps-grid">
              {HOW_STEPS.map(({ num, title, desc, accent }) => (
                <div key={num} className="lp-step-item p-5 sm:p-6 space-y-3">
                  <span
                    className={`block text-xs font-mono font-bold tracking-widest ${
                      accent ? 'text-[#6C47FF]' : 'text-muted-foreground/35'
                    }`}
                  >
                    {num}
                  </span>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features ──────────────────────────────────────────────────────── */}
        <section className="lp-features py-16 sm:py-20 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">

            {/* Section header */}
            <div className="mb-12 sm:mb-16">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
                Features
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-foreground max-w-lg">
                Everything you need to run your classroom.
              </h2>
            </div>

            {/* Feature grid — gap-px creates separator lines */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px lp-features-grid">
              {FEATURES.map(({ icon, title, desc, color }) => (
                <div key={title} className="lp-feature-item p-5 sm:p-6 space-y-3 group">
                  <div
                    className={`inline-flex h-8 w-8 items-center justify-center rounded-lg ${color} shrink-0`}
                    aria-hidden="true"
                  >
                    {icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Final CTA ─────────────────────────────────────────────────────── */}
        <section className="lp-cta-section py-16 sm:py-20 px-4 sm:px-6">
          {/* Ambient glow */}
          <div className="lp-cta-glow" aria-hidden="true" />

          <div className="relative z-10 max-w-2xl mx-auto text-center space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] text-foreground">
              Ready to get started?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md mx-auto">
              Create your account and manage your academic records cleanly. No paperwork required.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link to="/signup">
                <Button size="lg" className="h-11 px-6 font-semibold text-sm rounded-lg">
                  Create Account Now <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link to="/login">
                <Button
                  variant="outline"
                  size="lg"
                  className="h-11 px-6 font-medium text-sm rounded-lg text-muted-foreground"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ────────────────────────────────────────────────────────────── */}
      <footer className="lp-footer border-t border-border/10 py-10 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded bg-[#6C47FF] flex items-center justify-center shrink-0">
              <School className="h-3 w-3 text-white" />
            </div>
            <span className="text-xs font-bold text-foreground">SchlorX</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">· School Management System</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} SchlorX Management. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
