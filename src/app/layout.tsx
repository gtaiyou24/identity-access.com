import type { Metadata } from "next";
import {Inter, Inter as FontSans} from "next/font/google"
import "./globals.css";

import Providers from "@/components/layout/providers";
import {auth} from "@/auth";
import {SessionProvider} from "next-auth/react";
import {Toaster} from "@/components/ui/sonner";
import {cn} from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Epic Bot",
  description: "ノーコードでシンプルな Web スクレイピング SaaS",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="ja">
        <body className={cn(inter.className, 'overflow-hidden')}>
          <Toaster />
          <Providers>
            {children}
          </Providers>
        </body>
      </html>
    </SessionProvider>
  );
}
