import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getModeratorViolation, approveViolation, rejectViolation } from '../api/client';

function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US');
}

export default function SubmissionDetailModerator() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    getModeratorViolation(token, id)
      .then(setItem)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [token, id]);

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await approveViolation(token, id);
      navigate('/moderator');
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await rejectViolation(token, id);
      navigate('/moderator');
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error && !item) return <p className="error">{error}</p>;
  if (!item) return null;

  const isPending = item.status === 'pending';

  return (
    <>
      <p><Link to="/moderator">← Back to moderation list</Link></p>
      <div className="card">
        <h2 style={{ marginTop: 0 }}>{item.category}</h2>
        <span className={`status-badge status-${item.status}`}>{item.status}</span>
        <p style={{ color: '#6b7280', marginTop: '0.5rem' }}>
          Category: {item.category || '—'} · Date: {formatDate(item.dateTime)}
        </p>
        <p style={{ marginTop: '0.25rem' }}>Author: {item.firstName || '—'} ({item.userId?.email || '—'})</p>
        {item.photoUrl && (
          <p style={{ marginTop: '1rem' }}>
            <img src={item.photoUrl} alt="" className="submission-image" />
          </p>
        )}
        {item.description && (
          <p style={{ marginTop: '1rem', whiteSpace: 'pre-wrap' }}>{item.description}</p>
        )}
        {item.location?.lat != null && (
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#6b7280' }}>
            Coordinates: {item.location.lat.toFixed(5)}, {item.location.lng.toFixed(5)}
          </p>
        )}
        {isPending && (
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-success"
              onClick={handleApprove}
              disabled={actionLoading}
            >
              Approve
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleReject}
              disabled={actionLoading}
            >
              Reject
            </button>
          </div>
        )}
      </div>
    </>
  );
}
