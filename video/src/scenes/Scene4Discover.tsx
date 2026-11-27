import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrowserFrame } from '../components/BrowserFrame';
import {
  CARD_SHADOW_ELEVATED,
  CARD_SHADOW_SUBTLE,
  COLORS,
  EASE_OUT_EXPO,
  POPPINS_FONT,
} from '../theme';

interface MiniCard {
  id: string;
  initials: string;
  accent: string;
  org: string;
  title: string;
  type: string;
  deadline: string;
  score: string;
  sourceTag: string;
  highlighted?: boolean;
}

const CARDS: MiniCard[] = [
  {
    id: 'goto',
    initials: 'GT',
    accent: '#00AA13',
    org: 'GoTo Financial',
    title: 'Software Engineer Intern (Frontend)',
    type: 'Internship • Hybrid',
    deadline: '15 Dec 2026',
    score: 'High Match 9/10',
    sourceTag: '✦ AI + OCR Verified',
    highlighted: true,
  },
  {
    id: 'gemastik',
    initials: 'GM',
    accent: '#D97706',
    org: 'GEMASTIK XIX',
    title: 'National ICT Student Competition',
    type: 'Competition • National',
    deadline: '20 Dec 2026',
    score: 'High Match 9/10',
    sourceTag: '✦ AI Scraped • Official',
  },
  {
    id: 'beasiswa',
    initials: 'BU',
    accent: '#1D4ED8',
    org: 'Beasiswa Unggulan',
    title: 'Kemendikbudristek Undergraduate Grant',
    type: 'Scholarship • Tuition',
    deadline: '28 Dec 2026',
    score: 'High Match 8/10',
    sourceTag: '✦ AI + OCR Verified',
  },
  {
    id: 'traveloka',
    initials: 'TV',
    accent: '#0194F3',
    org: 'Traveloka',
    title: 'Product Design & UX Research Intern',
    type: 'Internship • Hybrid',
    deadline: '04 Jan 2027',
    score: 'High Match 8/10',
    sourceTag: '✦ AI Scraped • Daily',
  },
];

