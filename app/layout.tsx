import type { Metadata } from "next";
import "./globals.css";

import { Toaster } from 'react-hot-toast';
import AuthProvider from '@/components/AuthProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";

async function getSession() {
  const session = await getServerSession(authOptions)
  return session
}

export const metadata: Metadata = {
  title: "PMTech | Report",
  description: "PMTech system report.",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await getSession()

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://pro.fontawesome.com/releases/v5.15.0/css/all.css" />
      </head>
      <body>
        <Toaster position="top-right" reverseOrder={false} />
        
        <AuthProvider session={session}>
          <div className="container mx-auto">
            <div className="flex flex-col max-w-4xl mx-auto">
              <Navbar />
              <div className="py-6">{children}</div>
              <Footer />
            </div>
          </div>
        </AuthProvider>
      </body>
      <GoogleAnalytics gaId="G-80BZHXGRJR" />
    </html>
  );
}
