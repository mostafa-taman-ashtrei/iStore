"use client";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { LucideIcon } from "lucide-react";

interface ModalProps {
    title: string;
    description: string;
    isOpen: boolean;
    onClose: () => void;
    children?: React.ReactNode;
    Icon: LucideIcon;
}

const Modal: React.FC<ModalProps> = ({
    title,
    description,
    isOpen,
    onClose,
    Icon,
    children
}) => {
    const onChange = (open: boolean) => {
        if (!open) onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="flex flex-row items-center justify-start gap-1">
                        {Icon && <Icon className="text-sky-600" />}
                        {title}
                    </DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Modal;