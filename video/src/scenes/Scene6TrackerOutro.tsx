import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { BrowserFrame } from '../components/BrowserFrame';
import { CareerkuBrandMark } from '../components/CareerkuBrandMark';
import { CARD_SHADOW_SUBTLE, COLORS, EASE_IN_OUT_SMOOTH, EASE_OUT_EXPO, POPPINS_FONT } from '../theme';

export const Scene6TrackerOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const trackerZoom = interpolate(frame, [0, 390], [1.0, 1.07], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_OUT_EXPO,
  });

  // Animated document checklist ticks comfortably spaced across 7s tracker section (frames 0..420)
  const tick1 = frame >= 65;
  const tick2 = frame >= 155;
  const tick3 = frame >= 245;
  const completedCount = (tick1 ? 1 : 0) + (tick2 ? 1 : 0) + (tick3 ? 1 : 0);
  const progressPercent = Math.round((completedCount / 3) * 100);
  const smoothProgressWidth =
    interpolate(frame, [65, 92], [0, 33.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT_EXPO }) +
    interpolate(frame, [155, 182], [0, 33.3], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT_EXPO }) +
    interpolate(frame, [245, 272], [0, 33.4], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: EASE_OUT_EXPO });

  const labelOpacity = spring({
    frame: frame - 18,
    fps,
    config: { damping: 16, stiffness: 130 },
  });

  // Gradient Wipe Outro starts at frame 420 (7.0s) and holds cleanly for 5.0s until frame 720
  const wipeProgress = interpolate(frame, [420, 468], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: EASE_IN_OUT_SMOOTH,
  });

  const wipeX = interpolate(wipeProgress, [0, 1], [1920, 0]);

  const outroContent = spring({
    frame: frame - 460,
    fps,
    config: { damping: 15, stiffness: 120 },
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgCream,
        fontFamily: POPPINS_FONT,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Vertical Side Label */}
      <div
        style={{
          position: 'absolute',
          left: 165,
          opacity: labelOpacity,
          transform: 'translate(-50%, 0) rotate(-90deg)',
          fontSize: 40,
          fontWeight: 700,
          color: COLORS.emerald,
          letterSpacing: '-0.02em',
          whiteSpace: 'nowrap',
        }}
      >
        Plus • Smart Tracker
      </div>

      {/* Tracker Preview Browser */}
      <div style={{ transform: `scale(${trackerZoom})` }}>
        <BrowserFrame url="careerku.app/tracker" activeNav="tracker">
          <div
            style={{
              backgroundColor: COLORS.bgCream,
              borderRadius: 24,
              padding: 24,
              height: 580,
              border: `1px solid ${COLORS.borderSubtle}`,
              display: 'grid',
              gridTemplateColumns: '1fr 1.35fr',
              gap: 20,
            }}
          >
            {/* Left Tracked List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: COLORS.charcoal, marginBottom: 4 }}>
                Tracked Applications (3)
              </div>
              {[
                {
                  org: 'GoTo Financial',
                  role: 'Software Engineer Intern (FE)',
                  status: 'Preparing Docs',
                  due: '17d left',
                  active: true,
                  accent: '#00AA13',
                },
                {
                  org: 'GEMASTIK XIX',
                  role: 'National ICT Competition',
                  status: 'Saved',
                  due: '20d left',
                  active: false,
                  accent: '#D97706',
                },
                {
                  org: 'Beasiswa Unggulan',
                  role: 'Kemendikbudristek Scholarship',
                  status: 'Applied',
                  due: '31d left',
                  active: false,
                  accent: COLORS.midnight,
                },
              ].map((item) => (
                <div
                  key={item.org}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 16,
                    padding: 16,
                    border: `2px solid ${item.active ? COLORS.emerald : COLORS.borderSubtle}`,
                    boxShadow: CARD_SHADOW_SUBTLE,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: item.accent }}>
                      {item.org}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: item.active ? COLORS.rose : COLORS.slate,
                      }}
                    >
                      {item.due}
                    </span>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.charcoal, marginBottom: 8 }}>
                    {item.role}
                  </div>
                  <span
                    style={{
                      backgroundColor: item.active ? COLORS.emeraldSoft : COLORS.bgSubtle,
                      color: item.active ? COLORS.emerald : COLORS.slate,
                      fontSize: 11,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 999,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Document Checklist */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 20,
                padding: 24,
                border: `1px solid ${COLORS.borderSubtle}`,
                boxShadow: CARD_SHADOW_SUBTLE,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: COLORS.charcoal }}>
                      Application Document Checklist
                    </div>
                    <div style={{ fontSize: 12, color: COLORS.slate }}>
                      GoTo Financial • Due 15 Dec 2026
                    </div>
                  </div>
                  <div
                    style={{
                      backgroundColor: COLORS.emeraldSoft,
                      color: COLORS.emerald,
                      padding: '6px 14px',
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                    }}
                  >
                    {progressPercent}% Ready
                  </div>
                </div>

                {/* Progress Bar */}
                <div
                  style={{
                    height: 10,
                    backgroundColor: COLORS.bgSubtle,
                    borderRadius: 999,
                    overflow: 'hidden',
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: `${smoothProgressWidth}%`,
                      height: '100%',
                      backgroundColor: COLORS.emeraldBright,
                      borderRadius: 999,
                    }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { title: 'ATS-Friendly Tech CV (React & Vitest highlighted)', done: tick1 },
                    { title: 'GitHub Portfolio & Live Demo Links', done: tick2 },
                    { title: 'Motivation Letter & Academic Transcript', done: tick3 },
                  ].map((doc) => (
                    <div
                      key={doc.title}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '14px 16px',
                        borderRadius: 14,
                        backgroundColor: doc.done ? '#f0fdf4' : COLORS.bgSubtle,
                        border: `1px solid ${doc.done ? '#bbf7d0' : COLORS.borderSubtle}`,
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          backgroundColor: doc.done ? COLORS.emeraldBright : '#ffffff',
                          border: `2px solid ${doc.done ? COLORS.emeraldBright : COLORS.borderStrong}`,
                          color: '#ffffff',
                          fontSize: 13,
                          fontWeight: 800,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {doc.done ? '✓' : ''}
                      </div>
                      <span
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: doc.done ? COLORS.emerald : COLORS.charcoal,
                        }}
                      >
                        {doc.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ fontSize: 12, color: COLORS.muted }}>
                Synced with Careerku Workspace • Never miss a deadline
              </div>
            </div>
          </div>
        </BrowserFrame>
      </div>

      {/* Smooth Midnight -> Deep Emerald Gradient Wipe Outro (Placeholder CTA, editable later) */}
      <AbsoluteFill
        style={{
          transform: `translateX(${wipeX}px)`,
          background: `linear-gradient(135deg, ${COLORS.midnight} 0%, ${COLORS.emerald} 100%)`,
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 140px',
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 24,
            opacity: outroContent,
            transform: `translateY(${interpolate(outroContent, [0, 1], [32, 0])}px)`,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 14,
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.24)',
              borderRadius: 999,
              padding: '12px 26px',
            }}
          >
            <CareerkuBrandMark size={34} inverted />
            <span style={{ fontSize: 24, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Careerku
            </span>
          </div>

          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.08,
            }}
          >
            One Hub. Every Opportunity.
          </div>

          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: COLORS.indigoSoft,
              maxWidth: 880,
              lineHeight: 1.4,
            }}
          >
            AI-scraped internships, competitions &amp; scholarships — plus smart matching, skill gap
            coaching &amp; deadline tracking.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
