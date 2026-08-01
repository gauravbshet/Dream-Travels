"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { useToast } from "./Toast";

export type FieldConfig = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea";
  full?: boolean;
  required?: boolean;
};

export type ColumnConfig = {
  key: string;
  label: string;
  render?: (row: Record<string, unknown>) => React.ReactNode;
};

type Row = Record<string, unknown> & { id: string };

export function GenericManager({
  table,
  title,
  description,
  fields,
  columns,
  orderColumn = "created_at",
  createLabel,
}: {
  table: string;
  title: string;
  description: string;
  fields: FieldConfig[];
  columns: ColumnConfig[];
  orderColumn?: string;
  createLabel?: string;
}) {
  const supabase = createBrowserSupabaseClient();
  const { showToast } = useToast();

  const emptyForm = Object.fromEntries(fields.map((f) => [f.key, ""])) as Record<string, string>;

  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Record<string, string>>(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadRows() {
    setLoading(true);
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order(orderColumn, { ascending: false });

    if (error) {
      showToast(`Failed to load ${title.toLowerCase()}: ${error.message}`, "error");
    } else {
      setRows((data as Row[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table]);

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(row: Row) {
    setEditingId(row.id);
    setForm(
      Object.fromEntries(
        fields.map((f) => [f.key, row[f.key] != null ? String(row[f.key]) : ""])
      ) as Record<string, string>
    );
    setShowForm(true);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const missingRequired = fields.some((f) => f.required && !form[f.key]?.trim());
    if (missingRequired) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    setSaving(true);

    const payload = Object.fromEntries(
      fields.map((f) => {
        const raw = form[f.key] ?? "";
        if (f.type === "number") {
          return [f.key, raw.trim() ? Number(raw) : null];
        }
        return [f.key, raw.trim() || null];
      })
    );

    const { error } = editingId
      ? await supabase.from(table).update(payload).eq("id", editingId)
      : await supabase.from(table).insert([payload]);

    setSaving(false);

    if (error) {
      showToast(`Failed to save: ${error.message}`, "error");
      return;
    }

    showToast(editingId ? `${title.slice(0, -1)} updated.` : `${title.slice(0, -1)} created.`);
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    loadRows();
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      showToast(`Failed to delete: ${error.message}`, "error");
      return;
    }

    showToast("Item deleted.");
    loadRows();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-ink">{title}</h3>
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-[12px] bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          <Plus className="h-4 w-4" /> {createLabel ?? `New ${title.slice(0, -1).toLowerCase()}`}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-[18px] border border-border bg-white p-6"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-ink">
              {editingId ? "Edit item" : "New item"}
            </h4>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-text-secondary hover:text-ink"
              aria-label="Close form"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <label
                key={field.key}
                className={`space-y-2 text-sm text-ink/80 ${field.full ? "sm:col-span-2" : ""}`}
              >
                <span>{field.label}</span>
                {field.type === "textarea" ? (
                  <textarea
                    value={form[field.key] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    className="input min-h-[100px]"
                  />
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    step={field.type === "number" ? "any" : undefined}
                    value={form[field.key] ?? ""}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, [field.key]: e.target.value }))
                    }
                    className="input"
                  />
                )}
              </label>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-6 rounded-[12px] bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {saving ? "Saving..." : editingId ? "Save changes" : "Create"}
          </button>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-[18px] border border-border bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-text-secondary">
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-4">
                  {col.label}
                </th>
              ))}
              <th className="px-5 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-6 text-text-secondary">
                  Loading...
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-5 py-6 text-text-secondary">
                  Nothing here yet.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-ink/80">
                      {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(row)}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-sage-100 text-ink hover:bg-sage-200"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(row.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-red-50 text-red-600 hover:bg-red-100"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
