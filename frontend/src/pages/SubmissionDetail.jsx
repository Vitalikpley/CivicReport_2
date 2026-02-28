import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getViolationById } from '../api/client';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US');
}

export default function SubmissionDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getViolationById(id)
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!item) return null;

  return (
    <>
      <p><Link to="/">← Back to list</Link></p>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{item.category}</h2>
        {item.category && <span className="status-badge status-approved">{item.category}</span>}
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>Date: {formatDate(item.dateTime)} · Author: {item.firstName || '—'}</p>
        {item.photoUrl && (
          <p style={{ marginTop: '1rem' }}>
            <img src={item.photoUrl} alt="" className="submission-image" />
          </p>
        )}
        {item.description && <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{item.description}</p>}
        {item.location?.lat != null && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
            Coordinates: {item.location.lat.toFixed(5)}, {item.location.lng.toFixed(5)}
          </p>
        )}
      </div>
    </>
  );
}
