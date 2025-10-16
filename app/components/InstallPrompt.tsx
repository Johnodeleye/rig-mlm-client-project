'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ToastInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [hasShownPrompt, setHasShownPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleScroll = () => {
      if (deferredPrompt && !hasShownPrompt) {
        showInstallPrompt();
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('scroll', handleScroll);

    const timer = setTimeout(() => {
      if (deferredPrompt && !hasShownPrompt) {
        showInstallPrompt();
      }
    }, 5000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [deferredPrompt, hasShownPrompt]);

  const showInstallPrompt = () => {
    if (hasShownPrompt || !deferredPrompt) return;

    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } bg-white p-4 rounded-lg shadow-lg border border-blue-100`}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="h-10 w-10 text-[#0660D3]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-gray-900">
                Install RIG Global App
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get the best experience by installing RIG Global on your device.
              </p>
              <div className="mt-4 flex space-x-3 cursor-pointer">
                <button
                  onClick={async () => {
                    await handleInstallClick();
                    toast.dismiss(t.id);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white"
                  style={{ backgroundColor: '#0660D3' }}
                >
                  Install Now
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    setHasShownPrompt(true);
                    toast('You can install RIG Global later from your browser menu.', {
                      position: 'bottom-center',
                      duration: 3000,
                      icon: 'ℹ️',
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ borderColor: '#0660D3' }}
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 8000,
        position: 'bottom-center',
      }
    );

    setHasShownPrompt(true);
  };

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        toast.success(
          'Installing RIG Global... Please check your device notification.',
          {
            position: 'bottom-center',
            duration: 4000,
            style: { background: '#0660D3', color: '#fff' },
          }
        );
      } else {
        toast.error(
          'Installation cancelled. You can install later from your browser menu.',
          {
            position: 'bottom-center',
            duration: 4000,
            style: { background: '#fef2f2', color: '#b91c1c' },
          }
        );
      }
    } catch (error) {
      toast.error('An error occurred during installation. Please try again.', {
        position: 'bottom-center',
        duration: 4000,
        style: { background: '#fef2f2', color: '#b91c1c' },
      });
    }

    setDeferredPrompt(null);
  };

  return null;
}
