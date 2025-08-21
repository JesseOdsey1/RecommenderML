import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const JobClassifier = ({ items = [], combinedText = '' }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [results2, setResults2] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJobClick = (jobData, type) => {
    navigate('/job-details', {
      state: {
        jobData: {
          ...jobData,
          type: type
        }
      }
    });
  };

  


  
  useEffect(() => {

    // Use combined text if available, otherwise fall back to just skills/interests
    const text = combinedText || items.join(' ').trim();
    if (!text) {
      setError('Add interests/skills or upload certificates first');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await axios.post('http://localhost:8000/predict', {
          text,
        });

        const payload = res.data;
        if (payload && Array.isArray(payload.results)) {
          setResults(payload.results);
        } else {
          setResults([]);
          setError('Unexpected response from server');
        }


        const res2 = await axios.post('http://localhost:8000/predict2', {
          text,
        });

        const payload2 = res2.data;
        if (payload2 && Array.isArray(payload2.results)) {
          setResults2(payload2.results);
        } else {
          setResults2([]);
          setError('Unexpected response from server');
        }


      } catch (err) {
        console.error("Error fetching prediction", err);
        setError('Error predicting job categories');
      }
      finally {
        setLoading(false);
      }
      
    };
    fetchData();
  },[]);

  return (
    <div>
      <h2>Job Description Classifier</h2>
      {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
      <p>Click on the buttons below to check out jobs</p>

      {results.length > 0 && (
        <div style={{ marginTop: '1rem', textAlign: 'left', maxWidth: 600, marginInline: 'auto' }}>
          <h3>Top 5 Field Results</h3>
          <ol>
            {results.map((r, i) => (
              <li 
                className="Results" 
                key={`${r.categoryId}-${i}`}
                onClick={() => handleJobClick(r, 'Field Category')}
                style={{
                  cursor: 'pointer',
                  padding: '0.5rem',
                  margin: '0.25rem 0',
                  borderRadius: '0.25rem',
                  transition: 'background-color 0.2s',
                  backgroundColor: '#9dbaf5ff',
                  border: ".25px solid grey"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#9dbaf5ff';
                }}
              >
                <strong>{r.category}</strong> — {(r.confidence * 100).toFixed(2)}%
              </li>
            ))}
          </ol>
        </div>
      )}

      {results2.length > 0 && (
            <div style={{ marginTop: '1rem', textAlign: 'left', maxWidth: 600, marginInline: 'auto' }}>
              <h3>Top 5 Job Results </h3>
              <ol>
                {results2.map((r, i) => (
                  <li 
                    key={`${r.categoryId}-${i}`}
                    onClick={() => handleJobClick(r, 'Job Title')}
                    style={{
                      cursor: 'pointer',
                      padding: '0.5rem',
                      margin: '0.25rem 0',
                      borderRadius: '0.25rem',
                      transition: 'background-color 0.2s',
                      backgroundColor: '#9dbaf5ff',
                      border: ".25px solid grey"
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#f3f4f6';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#9dbaf5ff';
                    }}
                  >
                    <strong>{r.category}</strong> — {(r.confidence * 100).toFixed(2)}%
                  </li>
                ))}
              </ol>
            </div>
          )}

    </div>
  );
};

export default JobClassifier;
