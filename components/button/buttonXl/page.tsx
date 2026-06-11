'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ConfirmationModal from '../secondaryButton/ConfirmationModal';

interface ButtonXlProps {
  title: string;
  destinations?: string;
  onClick?: () => void;
  showModal?: boolean;
}

export default function ButtonXl({ title, destinations = '/login', onClick, showModal = true }: ButtonXlProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleButtonClick = () => {
    if (onClick) {
      onClick();
    } else if (showModal) {
      setIsModalOpen(true);
    } else {
      router.push(destinations);
    }
  };

  const handleConfirmLogin = () => {
    setIsModalOpen(false);
    router.push(destinations); // ✅ tidak ada lagi hardcode /login
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button onClick={handleButtonClick} className="bg-primary text-white font-semibold py-2 px-4 md:py-4 md:px-6 rounded-xl text-sm md:text-base active:scale-95 transition-all duration-200 cursor-pointer">
        {title}
      </button>

      {showModal && <ConfirmationModal isOpen={isModalOpen} onClose={handleCancel} onConfirm={handleConfirmLogin} />}
    </>
  );
}
  