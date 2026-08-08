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
            className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/40 px-4 py-4"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-[min(100%,theme(width.3xl))] max-h-[calc(100vh-2rem)] overflow-hidden rounded-[20px] bg-admin-surface shadow-admin-pop"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="flex items-center justify-between border-b border-admin-border px-5 py-3.5">
                    <div>
                        <h2 className="text-base font-bold text-admin-ink">{title}</h2>
                        {description ? (
                            <p className="mt-0.5 text-xs text-admin-ink-muted">{description}</p>
                        ) : null}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-1.5 text-admin-ink-muted transition hover:bg-admin-surface-2 hover:text-admin-ink"
                        aria-label="Close modal"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <div className="max-h-[calc(100vh-7rem)] overflow-y-auto px-5 py-4">{children}</div>
            </div>
        </div>
    );
}
