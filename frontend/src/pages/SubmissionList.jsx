import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApprovedViolations } from '../api/client';

function formatDate(d) {
  if (!d) return '—';
  const date = new Date(d);
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function SubmissionList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    getApprovedViolations()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1>Approved submissions</h1>
      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>Only submissions with status «approved» are shown.</p>
      {list.length === 0 ? (
        <div className="card">No submissions yet.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {list.map((item) => (
            <li key={item.id} className="card">
              <Link to={`/submissions/${item.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <strong>{item.category}</strong>
                    {item.category && <span className="status-badge status-approved" style={{ marginLeft: '0.5rem' }}>{item.category}</span>}
                    <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>

                      {formatDate(item.dateTime)}
                          · {item.firstName || 'User'}
                    </p>
                  </div>
                  <span style={{ color: '#2563eb' }}>Details →</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
