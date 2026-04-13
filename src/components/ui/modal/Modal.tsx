import { ReactNode } from "react";
import { CgClose } from "react-icons/cg";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    title?: string;
}

export default function Modal({ isOpen, onClose, children, title}: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="w-full fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white rounded-lg w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">{title}</h2>
                    <button onClick={onClose}><CgClose /></button>
                </div>

                {children}
            </div>
        </div>
    )
}