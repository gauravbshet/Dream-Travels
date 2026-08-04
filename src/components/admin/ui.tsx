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
        "rounded-[18px] border border-admin-border bg-admin-surface shadow-admin-card",
        padded && "p-6",
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
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-xl font-semibold text-admin-ink tracking-[-0.01em]">{title}</h3>
        {description ? <p className="mt-1 text-sm text-admin-ink-muted">{description}</p> : null}
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
        "inline-flex items-center justify-center gap-2 rounded-[12px] px-5 py-3 text-sm font-semibold transition disabled:opacity-60",
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
        "flex h-9 w-9 items-center justify-center rounded-[10px] transition",
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
        "rounded-full bg-admin-primary-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-admin-primary",
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
    <label className={cn("space-y-2 text-sm text-admin-ink-2", full && "sm:col-span-2")}>
      <span className="font-medium text-admin-ink">{label}</span>
      {children}
    </label>
  );
}

export function AdminTableState({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-6 text-admin-ink-muted">
        {children}
      </td>
    </tr>
  );
}
