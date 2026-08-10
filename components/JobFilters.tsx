"use client";

type JobFiltersProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function JobFilters({
  value,
  onChange,
}: JobFiltersProps) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        marginTop: "28px",
      }}
    >
      <div
        style={{
          flex: "1 1 280px",
          minWidth: 0,
        }}
      >
        <label
          htmlFor="job-search"
          className="form-label"
          style={{
            display: "block",
            marginBottom: "7px",
          }}
        >
          Search Jobs
        </label>

        <input
          id="job-search"
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Search by job, company, location or experience"
          className="form-input"
        />
      </div>

      {value && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <button
            type="button"
            className="button button-secondary"
            onClick={() => onChange("")}
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
