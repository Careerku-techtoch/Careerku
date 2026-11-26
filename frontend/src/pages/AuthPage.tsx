import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  Moon,
  Sparkles,
  Sun,
} from 'lucide-react'
import { CareerkuLogo, ToastBanner } from '@/components'
import { useCareerku } from '@/hooks'

export type AuthMode = 'login' | 'register'

interface AuthPageProps {
  initialMode?: AuthMode
}

const ONBOARDING_STEPS = [
  {
    number: '1',
    title: 'Create your account',
    active: true,
  },
  {
    number: '2',
    title: 'Set academic profile & skills',
    active: false,
  },
  {
    number: '3',
    title: 'Unlock AI matches & tracker',
    active: false,
  },
] as const

const CAMPUS_TRUST_BADGES = ['Internships', 'Scholarships', 'Competitions', 'AI Skill Gap'] as const

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
  const navigate = useNavigate()
  const { profile, updateProfile, theme, setTheme, showToast } = useCareerku()

  const mode: AuthMode = initialMode
  const [fullName, setFullName] = useState('')
  const [university, setUniversity] = useState('')
  const [email, setEmail] = useState(initialMode === 'login' ? profile.email : '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<{
    fullName?: string
    email?: string
    password?: string
  }>({})

  const switchMode = (nextMode: AuthMode) => {
    setErrors({})
    navigate(nextMode === 'login' ? '/login' : '/register', { replace: true })
  }

  const validate = () => {
    const nextErrors: { fullName?: string; email?: string; password?: string } = {}

    if (mode === 'register' && fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.'
    }

    const emailTrimmed = email.trim()
    if (!emailTrimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed)) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (password.length < 6) {
      nextErrors.password =
        mode === 'login'
          ? 'Invalid password. Enter at least 6 characters.'
          : 'Password must be at least 6 characters.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)

    window.setTimeout(() => {
      if (mode === 'register') {
        updateProfile({
          name: fullName.trim(),
          email: email.trim(),
          ...(university.trim() ? { university: university.trim() } : {}),
        })
        showToast(
          `Welcome to Careerku, ${fullName.trim().split(' ')[0]}!`,
          'Complete your GPA and skills to unlock personalized match scores.',
          'success',
        )
        setIsSubmitting(false)
        navigate('/profile')
      } else {
        if (email.trim() && email.trim() !== profile.email) {
          updateProfile({ email: email.trim() })
        }
        showToast(
          `Welcome back, ${profile.name.split(' ')[0]}!`,
          'Your dashboard, matches, and document tracker are ready.',
          'success',
        )
        setIsSubmitting(false)
        navigate('/dashboard')
      }
    }, 350)
  }

  const handleOAuth = (provider: 'Google' | 'GitHub') => {
    showToast(
      `Signed in with ${provider}`,
      `Continuing as ${profile.name} (${profile.university}).`,
      'success',
    )
    navigate('/dashboard')
  }

  const handleForgotPassword = () => {
    const targetEmail = email.trim() || profile.email
    showToast(
      'Password reset link sent',
      `Check ${targetEmail} for instructions to reset your password.`,
      'info',
    )
  }

  return (
    <>
      <div className="grid min-h-screen w-full grid-cols-1 bg-[var(--bg-card)] text-[var(--text-primary)] lg:grid-cols-12">
        {/* ================================================================= */}
        {/* LEFT SHOWCASE PANEL (Warm Editorial Photo + Floating Glass Card)  */}
        {/* ================================================================= */}
        <div className="p-3 sm:p-4 lg:col-span-6 lg:p-5">
          <div className="relative flex h-full min-h-[380px] w-full flex-col justify-between overflow-hidden rounded-[28px] bg-[#16181c] p-7 text-white sm:p-10 lg:min-h-[calc(100vh-2.5rem)] lg:p-11">
            {/* Editorial Campus Collaboration Background Photography */}
            <img
              src="/images/auth-campus.jpg"
              alt="Indonesian undergraduate students collaborating with a laptop and notebook in a sunlit campus atrium"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_35%]"
            />

            {/* Balanced Editorial Scrim: Keeps Subjects Vivid While Ensuring Crisp Text */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0d0f13]/90 via-[#0d0f13]/20 to-[#0d0f13]/55"
            />

            {/* Subtle Top-Right Brand Indigo Tint */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 65% 50% at 85% 15%, rgba(82, 87, 229, 0.24) 0%, transparent 70%)',
              }}
            />

            {/* Top Bar inside Showcase Panel */}
            <div className="relative z-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="cursor-pointer transition-opacity hover:opacity-85"
              >
                <CareerkuLogo size="md" showWordmark inverted />
              </button>

              <nav
                aria-label="Landing shortcuts"
                className="hidden items-center gap-5 text-xs font-medium text-white/80 sm:flex"
              >
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="cursor-pointer hover:text-white"
                >
                  Home
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/discover')}
                  className="cursor-pointer hover:text-white"
                >
                  Opportunities
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/analyze')}
                  className="cursor-pointer hover:text-white"
                >
                  AI Skill Gap
                </button>
              </nav>
            </div>

            {/* Bottom Showcase Copy (Adapts cleanly between Login & Register) */}
            <div className="relative z-10 mt-auto pt-6">
              {mode === 'login' ? (
                <>
                  {/* Social Proof Glass Pill (Spacious Initials Avatar Badges) */}
                  <div className="mb-5 inline-flex items-center gap-3 rounded-full border border-white/20 bg-black/35 py-1.5 pl-2 pr-4 backdrop-blur-md">
                    <div className="flex -space-x-1.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#a6aaf7] text-[10px] font-bold leading-none tracking-tight text-[#14161a] ring-2 ring-[#16181c]/80">
                        RP
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#f5d061] text-[10px] font-bold leading-none tracking-tight text-[#14161a] ring-2 ring-[#16181c]/80">
                        NK
                      </span>
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-300 text-[10px] font-bold leading-none tracking-tight text-[#14161a] ring-2 ring-[#16181c]/80">
                        DA
                      </span>
                    </div>
                    <span className="text-xs font-medium text-white/95">
                      Trusted by 1,000+ undergraduates
                    </span>
                  </div>

                  <h1 className="max-w-md text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[46px]">
                    Your career path,
                    <br />
                    always in focus.
                  </h1>
                  <p className="mt-4 max-w-md text-xs leading-relaxed text-white/80 sm:text-sm">
                    Careerku keeps your verified internships, scholarships, AI skill gap
                    analysis, and application checklists flowing in one calm workspace.
                  </p>
                </>
              ) : (
                <>
                  {/* Onboarding Pill + 3 Step Cards (Ninth Signature) */}
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/35 px-3.5 py-1.5 text-[11px] font-medium text-white/95 backdrop-blur-md">
                    <Sparkles className="h-3.5 w-3.5 text-[#a6aaf7]" />
                    <span>Join Careerku in 3 simple steps</span>
                  </div>

                  <h1 className="max-w-md text-3xl font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[44px]">
                    Start your journey
                    <br />
                    with clear direction.
                  </h1>
                  <p className="mt-3 max-w-md text-xs leading-relaxed text-white/80 sm:text-sm">
                    Set up your student account once and get instant eligibility matching plus
                    tailored portfolio ideas.
                  </p>

                  {/* 3 Onboarding Step Cards */}
                  <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {ONBOARDING_STEPS.map((step) => (
                      <div
                        key={step.number}
                        className={`flex min-h-[108px] flex-col justify-between rounded-2xl p-4 transition-all ${
                          step.active
                            ? 'bg-white text-[#181a1d] shadow-lg'
                            : 'border border-white/20 bg-black/35 text-white/90 backdrop-blur-md'
                        }`}
                      >
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                            step.active
                              ? 'bg-[#191b1e] text-white'
                              : 'bg-white/15 text-white/90'
                          }`}
                        >
                          {step.number}
                        </span>
                        <p className="mt-4 text-xs font-semibold leading-snug">{step.title}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* RIGHT FORM PANEL (Sorcerer Minimal Canvas + Aura Flow Form UX)    */}
        {/* ================================================================= */}
        <div className="flex flex-col justify-between px-6 py-6 sm:px-12 lg:col-span-6 lg:px-16 lg:py-8">
          {/* Top Utility Row: Back to Home + Theme Toggle */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Home</span>
            </button>

            <button
              type="button"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
          </div>

          {/* Main Centered Auth Form */}
          <div className="mx-auto my-auto w-full max-w-[420px] py-8">
            {/* Brand Emblem + Mode Toggle */}
            <div className="mb-6 flex items-center justify-between gap-4">
              <CareerkuLogo size="md" />

              <div className="inline-flex rounded-full border border-[var(--border-subtle)] bg-[var(--bg-sheet)] p-1">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    mode === 'login'
                      ? 'bg-[#191b1e] text-white shadow-2xs dark:bg-[#f1f2ea] dark:text-[#181a18]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('register')}
                  className={`cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                    mode === 'register'
                      ? 'bg-[#191b1e] text-white shadow-2xs dark:bg-[#f1f2ea] dark:text-[#181a18]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold tracking-[-0.025em] text-[var(--text-primary)] sm:text-[28px]">
                {mode === 'login' ? 'Welcome Back!' : 'Create your account'}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-[13px]">
                {mode === 'login'
                  ? 'Enter your credentials to access your Careerku dashboard and matches.'
                  : 'Get started for free and match with verified internships, scholarships, and competitions.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {mode === 'register' && (
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="auth-fullname"
                      className="mb-1.5 block text-xs font-semibold text-[var(--text-primary)]"
                    >
                      Full Name
                    </label>
                    <input
                      id="auth-fullname"
                      type="text"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value)
                        if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }))
                      }}
                      placeholder="Raka Pratama"
                      className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none sm:text-[13px] ${
                        errors.fullName
                          ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-500/10'
                          : 'border-transparent bg-[var(--bg-subtle)] focus:border-[var(--border-strong)] focus:bg-[var(--bg-card)]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-500">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="auth-university"
                      className="mb-1.5 block text-xs font-semibold text-[var(--text-primary)]"
                    >
                      University <span className="font-normal text-[var(--text-muted)]">(Optional)</span>
                    </label>
                    <input
                      id="auth-university"
                      type="text"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      placeholder="Universitas Indonesia"
                      className="w-full rounded-xl border border-transparent bg-[var(--bg-subtle)] px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--border-strong)] focus:bg-[var(--bg-card)] focus:outline-none sm:text-[13px]"
                    />
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label
                  htmlFor="auth-email"
                  className="mb-1.5 block text-xs font-semibold text-[var(--text-primary)]"
                >
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  placeholder="student@university.ac.id"
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none sm:text-[13px] ${
                    errors.email
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-500/10'
                      : 'border-transparent bg-[var(--bg-subtle)] focus:border-[var(--border-strong)] focus:bg-[var(--bg-card)]'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-500">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Password Input with Show/Hide Toggle */}
              <div>
                <label
                  htmlFor="auth-password"
                  className="mb-1.5 block text-xs font-semibold text-[var(--text-primary)]"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="auth-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                    }}
                    placeholder="Enter your password"
                    className={`w-full rounded-xl border py-2.5 pl-3.5 pr-10 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none sm:text-[13px] ${
                      errors.password
                        ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-500/10'
                        : 'border-transparent bg-[var(--bg-subtle)] focus:border-[var(--border-strong)] focus:bg-[var(--bg-card)]'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {errors.password ? (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-rose-500">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                ) : mode === 'register' ? (
                  <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
                    Must be at least 6 characters.
                  </p>
                ) : null}
              </div>

              {/* Remember Me + Forgot Password (Login Mode) */}
              {mode === 'login' && (
                <div className="flex items-center justify-between pt-0.5">
                  <button
                    type="button"
                    onClick={() => setRememberMe((prev) => !prev)}
                    className="inline-flex cursor-pointer items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-sm border transition-colors ${
                        rememberMe
                          ? 'border-[#191b1e] bg-[#191b1e] text-white dark:border-[#f1f2ea] dark:bg-[#f1f2ea] dark:text-[#181a18]'
                          : 'border-[var(--border-strong)] bg-transparent'
                      }`}
                    >
                      {rememberMe && <Check className="h-3 w-3" strokeWidth={3} />}
                    </span>
                    <span>Remember me</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="cursor-pointer text-xs font-semibold text-[var(--accent-indigo)] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Primary Submit CTA (Sorcerer Solid Charcoal Button) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="careerku-btn-primary mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:text-[13px]"
              >
                <span>
                  {isSubmitting
                    ? mode === 'login'
                      ? 'Signing in...'
                      : 'Creating account...'
                    : mode === 'login'
                      ? 'Log In'
                      : 'Get Started'}
                </span>
                {!isSubmitting && <ArrowRight className="h-3.5 w-3.5" />}
              </button>
            </form>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
              <span className="text-[11px] font-medium text-[var(--text-muted)]">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-[var(--border-subtle)]" />
            </div>

            {/* OAuth Row (Google & GitHub) */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleOAuth('Google')}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2.5 text-xs font-semibold text-[var(--text-primary)] shadow-2xs transition-colors hover:bg-[var(--bg-sheet)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuth('GitHub')}
                className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-card)] py-2.5 text-xs font-semibold text-[var(--text-primary)] shadow-2xs transition-colors hover:bg-[var(--bg-sheet)]"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </button>
            </div>

            {/* Bottom Mode Switch Prompt */}
            <p className="mt-6 text-center text-xs text-[var(--text-secondary)]">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('register')}
                    className="cursor-pointer font-semibold text-[var(--text-primary)] underline-offset-2 hover:underline"
                  >
                    Sign up
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => switchMode('login')}
                    className="cursor-pointer font-semibold text-[var(--text-primary)] underline-offset-2 hover:underline"
                  >
                    Log in
                  </button>
                </>
              )}
            </p>
          </div>

          {/* Bottom Trust Strip (Sorcerer "Backed By" Footer Touch) */}
          <div className="mx-auto w-full max-w-[420px] border-t border-[var(--border-subtle)]/80 pt-4">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              One Workspace For
            </p>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[var(--text-secondary)]">
              {CAMPUS_TRUST_BADGES.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ToastBanner />
    </>
  )
}
