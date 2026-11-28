import React from 'react';
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1Intro } from './scenes/Scene1Intro';
import { Scene2Hook } from './scenes/Scene2Hook';
import { Scene3Problem } from './scenes/Scene3Problem';
import { Scene4SolutionVideo } from './scenes/Scene4SolutionVideo';
import { Scene4Discover } from './scenes/Scene4Discover';
import { Scene5Analyze } from './scenes/Scene5Analyze';
import { Scene6TrackerOutro } from './scenes/Scene6TrackerOutro';
import { COLORS } from './theme';

/**
 * Total Duration: 60.0 seconds (3600 frames @ 60fps)
 * - 0:00.0–0:02.75 (165f) : Scene 1 — Careerku Brand Intro
 * - 0:02.5–0:12.5  (600f) : Scene 2 — Confused Students -> Direct Problem Hook
 * - 0:12.5–0:21.5  (540f) : Scene 3 — Extended Problem (Chaos Wall + Eligibility Doubt) [19s total Problem!]
 * - 0:21.5–0:29.5  (480f) : Scene 4 — Solution Turn with Uploaded Happy Animation ("Meet Careerku")
 * - 0:29.5–0:39.5  (600f) : Scene 5 — Core Feature: AI Scraper & Verified Matching (DiscoverPage)
 * - 0:39.5–0:49.0  (570f) : Scene 6 — Plus-Plus Feature 1: Built-In AI Skill Gap Coach (AnalyzePage)
 * - 0:49.0–1:00.0  (660f) : Scene 7 — Plus-Plus Feature 2: Smart Tracker + Outro Wipe
 */
export const CareerkuExplainer: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgCream }}>
      <Sequence from={0} durationInFrames={165}>
        <Scene1Intro />
      </Sequence>

      <Sequence from={150} durationInFrames={600}>
        <Scene2Hook />
      </Sequence>

      <Sequence from={750} durationInFrames={540}>
        <Scene3Problem />
      </Sequence>

      <Sequence from={1290} durationInFrames={480}>
        <Scene4SolutionVideo />
      </Sequence>

      <Sequence from={1770} durationInFrames={600}>
        <Scene4Discover />
      </Sequence>

      <Sequence from={2370} durationInFrames={570}>
        <Scene5Analyze />
      </Sequence>

      <Sequence from={2940} durationInFrames={660}>
        <Scene6TrackerOutro />
      </Sequence>
    </AbsoluteFill>
  );
};
