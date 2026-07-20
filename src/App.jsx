import { NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import SubmitPage from './pages/SubmitPage';

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand">
          FairFare
        </NavLink>

        <nav className="nav-links" aria-label="Primary navigation">
          <NavLink to="/search">Find a Fare</NavLink>
          <NavLink to="/submit">Report a Fare</NavLink>
        </nav>
      </header>

      <main className="page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/submit" element={<SubmitPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
