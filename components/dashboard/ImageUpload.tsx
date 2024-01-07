"use client";

import { ImagePlus, Trash } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
    disabled?: boolean;
    // eslint-disable-next-line no-unused-vars
    onChange: (value: string) => void;
    // eslint-disable-next-line no-unused-vars
    onRemove: (value: string) => void;
    value: string[];
    multipleUpload: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ disabled, onChange, onRemove, value, multipleUpload }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onUpload = (result: any) => onChange(result.info.secure_url);

    if (!isMounted) return null;


    return (
        <div>
            <div className="mb-4 flex items-center gap-4">
                {value.map((url) => (
                    <div key={url} className="relative w-[200px] h-[200px] rounded-md overflow-hidden">
                        <div className="z-10 absolute top-2 right-2">
                            <Button type="button" onClick={() => onRemove(url)} variant="destructive" size="sm" className="rounded-full">
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>

                        <Image
                            fill
                            className="object-cover"
                            alt="Image"
                            src={url}
                        />
                    </div>
                ))}
            </div>

            <CldUploadWidget
                onUpload={onUpload}
                uploadPreset="nein4kdt"
                options={{ multiple: multipleUpload, maxFiles: multipleUpload ? 3 : 1 }}
            >
                {({ open }) => {
                    const onClick = () => open();

                    return (
                        <Button
                            type="button"
                            disabled={disabled}
                            variant="outline"
                            className="w-full"
                            onClick={onClick}
                        >
                            <ImagePlus className="h-4 w-4 mr-2" />
                            Upload Billboard Image
                        </Button>
                    );
                }}
            </CldUploadWidget>
        </div>
    );
};

export default ImageUpload;