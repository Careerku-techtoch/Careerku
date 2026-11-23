import type { LucideIcon } from 'lucide-react'

export interface FolderTabItem<T extends string> {
  id: T
  label: string
  count: number
  icon: LucideIcon
}

interface FolderTabsProps<T extends string> {
  tabs: FolderTabItem<T>[]
  activeTab: T
  onChange: (tab: T) => void
}

export function FolderTabs<T extends string>({
  tabs,
  activeTab,
  onChange,
}: FolderTabsProps<T>) {
  return (
    <div
      className="relative flex items-end overflow-x-auto pr-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="tablist"
    >
      {tabs.map((tab, idx) => {
        const Icon = tab.icon
        const isActive = tab.id === activeTab
        const isFirst = idx === 0
        const fillColorClass = isActive
          ? 'text-[var(--bg-sheet)]'
          : 'text-[var(--bg-tab-inactive)] group-hover:text-[var(--bg-sheet)]/90'
        const centerBgClass = isActive
          ? 'bg-[var(--bg-sheet)]'
          : 'bg-[var(--bg-tab-inactive)] group-hover:bg-[var(--bg-sheet)]/90'

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            style={{ zIndex: isActive ? 30 : 20 - idx }}
            className={`group relative flex h-[54px] shrink-0 cursor-pointer items-center gap-2.5 text-sm ${
              isFirst ? 'pl-3 pr-10' : '-ml-4 pl-9 pr-10'
            } ${
              isActive
                ? '-mb-px text-[var(--text-primary)]'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            {/* Sloped S-curve Folder Silhouette Backdrop */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 flex items-stretch ${
                isActive
                  ? 'drop-shadow-[0_-1px_4px_rgba(24,28,22,0.04)]'
                  : 'drop-shadow-[1px_-1px_3px_rgba(24,28,22,0.06)]'
              }`}
            >
              {/* Left Side: Rounded Corner for First Tab, Gentle S-Curve Slope for Others */}
              {isFirst ? (
                <svg
                  viewBox="0 0 28 54"
                  preserveAspectRatio="none"
                  className={`h-full w-7 shrink-0 ${fillColorClass}`}
                  fill="currentColor"
                >
                  <path d="M 0 54 L 0 26 C 0 11 11 0 26 0 L 28 0 L 28 54 Z" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 36 54"
                  preserveAspectRatio="none"
                  className={`h-full w-9 shrink-0 ${fillColorClass}`}
                  fill="currentColor"
                >
                  <path d="M 0 54 C 13 54 16 42 21 24 C 25 9 29 0 36 0 L 36 54 Z" />
                </svg>
              )}

              {/* Middle Body (overlaps caps by 1px to avoid subpixel seams on Windows DPI) */}
              <span className={`-mx-px h-full flex-1 ${centerBgClass}`} />

              {/* Right Side: Gentle S-Curve Slope */}
              <svg
                viewBox="0 0 36 54"
                preserveAspectRatio="none"
                className={`h-full w-9 shrink-0 ${fillColorClass}`}
                fill="currentColor"
              >
                <path d="M 0 0 C 7 0 11 9 15 24 C 20 42 23 54 36 54 L 0 54 Z" />
              </svg>
            </span>

            {/* Tab Content */}
            <span
              className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                isActive
                  ? 'bg-[#a6aaf7] text-[#1c1e21] dark:bg-[#8085ec] dark:text-[#111311]'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>

            <span
              className={`relative z-10 whitespace-nowrap pr-1 ${
                isActive ? 'font-semibold text-[var(--text-primary)]' : 'font-medium'
              }`}
            >
              {tab.label}
            </span>

            <span
              className={`relative z-10 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold ${
                isActive
                  ? 'bg-[#a6aaf7] text-[#1c1e21] dark:bg-[#8085ec] dark:text-[#111311]'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
