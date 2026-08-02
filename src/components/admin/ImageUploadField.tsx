"use client";

import { useEffect, useRef, useState } from "react";
import { CloudUpload, ImagePlus, Trash2 } from "lucide-react";

export function ImageUploadField({
    label,
    imageUrl,
    onImageFileChange,
    onImageUrlChange,
}: {
    label: string;
    imageUrl: string;
    onImageFileChange: (file: File | null) => void;
    onImageUrlChange: (url: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [dragging, setDragging] = useState(false);
    const [preview, setPreview] = useState(imageUrl);

    useEffect(() => {
        setPreview(imageUrl);
    }, [imageUrl]);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function handleSelectFile() {
        inputRef.current?.click();
    }

    function handleFileSelected(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0] ?? null;
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onImageFileChange(file);
            onImageUrlChange("");
        }
    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);
            onImageFileChange(file);
            onImageUrlChange("");
        }
    }

    function handleRemoveImage() {
        if (preview && preview.startsWith("blob:")) {
            URL.revokeObjectURL(preview);
        }
        setPreview("");
        onImageFileChange(null);
        onImageUrlChange("");
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
                <label className="text-sm font-semibold text-ink">{label}</label>
                {preview ? (
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                    >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                ) : null}
            </div>

            <div
                className={`group relative cursor-pointer rounded-[18px] border border-dashed bg-sage-50 px-5 py-10 text-center transition ${dragging ? "border-primary/80 bg-primary/5" : "border-border"
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
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileSelected}
                />
                {preview ? (
                    <div className="mx-auto flex max-w-[320px] flex-col items-center gap-4">
                        <img
                            src={preview}
                            alt="Selected image preview"
                            className="h-48 w-full max-w-[320px] rounded-[18px] object-cover"
                        />
                        <p className="text-sm text-text-secondary">Click to replace image or drag a new one here.</p>
                    </div>
                ) : (
                    <div className="mx-auto flex max-w-[320px] flex-col items-center gap-3 text-text-secondary">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                            <CloudUpload className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-ink">Drag & drop an image</p>
                            <p className="text-sm text-text-secondary">or click to select from your device</p>
                        </div>
                        <button
                            type="button"
                            onClick={handleSelectFile}
                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-sage-100"
                        >
                            <ImagePlus className="h-4 w-4" /> Select Image
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