export const Scene4Discover: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const browserScale = interpolate(frame, [0, 220], [1, 1.05], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT_EXPO,
  });

  // Left vertical label ("AI-Scraped & Verified")
  const leftLabelProgress = spring({
    frame: frame - 18,
    fps,
    config: { damping: 16, stiffness: 130 },
  });
  const leftLabelFadeOut = interpolate(frame, [260, 295], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Highlight High Match pill toggle at frame 150
  const highMatchActive = frame >= 150;

  // Floating Card Pop-Out (frame 285+ across 660f = 11s scene)
  const popOut = spring({
    frame: frame - 285,
    fps,
    config: { damping: 14, stiffness: 115 },
  });

  // Right vertical label ("Matched to Your Profile")
  const rightLabelProgress = spring({
    frame: frame - 310,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  const bgDimOpacity = interpolate(popOut, [0, 1], [1, 0.35]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgCream,
        fontFamily: POPPINS_FONT,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Left 90-degree Vertical Kinetic Label */}
      <div
        style={{
          position: 'absolute',
          left: 165,
          transform: `translate(-50%, ${interpolate(leftLabelProgress, [0, 1], [70, 0])}px) rotate(-90deg)`,
          opacity: leftLabelProgress * leftLabelFadeOut,
          fontSize: 40,
          fontWeight: 700,
          color: COLORS.emerald,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          transformOrigin: 'center center',
        }}
      >
        AI-Scraped &amp; Verified
      </div>

      {/* Right 90-degree Vertical Kinetic Label */}
      <div
        style={{
          position: 'absolute',
          right: 165,
          transform: `translate(50%, ${interpolate(rightLabelProgress, [0, 1], [-70, 0])}px) rotate(90deg)`,
          opacity: rightLabelProgress,
          fontSize: 40,
          fontWeight: 700,
          color: COLORS.midnight,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
          transformOrigin: 'center center',
        }}
      >
        Matched to Your Profile
      </div>

      {/* Browser Mockup */}
      <div
        style={{
          transform: `scale(${browserScale})`,
          position: 'relative',
        }}
      >
        <div style={{ opacity: bgDimOpacity }}>
          <BrowserFrame url="careerku.app/discover" activeNav="discover">
            {/* Folder Tabs showing all 3 pillars */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'All Opportunities', count: 12, active: true },
                  { label: 'Internships', count: 5, active: false },
                  { label: 'Competitions', count: 4, active: false },
                  { label: 'Scholarships', count: 3, active: false },
                ].map((tab) => (
                  <div
                    key={tab.label}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '16px 16px 8px 8px',
                      backgroundColor: tab.active ? COLORS.bgCream : '#f0f2e8',
                      border: `1px solid ${tab.active ? COLORS.borderStrong : COLORS.borderSubtle}`,
                      fontSize: 13,
                      fontWeight: tab.active ? 700 : 500,
                      color: tab.active ? COLORS.charcoal : COLORS.slate,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span>{tab.label}</span>
                    <span
                      style={{
                        backgroundColor: tab.active ? COLORS.emerald : COLORS.borderSubtle,
                        color: tab.active ? '#ffffff' : COLORS.slate,
                        borderRadius: 999,
                        padding: '1px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                      }}
                    >
                      {tab.count}
                    </span>
                  </div>
                ))}
              </div>

              {/* Live AI Scraper Indicator Pill */}
              <div
                style={{
                  backgroundColor: COLORS.emeraldSoft,
                  color: COLORS.emerald,
                  padding: '6px 14px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                ✦ Auto-Scraped &amp; Verified Daily
              </div>
            </div>

            {/* Inner Sheet */}
            <div
              style={{
                backgroundColor: COLORS.bgCream,
                borderRadius: 24,
                padding: 24,
                height: 560,
                border: `1px solid ${COLORS.borderSubtle}`,
              }}
            >
              {/* Header + Filter Bar */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 20,
                }}
              >
                <div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: COLORS.charcoal }}>
                    All Verified Opportunities in One Place
                  </div>
                  <div style={{ fontSize: 13, color: COLORS.slate }}>
                    Scraped via AI + OCR from official sources &amp; matched to your GPA and skills
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <div
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      border: `1px solid ${COLORS.borderSubtle}`,
                      backgroundColor: '#ffffff',
                      fontSize: 12,
                      color: COLORS.muted,
                    }}
                  >
                    Search internship, competition, grant...
                  </div>
                  <div
                    style={{
                      padding: '8px 16px',
                      borderRadius: 999,
                      border: `1.5px solid ${highMatchActive ? COLORS.emerald : COLORS.borderSubtle}`,
                      backgroundColor: highMatchActive ? COLORS.emerald : '#ffffff',
                      color: highMatchActive ? '#ffffff' : COLORS.charcoal,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    ★ High Match Only
                  </div>
                </div>
              </div>

              {/* 2x2 Opportunity Grid covering Internships, Competitions, & Scholarships */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                }}
              >
                {CARDS.map((card) => (
                  <div
                    key={card.id}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 18,
                      padding: 18,
                      border: `1px solid ${COLORS.borderSubtle}`,
                      boxShadow: CARD_SHADOW_SUBTLE,
                      opacity: card.highlighted && popOut > 0.1 ? 0.15 : 1,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 12,
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: '50%',
                            backgroundColor: card.accent,
                            color: '#ffffff',
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {card.initials}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.charcoal }}>
                          {card.org}
                        </span>
                      </div>
                      <span
                        style={{
                          backgroundColor: COLORS.emeraldSoft,
                          color: COLORS.emerald,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '4px 10px',
                          borderRadius: 8,
                        }}
                      >
                        ⚑ {card.score}
                      </span>
                    </div>

                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: COLORS.charcoal,
                        marginBottom: 8,
                      }}
                    >
                      {card.title}
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.slate, marginBottom: 12 }}>
                      {card.type} • Due {card.deadline}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11 }}>
                      <span style={{ color: COLORS.emerald, fontWeight: 600 }}>{card.sourceTag}</span>
                      <span style={{ color: COLORS.muted }}>Structured Criteria</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BrowserFrame>
        </div>

        {/* Floating Elevated Verified Opportunity Card Pop-Out */}
        {popOut > 0.01 && (
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '52%',
              width: 600,
              transform: `translate(-50%, -50%) scale(${interpolate(popOut, [0, 1], [0.85, 1.18])})`,
              opacity: interpolate(popOut, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' }),
              backgroundColor: '#ffffff',
              borderRadius: 22,
              padding: 26,
              border: `2px solid ${COLORS.emerald}`,
              boxShadow: CARD_SHADOW_ELEVATED,
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: '50%',
                    backgroundColor: '#00AA13',
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  GT
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.charcoal }}>
                    GoTo Financial
                  </div>
                  <div style={{ fontSize: 12, color: COLORS.emerald, fontWeight: 600 }}>
                    ✦ AI + OCR Verified Source
                  </div>
                </div>
              </div>
              <span
                style={{
                  backgroundColor: COLORS.emerald,
                  color: '#ffffff',
                  fontSize: 13,
                  fontWeight: 700,
                  padding: '6px 14px',
                  borderRadius: 10,
                }}
              >
                ⚑ High Match 9/10
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ backgroundColor: COLORS.bgSubtle, borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: COLORS.muted }}>Extracted Eligibility</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.charcoal }}>
                  Min GPA 3.2 • Sem 5+
                </div>
              </div>
              <div style={{ backgroundColor: COLORS.bgSubtle, borderRadius: 12, padding: '10px 14px' }}>
                <div style={{ fontSize: 11, color: COLORS.muted }}>Deadline</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.charcoal }}>
                  15 Dec 2026
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: COLORS.charcoal,
                marginBottom: 6,
              }}
            >
              Software Engineer Intern (Frontend)
            </div>
            <div style={{ fontSize: 13, color: COLORS.slate, lineHeight: 1.45, marginBottom: 16 }}>
              Auto-parsed requirements, skills, and deadlines — matched instantly against your
              student profile.
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.emerald }}>
                ✦ Plus: AI Skill Gap Analysis Ready
              </span>
              <div
                style={{
                  backgroundColor: COLORS.charcoal,
                  color: '#ffffff',
                  padding: '8px 18px',
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Save / Track
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
