import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects'; // নতুন পেজ ইম্পোর্ট করা হলো

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} /> {/* নতুন রাউট */}
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;