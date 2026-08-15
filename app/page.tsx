'use client';

import {FormEvent, useState} from 'react';
import {Player} from '@remotion/player';
import {Bell, Bookmark, Download, Link2, Menu, Mic, MoreHorizontal, Play, Search, Share2, Sparkles, ThumbsUp, X, Youtube} from 'lucide-react';
import {DEMO_OPENER_DURATION_IN_FRAMES, DemoOpener} from '../remotion/DemoOpener';

type Channel = {channelName: string; avatarUrl: string; source: string};

const INITIAL_URL = 'https://youtube.com/@breakingpoints';
const starterChannel: Channel = {
  channelName: 'Breaking Points',
  avatarUrl: 'https://yt3.ggpht.com/cGmY4x-DMQwLeGiQH3uHc0qQzQdrv-ygrASjf8hI0XPshxoYtWn1X2CdrMo5uAae4HqLFl06wg=s800-c-k-c0x00ffffff-no-rj',
  source: 'youtube-api',
};

const demoCards = [
  {id: 'topographic', backgroundSrc: 'opener-topographic.png', preset: 'radial-badge'},
  {id: 'mountain', backgroundSrc: 'opener-demo.png', preset: 'pivot-stack'},
  {id: 'ocean', backgroundSrc: 'opener-ocean.png', preset: 'impact-cycle'},
  {id: 'neon', backgroundSrc: 'opener-neon.png', preset: 'split-quote'},
  {id: 'paper', backgroundSrc: 'opener-paper.png', preset: 'glyph-orbit'},
  {id: 'bokeh', backgroundSrc: 'opener-bokeh.png', preset: 'emphasis-stack'},
] as const;

type DemoCard = (typeof demoCards)[number];

