'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';
import EditIdentityModal from '../editModal/page';

export default function BtnSet() {
  const [isOpen, setIsOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="cursor-pointer w-auto">
        <div className="flex gap-2 border border-gray-800 rounded-lg md:text-center items-center sm:rounded-xl py-2 sm:py-2.5 px-4 sm:px-5 hover:bg-gray-50 transition-colors">
          <Settings size={18} className="sm:block" />
          <p className="text-sm sm:text-base">Edit Profile</p>
        </div>
      </button>

      <EditIdentityModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSaved={() => setRefreshKey((k) => k + 1)} />
    </>
  );
}
