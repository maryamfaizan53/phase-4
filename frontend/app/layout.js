/**
 * Modern Root layout component
 */
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata = {
  title: 'Todo App - Phase II',
  description: 'Full-stack todo application with Next.js and FastAPI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black">
      <body className="min-h-screen bg-black">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
