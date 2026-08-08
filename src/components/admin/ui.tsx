"use client";

import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function AdminCard({
  className,
  children,
  padded = true,
}: {
  className?: string;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[16px] border border-admin-border bg-admin-surface shadow-admin-card",
        padded && "p-4 sm:p-5",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4 shrink-0">
      <div>
        <h3 className="text-lg font-bold text-admin-ink tracking-[-0.01em]">{title}</h3>
        {description ? <p className="text-xs text-admin-ink-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

const buttonVariants = {
  primary: "bg-admin-primary text-white hover:bg-admin-primary-dark",
  secondary: "border border-admin-border bg-admin-surface text-admin-ink hover:bg-admin-surface-2",
  ghost: "text-admin-ink-muted hover:bg-admin-surface-2 hover:text-admin-ink",
} as const;

export function AdminButton({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof buttonVariants }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-[10px] px-3.5 py-2 text-xs sm:text-sm font-semibold transition disabled:opacity-60",
        buttonVariants[variant],
        className
      )}
      {...props}
    />
  );
}

const iconButtonVariants = {
  neutral: "bg-admin-surface-2 text-admin-ink hover:bg-admin-primary-soft hover:text-admin-primary",
  danger: "bg-admin-danger-soft text-admin-danger hover:bg-admin-danger/15",
} as const;

export function AdminIconButton({
  variant = "neutral",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: keyof typeof iconButtonVariants }) {
  return (
    <button
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-[8px] transition",
        iconButtonVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export function AdminBadge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "rounded-full bg-admin-primary-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-admin-primary",
        className
      )}
    >
      {children}
    </span>
  );
}

export function AdminField({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={cn("space-y-1 text-xs sm:text-sm text-admin-ink-2", full && "sm:col-span-2")}>
      <span className="font-semibold text-admin-ink text-xs">{label}</span>
      {children}
    </label>
  );
}

export function AdminTableState({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-4 text-center text-xs sm:text-sm text-admin-ink-muted">
        {children}
      </td>
    </tr>
  );
}

