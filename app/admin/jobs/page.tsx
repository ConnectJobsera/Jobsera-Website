"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

type Job = {
  id: string;

  // Primary fields
  title: string;
  organization: string;
  department: string;
  post_name: string;
  total_vacancy: number | null;
  state: string;
  location: string;
  qualification: string;
  age_starts: number | null;
  age_limit: string;
  age_relaxation: string;
  application_mode: string;
  application_fee: string;
  start_date: string | null;
  last_date: string | null;
  exam_date: string | null;
  salary: string;
  selection_process: string;
  documents_required: string;
  notification_url: string;
  apply_url: string;

  // Legacy / internal fields
  company: string;
  type: string;
  experience: string;
  description: string;

  is_active: boolean;
  created_at: string;
};

type JobForm = {
  title: string;
  organization: string;
  department: string;
  post_name: string;
  total_vacancy: string;
  state: string;
  location: string;
  qualification: string;
  age_starts: string;
  age_limit: string;
  age_relaxation: string;
  application_mode: string;
  application_fee: string;
  start_date: string;
  last_date: string;
  exam_date: string;
  salary: string;
  selection_process: string;
  documents_required: string;
  notification_url: string;
  apply_url: string;

  // Legacy / internal
  company: string;
  type: string;
  experience: string;
  description: string;

  is_active: boolean;
};

const emptyForm: JobForm = {
  title: "",
  organization: "",
  department: "",
  post_name: "",
  total_vacancy: "",
  state: "",
  location: "",
  qualification: "",
  age_starts: "",
  age_limit: "",
  age_relaxation: "",
  application_mode: "",
  application_fee: "",
  start_date: "",
  last_date: "",
  exam_date: "",
  salary: "",
  selection_process: "",
  documents_required: "",
  notification_url: "",
  apply_url: "",

  company: "",
  type: "",
  experience: "",
  description: "",

  is_active: true,
};

