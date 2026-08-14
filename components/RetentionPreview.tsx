'use client';

import {Player} from '@remotion/player';
import {RetentionOpener} from '../remotion/RetentionOpener';

type RetentionPreviewProps = {
  channelName: string;
  avatarUrl: string;
};

export function RetentionPreview({channelName, avatarUrl}: RetentionPreviewProps) {
  return (
    <Player
      component={RetentionOpener}
      inputProps={{channelName, avatarUrl}}
      durationInFrames={150}
      compositionWidth={1080}
      compositionHeight={1920}
      fps={30}
      autoPlay
      loop
      className="overflow-hidden"
      style={{width: '100%', aspectRatio: '9 / 16'}}
      acknowledgeRemotionLicense
    />
  );
}
