import React from 'react';
import { Composition } from 'remotion';
import { CareerkuExplainer } from './CareerkuExplainer';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CareerkuExplainer"
      component={CareerkuExplainer}
      durationInFrames={3600}
      fps={60}
      width={1920}
      height={1080}
    />
  );
};
