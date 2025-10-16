// components/ClientComponents.tsx
'use client';

import { useEffect } from 'react';
import ToastInstallPrompt from "./InstallPrompt";
import PopupPermissionPrompt from "./PopupPermissionPrompt";


export default function ClientComponents() {
  return (
    <>
      <ToastInstallPrompt />
      <PopupPermissionPrompt />
      {/* Add other client-side components here if needed */}
    </>
  );
}