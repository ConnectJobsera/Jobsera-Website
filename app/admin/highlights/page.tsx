"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Highlight = {
  id: string;
  text: string;
  link: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

const emptyForm = {
  text: "",
  link: "",
  is_active: true,
};

export default function AdminHighlightsPage() {
  const supabase = createClient();

  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadHighlights() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("highlights")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setHighlights(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadHighlights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(highlight: Highlight) {
    setEditingId(highlight.id);
    setForm({
      text: highlight.text ?? "",
      link: highlight.link ?? "",
      is_active: highlight.is_active,
    });
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...form,
      updated_at: new Date().toISOString(),
    };

    if (editingId) {
      const { error } = await supabase
        .from("highlights")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("highlights").insert(payload);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    cancelForm();
    loadHighlights();
  }

  async function toggleActive(highlight: Highlight) {
    setError("");

    const { error } = await supabase
      .from("highlights")
      .update({
        is_active: !highlight.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", highlight.id);

    if (error) {
      setError(error.message);
      return;
    }

    loadHighlights();
  }

  async function deleteHighlight(highlight: Highlight) {
    const confirmed = window.confirm(
      `Delete this highlight? This cannot be undone.\n\n"${highlight.text}"`
    );

    if (!confirmed) return;

    setError("");

    const { error } = await supabase
      .from("highlights")
      .delete()
      .eq("id", highlight.id);

    if (error) {
      setError(error.message);
      return;
    }

    loadHighlights();
  }

  return (
    <main className="content-page">
      <div className="container">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "16px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <p className="eyebrow">HIGHLIGHTS</p>
            <h1>Manage Highlights</h1>
            <p className="page-intro">
              Control the homepage highlight messages.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Link href="/admin" className="button button-secondary">
              Back to Dashboard
            </Link>
            {!showForm && (
              <button
                type="button"
                className="button button-primary"
                onClick={startAdd}
              >
                + Add Highlight
              </button>
            )}
          </div>
        </div>

        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginBottom: "20px",
            maxWidth: "620px",
          }}
        >
          Note: the homepage currently reads its highlight from hard-coded
          text, not from this table yet. Ask your developer to confirm the
          homepage is wired to display the active highlight from here before
          relying on this screen to control what visitors see.
        </p>

        {error && (
          <p
            role="alert"
            style={{
              padding: "10px 12px",
              borderRadius: "8px",
              background: "#fff1f2",
              color: "#dc2626",
              fontSize: "13px",
              marginBottom: "20px",
            }}
          >
            {error}
          </p>
        )}

        {showForm && (
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gap: "14px",
              padding: "24px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              background: "#ffffff",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "32px",
            }}
          >
            <h2 style={{ fontSize: "18px", marginBottom: "4px" }}>
              {editingId ? "Edit Highlight" : "Add Highlight"}
            </h2>

            <div className="form-group">
              <label className="form-label">Highlight Text</label>
              <textarea
                className="form-textarea"
                rows={2}
                required
                value={form.text}
                onChange={(e) => setForm({ ...form, text: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Destination Link</label>
              <input
                className="form-input"
                required
                placeholder="/jobs"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) =>
                  setForm({ ...form, is_active: e.target.checked })
                }
              />
              Active
            </label>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                className="button button-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Create Highlight"}
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={cancelForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p>Loading highlights...</p>
        ) : highlights.length === 0 ? (
          <p>No highlights yet. Add your first one above.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {highlights.map((highlight) => (
              <div
                key={highlight.id}
                style={{
                  padding: "18px 20px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  background: "#ffffff",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      letterSpacing: "0.04em",
                      color: highlight.is_active ? "#16a34a" : "#94a3b8",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {highlight.is_active ? "Active" : "Inactive"}
                  </p>
                  <p style={{ fontWeight: 700 }}>{highlight.text}</p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    → {highlight.link}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => toggleActive(highlight)}
                  >
                    {highlight.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => startEdit(highlight)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    style={{ color: "#dc2626" }}
                    onClick={() => deleteHighlight(highlight)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
