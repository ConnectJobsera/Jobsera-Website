"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";
import PostLinksEditor from "../../../components/PostLinksEditor";

type Blog = {
  id: string;
  slug: string;
  category: string;
  title_en: string;
  description_en: string;
  content_en: string;
  body_1_en: string | null;
  body_2_en: string | null;
  body_3_en: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

const BLOG_LINK_POSITIONS = [
  { key: "middle_1", label: "After Body Part 1" },
  { key: "middle_2", label: "After Body Part 2" },
  { key: "bottom", label: "Bottom (after Body Part 3)" },
];

const emptyForm = {
  slug: "",
  category: "",
  title_en: "",
  description_en: "",
  body_1_en: "",
  body_2_en: "",
  body_3_en: "",
  is_published: false,
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AdminBlogsPage() {
  const supabase = createClient();

  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);
  const [linksEditingId, setLinksEditingId] = useState<string | null>(null);

  async function loadBlogs() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("blogs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setError(error.message);
    } else {
      setBlogs(data ?? []);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setSlugTouched(false);
    setShowForm(true);
  }

  function startEdit(blog: Blog) {
    setEditingId(blog.id);
    setForm({
      slug: blog.slug ?? "",
      category: blog.category ?? "",
      title_en: blog.title_en ?? "",
      description_en: blog.description_en ?? "",
      body_1_en: blog.body_1_en ?? "",
      body_2_en: blog.body_2_en ?? "",
      body_3_en: blog.body_3_en ?? "",
      is_published: blog.is_published,
    });
    setSlugTouched(true);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  function handleTitleChange(value: string) {
    setForm((prev) => ({
      ...prev,
      title_en: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
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
        .from("blogs")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase.from("blogs").insert(payload);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    cancelForm();
    loadBlogs();
  }

  async function togglePublished(blog: Blog) {
    setError("");

    const { error } = await supabase
      .from("blogs")
      .update({
        is_published: !blog.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", blog.id);

    if (error) {
      setError(error.message);
      return;
    }

    loadBlogs();
  }

  async function deleteBlog(blog: Blog) {
    const confirmed = window.confirm(
      `Delete "${blog.title_en}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    const { error } = await supabase.from("blogs").delete().eq("id", blog.id);

    if (error) {
      setError(error.message);
      return;
    }

    loadBlogs();
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
            <p className="eyebrow">BLOGS</p>
            <h1>Manage Blogs</h1>
            <p className="page-intro">Add, edit and manage career articles.</p>
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
                + Add Article
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
              {editingId ? "Edit Article" : "Add Article"}
            </h2>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                required
                value={form.title_en}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "14px",
              }}
            >
              <div className="form-group">
                <label className="form-label">Slug (URL path)</label>
                <input
                  className="form-input"
                  required
                  value={form.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setForm({ ...form, slug: slugify(e.target.value) });
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <input
                  className="form-input"
                  required
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Short Description</label>
              <textarea
                className="form-textarea"
                rows={3}
                required
                value={form.description_en}
                onChange={(e) =>
                  setForm({ ...form, description_en: e.target.value })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Body — Part 1</label>
              <textarea
                className="form-textarea"
                rows={6}
                required
                value={form.body_1_en}
                onChange={(e) =>
                  setForm({ ...form, body_1_en: e.target.value })
                }
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                }}
              >
                A link box will appear on the page right after this part.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Body — Part 2</label>
              <textarea
                className="form-textarea"
                rows={6}
                required
                value={form.body_2_en}
                onChange={(e) =>
                  setForm({ ...form, body_2_en: e.target.value })
                }
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                }}
              >
                A link box will appear on the page right after this part.
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">Body — Part 3</label>
              <textarea
                className="form-textarea"
                rows={6}
                required
                value={form.body_3_en}
                onChange={(e) =>
                  setForm({ ...form, body_3_en: e.target.value })
                }
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  marginTop: "4px",
                }}
              >
                A final link box will appear at the bottom of the page, after
                this part.
              </p>
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
                checked={form.is_published}
                onChange={(e) =>
                  setForm({ ...form, is_published: e.target.checked })
                }
              />
              Published (visible on public blogs page)
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
                  : "Create Article"}
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
          <p>Loading articles...</p>
        ) : blogs.length === 0 ? (
          <p>No articles yet. Add your first one above.</p>
        ) : (
          <div style={{ display: "grid", gap: "12px" }}>
            {blogs.map((blog) => (
              <div
                key={blog.id}
                style={{
                  padding: "18px 20px",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  background: "#ffffff",
                  display: "grid",
                  gap: "14px",
                }}
              >
                <div
                  style={{
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
                        color: blog.is_published ? "#16a34a" : "#94a3b8",
                        textTransform: "uppercase",
                        marginBottom: "4px",
                      }}
                    >
                      {blog.is_published ? "Published" : "Draft"} ·{" "}
                      {blog.category}
                    </p>
                    <p style={{ fontWeight: 700 }}>{blog.title_en}</p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                      }}
                    >
                      /blogs/{blog.slug}
                    </p>
                  </div>

                  <div
                    style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}
                  >
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => togglePublished(blog)}
                    >
                      {blog.is_published ? "Unpublish" : "Publish"}
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() => startEdit(blog)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      onClick={() =>
                        setLinksEditingId(
                          linksEditingId === blog.id ? null : blog.id
                        )
                      }
                    >
                      {linksEditingId === blog.id
                        ? "Hide Links"
                        : "Manage Links"}
                    </button>
                    <button
                      type="button"
                      className="button button-secondary"
                      style={{ color: "#dc2626" }}
                      onClick={() => deleteBlog(blog)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {linksEditingId === blog.id && (
                  <PostLinksEditor
                    table="blog_links"
                    matchColumn="blog_id"
                    matchValue={blog.id}
                    positions={BLOG_LINK_POSITIONS}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

