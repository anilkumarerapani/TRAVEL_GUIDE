import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <section className="hero">
      <div className="card">
        <h1>FairFare helps travelers avoid unfair auto fares.</h1>
        <p>
          In many small towns, arriving travelers are overcharged because local fares are not easy to know.
          FairFare makes it simple to look up a route and share what you actually paid.
        </p>

        <div className="actions">
          <Link to="/search" className="btn btn-primary">
            Find a Fare
          </Link>
          <Link to="/submit" className="btn btn-secondary">
            Report a Fare
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>How it works</h2>
        <p className="small">
          Search by station or landmark, then use the shared fare range to make a fair choice.
          If no route exists yet, add the route yourself in a few taps.
        </p>
      </div>
    </section>
  );
}

export default HomePage;
