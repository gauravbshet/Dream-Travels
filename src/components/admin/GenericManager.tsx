"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase.client";
import { useToast } from "./Toast";
import { AdminButton, AdminCard, AdminField, AdminIconButton, AdminPageHeader, AdminTableState } from "./ui";

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
      <AdminPageHeader
        title={title}
        description={description}
        action={
          <AdminButton onClick={openCreateForm}>
            <Plus className="h-4 w-4" /> {createLabel ?? `New ${title.slice(0, -1).toLowerCase()}`}
          </AdminButton>
        }
      />

      {showForm && (
        <AdminCard className="mt-6" padded={false}>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-admin-ink">
                {editingId ? "Edit item" : "New item"}
              </h4>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-admin-ink-muted hover:text-admin-ink"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {fields.map((field) => (
                <AdminField key={field.key} label={field.label} full={field.full}>
                  {field.type === "textarea" ? (
                    <textarea
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      className="admin-input min-h-[100px]"
                    />
                  ) : (
                    <input
                      type={field.type === "number" ? "number" : "text"}
                      step={field.type === "number" ? "any" : undefined}
                      value={form[field.key] ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [field.key]: e.target.value }))
                      }
                      className="admin-input"
                    />
                  )}
                </AdminField>
              ))}
            </div>

            <AdminButton type="submit" disabled={saving} className="mt-6">
              {saving ? "Saving..." : editingId ? "Save changes" : "Create"}
            </AdminButton>
          </form>
        </AdminCard>
      )}

      <AdminCard className="mt-6 overflow-x-auto" padded={false}>
        <table className="w-full min-w-[min(100%,560px)] text-left text-sm">
          <thead>
            <tr className="border-b border-admin-border text-xs font-semibold uppercase tracking-wide text-admin-ink-muted">
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
              <AdminTableState colSpan={columns.length + 1}>Loading...</AdminTableState>
            ) : rows.length === 0 ? (
              <AdminTableState colSpan={columns.length + 1}>Nothing here yet.</AdminTableState>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-b border-admin-border last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4 text-admin-ink-2">
                      {col.render ? col.render(row) : String(row[col.key] ?? "—")}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <AdminIconButton onClick={() => openEditForm(row)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </AdminIconButton>
                      <AdminIconButton
                        variant="danger"
                        onClick={() => handleDelete(row.id)}
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </AdminIconButton>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </AdminCard>
    </div>
  );
}