export default function AdminJobsPage() {
  const supabase = createClient();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [showLegacyFields, setShowLegacyFields] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<JobForm>(emptyForm);
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
    setForm({ ...emptyForm });
    setShowLegacyFields(false);
    setShowForm(true);
  }

  function startEdit(job: Job) {
    setEditingId(job.id);

    setForm({
      title: job.title ?? "",
      organization: job.organization ?? "",
      department: job.department ?? "",
      post_name: job.post_name ?? "",
      total_vacancy:
        job.total_vacancy !== null && job.total_vacancy !== undefined
          ? String(job.total_vacancy)
          : "",
      state: job.state ?? "",
      location: job.location ?? "",
      qualification: job.qualification ?? "",
      age_starts:
        job.age_starts !== null && job.age_starts !== undefined
          ? String(job.age_starts)
          : "",
      age_limit: job.age_limit ?? "",
      age_relaxation: job.age_relaxation ?? "",
      application_mode: job.application_mode ?? "",
      application_fee: job.application_fee ?? "",
      start_date: job.start_date ?? "",
      last_date: job.last_date ?? "",
      exam_date: job.exam_date ?? "",
      salary: job.salary ?? "",
      selection_process: job.selection_process ?? "",
      documents_required: job.documents_required ?? "",
      notification_url: job.notification_url ?? "",
      apply_url: job.apply_url ?? "",

      company: job.company ?? "",
      type: job.type ?? "",
      experience: job.experience ?? "",
      description: job.description ?? "",

      is_active: job.is_active,
    });

    setShowLegacyFields(
      Boolean(
        job.company ||
          job.type ||
          job.experience ||
          job.description
      )
    );

    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setShowLegacyFields(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  }

  function updateField<K extends keyof JobForm>(
    field: K,
    value: JobForm[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");

    if (!form.title.trim()) {
      setError("Vacancy Name is required.");
      setSaving(false);
      return;
    }

    if (!form.organization.trim()) {
      setError("Organization is required.");
      setSaving(false);
      return;
    }

    if (!form.post_name.trim()) {
      setError("Post Name is required.");
      setSaving(false);
      return;
    }

    if (!form.state.trim()) {
      setError("State is required.");
      setSaving(false);
      return;
    }

    if (!form.location.trim()) {
      setError("Location is required.");
      setSaving(false);
      return;
    }

    if (!form.qualification.trim()) {
      setError("Qualification is required.");
      setSaving(false);
      return;
    }

    if (!form.application_mode.trim()) {
      setError("Application Mode is required.");
      setSaving(false);
      return;
    }

    if (!form.start_date) {
      setError("Application Start Date is required.");
      setSaving(false);
      return;
    }

    if (!form.last_date) {
      setError("Last Date is required.");
      setSaving(false);
      return;
    }

    if (!form.apply_url.trim()) {
      setError("Apply URL is required.");
      setSaving(false);
      return;
    }

    if (
      form.total_vacancy &&
      !Number.isInteger(Number(form.total_vacancy))
    ) {
      setError("Total Vacancy must be a whole number.");
      setSaving(false);
      return;
    }

    if (
      form.age_starts &&
      !Number.isInteger(Number(form.age_starts))
    ) {
      setError("Starting Age must be a whole number.");
      setSaving(false);
      return;
    }

    const payload = {
      title: form.title.trim(),
      organization: form.organization.trim(),
      department: form.department.trim(),
      post_name: form.post_name.trim(),

      total_vacancy: form.total_vacancy
        ? Number(form.total_vacancy)
        : null,

      state: form.state.trim(),
      location: form.location.trim(),
      qualification: form.qualification.trim(),

      age_starts: form.age_starts
        ? Number(form.age_starts)
        : null,

      age_limit: form.age_limit.trim(),
      age_relaxation: form.age_relaxation.trim(),
      application_mode: form.application_mode.trim(),
      application_fee: form.application_fee.trim(),

      start_date: form.start_date || null,
      last_date: form.last_date || null,
      exam_date: form.exam_date || null,

      salary: form.salary.trim(),
      selection_process: form.selection_process.trim(),
      documents_required: form.documents_required.trim(),
      notification_url: form.notification_url.trim(),
      apply_url: form.apply_url.trim(),

      // Legacy / internal fields
      company: form.company.trim(),
      type: form.type.trim(),
      experience: form.experience.trim(),
      description: form.description.trim(),

      is_active: form.is_active,
    };

    if (editingId) {
      const { error } = await supabase
        .from("jobs")
        .update(payload)
        .eq("id", editingId);

      if (error) {
        setError(error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from("jobs")
        .insert(payload);

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
      .update({
        is_active: !job.is_active,
      })
      .eq("id", job.id);

    if (error) {
      setError(error.message);
      return;
    }

    loadJobs();
  }

  async function deleteJob(job: Job) {
    const confirmed = window.confirm(
      `Delete "${job.title}" at ${job.organization || job.company}? This cannot be undone.`
    );

    if (!confirmed) return;

    setError("");

    const { error } = await supabase
      .from("jobs")
      .delete()
      .eq("id", job.id);

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
              Add, edit and manage job opportunities.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: "10px",
              flexWrap: "wrap",
            }}
          >
            <Link
              href="/admin"
              className="button button-secondary"
            >
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
              gap: "24px",
              padding: "24px",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              background: "#ffffff",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "32px",
            }}
          >
            <div>
              <p className="eyebrow">
                {editingId ? "EDIT JOB" : "NEW JOB"}
              </p>

              <h2
                style={{
                  fontSize: "22px",
                  marginBottom: "4px",
                }}
              >
                {editingId ? "Edit Job" : "Add Job"}
              </h2>

              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                }}
              >
                Enter the recruitment information below.
              </p>
            </div>

            {/* BASIC INFORMATION */}
            <section
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  marginBottom: "2px",
                }}
              >
                Basic Information
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    Vacancy Name *
                  </label>

                  <input
                    className="form-input"
                    required
                    value={form.title}
                    onChange={(e) =>
                      updateField("title", e.target.value)
                    }
                    placeholder="e.g. SSC CGL Recruitment 2026"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Organization *
                  </label>

                  <input
                    className="form-input"
                    required
                    value={form.organization}
                    onChange={(e) =>
                      updateField(
                        "organization",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Staff Selection Commission"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Department
                  </label>

                  <input
                    className="form-input"
                    value={form.department}
                    onChange={(e) =>
                      updateField(
                        "department",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Ministry of Finance"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Post Name *
                  </label>

                  <input
                    className="form-input"
                    required
                    value={form.post_name}
                    onChange={(e) =>
                      updateField(
                        "post_name",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Combined Graduate Level"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Total Vacancy
                  </label>

                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    value={form.total_vacancy}
                    onChange={(e) =>
                      updateField(
                        "total_vacancy",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 500"
                  />
                </div>
              </div>
            </section>

            {/* LOCATION & ELIGIBILITY */}
            <section
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  marginBottom: "2px",
                }}
              >
                Location & Eligibility
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    State *
                  </label>

                  <input
                    className="form-input"
                    required
                    value={form.state}
                    onChange={(e) =>
                      updateField("state", e.target.value)
                    }
                    placeholder="e.g. Delhi"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Recruitment Location *
                  </label>

                  <input
                    className="form-input"
                    required
                    value={form.location}
                    onChange={(e) =>
                      updateField(
                        "location",
                        e.target.value
                      )
                    }
                    placeholder="e.g. All India"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Educational Qualification *
                  </label>

                  <input
                    className="form-input"
                    required
                    value={form.qualification}
                    onChange={(e) =>
                      updateField(
                        "qualification",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Graduation"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Starting Age
                  </label>

                  <input
                    className="form-input"
                    type="number"
                    min="0"
                    value={form.age_starts}
                    onChange={(e) =>
                      updateField(
                        "age_starts",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 18"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Age Limit
                  </label>

                  <input
                    className="form-input"
                    value={form.age_limit}
                    onChange={(e) =>
                      updateField(
                        "age_limit",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 18–27 years"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Age Relaxation
                  </label>

                  <input
                    className="form-input"
                    value={form.age_relaxation}
                    onChange={(e) =>
                      updateField(
                        "age_relaxation",
                        e.target.value
                      )
                    }
                    placeholder="e.g. As per government rules"
                  />
                </div>
              </div>
            </section>

            {/* APPLICATION DETAILS */}
            <section
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  marginBottom: "2px",
                }}
              >
                Application Details
              </h3>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: "14px",
                }}
              >
                <div className="form-group">
                  <label className="form-label">
                    Application Mode *
                  </label>

                  <select
                    className="form-input"
                    required
                    value={form.application_mode}
                    onChange={(e) =>
                      updateField(
                        "application_mode",
                        e.target.value
                      )
                    }
                  >
                    <option value="">
                      Select mode
                    </option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Application Fee
                  </label>

                  <input
                    className="form-input"
                    value={form.application_fee}
                    onChange={(e) =>
                      updateField(
                        "application_fee",
                        e.target.value
                      )
                    }
                    placeholder="e.g. ₹100 / Nil"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Application Start Date *
                  </label>

                  <input
                    className="form-input"
                    type="date"
                    required
                    value={form.start_date}
                    onChange={(e) =>
                      updateField(
                        "start_date",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Last Date *
                  </label>

                  <input
                    className="form-input"
                    type="date"
                    required
                    value={form.last_date}
                    onChange={(e) =>
                      updateField(
                        "last_date",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Exam Date
                  </label>

                  <input
                    className="form-input"
                    type="date"
                    value={form.exam_date}
                    onChange={(e) =>
                      updateField(
                        "exam_date",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            </section>

            {/* JOB DETAILS */}
            <section
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  marginBottom: "2px",
                }}
              >
                Job Details
              </h3>

              <div className="form-group">
                <label className="form-label">
                  Salary / Pay Scale
                </label>

                <input
                  className="form-input"
                  value={form.salary}
                  onChange={(e) =>
                    updateField("salary", e.target.value)
                  }
                  placeholder="e.g. ₹25,500 – ₹81,100"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Selection Process
                </label>

                <textarea
                  className="form-textarea"
                  rows={4}
                  value={form.selection_process}
                  onChange={(e) =>
                    updateField(
                      "selection_process",
                      e.target.value
                    )
                  }
                  placeholder="e.g. Written Exam → Skill Test → Document Verification"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Documents Required
                </label>

                <textarea
                  className="form-textarea"
                  rows={4}
                  value={form.documents_required}
                  onChange={(e) =>
                    updateField(
                      "documents_required",
                      e.target.value
                    )
                  }
                  placeholder="List the documents applicants need to submit."
                />
              </div>
            </section>

            {/* OFFICIAL LINKS */}
            <section
              style={{
                display: "grid",
                gap: "14px",
              }}
            >
              <h3
                style={{
                  fontSize: "16px",
                  marginBottom: "2px",
                }}
              >
                Official Links
              </h3>

              <div className="form-group">
                <label className="form-label">
                  Official Notification URL
                </label>

                <input
                  className="form-input"
                  type="url"
                  value={form.notification_url}
                  onChange={(e) =>
                    updateField(
                      "notification_url",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Apply URL *
                </label>

                <input
                  className="form-input"
                  type="url"
                  required
                  value={form.apply_url}
                  onChange={(e) =>
                    updateField(
                      "apply_url",
                      e.target.value
                    )
                  }
                  placeholder="https://..."
                />
              </div>
            </section>

            {/* LEGACY / INTERNAL FIELDS */}
            <section
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "20px",
              }}
            >
              <button
                type="button"
                className="button button-secondary"
                onClick={() =>
                  setShowLegacyFields(
                    !showLegacyFields
                  )
                }
              >
                {showLegacyFields
                  ? "Hide Legacy / Internal Fields"
                  : "Show Legacy / Internal Fields"}
              </button>

              {showLegacyFields && (
                <div
                  style={{
                    display: "grid",
                    gap: "14px",
                    marginTop: "18px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.6,
                    }}
                  >
                    These fields are retained for compatibility
                    with older Jobsera records and internal use.
                    They are optional.
                  </p>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: "14px",
                    }}
                  >
                    <div className="form-group">
                      <label className="form-label">
                        Company
                      </label>

                      <input
                        className="form-input"
                        value={form.company}
                        onChange={(e) =>
                          updateField(
                            "company",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Type
                      </label>

                      <input
                        className="form-input"
                        placeholder="Full-time / Internship / etc."
                        value={form.type}
                        onChange={(e) =>
                          updateField(
                            "type",
                            e.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Experience
                      </label>

                      <input
                        className="form-input"
                        value={form.experience}
                        onChange={(e) =>
                          updateField(
                            "experience",
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Description
                    </label>

                    <textarea
                      className="form-textarea"
                      rows={5}
                      value={form.description}
                      onChange={(e) =>
                        updateField(
                          "description",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </section>

            {/* PUBLISHING */}
            <section
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: "20px",
              }}
            >
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
                    updateField(
                      "is_active",
                      e.target.checked
                    )
                  }
                />

                Active — visible on the public jobs page
              </label>
            </section>

            {/* ACTIONS */}
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
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

        {/* EXISTING JOBS */}
        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs yet. Add your first one above.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
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
                      color: job.is_active
                        ? "#16a34a"
                        : "#94a3b8",
                      textTransform: "uppercase",
                      marginBottom: "4px",
                    }}
                  >
                    {job.is_active
                      ? "Active"
                      : "Inactive"}{" "}
                    · {job.organization || job.company}
                  </p>

                  <p
                    style={{
                      fontWeight: 700,
                    }}
                  >
                    {job.title}
                  </p>

                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {job.post_name || "Post not specified"}{" "}
                    · {job.state || "State not specified"} ·{" "}
                    {job.location}
                  </p>

                  {job.last_date && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "var(--text-secondary)",
                        marginTop: "4px",
                      }}
                    >
                      Last Date: {job.last_date}
                    </p>
                  )}
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() =>
                      toggleActive(job)
                    }
                  >
                    {job.is_active
                      ? "Deactivate"
                      : "Activate"}
                  </button>

                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={() =>
                      startEdit(job)
                    }
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="button button-secondary"
                    style={{
                      color: "#dc2626",
                    }}
                    onClick={() =>
                      deleteJob(job)
                    }
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
