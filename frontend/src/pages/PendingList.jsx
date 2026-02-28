import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {getApprovedViolations, getPendingViolations} from '../api/client';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US');
}

export default function PendingList() {
  const { token } = useAuth();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    //console.log(getApprovedViolations(token));

    getPendingViolations()
      .then(setList)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <>
      <h1>Submissions for moderation</h1>
      <p style={{ color: '#6b7280', marginBottom: '1rem' }}>List of submissions with status «pending». Approve or reject.</p>
      {list.length === 0 ? (
        <div className="card">No submissions to review.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {list.map((item) => (
            <li key={item._id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div>
                        <strong>{item.category}</strong>
                        {item.category && <span className="status-badge status-approved" style={{ marginLeft: '0.5rem' }}>{item.category}</span>}
                        <p style={{ margin: '0.25rem 0 0', color: '#6b7280', fontSize: '0.9rem' }}>

                            {formatDate(item.dateTime)}
                            · {item.firstName || 'User'}
                        </p>
                    </div>
                <Link to={`/moderator/submissions/${item._id}`} className="btn btn-primary">View</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
