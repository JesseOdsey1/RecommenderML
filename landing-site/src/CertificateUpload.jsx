import React, { useState, useRef, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import './CertificateUpload.css';

const CertificateUpload = ({ onExtractedTextsChange }) => {
  const [certificates, setCertificates] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extractingText, setExtractingText] = useState(false);
  const [extractedTexts, setExtractedTexts] = useState({});
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
    );

    if (validFiles.length === 0) {
      alert('Please select valid image files (JPEG, PNG, or WebP)');
      return;
    }

    const newCertificates = validFiles.map(file => ({
      id: Date.now() + Math.random(),
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file),
      uploaded: false
    }));

    setCertificates(prev => [...prev, ...newCertificates]);
    
    // Automatically extract text from new certificates
    newCertificates.forEach(cert => {
      extractTextFromImage(cert.file, cert.id);
    });
  };

  const removeCertificate = (id) => {
    setCertificates(prev => {
      const cert = prev.find(c => c.id === id);
      if (cert && cert.preview) {
        URL.revokeObjectURL(cert.preview);
      }
      return prev.filter(c => c.id !== id);
    });
  };

  const uploadCertificates = async () => {
    if (certificates.length === 0) {
      alert('No certificates to upload');
      return;
    }

    setUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCertificates(prev => 
        prev.map(cert => ({ ...cert, uploaded: true }))
      );
      
      alert('Certificates uploaded successfully!');
    } catch (error) {
      alert('Error uploading certificates. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Notify parent component when extracted texts change
  useEffect(() => {
    if (onExtractedTextsChange) {
      onExtractedTextsChange(extractedTexts);
    }
  }, [extractedTexts, onExtractedTextsChange]);

  const extractTextFromImage = async (file, certificateId) => {
    try {
      setExtractingText(true);
      
      const worker = await createWorker('eng');
      
      const { data: { text } } = await worker.recognize(file);
      
      // Clean the extracted text by removing numbers and dates
      let cleanedText = text.trim();
      
      // Remove dates in various formats (e.g., "10 Aug, 2025", "2025-08-10", "08/10/2025")
      cleanedText = cleanedText.replace(/\b\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*,?\s*\d{4}\b/gi, '');
      cleanedText = cleanedText.replace(/\b\d{4}-\d{1,2}-\d{1,2}\b/g, '');
      cleanedText = cleanedText.replace(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/g, '');
      cleanedText = cleanedText.replace(/\b\d{1,2}-\d{1,2}-\d{4}\b/g, '');
      
      // Remove standalone numbers and IDs (e.g., "ID: FC5D36E0979E", "2025", "10", "08")
      cleanedText = cleanedText.replace(/\bID:\s*[A-Z0-9]+\b/gi, '');
      cleanedText = cleanedText.replace(/\b\d{4}\b/g, ''); // Remove 4-digit years
      cleanedText = cleanedText.replace(/\b\d{1,2}\b/g, ''); // Remove 1-2 digit numbers
      
      // Remove "Earned on:" text and similar date-related phrases
      cleanedText = cleanedText.replace(/\bEarned\s+on:\s*/gi, '');
      cleanedText = cleanedText.replace(/\bDate:\s*/gi, '');
      cleanedText = cleanedText.replace(/\bIssued\s+on:\s*/gi, '');
      
      // Remove names and personal information
      cleanedText = cleanedText.replace(/\bPRESENTED\s+TO\s*:?\s*\n?/gi, ''); // Remove "PRESENTED TO:" label
      cleanedText = cleanedText.replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\s+[A-Z][a-z]*\b/g, ''); // Remove full names (3+ words)
      cleanedText = cleanedText.replace(/\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g, ''); // Remove first and last names
      cleanedText = cleanedText.replace(/\b[A-Z][a-z]+\s+[A-Z]\b/g, ''); // Remove first name + initial
      cleanedText = cleanedText.replace(/\b[A-Z]\s+[A-Z][a-z]+\b/g, ''); // Remove initial + last name
      
      // Remove common titles and positions
      cleanedText = cleanedText.replace(/\b(?:CTO|CEO|CFO|COO|VP|Director|Manager|Coordinator|Instructor|Professor|Dr\.|Mr\.|Ms\.|Mrs\.)\s*,?\s*[A-Z][a-z]+\s*[A-Z][a-z]*\b/gi, '');
      
      // Remove all non-alphabetic characters (keep only letters and spaces)
      cleanedText = cleanedText.replace(/[^a-zA-Z\s]/g, '');
      
      // Remove single letters separated by spaces (e.g., "A", "B", "C")
      cleanedText = cleanedText.replace(/\b[A-Za-z]\b/g, '');
      
      // Clean up extra whitespace and empty lines
      cleanedText = cleanedText
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s*\n/g, '\n') // Remove empty lines
        .replace(/^\s+|\s+$/g, '') // Remove leading/trailing whitespace
        .trim();
      
      setExtractedTexts(prev => ({
        ...prev,
        [certificateId]: cleanedText
      }));
      
      await worker.terminate();
      
      return cleanedText;
    } catch (error) {
      console.error('Error extracting text:', error);
      setExtractedTexts(prev => ({
        ...prev,
        [certificateId]: 'Error extracting text from image'
      }));
      return 'Error extracting text from image';
    } finally {
      setExtractingText(false);
    }
  };



  return (
    <div className="certificate-upload-container">
      <div className="upload-header">
        <h2>Upload Your Certificates</h2>
        <p>Add your professional certifications and achievements to enhance your profile</p>
      </div>

      <div 
        className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="upload-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <h3>Drag & Drop your certificates here</h3>
        <p>or click to browse files</p>
        <p className="file-types">Supported formats: JPEG, PNG, WebP</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      {certificates.length > 0 && (
        <div className="certificates-list">
          <div className="list-header">
            <h3>Selected Certificates ({certificates.length})</h3>
                <div className="action-buttons">
             </div>
          </div>
          
          <div className="certificates-grid">
            {certificates.map((cert) => (
              <div key={cert.id} className={`certificate-item ${cert.uploaded ? 'uploaded' : ''}`}>
                <div className="certificate-preview">
                  <img src={cert.preview} alt={cert.name} />
                  {cert.uploaded && (
                    <div className="upload-success">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="20,6 9,17 4,12"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="certificate-info">
                  <h4>{cert.name}</h4>
                  <p>{formatFileSize(cert.size)}</p>
                                     <div className="certificate-actions">
                     <button 
                       className="remove-btn"
                       onClick={() => removeCertificate(cert.id)}
                     >
                       Remove
                     </button>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="upload-tips">
        <h4>Tips for better results:</h4>
        <ul>
          <li>Ensure certificates are clearly readable</li>
          <li>Use high-quality images (minimum 800x600 pixels)</li>
          <li>Include the full certificate in the image</li>
          <li>Make sure text is not cut off</li>
        </ul>
      </div>
    </div>
  );
};

export default CertificateUpload;
