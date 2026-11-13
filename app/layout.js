import './globals.css';
import { ProgressProvider } from '../lib/ProgressProvider';
import { LanguageProvider } from '../lib/LanguageProvider';
import Header from '../components/Header';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#f6f5f0',
};

export const metadata = {
  title: 'Scientific Writing: Principles and Practice',
  description:
    'Companion app for the Honours Student Program scientific writing course — follow along with each class and test your understanding.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ProgressProvider>
          <LanguageProvider>
            <Header />
            <main className="min-h-[calc(100dvh-57px)]">{children}</main>
          </LanguageProvider>
        </ProgressProvider>
      </body>
    </html>
  );
}
