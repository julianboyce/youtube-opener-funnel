import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sell Me This Pen | Retention Opener Generator',
  description: 'Turn a YouTube channel URL into a high-energy retention opener.',
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
