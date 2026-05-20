'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: ConfirmationModalProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-30 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-lg shadow-lg p-6 w-90 max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">Konfirmasi Login</h2>
        <p className="text-gray-600 mb-6 text-center">
          Anda perlu login untuk mengakses fitur ini. Apakah Anda ingin melanjutkan ke halaman login?
        </p>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition-all duration-200"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer flex-1 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all duration-200"
          >
            Lanjut Login
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
