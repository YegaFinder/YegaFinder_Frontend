"use client";

import { useEffect, useState } from "react";
import { X, Share, PlusSquare, Download } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISS_KEY = "yega-install-dismissed-at";
const DISMISS_DAYS = 14; // don't re-nag for 2 weeks after a dismiss

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed / running standalone
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    if (isStandalone) return;

    // Respect a recent dismissal
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt) {
      const daysSince =
        (Date.now() - Number(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DAYS) return;
    }

    const ua = window.navigator.userAgent;
    const iOSDevice = /iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream;
    setIsIOS(iOSDevice);

    if (iOSDevice) {
      // No event to wait for on iOS — just show instructions after a short delay
      const t = setTimeout(() => setVisible(true), 3000);
      return () => clearTimeout(t);
    }

    // Android / Chromium: wait for the real browser signal
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setVisible(false);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice; // 'accepted' | 'dismissed'
    setDeferredPrompt(null);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-md rounded-2xl border border-border bg-background shadow-lg p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B5C8E]/10">
        <Download className="h-5 w-5 text-[#0B5C8E]" />
      </div>

      <div className="flex-1 text-sm">
        <p className="font-medium">Install YegnaFinder</p>

        {isIOS ? (
          <p className="text-muted-foreground mt-0.5">
            Tap <Share className="inline h-3.5 w-3.5 mx-0.5 -mt-0.5" /> Share,
            then <PlusSquare className="inline h-3.5 w-3.5 mx-0.5 -mt-0.5" />{" "}
            &ldquo;Add to Home Screen&rdquo;.
          </p>
        ) : (
          <p className="text-muted-foreground mt-0.5">
            Add it to your home screen for quick, full-screen access.
          </p>
        )}

        {!isIOS && (
          <button
            onClick={handleInstall}
            className="mt-2 rounded-lg bg-[#0B5C8E] px-3 py-1.5 text-xs font-medium text-white"
          >
            Install
          </button>
        )}
      </div>

      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="text-muted-foreground hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}