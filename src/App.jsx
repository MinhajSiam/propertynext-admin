import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Leads from './pages/Leads';
import Blogs from './pages/Blogs';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/blogs" element={<Blogs />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;