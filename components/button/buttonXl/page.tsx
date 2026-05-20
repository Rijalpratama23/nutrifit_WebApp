'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '../secondaryButton/ConfirmationModal';

export default function ButtonXl({ title }: { title: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmLogin = () => {
    setIsModalOpen(false);
    router.push('/login');
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={handleButtonClick} className="bg-primary text-white font-semibold py-2 px-4 md:py-4 md:px-6 rounded-xl text-sm md:text-base active:scale-95 transition-all duration-200 cursor-pointer">
        {title}
      </button>

      {/* Modal Konfirmasi dengan Portal */}
      <ConfirmationModal isOpen={isModalOpen} onClose={handleCancel} onConfirm={handleConfirmLogin} />
    </>
  );
}
