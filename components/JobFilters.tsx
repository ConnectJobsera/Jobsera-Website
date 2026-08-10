"use client";

import { useState } from "react";

type JobFiltersProps = {
  onSearch?: (query: string) => void;
};

export default function JobFilters({ onSearch }: JobFiltersProps) {
  const [query, setQuery] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch?.(query.trim());
  }

  return (
    <form className="job-filters" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="job-search" className="form-label">
          Search opportunities
        </label>

        <div className="job-search-row">
          <input
            id="job-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Job title, company or keyword"
            className="form-input"
          />

          <button type="submit" className="button button-primary">
            Search
          </button>
        </div>
      </div>
    </form>
  );
}
