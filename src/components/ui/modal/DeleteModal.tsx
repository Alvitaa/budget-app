import Button from "@/components/inputs/Button";
import Modal from "./Modal";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: () => void;
}

export default function DeleteModal({ isOpen, onClose, onDelete }: DeleteModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="¿Estás seguro?"
        >
            <p>Esta acción es irreversible.</p>
            <div className="flex place-content-around gap-5 mt-5">
                <Button onClick={onDelete} className="w-full danger font-medium">
                    Sí, borrar
                </Button>
                <Button onClick={onClose} className="w-full secondary">
                    No, cancelar
                </Button>
            </div>
        </Modal>
    );
}