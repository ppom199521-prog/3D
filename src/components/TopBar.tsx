import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { NavScreen } from '../types/studio';

interface TopBarProps {
  activeScreen: NavScreen;
  onSelectScreen: (screen: NavScreen) => void;
  onOpenExport: () => void;
}

const NAV_ITEMS: { id: NavScreen; label: string }[] = [
  { id: 'viewport', label: 'Viewport' },
  { id: 'scenes', label: 'Scenes' },
  { id: 'materials', label: 'Materials' },
  { id: 'renders', label: 'Renders' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeScreen,
  onSelectScreen,
  onOpenExport,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0E1017]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          type="button"
          onClick={() => onSelectScreen('viewport')}
          className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded"
        >
          Obsidian Prism
        </button>

        {/* Zone 2: 4 concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectScreen(item.id)}
                className={`relative py-1.5 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] rounded ${
                  isActive
                    ? 'text-white'
                    : 'text-[#94A3B8] hover:text-[#E2E8F0]'
                }`}
              >
                {item.label}
                <span
                  aria-hidden="true"
                  className={`absolute left-0 right-0 -bottom-0.5 h-[2px] rounded-full transition-opacity duration-150 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#38BDF8] to-[#8B5CF6] opacity-100'
                      : 'bg-white/30 opacity-0'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action + mobile nav trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenExport}
            className="btn-primary-glow px-4 py-2 rounded-lg text-xs font-semibold tracking-wide whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
          >
            Export Scene
          </button>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg text-[#E2E8F0] hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8]"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation strip */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden px-4 pb-3 pt-1 flex items-center gap-2 border-t border-white/[0.06] bg-[#0E1017]/95"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectScreen(item.id);
                  setMobileOpen(false);
                }}
                className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium whitespace-nowrap text-center transition-colors ${
                  isActive
                    ? 'bg-[#1E2235] text-white border border-[#38BDF8]/40'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
