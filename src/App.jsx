import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import EntryPoint from "./components/EntryPoint.jsx";
import ExportView from "./components/ExportView.jsx";

const App = () => {

  return (
      <Router>
          <Routes>
              <Route path="/" element={<EntryPoint />} />
              <Route path="/export" element={<ExportView />} />
          </Routes>
      </Router>
  )
}

export default App
