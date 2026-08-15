# Firebase Hosting deployment

The frontend is a Vite React app served from Firebase Hosting. The YouTube lookup runs in the `fetchYoutube` Firebase HTTPS function, so `YOUTUBE_API_KEY` remains server-side.

## One-time setup

```bash
firebase login
firebase use --add
firebase functions:secrets:set YOUTUBE_API_KEY
```

Select the target Firebase project when prompted, then provide the YouTube Data API key. Cloud Functions deployment requires the Blaze plan.

## Deploy

```bash
npm run deploy
```

This builds the frontend into `dist/`, deploys it to Firebase Hosting, and rewrites `/api/fetch-youtube` to the serverless function.

## Local development

```bash
npm run dev
```

For a complete local frontend + API environment, install the functions dependencies once and start Firebase emulators:

```bash
cd functions && npm install && cd ..
npm run emulate
```
