import React from 'react';
import {Composition} from 'remotion';
import {RetentionOpener, type RetentionOpenerProps} from './RetentionOpener';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="RetentionOpener"
    component={RetentionOpener}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      channelName: 'Your Channel',
      avatarUrl: 'https://ui-avatars.com/api/?name=Your+Channel&background=ef4444&color=fff&size=256',
    }}
  />
);
