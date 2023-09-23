import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import InterCompetition from "./components/teamRegistration/interCompetition/interCompetiton";
import LandigPage from './pages/landingPage/LandigPage'
import About from './pages/about/About'
import Achievements from './pages/achievements/Achievements'

const App = () => {
  return (
    <>
      {/* <LandigPage/> */}
      {/* <About /> */}
      <Achievements />
       <Router>
        <Routes>
          <Route path="/interCompetiton" element={<InterCompetition />} />
        </Routes>
      </Router>
    </>
  )

export default App;
