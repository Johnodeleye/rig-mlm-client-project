// app/layout.tsx (updated)
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Outfit } from "next/font/google";
import NavigationProgress from "./components/NavigationProgress";
import { Toaster } from "react-hot-toast";
import { TopLoader } from "next-top-loader";
import ClientComponents from "./components/ClientComponents";

const font = Outfit({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0660D3",
};

export const metadata: Metadata = {
  title: "RIG Global - MLM Management System",
  description:
    "RIG Global is a modern MLM management platform for tracking users, downlines, commissions, and earnings. Secure, scalable, and built for transparency and growth.",
  keywords:
    "RIG Global, MLM system, network marketing, commission tracking, referral management, business dashboard",
  authors: [{ name: "Built by John Odeleye Ayomide", url: "https://rigglobal.com" }],
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                      console.log('ServiceWorker registration successful');
                    })
                    .catch(err => {
                      console.log('ServiceWorker registration failed: ', err);
                    });
                });
              }
            `,
          }}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0660D3" />
        <link rel="manifest" href="/manifest.json" />
      </head>

      <body className={font.className}>
        <NavigationProgress />
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0660D3',
              color: '#fff',
              borderRadius: '8px',
              fontWeight: 500,
            },
            success: {
              duration: 3000,
              style: { background: '#0660D3', color: '#fff' },
            },
            error: {
              duration: 4000,
              style: { background: '#ef4444', color: '#fff' },
            },
          }}
        />

        {children}
        <TopLoader color="#0660D3" height={4} />
        <ClientComponents />

        <div className="mx-auto md:pb-0 pb-26">
          <div className="md:ml-64 lg:mr-80 lg:mb-0 md:mb-0 hidden lg:block">
            {/* <Footer /> */}
          </div>
        </div>
      </body>  
    </html>
  );
}