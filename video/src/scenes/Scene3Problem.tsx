import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  CARD_SHADOW_ELEVATED,
  COLORS,
  POPPINS_FONT,
  TEXT_SHADOW_SOFT,
} from '../theme';

interface PileCard {
  id: string;
  app: string;
  appColor: string;
  title: string;
  sub: string;
  time: string;
  x: number;
  y: number;
  rot: number;
  delay: number;
}

/**
 * 16 realistic notification cards that enter ONE BY ONE and pile up across the screen,
 * creating a real visual avalanche behind the centered kinetic statement.
 * Zero cheesy badges ("Chat Chaos", "Overwhelming", etc.) — clean real-world notification look.
 */
const PILE_CARDS: PileCard[] = [
  { id: 'c1', app: 'WA', appColor: '#25D366', title: 'Info Magang 2026', sub: '99+ unread messages • link buried', time: 'now', x: 75, y: 78, rot: -4, delay: 4 },
  { id: 'c2', app: 'IG', appColor: '#E1306C', title: '@infobeasiswa.id', sub: 'Story poster expires in 2h — blurry text', time: '2m', x: 1365, y: 74, rot: 4, delay: 14 },
  { id: 'c3', app: 'TG', appColor: '#229ED9', title: 'Channel Info Lomba', sub: '340+ posts since last week', time: '5m', x: 92, y: 815, rot: 3, delay: 24 },
  { id: 'c4', app: 'EM', appColor: '#EA4335', title: 'Beasiswa Nasional 2026', sub: 'Registration closed yesterday at 23:59', time: '8m', x: 1345, y: 820, rot: -3.5, delay: 34 },
  { id: 'c5', app: 'LI', appColor: '#0A66C2', title: 'Tech Internships ID', sub: '42 new roles posted today', time: '11m', x: 540, y: 58, rot: 2.5, delay: 44 },
  { id: 'c6', app: 'WA', appColor: '#25D366', title: 'Grup Angkatan CS 24', sub: '"Eh link daftarnya yang mana ya?"', time: '14m', x: 970, y: 72, rot: -2.5, delay: 54 },
  { id: 'c7', app: 'DC', appColor: '#5865F2', title: '#hackathon-info', sub: 'Team needed ASAP — closes tonight!', time: '17m', x: 42, y: 455, rot: -5, delay: 64 },
  { id: 'c8', app: 'IG', appColor: '#E1306C', title: '@careerfair.campus', sub: 'Swipe 10 slides for eligibility criteria', time: '20m', x: 1435, y: 445, rot: 5, delay: 74 },
  { id: 'c9', app: 'TG', appColor: '#229ED9', title: 'Magang BUMN & Startup', sub: 'Check pinned PDF (48 pages)', time: '24m', x: 555, y: 855, rot: -2, delay: 84 },
  { id: 'c10', app: 'WA', appColor: '#25D366', title: 'Komunitas Frontend ID', sub: 'Forwarded many times • broken link', time: '28m', x: 985, y: 845, rot: 3, delay: 94 },
  // Second overlapping pile layer for dense stacked look
  { id: 'c11', app: 'IG', appColor: '#E1306C', title: '@lombakampus.id', sub: 'Min GPA? Check link in bio', time: '32m', x: 255, y: 215, rot: 3.5, delay: 104 },
  { id: 'c12', app: 'LI', appColor: '#0A66C2', title: 'Software Engineer Intern', sub: 'No longer accepting applications', time: '36m', x: 1215, y: 218, rot: -4, delay: 114 },
  { id: 'c13', app: 'WA', appColor: '#25D366', title: 'Himpunan Mahasiswa', sub: '"Ada yg punya poster GEMASTIK HD?"', time: '41m', x: 215, y: 690, rot: -3.5, delay: 124 },
  { id: 'c14', app: 'EM', appColor: '#EA4335', title: 'Scholarship Portal', sub: 'Missing transcript & motivation letter', time: '47m', x: 1230, y: 685, rot: 4.5, delay: 134 },
  { id: 'c15', app: 'TG', appColor: '#229ED9', title: 'Info Magang Kampus', sub: '215 unread updates waiting', time: '53m', x: 740, y: 170, rot: -1.8, delay: 144 },
  { id: 'c16', app: 'IG', appColor: '#E1306C', title: '@magang.update', sub: 'Deadline extended? Read full caption', time: '1h', x: 760, y: 745, rot: 2.2, delay: 154 },
];

/**
 * Scene 3 — Extended Problem Continuation (9.0s = 540 frames @ 60fps)
 *  - Beat A (0–280f | 4.67s): 16-card one-by-one stacking notification pileup + 3-line kinetic center punch
 *  - Beat B (280–540f | 4.33s): Eligibility & skill readiness doubt
 */
