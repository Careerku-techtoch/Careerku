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

export const Scene5Analyze: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slide browser smoothly from center to left half
  const slideLeft = spring({
    frame: frame - 4,
    fps,
    config: { damping: 16, stiffness: 110 },
  });

  const browserX = interpolate(slideLeft, [0, 1], [0, -330]);
  const browserScale = interpolate(slideLeft, [0, 1], [1.0, 0.84]);

  // Animated 92% progress bar (10.0s = 600f scene)
  const scoreWidth = interpolate(frame, [38, 120], [0, 92], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT_EXPO,
  });

  // Pop-out Detected Skill Gap card slightly
  const gapPop = spring({
    frame: frame - 165,
    fps,
    config: { damping: 14, stiffness: 135 },
  });

  // 3-line stacked kinetic copy on the right (comfortably paced across 10s)
  const line1 = spring({ frame: frame - 70, fps, config: { damping: 16, stiffness: 130 } });
  const line2 = spring({ frame: frame - 160, fps, config: { damping: 16, stiffness: 130 } });
  const line3 = spring({ frame: frame - 250, fps, config: { damping: 16, stiffness: 130 } });

  const exitFade = interpolate(frame, [545, 570], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgCream,
        fontFamily: POPPINS_FONT,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: exitFade,
      }}
    >
      {/* Left: Browser showing AnalyzePage */}
      <div
        style={{
          transform: `translateX(${browserX}px) scale(${browserScale})`,
          transformOrigin: 'center center',
        }}
      >
        <BrowserFrame url="careerku.app/analyze" activeNav="analyze" width={1180} height={780}>
          <div
            style={{
              backgroundColor: COLORS.bgCream,
              borderRadius: 24,
              padding: 24,
              height: '100%',
              border: `1px solid ${COLORS.borderSubtle}`,
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
            }}
          >
            {/* Readiness Banner */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 18,
                padding: 20,
                border: `1px solid ${COLORS.borderSubtle}`,
                boxShadow: CARD_SHADOW_SUBTLE,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
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
                    <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.slate }}>
                      GoTo Financial • South Jakarta
                    </div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.charcoal }}>
                      Software Engineer Intern (Frontend)
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: COLORS.emeraldSoft,
                    color: COLORS.emerald,
                    padding: '6px 14px',
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  ⚑ High Match {Math.round(scoreWidth)}%
                </div>
              </div>

              {/* Readiness Bar */}
              <div
                style={{
                  backgroundColor: COLORS.bgSubtle,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 12,
                    fontWeight: 600,
                    color: COLORS.charcoal,
                    marginBottom: 8,
                  }}
                >
                  <span>Readiness &amp; Qualification Suitability Score</span>
                  <span>{Math.round(scoreWidth)}%</span>
                </div>
                <div
                  style={{
                    height: 10,
                    backgroundColor: '#ffffff',
                    borderRadius: 999,
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${scoreWidth}%`,
                      height: '100%',
                      backgroundColor: COLORS.emeraldBright,
                      borderRadius: 999,
                    }}
                  />
                </div>
              </div>

              {/* Rule Checks */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { label: 'GPA Requirement', val: '3.62 / 3.20' },
                  { label: 'Semester Range', val: 'Sem 5 / 5–8' },
                  { label: 'Major Alignment', val: 'Computer Science' },
                ].map((r) => (
                  <div
                    key={r.label}
                    style={{
                      border: `1px solid ${COLORS.borderSubtle}`,
                      borderRadius: 12,
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span style={{ color: COLORS.emeraldBright, fontSize: 15, fontWeight: 800 }}>
                      ✓
                    </span>
                    <div>
                      <div style={{ fontSize: 11, color: COLORS.muted }}>{r.label}</div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: COLORS.charcoal }}>
                        {r.val}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Skills & Detected Skill Gaps Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 18,
                  padding: 18,
                  border: `1px solid ${COLORS.borderSubtle}`,
                  boxShadow: CARD_SHADOW_SUBTLE,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    color: COLORS.charcoal,
                  }}
                >
                  <span>✓ Matched Skills</span>
                  <span style={{ color: COLORS.emerald }}>5</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['React', 'TypeScript', 'Tailwind CSS', 'REST API', 'Git'].map((s) => (
                    <span
                      key={s}
                      style={{
                        backgroundColor: COLORS.emeraldSoft,
                        color: COLORS.emerald,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '5px 12px',
                        borderRadius: 999,
                      }}
                    >
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Highlighted AI Skill Gaps Card (pops forward subtly) */}
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 18,
                  padding: 18,
                  border: `2px solid ${gapPop > 0.2 ? COLORS.emerald : COLORS.borderSubtle}`,
                  boxShadow: gapPop > 0.2 ? CARD_SHADOW_ELEVATED : CARD_SHADOW_SUBTLE,
                  transform: `scale(${interpolate(gapPop, [0, 1], [1, 1.04])})`,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: 12,
                    fontSize: 14,
                    fontWeight: 700,
                    color: COLORS.charcoal,
                  }}
                >
                  <span>✦ AI Detected Skill Gaps</span>
                  <span style={{ color: COLORS.rose }}>2</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                  {['Testing (Vitest/Jest) +', 'CI/CD Basics +'].map((s) => (
                    <span
                      key={s}
                      style={{
                        backgroundColor: COLORS.roseSoft,
                        color: COLORS.rose,
                        fontSize: 12,
                        fontWeight: 600,
                        padding: '5px 12px',
                        borderRadius: 999,
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div
                  style={{
                    backgroundColor: COLORS.bgSubtle,
                    borderRadius: 10,
                    padding: '8px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: COLORS.midnight,
                  }}
                >
                  💡 AI Sprint Idea: Add Vitest unit tests to your Campus Portal repo
                </div>
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>

      {/* Right Side: Plus-Plus Feature Pill + 3-Line Kinetic Copy (Poppins) */}
      <div
        style={{
          position: 'absolute',
          right: 85,
          width: 670,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: 14,
        }}
      >
        <div
          style={{
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [18, 0])}px)`,
            backgroundColor: COLORS.emeraldSoft,
            color: COLORS.emerald,
            padding: '8px 18px',
            borderRadius: 999,
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          ✦ Plus • Built-In AI Coach
        </div>

        <div
          style={{
            opacity: line1,
            transform: `translateY(${interpolate(line1, [0, 1], [28, 0])}px)`,
            fontSize: 48,
            fontWeight: 500,
            color: COLORS.slate,
            letterSpacing: '-0.02em',
            lineHeight: 1.12,
          }}
        >
          More Than Just Listings.
        </div>

        <div
          style={{
            opacity: line2,
            transform: `translateY(${interpolate(line2, [0, 1], [28, 0])}px)`,
            fontSize: 58,
            fontWeight: 700,
            color: COLORS.emerald,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
          }}
        >
          Spot Your Skill Gaps.
        </div>

        <div
          style={{
            opacity: line3,
            transform: `translateY(${interpolate(line3, [0, 1], [28, 0])}px)`,
            fontSize: 58,
            fontWeight: 700,
            color: COLORS.midnight,
            letterSpacing: '-0.025em',
            lineHeight: 1.12,
          }}
        >
          Build What Matters.
        </div>
      </div>
    </AbsoluteFill>
  );
};
