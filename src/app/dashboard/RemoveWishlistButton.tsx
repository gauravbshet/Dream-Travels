"use client";

import { useTransition } from "react";
import { removeFromWishlist } from "./actions";

export function RemoveWishlistButton({ wishlistId }: { wishlistId: string }) {
    const [isPending, startTransition] = useTransition();

    return (
        <button
            type="button"
            disabled={isPending}
            onClick={() =>
                startTransition(async () => {
                    await removeFromWishlist(wishlistId);
                })
            }
            className="rounded-[10px] border border-border bg-surface px-4 py-2 text-sm text-ink transition hover:bg-surface-2 disabled:opacity-50"
        >
            {isPending ? "Removing…" : "Remove"}
        </button>
    );
}
