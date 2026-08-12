"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Job = {
  id: string;
  company: string;
  title: string;
  location: string;
  type: string;
  experience: string;
  qualification: string;
  description: string;
  apply_url: string;
  is_active: boolean;
  created_at: string;
};

const emptyForm = {
  company: "",
  title: "",
  location: "",
  type: "",
  experience: "",
  qualification: "",
  description: "",
  apply_url: "",
  is_active: true,
};

export default function AdminJobsPage() {
  const supabase = createClient();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function loadJobs() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setJobs(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function startEdit(job: Job) {
    setEditingId(job.id);
    setForm({
      company: job.company ?? "",
      title: job.title ?? "",
      location: job.location ?? "",
      type: job.type ?? "",
      experience: job.experience ?? "",
      qualification: job.qualification ?? "",
      description: job.description ?? "",
      apply_url: job.apply_url ?? "",
      is_active: job.is_active,
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

    if (editingId) {
      const { error } = await supabase
        .from("jobs")
        .update(form)
        .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("jobs").insert(form);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    cancelForm();
    loadJobs();
  }

  async function toggleActive(job: Job) {
    setError("");

    const { error } = await supabase
      .from("jobs")
      .update({ is_active: !job.is_active })
      .eq("id", job.id);

    if (error) {
      setError(error.message);
      return;
    }

    loadJobs();
  }

  async function deleteJob(job: Job) {
    const confirmed = window.confirm(
      `Delete "${job.title}" at ${job.company}? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    const { error } = await supabase.from("jobs").delete().eq("id", job.id);

    if (error) {
      setError(error.message);
      return;
    }

    loadJobs();
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
            <p className="eyebrow">JOBS</p>
            <h1>Manage Jobs</h1>
            <p className="page-intro">
              Add, edit and remove job opportunities.
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
                + Add Job
              </button>
            )}
          </div>
        </div>

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
              {editingId ? "Edit Job" : "Add Job"}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div className="form-group">
                <label className="form-label">Company</label>
                <input
                  className="form-input"
                  required
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  className="form-input"
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  className="form-input"
                  required
                  value={form.location}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Type</label>
                <input
                  className="form-input"
                  placeholder="Full-time / Internship / etc."
                  required
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Experience</label>
                <input
                  className="form-input"
                  required
                  value={form.experience}
                  onChange={(e) =>
                    setForm({ ...form, experience: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label className="form-label">Qualification</label>
                <input
                  className="form-input"
                  required
                  value={form.qualification}
                  onChange={(e) =>
                    setForm({ ...form, qualification: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                rows={5}
                required
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Apply URL</label>
              <input
                className="form-input"
                type="url"
                required
                value={form.apply_url}
                onChange={(e) =>
                  setForm({ ...form, apply_url: e.target.value })
                }
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
              Active (visible on public jobs page)
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
                  : "Create Job"}
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
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs yet. Add your first one above.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {jobs.map((job) => (
              <div
                key={job.id}
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
                      color: job.is_active ? "#16a34a" : "#94a3b8",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {job.is_active ? "Active" : "Inactive"} · {job.company}
                  </p>
                  <p style={{ fontWeight: 700 }}>{job.title}</p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                    {job.location} · {job.type} · {job.experience}
                  </p>
                </div>

                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => toggleActive(job)}
                  >
                    {job.is_active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() => startEdit(job)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="button button-secondary"
                    style={{ color: "#dc2626" }}
                    onClick={() => deleteJob(job)}
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
