import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import JobTable from './JobTable.jsx';

function JobDetails() {
  const location = useLocation();
  const jobData = location.state?.jobData;

  if (!jobData) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Job Details</h1>
        <p>No job data available.</p>
        <Link to="/new-page" style={{ color: '#6d28d9', fontWeight: 'bold' }}>Back to Results</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Job Details</h1>
      
      <div style={{ maxWidth: 800, margin: '2rem auto', textAlign: 'left', padding: '2rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb' }}>
        <h2 style={{ color: '#6d28d9', marginBottom: '1rem' }}>{jobData.category}</h2>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Confidence Level</h3>
          <div style={{ 
            width: '100%', 
            backgroundColor: '#e5e7eb', 
            borderRadius: '0.5rem', 
            height: '1.5rem',
            position: 'relative'
          }}>
            <div style={{
              width: `${jobData.confidence * 100}%`,
              backgroundColor: '#6d28d9',
              height: '100%',
              borderRadius: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>
              {(jobData.confidence * 100).toFixed(2)}%
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#374151', marginBottom: '0.5rem' }}>Category Type</h3>
          <p style={{ color: '#6b7280' }}>{jobData.type || 'Job Category'}</p>
        </div>

      </div>

        <div>
          <JobTable typ={jobData.type} cat={jobData.category} />
        </div>

        <div style={{ marginTop: '2rem' }}>
            <Link 
            to="/new-page" 
            style={{ 
                color: '#6d28d9', 
                fontWeight: 'bold',
                textDecoration: 'none',
                padding: '0.75rem 1.5rem',
                border: '2px solid #6d28d9',
                borderRadius: '0.5rem',
                display: 'inline-block',
                transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
                e.target.style.backgroundColor = '#6d28d9';
                e.target.style.color = 'white';
            }}
            onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6d28d9';
            }}
            >
            Back to Results
            </Link>
        </div>

    </div>
  );
}

export default JobDetails;
