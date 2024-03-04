import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import HomePage from './components/HomePage';
import AutoROIFormBuilder from './components/AutoROIFormBuilder/AutoROIFormBuilder.component';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/main" element={<AutoROIFormBuilder />} />
      </Routes>
    </Router>
  );
};

export default App;
