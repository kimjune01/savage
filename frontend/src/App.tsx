import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SVGGenerator from './components/SVGGenerator';
import IconSetGenerator from './pages/IconSetGenerator';
import SVGAnalyzer from './pages/SVGAnalyzer';
import HumanPage from './pages/HumanPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<SVGGenerator />} />
          <Route path="icon-set" element={<IconSetGenerator />} />
          <Route path="analyze" element={<SVGAnalyzer />} />
          <Route path="human" element={<HumanPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
