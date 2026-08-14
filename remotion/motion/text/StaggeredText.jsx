import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {clamp, motionEasing} from '../core/tokens.js';

const mix = (from, to, progress) => from + (to - from) * progress;

export const splitTextUnits = (text, unit = 'word') => {
  const value = String(text ?? '');

  if (unit === 'line') {
    return value.split('\n').map((part, index, lines) => ({
      value: part,
      animated: true,
      breakAfter: index < lines.length - 1,
    }));
  }

  const parts = unit === 'character'
    ? Array.from(value)
    : value.split(/(\s+)/).filter(Boolean);

  return parts.map((part) => ({
    value: part,
    animated: !/^\s+$/.test(part),
    breakAfter: false,
  }));
};

const seededRank = (index, count, seed) => {
  const order = Array.from({length: count}, (_, itemIndex) => itemIndex)
    .sort((a, b) => {
      const aHash = Math.sin((a + 1) * 999 + seed * 17) * 10000;
      const bHash = Math.sin((b + 1) * 999 + seed * 17) * 10000;
      return (aHash - Math.floor(aHash)) - (bHash - Math.floor(bHash));
    });
  return order.indexOf(index);
};

const rankFor = (index, count, order, seed) => {
  if (order === 'reverse') return count - 1 - index;
  if (order === 'center') return Math.abs(index - (count - 1) / 2);
  if (order === 'edges') return Math.min(index, count - 1 - index);
  if (order === 'seeded') return seededRank(index, count, seed);
  return index;
};

const rotationValue = (axis, angle) => {
  if (axis === 'x') return `1 0 0 ${angle}deg`;
  if (axis === 'y') return `0 1 0 ${angle}deg`;
  return `${angle}deg`;
};

export const StaggeredText = ({
  text,
  unit = 'word',
  order = 'forward',
  seed = 1,
  startFrame = 0,
  durationInFrames = 15,
  staggerFrames = 2,
  fromX = 0,
  fromY = 42,
  fromScale = 0.88,
  fromRotate = 0,
  fromBlur = 8,
  fromOpacity = 0,
  fromTracking = 0,
  rotateAxis = 'z',
  transformOrigin = '50% 50%',
  mask = false,
  exitStartFrame,
  exitDurationInFrames = 12,
  exitStaggerFrames = 0,
  exitX = 0,
  exitY = -24,
  exitScale = 0.95,
  exitRotate = 0,
  exitBlur = 6,
  exitOpacity = 0,
  fromForIndex,
  style,
  tokenStyle,
}) => {
  const frame = useCurrentFrame();
  const units = splitTextUnits(text, unit);
  const animatedCount = units.filter((item) => item.animated).length;
  let animatedIndex = -1;

  return (
    <div
      aria-label={String(text ?? '')}
      style={{
        whiteSpace: unit === 'line' ? 'normal' : 'pre-wrap',
        perspective: 1200,
        ...style,
      }}
    >
      {units.map((item, sourceIndex) => {
        if (!item.animated) {
          return <span key={`space-${sourceIndex}`} aria-hidden style={{whiteSpace: 'pre'}}>{item.value}</span>;
        }

        animatedIndex += 1;
        const motionIndex = animatedIndex;
        const rank = rankFor(motionIndex, animatedCount, order, seed);
        const tokenStart = startFrame + rank * staggerFrames;
        const entry = interpolate(
          frame,
          [tokenStart, tokenStart + Math.max(1, durationInFrames)],
          [0, 1],
          {...clamp, easing: motionEasing.editorial},
        );
        const exitRank = rankFor(motionIndex, animatedCount, order === 'forward' ? 'reverse' : order, seed);
        const exit = exitStartFrame == null
          ? 0
          : interpolate(
            frame,
            [exitStartFrame + exitRank * exitStaggerFrames, exitStartFrame + exitRank * exitStaggerFrames + Math.max(1, exitDurationInFrames)],
            [0, 1],
            {...clamp, easing: motionEasing.deckAdvance},
          );
        const overrides = typeof fromForIndex === 'function'
          ? fromForIndex({index: motionIndex, count: animatedCount, value: item.value}) || {}
          : {};
        const entryX = overrides.x ?? fromX;
        const entryY = overrides.y ?? fromY;
        const entryScale = overrides.scale ?? fromScale;
        const entryRotate = overrides.rotate ?? fromRotate;
        const entryBlur = overrides.blur ?? fromBlur;
        const entryOpacity = overrides.opacity ?? fromOpacity;
        const innerStyle = {
          display: 'inline-block',
          translate: `${mix(entryX, 0, entry) + mix(0, exitX, exit)}px ${mix(entryY, 0, entry) + mix(0, exitY, exit)}px`,
          scale: mix(entryScale, 1, entry) * mix(1, exitScale, exit),
          rotate: rotationValue(rotateAxis, mix(entryRotate, 0, entry) + mix(0, exitRotate, exit)),
          opacity: mix(entryOpacity, 1, entry) * mix(1, exitOpacity, exit),
          filter: `blur(${mix(entryBlur, 0, entry) + mix(0, exitBlur, exit)}px)`,
          letterSpacing: `${mix(fromTracking, 0, entry)}em`,
          transformOrigin,
          willChange: 'translate, scale, rotate, opacity, filter, letter-spacing',
          ...tokenStyle,
        };
        const display = unit === 'line' ? 'block' : 'inline-block';
        const content = <span aria-hidden style={innerStyle}>{item.value}</span>;

        return (
          <React.Fragment key={`${item.value}-${sourceIndex}`}>
            {mask ? (
              <span style={{display, overflow: 'hidden', verticalAlign: 'bottom'}}>{content}</span>
            ) : (
              <span style={{display, verticalAlign: 'bottom'}}>{content}</span>
            )}
            {item.breakAfter ? <br /> : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
