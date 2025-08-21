import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import InterestsSkills from './InterestsSkills';
import Results from './Results';
import ResultsButton from './ResultsButton';
import CertificateUpload from './CertificateUpload';
import JobDetails from './JobDetails';

function LandingPage() {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [extractedTexts, setExtractedTexts] = useState({});
  
  const handleExtractedTextsChange = (texts) => {
    setExtractedTexts(texts);
  };
  
  return (
    <>
        <div className='cont' style={{  background: "#fff", border: "1px hidden grey", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", borderRadius: "2rem", width:"50%", textAlign:"center", margin: "0 auto", marginBottom:"1rem", paddingBottom:1}}>
          <h1 style={{ textAlign: 'center', marginTop: '3rem', fontSize: '2.5rem', fontWeight: 'bold', color: '#6d28d9'}}>Job Recommender</h1>
          <InterestsSkills items={selectedItems} setItems={setSelectedItems} />
          <CertificateUpload onExtractedTextsChange={handleExtractedTextsChange} />
      </div>
      <div style={{ position: 'fixed', bottom: 0, width: '100%', textAlign: 'center', padding: '1rem', background: 'linear-gradient(135deg,rgb(212, 234, 255) 0%,rgb(174, 196, 223) 100%)', borderTop: '1px solid #e5e7eb', zIndex: 100 }}>
            <ResultsButton items={selectedItems} extractedTexts={extractedTexts} />
          </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/new-page" element={<Results />} />
        <Route path="/job-details" element={<JobDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
