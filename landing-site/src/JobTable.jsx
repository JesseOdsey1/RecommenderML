import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './JobTable.css'; // optional styling

const JobTable = (props) => {
  const [jobs, setJobs] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const excludedColumns = ['job_id', 'descriptions', 'subcategory'];

  useEffect(() => {
    fetch('/jobstreet_all_job_dataset.csv')
      .then((response) => response.text())
      .then((csvText) => {
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (result) => {
            const filtered = result.data.filter(
                props.typ=='Field Category'?
                (row) => row.category?.toLowerCase() == props.cat.toLowerCase()
                :
                (row) => row.role?.toLowerCase() == props.cat.toLowerCase()
            );
            setJobs(filtered);
          },
        });
      });
  }, []);

  const sortedJobs = React.useMemo(() => {
    if (!sortConfig.key) return jobs;

    return [...jobs].sort((a, b) => {
      const aVal = a[sortConfig.key]?.toLowerCase?.() || '';
      const bVal = b[sortConfig.key]?.toLowerCase?.() || '';

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [jobs, sortConfig]);

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const headers = jobs.length > 0
    ? Object.keys(jobs[0]).filter((key) => !excludedColumns.includes(key))
    : [];

  const paginatedJobs = sortedJobs.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const totalPages = Math.ceil(jobs.length / rowsPerPage);

  return (
    <div>
      <h2>Jobs List</h2>
      <table>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} onClick={() => handleSort(header)}>
                {header}
                {sortConfig.key === header && (sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedJobs.map((row, idx) => (
            <tr key={idx}>
              {headers.map((header) => (
                <td key={header}>{row[header]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default JobTable;
