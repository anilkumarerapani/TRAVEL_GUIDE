import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { submitFare } from '../services/routeService';

function SubmitPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fromLocation: '',
    toLocation: '',
    distanceKm: '',
    farePaid: '',
    town: '',
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.fromLocation || !form.toLocation || !form.distanceKm || !form.farePaid) {
      setStatus('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setStatus('');

    try {
      await submitFare(form);
      setStatus('Thank you! Your fare has been shared.');
      setForm({ fromLocation: '', toLocation: '', distanceKm: '', farePaid: '', town: '' });
      setTimeout(() => navigate('/search'), 800);
    } catch (error) {
      console.error(error);
      setStatus('Something went wrong while saving. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card">
      <h2>Report a fare</h2>
      <p className="small">Share the route and what you paid so other travelers can see a fair range.</p>

      <form onSubmit={handleSubmit} className="form-grid">
        <label>
          From
          <input name="fromLocation" value={form.fromLocation} onChange={handleChange} placeholder="e.g. Railway Station" />
        </label>

        <label>
          To
          <input name="toLocation" value={form.toLocation} onChange={handleChange} placeholder="e.g. Bus Stand" />
        </label>

        <label>
          Town
          <input name="town" value={form.town} onChange={handleChange} placeholder="e.g. Vijayawada" />
        </label>

        <label>
          Distance (km)
          <input name="distanceKm" type="number" value={form.distanceKm} onChange={handleChange} placeholder="3.5" />
        </label>

        <label>
          Fare paid (₹)
          <input name="farePaid" type="number" value={form.farePaid} onChange={handleChange} placeholder="80" />
        </label>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Submit fare'}
        </button>
      </form>

      {status ? <p className="small" style={{ marginTop: 12 }}>{status}</p> : null}
    </section>
  );
}

export default SubmitPage;
