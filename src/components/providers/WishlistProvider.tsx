"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";

type WishlistContextValue = {
  userId: string | null;
  isWishlisted: (packageId: string) => boolean;
  toggle: (packageId: string) => Promise<void>;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

/**
 * Single source of truth for "is this package wishlisted", shared by every
 * WishlistButton on the page.
 *
 * Previously each WishlistButton instance ran its own onAuthStateChange
 * subscription and its own per-package `wishlists` query. That's fine for
 * one card, but grids render many PackageCards at once (the /packages
 * listing renders every published package, uncapped) — for a signed-in
 * visitor that meant N concurrent auth listeners and N concurrent Supabase
 * queries firing the instant the grid hydrated, all for data ("is package X
 * wishlisted") that a single query already answers for every package at
 * once. This provider subscribes to auth state once and fetches every
 * wishlisted package id for the current user in one query; buttons just
 * read from the resulting set instead of fetching their own.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const supabase = useRef(createBrowserSupabaseClient()).current;
  const [userId, setUserId] = useState<string | null>(null);
  // package_id -> wishlist row id (the row id is needed to delete it again)
  const [rows, setRows] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    let isMounted = true;

    // onAuthStateChange fires immediately with the current session
    // (INITIAL_SESSION), then again on login/logout/token-refresh.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event: AuthChangeEvent, session: Session | null) => {
      if (!isMounted) return;

      const uid = session?.user?.id ?? null;
      setUserId(uid);

      if (!uid) {
        setRows(new Map());
        return;
      }

      const { data, error } = await supabase
        .from("wishlists")
        .select("id,package_id")
        .eq("user_id", uid);

      if (!isMounted) return;

      if (error) {
        console.error("[WishlistProvider] select error:", error.message);
        return;
      }

      setRows(
        new Map(
          ((data ?? []) as { id: string; package_id: string }[]).map((row) => [
            row.package_id,
            row.id,
          ])
        )
      );
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const isWishlisted = useCallback((packageId: string) => rows.has(packageId), [rows]);

  const toggle = useCallback(
    async (packageId: string) => {
      if (!userId) return;

      const existingRowId = rows.get(packageId);

      if (existingRowId) {
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("id", existingRowId)
          .eq("user_id", userId);

        if (error) {
          console.error("[WishlistProvider] delete error:", error.message);
          return;
        }

        setRows((prev) => {
          const next = new Map(prev);
          next.delete(packageId);
          return next;
        });
      } else {
        const { data, error } = await supabase
          .from("wishlists")
          .insert({ user_id: userId, package_id: packageId })
          .select("id")
          .single();

        if (error) {
          console.error("[WishlistProvider] insert error:", error.message, error.hint, error.details);
          return;
        }

        if (data) {
          const rowId = (data as { id: string }).id;
          setRows((prev) => {
            const next = new Map(prev);
            next.set(packageId, rowId);
            return next;
          });
        }
      }
    },
    [rows, supabase, userId]
  );

  return (
    <WishlistContext.Provider value={{ userId, isWishlisted, toggle }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}
