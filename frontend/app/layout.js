/**
 * Modern Root layout component
 */
import './globals.css';
import { IntlProvider } from '../components/providers/IntlProvider';

export const metadata = {
  title: 'Todo App - Phase 4',
  description: 'Advanced Todo Dashboard with AI Assistant, Voice Input & Urdu Support',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <IntlProvider>
          {children}
        </IntlProvider>
      </body>
    </html>
  );
}
