import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {clamp} from '../core/tokens.js';
import {AccentGeometry} from './AccentGeometry.jsx';
import {MotionPath} from './MotionPath.jsx';
import {SliceReveal} from './SliceReveal.jsx';
import {StaggeredText} from './StaggeredText.jsx';
import {TextCycle} from './TextCycle.jsx';
import {TextOnPath} from './TextOnPath.jsx';
import {TrackingText} from './TrackingText.jsx';
import {TransformReveal} from './TransformReveal.jsx';
export {KINETIC_TEXT_PRESETS} from './presets.js';
import {KINETIC_TEXT_PRESETS} from './presets.js';

const headline = {
  fontFamily: 'Arial Black, Impact, Arial, sans-serif',
  fontSize: 112,
  fontWeight: 900,
  lineHeight: 0.88,
  letterSpacing: '-0.065em',
  textTransform: 'uppercase',
};

const label = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  fontSize: 27,
  fontWeight: 800,
  lineHeight: 1,
  letterSpacing: '0.12em',
  textTransform: 'uppercase',
};

const centered = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
};

export const KineticTextPreset = ({
  preset = 'radial-badge',
  primary = 'KINETIC',
  secondary = 'TYPOGRAPHY',
  tertiary = 'MOTION SYSTEM',
  words,
  accent = '#f3d315',
  foreground = '#f5f3ed',
  durationInFrames = 75,
}) => {
  const frame = useCurrentFrame();
  const sceneOpacity = interpolate(
    frame,
    [0, 5, Math.max(6, durationInFrames - 9), durationInFrames],
    [0, 1, 1, 0],
    clamp,
  );
  const exitStart = Math.max(36, durationInFrames - 16);
  let content;

  if (preset === 'pivot-stack') {
    content = (
      <TransformReveal startFrame={2} durationInFrames={22} fromRotate={-82} fromScale={0.66} fromBlur={12} transformOrigin="12% 85%" clip={false} exitStartFrame={exitStart} exitRotate={18} exitScale={0.76}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4}}>
          <StaggeredText text={tertiary} unit="line" startFrame={0} durationInFrames={13} fromX={-80} fromY={0} style={{...label, color: accent}} />
          <StaggeredText text={primary} unit="line" startFrame={6} durationInFrames={14} fromX={110} fromY={0} fromScale={1.4} style={{...headline, fontSize: 126}} />
          <StaggeredText text={secondary} unit="word" startFrame={12} durationInFrames={13} staggerFrames={3} fromY={55} mask style={{...headline, fontSize: 78, color: accent}} />
        </div>
      </TransformReveal>
    );
  } else if (preset === 'impact-cycle') {
    content = (
      <TextCycle
        words={words?.length ? words : [primary, secondary, tertiary]}
        holdFrames={16}
        transitionFrames={10}
        mode="impact"
        direction="up"
        style={{width: 900, height: 170}}
        wordStyle={{...headline, color: foreground, fontSize: 122}}
      />
    );
  } else if (preset === 'split-quote') {
    content = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8}}>
        <TransformReveal startFrame={2} durationInFrames={17} fromY={-90} fromRotate={-5} exitStartFrame={exitStart} exitY={-70} style={{overflow: 'hidden'}}>
          <div style={{...headline, fontSize: 82}}>{primary}</div>
        </TransformReveal>
        <AccentGeometry kind="line" width={500} thickness={7} color={accent} startFrame={10} durationInFrames={16} />
        <TransformReveal startFrame={8} durationInFrames={17} fromY={90} fromRotate={5} exitStartFrame={exitStart} exitY={70} style={{overflow: 'hidden'}}>
          <div style={{...headline, color: accent, fontSize: 82}}>{secondary}</div>
        </TransformReveal>
      </div>
    );
  } else if (preset === 'glyph-orbit') {
    content = (
      <AccentGeometry kind="rings" width={520} thickness={3} color={accent} startFrame={0} durationInFrames={24} rotate={80}>
        <StaggeredText
          text={primary}
          unit="character"
          order="seeded"
          seed={8}
          durationInFrames={21}
          staggerFrames={1}
          fromScale={0.35}
          fromRotate={120}
          fromBlur={10}
          fromForIndex={({index, count}) => {
            const angle = index / Math.max(1, count) * Math.PI * 2 - Math.PI / 2;
            return {x: Math.cos(angle) * 260, y: Math.sin(angle) * 210, rotate: angle * 180 / Math.PI + 90, scale: 0.4};
          }}
          style={{...headline, fontSize: 76}}
        />
      </AccentGeometry>
    );
  } else if (preset === 'emphasis-stack') {
    content = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <StaggeredText text={tertiary} unit="word" startFrame={0} durationInFrames={14} staggerFrames={2} fromY={-38} mask style={{...label, color: accent, marginBottom: 15}} />
        <StaggeredText text={primary} unit="line" startFrame={5} durationInFrames={17} fromScale={0.2} fromY={0} fromBlur={13} style={{...headline, fontSize: 142}} />
        <StaggeredText text={secondary} unit="word" startFrame={12} durationInFrames={13} staggerFrames={2} fromX={65} fromY={0} order="reverse" style={{...headline, color: accent, fontSize: 70, marginTop: 8}} />
      </div>
    );
  } else if (preset === 'hinged-lockup') {
    content = (
      <TransformReveal startFrame={1} durationInFrames={25} fromRotate={-92} rotateAxis="y" fromX={-130} fromScale={0.74} transformOrigin="0% 50%" clip={false} exitStartFrame={exitStart} exitRotate={86} exitX={90}>
        <div style={{display: 'flex', alignItems: 'stretch', gap: 18}}>
          <div style={{width: 12, background: accent}} />
          <div style={{textAlign: 'left'}}>
            <div style={{...label, color: accent, marginBottom: 12}}>{tertiary}</div>
            <div style={{...headline, fontSize: 116}}>{primary}</div>
            <div style={{...headline, fontSize: 66, color: accent}}>{secondary}</div>
          </div>
        </div>
      </TransformReveal>
    );
  } else if (preset === 'slice-title') {
    content = (
      <div style={{width: 860, textAlign: 'center'}}>
        <SliceReveal slices={8} durationInFrames={23} staggerFrames={1} offset={190} style={{...headline, fontSize: 134}}>
          <div>{primary}</div>
        </SliceReveal>
        <StaggeredText text={secondary} unit="character" startFrame={14} durationInFrames={12} staggerFrames={1} fromY={25} mask style={{...label, color: accent, marginTop: 20}} />
      </div>
    );
  } else if (preset === 'orbital-lockup') {
    content = (
      <div style={{width: 860, height: 300, position: 'relative'}}>
        <MotionPath startFrame={0} durationInFrames={28} radiusX={360} radiusY={210} startAngle={-180} endAngle={0} fromRotate={-100} style={{position: 'absolute', inset: 0}}>
          <div style={{...headline, ...centered, height: 140, fontSize: 112}}>{primary}</div>
        </MotionPath>
        <StaggeredText text={secondary} unit="word" startFrame={14} durationInFrames={15} staggerFrames={3} fromX={90} fromY={0} style={{...headline, position: 'absolute', left: 0, right: 0, top: 145, color: accent, fontSize: 73}} />
        <StaggeredText text={tertiary} unit="character" startFrame={22} durationInFrames={10} staggerFrames={1} fromY={16} style={{...label, position: 'absolute', left: 0, right: 0, top: 235}} />
      </div>
    );
  } else if (preset === 'carrier-band') {
    content = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
        <TransformReveal startFrame={5} durationInFrames={17} fromX={-150} fromY={0} clip={false}>
          <div style={{...headline, fontSize: 105}}>{primary}</div>
        </TransformReveal>
        <AccentGeometry kind="bar" width={710} height={88} color={accent} startFrame={0} durationInFrames={22}>
          <StaggeredText text={secondary} unit="word" startFrame={9} durationInFrames={12} staggerFrames={2} fromX={90} fromY={0} style={{...headline, color: '#090a0c', fontSize: 62}} />
        </AccentGeometry>
        <StaggeredText text={tertiary} unit="character" startFrame={18} durationInFrames={10} staggerFrames={1} fromY={18} style={{...label, fontSize: 20}} />
      </div>
    );
  } else if (preset === 'orthogonal-lockup') {
    content = (
      <div style={{display: 'flex', alignItems: 'center', gap: 25}}>
        <TransformReveal startFrame={0} durationInFrames={19} fromY={-130} fromRotate={-90} clip={false}>
          <div style={{...label, color: accent, writingMode: 'vertical-rl', rotate: '180deg'}}>{tertiary}</div>
        </TransformReveal>
        <AccentGeometry kind="line" width={280} thickness={8} color={accent} startFrame={5} durationInFrames={15} rotate={90} style={{width: 8, height: 280}} />
        <div style={{textAlign: 'left'}}>
          <TrackingText text={primary} startFrame={5} durationInFrames={20} toTracking={0.02} style={{...headline, fontSize: 118}} />
          <StaggeredText text={secondary} unit="word" startFrame={14} durationInFrames={12} fromX={100} fromY={0} style={{...headline, color: accent, fontSize: 61}} />
        </div>
      </div>
    );
  } else if (preset === 'flip-frame') {
    content = (
      <AccentGeometry kind="corners" width={690} height={360} thickness={7} color={accent} startFrame={1} durationInFrames={22} rotate={8}>
        <TransformReveal startFrame={4} durationInFrames={24} fromRotate={-95} rotateAxis="x" fromY={70} transformOrigin="50% 100%" clip={false} exitStartFrame={exitStart} exitRotate={90}>
          <div>
            <div style={{...headline, fontSize: 100}}>{primary}</div>
            <div style={{...headline, color: accent, fontSize: 62}}>{secondary}</div>
          </div>
        </TransformReveal>
      </AccentGeometry>
    );
  } else if (preset === 'divider-split') {
    content = (
      <div style={{display: 'grid', gridTemplateColumns: '1fr 10px 1fr', gap: 30, alignItems: 'center', width: 890}}>
        <TransformReveal startFrame={5} durationInFrames={18} fromX={120} fromY={0} style={{textAlign: 'right'}}>
          <div style={{...headline, fontSize: 80}}>{primary}</div>
        </TransformReveal>
        <div style={{width: 8, height: 280, background: accent, scale: `1 ${interpolate(frame, [0, 20], [0, 1], clamp)}`}} />
        <TransformReveal startFrame={8} durationInFrames={18} fromX={-120} fromY={0} style={{textAlign: 'left'}}>
          <div style={{...headline, color: accent, fontSize: 80}}>{secondary}</div>
        </TransformReveal>
      </div>
    );
  } else if (preset === 'tracking-qualifier') {
    content = (
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
        <TransformReveal startFrame={0} durationInFrames={15} fromX={-80} fromY={0} clip={false}>
          <div style={{...label, color: accent, marginBottom: 13}}>{tertiary}</div>
        </TransformReveal>
        <TrackingText text={primary} startFrame={4} durationInFrames={24} fromTracking={-0.17} toTracking={0.035} style={{...headline, fontSize: 126}} />
        <TransformReveal startFrame={17} durationInFrames={13} fromX={90} fromY={0}>
          <div style={{...headline, color: accent, fontSize: 55}}>{secondary}</div>
        </TransformReveal>
      </div>
    );
  } else if (preset === 'reverse-type') {
    content = (
      <div style={{display: 'grid', gridTemplateColumns: '70px 1fr', gap: 24, alignItems: 'end'}}>
        <TransformReveal startFrame={0} durationInFrames={17} fromY={-90} fromRotate={-90} clip={false}>
          <div style={{...label, color: accent, writingMode: 'vertical-rl', rotate: '180deg', fontSize: 20}}>{tertiary}</div>
        </TransformReveal>
        <div style={{textAlign: 'left'}}>
          <StaggeredText text={primary} unit="character" order="reverse" startFrame={4} durationInFrames={12} staggerFrames={2} fromX={45} fromY={0} fromRotate={12} style={{...headline, fontSize: 123}} />
          <StaggeredText text={secondary} unit="word" startFrame={17} durationInFrames={13} staggerFrames={3} fromY={46} mask style={{...headline, color: accent, fontSize: 60, marginTop: 8}} />
        </div>
      </div>
    );
  } else {
    content = (
      <TextOnPath text={secondary} size={500} radius={200} startFrame={0} durationInFrames={26} color={accent} rotation={120}>
        <AccentGeometry kind="rings" width={345} thickness={3} color={accent} startFrame={4} durationInFrames={22} rotate={65}>
          <div>
            <StaggeredText text={primary} unit="character" startFrame={7} durationInFrames={13} staggerFrames={1} fromScale={1.9} fromRotate={35} fromY={0} style={{...headline, fontSize: 88}} />
            <TrackingText text={tertiary} startFrame={16} durationInFrames={14} fromTracking={-0.15} toTracking={0.08} style={{...label, color: accent, fontSize: 17, marginTop: 10}} />
          </div>
        </AccentGeometry>
      </TextOnPath>
    );
  }

  return (
    <AbsoluteFill
      style={{
        ...centered,
        color: foreground,
        opacity: sceneOpacity,
      }}
    >
      {content}
    </AbsoluteFill>
  );
};
