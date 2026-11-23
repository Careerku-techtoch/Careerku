import { Check, Info, X } from 'lucide-react'
import { useCareerku } from '@/hooks'

export function ToastBanner() {
  const { toast, dismissToast } = useCareerku()

  if (!toast) return null

  const isSuccess = toast.tone !== 'info'

  return (
    <div
      role="status"
      aria-live="polite"
      className="careerku-toast fixed right-5 top-5 z-50 flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 sm:right-7 sm:top-6"
    >
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white ${
          isSuccess ? 'bg-emerald-500' : 'bg-indigo-500'
        }`}
      >
        {isSuccess ? <Check className="h-4.5 w-4.5" strokeWidth={2.6} /> : <Info className="h-4.5 w-4.5" />}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{toast.title}</p>
        {toast.description && (
          <p className="truncate text-xs text-[var(--text-secondary)]">{toast.description}</p>
        )}
      </div>

      <button
        type="button"
        onClick={dismissToast}
        aria-label="Dismiss notification"
        className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-primary)]"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
