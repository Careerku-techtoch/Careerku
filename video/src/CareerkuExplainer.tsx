import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1Intro } from './scenes/Scene1Intro';
import { Scene2Hook } from './scenes/Scene2Hook';
import { Scene3Problem } from './scenes/Scene3Problem';
import { Scene3Reveal } from './scenes/Scene3Reveal';
import { Scene4Discover } from './scenes/Scene4Discover';
import { Scene5Analyze } from './scenes/Scene5Analyze';
import { Scene6TrackerOutro } from './scenes/Scene6TrackerOutro';
import { COLORS } from './theme';

/**
 * Total Duration: 60.0 seconds (3600 frames @ 60fps)
 * - 0:00.0–0:03.0 (180f) : Scene 1 — Careerku Brand Intro
 * - 0:02.75–0:11.0 (495f): Scene 2 — Uploaded Animated Video Opening Hook
 * - 0:11.0–0:24.0 (780f) : Scene 3 — Extended Problem Deep-Dive (13s, 3 beats)
 * - 0:24.0–0:27.0 (180f) : Scene 4 — Meet Careerku Badge -> Browser Reveal
 * - 0:27.0–0:38.0 (660f) : Scene 5 — Core Hero: AI Scraper & Verified Matching
 * - 0:38.0–0:48.0 (600f) : Scene 6 — Plus-Plus Feature 1: Built-In AI Skill Gap Coach
 * - 0:48.0–1:00.0 (720f) : Scene 7 — Plus-Plus Feature 2: Smart Tracker + Outro Wipe
 */
export const CareerkuExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgCream }}>
      <Sequence from={0} durationInFrames={180}>
        <Scene1Intro />
      </Sequence>

      <Sequence from={165} durationInFrames={495}>
        <Scene2Hook />
      </Sequence>

      <Sequence from={660} durationInFrames={780}>
        <Scene3Problem />
      </Sequence>

      <Sequence from={1440} durationInFrames={180}>
        <Scene3Reveal />
      </Sequence>

      <Sequence from={1620} durationInFrames={660}>
        <Scene4Discover />
      </Sequence>

      <Sequence from={2280} durationInFrames={600}>
        <Scene5Analyze />
      </Sequence>

      <Sequence from={2880} durationInFrames={720}>
        <Scene6TrackerOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
