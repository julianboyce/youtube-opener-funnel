import React from 'react';
import {StaggeredText} from './motion/text';

const KineticStaggeredText = StaggeredText as React.ComponentType<any>;

type KineticTitleProps = {
  text: string;
  fontSize: number;
  maxWidth?: number;
  startFrame?: number;
};

export const KineticTitle: React.FC<KineticTitleProps> = ({text, fontSize, maxWidth, startFrame = 8}) => (
  <KineticStaggeredText
    text={text}
    unit="word"
    startFrame={startFrame}
    durationInFrames={16}
    staggerFrames={4}
    fromX={110}
    fromY={0}
    fromScale={1.2}
    fromRotate={-5}
    fromBlur={14}
    mask
    style={{maxWidth, color: '#fff', fontSize, fontWeight: 800, lineHeight: 0.88, letterSpacing: '-0.065em'}}
  />
);
