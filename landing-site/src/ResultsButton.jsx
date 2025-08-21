import React from 'react';
import { useNavigate } from 'react-router-dom';


function ResultsButton({ items = [], extractedTexts = {} }) {
    const navigate = useNavigate();
    
    const handleClick = () => {
        // Concatenate all extracted texts
        const allExtractedText = Object.values(extractedTexts).join(' ');
        
        // Concatenate skills/interests
        const allSkills = items.join(' ');
        
        // Combine both into one comprehensive text
        const combinedText = `${allSkills} ${allExtractedText}`.trim();
        
        // Navigate to results page with combined data
        navigate('/new-page', { 
            state: { 
                items,
                extractedTexts,
                combinedText
            } 
        });
    };
    
	return (
		<button
          style={{
            background: '#6d28d9',
            color: '#fff',
            border: 'none',
            borderRadius: '999px',
            padding: '0.8rem 2rem',
            fontSize: '1.1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          Find Jobs
        </button>
        
	);
}
  

export default ResultsButton;

