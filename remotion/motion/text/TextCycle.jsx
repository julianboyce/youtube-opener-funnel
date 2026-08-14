import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, motionEasing} from '../core/tokens.js';

const mix = (from, to, progress) => from + (to - from) * progress;

export const TextCycle = ({
  words = [],
  startFrame = 0,
  holdFrames = 22,
  transitionFrames = 12,
  mode = 'impact',
  direction = 'up',
  loop = true,
  style,
  wordStyle,
}) => {
  const frame = useCurrentFrame();
  const count = words.length;
  if (count === 0 || frame < startFrame) return null;

  const stepFrames = Math.max(2, holdFrames + transitionFrames);
  const localFrame = frame - startFrame;
  const rawIndex = Math.floor(localFrame / stepFrames);
  const currentIndex = loop ? rawIndex % count : Math.min(rawIndex, count - 1);
  const nextIndex = currentIndex === count - 1 ? (loop ? 0 : currentIndex) : currentIndex + 1;
  const phaseFrame = localFrame % stepFrames;
  const canAdvance = loop || currentIndex < count - 1;
  const progress = canAdvance
    ? interpolate(
      phaseFrame,
      [holdFrames, stepFrames],
      [0, 1],
      {...clamp, easing: motionEasing.deckAdvance},
    )
    : 0;
  const axisX = direction === 'left' ? -1 : direction === 'right' ? 1 : 0;
  const axisY = direction === 'down' ? 1 : direction === 'up' ? -1 : 0;
  const impact = mode === 'impact';
  const hinge = mode === 'hinge';

  const renderWord = (word, incoming) => {
    const amount = incoming ? 1 - progress : progress;
    const translateMultiplier = incoming ? 1 - progress : progress;
    const scale = impact
      ? (incoming ? mix(2.1, 1, progress) : mix(1, 0.78, progress))
      : (incoming ? mix(0.88, 1, progress) : mix(1, 0.92, progress));
    const rotation = impact
      ? (incoming ? mix(-18, 0, progress) : mix(0, 8, progress))
      : hinge
        ? (incoming ? mix(-88, 0, progress) : mix(0, 88, progress))
        : 0;

    return (
      <div
        key={`${word}-${incoming ? 'in' : 'out'}`}
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          translate: `${axisX * 100 * translateMultiplier}px ${axisY * 100 * translateMultiplier}px`,
          scale,
          rotate: hinge ? `1 0 0 ${rotation}deg` : `${rotation}deg`,
          opacity: incoming ? progress : 1 - amount,
          filter: `blur(${incoming ? mix(12, 0, progress) : mix(0, 8, progress)}px)`,
          transformOrigin: hinge ? '50% 100%' : '50% 50%',
          ...wordStyle,
        }}
      >
        {word}
      </div>
    );
  };

  return (
    <div style={{position: 'relative', minHeight: '1.1em', perspective: 1200, ...style}}>
      {renderWord(words[currentIndex], false)}
      {canAdvance && progress > 0 ? renderWord(words[nextIndex], true) : null}
    </div>
  );
};
