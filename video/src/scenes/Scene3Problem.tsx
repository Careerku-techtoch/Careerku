import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CARD_SHADOW_ELEVATED,
  CARD_SHADOW_SUBTLE,
  COLORS,
  EASE_OUT_EXPO,
  POPPINS_FONT,
  TEXT_SHADOW_SOFT,
} from '../theme';

/**
 * Scene 3 — Extended Problem Deep-Dive (13.0 seconds = 780 frames @ 60fps)
 * Three paced beats so the viewer really feels the pain of scattered opportunity hunting:
 *  - Beat 1 (0–255f | 4.25s): "But in reality..." -> "Ever struggled finding internships, competitions, & scholarships?"
 *  - Beat 2 (255–530f | 4.58s): Chaos wall of scattered group chats, blurry posters, & missed deadlines
 *  - Beat 3 (530–780f | 4.17s): Eligibility & skill readiness doubt ("Are your GPA & skills even enough?")
 */
export const Scene3Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [755, 780], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- BEAT 1 (0..255) ---
  const b1Tag = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 130 } });
  const b1Headline = spring({ frame: frame - 32, fps, config: { damping: 16, stiffness: 120 } });
  const b1Sub = spring({ frame: frame - 84, fps, config: { damping: 16, stiffness: 120 } });
  const b1FadeOut = interpolate(frame, [230, 255], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- BEAT 2 (255..530) ---
  const b2Local = frame - 255;
  const b2FadeIn = interpolate(b2Local, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const b2FadeOut = interpolate(frame, [505, 530], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const chaosCards = [
    {
      title: 'WA Group: Info Magang 2026',
      sub: '99+ unread messages • link buried',
      badge: 'Chat Chaos',
      badgeBg: COLORS.roseSoft,
      badgeFg: COLORS.rose,
      x: 115,
      y: 125,
      rot: -4,
      delay: 8,
    },
    {
      title: 'Instagram Story Poster',
      sub: 'Blurry text — expires in 2 hours',
      badge: 'Hard to Read',
      badgeBg: '#fef3c7',
      badgeFg: '#b45309',
      x: 1340,
      y: 120,
      rot: 4,
      delay: 24,
    },
    {
      title: 'Telegram Info Lomba & Beasiswa',
      sub: '340+ posts since last week',
      badge: 'Overwhelming',
      badgeBg: COLORS.indigoSoft,
      badgeFg: COLORS.indigo,
      x: 100,
      y: 740,
      rot: 3,
      delay: 42,
    },
    {
      title: 'Beasiswa Nasional 2026',
      sub: 'Registration closed yesterday!',
      badge: 'Missed Deadline',
      badgeBg: COLORS.roseSoft,
      badgeFg: COLORS.rose,
      x: 1335,
      y: 745,
      rot: -3,
      delay: 58,
    },
  ];

  const b2Line1 = spring({ frame: b2Local - 30, fps, config: { damping: 16, stiffness: 130 } });
  const b2Line2 = spring({ frame: b2Local - 95, fps, config: { damping: 16, stiffness: 130 } });
  const b2Line3 = spring({ frame: b2Local - 160, fps, config: { damping: 16, stiffness: 130 } });

  // --- BEAT 3 (530..780) ---
  const b3Local = frame - 530;
  const b3FadeIn = interpolate(b3Local, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const b3Top = spring({ frame: b3Local - 16, fps, config: { damping: 16, stiffness: 125 } });
  const b3Card = spring({ frame: b3Local - 48, fps, config: { damping: 14, stiffness: 125 } });
  const b3Bottom = spring({ frame: b3Local - 110, fps, config: { damping: 16, stiffness: 125 } });

  const questionTags = [
    { label: 'Min GPA 3.5?', delay: 62 },
    { label: 'Semester 5 Eligible?', delay: 78 },
    { label: 'Right Major?', delay: 94 },
    { label: 'Missing Technical Skills?', delay: 110 },
  ];

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bgSage,
        fontFamily: POPPINS_FONT,
        opacity: enterOpacity * exitOpacity,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Subtle ambient depth blobs */}
      <div
        style={{
          position: 'absolute',
          width: 820,
          height: 820,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(29, 31, 58, 0.06) 0%, rgba(228, 231, 219, 0) 70%)',
          left: -120,
          top: -120,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 820,
          height: 820,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(13, 74, 58, 0.07) 0%, rgba(228, 231, 219, 0) 70%)',
          right: -120,
          bottom: -120,
        }}
      />

      {/* ================= BEAT 1: THE REALITY ================= */}
      {frame < 260 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 180px',
            textAlign: 'center',
            opacity: b1FadeOut,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 28 }}>
            <div
              style={{
                opacity: b1Tag,
                transform: `translateY(${interpolate(b1Tag, [0, 1], [20, 0])}px)`,
                backgroundColor: COLORS.roseSoft,
                color: COLORS.rose,
                padding: '10px 24px',
                borderRadius: 999,
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              But In Reality…
            </div>

            <div
              style={{
                opacity: b1Headline,
                transform: `translateY(${interpolate(b1Headline, [0, 1], [36, 0], { easing: EASE_OUT_EXPO })}px)`,
                fontSize: 70,
                fontWeight: 700,
                lineHeight: 1.14,
                letterSpacing: '-0.03em',
                color: COLORS.charcoal,
                textShadow: TEXT_SHADOW_SOFT,
                maxWidth: 1320,
              }}
            >
              Ever struggled finding{' '}
              <span style={{ color: COLORS.emerald }}>
                internships, competitions, &amp; scholarships?
              </span>
            </div>

            <div
              style={{
                opacity: b1Sub,
                transform: `translateY(${interpolate(b1Sub, [0, 1], [24, 0])}px)`,
                fontSize: 30,
                fontWeight: 500,
                color: COLORS.slate,
                maxWidth: 920,
                lineHeight: 1.4,
              }}
            >
              Hunting verified student opportunities shouldn&apos;t feel like a full-time job.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ================= BEAT 2: SCATTERED CHAOS ================= */}
      {frame >= 250 && frame < 535 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: b2FadeIn * b2FadeOut,
          }}
        >
          {/* Floating Chaotic Notification Cards at the 4 corners */}
          {chaosCards.map((card, i) => {
            const pop = spring({
              frame: b2Local - card.delay,
              fps,
              config: { damping: 13, stiffness: 150 },
            });
            const bob = Math.sin(b2Local * 0.06 + i * 1.5) * 6;
            return (
              <div
                key={card.title}
                style={{
                  position: 'absolute',
                  left: card.x,
                  top: card.y,
                  width: 460,
                  backgroundColor: '#ffffff',
                  borderRadius: 20,
                  padding: '20px 24px',
                  border: `1.5px solid ${COLORS.borderStrong}`,
                  boxShadow: CARD_SHADOW_SUBTLE,
                  transform: `translateY(${bob}px) rotate(${card.rot}deg) scale(${pop})`,
                  opacity: pop,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 16, fontWeight: 700, color: COLORS.charcoal }}>
                    {card.title}
                  </span>
                  <span
                    style={{
                      backgroundColor: card.badgeBg,
                      color: card.badgeFg,
                      fontSize: 12,
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: 999,
                    }}
                  >
                    {card.badge}
                  </span>
                </div>
                <div style={{ fontSize: 14, color: COLORS.slate, fontWeight: 500 }}>{card.sub}</div>
              </div>
            );
          })}

          {/* Center Focal Kinetic Statement */}
          <div
            style={{
              backgroundColor: 'rgba(247, 248, 242, 0.94)',
              border: `1.5px solid ${COLORS.borderStrong}`,
              borderRadius: 32,
              padding: '48px 72px',
              boxShadow: CARD_SHADOW_ELEVATED,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
              textAlign: 'center',
              zIndex: 5,
            }}
          >
            <div
              style={{
                opacity: b2Line1,
                transform: `translateY(${interpolate(b2Line1, [0, 1], [24, 0])}px)`,
                fontSize: 54,
                fontWeight: 700,
                color: COLORS.charcoal,
                letterSpacing: '-0.025em',
                lineHeight: 1.12,
              }}
            >
              Scattered across 10+ feeds.
            </div>
            <div
              style={{
                opacity: b2Line2,
                transform: `translateY(${interpolate(b2Line2, [0, 1], [24, 0])}px)`,
                fontSize: 54,
                fontWeight: 700,
                color: COLORS.emerald,
                letterSpacing: '-0.025em',
                lineHeight: 1.12,
              }}
            >
              Buried in endless group chats.
            </div>
            <div
              style={{
                opacity: b2Line3,
                transform: `translateY(${interpolate(b2Line3, [0, 1], [24, 0])}px)`,
                fontSize: 54,
                fontWeight: 700,
                color: COLORS.rose,
                letterSpacing: '-0.025em',
                lineHeight: 1.12,
              }}
            >
              Deadlines missed before you notice.
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ================= BEAT 3: ELIGIBILITY & SKILL DOUBT ================= */}
      {frame >= 525 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 160px',
            textAlign: 'center',
            opacity: b3FadeIn,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
            <div
              style={{
                opacity: b3Top,
                transform: `translateY(${interpolate(b3Top, [0, 1], [24, 0])}px)`,
                fontSize: 44,
                fontWeight: 500,
                color: COLORS.slate,
                letterSpacing: '-0.018em',
              }}
            >
              And even when you finally find one…
            </div>

            {/* Doubt Checklist Card */}
            <div
              style={{
                opacity: b3Card,
                transform: `scale(${interpolate(b3Card, [0, 1], [0.9, 1])})`,
                backgroundColor: '#ffffff',
                borderRadius: 28,
                padding: '32px 44px',
                border: `1.5px solid ${COLORS.borderStrong}`,
                boxShadow: CARD_SHADOW_ELEVATED,
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 16,
                maxWidth: 1020,
              }}
            >
              {questionTags.map((tag) => {
                const tagPop = spring({
                  frame: b3Local - tag.delay,
                  fps,
                  config: { damping: 12, stiffness: 180 },
                });
                return (
                  <div
                    key={tag.label}
                    style={{
                      transform: `scale(${tagPop})`,
                      backgroundColor: COLORS.bgSubtle,
                      border: `1.5px solid ${COLORS.borderStrong}`,
                      color: COLORS.midnight,
                      padding: '14px 26px',
                      borderRadius: 999,
                      fontSize: 24,
                      fontWeight: 700,
                      letterSpacing: '-0.01em',
                    }}
                    >
                      {tag.label}
                    </div>
                );
              })}
            </div>

            <div
              style={{
                opacity: b3Bottom,
                transform: `translateY(${interpolate(b3Bottom, [0, 1], [28, 0])}px)`,
                fontSize: 62,
                fontWeight: 700,
                color: COLORS.midnight,
                letterSpacing: '-0.028em',
                lineHeight: 1.15,
                textShadow: TEXT_SHADOW_SOFT,
              }}
            >
              You&apos;re still left guessing if{' '}
              <span style={{ color: COLORS.emerald }}>you&apos;re actually ready.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
