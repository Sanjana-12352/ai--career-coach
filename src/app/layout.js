// src/app/layout.js
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = {
  title: 'SENSAI - AI Career Coach',
  description: 'Your intelligent career guidance platform powered by AI',
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#667eea',
          colorBackground: '#000000',
          colorText: '#ffffff',
        },
      }}
    >
      <html lang="en">
        <body>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              style: {
                background: '#1f2937',
                color: '#fff',
                border: '1px solid #374151',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}