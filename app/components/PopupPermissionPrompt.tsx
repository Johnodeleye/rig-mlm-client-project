// components/PopupPermissionPrompt.tsx
'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function PopupPermissionPrompt() {
  const [hasShownPrompt, setHasShownPrompt] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    // Check if we've already shown the prompt
    const hasShown = localStorage.getItem('popupPromptShown');
    if (hasShown) {
      setHasShownPrompt(true);
      return;
    }

    // Show prompt after a delay
    const timer = setTimeout(() => {
      showPopupPrompt();
    }, 8000);

    return () => clearTimeout(timer);
  }, []);

  const showPopupPrompt = () => {
    if (hasShownPrompt) return;

    toast.custom(
      (t) => (
        <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} 
          bg-white p-4 rounded-lg shadow-lg border border-blue-100 max-w-md mx-auto`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-10 w-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm12 4a2 2 0 00-2-2h-2a2 2 0 00-2 2v7a3 3 0 106 0V6zm-4-2h2a2 2 0 012 2v1h-4V4a2 2 0 012-2z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-gray-900">Enable Pop-ups for HubPost</h3>
              <p className="mt-1 text-sm text-gray-500">
                Allow pop-ups for the best experience and to ensure all features work correctly, including notifications and external links.
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={async () => {
                    await handleAllowPopup();
                    toast.dismiss(t.id);
                  }}
                  disabled={isChecking}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isChecking ? 'Checking...' : 'Allow Pop-ups'}
                </button>
                <button
                  onClick={() => {
                    toast.dismiss(t.id);
                    setHasShownPrompt(true);
                    localStorage.setItem('popupPromptShown', 'true');
                    toast('You can enable pop-ups later in your browser settings.', {
                      position: 'bottom-center',
                      duration: 3000,
                      icon: 'ℹ️',
                    });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        duration: 10000,
        position: 'bottom-center',
      }
    );

    setHasShownPrompt(true);
    localStorage.setItem('popupPromptShown', 'true');
  };

  const handleAllowPopup = async () => {
    setIsChecking(true);
    
    try {
      // Try to open a popup - if it works, permissions are already granted
      // If blocked, the browser will show its own permission prompt
      const popup = window.open('', '_blank', 'width=100,height=100');
      
      if (popup === null || typeof popup === 'undefined') {
        // Popup was blocked
        toast.error('Pop-ups are blocked. Please allow them in your browser settings.', {
          position: 'bottom-center',
          duration: 5000,
        });
      } else {
        // Popup was allowed
        popup.close();
        toast.success('Pop-ups enabled successfully!', {
          position: 'bottom-center',
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Error checking popup permissions:', error);
      toast.error('Error checking pop-up settings. Please check your browser permissions.', {
        position: 'bottom-center',
        duration: 4000,
      });
    } finally {
      setIsChecking(false);
    }
  };

  return null;
}