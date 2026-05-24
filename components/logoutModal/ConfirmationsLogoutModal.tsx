import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// interfaces
interface ConfirmationLogoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
}

// function
export default function ConfirmationLogoutModal({
    isOpen,
    onClose,
    onConfirm,
    title= "Konfirmasi Keluar",
    message="Anda yakin ingin keluar?",
    confirmText="Keluar",
    cancelText="Batal",
}: ConfirmationLogoutModalProps) {
    const [ isMounted, setIsMounted ] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted || !isOpen) return null;

    return(
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm mx-4 animate-in fade-in zoom-in-95 duration-200 ">
                <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">{title}</h2>
                <p className="text-gray-600 mb-6 text-center">{message}</p>

                <div className="flex gap-4">
                    <button onClick={onClose} className="flex-1 cursor-pointer  bg-gray-300  text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition-all duration-200">
                        {cancelText}
                    </button>

                    <button onClick={onConfirm} className="flex-1 cursor-pointer bg-red-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600 transition-all duration-200">
                        {confirmText}
                    </button>

                </div>

            </div>

        </div>
    )
}