export default function Home() {
  const [channelUrl, setChannelUrl] = useState(INITIAL_URL);
  const [channel, setChannel] = useState<Channel>(starterChannel);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [isHybridModalOpen, setIsHybridModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DemoCard>(demoCards[0]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/fetch-youtube', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url: channelUrl}),
      });
      const payload = await response.json() as Channel & {error?: string};
      if (!response.ok) throw new Error(payload.error ?? 'Unable to load this channel.');
      setChannel(payload);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load this channel.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#fffdfb] text-[#0b1e3b]">
      <nav className="relative z-10 flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/75 px-6 backdrop-blur sm:px-10 lg:px-[5.5%]">
        <div className="flex items-center gap-3 text-xl font-extrabold tracking-[-.04em]">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#ff5966] to-[#f13c5a] text-white shadow-[0_7px_18px_rgba(241,60,90,.24)]"><Play size={17} fill="currentColor" /></span>
          Opener Maker
        </div>
        <div className="hidden items-center gap-10 text-sm font-medium text-slate-800 md:flex">
          <span>Examples</span><span>How it works</span><span>Pricing</span><span>FAQ</span>
          <span className="hidden rounded-xl bg-[#f64b62] px-5 py-3 font-semibold text-white shadow-[0_8px_16px_rgba(246,75,98,.22)]">Get Started</span>
        </div>
      </nav>

      <div className="relative mx-auto max-w-[1250px] px-6 pb-16 pt-9 sm:px-10 lg:px-0">
        <div className="pointer-events-none absolute -left-44 top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_40%_45%,rgba(255,206,168,.8),rgba(255,235,226,.48)_52%,transparent_70%)]" />
        <div className="pointer-events-none absolute -right-36 top-20 h-[22rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_55%_55%,rgba(130,225,235,.32),rgba(227,250,250,.12)_57%,transparent_70%)]" />

        <section className="relative mx-auto max-w-4xl pt-1 text-center sm:pt-3">
          <h1 className="hidden text-balance text-[clamp(2.8rem,5.1vw,5rem)] font-extrabold leading-[1.04] tracking-[-.07em] text-[#0a1f3d]">
            Create a beautiful opener<br className="hidden sm:block" /> for your <span className="bg-gradient-to-r from-[#fa4e67] via-[#fa6d79] to-[#f3a133] bg-clip-text text-transparent">YouTube channel.</span>
          </h1>
          <p className="hidden mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">Paste your channel URL and we&apos;ll automatically create<br className="hidden sm:block" /> custom motion graphic openers in seconds.</p>

          <form onSubmit={handleSubmit} className="mx-auto mt-5 max-w-3xl">
            <div className="flex items-center rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_12px_30px_rgba(15,23,42,.07)]">
              <Youtube className="ml-3 shrink-0 fill-red-600 text-red-600" size={27} />
              <input
                id="channel-url"
                aria-label="YouTube channel URL"
                type="url"
                required
                value={channelUrl}
                onChange={(event) => setChannelUrl(event.target.value)}
                placeholder="Paste your YouTube channel URL"
                className="h-12 min-w-0 flex-1 bg-transparent px-4 text-base text-slate-700 outline-none placeholder:text-slate-400 sm:text-lg"
              />
              <button type="submit" disabled={isLoading} className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-[#f74e67] to-[#f64261] px-5 text-sm font-bold text-white shadow-[0_8px_16px_rgba(246,75,98,.22)] transition hover:brightness-105 disabled:opacity-70 sm:px-7 sm:text-base">
                {isLoading ? 'Generating…' : 'Generate Openers'} <Sparkles size={17} />
              </button>
            </div>
            <p className="hidden mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">⌑ Secure. We only use public channel data.</p>
            <p aria-live="polite" className="sr-only">{error}</p>
          </form>
        </section>

        <YouTubeWatchPreview channel={channel} template={demoCards[0]} />

        <section className="relative mx-auto mt-4 max-w-[1110px]">
          <div className="flex items-center gap-5 text-center">
            <div className="h-px flex-1 bg-slate-200" />
            <h2 className="shrink-0 text-xl font-bold tracking-[-.04em] text-[#0a1f3d]">Choose your opener</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {demoCards.map((template, index) => (
              <button key={template.id} type="button" onClick={() => { setSelectedTemplate(template); if (index < 2) setIsYouTubeModalOpen(true); else if (index < 4) setIsModalOpen(true); else setIsHybridModalOpen(true); }} aria-label={`Open ${channel.channelName} opener preview`} className="relative aspect-[16/6.65] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/80 bg-slate-200 text-left shadow-[0_4px_12px_rgba(15,23,42,.08)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(15,23,42,.16)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f64b62]/40">
                <Player
                  key={`${template.id}-${channel.channelName}-${channel.avatarUrl}`}
                  component={DemoOpener}
                  inputProps={{channelName: channel.channelName, avatarUrl: channel.avatarUrl, backgroundSrc: template.backgroundSrc, preset: template.preset}}
                  durationInFrames={DEMO_OPENER_DURATION_IN_FRAMES}
                  compositionWidth={960}
                  compositionHeight={400}
                  fps={30}
                  autoPlay
                  loop
                  className="h-full w-full"
                  style={{width: '100%', height: '100%'}}
                  acknowledgeRemotionLicense
                />
              </button>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-slate-500"><span className="mr-2 text-xl text-[#fb5569]">♡</span>Preview each style and pick your favorite. You can download it instantly.</p>
        </section>

        <section className="relative mx-auto mt-4 grid max-w-[1080px] gap-5 rounded-[1.6rem] border border-slate-200 bg-white px-7 py-5 shadow-[0_10px_26px_rgba(15,23,42,.05)] sm:grid-cols-3 sm:gap-0 sm:px-10">
          <HowItWorks icon={<Link2 />} title="1. Paste URL" copy="Add your YouTube channel URL above." color="text-[#f64b62]" bg="bg-rose-100" />
          <HowItWorks icon={<Sparkles />} title="2. We Generate" copy="Our AI creates multiple unique openers based on your channel." color="text-[#f19a30]" bg="bg-amber-100" />
          <HowItWorks icon={<Download />} title="3. Download" copy="Choose your favorite and download in high quality." color="text-[#59ad45]" bg="bg-green-100" />
        </section>
      </div>
      {isModalOpen ? <OpenerModal channel={channel} template={selectedTemplate} onClose={() => setIsModalOpen(false)} /> : null}
      {isYouTubeModalOpen ? <YouTubeWatchModal channel={channel} template={selectedTemplate} onClose={() => setIsYouTubeModalOpen(false)} /> : null}
      {isHybridModalOpen ? <HybridOpenerModal channel={channel} template={selectedTemplate} onClose={() => setIsHybridModalOpen(false)} /> : null}
    </main>
  );
}

const relatedVideos = [
  {title: '7 Ways to Turn First-Time Viewers Into Fans', thumbnail: 'BOOST WATCH TIME', views: '184K views · 2 days ago'},
  {title: 'Why Your Best Videos Lose Attention Too Soon', thumbnail: 'MAKE THEM STAY', views: '92K views · 5 days ago'},
  {title: 'The Engagement System Creators Use on Every Upload', thumbnail: 'MORE ENGAGEMENT', views: '246K views · 1 week ago'},
  {title: 'The Hook Framework That Makes Viewers Keep Watching', thumbnail: 'STOP THE SCROLL', views: '71K views · 2 weeks ago'},
];

function YouTubeWatchPreview({channel, template}: {channel: Channel; template: DemoCard}) {
  return (
    <section aria-label="Live YouTube watch preview" className="relative mx-auto mt-8 max-w-[1110px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-[0_14px_34px_rgba(15,23,42,.08)]">
      <header className="flex h-14 items-center gap-3 border-b border-slate-100 px-4 sm:px-5">
        <Menu size={19} className="shrink-0" />
        <div className="flex items-center gap-1 text-lg font-bold tracking-[-.07em] text-black"><span className="grid h-5 w-8 place-items-center rounded-[6px] bg-red-600 text-white"><Play size={10} fill="currentColor" /></span>YouTube</div>
        <div className="mx-auto hidden max-w-[360px] flex-1 items-center sm:flex"><div className="flex h-8 flex-1 items-center rounded-l-full border border-slate-300 px-3 text-xs text-slate-500">Search</div><span className="grid h-8 w-10 place-items-center rounded-r-full border border-l-0 border-slate-300 bg-slate-50"><Search size={16} /></span></div>
        <div className="ml-auto flex items-center gap-3"><Bell size={18} /><span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-red-600 to-rose-400 text-[10px] font-black text-white">OM</span></div>
      </header>
      <div className="grid gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-xl bg-black">
            <Player
              key={`page-youtube-${template.id}-${channel.channelName}-${channel.avatarUrl}`}
              component={DemoOpener}
              inputProps={{channelName: channel.channelName, avatarUrl: channel.avatarUrl, backgroundSrc: template.backgroundSrc, preset: template.preset}}
              durationInFrames={DEMO_OPENER_DURATION_IN_FRAMES}
              compositionWidth={960}
              compositionHeight={540}
              fps={30}
              autoPlay
              loop
              style={{width: '100%', aspectRatio: '16 / 9'}}
              acknowledgeRemotionLicense
            />
          </div>
          <h2 className="mt-3 text-base font-bold tracking-[-.03em] text-slate-950 sm:text-lg">The 5-Minute Opener Formula That Keeps Viewers Watching</h2>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-red-600 to-rose-400 text-[10px] font-black text-white">OM</span><div><p className="text-sm font-semibold text-slate-950">Opener Maker</p><p className="text-[11px] text-slate-500">1.24M subscribers</p></div><span className="ml-2 rounded-full bg-black px-3 py-1.5 text-xs font-semibold text-white">Subscribe</span></div>
            <div className="flex items-center gap-2"><Action icon={<ThumbsUp size={15} />} label="12K" /><Action icon={<Share2 size={15} />} label="Share" /></div>
          </div>
        </div>
        <aside className="space-y-3">
          <div className="flex gap-2 overflow-hidden"><span className="rounded-lg bg-black px-3 py-1.5 text-xs font-semibold text-white">All</span><span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold">Engagement</span></div>
          {relatedVideos.slice(0, 3).map((video) => <RelatedVideo key={video.title} {...video} />)}
        </aside>
      </div>
    </section>
  );
}

function YouTubeWatchModal({channel, template, onClose}: {channel: Channel; template: DemoCard; onClose: () => void}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-2 backdrop-blur-sm sm:p-6" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-label="YouTube-style opener preview" className="relative h-[94vh] w-full max-w-[1500px] overflow-y-auto rounded-2xl bg-white shadow-[0_32px_100px_rgba(15,23,42,.34)]" onMouseDown={(event) => event.stopPropagation()}>
        <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-slate-100 bg-white px-4 sm:px-6">
          <Menu size={23} className="shrink-0" />
          <div className="flex items-center gap-1.5 text-xl font-bold tracking-[-.07em] text-black"><span className="grid h-6 w-9 place-items-center rounded-[7px] bg-red-600 text-white"><Play size={12} fill="currentColor" /></span>YouTube</div>
          <div className="mx-auto hidden max-w-[560px] flex-1 items-center md:flex"><div className="flex h-10 flex-1 items-center rounded-l-full border border-slate-300 px-4 text-sm text-slate-500">Search</div><button type="button" aria-label="Search" className="grid h-10 w-14 place-items-center rounded-r-full border border-l-0 border-slate-300 bg-slate-50"><Search size={21} /></button><button type="button" aria-label="Voice search" className="ml-3 grid h-10 w-10 place-items-center rounded-full bg-slate-100"><Mic size={19} /></button></div>
          <div className="ml-auto flex items-center gap-3"><button type="button" className="hidden rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold sm:block">+ Create</button><Bell size={21} /><button type="button" onClick={onClose} aria-label="Close preview" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><X size={18} /></button></div>
        </header>

        <div className="mx-auto grid max-w-[1440px] gap-6 p-4 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-6">
          <div className="min-w-0">
            <div className="overflow-hidden rounded-xl bg-black">
              <Player
                key={`youtube-${template.id}-${channel.channelName}-${channel.avatarUrl}`}
                component={DemoOpener}
                inputProps={{channelName: channel.channelName, avatarUrl: channel.avatarUrl, backgroundSrc: template.backgroundSrc, preset: template.preset}}
                durationInFrames={DEMO_OPENER_DURATION_IN_FRAMES}
                compositionWidth={960}
                compositionHeight={540}
                fps={30}
                autoPlay
                loop
                style={{width: '100%', aspectRatio: '16 / 9'}}
                acknowledgeRemotionLicense
              />
            </div>
            <h2 className="mt-4 text-xl font-bold tracking-[-.03em] text-slate-950 sm:text-2xl">The 5-Minute Opener Formula That Keeps Viewers Watching</h2>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-red-600 to-rose-400 text-sm font-black text-white">OM</span><div><p className="font-semibold text-slate-950">Opener Maker</p><p className="text-xs text-slate-500">1.24M subscribers</p></div><button type="button" className="ml-2 rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">Subscribe</button></div>
              <div className="flex items-center gap-2"><Action icon={<ThumbsUp size={18} />} label="12K" /><Action icon={<Share2 size={18} />} label="Share" /><Action icon={<Bookmark size={18} />} label="Save" /><button type="button" aria-label="More options" className="grid h-9 w-9 place-items-center rounded-full bg-slate-100"><MoreHorizontal size={20} /></button></div>
            </div>
            <div className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-sm leading-relaxed text-slate-700"><strong>18K views</strong> · 1 day ago<br /><span className="text-slate-600">Use this opener framework to build stronger hooks and increase viewer engagement from the very first second.</span></div>
          </div>

          <aside className="space-y-3">
            <div className="flex gap-2 overflow-hidden pb-1"><span className="shrink-0 rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white">All</span><span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold">Engagement</span><span className="shrink-0 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold">Creator growth</span></div>
            {relatedVideos.map((video) => <RelatedVideo key={video.title} {...video} />)}
          </aside>
        </div>
      </section>
    </div>
  );
}

function Action({icon, label}: {icon: React.ReactNode; label: string}) {
  return <button type="button" className="inline-flex h-9 items-center gap-2 rounded-full bg-slate-100 px-3 text-sm font-semibold text-slate-800">{icon}<span>{label}</span></button>;
}

function RelatedVideo({title, thumbnail, views}: {title: string; thumbnail: string; views: string}) {
  return <article className="grid grid-cols-[168px_1fr] gap-3">
    <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-900"><img src="/engagement-video-generic.png" alt="Abstract creator engagement visual" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/5 to-transparent" /><span className="absolute bottom-2 left-2 right-2 text-xs font-black leading-none tracking-[-.04em] text-white">{thumbnail}</span><span className="absolute bottom-1 right-1 rounded bg-black/85 px-1.5 py-0.5 text-[10px] font-medium text-white">8:42</span></div>
    <div className="min-w-0"><h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-950">{title}</h3><p className="mt-1 text-xs text-slate-500">Creator Growth Lab</p><p className="text-xs text-slate-500">{views}</p></div>
  </article>;
}

function HybridOpenerModal({channel, template, onClose}: {channel: Channel; template: DemoCard; onClose: () => void}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-2 backdrop-blur-sm sm:p-6" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="hybrid-modal-title" className="relative grid h-[94vh] w-full max-w-[1500px] overflow-y-auto rounded-2xl bg-white shadow-[0_32px_100px_rgba(15,23,42,.28)] lg:grid-cols-[.88fr_1.45fr]" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close opener preview" className="absolute right-5 top-5 z-20 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"><X size={19} /></button>
        <div className="flex min-h-[390px] flex-col justify-between p-8 sm:p-11">
          <div>
            <span className="rounded bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">Free</span>
            <h2 id="hybrid-modal-title" className="mt-28 text-4xl font-extrabold leading-[.94] tracking-[-.075em] text-slate-950 sm:text-5xl">{channel.channelName}<br />Opener</h2>
            <button type="button" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17171d] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#2d2d35]"><Download size={17} /> Download as .mp4</button>
          </div>
          <p className="mt-12 max-w-xs text-sm leading-relaxed text-slate-500">A kinetic opener using your channel profile image and name, ready to make the first seconds count.</p>
        </div>
        <div className="flex min-h-[390px] items-center justify-center bg-[#f3f3f5] p-6 pt-16 sm:p-10 sm:pt-16">
          <div className="grid w-full max-w-[720px] gap-4 xl:grid-cols-[minmax(0,1fr)_160px]">
            <div className="min-w-0">
              <div className="overflow-hidden rounded-xl bg-black shadow-[0_18px_45px_rgba(15,23,42,.16)]">
                <Player
                  key={`hybrid-${template.id}-${channel.channelName}-${channel.avatarUrl}`}
                  component={DemoOpener}
                  inputProps={{channelName: channel.channelName, avatarUrl: channel.avatarUrl, backgroundSrc: template.backgroundSrc, preset: template.preset}}
                  durationInFrames={DEMO_OPENER_DURATION_IN_FRAMES}
                  compositionWidth={960}
                  compositionHeight={540}
                  fps={30}
                  autoPlay
                  loop
                  style={{width: '100%', aspectRatio: '16 / 9'}}
                  acknowledgeRemotionLicense
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-3"><div className="min-w-0"><p className="truncate text-sm font-bold text-slate-950">The 5-Minute Opener Formula</p><p className="text-xs text-slate-500">18K views · 1 day ago</p></div><Action icon={<ThumbsUp size={15} />} label="12K" /></div>
            </div>
            <aside className="hidden space-y-3 xl:block">
              {relatedVideos.slice(0, 2).map((video) => <MiniRelatedVideo key={video.title} {...video} />)}
            </aside>
          </div>
        </div>
        <div className="border-t border-slate-100 p-8 lg:col-span-2 lg:grid lg:grid-cols-[.88fr_1.45fr] lg:gap-12 lg:px-11">
          <div className="hidden lg:block" />
          <div><p className="max-w-xl text-sm leading-relaxed text-slate-600">Your channel profile and name are brought on with the same energetic typography movement shown in the opener gallery.</p><dl className="mt-6 grid grid-cols-[96px_1fr] gap-y-2 text-sm"><dt className="font-medium text-slate-800">Duration</dt><dd className="text-slate-500">2 seconds</dd><dt className="font-medium text-slate-800">Ratio</dt><dd className="text-slate-500">16:9</dd></dl></div>
        </div>
      </section>
    </div>
  );
}

function MiniRelatedVideo({title, thumbnail}: Pick<(typeof relatedVideos)[number], 'title' | 'thumbnail'>) {
  return <article><div className="relative aspect-video overflow-hidden rounded-md"><img src="/engagement-video-generic.png" alt="Abstract creator engagement visual" className="h-full w-full object-cover" /><span className="absolute bottom-1 left-1 right-1 text-[9px] font-black leading-none text-white">{thumbnail}</span></div><p className="mt-1 line-clamp-2 text-xs font-bold leading-tight text-slate-900">{title}</p><p className="mt-0.5 text-[10px] text-slate-500">Creator Growth Lab</p></article>;
}

function OpenerModal({channel, template, onClose}: {channel: Channel; template: DemoCard; onClose: () => void}) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/35 p-4 backdrop-blur-sm sm:p-8" onMouseDown={onClose}>
      <section role="dialog" aria-modal="true" aria-labelledby="opener-modal-title" className="relative grid max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-[2rem] bg-white shadow-[0_32px_100px_rgba(15,23,42,.28)] lg:grid-cols-[.88fr_1.45fr]" onMouseDown={(event) => event.stopPropagation()}>
        <button type="button" onClick={onClose} aria-label="Close opener preview" className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-700 shadow-sm transition hover:bg-slate-50"><X size={19} /></button>
        <div className="flex min-h-[390px] flex-col justify-between p-8 sm:p-11">
          <div>
            <span className="rounded bg-violet-100 px-2 py-0.5 text-xs font-bold text-violet-700">Free</span>
            <h2 id="opener-modal-title" className="mt-28 text-4xl font-extrabold leading-[.94] tracking-[-.075em] text-slate-950 sm:text-5xl">{channel.channelName}<br />Opener</h2>
            <button type="button" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#17171d] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#2d2d35]"><Download size={17} /> Download as .mp4</button>
          </div>
          <p className="mt-12 max-w-xs text-sm leading-relaxed text-slate-500">A kinetic opener using your channel profile image and name, ready to make the first seconds count.</p>
        </div>
        <div className="flex min-h-[390px] items-center justify-center bg-[#f3f3f5] p-8 sm:p-14">
          <div className="w-full max-w-[680px] overflow-hidden rounded-xl bg-slate-900 shadow-[0_18px_45px_rgba(15,23,42,.16)]">
            <Player
              key={`modal-${template.id}-${channel.channelName}-${channel.avatarUrl}`}
              component={DemoOpener}
              inputProps={{channelName: channel.channelName, avatarUrl: channel.avatarUrl, backgroundSrc: template.backgroundSrc, preset: template.preset}}
              durationInFrames={DEMO_OPENER_DURATION_IN_FRAMES}
              compositionWidth={960}
              compositionHeight={400}
              fps={30}
              autoPlay
              loop
              style={{width: '100%', aspectRatio: '16 / 6.65'}}
              acknowledgeRemotionLicense
            />
          </div>
        </div>
        <div className="border-t border-slate-100 p-8 lg:col-span-2 lg:grid lg:grid-cols-[.88fr_1.45fr] lg:gap-12 lg:px-11">
          <div className="hidden lg:block" />
          <div>
            <p className="max-w-xl text-sm leading-relaxed text-slate-600">Your channel profile and name are brought on with the same energetic typography movement shown in the opener gallery.</p>
            <dl className="mt-6 grid grid-cols-[96px_1fr] gap-y-2 text-sm"><dt className="font-medium text-slate-800">Duration</dt><dd className="text-slate-500">2 seconds</dd><dt className="font-medium text-slate-800">Ratio</dt><dd className="text-slate-500">16:9</dd></dl>
          </div>
        </div>
      </section>
    </div>
  );
}

function HowItWorks({icon, title, copy, color, bg}: {icon: React.ReactNode; title: string; copy: string; color: string; bg: string}) {
  return <div className="flex items-center gap-5 sm:px-8 first:sm:pl-0 last:sm:pr-0 sm:[&:not(:last-child)]:border-r sm:[&:not(:last-child)]:border-slate-100">
    <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${bg} ${color}`}>{icon}</span>
    <div><h3 className={`font-bold ${color}`}>{title}</h3><p className="mt-1 text-sm leading-snug text-slate-600">{copy}</p></div>
  </div>;
}
