import React from 'react';
import { CARD_SHADOW_ELEVATED, COLORS, POPPINS_FONT } from '../theme';
import { CareerkuBrandMark } from './CareerkuBrandMark';

interface BrowserFrameProps {
  url: string;
  activeNav: 'discover' | 'analyze' | 'tracker';
  children: React.ReactNode;
  width?: number;
  height?: number;
}

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  url,
  activeNav,
  children,
  width = 1280,
  height = 780,
}) => {
  const navItems: Array<{ id: 'discover' | 'analyze' | 'tracker'; label: string }> = [
    { id: 'discover', label: 'Opportunities' },
    { id: 'analyze', label: 'AI Skill Gap' },
    { id: 'tracker', label: 'Tracker' },
  ];

  return (
    <div
      style={{
        width,
        height,
        backgroundColor: COLORS.bgSage,
        borderRadius: 28,
        border: `1.5px solid ${COLORS.borderStrong}`,
        boxShadow: CARD_SHADOW_ELEVATED,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: POPPINS_FONT,
      }}
    >
      {/* Top Browser Chrome */}
      <div
        style={{
          height: 52,
          backgroundColor: COLORS.bgCard,
          borderBottom: `1px solid ${COLORS.borderSubtle}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 22px',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f57' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#febc2e' }} />
          <span style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#28c840' }} />
        </div>

        <div
          style={{
            backgroundColor: COLORS.bgSubtle,
            border: `1px solid ${COLORS.borderSubtle}`,
            borderRadius: 999,
            padding: '5px 28px',
            fontSize: 13,
            fontWeight: 500,
            color: COLORS.slate,
            letterSpacing: '-0.01em',
          }}
        >
          {url}
        </div>

        <div style={{ width: 52 }} />
      </div>

      {/* Careerku App Top Navbar */}
      <div
        style={{
          height: 64,
          backgroundColor: COLORS.bgSage,
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: COLORS.bgCard,
              border: `1px solid ${COLORS.borderSubtle}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <CareerkuBrandMark size={22} />
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: COLORS.charcoal,
              letterSpacing: '-0.02em',
            }}
          >
            Careerku
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: COLORS.bgCard,
            padding: 5,
            borderRadius: 999,
            border: `1px solid ${COLORS.borderSubtle}`,
          }}
        >
          {navItems.map((item) => {
            const isActive = item.id === activeNav;
            return (
              <div
                key={item.id}
                style={{
                  padding: '7px 18px',
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  backgroundColor: isActive ? COLORS.charcoal : 'transparent',
                  color: isActive ? '#ffffff' : COLORS.slate,
                }}
              >
                {item.label}
              </div>
            );
          })}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            backgroundColor: COLORS.bgCard,
            border: `1px solid ${COLORS.borderSubtle}`,
            borderRadius: 999,
            padding: '6px 14px 6px 8px',
          }}
        >
          <div
            style={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              backgroundColor: COLORS.emerald,
              color: '#ffffff',
              fontSize: 11,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            RP
          </div>
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.charcoal }}>
            Raka • 3.62 GPA
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          padding: '6px 32px 28px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
};
