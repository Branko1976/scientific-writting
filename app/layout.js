import './globals.css';
import { ProgressProvider } from '../lib/ProgressProvider';
import Header from '../components/Header';

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
          <Header />
          <main className="min-h-[calc(100vh-57px)]">{children}</main>
        </ProgressProvider>
      </body>
    </html>
  );
}
