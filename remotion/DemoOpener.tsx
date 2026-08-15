import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {KineticTextPreset} from './motion/text';

const KineticPreset = KineticTextPreset as React.ComponentType<any>;
export const DEMO_OPENER_DURATION_IN_FRAMES = 60;

export type DemoOpenerProps = {
  channelName: string;
  avatarUrl: string;
  backgroundSrc: string;
  preset: string;
};

const ChannelIdentity: React.FC<Pick<DemoOpenerProps, 'channelName' | 'avatarUrl'>> = ({channelName, avatarUrl}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const entry = spring({frame, fps, config: {damping: 13, mass: 0.8, stiffness: 150}});

  return (
    <div style={{position: 'absolute', top: 28, left: 32, display: 'flex', alignItems: 'center', gap: 12, opacity: interpolate(entry, [0, 1], [0, 1]), scale: interpolate(entry, [0, 1], [0.6, 1])}}>
      <Img src={avatarUrl} alt={`${channelName} avatar`} style={{width: 54, height: 54, borderRadius: '50%', border: '2px solid rgba(255,255,255,.94)', objectFit: 'cover', background: '#111', boxShadow: '0 6px 18px rgba(0,0,0,.26)'}} />
      <div style={{maxWidth: 180, overflow: 'hidden', color: '#fff', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: 19, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textShadow: '0 2px 12px rgba(0,0,0,.55)'}}>{channelName}</div>
    </div>
  );
};

export const DemoOpener: React.FC<DemoOpenerProps> = ({channelName, avatarUrl, backgroundSrc, preset}) => (
  <AbsoluteFill style={{overflow: 'hidden', background: '#0a1022'}}>
    <Img src={staticFile(backgroundSrc)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
    <AbsoluteFill style={{background: 'linear-gradient(90deg, rgba(6,13,29,.30), rgba(6,13,29,.04) 75%)'}} />
    <KineticPreset
      preset={preset}
      primary={channelName}
      secondary="VIEWER RETENTION"
      tertiary={channelName}
      words={[channelName, 'VIEWER RETENTION', channelName]}
      accent="#ffd436"
      foreground="#ffffff"
      durationInFrames={DEMO_OPENER_DURATION_IN_FRAMES}
    />
    <ChannelIdentity channelName={channelName} avatarUrl={avatarUrl} />
  </AbsoluteFill>
);
