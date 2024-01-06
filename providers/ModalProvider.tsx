"use client";

import React, { useEffect, useState } from "react";

import StoreSetupModal from "@/components/dashboard/StoreSetupModal";

const ModalProvider: React.FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    if (!isMounted) return null;

    return (
        <>
            <StoreSetupModal />
        </>
    );
};

export default ModalProvider;