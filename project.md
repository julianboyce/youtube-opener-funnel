# Sell Me This Pen — Project Roadmap

## Goal

Build a single-page Next.js funnel where a YouTube creator pastes a channel URL, receives channel metadata, and immediately sees a five-second Remotion kinetic-typography preview.

## Implementation plan

1. Initialize a Next.js App Router project with TypeScript and Tailwind CSS.
2. Add the client-side funnel interface: URL input, submit state, channel result card, and embedded `@remotion/player` preview.
3. Add `POST /api/fetch-youtube`, validating a YouTube URL and retrieving channel title/avatar with the YouTube Data API when `YOUTUBE_API_KEY` is configured. Provide a clear mock fallback for local preview when it is not.
4. Create a reusable Remotion composition with `channelName` and `avatarUrl` props, a 5-second 9:16 frame, spring avatar entrance, and kinetic text transitions using the supplied motion components.
5. Verify the application with linting, type checks, and a production build; document the local launch commands.

## Request flow

```text
Creator pastes YouTube URL
        ↓
POST /api/fetch-youtube
        ↓
Channel name + avatar URL
        ↓
React state updates the Remotion Player props
        ↓
Live 5-second retention-opener preview
```

## Notes

- The API key stays server-only: it is read from `.env` and never exposed to the browser.
- Handles, `/channel/` IDs, and `/user/` URLs are supported when the API key is available.
- The included motion utilities remain source assets and are reused by the new video component.
