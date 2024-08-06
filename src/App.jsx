import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import EntryPoint from "./components/EntryPoint.jsx";
import ExportView from "./components/ExportView.jsx";
import UserProfileOnTeams from "./components/UserProfileOnTeams.jsx";

const App = () => {

  return (
      <Router>
          <Routes>
              <Route path="/" element={<EntryPoint />} />
              <Route path="/export" element={<ExportView />} />
              <Route path="/teams" element={<UserProfileOnTeams />} />
          </Routes>
      </Router>
  )
}

export default App
