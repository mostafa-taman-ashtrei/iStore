"use client";

import { AlertCircle, Loader } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import Modal from "../general/Modal";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, onClose, onConfirm, loading }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Modal
            title="Are you sure?"
            description="Think carefully ... this action can NOT be undone."
            isOpen={isOpen}
            onClose={onClose}
            Icon={AlertCircle}
            IconColor="text-red-600"
        >
            <div className="pt-6 space-x-2 flex items-center justify-center w-full">
                <Button disabled={loading} variant="destructive" onClick={onConfirm} className="w-full">
                    {
                        loading
                            ? <div className="flex flex-row gap-1 items-center justify-center">
                                <Loader className="animate-spin" />
                                <p className="animate-pulse">Deleting</p>
                            </div>

                            : <div className="flex flex-row gap-1 items-center justify-center">
                                <p>Delete</p>
                            </div>
                    }
                </Button>

                <Button disabled={loading} variant="outline" onClick={onClose} className="w-full">
                    Cancel
                </Button>
            </div>
        </Modal>
    );
};

export default AlertModal;