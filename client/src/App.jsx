import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import InterCompetition from "./components/teamRegistration/interCompetition/interCompetiton";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/interCompetiton" element={<InterCompetition />} />
      </Routes>
    </Router>
  );
}

export default App;
