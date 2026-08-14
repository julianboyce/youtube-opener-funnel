import {NextRequest, NextResponse} from 'next/server';

type ChannelPayload = {
  channelName: string;
  avatarUrl: string;
  source: 'youtube-api' | 'page-metadata' | 'preview-fallback';
};

const YOUTUBE_HOSTS = new Set(['youtube.com', 'www.youtube.com', 'm.youtube.com']);

function parseChannelUrl(value: string): {url: URL; kind: 'id' | 'handle' | 'username' | 'custom'; value: string} | null {
  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    return null;
  }

  if (!['https:', 'http:'].includes(url.protocol) || !YOUTUBE_HOSTS.has(url.hostname.toLowerCase())) return null;

  const parts = url.pathname.split('/').filter(Boolean);
  const [first, second] = parts;
  if (!first) return null;
  if (first.startsWith('@')) return {url, kind: 'handle', value: first.slice(1)};
  if (first === 'channel' && second) return {url, kind: 'id', value: second};
  if (first === 'user' && second) return {url, kind: 'username', value: second};
  if (first === 'c' && second) return {url, kind: 'custom', value: second};
  return null;
}

function getMetaTag(html: string, selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = html.match(new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']+)["']`, 'i'))
    ?? html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${escaped}["']`, 'i'));
  return match?.[1]?.replaceAll('&amp;', '&');
}

async function fetchFromYouTubeApi(target: NonNullable<ReturnType<typeof parseChannelUrl>>): Promise<ChannelPayload | null> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return null;

  const params = new URLSearchParams({part: 'snippet', key: apiKey});
  if (target.kind === 'id') params.set('id', target.value);
  if (target.kind === 'handle') params.set('forHandle', target.value);
  if (target.kind === 'username') params.set('forUsername', target.value);
  if (target.kind === 'custom') return null;

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?${params}`, {next: {revalidate: 3600}});
  if (!response.ok) return null;
  const data = await response.json() as {items?: Array<{snippet?: {title?: string; thumbnails?: {high?: {url?: string}; medium?: {url?: string}; default?: {url?: string}}}}>};
  const snippet = data.items?.[0]?.snippet;
  const avatarUrl = snippet?.thumbnails?.high?.url ?? snippet?.thumbnails?.medium?.url ?? snippet?.thumbnails?.default?.url;
  if (!snippet?.title || !avatarUrl) return null;
  return {channelName: snippet.title, avatarUrl, source: 'youtube-api'};
}

async function fetchPageMetadata(target: NonNullable<ReturnType<typeof parseChannelUrl>>): Promise<ChannelPayload | null> {
  try {
    const response = await fetch(target.url.toString(), {
      headers: {'User-Agent': 'Mozilla/5.0 (compatible; SellMeThisPen/1.0)'},
      next: {revalidate: 3600},
    });
    if (!response.ok) return null;
    const html = await response.text();
    const title = getMetaTag(html, 'og:title')?.replace(/\s*-\s*YouTube\s*$/i, '').trim();
    const avatarUrl = getMetaTag(html, 'og:image');
    if (!title || !avatarUrl) return null;
    return {channelName: title, avatarUrl, source: 'page-metadata'};
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as {url?: unknown} | null;
  if (typeof body?.url !== 'string') {
    return NextResponse.json({error: 'Provide a YouTube channel URL.'}, {status: 400});
  }

  const target = parseChannelUrl(body.url);
  if (!target) {
    return NextResponse.json({error: 'Use a valid YouTube channel, handle, or username URL.'}, {status: 400});
  }

  const channel = await fetchFromYouTubeApi(target) ?? await fetchPageMetadata(target);
  if (channel) return NextResponse.json(channel);

  const fallbackName = target.value.replace(/[-_]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  return NextResponse.json({
    channelName: fallbackName || 'Your Channel',
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || 'Your Channel')}&background=ef4444&color=fff&size=256&bold=true`,
    source: 'preview-fallback',
  } satisfies ChannelPayload);
}
