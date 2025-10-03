import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { PDFTextProvider } from "@/contexts/PDFTextContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import DevToolsInit from "@/components/DevToolsInit";
import ExtensionGuard from "@/components/ExtensionGuard";
import Script from 'next/script';
// import { headers } from "next/headers"; // 静态导出不需要

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: false,
});

export const metadata: Metadata = {
  title: "IMPA Marine Stores Guide",
  description: "IMPA Marine Stores Guide 8th Edition 2023 - Smart Search Platform",
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icon-192x192.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'IMPA',
  },
  formatDetection: {
    telephone: false,
  },
};

// 静态导出兼容 - 移除 force-dynamic
// export const dynamic = "force-dynamic";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 静态导出兼容 - 使用固定 nonce
  const nonce = "static-nonce";

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <meta name="application-name" content="IMPA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IMPA" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#2563eb" />
        
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-48x48.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-48x48.png" />
        <link rel="shortcut icon" href="/icon-48x48.png" type="image/png" />
        
        {/* 早期扩展防护脚本 - 最小化版本，主要功能由 ExtensionGuard 组件处理 */}
        <Script
          id="extension-guard-early"
          strategy="beforeInteractive"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              // 立即启动基础扩展防护，防止浏览器扩展干扰
              (function() {
                const originalError = console.error;
                const originalWarn = console.warn;
                const originalLog = console.log;
                
                // 最关键的扩展错误关键词
                const criticalKeywords = [
                  'chext_', 'metadata.js', 'contentscript.js', 'chrome-extension://',
                  'siteDubbingRules', 'ender metadata', 'mountUi return undefined',
                  'test', 'current url ==', 'searchs (9)', 'messages MessageEvent',
                  'enter wxt:locationchange', 'newUrl ==', 'oldUrl ==',
                  'IndexedDB initialization failed', 'falling back to localStorage',
                  'VersionError: The requested version', 'less than the existing version'
                ];
                
                function isCriticalExtensionError(args) {
                  const message = args[0];
                  if (typeof message !== 'string') return false;
                  return criticalKeywords.some(keyword => message.includes(keyword));
                }
                
                console.error = function(...args) {
                  if (isCriticalExtensionError(args)) return;
                  originalError.apply(console, args);
                };
                
                console.warn = function(...args) {
                  if (isCriticalExtensionError(args)) return;
                  originalWarn.apply(console, args);
                };
                
                console.log = function(...args) {
                  if (isCriticalExtensionError(args)) return;
                  originalLog.apply(console, args);
                };
              })();
            `,
          }}
        />
        
        {/* 注册 Service Worker - 使用 nonce */}
        <Script
          id="register-sw"
          strategy="afterInteractive"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      // ServiceWorker registered successfully
                    },
                    function(err) {
                      console.error('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
        
      </head>
      <body data-nonce={nonce} suppressHydrationWarning={true}>
        <ExtensionGuard 
          enableLogging={process.env.NODE_ENV === 'development'}
          enableIsolation={true}
          enableErrorSuppression={true}
          enableDOMProtection={true}
        />
        <ThemeProvider>
          <PDFTextProvider>
            <DevToolsInit />
            {children}
          </PDFTextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}