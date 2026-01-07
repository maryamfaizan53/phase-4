/**
 * Modern Root layout component
 */
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata = {
  title: 'Todo AI - Elite Task Management',
  description: 'Experience the next generation of productivity with AI-driven task management and elite UI.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-black">
      <body className="min-h-screen bg-black relative">
        <div className="ambient-background">
          <div className="ambient-orb w-[500px] h-[500px] bg-brand-400 top-[-10%] left-[-10%]"></div>
          <div className="ambient-orb w-[600px] h-[600px] bg-brand-secondary bottom-[-10%] right-[-10%] animate-delay-300"></div>
          <div className="ambient-orb w-[400px] h-[400px] bg-brand-accent top-[30%] right-[10%] opacity-10"></div>
        </div>
        <AuthProvider>
          <div className="relative z-10">
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
