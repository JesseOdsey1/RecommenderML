import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import JobClassifier from './JobClassifier';

function Results() {
	const location = useLocation();
	const items = location.state?.items ?? [];
	const extractedTexts = location.state?.extractedTexts ?? {};
	const combinedText = location.state?.combinedText ?? '';

	return (
		<div style={{ padding: '2rem', textAlign: 'center' }}>
			<h1>Results</h1>
			
			{/* Skills and Interests Section */}
			{items.length === 0 ? (
				<p>No interests or skills provided.</p>
			) : (
				<div style={{ maxWidth: 600, margin: '1rem auto', textAlign: 'left', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb', boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
					<h3>Selected interests/skills:</h3>
					<ul>
						{items.map((it, idx) => (
							<li key={idx}>{it}</li>
						))}
					</ul>
				</div>
			)}
			
			{/* Certificate Extracted Text Section */}
			{Object.keys(extractedTexts).length > 0 && (
				<div style={{ maxWidth: 600, margin: '1rem auto', textAlign: 'left' }}>
					<h3>Certificate Information:</h3>
					{Object.entries(extractedTexts).map(([id, text]) => (
						<div key={id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', backgroundColor: '#f9fafb', boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
							<h2>Certificate {id.slice(-4)}:</h2>
							
						</div>
					))}
				</div>
			)}
			
			{/* Pass combined text to JobClassifier for better job matching */}
			<JobClassifier items={items} combinedText={combinedText}/>

			<div style={{ marginTop: '1.5rem' }}>
				<Link to="/" style={{ color: '#6d28d9', fontWeight: 'bold' }}>Back</Link>
			</div>
		</div>
	);
}

export default Results;


