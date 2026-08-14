'use client';

import {FormEvent, useState} from 'react';
import {Player} from '@remotion/player';
import {Download, Link2, Play, Sparkles, Youtube} from 'lucide-react';
import {DemoOpener} from '../remotion/DemoOpener';

type Channel = {channelName: string; avatarUrl: string; source: string};

const INITIAL_URL = 'https://youtube.com/@breakingpoints';
const starterChannel: Channel = {
  channelName: 'Breaking Points',
  avatarUrl: 'https://yt3.ggpht.com/cGmY4x-DMQwLeGiQH3uHc0qQzQdrv-ygrASjf8hI0XPshxoYtWn1X2CdrMo5uAae4HqLFl06wg=s800-c-k-c0x00ffffff-no-rj',
  source: 'youtube-api',
};

const demoCards = Array.from({length: 6});

export default function Home() {
  const [channelUrl, setChannelUrl] = useState(INITIAL_URL);
  const [, setChannel] = useState<Channel>(starterChannel);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
          <span className="rounded-xl bg-[#f64b62] px-5 py-3 font-semibold text-white shadow-[0_8px_16px_rgba(246,75,98,.22)]">Get Started</span>
        </div>
      </nav>

      <div className="relative mx-auto max-w-[1250px] px-6 pb-16 pt-9 sm:px-10 lg:px-0">
        <div className="pointer-events-none absolute -left-44 top-16 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_40%_45%,rgba(255,206,168,.8),rgba(255,235,226,.48)_52%,transparent_70%)]" />
        <div className="pointer-events-none absolute -right-36 top-20 h-[22rem] w-[30rem] rounded-full bg-[radial-gradient(circle_at_55%_55%,rgba(130,225,235,.32),rgba(227,250,250,.12)_57%,transparent_70%)]" />

        <section className="relative mx-auto max-w-4xl pt-1 text-center sm:pt-3">
          <h1 className="text-balance text-[clamp(2.8rem,5.1vw,5rem)] font-extrabold leading-[1.04] tracking-[-.07em] text-[#0a1f3d]">
            Create a beautiful opener<br className="hidden sm:block" /> for your <span className="bg-gradient-to-r from-[#fa4e67] via-[#fa6d79] to-[#f3a133] bg-clip-text text-transparent">YouTube channel.</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-slate-500 sm:text-xl">Paste your channel URL and we&apos;ll automatically create<br className="hidden sm:block" /> custom motion graphic openers in seconds.</p>

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
            <p className="mt-3 flex items-center justify-center gap-2 text-sm text-slate-500">⌑ Secure. We only use public channel data.</p>
            <p aria-live="polite" className="sr-only">{error}</p>
          </form>
        </section>

        <section className="relative mx-auto mt-4 max-w-[1110px]">
          <div className="flex items-center gap-5 text-center">
            <div className="h-px flex-1 bg-slate-200" />
            <h2 className="shrink-0 text-xl font-bold tracking-[-.04em] text-[#0a1f3d]">Choose your opener</h2>
            <div className="h-px flex-1 bg-slate-200" />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {demoCards.map((_, index) => (
              <div key={index} className="relative aspect-[16/6.65] overflow-hidden rounded-2xl border border-white/80 bg-slate-200 shadow-[0_4px_12px_rgba(15,23,42,.08)]">
                <Player
                  component={DemoOpener}
                  durationInFrames={150}
                  compositionWidth={960}
                  compositionHeight={400}
                  fps={30}
                  autoPlay
                  loop
                  className="h-full w-full"
                  style={{width: '100%', height: '100%'}}
                  acknowledgeRemotionLicense
                />
              </div>
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
    </main>
  );
}

function HowItWorks({icon, title, copy, color, bg}: {icon: React.ReactNode; title: string; copy: string; color: string; bg: string}) {
  return <div className="flex items-center gap-5 sm:px-8 first:sm:pl-0 last:sm:pr-0 sm:[&:not(:last-child)]:border-r sm:[&:not(:last-child)]:border-slate-100">
    <span className={`grid h-16 w-16 shrink-0 place-items-center rounded-2xl ${bg} ${color}`}>{icon}</span>
    <div><h3 className={`font-bold ${color}`}>{title}</h3><p className="mt-1 text-sm leading-snug text-slate-600">{copy}</p></div>
  </div>;
}
