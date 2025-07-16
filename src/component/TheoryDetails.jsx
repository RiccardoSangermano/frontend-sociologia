
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';


const TheoryDetail = () => {
  const { id } = useParams();
  const [theory, setTheory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTheoryDetail = () => {
      setLoading(true);
      setError(null);

      fetch(`http://localhost:8080/api/theories/${id}`)
        .then(response => {
          if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Theory not found.");
            }
            throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);
          }
          return response.json();
        })
        .then(data => {
          console.log("Full API response for detail (data object):", data);
          setTheory(data);
        })
        .catch(err => {
          console.error("Error loading theory details:", err);
          setError(err.message || "Unable to load theory details. Please try again later.");
        })
        .finally(() => {
          setLoading(false);
        });
    };

    fetchTheoryDetail();
  }, [id]);

  if (loading) {
    return <p>Loading theory details...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!theory) {
    return <p>Theory not found.</p>;
  }

  return (
    <div className="theory-detail-container">
      <h2 className="theory-title">{theory.nomeTeoria}</h2>

      <div className="author-info">
        <p><strong>Author:</strong> {theory.autore}</p>
        {theory.immagineAutoreUrl && (
          <div className="author-image-container">
            <img
              src={theory.immagineAutoreUrl}
              alt={`Image of ${theory.autore}`}
              className="author-image"
            />
          </div>
        )}
      </div>

      <div className="theory-section">
        <h3>Explanation:</h3>
        <p>{theory.spiegazione}</p>
      </div>

      {theory.concettiChiave && theory.concettiChiave.length > 0 && (
        <div className="theory-section">
          <h4>Key Concepts:</h4>
          <ul>
            {theory.concettiChiave.map((concept, index) => (
              <li key={index}>{concept}</li>
            ))}
          </ul>
        </div>
      )}

      {theory.esempioApplicazioneModerna && (
        <div className="theory-section">
          <h4>Modern Application Example:</h4>
          <p>{theory.esempioApplicazioneModerna}</p>
        </div>
      )}

      <button className="back-button" onClick={() => window.history.back()}>Back to Theories</button>
    </div>
  );
};

export default TheoryDetail;