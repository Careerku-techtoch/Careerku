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
    <div className="flex w-full justify-center">
      <div
        className="inline-flex w-fit max-w-full items-center gap-1.5 overflow-x-auto rounded-full border border-[var(--border-subtle)] bg-[var(--bg-tab-inactive)] p-1.5 shadow-2xs [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="tablist"
      >
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = tab.id === activeTab

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`group flex shrink-0 cursor-pointer items-center gap-2 rounded-full py-1.5 pl-1.5 pr-3.5 text-xs transition-all duration-200 sm:text-[13px] ${
              isActive
                ? 'bg-[var(--bg-card)] text-[var(--text-primary)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card)]/60 hover:text-[var(--text-primary)]'
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors ${
                isActive
                  ? 'bg-[#79b49a] text-[#141816] dark:bg-[#54a884] dark:text-[#111311]'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={2} />
            </span>

            <span className={`whitespace-nowrap ${isActive ? 'font-semibold' : 'font-medium'}`}>
              {tab.label}
            </span>

            <span
              className={`inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#79b49a] text-[#141816] dark:bg-[#54a884] dark:text-[#111311]'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)]'
              }`}
            >
              {tab.count}
            </span>
          </button>
        )
      })}
      </div>
    </div>
  )
}
