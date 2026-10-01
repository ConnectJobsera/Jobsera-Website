"use client";

import { useEffect, useState } from "react";
import { createClient } from "../lib/supabase/client";

type LinkTable = "job_links" | "blog_links";
type MatchColumn = "job_id" | "blog_id";

type Position = {
  key: string;
  label: string;
};

type LinkRow = {
  title: string;
  url: string;
};

const MAX_LINKS_PER_POSITION = 5;

function emptyRows(): LinkRow[] {
  return Array.from({ length: MAX_LINKS_PER_POSITION }, () => ({
    title: "",
    url: "",
  }));
}

export default function PostLinksEditor({
  table,
  matchColumn,
  matchValue,
  positions,
}: {
  table: LinkTable;
  matchColumn: MatchColumn;
  matchValue: string;
  positions: Position[];
}) {
  const supabase = createClient();

  const [rowsByPosition, setRowsByPosition] = useState<
    Record<string, LinkRow[]>
  >(() => {
    const initial: Record<string, LinkRow[]> = {};
    positions.forEach((p) => {
      initial[p.key] = emptyRows();
    });
    return initial;
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from(table)
        .select("position, sort_order, title, url")
        .eq(matchColumn, matchValue)
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      const next: Record<string, LinkRow[]> = {};
      positions.forEach((p) => {
        next[p.key] = emptyRows();
      });

      (data || []).forEach(
        (row: {
          position: string;
          sort_order: number;
          title: string;
          url: string;
        }) => {
          if (!next[row.position]) return;
          const index = row.sort_order;
          if (index >= 0 && index < MAX_LINKS_PER_POSITION) {
            next[row.position][index] = {
              title: row.title,
              url: row.url,
            };
          }
        }
      );

      setRowsByPosition(next);
      setLoading(false);
    }

    load();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [table, matchColumn, matchValue]);

  function updateRow(
    positionKey: string,
    index: number,
    field: keyof LinkRow,
    value: string
  ) {
    setRowsByPosition((prev) => {
      const updated = [...(prev[positionKey] || emptyRows())];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, [positionKey]: updated };
    });
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSavedMessage("");

    // Simplest reliable approach for a small, fixed set of rows per
    // position: replace everything for this post in one go rather than
    // diffing — delete existing rows for this post, then insert whichever
    // slots have both a title and a URL filled in.
    const { error: deleteError } = await supabase
      .from(table)
      .delete()
      .eq(matchColumn, matchValue);

    if (deleteError) {
      setError(deleteError.message);
      setSaving(false);
      return;
    }

    const rowsToInsert: Record<string, unknown>[] = [];

    positions.forEach((p) => {
      (rowsByPosition[p.key] || []).forEach((row, index) => {
        if (row.title.trim() && row.url.trim()) {
          rowsToInsert.push({
            [matchColumn]: matchValue,
            position: p.key,
            sort_order: index,
            title: row.title.trim(),
            url: row.url.trim(),
            is_active: true,
          });
        }
      });
    });

    if (rowsToInsert.length > 0) {
      const { error: insertError } = await supabase
        .from(table)
        .insert(rowsToInsert);

      if (insertError) {
        setError(insertError.message);
        setSaving(false);
        return;
      }
    }

    setSaving(false);
    setSavedMessage("Links saved.");
  }

  if (loading) {
    return (
      <p style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
        Loading links...
      </p>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "20px",
        padding: "18px",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        background: "var(--jobsera-blue-light)",
      }}
    >
      {error && (
        <p
          role="alert"
          style={{
            padding: "10px 12px",
            borderRadius: "8px",
            background: "#fff1f2",
            color: "#dc2626",
            fontSize: "13px",
          }}
        >
          {error}
        </p>
      )}

      {positions.map((p) => (
        <div key={p.key}>
          <p
            style={{
              fontSize: "13px",
              fontWeight: 700,
              marginBottom: "8px",
            }}
          >
            {p.label}{" "}
            <span
              style={{
                fontWeight: 400,
                color: "var(--text-secondary)",
              }}
            >
              (up to 5 links — leave title/URL blank to skip a slot)
            </span>
          </p>

          <div style={{ display: "grid", gap: "8px" }}>
            {(rowsByPosition[p.key] || emptyRows()).map((row, index) => (
              <div
                key={index}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1.4fr",
                  gap: "8px",
                }}
              >
                <input
                  className="form-input"
                  placeholder={`Link ${index + 1} title`}
                  value={row.title}
                  onChange={(e) =>
                    updateRow(p.key, index, "title", e.target.value)
                  }
                />
                <input
                  className="form-input"
                  placeholder="https://..."
                  value={row.url}
                  onChange={(e) =>
                    updateRow(p.key, index, "url", e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          type="button"
          className="button button-primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Links"}
        </button>

        {savedMessage && (
          <span style={{ fontSize: "13px", color: "#16a34a" }}>
            {savedMessage}
          </span>
        )}
      </div>
    </div>
  );
}
