"use client";

export type LinkRow = {
  title: string;
  url: string;
};

export const MAX_LINKS_PER_POSITION = 5;

export function emptyLinkRows(): LinkRow[] {
  return Array.from({ length: MAX_LINKS_PER_POSITION }, () => ({
    title: "",
    url: "",
  }));
}

// Purely controlled/presentational — no data fetching or saving of its own.
// The parent form owns the state and persists it together with the rest of
// the job/blog when the main form is submitted, so link fields behave
// exactly like every other optional field: fill in as many (or as few, or
// zero) of the 5 slots as you like, nothing here is required to publish.
export default function LinkRowsFields({
  label,
  rows,
  onChange,
}: {
  label: string;
  rows: LinkRow[];
  onChange: (rows: LinkRow[]) => void;
}) {
  function updateRow(index: number, field: keyof LinkRow, value: string) {
    const updated = [...rows];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: "8px",
        padding: "16px",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        background: "var(--jobsera-blue-light)",
      }}
    >
      <p style={{ fontSize: "13px", fontWeight: 700 }}>
        {label}{" "}
        <span style={{ fontWeight: 400, color: "var(--text-secondary)" }}>
          (up to 5 links, optional — leave title/URL blank to skip a slot)
        </span>
      </p>

      {rows.map((row, index) => (
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
            onChange={(e) => updateRow(index, "title", e.target.value)}
          />
          <input
            className="form-input"
            placeholder="https://..."
            value={row.url}
            onChange={(e) => updateRow(index, "url", e.target.value)}
          />
        </div>
      ))}
    </div>
  );
}
