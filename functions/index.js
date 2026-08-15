const {onRequest} = require('firebase-functions/v2/https');
const {defineSecret} = require('firebase-functions/params');

const youtubeApiKey = defineSecret('YOUTUBE_API_KEY');
const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);

function parseChannelUrl(value) {
  let url;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (!['https:', 'http:'].includes(url.protocol) || !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

  const [first, second] = url.pathname.split('/').filter(Boolean);
  if (!first) return null;
  if (first.startsWith('@')) return {url, kind: 'handle', value: first.slice(1)};
  if (first === 'channel' && second) return {url, kind: 'id', value: second};
  if (first === 'user' && second) return {url, kind: 'username', value: second};
  if (first === 'c' && second) return {url, kind: 'custom', value: second};
  return null;
}

function getMetaTag(html, selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i'))
    ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, 'i'));
  return match?.[1]?.replaceAll('&amp;', '&');
}

async function fetchFromYouTubeApi(target) {
  const apiKey = youtubeApiKey.value();
  if (!apiKey || target.kind === 'custom') return null;

  const params = new URLSearchParams({part: 'snippet', key: apiKey});
  if (target.kind === 'id') params.set('id', target.value);
  if (target.kind === 'handle') params.set('forHandle', target.value);
  if (target.kind === 'username') params.set('forUsername', target.value);

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`);
  if (!response.ok) return null;
  const data = await response.json();
  const snippet = data.items?.[0]?.snippet;
  const avatarUrl = snippet?.thumbnails?.high?.url ?? snippet?.thumbnails?.medium?.url ?? snippet?.thumbnails?.default?.url;
  return snippet?.title && avatarUrl ? {channelName: snippet.title, avatarUrl, source: 'youtube-api'} : null;
}

async function fetchPageMetadata(target) {
  try {
    const response = await fetch(target.url.toString(), {headers: {'User-Agent': 'Mozilla/5.0 (compatible; OpenerMaker/1.0)'}});
    if (!response.ok) return null;
    const html = await response.text();
    const channelName = getMetaTag(html, 'og:title')?.replace(/\s*-\s*YouTube\s*$/i, '').trim();
    const avatarUrl = getMetaTag(html, 'og:image');
    return channelName && avatarUrl ? {channelName, avatarUrl, source: 'page-metadata'} : null;
  } catch {
    return null;
  }
}

exports.fetchYoutube = onRequest({region: 'us-central1', secrets: [youtubeApiKey]}, async (request, response) => {
  if (request.method !== 'POST') return response.status(405).json({error: 'Use POST for this endpoint.'});
  const url = request.body?.url;
  if (typeof url !== 'string') return response.status(400).json({error: 'Provide a YouTube channel URL.'});

  const target = parseChannelUrl(url);
  if (!target) return response.status(400).json({error: 'Use a valid YouTube channel, handle, or username URL.'});

  const channel = await fetchFromYouTubeApi(target) ?? await fetchPageMetadata(target);
  if (channel) return response.json(channel);

  const fallbackName = target.value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  return response.json({
    channelName: fallbackName || 'Your Channel',
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'Your Channel')}&background=ef4444&color=fff&size=256&bold=true`,
    source: 'preview-fallback',
  });
});
