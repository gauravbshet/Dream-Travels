"use client";

import { useEffect, useRef, useState } from "react";
import { CloudUpload, Film, Trash2 } from "lucide-react";

const MAX_VIDEO_BYTES = 100 * 1024 * 1024; // 100MB — keep uploads reasonable

export function VideoUploadField({
    label,
    videoUrl,
    onVideoFileChange,
    onVideoUrlChange,
    onValidationError,
}: {
    label: string;
    videoUrl: string;
    onVideoFileChange: (file: File | null) => void;
    onVideoUrlChange: (url: string) => void;
    onValidationError?: (message: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState(videoUrl);

    useEffect(() => {
        setPreview(videoUrl);
    }, [videoUrl]);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function acceptFile(file: File) {
        if (!file.type.startsWith("video/")) {
            onValidationError?.("Please select a video file.");
            return;
        }
        if (file.size > MAX_VIDEO_BYTES) {
            onValidationError?.("Video is too large — please keep it under 100MB.");
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onVideoFileChange(file);
        onVideoUrlChange("");
    }

    function handleSelectFile() {
        inputRef.current?.click();
    }

    function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;
        if (file) acceptFile(file);
    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) acceptFile(file);
    }

    function handleRemoveVideo() {
        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }
        setPreview("");
        onVideoFileChange(null);
        onVideoUrlChange("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-semibold text-admin-ink">{label}</label>
                {preview ? (
                    <button
                        type="button"
                        onClick={handleRemoveVideo}
                        className="inline-flex items-center gap-2 rounded-full border border-admin-border bg-admin-surface px-3 py-1 text-xs font-semibold text-admin-danger transition hover:bg-admin-danger-soft"
                    >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                ) : null}
            </div>

            <div
                className={`group relative cursor-pointer rounded-[18px] border border-dashed bg-admin-surface-2 px-5 py-10 text-center transition ${dragging ? "border-admin-primary/80 bg-admin-primary-soft" : "border-admin-border"
                    }`}
                onClick={handleSelectFile}
                onDragEnter={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragOver={(event) => {
                    event.preventDefault();
                    setDragging(true);
                }}
                onDragLeave={(event) => {
                    event.preventDefault();
                    setDragging(false);
                }}
                onDrop={handleDrop}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={handleFileSelected}
                />
                {preview ? (
                    <div
                        className="mx-auto flex max-w-[220px] flex-col items-center gap-4"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <video
                            src={preview}
                            controls
                            muted
                            className="aspect-[9/16] w-full max-w-[220px] rounded-[18px] bg-black object-cover"
                        />
                        <p className="text-sm text-admin-ink-muted">Click the drop zone to replace this video.</p>
                    </div>
                ) : (
                    <div className="mx-auto flex max-w-[320px] flex-col items-center gap-3 text-admin-ink-muted">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-admin-surface text-admin-primary shadow-sm">
                            <CloudUpload className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-admin-ink">Drag & drop a video</p>
                            <p className="text-sm text-admin-ink-muted">MP4 recommended, up to 100MB</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSelectFile}
                            className="inline-flex items-center gap-2 rounded-full bg-admin-surface px-4 py-2 text-sm font-semibold text-admin-primary shadow-sm transition hover:bg-admin-primary-soft"
                        >
                            <Film className="h-4 w-4" /> Select Video
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
