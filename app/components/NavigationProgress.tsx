// components/NavigationProgress.tsx
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

export default function NavigationProgress() {
  const pathname = usePathname();

  useEffect(() => {
    // Configure nProgress
    nProgress.configure({
      showSpinner: false,
      trickleSpeed: 300,
    });

    // Start progress bar on route change start
    const handleStart = () => {
      nProgress.start();
    };

    // Complete progress bar on route change complete
    const handleComplete = () => {
      nProgress.done();
    };

    // Listen to Next.js route change events
    handleStart(); // Start immediately when component mounts (route change starts)

    // Simulate completion after a short delay or when page loads
    const timer = setTimeout(() => {
      handleComplete();
    }, 300);

    return () => {
      clearTimeout(timer);
      handleComplete();
    };
  }, [pathname]);

  return null;
}