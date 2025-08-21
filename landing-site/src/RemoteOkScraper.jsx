import React, { useEffect, useState } from "react";

const PROXY = "https://api.allorigins.win/raw?url=";
const REMOTEOK_API = "https://remoteok.io/api";

const ITEMS_PER_PAGE = 20;
const MAX_PAGES = 5;

const RemoteOkScraper = () => {
  const [jobs, setJobs] = useState([]);
  const [positionFilter, setPositionFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch jobs with filter
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    setCurrentPage(1); // reset to first page when filter changes
    try {
      const response = await fetch(PROXY + encodeURIComponent(REMOTEOK_API));
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const data = await response.json();

      // First element is metadata, skip it
      let jobData = data.slice(1);

      // Filter by position (case insensitive)
      jobData = jobData.filter((job) =>
        job.position.toLowerCase().includes(positionFilter.toLowerCase())
      );

      // Remove incomplete jobs (any missing required fields)
      jobData = jobData.filter(
        (job) =>
          job.company &&
          job.position &&
          job.tags &&
          Array.isArray(job.tags) &&
          job.tags.length > 0 &&
          (job.location !== undefined && job.location !== null && job.location !== "")
      );

      setJobs(jobData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when position filter changes
  useEffect(() => {
    fetchJobs();
  }, [positionFilter]);

  // Pagination logic
  const totalPages = Math.min(
    MAX_PAGES,
    Math.ceil(jobs.length / ITEMS_PER_PAGE)
  );

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentJobs = jobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Handlers
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>RemoteOK Job Scraper</h2>

      <input
        type="text"
        placeholder="Filter by position..."
        value={positionFilter}
        onChange={(e) => setPositionFilter(e.target.value)}
        style={{ padding: "8px", width: "300px", marginBottom: "20px" }}
      />

      {loading && <p>Loading jobs...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {!loading && !error && (
        <>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              maxWidth: "1000px",
              marginBottom: "20px",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Company
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Position
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Tags
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Location
                </th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ padding: "10px", textAlign: "center" }}>
                    No jobs found
                  </td>
                </tr>
              )}
              {currentJobs.map((job) => (
                <tr key={job.id}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {job.company}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {job.position}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {job.tags.join(", ")}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {job.location || "Remote"}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <button
                      onClick={() => window.open(job.url, "_blank")}
                      style={{
                        padding: "6px 12px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      View Job
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                style={{
                  margin: "0 5px",
                  padding: "6px 12px",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                }}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    style={{
                      margin: "0 3px",
                      padding: "6px 12px",
                      fontWeight: page === currentPage ? "bold" : "normal",
                      backgroundColor: page === currentPage ? "#007bff" : "",
                      color: page === currentPage ? "white" : "",
                      borderRadius: "4px",
                      border: "1px solid #ddd",
                      cursor: "pointer",
                    }}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                style={{
                  margin: "0 5px",
                  padding: "6px 12px",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RemoteOkScraper;