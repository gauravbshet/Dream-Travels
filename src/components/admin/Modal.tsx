"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export function Modal({
    title,
    description,
    onClose,
    children,
}: {
    title: string;
    description?: string;
    onClose: () => void;
    children: ReactNode;
}) {
    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    return (
        <div
            className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/40 px-4 py-6 sm:items-center"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[min(100%,theme(width.3xl))] max-h-[calc(100vh-3rem)] overflow-hidden rounded-[24px] bg-white shadow-2xl"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex flex-col gap-3 border-b border-border px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-ink">{title}</h2>
                        {description ? (
                            <p className="mt-1 text-sm text-text-secondary">{description}</p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-text-secondary transition hover:bg-sage-100 hover:text-ink"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto px-6 py-6">{children}</div>
            </div>
        </div>
    );
}