export const Scene3Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enterOpacity = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const exitOpacity = interpolate(frame, [516, 540], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // --- BEAT A (0..280): One-by-one Stacking Notification Avalanche ---
  const bAFadeOut = interpolate(frame, [255, 280], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bALine1 = spring({ frame: frame - 26, fps, config: { damping: 16, stiffness: 130 } });
  const bALine2 = spring({ frame: frame - 92, fps, config: { damping: 16, stiffness: 130 } });
  const bALine3 = spring({ frame: frame - 158, fps, config: { damping: 16, stiffness: 130 } });

  // --- BEAT B (280..540): Eligibility & Readiness Doubt ---
  const bBLocal = frame - 280;
  const bBFadeIn = interpolate(bBLocal, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bBTop = spring({ frame: bBLocal - 14, fps, config: { damping: 16, stiffness: 125 } });
  const bBCard = spring({ frame: bBLocal - 44, fps, config: { damping: 14, stiffness: 125 } });
  const bBBottom = spring({ frame: bBLocal - 108, fps, config: { damping: 16, stiffness: 125 } });

  const questionTags = [
    { label: 'Min GPA 3.5?', delay: 56 },
    { label: 'Semester 5 Eligible?', delay: 72 },
    { label: 'Right Major?', delay: 88 },
    { label: 'Missing Technical Skills?', delay: 104 },
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

      {/* ================= BEAT A: 16-CARD STACKING NOTIFICATION AVALANCHE ================= */}
      {frame < 285 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            opacity: bAFadeOut,
          }}
        >
          {PILE_CARDS.map((card, i) => {
            const pop = spring({
              frame: frame - card.delay,
              fps,
              config: { damping: 13, stiffness: 185, mass: 0.75 },
            });
            const dropY = interpolate(pop, [0, 1], [48, 0]);
            const scale = interpolate(pop, [0, 1], [0.76, 1]);
            const bob = Math.sin(frame * 0.055 + i * 1.1) * 3.5;

            return (
              <div
                key={card.id}
                style={{
                  position: 'absolute',
                  left: card.x,
                  top: card.y,
                  width: 430,
                  backgroundColor: '#ffffff',
                  borderRadius: 18,
                  padding: '16px 20px',
                  border: `1.5px solid ${COLORS.borderStrong}`,
                  boxShadow:
                    '0 14px 32px -8px rgba(28, 30, 33, 0.14), 0 3px 8px rgba(28, 30, 33, 0.06)',
                  transform: `translateY(${dropY + bob}px) rotate(${card.rot}deg) scale(${scale})`,
                  opacity: interpolate(pop, [0, 0.25], [0, 1], { extrapolateRight: 'clamp' }),
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  zIndex: 2 + i,
                }}
              >
                {/* Clean Platform App Circle */}
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 12,
                    backgroundColor: card.appColor,
                    color: '#ffffff',
                    fontSize: 13,
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {card.app}
                </div>

                {/* Notification Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 8,
                      marginBottom: 3,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: COLORS.charcoal,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {card.title}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: COLORS.muted, flexShrink: 0 }}>
                      {card.time}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: COLORS.slate,
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {card.sub}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Elevated Center Focal Card sitting crisply on top of the stacked pile */}
          <div
            style={{
              backgroundColor: 'rgba(253, 252, 243, 0.97)',
              border: `2px solid ${COLORS.borderStrong}`,
              borderRadius: 32,
              padding: '48px 72px',
              boxShadow:
                '0 32px 80px -12px rgba(28, 30, 33, 0.28), 0 8px 24px rgba(28, 30, 33, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 18,
              textAlign: 'center',
              zIndex: 30,
            }}
          >
            <div
              style={{
                opacity: bALine1,
                transform: `translateY(${interpolate(bALine1, [0, 1], [24, 0])}px)`,
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
                opacity: bALine2,
                transform: `translateY(${interpolate(bALine2, [0, 1], [24, 0])}px)`,
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
                opacity: bALine3,
                transform: `translateY(${interpolate(bALine3, [0, 1], [24, 0])}px)`,
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

      {/* ================= BEAT B: ELIGIBILITY & SKILL DOUBT ================= */}
      {frame >= 275 && (
        <AbsoluteFill
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: '0 160px',
            textAlign: 'center',
            opacity: bBFadeIn,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 34 }}>
            <div
              style={{
                opacity: bBTop,
                transform: `translateY(${interpolate(bBTop, [0, 1], [24, 0])}px)`,
                fontSize: 44,
                fontWeight: 500,
                color: COLORS.slate,
                letterSpacing: '-0.018em',
              }}
            >
              And even when you finally find one…
            </div>

            <div
              style={{
                opacity: bBCard,
                transform: `scale(${interpolate(bBCard, [0, 1], [0.9, 1])})`,
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
                  frame: bBLocal - tag.delay,
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
                opacity: bBBottom,
                transform: `translateY(${interpolate(bBBottom, [0, 1], [28, 0])}px)`,
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
