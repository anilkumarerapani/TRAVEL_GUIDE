import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { searchRoutes } from '../services/routeService';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const runSearch = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const data = await searchRoutes(query);
        setResults(data);
      } finally {
        setLoading(false);
      }
    };

    const timer = window.setTimeout(runSearch, 250);
    return () => window.clearTimeout(timer);
  }, [query]);

  return (
    <section className="card">
      <h2>Find a route fare</h2>
      <p className="small">Search by station name, bus stand, or town to see the latest shared fares.</p>

      <label>
        Search route
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="e.g. Vijayawada Railway Station"
        />
      </label>

      {loading && <p className="small">Looking up routes…</p>}

      {!loading && !query && <p className="small">Type a place name to begin.</p>}

      {!loading && query && results.length === 0 && (
        <div className="empty-state">
          <h3>No data yet for this route</h3>
          <p>Be the first to report it and help the next traveler.</p>
          <Link to="/submit" className="btn btn-primary">
            Report this route
          </Link>
        </div>
      )}

      <div className="result-list">
        {results.map((route) => (
          <article key={route.id} className="result-card">
            <h3>{route.fromLocation} → {route.toLocation}</h3>
            <div className="result-meta">
              <span>Distance: {route.distanceKm || '—'} km</span>
              <span>Fare: ₹{route.fairFareMin}–₹{route.fairFareMax}</span>
            </div>
            <div className="result-meta">
              <span>{route.reportCount || 0} reports</span>
              <span>{route.town || 'Unknown town'}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default SearchPage;
