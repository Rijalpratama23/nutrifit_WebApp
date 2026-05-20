'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import ConfirmationModal from "./ConfirmationModal"

export default function buttonSecond({ text, background }: { text: string; background: string }) {
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
            <button
                onClick={handleButtonClick}
                className={`${background} cursor-pointer text-white py-2 px-10 rounded-lg active:scale-95 transition-all duration-200`}
            >
                {text}
            </button>

            {/* Modal Konfirmasi dengan Portal */}
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={handleCancel}
                onConfirm={handleConfirmLogin}
            />
        </>
    )
}