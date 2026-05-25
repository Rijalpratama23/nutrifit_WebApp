'use client';

import { Settings } from 'lucide-react';
import { useState } from 'react';
import EditIdentityModal from '../editModal/page';

interface BtnSetProps {
  onSaved: () => void; // ← terima callback dari parent
}

export default function BtnSet({ onSaved }: BtnSetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="cursor-pointer w-auto">
        <div className="flex gap-2 border border-gray-800 rounded-lg md:text-center items-center sm:rounded-xl py-2 sm:py-2.5 px-4 sm:px-5 hover:bg-gray-50 transition-colors">
          <Settings size={18} />
          <p className="text-sm sm:text-base">Edit Profile</p>
        </div>
      </button>

      <EditIdentityModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSaved={() => {
          onSaved(); // refresh data di parent
          setIsOpen(false);
        }}
      />
    </>
  );
}
